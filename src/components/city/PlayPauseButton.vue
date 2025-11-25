<template>
  <button @click="toggleRotate" class="play-pause-btn" :aria-label="autoRotate ? 'Pause' : 'Play'">
    <svg v-if="autoRotate" viewBox="0 0 24 24" class="icon">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
    <svg v-else viewBox="0 0 24 24" class="icon">
      <polygon points="8,5 19,12 8,19" />
    </svg>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    autoRotate: boolean
  }>()

  const emit = defineEmits<{
    'update:autoRotate': [value: boolean]
  }>()

  const toggleRotate = () => {
    emit('update:autoRotate', !props.autoRotate)
  }
</script>

<style scoped lang="scss">
  .play-pause-btn {
    width: 3.5rem;
    height: 3.5rem;
    background: transparent;
    border: 2px solid var(--color-border);
    border-radius: 50%;
    backdrop-filter: blur(4px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--color-border-hover);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    .icon {
      width: 2rem;
      height: 2rem;
      fill: white;
    }
  }
</style>
