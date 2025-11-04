import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createAnalysisConnection,
  AnalysisStatus,
  AnalysisResult,
} from '@/services/analysisConnection'

export interface AnalysisState {
  id: string
  screenId: string
  state: 'idle' | 'running' | 'completed' | 'error'
  status?: AnalysisStatus
  result?: AnalysisResult
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

  const initializeAnalysis = (screenId: string) => {
    if (!analyses.value.has(screenId)) {
      analyses.value.set(screenId, {
        id: `${screenId}-${Date.now()}`,
        screenId,
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
    initializeAnalysis(screenId)

    const analysis = analyses.value.get(screenId)!
    analysis.state = 'running'
    analysis.status = undefined
    analysis.error = undefined
    analysis.result = undefined
    analysis.startedAt = new Date()
    analysis.completedAt = undefined

    try {
      const connection = createAnalysisConnection(screenId, params, {
        onProgress: (status: AnalysisStatus) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.status = status
          }
        },
        onComplete: (result: AnalysisResult) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.state = 'completed'
            current.result = result
            current.completedAt = new Date()
          }
          closeConnection(screenId)
        },
        onError: (error: string) => {
          const current = analyses.value.get(screenId)
          if (current) {
            current.state = 'error'
            current.error = error
            current.completedAt = new Date()
          }
          closeConnection(screenId)
        },
      })

      connections.value.set(screenId, connection)
    } catch (error) {
      analysis.state = 'error'
      analysis.error = error instanceof Error ? error.message : 'Unknown error'
      analysis.completedAt = new Date()
    }
  }

  const stopAnalysis = (screenId: string) => {
    const analysis = analyses.value.get(screenId)
    if (analysis && analysis.state === 'running') {
      analysis.state = 'idle'
      analysis.status = undefined
      closeConnection(screenId)
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
