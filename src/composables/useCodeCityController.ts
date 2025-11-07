import { ref } from 'vue'

type SelectCityNodeCallback = (path: string | null) => boolean

const selectCityNodeCallback = ref<SelectCityNodeCallback | null>(null)

export function useCodeCityController() {
  function registerSelectCityNode(callback: SelectCityNodeCallback) {
    selectCityNodeCallback.value = callback
  }

  function unregisterSelectCityNode() {
    selectCityNodeCallback.value = null
  }

  // Dla komponentów zewnętrznych - wywołuje zaznaczenie
  function selectCityNode(path: string | null): boolean {
    if (!selectCityNodeCallback.value) {
      console.warn('City component not mounted')
      return false
    }
    return selectCityNodeCallback.value(path)
  }

  return {
    registerSelectCityNode,
    unregisterSelectCityNode,
    selectCityNode
  }
}