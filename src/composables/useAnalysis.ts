import { computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysisStore'
import {
  AnalysisStatus,
  AnalysisResult,
  getAnalysisStatusLabel,
} from '@/services/analysisConnection'

export function useAnalysis(screenId: string, screenName?: string, screenRoute?: string) {
  const store = useAnalysisStore()

  store.initializeAnalysis(screenId, screenName, screenRoute)

  const analysis = store.getAnalysis(screenId)
  const isRunning = store.isRunning(screenId)
  const isBusy = computed(() => analysis.value?.state === 'running')
  const isCompleted = computed(() => analysis.value?.state === 'completed')
  const hasError = computed(() => analysis.value?.state === 'error')
  const isIdle = computed(() => analysis.value?.state === 'idle')

  const status = computed(() => analysis.value?.status)
  const statusLabel = computed(() =>
    status.value !== undefined ? getAnalysisStatusLabel(status.value) : undefined
  )

  const result = computed(() => analysis.value?.result)
  const error = computed(() => analysis.value?.error)
  const startedAt = computed(() => analysis.value?.startedAt)
  const completedAt = computed(() => analysis.value?.completedAt)

  const duration = computed(() => {
    if (!startedAt.value) return undefined
    const end = completedAt.value || new Date()
    return Math.round((end.getTime() - startedAt.value.getTime()) / 1000)
  })

  const start = (params?: Record<string, any>) => {
    return store.startAnalysis(screenId, params)
  }

  const stop = () => {
    store.stopAnalysis(screenId)
  }

  const reset = () => {
    store.resetAnalysis(screenId)
  }

  return {
    // State
    analysis,
    isRunning,
    isBusy,
    isCompleted,
    hasError,
    isIdle,

    // Status
    status,
    statusLabel,

    // Results & errors
    result,
    error,

    // Time
    startedAt,
    completedAt,
    duration,

    // Actions
    start,
    stop,
    reset,
  }
}

export type { AnalysisStatus, AnalysisResult }
export { getAnalysisStatusLabel }
