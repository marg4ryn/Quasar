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

    <AppSearchBar
      class="search-bar-wrapper"
      type="normal"
      :fileMap="filesComputed"
      :placeholder="$t('search.placeholder')"
      @select="handleSearchSelect"
      @hover="handleSearchHover"
      @hover-leave="handleSearchHoverLeave"
    />

    <div class="left-panels-container">
      <LeftPanel
        v-if="leftPanelConfig"
        class="left-panel"
        :class="{ 'has-second-panel': secondLeftPanelConfig }"
        :labelKey="leftPanelConfig.labelKey"
        :infoKey="leftPanelConfig.infoKey"
        :items="leftPanelConfig.items"
        :selectedPath="selectedPath"
        :handleFileSelect="handleCityNodeSelect"
        :handleFileHover="handleCityNodeHover"
        :handleFileCancelHover="handleCityNodeCancelHover"
      >
        <template #item="{ item }">
          <slot name="leftPanelItem" :item="item" />
        </template>
      </LeftPanel>

      <LeftPanel
        v-if="secondLeftPanelConfig"
        class="left-panel second-panel"
        :labelKey="secondLeftPanelConfig.labelKey"
        :infoKey="secondLeftPanelConfig.infoKey"
        :items="secondLeftPanelConfig.items"
        :selectedPath="selectedPath"
        :handleFileSelect="handleCityNodeSelect"
        :handleFileHover="handleCityNodeHover"
        :handleFileCancelHover="handleCityNodeCancelHover"
      >
        <template #item="{ item }">
          <slot name="secondLeftPanelItem" :item="item" />
        </template>
      </LeftPanel>
    </div>

    <CodeCity
      v-if="cityDataComputed"
      class="code-city"
      :data="cityDataComputed"
      :colorData="colorData"
      :autoRotate="autoRotate"
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
      :metric-types="rightPanelConfig.metricTypes"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useLogger } from '@/composables/useLogger'
  import { useCodeCityController } from '@/composables/useCodeCityController'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType, CityNode, FileListItem } from '@/types'

  import TabNavigation from '@/components/city/TabNavigation.vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'
  import LeftPanel from '@/components/city/LeftPanel.vue'
  import RightPanel from '@/components/city/RightPanel.vue'
  import CodeCity from '@/components/visuals/CodeCity.vue'

  interface LeftPanelConfig {
    labelKey: string
    infoKey?: string
    items: Array<{
      path: string
      name: string
      [key: string]: any
    }>
  }

  interface RightPanelConfig {
    metricTypes?: MetricType[]
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
  })

  const { selectCityNode, setCityNodeHoverByPath } = useCodeCityController()
  const { structure, fileMap } = useRestApi()

  const filesComputed = fileMap()
  const cityDataComputed = structure()

  const log = useLogger('CodeCityPageTemplate')

  const selectedPath = ref<string>('')
  const hoveredPath = ref<string>('')
  const mouseX = ref(0)
  const mouseY = ref(0)
  const showToolbar = ref(true)
  const autoRotate = ref(true)

  const selectedItem = computed(() => {
    const rootData = cityDataComputed.value
    if (!rootData) {
      return null
    }
    return findNodeByPath(selectedPath.value, rootData)
  })

  const hoveredItem = computed(() => {
    return filesComputed.value.get(hoveredPath.value) ?? null
  })

  onMounted(async () => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
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
    const start = performance.now()
    hoveredPath.value = path
    const end = performance.now()
    log.info(`lookup time: ${(end - start).toFixed(4)} ms, path: "${hoveredPath.value}"`)
    setCityNodeHoverByPath(path)
  }

  function handleCityNodeCancelHover() {
    hoveredPath.value = ''
    setCityNodeHoverByPath('')
  }

  function handleSearchSelect(item: FileListItem) {
    handleCityNodeSelect(item.path)
  }

  function handleSearchHover(item: FileListItem) {
    handleCityNodeHover(item.path)
  }

  function handleSearchHoverLeave() {
    handleCityNodeCancelHover()
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
    const isOverPanel = target.closest(
      '.left-panel, .left-panels-container, .right-panel, .search-dropdown'
    )
    showToolbar.value = !isOverPanel
  }

  defineExpose({
    selectedPath,
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
</style>
