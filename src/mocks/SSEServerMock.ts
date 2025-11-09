import { AnalysisStatus, AnalysisResult } from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('mockSSEServer')

export class MockSSEServer {
  private static instances = new Map<string, MockSSEServerInstance>()
  private static isInitialized = false

  static initialize() {
    if (this.isInitialized) return

    const OriginalEventSource = window.EventSource

    window.EventSource = class MockEventSource extends EventTarget {
      readonly CONNECTING = 0
      readonly OPEN = 1
      readonly CLOSED = 2

      readyState = this.CONNECTING
      url: string
      withCredentials = false

      private instance: MockSSEServerInstance | null = null

      constructor(url: string, config?: EventSourceInit) {
        super()
        this.url = url

        if (url.includes('/api/analysis')) {
          log.info('Intercepting:', url)
          this.instance = MockSSEServer.createInstance(url, this)
        } else {
          log.info('Using real EventSource for:', url)
          return new OriginalEventSource(url, config) as any
        }
      }

      close() {
        if (this.instance) {
          this.instance.close()
          this.readyState = this.CLOSED
        }
      }

      addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        super.addEventListener(type, listener)
      }

      removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        super.removeEventListener(type, listener)
      }
    } as any

    this.isInitialized = true
    log.info('Initialized')
  }

  static createInstance(url: string, eventSource: EventTarget): MockSSEServerInstance {
    const instance = new MockSSEServerInstance(url, eventSource)
    this.instances.set(url, instance)
    return instance
  }

  static reset() {
    this.instances.forEach((instance) => instance.close())
    this.instances.clear()
  }
}

class MockSSEServerInstance {
  private isRunning = false
  private abortController: AbortController | null = null

  constructor(
    private url: string,
    private eventSource: EventTarget
  ) {
    this.start()
  }

  private async start() {
    this.isRunning = true
    this.abortController = new AbortController()

    const urlObj = new URL(this.url, window.location.origin)
    const params = Object.fromEntries(
      Array.from(urlObj.searchParams.entries()) as [string, string][]
    )

    log.info('Starting with params:', params)

    setTimeout(() => {
      const openEvent = new Event('open')
      this.eventSource.dispatchEvent(openEvent)
      ;(this.eventSource as any).readyState = 1
    }, 100)

    const statuses = [
      AnalysisStatus.INITIALIZING,
      AnalysisStatus.PROCESSING_DATA,
      AnalysisStatus.ANALYZING,
      AnalysisStatus.GENERATING_RESULTS,
      AnalysisStatus.FINALIZING,
    ]

    try {
      for (const status of statuses) {
        if (this.abortController.signal.aborted) {
          return
        }

        await this.delay(2000)

        const progressEvent = new MessageEvent('progress', {
          data: JSON.stringify({ status }),
        })
        this.eventSource.dispatchEvent(progressEvent)
      }

      await this.delay(1000)

      const result: AnalysisResult = {
        success: true,
        data: {
          summary: {
            totalRecords: Math.floor(Math.random() * 1000),
            dateRange: params,
          },
        },
        timestamp: new Date().toISOString(),
        metadata: {
          processingTime: 10000,
          recordsProcessed: Math.floor(Math.random() * 1000),
        },
      }

      const completeEvent = new MessageEvent('complete', {
        data: JSON.stringify(result),
      })
      this.eventSource.dispatchEvent(completeEvent)
    } catch (error) {
      const errorEvent = new MessageEvent('error', {
        data: JSON.stringify({ message: 'Mock error' }),
      })
      this.eventSource.dispatchEvent(errorEvent)
    } finally {
      this.isRunning = false
    }
  }

  close() {
    if (this.abortController) {
      this.abortController.abort()
    }
    this.isRunning = false
    ;(this.eventSource as any).readyState = 2
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, ms)
      this.abortController?.signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        resolve()
      })
    })
  }
}
