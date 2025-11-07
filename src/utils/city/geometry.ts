import * as THREE from 'three'
import type { CityNode, ProcessedNodeData } from '@/types/city'
import { COLORS } from './constants'

const geometryCache = new Map<string, THREE.BoxGeometry>()
const edgesCache = new Map<string, Float32Array>()

const edgesToMerge: Array<{
  positions: Float32Array
  matrix: THREE.Matrix4
}> = []

const colorDataMap = new Map<string, { color: number; intensity: number }>()

// ========== TWORZENIE GEOMETRII ==========
export function createBuilding(
  node: CityNode, 
  nodeData: ProcessedNodeData, 
  x: number, 
  y: number, 
  z: number,
  objectMap: Map<any, any>
): THREE.Mesh {
    const key = `${nodeData.width}_${nodeData.height}_${nodeData.depth}`
    let geometry = geometryCache.get(key)
    
    if (!geometry) {
        geometry = new THREE.BoxGeometry(nodeData.width, nodeData.height, nodeData.depth)
        geometryCache.set(key, geometry)
    }
    
    const material = new THREE.MeshPhongMaterial({ 
        color: COLORS.building,
        emissive: COLORS.emissiveColor
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + nodeData.height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    mesh.userData = { name: node.name, isSelectable: true, type: 'building' };
    objectMap.set(mesh, node);
    
    collectEdges(geometry, x, y + nodeData.height / 2, z)
    
    return mesh;
}

export function createPlatform(
  node: CityNode, 
  nodeData: ProcessedNodeData, 
  x: number, 
  y: number, 
  z: number,
  objectMap: Map<any, any>
): THREE.Mesh {
    const key = `${nodeData.width}_${nodeData.height}_${nodeData.depth}`
    let geometry = geometryCache.get(key)
    
    if (!geometry) {
        geometry = new THREE.BoxGeometry(nodeData.width, nodeData.height, nodeData.depth)
        geometryCache.set(key, geometry)
    }

    const material = new THREE.MeshPhongMaterial({ 
        color: COLORS.platform,
        emissive: COLORS.emissiveColor
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + nodeData.height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData = { name: node.name, isSelectable: true, type: 'platform' };
    objectMap.set(mesh, node);
    
    collectEdges(geometry, x, y + nodeData.height / 2, z)
    
    return mesh;
}

export function collectEdges(
  geometry: THREE.BoxGeometry,
  x: number,
  y: number, 
  z: number
): void {
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
          positions[i], positions[i + 1], positions[i + 2],
          positions[i + 3], positions[i + 4], positions[i + 5]
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
    matrix
  })
}

export function createMergedEdges(): THREE.LineSegments {
  let totalVertices = 0
  edgesToMerge.forEach(edge => {
    totalVertices += edge.positions.length
  })
  
  const mergedPositions = new Float32Array(totalVertices)
  let offset = 0
  
  edgesToMerge.forEach(edge => {
    const vertex = new THREE.Vector3()
    
    for (let i = 0; i < edge.positions.length; i += 3) {
      vertex.set(
        edge.positions[i],
        edge.positions[i + 1],
        edge.positions[i + 2]
      )
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
    linewidth: 1
  })
  
  const lineSegments = new THREE.LineSegments(geometry, material)
  
  // Wyczyść cache
  edgesToMerge.length = 0
  
  return lineSegments
}

export function clearEdgesCache(): void {
  edgesToMerge.length = 0
  edgesCache.clear()
  
  // Dispose geometrii z cache
  geometryCache.forEach(geom => geom.dispose())
  geometryCache.clear()
}

export function createGeometry(
  node: CityNode, 
  nodeData: ProcessedNodeData, 
  x: number = 0, 
  y: number = 0, 
  z: number = 0,
  objectMap: Map<any, any>
): THREE.Group {
    const group = new THREE.Group();

    // Jeśli to plik - tworzymy budynek
    if (node.height !== undefined && node.width !== undefined) {
        const building = createBuilding(node, nodeData, x, y, z, objectMap);
        group.add(building);
        return group;
    }

    // Jeśli to folder - tworzymy platformę i dzieci
    if (node.children !== undefined) {
        const platform = createPlatform(node, nodeData, x, y, z, objectMap);
        group.add(platform);

        node.children.forEach((child, index) => {
            const pos = nodeData.positions[index];
            const childX = x - nodeData.width / 2 + pos.x;
            const childZ = z - nodeData.depth / 2 + pos.z;
            const childY = y + nodeData.height;
            
            const childGroup = createGeometry(child, nodeData.children[index], childX, childY, childZ, objectMap);
            group.add(childGroup);
        });
    }

    return group;
}

export function applyColorData(
  colorData: Array<{ path: string; color: number; intensity: number }>,
  objectMap: Map<THREE.Mesh, any>
): void {
  // mapa path -> colorData
  colorDataMap.clear()
  colorData.forEach(h => {
    colorDataMap.set(h.path, { color: h.color, intensity: h.intensity })
  })
  
  objectMap.forEach((nodeData, mesh) => {
    const currentColorData = colorDataMap.get(nodeData.path)
    
    if (currentColorData && mesh.userData.type === 'building') {
      const material = mesh.material as THREE.MeshPhongMaterial
      
      // Interpoluj między oryginalnym kolorem a kolorem hotspotu
      const originalColor = new THREE.Color(COLORS.building)
      const targetColor = new THREE.Color(currentColorData.color)
      
      material.color.lerpColors(originalColor, targetColor, currentColorData.intensity * 3)
      
      // emissive things
      //const emissiveColor = new THREE.Color(currentColorData.color)
      //material.emissive.copy(emissiveColor)
      //material.emissiveIntensity = 0.8
    }
  })
}

export function clearColorData(objectMap: Map<THREE.Mesh, any>): void {
  colorDataMap.clear()
  objectMap.forEach((nodeData, mesh) => {
    if (mesh.userData.type === 'building') {
      const material = mesh.material as THREE.MeshPhongMaterial
      material.color.setHex(COLORS.building)
      material.emissive.setHex(COLORS.emissiveColor)
    }
  })
}

export function getColorDataForPath(path: string): { color: number; intensity: number } | undefined {
  return colorDataMap.get(path)
}