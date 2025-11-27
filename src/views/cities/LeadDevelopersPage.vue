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
    '#32CD33', // emerald
    '#00BFFF', // sky blue
    '#BF1B1B', // crimson
    '#FFC50F', // honey yellow
    '#00FF7F', // spring green
    '#1E90FF', // dodger blue
    '#BF00FF', // violet
    '#FF8C42', // orange
    '#40E0D0', // turquoise
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
        color:
          author.filesAsLeadAuthor !== 0
            ? authorColorMap.value.get(author.name) || '#CCCCCC'
            : '#f0f0f0',
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
