export interface ApiError {
  error: string
  message: string
  errorCode: number
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

export interface StaticAnalysis {
  bugs: number
  vulnerabilities: number
  codeSmells: number
  complexity: number
  duplicatedLinesDensity: number
}

export interface FileDetails {
  info: FileInfo
  knowledge: FileKnowledge | null
  staticAnalysis: StaticAnalysis | null
}

export interface FileListItem {
  path: string
  name: string
}

export interface HotspotsDetails {
  path: string
  name: string
  normalizedValue: number
}

export interface CodeAgeDetails {
  path: string
  codeAgeDays: number
  normalizedValue: number
}

export interface CoupledFile {
  path: string
  sharedCommits: number
  percentage: number
}

export interface FileCouplingDetails {
  path: string
  coupledFiles: CoupledFile[]
}

export type FileListResponse = FileListItem[]
export type FileDetailsResponse = FileDetails
export type HotspotsResponse = HotspotsDetails
export type CodeAgeResponse = CodeAgeDetails
export type FileCouplingResponse = FileCouplingDetails
