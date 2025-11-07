<template>
  <aside class="left-panel" :style="{ maxHeight }">
    <div class="panel-header">
      <h2>SUSPICIOUS FILES</h2>

      <button v-if="showInfo" class="info-button" @mouseenter="onInfoHover?.()">
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

    <div class="files-list">
      <div
        v-for="item in items"
        :key="item.path"
        class="file-item"
        :class="{ active: selectedPath === item.path }"
        @click="handleFileSelect(item.path)"
      >
        <slot name="item" :item="item" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: Array<{ path: string; [key: string]: any }>
    selectedPath?: string
    handleFileSelect: (path: string) => void
    showInfo?: boolean
    onInfoHover?: () => void
    maxHeight?: string
  }>()

  const maxHeight = props.maxHeight || '100%'
</script>

<style scoped>
  .left-panel {
    background: var(--color-bg-secondary);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 1.5rem;
    width: 320px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      transition: color 0.3s ease;

      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .file-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e6e6e6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
  }

  .files-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-primary);
      border-radius: 3px;

      &:hover {
        background: (var(--color-primary-light));
        cursor: pointer;
      }
    }
  }
</style>
