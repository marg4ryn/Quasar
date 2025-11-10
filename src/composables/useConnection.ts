import { computed } from 'vue'
import { useConnectionStore } from '@/stores/connectionsStore'
import { getAnalysisStatusLabelKey } from '@/types'

export function useConnection(screenRoute: string, screenName?: string) {
  const store = useConnectionStore()

  store.initializeConnection(screenRoute, screenName)

  const analysis = store.getConnection(screenRoute)
  const isRunning = store.isRunning(screenRoute)
  const isBusy = computed(() => analysis.value?.state === 'running')
  const isCompleted = computed(() => analysis.value?.state === 'completed')
  const hasError = computed(() => analysis.value?.state === 'error')
  const isIdle = computed(() => analysis.value?.state === 'idle')
  const status = computed(() => analysis.value?.status)
  const statusLabel = computed(() =>
    status.value !== undefined ? getAnalysisStatusLabelKey(status.value) : undefined
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

  const durationFormatted = computed(() => {
    if (duration.value === undefined) return undefined
    const seconds = duration.value
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  })

  const start = (params?: Record<string, string | number | boolean | null | undefined>) => {
    return store.startConnection(screenRoute, params)
  }

  const stop = () => {
    store.stopConnection(screenRoute)
  }

  const reset = () => {
    store.resetConnection(screenRoute)
  }

  return {
    analysis,
    isRunning,
    isBusy,
    isCompleted,
    hasError,
    isIdle,
    status,
    statusLabel,
    result,
    error,
    startedAt,
    completedAt,
    duration,
    durationFormatted,
    start,
    stop,
    reset,
  }
}
