import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createAnalysisConnection } from '@/services/analysisConnection'

export interface AnalysisState {
  id: string
  screenId: string
  status: 'idle' | 'running' | 'completed' | 'error'
  progress?: any
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
    return computed(() => analyses.value.get(screenId)?.status === 'running')
  }

  const getAllRunning = computed(() => {
    return Array.from(analyses.value.values()).filter((a) => a.status === 'running')
  })

  const initializeAnalysis = (screenId: string) => {
    if (!analyses.value.has(screenId)) {
      analyses.value.set(screenId, {
        id: `${screenId}-${Date.now()}`,
        screenId,
        status: 'idle',
      })
    }
  }

  const startAnalysis = async (screenId: string, params?: Record<string, any>) => {
    if (isRunning(screenId).value) {
      console.warn(`Analysis for ${screenId} is already running`)
      return
    }

    closeConnection(screenId)
    initializeAnalysis(screenId)

    const analysis = analyses.value.get(screenId)!
    analysis.status = 'running'
    analysis.progress = undefined
    analysis.error = undefined
    analysis.result = undefined
    analysis.startedAt = new Date()
    analysis.completedAt = undefined

    try {
      const connection = createAnalysisConnection(screenId, params, {
        onProgress: (progress: any) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.progress = progress
          }
        },
        onComplete: (result: any) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.status = 'completed'
            current.result = result
            current.completedAt = new Date()
          }
          closeConnection(screenId)
        },
        onError: (error: string) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.status = 'error'
            current.error = error
            current.completedAt = new Date()
          }
          closeConnection(screenId)
        },
      })

      connections.value.set(screenId, connection)
    } catch (error) {
      analysis.status = 'error'
      analysis.error = error instanceof Error ? error.message : 'Unknown error'
      analysis.completedAt = new Date()
    }
  }

  const stopAnalysis = (screenId: string) => {
    const analysis = analyses.value.get(screenId)
    if (analysis && analysis.status === 'running') {
      analysis.status = 'idle'
      analysis.progress = undefined
      closeConnection(screenId)
    }
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
    closeConnection,
    closeAllConnections,
  }
})
