<template>
  <nav class="tab-navigation">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-item"
      :class="{ active: activeTab === tab.id, hovered: hoveredTab === tab.id }"
      @click="handleTabClick(tab.id)"
      @mouseenter="hoveredTab = tab.id"
      @mouseleave="hoveredTab = null"
    >
      <Transition name="expand">
        <span v-if="hoveredTab === tab.id || activeTab === tab.id" class="tab-label">
          {{ tab.label }}
        </span>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  interface Tab {
    id: string
    label: string
    route: string
  }

  const props = defineProps<{
    tabs: Tab[]
  }>()

  const router = useRouter()
  const route = useRoute()

  const hoveredTab = ref<string | null>(null)
  const currentTab = ref<string | null>(null)

  const activeTab = computed(() => {
    const match = props.tabs.find((tab) => route.path.startsWith(tab.route))
    return match ? match.id : currentTab.value
  })

  function handleTabClick(tabId: string) {
    const tab = props.tabs.find((t) => t.id === tabId)
    if (tab?.route) {
      router.push(tab.route)
    }
  }

  watch(
    () => route.path,
    (newPath) => {
      const match = props.tabs.find((tab) => newPath.startsWith(tab.route))
      currentTab.value = match ? match.id : null
    },
    { immediate: true }
  )
</script>

<style scoped lang="scss">
  .tab-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    border-radius: 1rem;
    background: var(--color-text-muted);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: scale(1.05);
    }

    &.active,
    &.hovered {
      padding: 0 1.25rem;
      background: var(--color-text-primary);
    }
  }

  .tab-label {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: rgba(0, 0, 0, 1);
    white-space: nowrap;
  }

  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .expand-enter-from,
  .expand-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }

  .expand-enter-to,
  .expand-leave-from {
    opacity: 1;
    transform: scale(1);
  }
</style>
