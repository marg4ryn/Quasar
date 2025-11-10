import { ref } from 'vue'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('useCodeCityController')

type SelectCityNodeCallback = (path: string | null) => boolean
type SetCityNodeHoverByPathCallback = (path: string | null) => boolean

const selectCityNodeCallback = ref<SelectCityNodeCallback | null>(null)
const setCityNodeHoverByPathCallback = ref<SetCityNodeHoverByPathCallback | null>(null)

export function useCodeCityController() {
  function registerSelectCityNode(callback: SelectCityNodeCallback) {
    selectCityNodeCallback.value = callback
  }

  function unregisterSelectCityNode() {
    selectCityNodeCallback.value = null
  }

  function registerSetCityNodeHoverByPath(callback: SetCityNodeHoverByPathCallback) {
    setCityNodeHoverByPathCallback.value = callback
  }

  function unregisterSetCityNodeHoverByPath() {
    setCityNodeHoverByPathCallback.value = null
  }

  function selectCityNode(path: string | null): boolean {
    if (!selectCityNodeCallback.value) {
      log.warn('City component not mounted')
      return false
    }
    return selectCityNodeCallback.value(path)
  }

  function setCityNodeHoverByPath(path: string | null): boolean {
    if (!setCityNodeHoverByPathCallback.value) {
      log.warn('City component not mounted')
      return false
    }
    return setCityNodeHoverByPathCallback.value(path)
  }

  return {
    registerSelectCityNode,
    unregisterSelectCityNode,
    selectCityNode,
    registerSetCityNodeHoverByPath,
    unregisterSetCityNodeHoverByPath,
    setCityNodeHoverByPath,
  }
}
