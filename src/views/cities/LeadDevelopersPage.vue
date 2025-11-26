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
      <span class="item-value" :style="{ color: item.color }">
        {{ item.filesCount }} {{ $t('common.files') }}
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType } from '@/types'
  import type { AuthorsStatisticsDetails, LeadAuthorsDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { authorsStatisticsDetails, leadAuthorsDetails, isGeneralLoading } = useRestApi()

  const authorsRef = authorsStatisticsDetails()
  const detailsRef = leadAuthorsDetails()

  const rightPanelConfig = ref({
    metricTypes: [
      'name',
      'path',
      'fileType',
      'fileSize',
      'totalLines',
      'codeLines',
      'totalCommits',
      'activeAuthors',
      'leadAuthor',
      'knowledgeRisk',
      'knowledgeLoss',
      'firstCommitDate',
      'lastCommitDate',
    ] as MetricType[],
  })

  const tabs = [
    { id: 'developers-list', label: 'navbar.developers-list', route: '/developers-list' },
    { id: 'lead-developers', label: 'navbar.lead-developers', route: '/lead-developers' },
    {
      id: 'knowledge-risks',
      label: 'navbar.knowledge-risks',
      route: '/knowledge-risks',
    },
    { id: 'abandoned-code', label: 'navbar.abandoned-code', route: '/abandoned-code' },
    {
      id: 'developer-relationships',
      label: 'navbar.developer-relationships',
      route: '/developer-relationships',
    },
  ]

  const colorPalette = [
    '#00FF00', // lime
    '#40E0D0', // turquoise
    '#FF6666', // red
    '#BF00FF', // violet
    '#32CD33', // emerald
    '#00FFFF', // cyan
    '#FF33AA', // pink
    '#FF8C42', // orange
    '#BF1B1B', // crimson
  ]

  function getRandomColor(index: number): string {
    return colorPalette[index % colorPalette.length]
  }

  const authorColorMap = computed(() => {
    const data = authorsRef.value
    const map = new Map<string, string>()

    if (!data || !Array.isArray(data)) {
      return map
    }

    data.forEach((author: AuthorsStatisticsDetails, index: number) => {
      map.set(author.name, getRandomColor(index))
    })

    return map
  })

  const colorData = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item: LeadAuthorsDetails) => {
      const authorColor = authorColorMap.value.get(item.leadAuthor) || '#f0f0f0'
      return {
        path: item.path,
        color: authorColor,
        intensity: 1,
      }
    })
  })

  const items = computed(() => {
    const data = authorsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data
      .map((author: AuthorsStatisticsDetails) => ({
        name: author.name,
        filesCount: author.filesAsLeadAuthor,
        color: authorColorMap.value.get(author.name) || '#CCCCCC',
      }))
      .filter((item) => item.filesCount !== 0)
      .sort((a, b) => b.filesCount - a.filesCount)
  })

  const leftPanelConfig = computed(() => ({
    itemType: 'author' as const,
    labelKey: 'leftPanel.lead-developers.header',
    infoKey: 'leftPanel.lead-developers.info',
    items: items.value,
  }))
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
    white-space: nowrap;
  }
</style>
