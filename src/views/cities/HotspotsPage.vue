<template>
  <div class="hotspots-page">
    <TabNavigation class="tab-nav" :tabs="tabs" />

    <AppSearchBar v-model="searchQuery" class="search-bar-wrapper" />

    <LeftPanel
      class="left-panel"
      :items="filteredFiles"
      :selectedPath="selectedPath"
      :handleFileSelect="handleFileSelect"
      :showInfo="true"
    >
      <template #item="{ item }">
        <div class="file-item">
          <div class="file-info">
            <span class="file-name">{{ item.name }}</span>
          </div>
          <span
            v-if="item.intensity !== undefined"
            class="file-suspicion"
            :style="{ color: getIntensityColor(item.intensity) }"
          >
            {{ Math.round(item.intensity * 100) }}%
          </span>
        </div>
      </template>
    </LeftPanel>

    <CodeCity
      class="code-city"
      :data="cityData"
      :colorData="colorData"
      @buildingClick="handleBuildingClick"
    />

    <RightPanel
      class="right-panel"
      :selectedItem="selectedItem"
      :selectedPath="selectedPath"
      :navigateUp="navigateUp"
      :handleFileSelect="handleFileSelect"
      :getChildrenCount="getChildrenCount"
      :getIntensityColor="getIntensityColor"
      :selectedColorData="selectedColorData"
      :showFindCoupling="true"
      :onFindCoupling="openCoupling"
      :onXRay="openXRay"
      :onSourceCode="openSourceCode"
    >
      <template #metrics="{ item, selectedColorData }">
        <div class="metric-item">
          <span class="metric-label">Path:</span>
          <span class="metric-value path-value">{{ item.path }}</span>
        </div>

        <div v-if="item.height !== undefined" class="metric-item">
          <span class="metric-label">Height:</span>
          <span class="metric-value">{{ item.height.toFixed(2) }}</span>
        </div>

        <div v-if="item.width !== undefined" class="metric-item">
          <span class="metric-label">Width:</span>
          <span class="metric-value">{{ item.width.toFixed(2) }}</span>
        </div>

        <div v-if="selectedColorData" class="metric-item">
          <span class="metric-label">Intensity:</span>
          <span
            class="metric-value suspicion-value"
            :style="{ color: getIntensityColor(selectedColorData.intensity) }"
          >
            {{ Math.round(selectedColorData.intensity * 100) }}%
          </span>
        </div>
      </template>
    </RightPanel>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useCodeCityController } from '@/composables/useCodeCityController'
  import { useLogger } from '@/composables/useLogger'
  import { cityData, colorData } from '@/utils/city/cityData'
  import LeftPanel from '@/components/city/LeftPanel.vue'
  import RightPanel from '@/components/city/RightPanel.vue'
  import CodeCity from '@/components/visuals/CodeCity.vue'
  import AppSearchBar from '@/components/common/AppSearchBar.vue'
  import TabNavigation from '@/components/city/TabNavigation.vue'

  const tabs = [
    { id: 'hotspots', label: 'HOTSPOTS', route: '/hotspots' },
    { id: 'complexity-trends', label: 'complexity-trends', route: '/complexity-trends' },
    { id: 'code-age', label: 'code-age', route: '/code-age' },
  ]

  interface CityDataNode {
    name: string
    type: 'file' | 'directory'
    path: string
    height?: number
    width?: number
    children?: CityDataNode[]
  }

  const log = useLogger('HotspotsPage')
  const { selectBuilding } = useCodeCityController()

  const searchQuery = ref('')
  const selectedPath = ref<string>('/')

  function openCoupling() {}
  function openXRay() {}
  function openSourceCode() {}

  function findNodeByPath(path: string, root: CityDataNode = cityData): CityDataNode | null {
    if (root.path === path) return root

    if (root.children) {
      for (const child of root.children) {
        const found = findNodeByPath(path, child)
        if (found) return found
      }
    }

    return null
  }

  const flattenedFilesForList = computed(() => {
    const files: Array<CityDataNode & { intensity?: number }> = []

    function traverse(node: CityDataNode) {
      const colorInfo = colorData.find((c) => c.path === node.path)

      if (colorInfo) {
        files.push({
          ...node,
          intensity: colorInfo.intensity,
        })
      }

      if (node.children) {
        node.children.forEach(traverse)
      }
    }

    traverse(cityData)

    return files.sort((a, b) => b.intensity! - a.intensity!)
  })

  const filteredFiles = computed(() => {
    if (!searchQuery.value) return flattenedFilesForList.value
    const query = searchQuery.value.toLowerCase()
    return flattenedFilesForList.value.filter(
      (file) => file.name.toLowerCase().includes(query) || file.path.toLowerCase().includes(query)
    )
  })

  const selectedItem = computed(() => {
    return findNodeByPath(selectedPath.value)
  })

  const selectedColorData = computed(() => {
    return colorData.find((c) => c.path === selectedPath.value)
  })

  function handleBuildingClick(name: string, path: string, intensity?: number) {
    log.info('Clicked on:', name, ' Path:', path, ' Intensity: ', intensity)
    selectedPath.value = path
    selectBuilding(path)
  }

  function handleFileSelect(path: string) {
    selectedPath.value = path
    selectBuilding(path)
  }

  function navigateUp() {
    const parentPath = selectedPath.value.split('/').slice(0, -1).join('/') || '/'
    selectedPath.value = parentPath
    selectBuilding(parentPath)
  }

  function getChildrenCount(node: CityDataNode): number {
    return node.children?.length || 0
  }

  function getIntensityColor(intensity: number): string {
    if (intensity >= 0.8) return '#ff4444'
    if (intensity >= 0.6) return '#ff8844'
    if (intensity >= 0.4) return '#ffaa44'
    if (intensity >= 0.2) return '#ffcc44'
    return '#ffee44'
  }
</script>

<style scoped lang="scss">
  .hotspots-page {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
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
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .left-panel {
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    z-index: 5;
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

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    gap: 0.75rem;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--color-border);
    }

    &.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--color-border);
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 0;

      .file-icon {
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
      }

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

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    .metric-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .metric-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e6e6e6;
      word-break: break-all;

      &.path-value {
        font-size: 0.75rem;
        font-family: 'Monaco', 'Courier New', monospace;
        color: rgba(255, 255, 255, 0.8);
      }

      &.suspicion-value {
        font-weight: 700;
        font-size: 1.1rem;
      }

      .color-box {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        vertical-align: middle;
        margin-right: 0.5rem;
      }
    }
  }
</style>
