<template>
  <AppButtonClose />
  <div class="table-wrapper">
    <div v-if="loading && analyses.length === 0" class="loading-state">
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else class="analysis-history">
      <div class="table-header">
        <div class="header-cell repo-cell" @click="sortBy('repositoryUrl')">
          <span>{{ t('table.headers.repository') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'repositoryUrl'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('startedAt')">
          <span>{{ t('table.headers.startedAt') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'startedAt'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('startDate')">
          <span>{{ t('table.headers.startDate') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'startDate'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('endDate')">
          <span>{{ t('table.headers.endDate') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'endDate'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell status-cell">{{ t('table.headers.results') }}</div>
      </div>

      <div class="analysis-list">
        <div v-for="item in analyses" :key="item.id" class="analysis-item">
          <div class="analysis-row">
            <div class="cell repo-cell">
              <a :href="item.repositoryUrl" target="_blank" class="repo-link" @click.stop>
                {{ formatRepoName(item.repositoryUrl) }}
                <span class="external-icon">↗</span>
              </a>
            </div>

            <div class="cell">{{ formatDateTime(item.startedAt) }}</div>

            <div class="cell">{{ formatDate(item.startDate) }}</div>

            <div class="cell">{{ formatDate(item.endDate) }}</div>

            <div class="cell status-cell">
              <button
                v-if="item.status === 'COMPLETED'"
                class="results-btn"
                @click="goToResults(item.id)"
              >
                {{ t('table.buttons.viewResults') }}
              </button>

              <span
                v-else
                class="status-badge"
                :class="{
                  pending: item.status === 'IN_PROGRESS',
                  failed: item.status === 'FAILED',
                }"
              >
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="analyses.length === 0" class="empty-state">
          <p>{{ t('table.noAnalysisHistory') }}</p>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination-footer">
        <button class="page-btn" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">
          {{ t('table.buttons.previous') }}
        </button>

        <span class="page-info">
          {{ t('table.pageInfo', { current: currentPage + 1, total: totalPages }) }}
        </span>

        <button
          class="page-btn"
          :disabled="currentPage >= totalPages - 1"
          @click="changePage(currentPage + 1)"
        >
          {{ t('table.buttons.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/services/restApi'
  import { useI18n } from 'vue-i18n'
  import { AnalysisHistoryResponseItem, AnalysisHistoryResponse } from '@/types'
  import { useConnectionStore } from '@/stores/sseConnectorStore'
  import { useRestApi } from '@/composables/useRestApi'
  import AppButtonClose from '@/components/common/AppButtonClose.vue'

  const { t } = useI18n()

  const router = useRouter()
  const restApiStore = useRestApi()
  const connectionStore = useConnectionStore()
  const analyses = ref<AnalysisHistoryResponseItem[]>([])
  const loading = ref(false)
  const currentPage = ref(0)
  const pageSize = ref(10)
  const totalPages = ref(0)
  const sortColumn = ref<string>('startedAt')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  const fetchHistory = async () => {
    loading.value = true
    try {
      const sortParam = `${sortColumn.value},${sortDirection.value}`

      const response = await api.get<AnalysisHistoryResponse>('analysis/history', {
        page: currentPage.value,
        size: pageSize.value,
        sort: sortParam,
      })

      analyses.value = response.content
      totalPages.value = response.totalPages
      currentPage.value = response.number
    } catch (error) {
      console.error('Failed to fetch analysis history', error)
    } finally {
      loading.value = false
    }
  }

  const sortBy = (column: string) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'desc'
    }
    currentPage.value = 0
    fetchHistory()
  }

  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages.value) {
      currentPage.value = newPage
      fetchHistory()
    }
  }

  const goToResults = (analysisId: string) => {
    const analysis = connectionStore.analyses.get('download-repository')
    if (analysis?.result?.data) {
      analysis.result.data = analysisId
    } else {
      connectionStore.analyses.set('download-repository', {
        analysisId: 'download-repository',
        result: { data: analysisId, timestamp: Date.now().toString() },
        screenRoute: '/repository-overview',
        state: 'completed',
      })
    }
    restApiStore.clearAll()
    router.push('/repository-overview')
  }

  const formatRepoName = (url: string) => {
    try {
      const parts = url.split('/')
      return parts.length >= 2 ? `${parts[parts.length - 2]}/${parts[parts.length - 1]}` : url
    } catch {
      return url
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString(navigator.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  onMounted(() => {
    fetchHistory()
  })
</script>

<style scoped lang="scss">
  $color-primary: var(--color-primary, #3498db);
  $color-bg-primary: var(--color-bg-primary, #ffffff);
  $color-bg-secondary: var(--color-bg-secondary, #f8f9fa);
  $color-border: var(--color-border, #e9ecef);
  $color-text-primary: var(--color-text-primary, #2c3e50);
  $color-text-secondary: var(--color-text-secondary, #6c757d);
  $color-positive: var(--color-positive, #27ae60);
  $color-negative: var(--color-negative, #e74c3c);
  $color-warning: #f39c12;

  .table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 2rem;
    width: 100%;
  }

  .analysis-history {
    width: 100%;
    max-width: 1200px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: $color-bg-primary;
    margin-bottom: auto;
  }

  .table-header {
    display: grid;
    grid-template-columns: 3fr 1.5fr 1fr 1fr 1.2fr;
    gap: 16px;
    padding: 16px 20px;
    background: $color-bg-primary;
    border-bottom: 2px solid $color-border;
    font-weight: 600;
    color: $color-text-secondary;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .header-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;

    &:hover {
      color: $color-primary;
    }

    &.status-cell {
      cursor: default;
      &:hover {
        color: inherit;
      }
    }
  }

  .sort-icon {
    font-size: 16px;
    color: $color-text-secondary;
  }

  .analysis-list {
    background: $color-bg-primary;
  }

  .analysis-item {
    border-bottom: 1px solid $color-border;
    transition: background-color 0.2s;

    &:hover {
      background: $color-bg-secondary;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  .analysis-row {
    display: grid;
    grid-template-columns: 3fr 1.5fr 1fr 1fr 1.2fr;
    gap: 16px;
    padding: 16px 20px;
    align-items: center;
  }

  .cell {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: $color-text-primary;

    &.repo-cell {
      font-weight: 500;
    }
  }

  .repo-link {
    color: $color-primary;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }

    .external-icon {
      font-size: 10px;
    }
  }

  .results-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid $color-primary;
    background: transparent;
    color: $color-primary;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: $color-primary;
      color: white;
    }
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    background: $color-bg-secondary;
    color: $color-text-secondary;

    &.pending {
      background: rgba($color-warning, 0.1);
      color: $color-warning;
    }

    &.failed {
      background: rgba($color-negative, 0.1);
      color: $color-negative;
    }
  }

  .pagination-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid $color-border;
    gap: 16px;
    background: $color-bg-secondary;
  }

  .page-btn {
    padding: 6px 16px;
    border: 1px solid $color-border;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    color: black;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: $color-primary;
      color: $color-primary;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .page-info {
    font-size: 13px;
    color: $color-text-secondary;
  }

  .empty-state,
  .loading-state {
    padding: 40px;
    text-align: center;
    color: $color-text-secondary;
  }

  @media (max-width: 768px) {
    .table-header {
      display: none;
    }

    .analysis-row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 16px;
    }

    .cell {
      &::before {
        content: attr(data-label);
        font-weight: 600;
        width: 100px;
        color: $color-text-secondary;
        display: inline-block;
      }
    }
  }
</style>
