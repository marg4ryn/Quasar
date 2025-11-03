import { computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysisStore'

export function useAnalysis(screenId: string) {
  const store = useAnalysisStore()

  store.initializeAnalysis(screenId)

  const analysis = store.getAnalysis(screenId)
  const isRunning = store.isRunning(screenId)
  const isBusy = computed(() => analysis.value?.status === 'running')
  const isCompleted = computed(() => analysis.value?.status === 'completed')
  const hasError = computed(() => analysis.value?.status === 'error')
  const progress = computed(() => analysis.value?.progress ?? undefined)
  const result = computed(() => analysis.value?.result)
  const error = computed(() => analysis.value?.error)

  const start = (params?: Record<string, any>) => {
    return store.startAnalysis(screenId, params)
  }

  const stop = () => {
    store.stopAnalysis(screenId)
  }

  return {
    analysis,
    isRunning,
    isBusy,
    isCompleted,
    hasError,
    progress,
    result,
    error,
    start,
    stop,
  }
}
