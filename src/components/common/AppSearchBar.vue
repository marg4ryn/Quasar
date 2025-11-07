<template>
  <div class="search-bar" :style="{ maxWidth }">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      class="search-input"
    />
    <button class="search-button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" />
        <path d="M12.5 12.5L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      modelValue: string
      placeholder?: string
      maxWidth?: string
    }>(),
    {
      maxWidth: '100%',
    }
  )

  defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const placeholder = computed(() => props.placeholder || t('common.searchBarPlaceholder'))
</script>

<style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;

    .search-input {
      width: 400px;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0);
      border: 1px solid rgba(255, 255, 255, 0);
      border-radius: 24px;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: var(--color-text-muted);
      }

      &:focus {
        outline: none;
      }
    }

    .search-button {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0);
      border: 1px solid rgba(255, 255, 255, 0);
      border-radius: 50%;
      color: var(--color-text-secondary);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }
  }
</style>
