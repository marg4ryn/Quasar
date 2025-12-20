<template>
  <LoadingBar :show="isGeneralLoading" :show-cancel-button="false" />

  <div class="table-wrapper">
    <TabNavigation class="tab-nav" :tabs="tabs" />

    <div v-if="sortedAuthors.length > 0" class="authors-statistics">
      <div class="table-header">
        <div class="header-cell name-cell" @click="sortBy('name')">
          <span>{{ t('table.headers.author') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'name'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('commits')">
          <span>{{ t('table.headers.commits') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'commits'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('linesAdded')">
          <span>{{ t('table.headers.added') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'linesAdded'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('linesDeleted')">
          <span>{{ t('table.headers.deleted') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'linesDeleted'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell" @click="sortBy('daysSinceLastCommit')">
          <span>{{ t('table.headers.lastCommit') }}</span>
          <span
            class="sort-icon"
            :class="{ asc: sortDirection === 'asc' }"
            v-if="sortColumn === 'daysSinceLastCommit'"
          >
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell status-cell">{{ t('table.headers.status') }}</div>
      </div>

      <div class="authors-list">
        <div
          v-for="author in sortedAuthors"
          :key="author.name"
          class="author-item"
          :class="{ expanded: expandedAuthor === author.name }"
        >
          <div class="author-row" @click="toggleExpand(author.name)">
            <div class="cell name-cell">
              <span class="expand-icon">{{ expandedAuthor === author.name ? '▼' : '▶' }}</span>
              <span class="author-name">{{ author.name }}</span>
            </div>
            <div class="cell">{{ author.commits.toLocaleString() }}</div>
            <div class="cell positive">+{{ author.linesAdded.toLocaleString() }}</div>
            <div class="cell negative">-{{ author.linesDeleted.toLocaleString() }}</div>
            <div class="cell">{{ formatDaysSince(author.daysSinceLastCommit) }}</div>
            <div class="cell status-cell">
              <span class="status-badge" :class="{ active: author.isActive }">
                {{ author.isActive ? t('table.status.active') : t('table.status.inactive') }}
              </span>
            </div>
          </div>

          <div v-if="expandedAuthor === author.name" class="author-details">
            <div class="details-grid">
              <div class="detail-section">
                <h4>{{ t('table.details.contact') }}</h4>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.emails') }}:</span>
                  <div class="emails">
                    <span v-for="(email, idx) in author.emails" :key="idx" class="email">
                      {{ email }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>{{ t('table.details.activity') }}</h4>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.firstCommit') }}:</span>
                  <span class="value">{{ formatDate(author.firstCommitDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.lastCommit') }}:</span>
                  <span class="value">{{ formatDate(author.lastCommitDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.daysSinceLast') }}:</span>
                  <span class="value">{{ formatDaysOnly(author.daysSinceLastCommit) }} </span>
                </div>
              </div>

              <div class="detail-section">
                <h4>{{ t('table.details.statistics') }}</h4>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.modifiedFiles') }}:</span>
                  <span class="value">{{ author.existingFilesModified.toLocaleString() }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.filesAsLead') }}:</span>
                  <span class="value">{{ author.filesAsLeadAuthor.toLocaleString() }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ t('table.details.lineBalance') }}:</span>
                  <span
                    class="value"
                    :class="{
                      positive: author.linesAdded - author.linesDeleted > 0,
                      negative: author.linesAdded - author.linesDeleted < 0,
                    }"
                  >
                    {{ author.linesAdded - author.linesDeleted > 0 ? '+' : ''
                    }}{{ (author.linesAdded - author.linesDeleted).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>{{ t('table.noData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AuthorsStatisticsDetails } from '@/types'
  import { useRestApi } from '@/composables/useRestApi'
  import { formatDate, formatDaysSince, formatDaysOnly } from '@/utils/dateFormatter'

  import TabNavigation from '@/components/city/TabNavigation.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { authorsStatisticsDetails, isGeneralLoading } = useRestApi()
  const { t } = useI18n()
  const authors = authorsStatisticsDetails()

  const expandedAuthor = ref<string | null>(null)
  const sortColumn = ref<keyof AuthorsStatisticsDetails>('commits')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  const tabs = [
    { id: 'developers-list', label: 'navbar.developers-list', route: '/developers-list' },
    { id: 'lead-developers', label: 'navbar.lead-developers', route: '/lead-developers' },
    {
      id: 'knowledge-risks',
      label: 'navbar.knowledge-risks',
      route: '/knowledge-risks',
    },
    { id: 'abandoned-code', label: 'navbar.abandoned-code', route: '/abandoned-code' },
    {
      id: 'developer-relationships',
      label: 'navbar.developer-relationships',
      route: '/developer-relationships',
    },
  ]

  const toggleExpand = (authorName: string) => {
    expandedAuthor.value = expandedAuthor.value === authorName ? null : authorName
  }

  const sortBy = (column: keyof AuthorsStatisticsDetails) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'desc'
    }
  }

  const sortedAuthors = computed(() => {
    if (!authors.value || !Array.isArray(authors.value)) return []

    return [...authors.value].sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]

      let comparison = 0
      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1

      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  })
</script>

<style scoped lang="scss">
  .tab-nav {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .table-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 7rem;
  }

  .authors-statistics {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr;
    gap: 16px;
    padding: 16px 20px;
    background: var(--color-bg-primary);

    border-bottom: 2px solid var(--color-border);
    font-weight: 600;
    color: var(--color-text-tertiary);
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
      color: var(--color-primary);
    }

    &.name-cell {
      padding-left: 32px;
    }

    &.status-cell {
      cursor: default;
      &:hover {
        color: var(--color-text-tertiary);
      }
    }
  }

  .sort-icon {
    font-size: 16px;
    color: $color-negative;
    &.asc {
      color: $color-positive;
    }
  }

  .authors-list {
    background: var(--color-bg-primary);
  }

  .author-item {
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.2s;

    &:hover {
      background: var(--color-bg-secondary);
    }

    &.expanded {
      background: var(--color-bg-secondary);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .author-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1fr;
    gap: 16px;
    padding: 16px 20px;
    cursor: pointer;
    align-items: center;
  }

  .cell {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--color-text-secondary);

    &.name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    &.positive {
      color: $color-positive;
    }

    &.negative {
      color: $color-negative;
    }
  }

  .expand-icon {
    font-size: 10px;
    color: var(--color-icon);
    transition: transform 0.2s;
  }

  .author-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: var(--color-icon);
    color: var(--color-text-secondary);
    width: 90px;

    &.active {
      background: $color-positive;
    }
  }

  .author-details {
    padding: 24px 20px 24px 52px;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 210px);
    gap: 24px;
  }

  .detail-section {
    h4 {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;

    .label {
      font-size: 12px;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .value {
      font-size: 14px;
      color: var(--color-text-secondary);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.positive {
        color: $color-positive;
      }

      &.negative {
        color: $color-negative;
      }
    }
  }

  .emails {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .email {
    font-size: 14px;
    font-family: 'Courier New', monospace;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  @media (max-width: 1024px) {
    .table-header,
    .author-row {
      grid-template-columns: 2fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr;
      font-size: 13px;
    }
  }

  @media (max-width: 768px) {
    .table-header {
      display: none;
    }

    .author-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .cell {
      &:not(.name-cell) {
        display: none;
      }
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
  }

  .empty-state {
    padding: 48px 20px;
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 16px;
  }
</style>
