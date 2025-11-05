import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createAnalysisConnection } from '@/services/analysisConnection'
import { useNotificationsStore } from '@/stores/notificationsStore'

export interface AnalysisState {
  id: string
  screenId: string
  screenName?: string
  screenRoute?: string
  state: 'idle' | 'running' | 'completed' | 'error'
  status?: any
  result?: any
  error?: string
  startedAt?: Date
  completedAt?: Date
}

interface AnalysisConnection {
  eventSource: EventSource
  cleanup: () => void
}

export const useAnalysisStore = defineStore('analysis', () => {
  const analyses = ref<Map<string, AnalysisState>>(new Map())
  const connections = ref<Map<string, AnalysisConnection>>(new Map())

  const getAnalysis = (screenId: string) => {
    return computed(() => analyses.value.get(screenId))
  }

  const isRunning = (screenId: string) => {
    return computed(() => analyses.value.get(screenId)?.state === 'running')
  }

  const getAllRunning = computed(() => {
    return Array.from(analyses.value.values()).filter((a) => a.state === 'running')
  })

  const initializeAnalysis = (screenId: string, screenName?: string, screenRoute?: string) => {
    if (!analyses.value.has(screenId)) {
      analyses.value.set(screenId, {
        id: `${screenId}-${Date.now()}`,
        screenId,
        screenName,
        screenRoute,
        state: 'idle',
      })
    }
  }

  const startAnalysis = async (screenId: string, params?: Record<string, any>) => {
    if (isRunning(screenId).value) {
      console.warn(`Analysis for ${screenId} is already running`)
      return
    }

    closeConnection(screenId)

    const analysis = analyses.value.get(screenId)
    if (!analysis) {
      console.error(`Analysis ${screenId} not initialized`)
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
      const connection = createAnalysisConnection(screenId, params, {
        onProgress: (status: any) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.status = status
          }
        },
        onComplete: (result: any) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.state = 'completed'
            current.result = result
            current.completedAt = new Date()

            const screenName = current.screenName || screenId
            const duration = current.startedAt
              ? Math.round((current.completedAt.getTime() - current.startedAt.getTime()) / 1000)
              : 0

            notificationsStore.addNotification({
              message: `Analysis "${screenName}" completed successfully in ${duration}s`,
              type: 'success',
              screenId: current.screenId,
              screenRoute: current.screenRoute,
            })
          }
          closeConnection(screenId)
        },
        onError: (error: string) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.state = 'error'
            current.error = error
            current.completedAt = new Date()

            const screenName = current.screenName || screenId
            notificationsStore.addNotification({
              message: `Analysis "${screenName}" failed: ${error}`,
              type: 'error',
              screenId: current.screenId,
              screenRoute: current.screenRoute,
            })
          }
          closeConnection(screenId)
        },
      })

      connections.value.set(screenId, connection)
    } catch (error) {
      analysis.state = 'error'
      analysis.error = error instanceof Error ? error.message : 'Unknown error'
      analysis.completedAt = new Date()

      const screenName = analysis.screenName || screenId
      notificationsStore.addNotification({
        message: `Analysis "${screenName}" failed to start: ${analysis.error}`,
        type: 'error',
        screenId: analysis.screenId,
        screenRoute: analysis.screenRoute,
      })
    }
  }

  const stopAnalysis = (screenId: string) => {
    const analysis = analyses.value.get(screenId)
    if (analysis && analysis.state === 'running') {
      analysis.state = 'idle'
      analysis.status = undefined
      closeConnection(screenId)

      const notificationsStore = useNotificationsStore()
      const screenName = analysis.screenName || screenId
      notificationsStore.addNotification({
        message: `Analysis "${screenName}" was cancelled`,
        type: 'info',
        screenId: analysis.screenId,
        screenRoute: analysis.screenRoute,
      })
    }
  }

  const resetAnalysis = (screenId: string) => {
    const analysis = analyses.value.get(screenId)
    if (analysis) {
      analysis.state = 'idle'
      analysis.status = undefined
      analysis.result = undefined
      analysis.error = undefined
      analysis.startedAt = undefined
      analysis.completedAt = undefined
    }
    closeConnection(screenId)
  }

  const closeConnection = (screenId: string) => {
    const connection = connections.value.get(screenId)
    if (connection) {
      connection.cleanup()
      connections.value.delete(screenId)
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
    getAnalysis,
    isRunning,
    getAllRunning,
    initializeAnalysis,
    startAnalysis,
    stopAnalysis,
    resetAnalysis,
    closeConnection,
    closeAllConnections,
  }
})
