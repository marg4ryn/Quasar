<template>
  <button
    class="icon-button"
    @click="handleBack"
    :title="t('common.close')"
    :aria-label="t('common.close')"
    :style="{ top: buttonTop }"
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
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUIStore } from '@/stores/uiStore'
  import { t } from '@/plugins/i18n'

  const router = useRouter()
  const uiStore = useUIStore()

  const handleBack = () => {
    router.back()
  }

  const buttonTop = computed(() => (uiStore.isAppBarVisible ? '8px' : '48px'))
</script>

<style lang="scss" scoped>
  .icon-button {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--color-text-primary);
    cursor: pointer;
    padding: 3px;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
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
