<template>
  <CodeCityPageTemplate
    :tabs="tabs"
    :colorData="colorData"
    :leftPanelConfig="leftPanelConfig"
    :rightPanelConfig="rightPanelConfig"
  />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { CityNode } from '@/types/city'
  import { colorData } from '@/utils/city/cityData'
  import { useCityStore } from '@/stores/cityStore'
  import { MetricType } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'

  const cityStore = useCityStore()
  const cityData = cityStore.cityData

  const rightPanelConfig = ref({
    metricTypes: ['name', 'path', 'height', 'width'] as MetricType[],
    showFindCoupling: false,
  })

  const tabs = [
    { id: 'hotspots', label: 'HOTSPOTS', route: '/hotspots' },
    { id: 'complexity-trends', label: 'complexity-trends', route: '/complexity-trends' },
    { id: 'code-age', label: 'code-age', route: '/code-age' },
  ]

  const flattenedFilesForList = computed(() => {
    const files: Array<CityNode & { intensity?: number }> = []

    function traverse(node: CityNode) {
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

  const leftPanelConfig = computed(() => ({
    label: 'SUSPICIOUS FILES',
    items: flattenedFilesForList.value,
    showInfo: true,
  }))

  function getIntensityColor(intensity: number): string {
    if (intensity >= 0.8) return '#ff4444'
    if (intensity >= 0.6) return '#ff8844'
    if (intensity >= 0.4) return '#ffaa44'
    if (intensity >= 0.2) return '#ffcc44'
    return '#ffee44'
  }
</script>

<style scoped lang="scss">
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
