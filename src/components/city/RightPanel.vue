<template>
  <aside class="right-panel" :style="{ maxHeight }">
    <div class="panel-header">
      <button v-if="selectedPath && selectedPath !== '/'" class="back-button" @click="navigateUp">
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

      <span class="file-title">{{ selectedItem?.name || 'Select a file' }}</span>
    </div>

    <div v-if="selectedItem && selectedItem.type === 'file'" class="file-details">
      <h3>FILE METRICS</h3>

      <slot name="metrics" :item="selectedItem" :selectedColorData="selectedColorData" />

      <div class="action-buttons">
        <AppButton
          v-if="showFindCoupling"
          label="Find Coupling"
          variant="primary"
          @click="onFindCoupling"
        />
        <AppButton label="X-Ray" variant="primary" @click="onXRay" />
        <AppButton label="Source Code" variant="secondary" @click="onSourceCode" />
      </div>
    </div>

    <div
      v-else-if="selectedItem && selectedItem.type === 'directory' && selectedItem.children"
      class="directory-children"
    >
      <h3>DIRECTORY CONTENTS</h3>

      <div class="children-list">
        <div
          v-for="child in selectedItem.children"
          :key="child.path"
          class="child-item"
          @click="handleFileSelect(child.path)"
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
            {{ getChildrenCount(child) }} items
          </span>
        </div>
      </div>
    </div>

    <div v-else class="no-selection">
      <p>Select a file or directory to view details</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'
  import AppButton from '../common/AppButton.vue'

  const props = defineProps<{
    selectedItem: any
    selectedPath?: string
    navigateUp: () => void
    handleFileSelect: (path: string) => void
    getChildrenCount: (item: any) => number
    getIntensityColor?: (value: number) => string
    selectedColorData?: { intensity: number } | null
    showFindCoupling?: boolean
    onFindCoupling?: () => void
    onXRay?: () => void
    onSourceCode?: () => void
    maxHeight?: string
  }>()

  const maxHeight = props.maxHeight || '100%'
</script>

<style scoped>
  .right-panel {
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

    .info-button,
    .back-button {
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

    .file-icon {
      color: rgba(255, 255, 255, 0.7);
      display: flex;
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

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    gap: 0.75rem;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--color-border);
    }

    &.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--color-border);
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 0;

      .file-icon {
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
      }

      .file-name {
        font-size: 0.85rem;
        color: #e6e6e6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .file-suspicion {
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }
  }

  .project-view {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    width: 60vw;
    height: 80vh;
  }

  .file-details,
  .directory-children {
    display: flex;
    flex-direction: column;
    height: 100%;

    h3 {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1.5rem 0;
    }
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    .metric-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .metric-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e6e6e6;
      word-break: break-all;

      &.path-value {
        font-size: 0.75rem;
        font-family: 'Monaco', 'Courier New', monospace;
        color: rgba(255, 255, 255, 0.8);
      }

      &.suspicion-value {
        font-weight: 700;
        font-size: 1.1rem;
      }

      .color-box {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        vertical-align: middle;
        margin-right: 0.5rem;
      }
    }
  }

  .children-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    max-height: 400px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
  }

  .child-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .child-icon {
      color: rgba(255, 255, 255, 0.6);
      flex-shrink: 0;
    }

    .child-name {
      font-size: 0.85rem;
      color: #e6e6e6;
      flex: 1;
    }

    .child-type {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
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
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
    text-align: center;
  }
</style>
