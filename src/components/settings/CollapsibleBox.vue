<template>
  <div class="collapsible-box">
    <div class="collapsible-header" @click="handleClick">
      <h2 class="collapsible-label">{{ label }}</h2>
      <svg
        :class="{ rotated: !isCollapsed }"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <transition name="collapse" @enter="enter" @leave="leave">
      <div v-if="!isCollapsed" class="collapsible-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'CollapsibleBox' })

  defineProps<{
    label: string
    isCollapsed: boolean
  }>()

  const emit = defineEmits<{
    (e: 'toggle'): void
  }>()

  const handleClick = () => emit('toggle')

  function enter(el: Element, done: () => void) {
    const element = el as HTMLElement
    element.style.height = '0'
    element.style.opacity = '0'
    const height = element.scrollHeight

    requestAnimationFrame(() => {
      element.style.transition = 'height 0.3s ease, opacity 0.3s ease'
      element.style.height = height + 'px'
      element.style.opacity = '1'
    })

    element.addEventListener('transitionend', () => done(), { once: true })
  }

  function leave(el: Element, done: () => void) {
    const element = el as HTMLElement
    element.style.height = element.scrollHeight + 'px'
    element.style.opacity = '1'

    requestAnimationFrame(() => {
      element.style.transition = 'height 0.3s ease, opacity 0.3s ease'
      element.style.height = '0'
      element.style.opacity = '0'
    })

    element.addEventListener('transitionend', () => done(), { once: true })
  }
</script>

<style lang="scss" scoped>
  .collapsible-box {
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
    width: 40%;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
    min-width: 500px;
  }

  .collapsible-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border: 1px solid var(--color-border);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-bg-secondary);
    }
  }

  .collapsible-label {
    font-weight: 400;
    font-size: 1.1em;
    color: var(--color-text-primary);
  }

  .collapsible-header svg {
    width: 20px;
    height: 20px;
    transform: rotate(0deg);
    transition: transform 0.3s ease;
    color: var(--color-text-primary);
  }

  .collapsible-header svg.rotated {
    transform: rotate(180deg);
  }

  .collapsible-content {
    padding: 16px;
    overflow: hidden;
  }
</style>
