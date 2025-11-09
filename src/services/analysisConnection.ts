import { useLogger } from '@/composables/useLogger'
import { AnalysisCallbacks, AnalysisStatus, ANALYSIS_STATUS_LABELS, AnalysisResult } from '@/types'

const log = useLogger('analysisConnection')

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export function createAnalysisConnection(
  screenId: string,
  params?: Record<string, any>,
  callbacks?: AnalysisCallbacks
) {
  let eventSource: EventSource | null = null
  let retryCount = 0
  let isManualClose = false

  const buildUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL + `analysis`
    if (!params) return baseUrl

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value))
    })

    return `${baseUrl}?${queryParams.toString()}`
  }

  const connect = () => {
    if (isManualClose) return

    const url = buildUrl()
    eventSource = new EventSource(url)

    eventSource.addEventListener('progress', (event: MessageEvent) => {
      log.info('📡 [SSE:progress] Event received:', event)

      try {
        const data = JSON.parse(event.data)
        const status = data.status as AnalysisStatus
        log.info('📊 [SSE:progress] Parsed data:', data)

        if (status in AnalysisStatus) {
          log.info('✅ [SSE:progress] Valid status received:', status)
          callbacks?.onProgress(status)
        } else {
          log.warn('⚠️ [SSE:progress] Unknown status received:', status)
        }
      } catch (error) {
        log.error('❌ [SSE:progress] Failed to parse progress event:', error)
        log.info('Raw event data:', event.data)
      }
    })

    eventSource.addEventListener('complete', (event: MessageEvent) => {
      log.info('📡 [SSE:complete] Event received:', event)

      try {
        const result: AnalysisResult = JSON.parse(event.data)
        log.info('🎯 [SSE:complete] Parsed result:', result)
        callbacks?.onComplete(result)
        cleanup()
      } catch (error) {
        log.error('❌ [SSE:complete] Failed to parse complete event:', error)
        log.info('Raw event data:', event.data)
        callbacks?.onError('Failed to parse completion data')
        cleanup()
      }
    })

    eventSource.addEventListener('error', (event: MessageEvent) => {
      log.info('📡 [SSE:error] Error event received:', event)

      try {
        const errorData = JSON.parse(event.data)
        log.error('🚨 [SSE:error] Parsed error from server:', errorData)
        callbacks?.onError(errorData.message || 'Server error')
        cleanup()
      } catch (error) {
        log.error('❌ [SSE:error] Failed to parse error event:', error)
        log.info('Raw event data:', event.data)
        callbacks?.onError('Unknown server error')
        cleanup()
      }
    })

    eventSource.onerror = (event) => {
      log.error('💥 [SSE:onerror] SSE connection error:', event)
      try {
        if (eventSource?.readyState === EventSource.CLOSED) {
          log.warn('🔌 [SSE:onerror] Connection closed by server.')

          eventSource?.close()

          if (!isManualClose && retryCount < MAX_RETRIES) {
            retryCount++
            log.info(
              `🔁 [SSE:retry] Retrying connection (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY * retryCount}ms...`
            )
            setTimeout(() => {
              connect()
            }, RETRY_DELAY * retryCount)
          } else {
            log.error('🛑 [SSE:onerror] Connection failed after multiple retries')
            callbacks?.onError('Connection failed after multiple retries')
            cleanup()
          }
        }
      } catch (error) {
        log.error(error)
      }
    }

    eventSource.onopen = () => {
      log.info(`🟢 [SSE:onopen] SSE connection successfully opened for screenId=${screenId}`)
      retryCount = 0
    }
  }

  const cleanup = () => {
    isManualClose = true
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  connect()

  return {
    eventSource: eventSource!,
    cleanup,
  }
}

export function getAnalysisStatusLabel(status: AnalysisStatus): string {
  return ANALYSIS_STATUS_LABELS[status] || 'Nieznany status'
}
