<template>
  <div class="code-city-wrapper">
    <div v-if="!data" class="placeholder">
      <p>No data to display</p>
    </div>
    <div v-else ref="containerRef" class="code-city-container"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import type { CityNode } from '@/types/city'
  import { useCodeCityScene } from '@/composables/useCodeCityScene'
  import { useCodeCityState } from '@/composables/useCodeCityState'
  import { processNode } from '@/utils/city/layout'
  import { createGeometry, createMergedEdges, getColorDataForPath } from '@/utils/city/geometry'
  import * as THREE from 'three'
  import { COLORS, CAMERA_DAMPING, AUTO_ROTATE_DELAY, AUTO_ROTATE_SPEED, CENTER_TRANSITION_SPEED } from '@/utils/city/constants'
  import { toRaw } from 'vue'
  import { applyColorData, clearColorData } from '@/utils/city/geometry'
  import { useCodeCityController } from '@/composables/useCodeCityController'

  const { registerSelectBuilding, unregisterSelectBuilding } = useCodeCityController()

  interface Props {
    data: CityNode | null
    autoRotate?: boolean
    initialZoom?: number
    colorData?: Array<{ path: string; color: number; intensity: number }>
  }

  const props = withDefaults(defineProps<Props>(), {
    autoRotate: true,
    initialZoom: 150,
    colorData: () => []
  })

  const emit = defineEmits<{
    buildingClick: [name: string, path: string, intensity?: number]
  }>()

  const containerRef = ref<HTMLDivElement | null>(null)
  let animationId: number | null = null

  // Composables
  const { getScene, getCamera, getRenderer, getRaycaster, getMouse, initScene, cleanup: cleanupScene } = 
    useCodeCityScene(containerRef, props.initialZoom)

  const { hoveredObject, selectedObject, objectMap, rotationCenter, setRotationCenter, clearSelection } = 
    useCodeCityState()

  watch(() => props.colorData, (newColorData) => {
    if (newColorData && newColorData.length > 0) {
      applyColorData(newColorData, objectMap)
    } else {
      clearColorData(objectMap)
    }
  }, { deep: true })

  function selectBuildingByPath(path: string): boolean {
    let targetMesh: THREE.Mesh | null = null
    
    objectMap.forEach((nodeData, mesh) => {
      if (nodeData.path === path) {
        targetMesh = mesh
      }
    })
    
    if (!targetMesh) {
      return false
    }
    
    selectBuilding(targetMesh, false)
    return true
  }

  function selectBuilding(mesh: THREE.Mesh, returnEmit: boolean) {
    const nodeData = objectMap.get(mesh)
    if (!nodeData) return
    
    // Odznacz poprzedni budynek/platformę
    if (selectedObject.value) {
      setEmissiveColor(selectedObject.value, COLORS.buildingEmissive)
    }
    
    selectedObject.value = mesh

    controls.targetCenter.copy(mesh.position)
    setRotationCenter(mesh.position)
    
    if (returnEmit) {
      const colorInfo = getColorDataForPath(nodeData.path)
      emit('buildingClick', nodeData.name, nodeData.path, colorInfo?.intensity)
    }
  }

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
    currentCenter: new THREE.Vector3(0, 0, 0),
    targetCenter: new THREE.Vector3(0, 0, 0),
  }

  let mouseDownPosition = { x: 0, y: 0 }
  let mouseDownTime = 0
  let resizeHandler: (() => void) | null = null

  function setEmissiveColor(mesh: THREE.Mesh | null, color: number) {
    if (!mesh) return
    const material = mesh.material as THREE.MeshPhongMaterial
    if (material && 'emissive' in material) {
      material.emissive.setHex(color)
    }
  }

  function updateMousePosition(e: MouseEvent, rect: DOMRect) {
    const mouse = getMouse()
    if (!mouse) return
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  function handleHover(cam: THREE.Camera, scn: THREE.Scene) {
    const raycaster = getRaycaster()
    const mouse = getMouse() 
    if (!raycaster || !mouse) return
    
    raycaster.setFromCamera(mouse, cam)
    const intersects = raycaster.intersectObjects(scn.children, true)

    if (hoveredObject.value && hoveredObject.value !== selectedObject.value) {
      setEmissiveColor(hoveredObject.value, COLORS.buildingEmissive)
    }

    hoveredObject.value = null

    for (let intersect of intersects) {
      if (intersect.object.userData.isSelectable) {
        if (toRaw(intersect.object) !== toRaw(selectedObject.value)) { // toRaw bo były problemy z opakowaniem proxy przy porównaniu
          hoveredObject.value = intersect.object as THREE.Mesh
          setEmissiveColor(hoveredObject.value, COLORS.hover)
        }
        break
      }
    }
  }

  function handleClick(cam: THREE.Camera, scn: THREE.Scene, e: MouseEvent) {
    const raycaster = getRaycaster()
    const mouse = getMouse() 
    if (!raycaster || !mouse) return
    
    const timeDiff = Date.now() - mouseDownTime
    const distance = Math.sqrt(
      Math.pow(e.clientX - mouseDownPosition.x, 2) +
      Math.pow(e.clientY - mouseDownPosition.y, 2)
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
        setEmissiveColor(selectedObject.value, COLORS.buildingEmissive)
        selectedObject.value = null
        controls.targetCenter = new THREE.Vector3(0, 0, 0)
        setRotationCenter(new THREE.Vector3(0, 0, 0))
      } else if (clickedObject !== toRaw(selectedObject.value)) {
        selectBuilding(clickedObject, true)
      }
    }
  }

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
        setEmissiveColor(hoveredObject.value, COLORS.buildingEmissive)
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
        controls.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.targetRotation.x))

        controls.previousMousePosition = { x: e.clientX, y: e.clientY }
        controls.lastInteractionTime = Date.now()
      } else {
        handleHover(cam, scn)
      }
    })

    rnd.domElement.addEventListener('mouseup', (e: MouseEvent) => {
      controls.isDragging = false
      handleClick(cam, scn, e)
    })

    rnd.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
      controls.targetZoom += e.deltaY * 0.1
      controls.targetZoom = Math.max(50, Math.min(500, controls.targetZoom))
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
      controls.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.targetRotation.x))
    }

    controls.rotation.x += (controls.targetRotation.x - controls.rotation.x) * CAMERA_DAMPING
    controls.rotation.y += (controls.targetRotation.y - controls.rotation.y) * CAMERA_DAMPING
    controls.zoom += (controls.targetZoom - controls.zoom) * CAMERA_DAMPING

    controls.currentCenter.lerp(controls.targetCenter, CENTER_TRANSITION_SPEED)

    const distance = controls.zoom
    const center = controls.currentCenter
    
    cam.position.x = center.x + distance * Math.sin(controls.rotation.y) * Math.cos(controls.rotation.x)
    cam.position.y = center.y + distance * Math.sin(controls.rotation.x)
    cam.position.z = center.z + distance * Math.cos(controls.rotation.y) * Math.cos(controls.rotation.x)
    cam.lookAt(center.x, center.y, center.z)
  }

  function initThreeJS() {
    if (!containerRef.value || !props.data) return

    const sceneReady = initScene()
    const scene = getScene()
    const camera = getCamera()
    const renderer = getRenderer()

    if (!sceneReady || !scene || !camera || !renderer) return

    // Przetwórz dane i stwórz miasto
    const rootData = processNode(props.data)
    const city = createGeometry(props.data, rootData, 0, 0, 0, objectMap)
    scene.add(city)

    const mergedEdges = createMergedEdges()
    scene.add(mergedEdges)

    if (props.colorData && props.colorData.length > 0) {
      applyColorData(props.colorData, objectMap)
    }

    setupEventListeners(renderer, camera, scene)

    // Animacja
    function animate() {
      animationId = requestAnimationFrame(animate)
      if (camera && scene && renderer) {
        updateCamera(camera)
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

  onMounted(() => {
    initThreeJS()
    registerSelectBuilding(selectBuildingByPath)
  })

  onUnmounted(() => {
    cleanup()
    unregisterSelectBuilding()
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