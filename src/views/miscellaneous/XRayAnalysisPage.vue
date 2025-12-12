<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <AppButtonClose />

  <div class="page-wrapper">
    <div class="xray-analysis" v-if="details">
      <div class="stats-grid">
        <!-- Analysis Info Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">{{ t('xray.fileInfo') }}</h3>
          </div>
          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.name') }}</span>
              <span class="metric-value">{{ currentFileDetails?.info?.name }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.path') }}</span>
              <span class="metric-value">{{
                details.filePath || currentFileDetails?.info?.path
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.fileType') }}</span>
              <span class="metric-value">{{ currentFileDetails?.info?.type }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.fileSize') }}</span>
              <span class="metric-value">{{ currentFileDetails?.info?.size }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.totalLines') }}</span>
              <span class="metric-value">{{ latestStats.totalLines.toLocaleString() }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.codeLines') }}</span>
              <span class="metric-value">{{ latestStats.codeLines.toLocaleString() }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.commentLines') }}</span>
              <span class="metric-value">{{ latestStats.commentLines.toLocaleString() }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.blankLines') }}</span>
              <span class="metric-value">{{ latestStats.blankLines.toLocaleString() }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.duplicatedLinesDensity') }}</span>
              <span class="metric-value">{{
                currentFileDetails?.staticAnalysis?.duplicatedLinesDensity
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.complexity') }}</span>
              <span class="metric-value">{{ latestStats.complexity }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.codeSmells') }}</span>
              <span class="metric-value">{{ currentFileDetails?.staticAnalysis?.codeSmells }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.bugs') }}</span>
              <span class="metric-value">{{ currentFileDetails?.staticAnalysis?.bugs }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.vulnerabilities') }}</span>
              <span class="metric-value">{{
                currentFileDetails?.staticAnalysis?.vulnerabilities
              }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label"> {{ t('xray.method') }}</span>
              <span class="metric-value">{{ details.methods }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label"> {{ t('xray.numberOfVersions') }}</span>
              <span class="metric-value">{{ details.versions }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('xray.currentAuthors') }}</span>
              <span class="metric-value">{{ details.currentAuthors }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.lastCommitDate') }}</span>
              <span class="metric-value">{{ currentFileDetails?.info?.lastCommitDate }}</span>
            </div>

            <div class="metric-item">
              <span class="metric-label">{{ t('metrics.firstCommitDate') }}</span>
              <span class="metric-value">{{ currentFileDetails?.info?.firstCommitDate }}</span>
            </div>
          </div>
        </div>

        <!-- Authors Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">
              {{ t('xray.currentAuthors') }} ({{ details.currentAuthors }})
            </h3>
          </div>
          <div class="card-content" :style="{ gap: '14px' }">
            <div v-for="author in currentAuthorsData" :key="author.name" class="author-item">
              <span class="author-name">{{ author.name }}</span>
              <div class="author-stats">
                <span class="author-lines"
                  >{{ author.linesAdded.toLocaleString() }} {{ t('xray.lines') }}</span
                >
                <span class="author-percentage">{{ author.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Methods Statistics -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">
              {{ t('xray.methodsStatistics') }} ({{ details.methodsStatistics.length }})
            </h3>
          </div>
          <div class="card-content">
            <div class="methods-table">
              <div class="table-header">
                <div class="col-name">{{ t('xray.methods.name') }}</div>
                <div class="col-lines">{{ t('xray.methods.lines') }}</div>
                <div class="col-commits">{{ t('xray.methods.commits') }}</div>
                <div class="col-authors">{{ t('xray.methods.authors') }}</div>
                <div class="col-last-commit">{{ t('xray.methods.lastCommit') }}</div>
                <div class="col-url">{{ t('xray.methods.url') }}</div>
              </div>

              <div class="table-body">
                <div
                  v-for="method in sortedMethods"
                  :key="method.name"
                  class="table-row method-row"
                  @click="toggleMethodDetails(method.name)"
                >
                  <div class="col-name">
                    <span class="method-name">{{ method.name }}</span>
                    <span class="method-position"
                      >({{ method.startLine }}-{{ method.endLine }})</span
                    >
                  </div>
                  <div class="col-lines">{{ method.lines }}</div>
                  <div class="col-commits">{{ method.commits }}</div>
                  <div class="col-authors">{{ method.authors }}</div>
                  <div class="col-last-commit">
                    <div class="last-commit-info">
                      <span>{{ formatDate(method.lastCommitDate) }}</span>
                      <span class="days-ago"
                        >({{ method.daysSinceLastCommit }} {{ t('xray.daysAgo') }})</span
                      >
                    </div>
                  </div>
                  <div class="col-url">
                    <a :href="method.url" target="_blank" class="url-link" @click.stop>
                      {{ t('xray.methods.open') }}
                    </a>
                  </div>

                  <!-- Expandable complexity trends -->
                  <div v-if="expandedMethod === method.name" class="method-details">
                    <div class="complexity-trends">
                      <h4>{{ t('xray.methods.complexityTrends') }}</h4>
                      <TimelineChart
                        v-if="getMethodComplexityData(method)"
                        :datasets="[
                          {
                            label: t('metrics.complexity'),
                            data: getMethodComplexityData(method)!,
                            color: ChartColor.Blue,
                            tooltipDesc: t('xray.charts.complexityTooltip'),
                            yAxisID: 'left',
                          },
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trends -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">{{ t('xray.trends') }}</h3>
          </div>
          <TimelineChart
            v-if="complexityData && codeLinesData"
            :datasets="[
              {
                label: t('metrics.complexity'),
                data: complexityData,
                color: ChartColor.Blue,
                tooltipDesc: t('xray.charts.complexityTooltip'),
                yAxisID: 'left',
              },
              {
                label: t('metrics.totalLines'),
                data: codeLinesData,
                color: ChartColor.Green,
                tooltipDesc: t('xray.charts.codeLinesTooltip'),
                yAxisID: 'right',
              },
            ]"
          />
        </div>

        <!-- Version statistics -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">{{ t('xray.versionStats') }}</h3>
          </div>
          <div class="card-content">
            <div class="versions-table">
              <div class="table-header">
                <div class="col-date">{{ t('xray.versions.date') }}</div>
                <div class="col-lines">{{ t('xray.versions.lines') }}</div>
                <div class="col-complexity">{{ t('xray.versions.complexity') }}</div>
                <div class="col-methods">{{ t('xray.versions.methods') }}</div>
                <div class="col-url">{{ t('xray.versions.url') }}</div>
              </div>

              <div class="table-body">
                <div
                  v-for="(version, index) in [...details.versionsStatistics].reverse()"
                  :key="index"
                  class="table-row"
                >
                  <div class="col-date">{{ formatDate(version.date) }}</div>

                  <div class="col-lines">
                    <div class="lines-breakdown">
                      <span class="main">
                        {{ version.totalLines }} {{ t('xray.versions.total') }}
                      </span>
                      <span class="sub">
                        ({{ version.codeLines }} {{ t('xray.versions.code') }},
                        {{ version.commentLines }} {{ t('xray.versions.comments') }},
                        {{ version.blankLines }} {{ t('xray.versions.blank') }})
                      </span>
                    </div>
                  </div>

                  <div class="col-complexity">{{ version.complexity }}</div>
                  <div class="col-methods">{{ version.methods }}</div>

                  <div class="col-url">
                    <a :href="version.url" target="_blank" class="url-link">
                      {{ t('xray.versions.open') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Code Changes (Churn) -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">{{ t('xray.codeChanges') }}</h3>
          </div>
          <CodeChurnChart v-if="churnData" :data="churnData" />
        </div>

        <!-- Commits history -->
        <div class="stats-card" data-cols="2">
          <div class="card-header">
            <h3 class="card-title">
              {{ t('xray.commitsHistory') }} ({{ details.commits.length }})
            </h3>
          </div>
          <div class="card-content">
            <div class="commits-table">
              <div class="table-header">
                <div class="col-hash">{{ t('xray.commits.hash') }}</div>
                <div class="col-date">{{ t('xray.commits.date') }}</div>
                <div class="col-author">{{ t('xray.commits.author') }}</div>
                <div class="col-changes">{{ t('xray.commits.changes') }}</div>
              </div>

              <div class="table-body">
                <div
                  v-for="commit in [...details.commits].reverse()"
                  :key="commit.hash"
                  class="table-row"
                >
                  <div class="col-hash">
                    <code>{{ commit.hash.substring(0, 7) }}</code>
                  </div>
                  <div class="col-date">{{ formatDate(commit.date) }}</div>
                  <div class="col-author">{{ commit.author }}</div>
                  <div class="col-changes">
                    <span class="added">+{{ commit.linesAdded }}</span>
                    <span class="deleted">-{{ commit.linesDeleted }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ComputedRef, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useRestApi } from '@/composables/useRestApi'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { XRayDetails, FileDetails, MethodStatistics } from '@/types'
  import { ChurnData } from '@/components/visuals/CodeChurnChart.vue'
  import { ChartColor, ChartDataPoint } from '@/types/timelineChart.js'

  import CodeChurnChart from '@/components/visuals/CodeChurnChart.vue'
  import TimelineChart from '@/components/visuals/TimelineChart.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'
  import AppButtonClose from '@/components/common/AppButtonClose.vue'

  const { t } = useI18n()

  const { fileDetails, xRayDetails, isGeneralLoading } = useRestApi()

  const route = useRoute()

  const filePath = computed(() => route.query.filePath as string)

  const details = xRayDetails(filePath.value) as ComputedRef<XRayDetails | undefined>

  const currentFileDetails = computed<FileDetails | null>(() => {
    return fileDetails(filePath.value).value || null
  })

  const expandedMethod = ref<string | null>(null)

  const toggleMethodDetails = (methodName: string) => {
    expandedMethod.value = expandedMethod.value === methodName ? null : methodName
  }

  const latestStats = computed(() => {
    return (
      details.value?.versionsStatistics?.[0] || {
        totalLines: 0,
        codeLines: 0,
        commentLines: 0,
        blankLines: 0,
        complexity: 0,
        methods: 0,
      }
    )
  })

  const currentAuthorsData = computed(() => {
    return details.value?.currentAuthorsStatistics || []
  })

  const sortedMethods = computed(() => {
    if (!details.value?.methodsStatistics) return []
    return [...details.value.methodsStatistics].sort((a, b) => b.commits - a.commits)
  })

  const getMethodComplexityData = (method: MethodStatistics): ChartDataPoint[] | null => {
    if (!method.complexityTrends || method.complexityTrends.length === 0) return null

    return method.complexityTrends.map((trend) => ({
      date: trend.date,
      value: trend.complexity,
    }))
  }

  const churnData = computed<ChurnData[] | null>(() => {
    if (!details.value?.commits) return null

    const rawData = details.value?.commits.map((commit) => ({
      date: commit.date,
      linesAdded: commit.linesAdded,
      linesDeleted: commit.linesDeleted,
    }))

    return mergeSameDayData(rawData, 'date', (existing, incoming) => ({
      date: existing.date,
      linesAdded: existing.linesAdded + incoming.linesAdded,
      linesDeleted: existing.linesDeleted + incoming.linesDeleted,
    }))
  })

  const complexityData = computed<ChartDataPoint[] | null>(() => {
    if (!details.value?.commits) return null

    const rawData =
      details.value?.versionsStatistics.map((version) => ({
        date: version.date,
        value: version.complexity,
      })) ?? null
    return rawData
      ? mergeSameDayData(rawData, 'date', (existing, incoming) =>
          existing.value > incoming.value ? existing : incoming
        )
      : null
  })

  const codeLinesData = computed<ChartDataPoint[] | null>(() => {
    if (!details.value?.commits) return null

    const rawData =
      details.value?.versionsStatistics.map((version) => ({
        date: version.date,
        value: version.codeLines,
      })) ?? null

    return rawData
      ? mergeSameDayData(rawData, 'date', (existing, incoming) =>
          existing.value > incoming.value ? existing : incoming
        )
      : null
  })

  const formatDate = (date: Date | string) => {
    const userSettings = useUserSettingsStore()
    let lang = ''

    if (userSettings.selectedLanguage === 'system') {
      lang = navigator.language.startsWith('pl') ? 'pl' : 'en'
    } else {
      lang = userSettings.selectedLanguage
    }

    return new Date(date).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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
  .method-details {
    grid-column: 1 / -1;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .complexity-trends h4 {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
  }

  .method-name {
    font-weight: 600;
  }

  .method-position {
    font-size: 12px;
    color: #666;
    margin-left: 8px;
  }

  .last-commit-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .days-ago {
    font-size: 12px;
    color: #666;
  }

  .author-stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .author-lines {
    font-size: 12px;
    color: #666;
  }

  .methods-table {
    width: 100%;
    overflow-x: auto;
  }

  .methods-table .table-header,
  .methods-table .table-row {
    display: grid;
    grid-template-columns: 2fr 0.8fr 0.8fr 0.8fr 1.2fr 0.8fr;
    gap: 12px;
    align-items: center;
  }

  .methods-table .table-header {
    font-weight: 600;
    padding: 12px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }

  .methods-table .table-row {
    padding: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .header-section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: $spacing-lg $spacing-xl;
    flex-shrink: 0;
  }

  .xray-analysis {
    padding: 0 $spacing-xl $spacing-xl;
    width: 100%;
    flex: 1;
    margin-top: 4.5rem;
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
    max-height: 600px;
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
    }
  }

  .commits-table,
  .versions-table,
  .methods-table {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    .table-header {
      display: grid;
      padding: $spacing-sm $spacing-md;
      background: var(--color-bg-tertiary);
      border-radius: $radius-md;
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }

    .table-body {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    .table-row {
      display: grid;
      padding: $spacing-md;
      background: var(--color-item-bg);
      border-radius: $radius-md;
      border: 1px solid $color-none;
      transition: all 0.2s;
      align-items: center;

      &:hover {
        background: var(--color-item-bg-hover);
        border-color: var(--color-border);
      }
    }
  }

  .commits-table {
    .table-header,
    .table-row {
      grid-template-columns: 100px 1fr 1fr 120px;
      gap: $spacing-md;
    }

    code {
      padding: 0.25rem 0.5rem;
      background: var(--color-bg-tertiary);
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: var(--color-text-primary);
    }

    .col-changes {
      display: flex;
      gap: $spacing-md;
      justify-content: flex-end;

      .added {
        color: #22c55e;
        font-weight: 500;
      }

      .deleted {
        color: #ef4444;
        font-weight: 500;
      }
    }
  }

  .author-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-item-bg);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid $color-none;
    font-size: $font-size-sm;

    .author-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .methods-table {
    .url-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.85rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .versions-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr 2fr 100px 80px 100px;
      gap: $spacing-md;
    }

    .lines-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .main {
        font-size: 0.9rem;
        color: var(--color-text-primary);
      }

      .sub {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
      }
    }

    .url-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.85rem;

      &:hover {
        text-decoration: underline;
      }
    }
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
    .xray-analysis {
      padding: 0 $spacing-lg $spacing-lg;
    }

    .header-section {
      padding: $spacing-lg;
    }

    .stats-card {
      padding: $spacing-lg;
      max-height: none;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .commits-table,
    .versions-table {
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: $spacing-sm;
      }
    }
  }
</style>
