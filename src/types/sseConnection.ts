export type ConnectionState = 'idle' | 'running' | 'completed' | 'error'

export interface Analysis {
  state?: ConnectionState
  status?: AnalysisStatus
  error?: string
  startedAt?: Date
  completedAt?: Date
}

export interface AnalysisConnection {
  cleanup: () => void
}

export enum AnalysisStatus {
  QUEUED = 'QUEUED',
  CLONING = 'CLONING',
  UPDATING = 'UPDATING',
  PROCESSING_DATA = 'PROCESSING_DATA',
  ANALYZING = 'ANALYZING',
  FINALIZING = 'FINALIZING',
}

const ANALYSIS_STATUS_LABEL_KEYS: Record<AnalysisStatus, string> = {
  [AnalysisStatus.QUEUED]: 'sse.status.queued',
  [AnalysisStatus.CLONING]: 'sse.status.cloning',
  [AnalysisStatus.UPDATING]: 'sse.status.updating',
  [AnalysisStatus.PROCESSING_DATA]: 'sse.status.processing-data',
  [AnalysisStatus.ANALYZING]: 'sse.status.analyzing',
  [AnalysisStatus.FINALIZING]: 'sse.status.finalizing',
}

export function getAnalysisStatusLabelKey(status: AnalysisStatus): string {
  return ANALYSIS_STATUS_LABEL_KEYS[status] || 'sse.status.unknown'
}
