<template>
  <div class="section-header">
    <h3 class="section-label">{{ label }}</h3>
    <div class="horizontal-line"></div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    label: string
  }

  defineProps<Props>()
</script>

<style lang="scss" scoped>
  .section-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 16px;
    gap: 8px;
  }

  .section-label {
    font-size: 1em;
    font-weight: 400;
    color: var(--color-text-tertiary);
    margin: 0;
    white-space: nowrap;
  }

  .horizontal-line {
    width: 100%;
    height: 1px;
    background-color: var(--color-border);
  }
</style>
