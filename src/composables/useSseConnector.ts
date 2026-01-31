import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createAnalysisConnection } from '@/services/sseConnector'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { Analysis, AnalysisConnection, getAnalysisStatusLabelKey } from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('useSseConnector')
const analysis = ref<Analysis | null>(null)
const connection = ref<AnalysisConnection | null>(null)

export function useSseConnector() {
  const { t } = useI18n()

  const isRunning = computed(() => analysis.value?.state === 'running')
  const isCompleted = computed(() => analysis.value?.state === 'completed')
  const status = computed(() => analysis.value?.status)
  const statusLabel = computed(() =>
    status.value !== undefined ? getAnalysisStatusLabelKey(status.value) : undefined
  )

  const getAnalysisId = (): string | undefined => {
    if (analysis.value?.analysisId) {
      return analysis.value.analysisId
    }
    log.warn('Analysis ID not found')
    return undefined
  }

  const start = (params?: Record<string, string>) => {
    if (analysis.value?.state === 'running') {
      log.warn('Analysis is already running')
      return
    }

    analysis.value = {
      analysisId: undefined,
      state: 'running',
      status: undefined,
      error: undefined,
      startedAt: new Date(),
      completedAt: undefined,
    }

    const notificationsStore = useNotificationsStore()

    connection.value = createAnalysisConnection(
      params,
      (status) => {
        if (analysis.value) {
          analysis.value.status = status
        }
      },
      (result) => {
        if (analysis.value) {
          analysis.value.state = 'completed'
          analysis.value.completedAt = new Date()
          analysis.value.analysisId = result

          const duration = analysis.value.startedAt
            ? Math.round(
                (analysis.value.completedAt.getTime() - analysis.value.startedAt.getTime()) / 1000
              )
            : 0

          notificationsStore.addNotification({
            message: t('notifications.analysis.completed', {
              duration,
            }),
            type: 'success',
            screenRoute: '/repository-overview',
          })
        }
        connection.value = null
      },
      (error) => {
        if (analysis.value) {
          analysis.value.state = 'error'
          analysis.value.error = error
          analysis.value.completedAt = new Date()

          notificationsStore.addNotification({
            message: t('notifications.analysis.failed', {
              error: t(error),
            }),
            type: 'error',
          })
        }
        connection.value = null
      }
    )
  }

  const stop = () => {
    if (connection.value) {
      connection.value.cleanup()
      connection.value = null
    }

    if (analysis.value && analysis.value.state === 'running') {
      analysis.value.state = 'idle'
      analysis.value.status = undefined

      const notificationsStore = useNotificationsStore()
      notificationsStore.addNotification({
        message: t('notifications.analysis.cancelled'),
        type: 'info',
      })
    }
  }

  const setAnalysis = (newAnalysis: Analysis | null) => {
    analysis.value = newAnalysis
  }

  const clear = () => {
    if (connection.value) {
      connection.value.cleanup()
      connection.value = null
    }
    analysis.value = null
  }

  return {
    analysis: computed(() => analysis.value),
    isRunning,
    isCompleted,
    status,
    statusLabel,
    start,
    stop,
    setAnalysis,
    clear,
    getAnalysisId,
  }
}
