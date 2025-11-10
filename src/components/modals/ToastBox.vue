<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      class="toast"
      :class="`toast--${variant}`"
      @mouseenter="pauseTimer"
      @mouseleave="resumeTimer"
    >
      <span class="toast-message">{{ message }}</span>
      <button class="toast-close" @click="close">✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const emit = defineEmits(['close'])

  const props = defineProps<{
    message: string
    variant?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
    onClose?: () => void
  }>()

  const visible = ref(true)
  const timeoutId = ref<number | null>(null)
  const remaining = ref(props.duration ?? 5000)
  let startTime: number

  const close = () => {
    visible.value = false
    emit('close')
  }

  const startTimer = () => {
    startTime = Date.now()
    timeoutId.value = window.setTimeout(close, remaining.value)
  }

  const pauseTimer = () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      remaining.value -= Date.now() - startTime
    }
  }

  const resumeTimer = () => {
    startTimer()
  }

  onMounted(() => {
    startTimer()
  })

  onUnmounted(() => {
    if (timeoutId.value) clearTimeout(timeoutId.value)
  })
</script>

<style scoped lang="scss">
  .toast {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    min-width: 280px;
    max-width: 400px;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    cursor: default;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;

    &.toast--success {
      background: linear-gradient(135deg, $color-success, $color-success-dark);
    }

    &.toast--error {
      background: linear-gradient(135deg, $color-error, $color-error-dark);
    }

    &.toast--info {
      background: linear-gradient(135deg, $color-info, $color-info-dark);
    }

    &.toast--warning {
      background: linear-gradient(135deg, $color-warning, $color-warning-dark);
    }

    .toast-message {
      flex: 1;
      text-align: left;
      padding-right: 1rem;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.3s ease;
  }

  .slide-up-enter-from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }

  .slide-up-enter-to {
    transform: translate(-50%, 0);
    opacity: 1;
  }

  .slide-up-leave-from {
    transform: translate(-50%, 0);
    opacity: 1;
  }

  .slide-up-leave-to {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
</style>
