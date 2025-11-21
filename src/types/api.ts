export interface ApiError {
  error: string
  message: string
  errorCode: number
}

export interface FileListItem {
  path: string
  name: string
}

export interface FileInfo {
  path: string
  name: string
  type: string | null
  size: string
  totalLines: number | null
  codeLines: number | null
  commentLines: number | null
  blankLines: number | null
  totalCommits: number | null
  commitsLastMonth: number
  commitsLastYear: number
  firstCommitDate: string
  lastCommitDate: string
  codeAgeDays: number
  codeAgeMonths: number
}

export interface CoupledFile {
  path: string
  sharedCommits: number
  percentage: number
}

export interface FileCoupling {
  path: string
  coupledFiles: CoupledFile[]
}

export interface AuthorContribution {
  name: string
  linesAdded: number | null
  commits: number
  percentage: number
}

export interface FileKnowledge {
  totalLinesAdded: number | null
  leadAuthor: string | null
  leadAuthorPercentage: number | null
  authors: number
  activeAuthors: number | null
  knowledgeLoss: number
  knowledgeRisk: string
  contributions: AuthorContribution[]
}

export interface FileDetails {
  info: FileInfo
  coupling: FileCoupling | null
  knowledge: FileKnowledge | null
}

export interface HotspotsDetails {
  path: string
  name: string
  commitsInHotspotAnalysisPeriod: number
  codeLines: number
  normalizedValue: number
}

export type FileListResponse = FileListItem[]
export type FileDetailsResponse = FileDetails
export type HotspotsResponse = HotspotsDetails
