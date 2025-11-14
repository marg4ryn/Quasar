<template>
  <div class="code-city-page" @mousemove="handleMouseMove">
    <div
      v-if="hoveredItem && showToolbar"
      class="hover-toolbar"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
    >
      {{ hoveredItem.name }}
    </div>

    <TabNavigation class="tab-nav" :tabs="tabs" />

    <AppSearchBar v-model="searchQuery" class="search-bar-wrapper" type="normal" />

    <div class="left-panels-container">
      <LeftPanel
        v-if="leftPanelConfig"
        class="left-panel"
        :class="{ 'has-second-panel': secondLeftPanelConfig }"
        :label="leftPanelConfig.label"
        :items="leftPanelConfig.items"
        :selectedPath="selectedPath"
        :handleFileSelect="handleCityNodeSelect"
        :showInfo="leftPanelConfig.showInfo"
      >
        <template #item="{ item }">
          <slot name="leftPanelItem" :item="item">
            <div class="default-item">{{ item.name }}</div>
          </slot>
        </template>
      </LeftPanel>

      <LeftPanel
        v-if="secondLeftPanelConfig"
        class="left-panel second-panel"
        :label="secondLeftPanelConfig.label"
        :items="secondLeftPanelConfig.items"
        :selectedPath="selectedPath"
        :handleFileSelect="handleCityNodeSelect"
        :showInfo="secondLeftPanelConfig.showInfo"
      >
        <template #item="{ item }">
          <slot name="secondLeftPanelItem" :item="item">
            <div class="default-item">{{ item.name }}</div>
          </slot>
        </template>
      </LeftPanel>
    </div>

    <CodeCity
      class="code-city"
      :data="cityData"
      :colorData="colorData"
      @cityNodeClick="handleCityNodeClick"
      @cityNodeHover="handleCityNodeHover"
      @cityNodeCancelHover="handleCityNodeCancelHover"
    />

    <RightPanel
      v-if="rightPanelConfig"
      class="right-panel"
      :selectedItem="selectedItem"
      :hoveredPath="hoveredPath"
      :navigateUp="navigateUp"
      :handleCityNodeSelect="handleCityNodeSelect"
      :handleCityNodeHover="handleCityNodeHover"
      :handleCityNodeCancelHover="handleCityNodeCancelHover"
      :showFindCoupling="rightPanelConfig.showFindCoupling"
      :metric-types="rightPanelConfig.metricTypes"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useLogger } from '@/composables/useLogger'
  import { useCodeCityController } from '@/composables/useCodeCityController'
  import { useCityStore } from '@/stores/cityStore'
  import { useApiStore } from '@/stores/apiStore'
  import { MetricType, CityNode } from '@/types'

  import TabNavigation from '@/components/city/TabNavigation.vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'
  import LeftPanel from '@/components/city/LeftPanel.vue'
  import RightPanel from '@/components/city/RightPanel.vue'
  import CodeCity from '@/components/visuals/CodeCity.vue'

  interface LeftPanelConfig {
    label: string
    items: any[]
    showInfo?: boolean
  }

  interface RightPanelConfig {
    metricTypes?: MetricType[]
    showFindCoupling?: boolean
  }

  interface Props {
    tabs: Array<{ id: string; label: string; route: string }>
    colorData: any[]
    leftPanelConfig?: LeftPanelConfig
    secondLeftPanelConfig?: LeftPanelConfig
    rightPanelConfig?: RightPanelConfig
  }

  withDefaults(defineProps<Props>(), {
    leftPanelConfig: undefined,
    secondLeftPanelConfig: undefined,
    rightPanelConfig: undefined,
    filterItems: undefined,
  })

  const { selectCityNode, setCityNodeHoverByPath } = useCodeCityController()
  const log = useLogger('CodeCityPageTemplate')
  const cityStore = useCityStore()
  const searchQuery = ref('')
  const selectedPath = ref<string>('')
  const hoveredPath = ref<string>('')
  const mouseX = ref(0)
  const mouseY = ref(0)
  const showToolbar = ref(true)
  const apiStore = useApiStore()
  const isEmpty = Object.keys(apiStore.structure).length === 0
  const cityData = !isEmpty ? apiStore.structure : cityStore.cityData
  console.log(cityData)

  const selectedItem = computed(() => {
    return findNodeByPath(selectedPath.value, cityData)
  })

  const hoveredItem = computed(() => {
    return findNodeByPath(hoveredPath.value, cityData)
  })

  function findNodeByPath(path: string, root: CityNode): CityNode | null {
    if (root.path === path) return root

    if (root.children) {
      for (const child of root.children) {
        const found = findNodeByPath(path, child)
        if (found) return found
      }
    }

    return null
  }

  function handleCityNodeClick(name: string | null, path: string | null) {
    log.info('Clicked on:', name, ' Path:', path)
    const newPath = path ?? ''
    selectedPath.value = newPath
  }

  function handleCityNodeSelect(path: string) {
    selectedPath.value = path
    selectCityNode(path)
  }

  function handleCityNodeHover(path: string) {
    hoveredPath.value = path
    setCityNodeHoverByPath(path)
  }

  function handleCityNodeCancelHover() {
    hoveredPath.value = ''
    setCityNodeHoverByPath('')
  }

  function navigateUp() {
    const parentPath = selectedPath.value.split('/').slice(0, -1).join('/') || '/'
    selectedPath.value = parentPath
    selectCityNode(parentPath)
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX.value = e.clientX + 10
    mouseY.value = e.clientY + 10
    const target = e.target as HTMLElement
    const isOverPanel = target.closest('.left-panel, .left-panels-container, .right-panel')
    showToolbar.value = !isOverPanel
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })
</script>

<style scoped lang="scss">
  .code-city-page {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hover-toolbar {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    z-index: 1000;
    pointer-events: none;
  }

  .tab-nav {
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .search-bar-wrapper {
    position: absolute;
    top: 1rem;
    left: 68%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .left-panels-container {
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 5;
    max-width: 320px;
  }

  .left-panel {
    flex: 1;
    min-height: 0;

    &.has-second-panel {
      flex: 1;
    }

    &.second-panel {
      flex: 1;
    }
  }

  .right-panel {
    position: absolute;
    top: 1rem;
    right: 1rem;
    bottom: 1rem;
    z-index: 5;
  }

  .code-city {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .default-item {
    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 0;

      .file-name {
        font-size: 0.85rem;
        color: #e6e6e6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .file-suspicion {
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }
  }
</style>
