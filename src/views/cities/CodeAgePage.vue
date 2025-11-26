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
        {{ item.displayValue }} {{ $t('leftPanel.code-age.days') }}
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType } from '@/types'
  import type { CodeAgeDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { codeAgeDetails, fileMap, isGeneralLoading } = useRestApi()

  const detailsRef = codeAgeDetails()
  const fileMapRef = fileMap()

  const rightPanelConfig = ref({
    metricTypes: [
      'name',
      'path',
      'fileType',
      'fileSize',
      'totalLines',
      'codeLines',
      'totalCommits',
      'commitsLastMonth',
      'commitsLastYear',
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

    return data.map((item: CodeAgeDetails) => ({
      path: item.path,
      color:
        item.normalizedValue !== null && item.normalizedValue !== undefined ? 0x00a3ff : 0xf0f0f0,
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
      .map((item: CodeAgeDetails) => {
        const file = fileMap.get(item.path)
        return {
          path: item.path,
          name: file?.name || item.path,
          normalizedValue: item.normalizedValue,
          displayValue: item.codeAgeDays,
        }
      })
      .sort((a, b) => a.displayValue - b.displayValue)
  })

  const leftPanelConfig = computed(() => ({
    labelKey: 'leftPanel.code-age.header',
    infoKey: 'leftPanel.code-age.info',
    items: items.value,
  }))

  function getIntensityColor(normalizedValue: number): string {
    const percent = normalizedValue * 100
    if (percent >= 80) return '#00A3FF'
    if (percent >= 60) return '#33B8FF'
    if (percent >= 40) return '#66CCFF'
    if (percent >= 20) return '#99DFFF'
    return '#CCEFFF'
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
