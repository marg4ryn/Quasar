<template>
  <div :class="['search-bar-container', type]">
    <div :class="['search-bar', type, { 'has-results': showDropdown }]">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      <button v-if="searchQuery" class="clear-button" @click="clear" type="button">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <span v-else class="search-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" />
          <path
            d="M12.5 12.5L17 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </div>

    <div
      v-if="type === 'normal' && showDropdown && filteredItems.length > 0"
      class="search-dropdown"
      @mousedown.prevent
    >
      <div class="dropdown-header">
        <span class="results-count"> {{ filteredItems.length }} {{ $t('search.results') }}</span>
      </div>
      <div class="dropdown-list">
        <div
          v-for="(item, index) in filteredItems.slice(0, maxResults)"
          :key="item.path"
          :class="['dropdown-item', { selected: index === selectedIndex }]"
          @click="handleItemClick(item)"
          @mouseenter="handleItemHover(item, index)"
          @mouseleave="handleItemLeave()"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="item-icon">
            <path d="M3 1H9L13 5V15H3V1Z" />
            <path d="M9 1V5H13" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
          <div class="item-content">
            <span class="item-name" v-html="highlightMatch(item.name)"></span>
            <span class="item-path">{{ item.path }}</span>
          </div>
        </div>
        <div v-if="filteredItems.length > maxResults" class="dropdown-more">
          +{{ filteredItems.length - maxResults }} {{ $t('search.moreResults') }}
        </div>
      </div>
    </div>
    <div
      v-if="type === 'normal' && showDropdown && filteredItems.length === 0"
      class="search-dropdown no-results"
      @mousedown.prevent
    >
      <div class="no-results-content">
        <span>{{ $t('search.noResults') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import type { FileListItem } from '@/types/restApi'

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      type?: 'normal' | 'mini'
      items?: any[]
      fileMap?: Map<string, { path: string; name: string }>
      maxResults?: number
    }>(),
    {
      type: 'normal',
      items: () => [],
      maxResults: 10,
    }
  )

  const emit = defineEmits<{
    (e: 'filtered', items: any[]): void
    (e: 'select', item: FileListItem): void
    (e: 'hover', item: FileListItem): void
    (e: 'hoverLeave'): void
  }>()

  const inputRef = ref<HTMLInputElement | null>(null)
  const searchQuery = ref('')
  const isFocused = ref(false)
  const selectedIndex = ref(-1)

  const sourceItems = computed(() => {
    if (props.fileMap && props.fileMap.size > 0) {
      return Array.from(props.fileMap.values())
    }
    return props.items
  })

  const filteredItems = computed(() => {
    if (!searchQuery.value || !sourceItems.value.length) {
      return props.type === 'normal' ? [] : sourceItems.value
    }

    const query = searchQuery.value.toLowerCase()
    return sourceItems.value.filter((item) => {
      const name = item.name?.toLowerCase() || ''
      return name.includes(query)
    })
  })

  const showDropdown = computed(() => {
    return searchQuery.value.length > 0
  })

  watch(
    filteredItems,
    (newFilteredItems) => {
      if (props.type === 'mini') {
        emit('filtered', newFilteredItems)
      }
    },
    { immediate: true }
  )

  watch(showDropdown, (isVisible) => {
    if (!isVisible) {
      selectedIndex.value = -1
    }
  })

  function handleFocus() {
    isFocused.value = true
  }

  function handleBlur() {
    setTimeout(() => {
      isFocused.value = false
    }, 200)
  }

  function handleItemClick(item: FileListItem) {
    handleItemLeave()
    emit('select', item)
    searchQuery.value = ''
    selectedIndex.value = -1
    inputRef.value?.blur()
  }

  function handleItemHover(item: FileListItem, index: number) {
    selectedIndex.value = index
    emit('hover', item)
  }

  function handleItemLeave() {
    emit('hoverLeave')
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!showDropdown.value) return

    const maxIndex = Math.min(filteredItems.value.length, props.maxResults) - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex)
        if (selectedIndex.value >= 0) {
          emit('hover', filteredItems.value[selectedIndex.value])
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (selectedIndex.value > 0) {
          selectedIndex.value--
          emit('hover', filteredItems.value[selectedIndex.value])
        } else {
          selectedIndex.value = -1
          emit('hoverLeave')
        }
        break

      case 'Enter':
        e.preventDefault()
        if (selectedIndex.value >= 0 && filteredItems.value[selectedIndex.value]) {
          handleItemClick(filteredItems.value[selectedIndex.value])
        }
        break

      case 'Escape':
        e.preventDefault()
        searchQuery.value = ''
        selectedIndex.value = -1
        inputRef.value?.blur()
        break
    }
  }

  function highlightMatch(text: string): string {
    if (!searchQuery.value) return text

    const query = searchQuery.value
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  function clear() {
    searchQuery.value = ''
    selectedIndex.value = -1
    inputRef.value?.focus()
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest('.search-bar-container')) {
      isFocused.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped lang="scss">
  .search-bar-container {
    position: relative;
    width: 100%;

    &.normal {
      width: 260px;
    }
  }

  .search-bar {
    width: 100%;
    padding: $input-padding-y $input-padding-x;
    border: $input-border-width solid var(--color-input-border);
    color: var(--color-text-primary);
    font-size: $font-size-base;
    transition: all $transition-base;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    height: 38px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);

    &.normal {
      &.has-results {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus-within {
      outline: none;
      border-color: var(--color-input-border-hover);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.normal {
      width: 100%;
      background-color: rgba(0, 0, 0, 0.25);
    }

    &.mini {
      width: 100%;
      font-size: 0.85rem;
      background: transparent;
    }

    &:hover {
      border-color: var(--color-input-border-hover);
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 0;
      border-radius: 24px;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &:hover {
        background: transparent;
      }

      &::placeholder {
        color: var(--color-text-muted);
      }

      &:focus {
        outline: none;
      }
    }

    .search-icon {
      padding: 5px;
      background: transparent;
      border: 0;
      border-radius: 50%;
      color: var(--color-icon);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }

    .clear-button {
      padding: 5px;
      background: transparent;
      border: 0;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-button);
      font-size: 1.2rem;

      &:hover {
        color: var(--color-button-hover);
      }

      &:focus {
        color: $color-button-danger;
        outline: none;
      }
    }
  }

  .no-results-content {
    margin: 8px;
    text-align: center;
    opacity: 0.8;
  }

  .search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    border: $input-border-width solid var(--color-input-border);
    border-top: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 1000;
    max-height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .no-results {
      padding: 12px;
      color: #777;
      font-size: 14px;
    }
    .dropdown-header {
      padding: 0.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);

      .results-count {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .dropdown-list {
      overflow-y: auto;
      max-height: 350px;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:hover,
      &.selected {
        background: rgba(255, 255, 255, 0.1);
      }

      &:last-child {
        border-bottom: none;
      }

      .item-icon {
        flex-shrink: 0;
        color: var(--color-icon);
      }

      .item-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .item-name {
          font-size: 0.9rem;
          color: var(--color-text-primary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          :deep(mark) {
            background: rgba(59, 130, 246, 0.3);
            color: #60a5fa;
            padding: 0 2px;
            border-radius: 2px;
          }
        }

        .item-path {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-family-monospace);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .dropdown-more {
      padding: 0.75rem 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--color-text-muted);
      background: rgba(255, 255, 255, 0.05);
    }
  }
</style>
