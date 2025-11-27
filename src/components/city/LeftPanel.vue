<template>
  <aside class="left-panel" :style="{ maxHeight }">
    <div class="panel-header">
      <h2>{{ $t(props.labelKey) }}</h2>

      <div class="info-button">
        <InfoTooltip
          v-if="props.infoKey"
          :text="$t(props.infoKey)"
          position="bottom"
          :width="350"
          :icon-size="20"
        />
      </div>
    </div>

    <div
      v-if="props.itemType === 'author' && props.allowLoading && isFileDetailsLoading"
      class="metrics-loading"
    >
      <LoadingBar
        :show="true"
        :blur="false"
        :label="'common.loading'"
        :show-cancel-button="false"
      />
    </div>
    <div v-else class="panel-content">
      <AppSearchBar
        class="search-bar-wrapper"
        type="mini"
        :placeholder="$t(searchPlaceholder)"
        :items="props.items || []"
        @filtered="handleFiltered"
      />

      <div class="item-list">
        <div v-if="displayItems.length === 0" class="empty-state">
          <p class="empty-message">{{ $t(emptyMessage) }}</p>
        </div>

        <div
          v-for="item in displayItems"
          :key="itemKey(item)"
          class="file-item"
          :class="{
            active: isItemActive(item),
            'disable-interactions': props.itemType === 'author' || props.itemType === 'default',
          }"
          @click="handleItemClick(item)"
          @mouseenter="handleItemHover(item)"
          @mouseleave="handleItemCancelHover()"
        >
          <slot name="item" :item="item">
            <span class="item-name">{{ itemLabel(item) }}</span>
          </slot>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'
  import InfoTooltip from '@/components/modals/InfoTooltip.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  type ItemType = 'file' | 'author' | 'default'

  interface BaseItem {
    [key: string]: any
  }

  export interface FileItem extends BaseItem {
    path: string
    name: string
  }

  export interface AuthorItem extends BaseItem {
    name: string
  }

  export interface DefaultItem extends BaseItem {
    name: string
  }

  const props = withDefaults(
    defineProps<{
      items: Array<FileItem | AuthorItem | DefaultItem>
      labelKey: string
      infoKey?: string
      itemType?: ItemType
      selectedPath?: string
      selectedAuthor?: string
      hoveredPath?: string
      hoveredAuthor?: string
      handleFileSelect?: (path: string) => void
      handleFileHover?: (path: string) => void
      handleFileCancelHover?: () => void
      handleAuthorSelect?: (name: string) => void
      handleAuthorHover?: (name: string) => void
      handleAuthorCancelHover?: () => void
      maxHeight?: string
      allowLoading?: boolean
    }>(),
    {
      maxHeight: '100%',
      itemType: 'file',
      allowLoading: true,
    }
  )

  const { isFileDetailsLoading } = useRestApi()
  const maxHeight = computed(() => props.maxHeight)
  const filteredItems = ref<typeof props.items>([])

  const displayItems = computed(() => {
    return filteredItems.value.slice(0, 100)
  })

  const searchPlaceholder = computed(() => {
    if (props.itemType === 'author') {
      return 'leftPanel.searchAuthorsPlaceholder'
    } else if (props.itemType === 'default') {
      return 'leftPanel.searchItemsPlaceholder'
    }
    return 'leftPanel.searchFilesPlaceholder'
  })

  const emptyMessage = computed(() => {
    if (props.itemType === 'author') {
      return 'common.noAuthors'
    } else if (props.itemType === 'default') {
      return 'common.noItems'
    }
    return 'common.noFiles'
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

  function itemKey(item: FileItem | AuthorItem | DefaultItem): string {
    if (props.itemType === 'author' || props.itemType === 'default') {
      return (item as AuthorItem | DefaultItem).name
    }
    return (item as FileItem).path
  }

  function itemLabel(item: FileItem | AuthorItem | DefaultItem): string {
    return item.name
  }

  function isItemActive(item: FileItem | AuthorItem | DefaultItem): boolean {
    if (props.itemType === 'default') {
      return false
    }
    if (props.itemType === 'author') {
      const authorItem = item as AuthorItem
      return props.selectedAuthor === authorItem.name || props.hoveredAuthor === authorItem.name
    }
    const fileItem = item as FileItem
    return props.selectedPath === fileItem.path || props.hoveredPath === fileItem.path
  }

  function handleItemClick(item: FileItem | AuthorItem | DefaultItem): void {
    if (props.itemType === 'default') {
      return
    }
    if (props.itemType === 'author') {
      props.handleAuthorSelect?.((item as AuthorItem).name)
    } else {
      props.handleFileSelect?.((item as FileItem).path)
    }
  }

  function handleItemHover(item: FileItem | AuthorItem | DefaultItem): void {
    if (props.itemType === 'default') {
      return
    }
    if (props.itemType === 'author') {
      props.handleAuthorHover?.((item as AuthorItem).name)
    } else {
      props.handleFileHover?.((item as FileItem).path)
    }
  }

  function handleItemCancelHover(): void {
    if (props.itemType === 'default') {
      return
    }
    if (props.itemType === 'author') {
      props.handleAuthorCancelHover?.()
    } else {
      props.handleFileCancelHover?.()
    }
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

  .panel-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0; // Important for proper scrolling
  }

  .search-bar-wrapper {
    margin-bottom: $spacing-lg;
    flex-shrink: 0; // Prevent search bar from shrinking
  }

  .metrics-loading {
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: var(--color-text-secondary);
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0; // Prevent header from shrinking

    h2 {
      font-size: 0.75rem;
      padding: 8px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-tertiary);
      margin: 0;
      flex: 1;
    }

    .info-button {
      background: none;
      border: none;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
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
    min-height: 0; // Important for proper scrolling
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

  .file-item.disable-interactions {
    &.active,
    &:hover {
      background: var(--color-item-bg);
      border-color: $color-none;
      cursor: default;
    }
  }

  .empty-state {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid $color-none;
    font-size: $font-size-sm;

    .empty-message {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      color: var(--color-text-muted);
      text-align: center;
    }
  }
</style>
