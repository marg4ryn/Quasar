<template>
  <button :class="['app-button', `app-button--${variant || 'primary'}`]" @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
    variant?: 'primary' | 'secondary' | 'danger'
  }>()

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    emit('click')
  }
</script>

<style scoped lang="scss">
  .app-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;

    &--primary {
      background: $color-button-primary;
      color: white;

      &:hover {
        background: $color-button-primary-hover;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &--secondary {
      background: var(--color-button-secondary);
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
    }

    &--danger {
      background: var(--color-button-danger-bg);
      color: #fff;
      border: 1px solid $color-button-danger;
      transition: all 0.2s ease;

      &:hover {
        background: $color-button-danger;
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
</style>
