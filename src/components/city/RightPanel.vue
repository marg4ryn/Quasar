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
          v-if="selectedItem?.type === 'directory'"
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

      <div v-if="displayMetrics && displayMetrics.length" class="metrics-container">
        <div v-for="(metric, index) in displayMetrics" :key="index" class="metric-item">
          <span class="metric-label">{{ metric.label }}:</span>
          <span
            class="metric-value"
            :style="metric.getStyle ? metric.getStyle(selectedItem, metricsStore) : {}"
          >
            {{ metric.getValue(selectedItem, metricsStore) }}
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

    <div
      v-else-if="selectedItem && selectedItem.type === 'directory' && selectedItem.children"
      class="directory-children"
    >
      <h3>{{ $t('rightPanel.directoryContents') }}</h3>
      <AppSearchBar
        class="search-bar"
        type="mini"
        :placeholder="$t('rightPanel.searchPlaceholder')"
        :items="selectedItem?.children || []"
        @filtered="filteredChildren = $event"
      />
      <div class="children-list">
        <div
          v-for="child in filteredChildren"
          :key="child.path"
          class="child-item"
          @click="handleCityNodeSelect(child.path)"
        >
          <svg
            v-if="child.type === 'directory'"
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
          <span v-if="child.type === 'directory'" class="child-type">
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
  import { ref, computed } from 'vue'
  import { CityNode } from '@/types'
  import { MetricType, MetricsStore, getMetricsByTypes } from '@/types'
  import SourceCodeButton from '@/components/city/SourceCodeButton.vue'
  import AppButton from '@/components/common/AppButton.vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'

  const props = defineProps<{
    selectedItem?: CityNode | null
    navigateUp: () => void
    handleCityNodeSelect: (path: string) => void
    metricTypes?: MetricType[]
    showFindCoupling?: boolean
  }>()

  const metricsStore = ref<MetricsStore>({})

  const displayMetrics = computed(() => {
    if (!props.metricTypes || props.metricTypes.length === 0) {
      return []
    }
    return getMetricsByTypes(props.metricTypes)
  })

  const filteredChildren = ref<CityNode[]>([])

  function getChildrenCount(node: CityNode): number {
    return node.children?.length || 0
  }

  function onFindCoupling() {}
  function onXRay() {}
  function onSourceCode() {}
</script>

<style scoped lang="scss">
  .right-panel {
    background: var(--color-bg-primary);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    width: 320px;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-lg;
  }

  .search-bar {
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
    }

    .metric-value {
      font-size: 0.9rem;
      font-weight: 600;
      word-break: break-all;
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
