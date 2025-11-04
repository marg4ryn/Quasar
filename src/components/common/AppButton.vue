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

<template>
  <button :class="['app-button', `app-button--${variant || 'primary'}`]" @click="handleClick">
    {{ label }}
  </button>
</template>

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
      background: #22c55e;
      color: white;

      &:hover {
        background: #16a34a;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &--secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &--danger {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid #ef4444;
      transition: all 0.2s ease;

      &:hover {
        background: #ef4444;
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
