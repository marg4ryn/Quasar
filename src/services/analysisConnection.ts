import { useLogger } from '@/composables/useLogger'
import { AnalysisCallbacks, AnalysisConnection, AnalysisStatus, AnalysisResult } from '@/types'

const log = useLogger('analysisConnection')

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export function createAnalysisConnection(
  screenId: string,
  params?: Record<string, string | number | boolean | null | undefined>,
  callbacks?: AnalysisCallbacks
): AnalysisConnection {
  let eventSource: EventSource | null = null
  let retryCount = 0
  let isManualClose = false

  const buildUrl = (): string => {
    const baseUrl = `${import.meta.env.VITE_API_URL}analysis`
    if (!params) return baseUrl

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value))
    })

    return `${baseUrl}?${queryParams.toString()}`
  }

  const connect = (): void => {
    if (isManualClose) return

    const url = buildUrl()
    eventSource = new EventSource(url)

    eventSource.addEventListener('progress', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        const status = data.status as AnalysisStatus

        if (Object.values(AnalysisStatus).includes(status)) {
          log.info('Valid status received:', AnalysisStatus[status])
          callbacks?.onProgress(status)
        } else {
          log.warn('Unknown status received:', status)
        }
      } catch (error) {
        log.error('Failed to parse progress event:', error)
      }
    })

    eventSource.addEventListener('complete', (event: MessageEvent) => {
      try {
        const result: AnalysisResult = JSON.parse(event.data)

        if (typeof result.data !== 'string') {
          log.warn('Result data is not a string, converting...')
          result.data = JSON.stringify(result.data)
        }

        callbacks?.onComplete(result)
        cleanup()
      } catch (error) {
        log.error('Failed to parse complete event:', error)
        callbacks?.onError('errors.failedToParseCompletionData')
        cleanup()
      }
    })

    eventSource.addEventListener('error', (event: MessageEvent) => {
      try {
        const errorData = JSON.parse(event.data)
        const errorMessage = errorData.message || errorData.error || 'errors.serverError'
        log.error('Server error:', errorMessage)
        callbacks?.onError(errorMessage)
        cleanup()
      } catch (error) {
        log.error('Failed to parse error event:', error)
        callbacks?.onError('errors.unknownServerError')
        cleanup()
      }
    })

    eventSource.onerror = (event: Event) => {
      log.error('SSE connection error:', event)

      if (eventSource?.readyState === EventSource.CLOSED) {
        log.warn('Connection closed by server')
        eventSource.close()

        if (!isManualClose && retryCount < MAX_RETRIES) {
          retryCount++
          const delay = RETRY_DELAY * retryCount
          log.info(`Retrying connection (${retryCount}/${MAX_RETRIES}) in ${delay}ms...`)

          setTimeout(() => {
            connect()
          }, delay)
        } else if (retryCount >= MAX_RETRIES) {
          log.error('Connection failed after maximum retries')
          callbacks?.onError('errors.connectionFailedMaxRetries')
          cleanup()
        }
      }
    }

    eventSource.onopen = () => {
      log.info(`SSE connection opened for screenId="${screenId}"`)
      retryCount = 0
    }
  }

  const cleanup = (): void => {
    isManualClose = true
    if (eventSource) {
      log.info('Closing SSE connection')
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
