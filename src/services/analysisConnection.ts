interface AnalysisCallbacks {
  onProgress: (progress: any) => void
  onComplete: (result: any) => void
  onError: (error: string) => void
}

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
    const baseUrl = `/api/analysis/${screenId}`
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
      try {
        const data = JSON.parse(event.data)
        callbacks?.onProgress(data.progress)
      } catch (error) {
        console.error('Failed to parse progress event:', error)
      }
    })

    eventSource.addEventListener('complete', (event: MessageEvent) => {
      try {
        const result = JSON.parse(event.data)
        callbacks?.onComplete(result)
        cleanup()
      } catch (error) {
        console.error('Failed to parse complete event:', error)
        callbacks?.onError('Failed to parse completion data')
        cleanup()
      }
    })

    eventSource.addEventListener('error-msg', (event: MessageEvent) => {
      try {
        const errorData = JSON.parse(event.data)
        callbacks?.onError(errorData.message || 'Server error')
        cleanup()
      } catch (error) {
        console.error('Failed to parse error event:', error)
        callbacks?.onError('Unknown server error')
        cleanup()
      }
    })

    eventSource.onerror = (event) => {
      console.error('SSE connection error:', event)

      if (eventSource?.readyState === EventSource.CLOSED) {
        eventSource?.close()

        if (!isManualClose && retryCount < MAX_RETRIES) {
          retryCount++
          console.log(`Retrying connection (${retryCount}/${MAX_RETRIES})...`)
          setTimeout(() => {
            connect()
          }, RETRY_DELAY * retryCount)
        } else {
          callbacks?.onError('Connection failed after multiple retries')
          cleanup()
        }
      }
    }

    eventSource.onopen = () => {
      console.log(`SSE connection opened for ${screenId}`)
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
