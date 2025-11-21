import * as THREE from 'three'
import type { CityNode, ProcessedNodeData } from '@/types'
import { COLORS, BUILDING_HEIGHT_SCALE, BUILDING_WIDTH_SCALE } from '@/utils/city/constants'

const geometryCache = new Map<string, THREE.BoxGeometry>()
const edgesCache = new Map<string, Float32Array>()

const edgesToMerge: Array<{
  positions: Float32Array
  matrix: THREE.Matrix4
}> = []

const colorDataMap = new Map<string, { color: number; intensity: number }>()

export interface InstanceData {
  node: CityNode
  mesh: THREE.InstancedMesh
  instanceIndex: number
  type: string
}

interface InstanceGroupData {
  buildings: Array<{
    node: CityNode
    matrix: THREE.Matrix4
    index: number
  }>
}

const instanceGroups = new Map<string, InstanceGroupData>()

// ========== TWORZENIE GEOMETRII ==========
export function collectEdges(geometry: THREE.BoxGeometry, x: number, y: number, z: number): void {
  const params = geometry.parameters
  const cacheKey = `${params.width}_${params.height}_${params.depth}`

  let filteredPositions = edgesCache.get(cacheKey)

  // Jeśli nie ma w cache, oblicz raz
  if (!filteredPositions) {
    const edges = new THREE.EdgesGeometry(geometry)
    const positions = edges.attributes.position.array as Float32Array
    const filtered: number[] = []

    let minY = Infinity
    for (let i = 1; i < positions.length; i += 3) {
      minY = Math.min(minY, positions[i])
    }

    const tolerance = 0.001
    for (let i = 0; i < positions.length; i += 6) {
      const y1 = positions[i + 1]
      const y2 = positions[i + 4]

      if (Math.abs(y1 - minY) > tolerance || Math.abs(y2 - minY) > tolerance) {
        filtered.push(
          positions[i],
          positions[i + 1],
          positions[i + 2],
          positions[i + 3],
          positions[i + 4],
          positions[i + 5]
        )
      }
    }

    filteredPositions = new Float32Array(filtered)
    edgesCache.set(cacheKey, filteredPositions)
    edges.dispose()
  }

  const matrix = new THREE.Matrix4()
  matrix.setPosition(x, y, z)

  edgesToMerge.push({
    positions: filteredPositions,
    matrix,
  })
}

export function createMergedEdges(): THREE.LineSegments {
  let totalVertices = 0
  edgesToMerge.forEach((edge) => {
    totalVertices += edge.positions.length
  })

  const mergedPositions = new Float32Array(totalVertices)
  let offset = 0

  edgesToMerge.forEach((edge) => {
    const vertex = new THREE.Vector3()

    for (let i = 0; i < edge.positions.length; i += 3) {
      vertex.set(edge.positions[i], edge.positions[i + 1], edge.positions[i + 2])
      vertex.applyMatrix4(edge.matrix)

      mergedPositions[offset++] = vertex.x
      mergedPositions[offset++] = vertex.y
      mergedPositions[offset++] = vertex.z
    }
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3))

  const material = new THREE.LineBasicMaterial({
    color: COLORS.edge,
    linewidth: 1,
  })

  const lineSegments = new THREE.LineSegments(geometry, material)

  // Wyczyść cache
  edgesToMerge.length = 0

  return lineSegments
}

export function clearEdgesCache(): void {
  edgesToMerge.length = 0
  edgesCache.clear()
  instanceGroups.clear()

  // Dispose geometrii z cache
  geometryCache.forEach((geom) => geom.dispose())
  geometryCache.clear()
}

export function createGeometry(
  node: CityNode,
  nodeData: ProcessedNodeData,
  x: number = 0,
  y: number = 0,
  z: number = 0,
  objectMap: Map<any, any>
): void {
  // Jeśli to plik - zbierz instancję budynku
  if (node.height !== undefined && node.width !== undefined) {
    collectBuildingInstance(node, nodeData, x, y, z)
    return
  }

  // Jeśli to folder - zbierz instancję platformy i przetwórz dzieci
  if (node.children !== undefined) {
    collectPlatformInstance(node, nodeData, x, y, z)

    node.children.forEach((child, index) => {
      const pos = nodeData.positions[index]
      const childX = x - nodeData.width / 2 + pos.x
      const childZ = z - nodeData.depth / 2 + pos.z
      const childY = y + nodeData.height

      createGeometry(
        child,
        nodeData.children[index],
        childX,
        childY,
        childZ,
        objectMap
      )
    })
  }
}

