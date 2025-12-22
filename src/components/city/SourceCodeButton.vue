<template>
  <button class="app-button" @click="handleClick">
    <span class="label-text">{{ label }}</span>
    <img src="/icons/external-link.png" alt="External link" class="icon" />
  </button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    emit('click')
  }

  const label = t('rightPanel.sourceCode')
</script>

<style scoped lang="scss">
  .app-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;

    background: none;
    color: white;
    border: 1px solid var(--color-border);

    &:hover {
      background: var(--color-button-secondary-hover);
      border-color: var(--color-border-hover);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    .icon {
      width: 16px;
      height: 16px;
      opacity: 0.85;
      transition: opacity 0.2s;
    }

    &:hover .icon {
      opacity: 1;
    }
  }
</style>
