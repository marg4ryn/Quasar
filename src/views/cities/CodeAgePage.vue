<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <CodeCityPageTemplate
    ref="codeCityRef"
    :tabs="tabs"
    :colorData="colorData"
    :leftPanelConfig="leftPanelConfig"
    :secondLeftPanelConfig="secondLeftPanelConfig"
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
    <template #secondLeftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-value" :style="{ color: getOwnershipColor(item.displayValue) }">
        {{ item.displayValue }}%</span
      >
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { useRestApiStore } from '@/stores/restApiStore'
  import { MetricType, CodeAgeDetails, AuthorContribution } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { codeAgeDetails, itemsMap, fileDetails, isGeneralLoading } = useRestApi()

  const restApiStore = useRestApiStore()
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
        item.normalizedValue !== null && item.normalizedValue !== undefined ? 0x00bfff : 0xf0f0f0,
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

    const r = Math.round(255 * (1 - value * (255 / 255)))
    const g = Math.round(255 * (1 - value * (64 / 255)))
    const b = 255

    const rHex = r.toString(16).padStart(2, '0')
    const gHex = g.toString(16).padStart(2, '0')
    const bHex = b.toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }

  const secondLeftPanelConfig = computed(() => {
    const selected = codeCityRef.value?.selectedPath

    if (!selected || restApiStore.getItemByPath(selected)?.type === 'dir') {
      return {
        itemType: 'author' as const,
        labelKey: 'leftPanel.knowledge-risks.header2',
        infoKey: 'leftPanel.knowledge-risks.info2',
        items: [],
      }
    }

    const details = fileDetails(selected).value

    if (!details?.knowledge?.contributions) {
      return {
        itemType: 'author' as const,
        labelKey: 'leftPanel.knowledge-risks.header2',
        infoKey: 'leftPanel.knowledge-risks.info2',
        items: [],
      }
    }

    const items = details.knowledge.contributions
      .map((author: AuthorContribution) => ({
        path: author.name,
        name: author.name,
        displayValue: author.percentage.toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.displayValue) - parseFloat(a.displayValue))

    return {
      itemType: 'author' as const,
      labelKey: 'leftPanel.knowledge-risks.header2',
      infoKey: 'leftPanel.knowledge-risks.info2',
      items,
    }
  })

  function getOwnershipColor(percent: number): string {
    if (percent < 20) return '#064e3b'
    if (percent < 40) return '#0f6f4a'
    if (percent < 60) return '#0fa15c'
    if (percent < 80) return '#07c86d'
    return '#00f47a'
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
