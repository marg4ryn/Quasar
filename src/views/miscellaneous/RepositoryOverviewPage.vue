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
            <h3 class="card-title">Repository Info</h3>
          </div>
          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label">Repository</span>
              <span class="metric-value">{{ detailsRef.info.repositoryName }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Owner</span>
              <span class="metric-value">{{ detailsRef.info.repositoryOwner }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Platform</span>
              <span class="metric-value">{{ detailsRef.info.repositoryPlatform }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">URL</span>
              <span class="metric-value" :style="{ fontFamily: 'var(--font-family-monospace)' }">{{
                detailsRef.info.repositoryUrl
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Analysis Range Start Date</span>
              <span class="metric-value">{{
                formatDate(detailsRef.info.analysisRangeStartDate)
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Analysis Range End Date</span>
              <span class="metric-value">{{
                formatDate(detailsRef.info.analysisRangeEndDate)
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Analysis finished at</span>
              <span class="metric-value">{{
                formatDateTime(detailsRef.info.analysisFinishedAt)
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Analysis Time</span>
              <span class="metric-value">{{ detailsRef.info.analysisTimeInSeconds }} s</span>
            </div>
          </div>
        </div>

        <!-- Statistics Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">Statistics</h3>
          </div>
          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label">Authors</span>
              <span class="metric-value">{{ detailsRef.statistics.authors }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Active Authors</span>
              <span class="metric-value">{{ detailsRef.statistics.activeAuthors }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Commits</span>
              <span class="metric-value">{{ detailsRef.statistics.commits }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Files</span>
              <span class="metric-value">{{ detailsRef.statistics.files }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Code Lines</span>
              <span class="metric-value">{{
                detailsRef.statistics.codeLines.toLocaleString()
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Comment Lines</span>
              <span class="metric-value">{{
                detailsRef.statistics.commentLines.toLocaleString()
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Blank Lines</span>
              <span class="metric-value">{{
                detailsRef.statistics.blankLines.toLocaleString()
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Bugs</span>
              <span class="metric-value">
                {{ detailsRef.staticAnalysis.bugs }}
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Vulnerabilities</span>
              <span class="metric-value">
                {{ detailsRef.staticAnalysis.vulnerabilities }}
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Code Smells</span>
              <span class="metric-value">{{ detailsRef.staticAnalysis.codeSmells }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Complexity</span>
              <span class="metric-value">{{ detailsRef.staticAnalysis.complexity }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Duplicated Lines</span>
              <span class="metric-value"
                >{{ detailsRef.staticAnalysis.duplicatedLinesDensity }}%</span
              >
            </div>
          </div>
        </div>

        <!-- Authors Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">Authors</h3>
          </div>
          <div class="card-content"></div>
        </div>

        <!-- File Types Card -->
        <div class="stats-card" data-cols="1">
          <div class="card-header">
            <h3 class="card-title">File Types</h3>
          </div>
          <div class="card-content">
            <div
              v-for="fileType in detailsRef.statistics.fileTypeStatistics"
              :key="fileType.fileType"
              class="file-type-item"
            >
              <div class="file-type-header">
                <span class="file-type-name">{{ fileType.fileType }}</span>
                <span class="file-type-count">{{ fileType.files }} files</span>
              </div>
              <div class="file-type-details">
                <span>{{ fileType.codeLines.toLocaleString() }} code</span>
                <span>{{ fileType.commentLines.toLocaleString() }} comments</span>
                <span>{{ fileType.blankLines.toLocaleString() }} blank</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRestApi } from '@/composables/useRestApi'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'

  import TabNavigation from '@/components/city/TabNavigation.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { repositoryDetails, isGeneralLoading } = useRestApi()

  const detailsRef = repositoryDetails()

  const tabs = [
    {
      id: 'repository-overview',
      label: 'navbar.repository-overview',
      route: '/repository-overview',
    },
    { id: 'file-extensions', label: 'navbar.file-extensions', route: '/file-extensions' },
  ]

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

  const formatDateTime = (date: Date | string) => {
    const userSettings = useUserSettingsStore()

    let lang = ''
    if (userSettings.selectedLanguage === 'system') {
      lang = navigator.language.startsWith('pl') ? 'pl' : 'en'
    } else {
      lang = userSettings.selectedLanguage
    }

    return new Date(date).toLocaleString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
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
    min-height: 300px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-lg;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

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
    padding: $spacing-md;
    background: var(--color-bg-secondary, rgba(0, 0, 0, 0.02));
    border-radius: 8px;
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