export function applyColorData(
  colorData: Array<{ path: string; color: number; intensity: number }>,
  objectMap: Map<any, any>
): void {
  // mapa path -> colorData
  colorDataMap.clear()
  colorData.forEach((h) => {
    colorDataMap.set(h.path, { color: h.color, intensity: h.intensity })
  })

  objectMap.forEach((data, key) => {
    if (typeof key !== 'string') return

    const currentColorData = colorDataMap.get(data.node.path)

    if (currentColorData && data.type === 'building') {
      const mesh = data.mesh as THREE.InstancedMesh
      const originalColor = new THREE.Color(COLORS.building)
      const targetColor = new THREE.Color(currentColorData.color)

      // Interpoluj między oryginalnym kolorem a kolorem hotspotu
      const resultColor = new THREE.Color()
      resultColor.lerpColors(originalColor, targetColor, currentColorData.intensity * 3)

      mesh.setColorAt(data.instanceIndex, resultColor)
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  })
}

export function clearColorData(objectMap: Map<any, any>): void {
  colorDataMap.clear()

  const updatedMeshes = new Set<THREE.InstancedMesh>()

  objectMap.forEach((data, key) => {
    if (typeof key !== 'string') return
    
    if (data.type === 'building') {
      const mesh = data.mesh as THREE.InstancedMesh
      mesh.setColorAt(data.instanceIndex, new THREE.Color(COLORS.building))
      updatedMeshes.add(mesh)
    }
  })

  updatedMeshes.forEach(mesh => {
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })
}

export function getColorDataForPath(
  path: string
): { color: number; intensity: number } | undefined {
  return colorDataMap.get(path)
}

// ----- INSTANCJOWANIE -----
export function collectBuildingInstance(
  node: CityNode,
  nodeData: ProcessedNodeData,
  x: number,
  y: number,
  z: number
): void {
  const buildWidth = nodeData.width
  const buildHeight = nodeData.height

  const key = `building_${buildWidth}_${buildHeight}_${buildWidth}`
  
  if (!instanceGroups.has(key)) {
    instanceGroups.set(key, { buildings: [] })
  }
  
  const instance = instanceGroups.get(key)!
  const matrix = new THREE.Matrix4()
  matrix.setPosition(x, y + buildHeight / 2, z)
  
  instance.buildings.push({
    node,
    matrix,
    index: instance.buildings.length
  })
  
  // Zbieranie edges
  const geometry = geometryCache.get(key.replace('building_', ''))
  if (!geometry) {
    const geom = new THREE.BoxGeometry(buildWidth, buildHeight, buildWidth)
    geometryCache.set(key.replace('building_', ''), geom)
    collectEdges(geom, x, y + buildHeight / 2, z)
  } else {
    collectEdges(geometry, x, y + buildHeight / 2, z)
  }
}

export function collectPlatformInstance(
  node: CityNode,
  nodeData: ProcessedNodeData,
  x: number,
  y: number,
  z: number
): void {
  const key = `platform_${nodeData.width}_${nodeData.height}_${nodeData.depth}`
  
  if (!instanceGroups.has(key)) {
    instanceGroups.set(key, { buildings: [] })
  }
  
  const instance = instanceGroups.get(key)!
  const matrix = new THREE.Matrix4()
  matrix.setPosition(x, y + nodeData.height / 2, z)
  
  instance.buildings.push({
    node,
    matrix,
    index: instance.buildings.length
  })
  
  const geometry = geometryCache.get(key.replace('platform_', ''))
  if (!geometry) {
    const geom = new THREE.BoxGeometry(nodeData.width, nodeData.height, nodeData.depth)
    geometryCache.set(key.replace('platform_', ''), geom)
    collectEdges(geom, x, y + nodeData.height / 2, z)
  } else {
    collectEdges(geometry, x, y + nodeData.height / 2, z)
  }
}

// Tworzenie wszystkich instancjonowanych mesh'y naraz
export function createAllInstancedMeshes(
  objectMap: Map<any, any>
): THREE.Group {
  const group = new THREE.Group()
  
  instanceGroups.forEach((instance, key) => {
    const [type, width, height, depth] = key.split('_')
    const w = parseFloat(width)
    const h = parseFloat(height)
    const d = parseFloat(depth)
    
    // Pobierz lub stwórz geometrię
    const geomKey = `${w}_${h}_${d}`
    let geometry = geometryCache.get(geomKey)
    if (!geometry) {
      geometry = new THREE.BoxGeometry(w, h, d)
      geometryCache.set(geomKey, geometry)
    }
    
    // Stwórz material
    const color = type === 'building' ? COLORS.building : COLORS.platform
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: COLORS.emissiveColor,
    })
    
    // Stwórz InstancedMesh
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      instance.buildings.length
    )
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.userData = { 
      type: type,
      isInstanced: true,
      instanceKey: key
    }
    
    // Ustaw matrixa i kolory dla każdej instancji
    instance.buildings.forEach((building, i) => {
      mesh.setMatrixAt(i, building.matrix)
      mesh.setColorAt(i, new THREE.Color(color))
      
      // Mapuj indeks instancji do node
      // Klucz: `${instanceKey}_${instanceIndex}`
      objectMap.set(`${key}_${i}`, {
        node: building.node,
        mesh: mesh,
        instanceIndex: i,
        type: type
      })
    })
    
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    
    group.add(mesh)
  })
  
  // Wyczyść po użyciu
  instanceGroups.clear()
  
  return group
}

export function clearInstanceCache(): void {
  instanceGroups.clear()
}