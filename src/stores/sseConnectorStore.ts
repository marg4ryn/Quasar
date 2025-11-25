import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch } from 'vue'
import { createAnalysisConnection } from '@/services/sseConnector'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { Analysis, AnalysisConnection } from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('sseConnectorStore')
const STORAGE_KEY = 'sse-analyses'

const serializeAnalyses = (analyses: Map<string, Analysis>): string => {
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

const deserializeAnalyses = (json: string): Map<string, Analysis> => {
  try {
    const parsed = JSON.parse(json)
    const map = new Map<string, Analysis>()

    parsed.forEach(([key, value]: [string, any]) => {
      map.set(key, {
        ...value,
        startedAt: value.startedAt ? new Date(value.startedAt) : undefined,
        completedAt: value.completedAt ? new Date(value.completedAt) : undefined,
      })
    })

    return map
  } catch (error) {
    log.error('Failed to deserialize analyses from localStorage:', error)
    return new Map()
  }
}

export const useConnectionStore = defineStore('connections', () => {
  const { t } = useI18n()

  const storedData = localStorage.getItem(STORAGE_KEY)
  const analyses = ref<Map<string, Analysis>>(
    storedData ? deserializeAnalyses(storedData) : new Map()
  )
  const connections = ref<Map<string, AnalysisConnection>>(new Map())

  watch(
    analyses,
    (newAnalyses) => {
      localStorage.setItem(STORAGE_KEY, serializeAnalyses(newAnalyses))
    },
    { deep: true, flush: 'post' }
  )

  const getAnalysis = (analysisId: string) => {
    return computed(() => analyses.value.get(analysisId))
  }

  const isRunning = (analysisId: string) => {
    return computed(() => analyses.value.get(analysisId)?.state === 'running')
  }

  const initializeAnalysis = (analysisId: string, screenRoute: string, screenName: string) => {
    analyses.value.set(analysisId, {
      analysisId,
      screenRoute,
      screenName,
      state: 'idle',
    })
  }

  const startAnalysis = (analysisId: string, params?: Record<string, string>) => {
    const analysis = analyses.value.get(analysisId)
    if (!analysis) {
      log.error(`Analysis "${analysisId}" not initialized`)
      return
    }

    if (analysis.state === 'running') {
      log.warn(`Analysis "${analysisId}" is already running`)
      return
    }

    const existingConnection = connections.value.get(analysisId)
    if (existingConnection) {
      existingConnection.cleanup()
      connections.value.delete(analysisId)
    }

    analysis.state = 'running'
    analysis.status = undefined
    analysis.result = undefined
    analysis.error = undefined
    analysis.startedAt = new Date()
    analysis.completedAt = undefined
    analysis.params = params

    const notificationsStore = useNotificationsStore()

    const connection = createAnalysisConnection(
      analysisId,
      params,
      (status) => {
        const current = analyses.value.get(analysisId)
        if (current) {
          current.status = status
        }
      },
      (result) => {
        const current = analyses.value.get(analysisId)
        if (current) {
          current.state = 'completed'
          current.result = result
          current.completedAt = new Date()

          const screenNameKey = current.screenName || current.screenRoute
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
        connections.value.delete(analysisId)
      },
      (error) => {
        const current = analyses.value.get(analysisId)
        if (current) {
          current.state = 'error'
          current.error = error
          current.completedAt = new Date()

          const screenNameKey = current.screenName || current.screenRoute
          notificationsStore.addNotification({
            message: t('notifications.analysis.failed', {
              screen: t(screenNameKey),
              error: t(error),
            }),
            type: 'error',
          })
        }
        connections.value.delete(analysisId)
      }
    )

    connections.value.set(analysisId, connection)
  }

  const stopAnalysis = (analysisId: string) => {
    const connection = connections.value.get(analysisId)
    if (connection) {
      connection.cleanup()
      connections.value.delete(analysisId)
    }

    const analysis = analyses.value.get(analysisId)
    if (analysis && analysis.state === 'running') {
      analysis.state = 'idle'
      analysis.status = undefined

      const notificationsStore = useNotificationsStore()
      const screenNameKey = analysis.screenName || analysis.screenRoute
      notificationsStore.addNotification({
        message: t('notifications.analysis.cancelled', {
          screen: t(screenNameKey),
        }),
        type: 'info',
      })
    }
  }

  const clearAll = () => {
    analyses.value.clear()
  }

  return {
    analyses,
    getAnalysis,
    isRunning,
    initializeAnalysis,
    startAnalysis,
    stopAnalysis,
    clearAll,
  }
})
