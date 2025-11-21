<template>
  <aside class="right-panel">
    <div v-if="selectedItem" class="panel-header">
      <button v-if="selectedItem.path !== '/'" class="back-button" @click="navigateUp">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12 4L6 10L12 16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="file-icon">
        <svg
          v-if="selectedItem?.type === 'dir'"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 3H9L11 6H18V17H2V3Z" />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 2H12L16 6V18H4V2Z" />
          <path d="M12 2V6H16" stroke="currentColor" stroke-width="1.5" fill="none" />
        </svg>
      </div>

      <span class="file-title">
        {{ selectedItem?.name || $t('rightPanel.selectFile') }}
      </span>
    </div>

    <div v-if="selectedItem && selectedItem.type === 'file'" class="file-details">
      <h3>{{ $t('rightPanel.fileMetrics') }}</h3>

      <div v-if="isLoadingMetrics" class="metrics-loading">
        <span>{{ $t('common.loading') }}</span>
      </div>

      <div v-else-if="metricsError" class="metrics-error">
        <span>{{ metricsError }}</span>
        <button @click="retryLoadMetrics" class="retry-button">
          {{ $t('rightPanel.retry') }}
        </button>
      </div>

      <div v-else-if="displayMetrics && displayMetrics.length" class="metrics-container">
        <div v-for="(metric, index) in displayMetrics" :key="index" class="metric-item">
          <span class="metric-label"
            >{{ $t(metric.label) }}:
            <button v-if="metric.description" class="info-button" :title="$t(metric.description)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                <path
                  d="M8 7V11M8 5V5.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </span>
          <span
            class="metric-value"
            :class="{ 'metric-unavailable': isMetricUnavailable(metric) }"
            :style="metric.getStyle ? metric.getStyle(selectedItem, metricsStore) : {}"
          >
            {{ getMetricDisplayValue(metric) }}
          </span>
        </div>
      </div>

      <div class="action-buttons">
        <AppButton
          v-if="showFindCoupling"
          :label="$t('rightPanel.findCoupling')"
          variant="primary"
          @click="onFindCoupling"
        />
        <AppButton :label="$t('rightPanel.xray')" variant="primary" @click="onXRay" />
        <SourceCodeButton @click="onSourceCode" />
      </div>
    </div>

    <div v-else-if="selectedItem && selectedItem.type === 'dir'" class="directory-children">
      <h3>{{ $t('rightPanel.directoryContents') }}</h3>
      <AppSearchBar
        class="search-bar-wrapper"
        type="mini"
        :placeholder="$t('rightPanel.searchPlaceholder')"
        :items="selectedItem?.children || []"
        @filtered="filteredChildren = $event"
      />
      <div class="children-list">
        <div
          v-for="child in sortedChildren"
          :key="child.path"
          class="child-item"
          :class="{ 'custom-hover': hoveredPath === child.path }"
          @click="handleSelect(child.path)"
          @mouseenter="handleCityNodeHover?.(child.path)"
          @mouseleave="handleCityNodeCancelHover?.(child.path)"
        >
          <svg
            v-if="child.type === 'dir'"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="child-icon"
          >
            <path d="M2 3H7L8 5H14V13H2V3Z" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="child-icon"
          >
            <path d="M3 1H9L13 5V15H3V1Z" />
            <path d="M9 1V5H13" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>

          <span class="child-name">{{ child.name }}</span>
          <span v-if="child.type === 'dir'" class="child-type">
            {{ getChildrenCount(child) }} {{ $t('rightPanel.items') }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="no-selection">
      <p>{{ $t('rightPanel.noSelection') }}</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { CityNode } from '@/types'
  import { MetricType, MetricsStore, MetricItem, getMetricsByTypes, requiresApiData } from '@/types'
  import { useApi } from '@/composables/useApi'
  import { useConnectionStore } from '@/stores/connectionsStore'
  import SourceCodeButton from '@/components/city/SourceCodeButton.vue'
  import AppButton from '@/components/common/AppButton.vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'

  const props = defineProps<{
    selectedItem?: CityNode | null
    hoveredPath?: string
    navigateUp: () => void
    handleCityNodeSelect: (path: string) => void
    handleCityNodeHover?: (path: string) => void
    handleCityNodeCancelHover?: (path: string) => void
    metricTypes?: MetricType[]
    showFindCoupling?: boolean
  }>()

  const connectionStore = useConnectionStore()
  const { fileDetails, fetchFileDetails, errors } = useApi()

  const metricsStore = ref<MetricsStore>({
    fileDetails: new Map(),
  })

  const isLoadingMetrics = ref(false)
  const metricsError = ref<string | null>(null)

  const displayMetrics = computed(() => {
    if (!props.metricTypes || props.metricTypes.length === 0) {
      return []
    }
    return getMetricsByTypes(props.metricTypes)
  })

  const filteredChildren = ref<CityNode[]>([])

  const sortedChildren = computed(() => {
    return [...filteredChildren.value].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1
      }
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
  })

  watch(
    () => fileDetails.value,
    (newDetails) => {
      metricsStore.value.fileDetails = new Map(Object.entries(newDetails))
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.selectedItem,
    async (newItem) => {
      if (!newItem || newItem.type !== 'file') {
        metricsError.value = null
        return
      }

      if (!props.metricTypes || !requiresApiData(props.metricTypes)) {
        return
      }

      if (metricsStore.value.fileDetails?.has(newItem.path)) {
        return
      }

      await loadFileMetrics(newItem.path)
    },
    { immediate: true }
  )

  function handleSelect(path: string): void {
    props.handleCityNodeCancelHover?.(path)
    props.handleCityNodeSelect(path)
  }

  async function loadFileMetrics(filePath: string) {
    const analysis = connectionStore.analyses.get('/system-overview')

    if (!analysis?.result?.data) {
      metricsError.value = 'Analysis ID not found'
      return
    }

    const analysisId = analysis.result.data
    isLoadingMetrics.value = true
    metricsError.value = null

    const success = await fetchFileDetails(analysisId, filePath)

    isLoadingMetrics.value = false

    if (!success) {
      metricsError.value = errors.value.fileDetails || 'Failed to load metrics'
    }
  }

  async function retryLoadMetrics() {
    if (props.selectedItem?.path) {
      await loadFileMetrics(props.selectedItem.path)
    }
  }

  function isMetricUnavailable(metric: MetricItem): boolean {
    if (!props.selectedItem) return true
    const value = metric.getValue(props.selectedItem, metricsStore.value)
    return value === null || value === undefined
  }

  function getMetricDisplayValue(metric: MetricItem): string {
    if (!props.selectedItem) return '-'
    const value = metric.getValue(props.selectedItem, metricsStore.value)
    if (value === null || value === undefined) return '-'
    return String(value)
  }

  function getChildrenCount(node: CityNode): number {
    return node.children?.length || 0
  }

  function onFindCoupling() {}
  function onXRay() {}
  function onSourceCode() {}
</script>

<style scoped lang="scss">
  .metrics-loading,
  .metrics-error {
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 4px;
    text-align: center;
  }

  .metrics-loading {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-secondary);
  }

  .metrics-error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .retry-button {
    padding: 0.5rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .retry-button:hover {
    opacity: 0.8;
  }

  .metric-unavailable {
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  .right-panel {
    background: var(--color-bg-primary);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    width: 320px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-lg;
  }

  .search-bar-wrapper {
    margin-bottom: $spacing-lg;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);

    h2 {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-tertiary);
      margin: 0;
      flex: 1;
    }

    .back-button {
      background: none;
      border: none;
      color: var(--color-icon);
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      transition: color 0.3s ease;

      &:hover {
        color: var(--color-icon-hover);
      }
    }

    .file-icon {
      color: var(--color-icon);
      display: flex;
    }

    .file-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
  }

  .file-details,
  .directory-children {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    h3 {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-secondary);
      margin: 0 0 1.5rem 0;
      flex-shrink: 0;
    }
  }

  .metrics-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 200px;
    overflow-y: auto;
    margin-bottom: 1rem;
    @include scrollbar;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);

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
    }

    .metric-label {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .info-button {
      background: none;
      border: none;
      color: var(--color-icon);
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      transition: color 0.3s ease;

      &:hover {
        color: var(--color-icon-hover);
      }
    }
  }

  .children-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    min-height: 200px;
    overflow-y: auto;
    @include scrollbar;
  }

  .child-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-item-bg);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid $color-none;

    &.custom-hover {
      background: var(--color-item-bg-hover);
      border-color: var(--color-border);
    }

    &:hover {
      background: var(--color-item-bg-hover);
      border-color: var(--color-border);
    }

    .child-icon {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .child-name {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .child-type {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: auto;
  }

  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
