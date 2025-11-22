<template>
  <aside class="left-panel" :style="{ maxHeight }">
    <div class="panel-header">
      <h2>{{ $t(props.labelKey) }}</h2>

      <button v-if="props.infoKey" class="info-button" :title="$t(props.infoKey)">
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
      class="search-bar-wrapper"
      type="mini"
      :placeholder="$t('rightPanel.searchPlaceholder')"
      :items="props.items || []"
      @filtered="handleFiltered"
    />

    <div class="item-list">
      <div
        v-for="item in displayItems"
        :key="item.path"
        class="file-item"
        :class="{ active: props.selectedPath === item.path }"
        @click="props.handleFileSelect?.(item.path)"
        @mouseenter="props.handleFileHover?.(item.path)"
        @mouseleave="props.handleFileCancelHover?.()"
      >
        <slot name="item" :item="item">
          <span class="item-name">{{ item.name }}</span>
        </slot>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'

  const props = withDefaults(
    defineProps<{
      items: Array<{
        path: string
        name: string
        [key: string]: any
      }>
      labelKey: string
      infoKey?: string
      selectedPath?: string
      handleFileSelect?: (path: string) => void
      handleFileHover?: (path: string) => void
      handleFileCancelHover?: () => void
      maxHeight?: string
    }>(),
    {
      maxHeight: '100%',
    }
  )

  const maxHeight = computed(() => props.maxHeight)
  const filteredItems = ref<typeof props.items>([])

  const displayItems = computed(() => {
    return filteredItems.value
  })

  watch(
    () => props.items,
    (newItems) => {
      filteredItems.value = newItems
    },
    { immediate: true }
  )

  function handleFiltered(filtered: typeof props.items) {
    filteredItems.value = filtered
  }
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

    .item-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
