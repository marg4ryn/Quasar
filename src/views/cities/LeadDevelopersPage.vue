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
      <span class="item-name" :style="{ color: numberToHexColor(item.color) }">{{
        item.name
      }}</span>
      <span class="item-value"> {{ item.filesCount }} {{ $t('common.files') }} </span>
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
  import type {
    MetricType,
    AuthorsStatisticsDetails,
    LeadAuthorsDetails,
    AuthorContribution,
  } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { authorsStatisticsDetails, leadAuthorsDetails, fileDetails, isGeneralLoading } =
    useRestApi()

  const restApiStore = useRestApiStore()
  const authorsRef = authorsStatisticsDetails()
  const detailsRef = leadAuthorsDetails()
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
    0x32cd33, // emerald
    0x00bfff, // sky blue
    0xbf1b1b, // crimson
    0xffc50f, // honey yellow
    0x00ff7f, // spring green
    0x1e90ff, // dodger blue
    0xbf00ff, // violet
    0xff8c42, // orange
    0x40e0d0, // turquoise
  ]

  function numberToHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, '0')}`
  }

  function getRandomColor(index: number): number {
    return colorPalette[index % colorPalette.length]
  }

  const authorColorMap = computed(() => {
    const data = authorsRef.value
    const map = new Map<string, number>()

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
      const authorColor = authorColorMap.value.get(item.leadAuthor) || 0xf0f0f0
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
            ? authorColorMap.value.get(author.name) || 0xf0f0f0
            : 0xf0f0f0,
      }))
      .filter((item) => item.filesCount !== 0)
      .sort((a, b) => b.filesCount - a.filesCount)
  })

  const leftPanelConfig = computed(() => ({
    itemType: 'author' as const,
    labelKey: 'leftPanel.lead-developers.header',
    infoKey: 'leftPanel.lead-developers.info',
    allowLoading: false,
    items: items.value,
  }))

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
    font-weight: 400;
    font-size: 0.9rem;
    white-space: nowrap;
  }
</style>
