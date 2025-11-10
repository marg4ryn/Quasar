<template>
  <button
    class="icon-button"
    @click="handleBack"
    :title="t('common.close')"
    :aria-label="t('common.close')"
  >
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
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }
</script>

<style lang="scss" scoped>
  .icon-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--color-text-primary);
    cursor: pointer;
    padding: 8px;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
      color: $color-button-danger;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-button-danger;
      border-radius: 4px;
    }

    svg {
      width: 42px;
      height: 42px;
    }
  }
</style>
