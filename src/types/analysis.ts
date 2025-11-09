export type AnalysisStateType = 'idle' | 'running' | 'completed' | 'error'

export interface AnalysisState {
  id: string
  screenId: string
  screenName?: string
  screenRoute?: string
  state: AnalysisStateType
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

export enum AnalysisStatus {
  INITIALIZING = 0,
  PROCESSING_DATA = 1,
  ANALYZING = 2,
  GENERATING_RESULTS = 3,
  FINALIZING = 4,
  COMPLETED = 5,
}

export const ANALYSIS_STATUS_LABELS: Record<AnalysisStatus, string> = {
  [AnalysisStatus.INITIALIZING]: 'Initializing analysis...',
  [AnalysisStatus.PROCESSING_DATA]: 'Data processing...',
  [AnalysisStatus.ANALYZING]: 'Analysis in progress...',
  [AnalysisStatus.GENERATING_RESULTS]: 'Generating results...',
  [AnalysisStatus.FINALIZING]: 'Finalization...',
  [AnalysisStatus.COMPLETED]: 'Completed',
}

export interface AnalysisResult {
  success: boolean
  data: any
  timestamp: string
  metadata?: {
    processingTime?: number
    recordsProcessed?: number
    [key: string]: any
  }
}
