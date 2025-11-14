<template>
  <aside class="left-panel" :style="{ maxHeight }">
    <div class="panel-header">
      <h2>{{ props.label }}</h2>

      <button v-if="props.showInfo" class="info-button" @mouseenter="props.onInfoHover?.()">
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
    </div>
    <AppSearchBar
      class="search-bar"
      type="mini"
      :placeholder="$t('rightPanel.searchPlaceholder')"
      :items="items || []"
      @filtered="filteredItems = $event"
    />
    <div class="item-list">
      <div
        v-for="item in filteredItems"
        :key="item.path"
        class="file-item"
        :class="{ active: props.selectedPath === item.path }"
        @click="props.handleFileSelect(item.path)"
      >
        <slot name="item" :item="item" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'

  const props = defineProps<{
    items: Array<{ path: string; name?: string; [key: string]: any }>
    label: string
    selectedPath?: string
    handleFileSelect: (path: string) => void
    showInfo?: boolean
    onInfoHover?: () => void
    maxHeight?: string
  }>()

  const maxHeight = computed(() => props.maxHeight || '100%')

  const filteredItems = ref<typeof props.items>(props.items || [])
</script>

<style scoped lang="scss">
  .left-panel {
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

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    flex: 1;
    @include scrollbar;
  }

  .file-item {
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

    &:hover {
      background: var(--color-item-bg-hover);
      border-color: var(--color-border);
    }

    &.active {
      background: var(--color-item-bg-hover);
      border-color: var(--color-border);
    }
  }
</style>
