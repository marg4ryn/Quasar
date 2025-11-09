import { ref } from 'vue'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('useCodeCityController')

type SelectCityNodeCallback = (path: string | null) => boolean

const selectCityNodeCallback = ref<SelectCityNodeCallback | null>(null)

export function useCodeCityController() {
  function registerSelectCityNode(callback: SelectCityNodeCallback) {
    selectCityNodeCallback.value = callback
  }

  function unregisterSelectCityNode() {
    selectCityNodeCallback.value = null
  }

  function selectCityNode(path: string | null): boolean {
    if (!selectCityNodeCallback.value) {
      log.warn('City component not mounted')
      return false
    }
    return selectCityNodeCallback.value(path)
  }

  return {
    registerSelectCityNode,
    unregisterSelectCityNode,
    selectCityNode,
  }
}
