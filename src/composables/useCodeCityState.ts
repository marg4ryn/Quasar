import { ref, type Ref } from 'vue'
import * as THREE from 'three'

interface CodeCityState {
  hoveredObject: Ref<THREE.Mesh | null>
  selectedObject: Ref<THREE.Mesh | null>
  rotationCenter: Ref<THREE.Vector3>
  objectMap: Map<THREE.Mesh, any>
  clearSelection: () => void
  setRotationCenter: (position: THREE.Vector3) => void
}

const hoveredObject = ref<THREE.Mesh | null>(null)
const selectedObject = ref<THREE.Mesh | null>(null)
const rotationCenter = ref<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
const objectMap = new Map<THREE.Mesh, any>()

export function useCodeCityState(): CodeCityState {
  function clearSelection() {
    hoveredObject.value = null
    selectedObject.value = null
    rotationCenter.value = new THREE.Vector3(0, 0, 0)
    objectMap.clear()
  }

  function setRotationCenter(position: THREE.Vector3) {
    rotationCenter.value = position.clone()
  }

  return {
    hoveredObject,
    selectedObject,
    rotationCenter,
    objectMap,
    clearSelection,
    setRotationCenter
  }
}