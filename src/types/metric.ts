import { t } from '@/plugins/i18n'
import { CityNode } from '@/types'
import type { FileDetails } from '@/types/restApi'
import { formatDate, formatDaysOnly } from '@/utils/dateFormatter'

export interface MetricsStore {
  fileDetails?: Map<string, FileDetails>
}

export type MetricType =
  | 'name'
  | 'path'
  | 'height'
  | 'width'
  | 'fileType'
  | 'fileSize'
  | 'totalLines'
  | 'codeLines'
  | 'commentLines'
  | 'blankLines'
  | 'totalCommits'
  | 'firstCommitDate'
  | 'lastCommitDate'
  | 'commitsLastMonth'
  | 'commitsLastYear'
  | 'leadAuthor'
  | 'totalLinesAdded'
  | 'activeAuthors'
  | 'knowledgeRisk'
  | 'knowledgeLoss'
  | 'bugs'
  | 'vulnerabilities'
  | 'codeSmells'
  | 'complexity'
  | 'duplicatedLinesDensity'

export interface MetricItem {
  type: MetricType
  label: string
  getValue: (node: CityNode, metrics?: MetricsStore) => string | number | null
  getStyle?: (node: CityNode, metrics?: MetricsStore) => Record<string, string> | null
  requiresApi?: boolean
  description?: string
}

