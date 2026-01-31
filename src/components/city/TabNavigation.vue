<template>
  <div class="tab-navigation-wrapper">
    <nav class="tab-navigation">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id, hovered: hoveredTab === tab.id }"
        @click="handleTabClick(tab.id)"
        @mouseenter="hoveredTab = tab.id"
        @mouseleave="hoveredTab = null"
      ></div>
    </nav>
    <transition name="fade">
      <div v-if="hoveredTab || activeTab" class="tab-label">
        {{ getLabelForTab(hoveredTab || activeTab) }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useNavigation } from '@/composables/useNavigation'

  const { t } = useI18n()

  interface Tab {
    id: string
    label: string
    route: string
  }

  const props = defineProps<{
    tabs: Tab[]
  }>()

  const route = useRoute()
  const { navigateTo } = useNavigation()

  const hoveredTab = ref<string | null>(null)
  const currentTab = ref<string | null>(null)

  const activeTab = computed(() => {
    const match = props.tabs.find((tab) => route.path.endsWith(tab.route))
    return match ? match.id : currentTab.value
  })

  function handleTabClick(tabId: string) {
    const tab = props.tabs.find((t) => t.id === tabId)
    if (tab?.route) {
      navigateTo(tab.route)
    }
  }

  function getLabelForTab(tabId: string | null) {
    if (!tabId) return ''
    const tab = props.tabs.find((t) => t.id === tabId)
    return t(tab?.label ?? '') || ''
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
  .tab-navigation-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

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
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    border-radius: 50%;
    background: var(--color-text-muted);
    transition:
      background 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: scale(1.15);
    }

    &.active,
    &.hovered {
      background: var(--color-text-primary);
    }
  }

  .tab-label {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--color-text-primary);
    white-space: nowrap;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
