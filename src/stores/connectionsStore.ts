import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch } from 'vue'
import { createAnalysisConnection } from '@/services/analysisConnection'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { AnalysisState, AnalysisConnection } from '@/types'

const STORAGE_KEY = 'hotspotter-analyses'

const serializeAnalyses = (analyses: Map<string, AnalysisState>): string => {
  const serializable = Array.from(analyses.entries()).map(([key, value]) => [
    key,
    {
      ...value,
      startedAt: value.startedAt?.toISOString(),
      completedAt: value.completedAt?.toISOString(),
    },
  ])
  return JSON.stringify(serializable)
}

const deserializeAnalyses = (json: string): Map<string, AnalysisState> => {
  try {
    const parsed = JSON.parse(json)
    const map = new Map<string, AnalysisState>()

    parsed.forEach(([key, value]: [string, any]) => {
      map.set(key, {
        ...value,
        startedAt: value.startedAt ? new Date(value.startedAt) : undefined,
        completedAt: value.completedAt ? new Date(value.completedAt) : undefined,
        state: value.state,
        wasInterrupted: value.state === 'running',
      })
    })

    return map
  } catch (error) {
    console.error('Failed to deserialize analyses from localStorage:', error)
    return new Map()
  }
}

export const useConnectionStore = defineStore('connections', () => {
  const { t } = useI18n()

  const storedData = localStorage.getItem(STORAGE_KEY)
  const analyses = ref<Map<string, AnalysisState>>(
    storedData ? deserializeAnalyses(storedData) : new Map()
  )
  const connections = ref<Map<string, AnalysisConnection>>(new Map())

  watch(
    analyses,
    (newAnalyses) => {
      localStorage.setItem(STORAGE_KEY, serializeAnalyses(newAnalyses))
    },
    { deep: true }
  )

  const getConnection = (screenRoute: string) => {
    return computed(() => analyses.value.get(screenRoute))
  }

  const isRunning = (screenRoute: string) => {
    return computed(() => analyses.value.get(screenRoute)?.state === 'running')
  }

  const getAllRunning = computed(() => {
    return Array.from(analyses.value.values()).filter((a) => a.state === 'running')
  })

  const getInterruptedAnalyses = () => {
    return Array.from(analyses.value.values()).filter((a) => a.wasInterrupted)
  }

  const resumeInterruptedAnalyses = async () => {
    const notificationsStore = useNotificationsStore()
    const interrupted = getInterruptedAnalyses()

    if (interrupted.length === 0) {
      return
    }

    interrupted.forEach((analysis) => {
      const screenNameKey = analysis.screenName || analysis.screenRoute
      notificationsStore.addNotification({
        message: t('notifications.analysis.interrupted', {
          screen: t(screenNameKey),
        }),
        type: 'warning',
        screenRoute: analysis.screenRoute,
      })

      analysis.wasInterrupted = false
      analysis.state = 'idle'
    })

    setTimeout(() => {
      interrupted.forEach((analysis) => {
        startConnection(analysis.screenRoute, analysis.params)
      })
    }, 1000)
  }

  const initializeConnection = (screenRoute: string, screenName?: string) => {
    if (!analyses.value.has(screenRoute)) {
      analyses.value.set(screenRoute, {
        id: `${screenRoute}-${Date.now()}`,
        screenRoute,
        screenName: screenName || screenRoute,
        state: 'idle',
        wasInterrupted: false,
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
    analysis.params = params
    analysis.wasInterrupted = false

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
              message: t('notifications.analysis.completed', {
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
              message: t('notifications.analysis.failed', {
                screen: t(screenNameKey),
                error: t(error),
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
        message: t('notifications.analysis.start-failed', {
          screen: t(screenNameKey),
          error: t(analysis.error),
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
        message: t('notifications.analysis.cancelled', {
          screen: t(screenNameKey),
          error: t(analysis.error as string),
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
      analysis.wasInterrupted = false
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

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
    analyses.value.clear()
  }

  return {
    analyses,
    getConnection,
    isRunning,
    getAllRunning,
    getInterruptedAnalyses,
    resumeInterruptedAnalyses,
    initializeConnection,
    startConnection,
    stopConnection,
    resetConnection,
    closeConnection,
    closeAllConnections,
    clearStorage,
  }
})
