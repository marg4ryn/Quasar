<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <CodeCityPageTemplate
    :tabs="tabs"
    :colorData="colorData"
    :leftPanelConfig="leftPanelConfig"
    :rightPanelConfig="rightPanelConfig"
  >
    <template #leftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span
        v-if="item.displayValue !== undefined"
        class="item-value"
        :style="{ color: getIntensityColor(item.normalizedValue ?? 0) }"
      >
        {{ item.displayValue }}%
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType } from '@/types'
  import type { HotspotsDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { hotspotsDetails, fileMap, isGeneralLoading } = useRestApi()

  const detailsRef = hotspotsDetails()
  const fileMapRef = fileMap()

  const rightPanelConfig = ref({
    metricTypes: [
      'name',
      'path',
      'fileType',
      'fileSize',
      'totalLines',
      'codeLines',
      'blankLines',
      'commentLines',
      'totalLinesAdded',
      'duplicatedLinesDensity',
      'bugs',
      'vulnerabilities',
      'codeSmells',
      'complexity',
      'totalCommits',
      'activeAuthors',
      'leadAuthor',
      'firstCommitDate',
      'lastCommitDate',
    ] as MetricType[],
  })

  const tabs = [
    { id: 'hotspots', label: 'navbar.hotspots', route: '/hotspots' },
    { id: 'code-age', label: 'navbar.code-age', route: '/code-age' },
    { id: 'files-coupling', label: 'navbar.files-coupling', route: '/files-coupling' },
  ]

  const colorData = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item: HotspotsDetails) => ({
      path: item.path,
      color:
        item.normalizedValue !== null && item.normalizedValue !== undefined ? 0xbf1b1b : 0xf0f0f0,
      intensity: item.normalizedValue ?? 1,
    }))
  })

  const items = computed(() => {
    const data = detailsRef.value
    const fileMap = fileMapRef.value

    if (!data || !Array.isArray(data) || !fileMap) {
      return []
    }

    return data
      .map((item: HotspotsDetails) => {
        const file = fileMap.get(item.path)
        return {
          path: item.path,
          name: file?.name || item.path,
          normalizedValue: item.normalizedValue,
          displayValue: Math.round(item.normalizedValue * 100),
        }
      })
      .sort((a, b) => b.normalizedValue - a.normalizedValue)
  })

  const leftPanelConfig = computed(() => ({
    labelKey: 'leftPanel.hotspots.header',
    infoKey: 'leftPanel.hotspots.info',
    items: items.value,
  }))

  function getIntensityColor(normalizedValue: number): string {
    const percent = normalizedValue * 100
    if (percent >= 80) return '#ff4444'
    if (percent >= 60) return '#ff8844'
    if (percent >= 40) return '#ffaa44'
    if (percent >= 20) return '#ffcc44'
    return '#ffee44'
  }
</script>

<style scoped lang="scss">
  .item-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-value {
    font-weight: 600;
    font-size: 0.9rem;
  }
</style>
