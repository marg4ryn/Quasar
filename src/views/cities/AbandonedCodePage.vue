<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />
  <CodeCityPageTemplate
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
        {{ item.displayValue }}%
      </span>
    </template>

    <template #secondLeftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-value"> {{ item.displayValue }} {{ $t('common.files') }}</span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType } from '@/types'
  import type { KnowledgeLossDetails, AuthorsStatisticsDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { knowledgeLossDetails, authorsStatisticsDetails, itemsMap, isGeneralLoading } =
    useRestApi()

  const detailsRef = knowledgeLossDetails()
  const authorsDetails = authorsStatisticsDetails()
  const itemsMapRef = itemsMap()

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

  const colorData = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item: KnowledgeLossDetails) => ({
      path: item.path,
      color:
        item.normalizedValue !== null && item.normalizedValue !== undefined ? 0x696969 : 0xf0f0f0,
      intensity: item.normalizedValue ?? 1,
    }))
  })

  const leftPanelConfig = computed(() => {
    const items = computed(() => {
      const data = detailsRef.value
      const itemsMap = itemsMapRef.value

      if (!data || !Array.isArray(data) || !itemsMap) {
        return []
      }

      return data
        .map((item: KnowledgeLossDetails) => {
          const file = itemsMap.get(item.path)
          return {
            path: item.path,
            name: file?.name || item.path,
            normalizedValue: item.normalizedValue,
            displayValue: Math.round(item.normalizedValue * 100),
          }
        })
        .filter((item) => item.normalizedValue !== 0)
        .sort((a, b) => b.normalizedValue - a.normalizedValue)
    })

    return {
      labelKey: 'leftPanel.abandoned-code.header1',
      infoKey: 'leftPanel.abandoned-code.info1',
      items: items.value,
    }
  })

  const secondLeftPanelConfig = computed(() => {
    const items = computed(() => {
      const data = authorsDetails.value

      if (!data || !Array.isArray(data)) {
        return []
      }

      return data
        .map((item: AuthorsStatisticsDetails) => {
          return {
            path: item.name,
            name: item.name,
            displayValue: item.existingFilesModified,
            isActive: item.isActive,
            filesEdited: item.existingFilesModified,
          }
        })
        .filter((item) => item.isActive === false && item.filesEdited !== 0)
        .sort((a, b) => b.displayValue - a.displayValue)
    })

    return {
      itemType: 'author' as const,
      labelKey: 'leftPanel.abandoned-code.header2',
      infoKey: 'leftPanel.abandoned-code.info2',
      allowLoading: false,
      items: items.value,
    }
  })

  function getIntensityColor(normalizedValue: number): string {
    const value = Math.min(1, Math.max(0, normalizedValue))

    const start = 255
    const end = 105

    const channel = Math.round(start + (end - start) * value)
    const hex = channel.toString(16).padStart(2, '0')

    return `#${hex}${hex}${hex}`
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
