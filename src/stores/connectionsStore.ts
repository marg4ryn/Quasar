import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { createAnalysisConnection } from '@/services/analysisConnection'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { AnalysisState, AnalysisConnection } from '@/types'

export const useConnectionStore = defineStore('connections', () => {
  const { t } = useI18n()
  const analyses = ref<Map<string, AnalysisState>>(new Map())
  const connections = ref<Map<string, AnalysisConnection>>(new Map())

  const getConnection = (screenRoute: string) => {
    return computed(() => analyses.value.get(screenRoute))
  }

  const isRunning = (screenRoute: string) => {
    return computed(() => analyses.value.get(screenRoute)?.state === 'running')
  }

  const getAllRunning = computed(() => {
    return Array.from(analyses.value.values()).filter((a) => a.state === 'running')
  })

  const initializeConnection = (screenRoute: string, screenName?: string) => {
    if (!analyses.value.has(screenRoute)) {
      analyses.value.set(screenRoute, {
        id: `${screenRoute}-${Date.now()}`,
        screenRoute,
        screenName: screenName || screenRoute,
        state: 'idle',
      })
    }
  }

  const startConnection = async (
    screenRoute: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ) => {
    if (isRunning(screenRoute).value) {
      console.warn(`Analysis for route "${screenRoute}" is already running`)
      return
    }

    closeConnection(screenRoute)

    const analysis = analyses.value.get(screenRoute)
    if (!analysis) {
      console.error(`Analysis for route "${screenRoute}" not initialized`)
      return
    }

    analysis.state = 'running'
    analysis.status = undefined
    analysis.error = undefined
    analysis.result = undefined
    analysis.startedAt = new Date()
    analysis.completedAt = undefined

    const notificationsStore = useNotificationsStore()

    try {
      const connection = createAnalysisConnection(screenRoute, params, {
        onProgress: (status) => {
          const current = analyses.value.get(screenRoute)
          if (current) {
            current.status = status
          }
        },
        onComplete: (result) => {
          const current = analyses.value.get(screenRoute)
          if (current) {
            current.state = 'completed'
            current.result = result
            current.completedAt = new Date()

            const screenNameKey = current.screenName || screenRoute
            const duration = current.startedAt
              ? Math.round((current.completedAt.getTime() - current.startedAt.getTime()) / 1000)
              : 0

            notificationsStore.addNotification({
              message: t('analysis.completed', {
                screen: t(screenNameKey),
                duration,
              }),
              type: 'success',
              screenRoute: current.screenRoute,
            })
          }
          closeConnection(screenRoute)
        },
        onError: (error) => {
          const current = analyses.value.get(screenRoute)
          if (current) {
            current.state = 'error'
            current.error = error
            current.completedAt = new Date()

            const screenNameKey = current.screenName || screenRoute
            notificationsStore.addNotification({
              message: t('analysis.failed', {
                screen: t(screenNameKey),
                error,
              }),
              type: 'error',
            })
          }
          closeConnection(screenRoute)
        },
      })

      connections.value.set(screenRoute, connection)
    } catch (error) {
      analysis.state = 'error'
      analysis.error = error instanceof Error ? error.message : 'Unknown error'
      analysis.completedAt = new Date()

      const screenNameKey = analysis.screenName || screenRoute
      notificationsStore.addNotification({
        message: t('analysis.start_failed', {
          screen: t(screenNameKey),
          error: analysis.error,
        }),
        type: 'error',
      })
    }
  }

  const stopConnection = (screenRoute: string) => {
    const analysis = analyses.value.get(screenRoute)
    if (analysis && analysis.state === 'running') {
      analysis.state = 'idle'
      analysis.status = undefined
      closeConnection(screenRoute)

      const notificationsStore = useNotificationsStore()
      const screenNameKey = analysis.screenName || screenRoute
      notificationsStore.addNotification({
        message: t('analysis.cancelled', {
          screen: t(screenNameKey),
          error: analysis.error,
        }),
        type: 'info',
      })
    }
  }

  const resetConnection = (screenRoute: string) => {
    const analysis = analyses.value.get(screenRoute)
    if (analysis) {
      analysis.state = 'idle'
      analysis.status = undefined
      analysis.result = undefined
      analysis.error = undefined
      analysis.startedAt = undefined
      analysis.completedAt = undefined
    }
    closeConnection(screenRoute)
  }

  const closeConnection = (screenRoute: string) => {
    const connection = connections.value.get(screenRoute)
    if (connection) {
      connection.cleanup()
      connections.value.delete(screenRoute)
    }
  }

  const closeAllConnections = () => {
    connections.value.forEach((connection) => {
      connection.cleanup()
    })
    connections.value.clear()
  }

  return {
    analyses,
    getConnection,
    isRunning,
    getAllRunning,
    initializeConnection,
    startConnection,
    stopConnection,
    resetConnection,
    closeConnection,
    closeAllConnections,
  }
})
