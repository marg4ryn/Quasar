<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <div class="page-wrapper">
    <div class="header-section">
      <TabNavigation class="tab-nav" :tabs="tabs" />
    </div>

    <div class="repository-overview" v-if="detailsRef">
      <div class="stats-grid">
        <!-- Repository Info Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.repositoryInfo.title') }}</h3>
          </div>

          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.repository')
              }}</span>
              <span class="metric-value">{{ detailsRef.info.repositoryName }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('repositoryOverview.repositoryInfo.owner') }}</span>
              <span class="metric-value">{{ detailsRef.info.repositoryOwner }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.platform')
              }}</span>
              <span class="metric-value">{{ detailsRef.info.repositoryPlatform }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('repositoryOverview.repositoryInfo.url') }}</span>
              <span class="metric-value" :style="{ fontFamily: 'var(--font-family-monospace)' }">
                {{ detailsRef.info.repositoryUrl }}
              </span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.analysisRangeStartDate')
              }}</span>
              <span class="metric-value">{{
                formatDate(detailsRef.info.analysisRangeStartDate)
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.analysisRangeEndDate')
              }}</span>
              <span class="metric-value">{{
                formatDate(detailsRef.info.analysisRangeEndDate)
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.analysisFinishedAt')
              }}</span>
              <span class="metric-value">{{
                formatDateTime(detailsRef.info.analysisFinishedAt)
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.repositoryInfo.analysisTime')
              }}</span>
              <span class="metric-value">{{ detailsRef.info.analysisTimeInSeconds }} s</span>
            </div>
          </div>
        </div>

        <!-- Commit Trends Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.commitTrends.title') }}</h3>
          </div>
          <TimelineChart
            v-if="commitData"
            :showLegend="false"
            :datasets="[
              {
                label: '',
                data: commitData,
                color: ChartColor.Blue,
                tooltipDesc: t('repositoryOverview.commitTrends.tooltip'),
                yAxisID: 'left',
              },
            ]"
          />
        </div>

        <!-- Code Changes Card -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.codeChanges.title') }}</h3>
          </div>
          <CodeChurnChart v-if="churnData" :data="churnData" />
        </div>

        <!-- Top Authors Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.topAuthors.title') }}</h3>
          </div>
          <div class="card-content">
            <div v-if="!authorData?.length" class="no-data">
              {{ t('repositoryOverview.topAuthors.placeholder') }}
            </div>
            <div v-else class="authors-list">
              <div v-for="(author, index) in authorData" :key="author.name" class="author-item">
                <div class="author-rank">{{ index + 1 }}</div>
                <div class="author-info">
                  <div class="author-name">{{ author.name }}</div>
                  <div class="author-stats">
                    <span class="stat">
                      <span class="stat-label"
                        >{{ t('repositoryOverview.topAuthors.files') }}:</span
                      >
                      <span class="stat-value">{{ author.filesCount }}</span>
                    </span>
                    <span class="stat">
                      <span class="stat-label"
                        >{{ t('repositoryOverview.topAuthors.commits') }}:</span
                      >
                      <span class="stat-value">{{ author.commits }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Developer Count Trends Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.developerCountTrends.title') }}</h3>
          </div>
          <TimelineChart
            v-if="uniqueAuthorsData && activeAuthorsData"
            :datasets="[
              {
                label: t('repositoryOverview.developerCountTrends.labelUnique'),
                data: uniqueAuthorsData,
                color: ChartColor.Purple,
                tooltipDesc: t('repositoryOverview.developerCountTrends.tooltipUnique'),
                yAxisID: 'left',
              },
              {
                label: t('repositoryOverview.developerCountTrends.labelActive'),
                data: activeAuthorsData,
                color: ChartColor.Pink,
                tooltipDesc: t('repositoryOverview.developerCountTrends.tooltipActive'),
                yAxisID: 'left',
              },
            ]"
          />
        </div>

        <!-- Analysis Statistics Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">
              {{ t('repositoryOverview.analysisStatistics.title') }}
            </h3>
          </div>

          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.authors')
              }}</span>
              <span class="metric-value">{{ detailsRef.statistics.authors }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.activeAuthors')
              }}</span>
              <span class="metric-value">{{ detailsRef.statistics.activeAuthors }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.commits')
              }}</span>
              <span class="metric-value">{{ detailsRef.statistics.commits }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.files')
              }}</span>
              <span class="metric-value">{{ detailsRef.statistics.files }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.codeLines')
              }}</span>
              <span class="metric-value">{{
                detailsRef.statistics.codeLines.toLocaleString()
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.commentLines')
              }}</span>
              <span class="metric-value">{{
                detailsRef.statistics.commentLines.toLocaleString()
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{
                t('repositoryOverview.analysisStatistics.blankLines')
              }}</span>
              <span class="metric-value">{{
                detailsRef.statistics.blankLines.toLocaleString()
              }}</span>
            </div>
          </div>
        </div>

        <!-- Static Analysis Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">
              {{ t('repositoryOverview.staticAnalysis.title') }}
            </h3>
          </div>

          <div class="metric-item">
            <span class="metric-label">{{ t('repositoryOverview.staticAnalysis.bugs') }}</span>
            <span class="metric-value">{{ detailsRef.staticAnalysis.bugs }}</span>
          </div>

          <div class="metric-item">
            <span class="metric-label">{{
              t('repositoryOverview.staticAnalysis.vulnerabilities')
            }}</span>
            <span class="metric-value">{{ detailsRef.staticAnalysis.vulnerabilities }}</span>
          </div>

          <div class="metric-item">
            <span class="metric-label">{{
              t('repositoryOverview.staticAnalysis.codeSmells')
            }}</span>
            <span class="metric-value">{{ detailsRef.staticAnalysis.codeSmells }}</span>
          </div>

          <div class="metric-item">
            <span class="metric-label">{{
              t('repositoryOverview.staticAnalysis.complexity')
            }}</span>
            <span class="metric-value">{{ detailsRef.staticAnalysis.complexity }}</span>
          </div>

          <div class="metric-item">
            <span class="metric-label">{{
              t('repositoryOverview.staticAnalysis.duplicatedLines')
            }}</span>
            <span class="metric-value">
              {{ detailsRef.staticAnalysis.duplicatedLinesDensity }}%
            </span>
          </div>
        </div>

        <!-- File Extensions Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.fileExtensions.title') }}</h3>
          </div>
          <div class="card-content">
            <div
              v-for="fileType in detailsRef.statistics.fileTypeStatistics"
              :key="fileType.fileType"
              class="file-type-item"
            >
              <div class="file-type-header">
                <span class="file-type-name">{{ fileType.fileType }}</span>
                <span class="file-type-count"
                  >{{ fileType.files }} {{ t('repositoryOverview.fileExtensions.files') }}</span
                >
              </div>
              <div class="file-type-details">
                <span>{{ t('repositoryOverview.fileExtensions.lines') }}: </span>
                <span
                  >{{ fileType.codeLines.toLocaleString() }}
                  {{ t('repositoryOverview.fileExtensions.code') }}</span
                >
                <span
                  >{{ fileType.commentLines.toLocaleString() }}
                  {{ t('repositoryOverview.fileExtensions.comments') }}</span
                >
                <span
                  >{{ fileType.blankLines.toLocaleString() }}
                  {{ t('repositoryOverview.fileExtensions.blank') }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- X-Ray Analyses Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('repositoryOverview.xrayAnalyses.title') }}</h3>
          </div>
          <div class="no-data">
            <span>{{ t('repositoryOverview.xrayAnalyses.placeholder') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { ChurnData } from '@/components/visuals/CodeChurnChart.vue'
  import { ChartColor, ChartDataPoint } from '@/types/timelineChart.js'
  import { useI18n } from 'vue-i18n'
  import type { AuthorsStatisticsDetails } from '@/types'
  import { formatDate, formatDateTime } from '@/utils/dateFormatter'

  import TimelineChart from '@/components/visuals/TimelineChart.vue'
  import CodeChurnChart from '@/components/visuals/CodeChurnChart.vue'
  import TabNavigation from '@/components/city/TabNavigation.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { t } = useI18n()
  const { repositoryDetails, authorsStatisticsDetails, analysisTrendsDetails, isGeneralLoading } =
    useRestApi()

  const detailsRef = repositoryDetails()
  const trendsRef = analysisTrendsDetails()
  const authorsRef = authorsStatisticsDetails()

  const tabs = [
    {
      id: 'repository-overview',
      label: 'navbar.repository-overview',
      route: '/repository-overview',
    },
    { id: 'file-extensions', label: 'navbar.file-extensions', route: '/file-extensions' },
  ]

  const authorData = computed(() => {
    const data = authorsRef.value

    if (!data || !Array.isArray(data)) {
      return null
    }

    return data
      .map((author: AuthorsStatisticsDetails) => ({
        name: author.name,
        filesCount: author.filesAsLeadAuthor,
        commits: author.commits,
      }))
      .sort((a, b) => b.filesCount - a.filesCount)
      .slice(0, 5)
  })

  const commitData = computed<ChartDataPoint[] | null>(() => {
    if (!trendsRef.value) return null

    const rawData = trendsRef.value.map((item) => ({
      date: item.date instanceof Date ? item.date.toISOString().slice(0, 10) : item.date,
      value: item.commits,
    }))

    return mergeSameDayData(rawData, 'date', (existing, incoming) => ({
      date: existing.date,
      value: existing.value + incoming.value,
    }))
  })

  const uniqueAuthorsData = computed<ChartDataPoint[] | null>(() => {
    if (!trendsRef.value) return null

    const rawData = trendsRef.value.map((item) => ({
      date: item.date instanceof Date ? item.date.toISOString().slice(0, 10) : item.date,
      value: item.uniqueAuthors,
    }))

    return mergeSameDayData(rawData, 'date', (existing, incoming) => ({
      date: existing.date,
      value: Math.max(existing.value, incoming.value),
    }))
  })

  const activeAuthorsData = computed<ChartDataPoint[] | null>(() => {
    if (!trendsRef.value) return null

    const rawData = trendsRef.value.map((item) => ({
      date: item.date instanceof Date ? item.date.toISOString().slice(0, 10) : item.date,
      value: item.activeAuthors,
    }))

    return mergeSameDayData(rawData, 'date', (existing, incoming) => ({
      date: existing.date,
      value: Math.max(existing.value, incoming.value),
    }))
  })

  const churnData = computed<ChurnData[] | null>(() => {
    if (!trendsRef.value) return null

    const rawData = trendsRef.value.map((item) => ({
      date: item.date instanceof Date ? item.date.toISOString().slice(0, 10) : item.date,
      linesAdded: item.linesAdded,
      linesDeleted: item.linesDeleted,
    }))

    return mergeSameDayData(rawData, 'date', (existing, incoming) => ({
      date: existing.date,
      linesAdded: existing.linesAdded + incoming.linesAdded,
      linesDeleted: existing.linesDeleted + incoming.linesDeleted,
    }))
  })

  function mergeSameDayData<T extends Record<string, any>>(
    data: T[],
    dateKey: keyof T,
    mergeStrategy: (existing: T, incoming: T) => T
  ): T[] {
    const grouped = new Map<string, T>()

    data.forEach((point) => {
      const date = String(point[dateKey])
      const existing = grouped.get(date)

      if (existing === undefined) {
        grouped.set(date, point)
      } else {
        grouped.set(date, mergeStrategy(existing, point))
      }
    })

    return Array.from(grouped.values())
  }
</script>

<style scoped lang="scss">
  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  .header-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-lg 0;
    flex-shrink: 0;
  }

  .repository-overview {
    padding: $spacing-xl;
    width: 100%;
    flex: 1;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;
    max-width: 1400px;
    margin: 0 auto;
  }

  .stats-card {
    background: var(--color-bg-primary);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    min-height: 400px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-lg;
    transition: transform 0.2s ease;

    &[data-cols='1'] {
      grid-column: span 1;
    }

    &[data-cols='2'] {
      grid-column: span 2;
    }
  }

  .card-header {
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-primary);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    @include scrollbar;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }

    .metric-label {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .metric-value {
      font-size: 0.9rem;
      font-weight: 600;
      word-break: break-all;
      color: var(--color-text-primary);

      &.warning {
        color: #f59e0b;
      }
    }
  }

  .file-type-item {
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-item-bg);
    border-radius: 8px;
    border: 1px solid $color-none;
    font-size: $font-size-sm;
    padding: $spacing-md;
    margin-bottom: $spacing-sm;
    flex-shrink: 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .file-type-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }

  .file-type-name {
    font-weight: 600;
    color: var(--color-text-primary);
    font-size: 14px;
  }

  .file-type-count {
    color: var(--color-text-secondary);
    font-size: 13px;
  }

  .file-type-details {
    display: flex;
    gap: $spacing-lg;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: $font-weight-light;
    color: var(--color-text-muted);
  }

  .authors-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .author-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--color-item-bg);
    border-radius: 8px;
    border: 1px solid $color-none;
    font-size: $font-size-sm;
    padding: $spacing-md;
    margin-bottom: $spacing-sm;
    flex-shrink: 0;
  }

  .author-rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .author-info {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  .author-name {
    font-weight: 600;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 120px;
  }

  .author-stats {
    display: flex;
    gap: $spacing-lg;
    font-size: 13px;
  }

  .stat {
    display: flex;
    gap: $spacing-xs;
    white-space: nowrap;
  }

  .stat-label {
    color: var(--color-text-secondary);
  }

  .stat-value {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stats-card {
      &[data-cols='1'],
      &[data-cols='2'] {
        grid-column: span 1;
      }
    }
  }

  @media (max-width: 768px) {
    .repository-overview {
      padding: $spacing-lg;
    }

    .stats-card {
      padding: $spacing-lg;
    }
  }
</style>
