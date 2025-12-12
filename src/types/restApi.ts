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
  url: string
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

export interface ItemsListItem {
  path: string
  name: string
  type: string
}

export interface HotspotsDetails {
  path: string
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

export interface KnowledgeLossDetails {
  path: string
  knowledgeRisk: string
  knowledgeLoss: number
  normalizedValue: number
}

export interface AuthorsStatisticsDetails {
  name: string
  emails: string[]
  firstCommitDate: Date
  lastCommitDate: Date
  isActive: boolean
  daysSinceLastCommit: number
  commits: number
  linesAdded: number
  linesDeleted: number
  existingFilesModified: number
  filesAsLeadAuthor: number
}

export interface LeadAuthorsDetails {
  path: string
  leadAuthor: string
}

export interface FilesExtensionsDetails {
  path: string
  type: string
}

export interface CoupledAuthor {
  name: string
  sharedChanges: number
}

export interface AuthorData {
  name: string
  coupledAuthors: CoupledAuthor[]
}

export interface RepositoryInfo {
  id: string
  repositoryUrl: string
  repositoryName: string
  repositoryOwner: string
  repositoryPlatform: string
  analysisRangeStartDate: Date
  analysisRangeEndDate: Date
  lastCommitHash: string
  analysisStartedAt: Date
  analysisFinishedAt: Date
  analysisTimeInSeconds: number
}

export interface RepositoryStatistics {
  authors: number
  activeAuthors: number
  commits: number
  files: number
  codeLines: number
  commentLines: number
  blankLines: number
  fileTypeStatistics: FileTypeStatistics[]
}

export interface RepositoryStaticAnalysis {
  bugs: number
  vulnerabilities: number
  codeSmells: number
  complexity: number
  duplicatedLinesDensity: number
}

export interface FileTypeStatistics {
  fileType: string
  files: number
  codeLines: number
  commentLines: number
  blankLines: number
}

export interface RepositoryDetails {
  info: RepositoryInfo
  statistics: RepositoryStatistics
  staticAnalysis: RepositoryStaticAnalysis
}

export interface AnalysisTrendsDetails {
  date: Date
  commits: number
  uniqueAuthors: number
  activeAuthors: number
  linesAdded: number
  linesDeleted: number
}

export interface Commit {
  hash: string
  date: string
  author: string
  linesAdded: number
  linesDeleted: number
}

export interface VersionStatistics {
  date: string
  url: string
  totalLines: number
  codeLines: number
  commentLines: number
  blankLines: number
  complexity: number
  methods: number
}

export interface XRayDetails {
  analysisId: string
  filePath: string
  analysisStartedAt: string
  analysisFinishedAt: string
  analysisTimeInSeconds: number
  commits: Commit[]
  versionsStatistics: VersionStatistics[]
  versions: number
}

interface AnalysisHistoryItem {
  id: string
  repositoryUrl: string
  startedAt: string
  startDate: string
  endDate: string
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS'
}

interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number,
  size?: number,
  first?: boolean,
  last?: boolean
}

export type ItemsListResponse = ItemsListItem[]
export type FileDetailsResponse = FileDetails
export type HotspotsResponse = HotspotsDetails
export type CodeAgeResponse = CodeAgeDetails
export type FileCouplingResponse = FileCouplingDetails
export type KnowledgeLossResponse = KnowledgeLossDetails
export type AuthorsStatisticsResponse = AuthorsStatisticsDetails
export type LeadAuthorsResponse = LeadAuthorsDetails
export type FilesExtensionsResponse = FilesExtensionsDetails
export type AuthorCouplingResponse = AuthorData
export type RepositoryResponse = RepositoryDetails
export type AnalysisTrendsResponse = AnalysisTrendsDetails[]
export type XRayResponse = XRayDetails
export type AnalysisHistoryResponseItem = AnalysisHistoryItem
export type AnalysisHistoryResponse = PageResponse<AnalysisHistoryItem>
