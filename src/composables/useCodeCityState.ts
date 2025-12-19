import { ref, type Ref } from 'vue'
import * as THREE from 'three'

interface InstanceData {
  node: any
  mesh: THREE.InstancedMesh
  instanceIndex: number
  type: string
}

interface CodeCityState {
  hoveredObject: Ref<InstanceData | null>
  selectedObject: Ref<InstanceData | null>
  rotationCenter: Ref<THREE.Vector3>
  objectMap: Map<string | THREE.Mesh, any>
  clearSelection: () => void
  setRotationCenter: (position: THREE.Vector3) => void
}

const hoveredObject = ref<InstanceData | null>(null)
const selectedObject = ref<InstanceData | null>(null)
const rotationCenter = ref<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
const objectMap = new Map<string | THREE.Mesh, any>()

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
    setRotationCenter,
  }
}