export const allMetrics: MetricItem[] = [
  {
    type: 'name',
    label: 'metrics.name',
    getValue: (node: CityNode) => node.name,
    getStyle: () => ({
      fontFamily: 'var(--font-family-monospace)',
    }),
    requiresApi: false,
  },
  {
    type: 'path',
    label: 'metrics.path',
    getValue: (node: CityNode) => node.path,
    getStyle: () => ({
      fontFamily: 'var(--font-family-monospace)',
    }),
    requiresApi: false,
  },
  {
    type: 'height',
    label: 'metrics.height',
    getValue: (node: CityNode) => node.height ?? null,
    requiresApi: false,
  },
  {
    type: 'width',
    label: 'metrics.width',
    getValue: (node: CityNode) => node.width ?? null,
    requiresApi: false,
  },

  {
    type: 'fileSize',
    label: 'metrics.fileSize',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.size ?? null
    },
    requiresApi: true,
  },
  {
    type: 'fileType',
    label: 'metrics.fileType',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.type ?? null
    },
    requiresApi: true,
  },
  {
    type: 'totalLines',
    label: 'metrics.totalLines',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.totalLines ?? null
    },
    requiresApi: true,
  },
  {
    type: 'codeLines',
    label: 'metrics.codeLines',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.codeLines ?? null
    },
    requiresApi: true,
  },
  {
    type: 'commentLines',
    label: 'metrics.commentLines',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.commentLines ?? null
    },
    requiresApi: true,
  },
  {
    type: 'blankLines',
    label: 'metrics.blankLines',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.blankLines ?? null
    },
    requiresApi: true,
  },
  {
    type: 'totalCommits',
    label: 'metrics.totalCommits',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.totalCommits ?? null
    },
    requiresApi: true,
  },
  {
    type: 'firstCommitDate',
    label: 'metrics.firstCommitDate',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const date = details?.info?.firstCommitDate
      if (!date) return null
      return formatDate(date)
    },
    requiresApi: true,
  },
  {
    type: 'lastCommitDate',
    label: 'metrics.lastCommitDate',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const date = details?.info?.lastCommitDate
      if (!date) return null
      return `${formatDate(date)} (${formatDaysOnly(details?.info?.codeAgeDays)})`
    },
    requiresApi: true,
    description: 'metrics.dateInfo',
  },
  {
    type: 'commitsLastMonth',
    label: 'metrics.commitsLastMonth',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.commitsLastMonth ?? null
    },
    requiresApi: true,
    description: 'metrics.dateInfo',
  },
  {
    type: 'commitsLastYear',
    label: 'metrics.commitsLastYear',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.info?.commitsLastYear ?? null
    },
    requiresApi: true,
    description: 'metrics.dateInfo',
  },
  {
    type: 'leadAuthor',
    label: 'metrics.leadAuthor',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const leadAuthor = details?.knowledge?.leadAuthor
      const percentage = details?.knowledge?.leadAuthorPercentage
      if (!leadAuthor) return null
      return percentage ? `${leadAuthor} (${percentage.toFixed(1)}%)` : leadAuthor
    },
    requiresApi: true,
    description: 'metrics.leadAuthorInfo',
  },
  {
    type: 'totalLinesAdded',
    label: 'metrics.totalLinesAdded',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.knowledge?.totalLinesAdded ?? null
    },
    requiresApi: true,
    description: 'metrics.totalLinesAddedInfo',
  },
  {
    type: 'knowledgeRisk',
    label: 'metrics.knowledgeRisk',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      if (!details?.knowledge?.knowledgeRisk) return null

      const riskLabels = {
        ABANDONED: t('metrics.knowledgeRiskEnum.abandoned'),
        SINGLE_OWNER: t('metrics.knowledgeRiskEnum.singleOwner'),
        BALANCED: t('metrics.knowledgeRiskEnum.balanced'),
        DIFFUSED: t('metrics.knowledgeRiskEnum.diffused'),
        UNKNOWN: t('metrics.knowledgeRiskEnum.unknown'),
      }

      return riskLabels[details.knowledge.knowledgeRisk as keyof typeof riskLabels]
    },
    requiresApi: true,
    description: 'metrics.knowledgeRiskInfo',
  },
  {
    type: 'knowledgeLoss',
    label: 'metrics.knowledgeLoss',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const loss = details?.knowledge?.knowledgeLoss
      return loss != null ? `${loss.toFixed(1)}%` : null
    },
    requiresApi: true,
    description: 'metrics.knowledgeLossInfo',
  },
  {
    type: 'activeAuthors',
    label: 'metrics.activeAuthors',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const active = details?.knowledge?.activeAuthors
      const total = details?.knowledge?.authors
      if (active == null || total == null) return null
      return `${active}/${total}`
    },
    requiresApi: true,
    description: 'metrics.activeAuthorsInfo',
  },
  {
    type: 'bugs',
    label: 'metrics.bugs',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.staticAnalysis?.bugs ?? null
    },
    requiresApi: true,
    description: 'metrics.bugsInfo',
  },
  {
    type: 'vulnerabilities',
    label: 'metrics.vulnerabilities',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.staticAnalysis?.vulnerabilities ?? null
    },
    requiresApi: true,
    description: 'metrics.vulnerabilitiesInfo',
  },
  {
    type: 'codeSmells',
    label: 'metrics.codeSmells',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.staticAnalysis?.codeSmells ?? null
    },
    requiresApi: true,
    description: 'metrics.codeSmellsInfo',
  },
  {
    type: 'complexity',
    label: 'metrics.complexity',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      return details?.staticAnalysis?.complexity ?? null
    },
    requiresApi: true,
    description: 'metrics.complexityInfo',
  },
  {
    type: 'duplicatedLinesDensity',
    label: 'metrics.duplicatedLinesDensity',
    getValue: (node: CityNode, metrics?: MetricsStore) => {
      const details = metrics?.fileDetails?.get(node.path)
      const duplicatedLinesDensity = details?.staticAnalysis?.duplicatedLinesDensity
      if (!duplicatedLinesDensity && duplicatedLinesDensity !== 0) return null
      return `${duplicatedLinesDensity.toFixed(1)}%`
    },
    requiresApi: true,
  },
]

export function getMetricsByTypes(types: MetricType[]): MetricItem[] {
  return types
    .map((type) => allMetrics.find((m) => m.type === type))
    .filter((metric): metric is MetricItem => metric !== undefined)
}

export function requiresApiData(metricTypes: MetricType[]): boolean {
  return getMetricsByTypes(metricTypes).some((m) => m.requiresApi)
}
