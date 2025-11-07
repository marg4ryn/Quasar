import { ref } from 'vue'

type SelectBuildingCallback = (path: string) => boolean

const selectBuildingCallback = ref<SelectBuildingCallback | null>(null)

export function useCodeCityController() {
  function registerSelectBuilding(callback: SelectBuildingCallback) {
    selectBuildingCallback.value = callback
  }

  function unregisterSelectBuilding() {
    selectBuildingCallback.value = null
  }

  // Dla komponentów zewnętrznych - wywołuje zaznaczenie
  function selectBuilding(path: string): boolean {
    if (!selectBuildingCallback.value) {
      console.warn('City component not mounted')
      return false
    }
    return selectBuildingCallback.value(path)
  }

  return {
    registerSelectBuilding,
    unregisterSelectBuilding,
    selectBuilding
  }
}