<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <CodeCityPageTemplate
    ref="codeCityRef"
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
        {{ formatDaysOnly(item.displayValue) }}
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType, CodeAgeDetails } from '@/types'
  import { formatDaysOnly } from '@/utils/dateFormatter'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { codeAgeDetails, itemsMap, isGeneralLoading } = useRestApi()

  const detailsRef = codeAgeDetails()
  const itemsMapRef = itemsMap()
  const codeCityRef = ref<InstanceType<typeof CodeCityPageTemplate>>()

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
        item.normalizedValue !== null && item.normalizedValue !== undefined ? 0x1e90ff : 0xf0f0f0,
      intensity: item.normalizedValue ?? 1,
    }))
  })

  const items = computed(() => {
    const data = detailsRef.value
    const itemsMap = itemsMapRef.value

    if (!data || !Array.isArray(data) || !itemsMap) {
      return []
    }

    return data
      .map((item: CodeAgeDetails) => {
        const file = itemsMap.get(item.path)
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
    const value = Math.min(1, Math.max(0, normalizedValue))

    const targetR = 30
    const targetG = 144
    const targetB = 255

    const r = Math.round(255 + (targetR - 255) * value)
    const g = Math.round(255 + (targetG - 255) * value)
    const b = Math.round(255 + (targetB - 255) * value)

    const rHex = r.toString(16).padStart(2, '0')
    const gHex = g.toString(16).padStart(2, '0')
    const bHex = b.toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
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
