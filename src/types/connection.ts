export type ConnectionState = 'idle' | 'running' | 'completed' | 'error'

export interface AnalysisState {
  id: string
  screenRoute: string
  screenName?: string
  state: ConnectionState
  status?: AnalysisStatus
  result?: AnalysisResult
  error?: string
  startedAt?: Date
  completedAt?: Date
  params?: Record<string, string | number | boolean | null | undefined>
  wasInterrupted?: boolean
}

export interface AnalysisConnection {
  eventSource: EventSource
  cleanup: () => void
}

export interface AnalysisCallbacks {
  onProgress: (status: AnalysisStatus) => void
  onComplete: (result: AnalysisResult) => void
  onError: (error: string) => void
}

export interface AnalysisResult {
  success: boolean
  data: string
  timestamp: string
}

export enum AnalysisStatus {
  DOWNLOADING = 'DOWNLOADING',
  PROCESSING_DATA = 'PROCESSING_DATA',
  ANALYZING = 'ANALYZING',
  SONAR = 'SONAR',
}

const ANALYSIS_STATUS_LABEL_KEYS: Record<AnalysisStatus, string> = {
  [AnalysisStatus.DOWNLOADING]: 'status.downloading',
  [AnalysisStatus.PROCESSING_DATA]: 'status.processingData',
  [AnalysisStatus.ANALYZING]: 'status.analyzing',
  [AnalysisStatus.SONAR]: 'status.sonar',
}

export function getAnalysisStatusLabelKey(status: AnalysisStatus): string {
  return ANALYSIS_STATUS_LABEL_KEYS[status] || 'status.unknown'
}
