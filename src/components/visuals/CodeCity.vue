<template>
  <div class="code-city-wrapper">
    <div v-if="!data" class="placeholder">
      <p>No data to display</p>
    </div>
    <div v-else ref="containerRef" class="code-city-container"></div>
  </div>
</template>

<script setup lang="ts">
  // ----- Importy + Stałe wartości -----
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import type { CityNode } from '@/types/city'
  import { useCodeCityScene } from '@/composables/useCodeCityScene'
  import { useCodeCityState } from '@/composables/useCodeCityState'
  import { processNode } from '@/utils/city/layout'
  import { createGeometry, createMergedEdges, getColorDataForPath } from '@/utils/city/geometry'
  import * as THREE from 'three'
  import {
    COLORS,
    CAMERA_DAMPING,
    AUTO_ROTATE_DELAY,
    AUTO_ROTATE_SPEED,
    CENTER_TRANSITION_SPEED,
    BUILDING_ZOOM,
    PLATFORM_ZOOM_MULT,
  } from '@/utils/city/constants'
  import { toRaw } from 'vue'
  import { applyColorData, clearColorData } from '@/utils/city/geometry'
  import { useCodeCityController } from '@/composables/useCodeCityController'

  const { 
    registerSelectCityNode, 
    unregisterSelectCityNode,
    registerSetCityNodeHoverByPath,
    unregisterSetCityNodeHoverByPath 
  } = useCodeCityController()

  interface Props {
    data: CityNode | null
    autoRotate?: boolean
    initialZoom?: number
    colorData?: Array<{ path: string; color: number; intensity: number }>
  }

  const props = withDefaults(defineProps<Props>(), {
    autoRotate: true,
    initialZoom: 150,
    colorData: () => [],
  })

  const emit = defineEmits<{
    cityNodeClick: [name: string | null, path: string | null, intensity?: number]
    cityNodeHover: [path: string]
    cityNodeCancelHover: [path: string]
  }>()

  const containerRef = ref<HTMLDivElement | null>(null)
  let animationId: number | null = null

  // Composables
  const {
    getScene,
    getCamera,
    getRenderer,
    getRaycaster,
    getMouse,
    initScene,
    cleanup: cleanupScene,
  } = useCodeCityScene(containerRef, props.initialZoom)

  const { hoveredObject, selectedObject, objectMap, setRotationCenter, clearSelection } =
    useCodeCityState()

  watch(
    () => props.colorData,
    (newColorData) => {
      if (newColorData && newColorData.length > 0) {
        applyColorData(newColorData, objectMap)
      } else {
        clearColorData(objectMap)
      }
    },
    { deep: true }
  )

  // Kontrolki
  const controls = {
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0.5, y: 0.8 },
    targetRotation: { x: 0.5, y: 0.8 },
    rotationVelocity: { x: 0, y: 0 },
    zoom: props.initialZoom,
    targetZoom: props.initialZoom,
    lastInteractionTime: Date.now() - 3000,
    currentCenter: new THREE.Vector3(0, 0.5, 0),
    targetCenter: new THREE.Vector3(0, 0.5, 0),
  }

  let mouseDownPosition = { x: 0, y: 0 }
  let mouseDownTime = 0
  let resizeHandler: (() => void) | null = null
  let initialZoom = props.initialZoom
  let isMouseOverCanvas = false

  // ----- Logika select elementów miasta -----
  function selectCityNode(mesh: THREE.Mesh, returnEmit: boolean) {
    const nodeData = objectMap.get(mesh)
    if (!nodeData) return

    if (selectedObject.value) {
      restoreOriginalColor(toRaw(selectedObject.value))
    }

    selectedObject.value = mesh

    // Ustaw kolor selected
    const material = mesh.material as THREE.MeshPhongMaterial
    material.color.setHex(COLORS.selected)

    controls.targetCenter.copy(mesh.position)
    setRotationCenter(mesh.position)

    const camera = getCamera()
    if (camera) {
      controls.targetZoom = calculateOptimalZoom(mesh, camera)
    }

    if (returnEmit) {
      const colorInfo = getColorDataForPath(nodeData.path)
      emit('cityNodeClick', nodeData.name, nodeData.path, colorInfo?.intensity)
    }
  }

  function deselectCityNode(returnEmit: boolean) {
    if (selectedObject.value) {
      restoreOriginalColor(toRaw(selectedObject.value))
      selectedObject.value = null
      controls.targetCenter = new THREE.Vector3(0, 0.5, 0)
      setRotationCenter(new THREE.Vector3(0, 0.5, 0))

      controls.targetZoom = initialZoom

      if (returnEmit) {
        emit('cityNodeClick', null, null)
      }
    }
  }

  function selectCityNodeByPath(path: string | null): boolean {
    if (!path) {
      deselectCityNode(false)
      return true
    }

    let targetMesh: THREE.Mesh | null = null

    objectMap.forEach((nodeData, mesh) => {
      if (nodeData.path === path) {
        targetMesh = mesh
      }
    })

    if (!targetMesh) {
      return false
    }

    selectCityNode(targetMesh, false)
    return true
  }

  // ----- Logika hover elementów miasta -----
  function setCityNodeHover(newHoveredObject: THREE.Mesh | null, returnEmit: boolean) {
    hoveredObject.value = newHoveredObject

    // Podświetl nowy obiekt (jeśli nie jest selected)
    if (hoveredObject.value && toRaw(hoveredObject.value) !== toRaw(selectedObject.value)) {
      const material = hoveredObject.value.material as THREE.MeshPhongMaterial
      material.color.setHex(COLORS.hover)

      const nodeData = objectMap.get(toRaw(hoveredObject.value))
      if (returnEmit) { emit('cityNodeHover', nodeData.path) }
    }
  }

  function resetCityNodeHover(returnEmit: boolean) {
    if (hoveredObject.value && hoveredObject.value !== selectedObject.value) {
      restoreOriginalColor(toRaw(hoveredObject.value))

      const nodeData = objectMap.get(toRaw(hoveredObject.value))
      if (returnEmit) { emit('cityNodeCancelHover', nodeData.path) }
    }
  }

  function setCityNodeHoverByPath (path: string | null): boolean {
    if (!path) {
      resetCityNodeHover(false)
      return true
    }

    let targetMesh: THREE.Mesh | null = null

    objectMap.forEach((nodeData, mesh) => {
      if (nodeData.path === path) {
        targetMesh = mesh
      }
    })

    if (!targetMesh) {
      return false
    }

    resetCityNodeHover(false)
    setCityNodeHover(targetMesh, false)
    return true
  }

  // ----- funkcje handle click i hover -----
  function handleClick(cam: THREE.Camera, scn: THREE.Scene, e: MouseEvent) {
    const raycaster = getRaycaster()
    const mouse = getMouse()
    if (!raycaster || !mouse) return

    const timeDiff = Date.now() - mouseDownTime
    const distance = Math.sqrt(
      Math.pow(e.clientX - mouseDownPosition.x, 2) + Math.pow(e.clientY - mouseDownPosition.y, 2)
    )

    if (distance < 15 && timeDiff < 200) {
      raycaster.setFromCamera(mouse, cam)
      const intersects = raycaster.intersectObjects(scn.children, true)

      let clickedObject = null
      for (let intersect of intersects) {
        if (intersect.object.userData.isSelectable) {
          clickedObject = intersect.object as THREE.Mesh
          break
        }
      }

      if (!clickedObject) {
        deselectCityNode(true)
      } else if (clickedObject !== toRaw(selectedObject.value)) {
        selectCityNode(clickedObject, true)
      }
    }
  }

  function handleHover(cam: THREE.Camera, scn: THREE.Scene) {
    if (controls.isDragging) return

    const raycaster = getRaycaster()
    const mouse = getMouse()
    if (!raycaster || !mouse) return

    raycaster.setFromCamera(mouse, cam)
    const intersects = raycaster.intersectObjects(scn.children, true)

    let newHoveredObject: THREE.Mesh | null = null
    for (let intersect of intersects) {
      if (intersect.object.userData.isSelectable) {
        newHoveredObject = intersect.object as THREE.Mesh
        break
      }
    }

    if (toRaw(newHoveredObject) === toRaw(hoveredObject.value)) return

    // Przywróć kolor poprzedniego obiektu (jeśli nie jest selected)
    resetCityNodeHover(true)

    // Ustaw nowy hovered object
    setCityNodeHover(newHoveredObject, true)
  }

  // ----- UTILS -----
  function restoreOriginalColor(mesh: THREE.Mesh) {
    const nodeData = objectMap.get(mesh)
    const colorInfo = getColorDataForPath(nodeData.path)
    const material = mesh.material as THREE.MeshPhongMaterial

    if (colorInfo) {
      const originalColor = new THREE.Color(COLORS.building)
      const targetColor = new THREE.Color(colorInfo.color)
      material.color.lerpColors(originalColor, targetColor, colorInfo.intensity * 3)
    } else {
      material.color.setHex(COLORS.building)
    }
  }

  function calculateInitialZoom(rootData: any, camera: THREE.PerspectiveCamera): number {
    const maxDimension = Math.max(rootData.width, rootData.depth)
    const fov = camera.fov * (Math.PI / 180)
    const distance = (maxDimension * 0.5) / Math.tan(fov)
    const result = distance * PLATFORM_ZOOM_MULT
    return result >= BUILDING_ZOOM ? result : BUILDING_ZOOM
  }

  function calculateOptimalZoom(mesh: THREE.Mesh, camera: THREE.PerspectiveCamera): number {
    const nodeData = objectMap.get(mesh)
    if (!nodeData) return controls.targetZoom

    // Dla platformy
    if (mesh.userData.type === 'platform') {
      const geometry = mesh.geometry as THREE.BoxGeometry
      const params = geometry.parameters
      const maxDimension = Math.max(params.width, params.depth)

      const fov = camera.fov * (Math.PI / 180)
      const distance = (maxDimension * 0.5) / Math.tan(fov)
      const result = distance * PLATFORM_ZOOM_MULT

      return result >= BUILDING_ZOOM ? result : BUILDING_ZOOM
    }

    // Dla budynku
    return BUILDING_ZOOM
  }

  function updateMousePosition(e: MouseEvent, rect: DOMRect) {
    const mouse = getMouse()
    if (!mouse) return
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  // ----- Event listeners -----
  function setupEventListeners(rnd: THREE.WebGLRenderer, cam: THREE.Camera, scn: THREE.Scene) {
    rnd.domElement.addEventListener('mousedown', (e) => {
      controls.isDragging = true
      controls.previousMousePosition = { x: e.clientX, y: e.clientY }
      mouseDownPosition = { x: e.clientX, y: e.clientY }
      mouseDownTime = Date.now()
      controls.lastInteractionTime = Date.now()

      controls.rotationVelocity.x = 0
      controls.rotationVelocity.y = 0

      if (hoveredObject.value && hoveredObject.value !== selectedObject.value) {
        restoreOriginalColor(toRaw(hoveredObject.value))

        const nodeData = objectMap.get(toRaw(hoveredObject.value))
        emit('cityNodeCancelHover', nodeData.path)

        hoveredObject.value = null
      }
    })

    rnd.domElement.addEventListener('mousemove', (e) => {
      const rect = rnd.domElement.getBoundingClientRect()
      updateMousePosition(e, rect)

      if (controls.isDragging) {
        const deltaX = e.clientX - controls.previousMousePosition.x
        const deltaY = e.clientY - controls.previousMousePosition.y

        controls.rotationVelocity.y = -deltaX * 0.005
        controls.rotationVelocity.x = deltaY * 0.005

        controls.targetRotation.y += controls.rotationVelocity.y
        controls.targetRotation.x += controls.rotationVelocity.x
        controls.targetRotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, controls.targetRotation.x)
        )

        controls.previousMousePosition = { x: e.clientX, y: e.clientY }
        controls.lastInteractionTime = Date.now()
      }
    })

    rnd.domElement.addEventListener('mouseup', (e: MouseEvent) => {
      controls.isDragging = false
      handleClick(cam, scn, e)
    })

    rnd.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
      controls.targetZoom += e.deltaY * 0.1
      controls.targetZoom = Math.max(40, Math.min(initialZoom * 2, controls.targetZoom))
    })

    rnd.domElement.addEventListener('mouseenter', () => {
      isMouseOverCanvas = true
    })

    rnd.domElement.addEventListener('mouseleave', () => {
      isMouseOverCanvas = false
      controls.isDragging = false;
      
      // Wyczyść hover gdy myszka opuszcza canvas
      resetCityNodeHover(true)
      hoveredObject.value = null
    })
  }

  function updateCamera(cam: THREE.PerspectiveCamera) {
    const timeSinceInteraction = Date.now() - controls.lastInteractionTime
    if (timeSinceInteraction > AUTO_ROTATE_DELAY) {
      controls.targetRotation.y += AUTO_ROTATE_SPEED
    }

    if (!controls.isDragging) {
      controls.rotationVelocity.x *= 0.95
      controls.rotationVelocity.y *= 0.95

      controls.targetRotation.x += controls.rotationVelocity.x
      controls.targetRotation.y += controls.rotationVelocity.y
      controls.targetRotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, controls.targetRotation.x)
      )
    }

    controls.rotation.x += (controls.targetRotation.x - controls.rotation.x) * CAMERA_DAMPING
    controls.rotation.y += (controls.targetRotation.y - controls.rotation.y) * CAMERA_DAMPING
    controls.zoom += (controls.targetZoom - controls.zoom) * CAMERA_DAMPING

    controls.currentCenter.lerp(controls.targetCenter, CENTER_TRANSITION_SPEED)

    const distance = controls.zoom
    const center = controls.currentCenter

    cam.position.x =
      center.x + distance * Math.sin(controls.rotation.y) * Math.cos(controls.rotation.x)
    cam.position.y = center.y + distance * Math.sin(controls.rotation.x)
    cam.position.z =
      center.z + distance * Math.cos(controls.rotation.y) * Math.cos(controls.rotation.x)
    cam.lookAt(center.x, center.y, center.z)
  }

  function initThreeJS() {
    if (!containerRef.value || !props.data) return

    const sceneReady = initScene()
    const scene = getScene()
    const camera = getCamera()
    const renderer = getRenderer()
    const mouse = getMouse()

    if (mouse) {
      mouse.x = Infinity
      mouse.y = Infinity
    }

    if (!sceneReady || !scene || !camera || !renderer) return

    // Przetwórz dane i stwórz miasto
    const rootData = processNode(props.data)
    const city = createGeometry(props.data, rootData, 0, 0, 0, objectMap)
    scene.add(city)

    const mergedEdges = createMergedEdges()
    scene.add(mergedEdges)

    const optimalZoom = calculateInitialZoom(rootData, camera)
    initialZoom = optimalZoom
    controls.zoom = optimalZoom
    controls.targetZoom = optimalZoom

    if (props.colorData && props.colorData.length > 0) {
      applyColorData(props.colorData, objectMap)
    }

    setupEventListeners(renderer, camera, scene)

    // Animacja
    function animate() {
      animationId = requestAnimationFrame(animate)
      if (camera && scene && renderer) {
        updateCamera(camera)
        if (isMouseOverCanvas) { handleHover(camera, scene) }
        renderer.render(scene, camera)
      }
    }
    animate()

    // Obsługa resize
    resizeHandler = () => {
      if (!containerRef.value || !camera || !renderer) return
      camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    }
    window.addEventListener('resize', resizeHandler)
  }

  function cleanup() {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }

    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    cleanupScene()
    clearSelection()
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      deselectCityNode(true)
    }
  }

  onMounted(() => {
    initThreeJS()
    registerSelectCityNode(selectCityNodeByPath)
    registerSetCityNodeHoverByPath(setCityNodeHoverByPath)
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    cleanup()
    unregisterSelectCityNode()
    unregisterSetCityNodeHoverByPath()
    window.removeEventListener('keydown', handleKeyPress)
  })
</script>

<style scoped>
  .code-city-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .code-city-container {
    width: 100%;
    height: 100%;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 1.2rem;
  }
</style>
