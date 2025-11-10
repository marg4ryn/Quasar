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
  DOWNLOADING = 0,
  PROCESSING_DATA = 1,
  ANALYZING = 2,
  SONAR = 3,
}

const ANALYSIS_STATUS_LABEL_KEYS: Record<AnalysisStatus, string> = {
  [AnalysisStatus.DOWNLOADING]: 'status.downloading',
  [AnalysisStatus.PROCESSING_DATA]: 'status.processingData',
  [AnalysisStatus.ANALYZING]: 'status.analyzing',
  [AnalysisStatus.SONAR]: 'status.sonar',
}

export function getAnalysisStatusLabelKey(status: AnalysisStatus): string {
  return ANALYSIS_STATUS_LABEL_KEYS[status] || 'analysis.status.unknown'
}
