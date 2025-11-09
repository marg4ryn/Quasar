import { type Ref } from 'vue'
import * as THREE from 'three'
import { clearEdgesCache } from '@/utils/city/geometry'

interface CodeCityScene {
  getScene: () => THREE.Scene | null
  getCamera: () => THREE.PerspectiveCamera | null
  getRenderer: () => THREE.WebGLRenderer | null
  getRaycaster: () => THREE.Raycaster | null
  getMouse: () => THREE.Vector2 | null
  initScene: () => boolean
  cleanup: () => void
}

export function useCodeCityScene(
  container: Ref<HTMLElement | null>,
  initialZoom: number = 150
): CodeCityScene {
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let raycaster: THREE.Raycaster | null = null
  let mouse: THREE.Vector2 | null = null

  function initScene() {
    if (!container.value) return false

    // Initialize raycaster and mouse
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    // Create a scene
    scene = new THREE.Scene()

    // Create a camera
    camera = new THREE.PerspectiveCamera(
      60,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      10000
    )
    camera.position.set(initialZoom, initialZoom, initialZoom)

    // Create a renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.shadowMap.enabled = true
    container.value.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xd9d9d9, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xd9d9d9, 0.5)
    directionalLight.position.set(1000, 1000, 500)
    scene.add(directionalLight)

    return true
  }

  function cleanup() {
    if (renderer && container.value) {
      container.value.removeChild(renderer.domElement)
      renderer.dispose()
      renderer = null
    }

    if (scene) {
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat: any) => mat.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      scene = null
    }

    clearEdgesCache()

    camera = null
    raycaster = null
    mouse = null
  }

  return {
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    getRaycaster: () => raycaster,
    getMouse: () => mouse,
    initScene,
    cleanup,
  }
}
