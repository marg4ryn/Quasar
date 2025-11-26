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
      <span class="item-value" :style="{ color: getStatusColor(item.displayValue) }">
        {{ getTranslatedStatus(item.displayValue) }}
      </span>
    </template>

    <template #secondLeftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-value"> {{ item.displayValue }}</span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType, AuthorContribution } from '@/types'
  import type { KnowledgeLossDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { knowledgeLossDetails, fileMap, fileDetails, isGeneralLoading } = useRestApi()

  const { t } = useI18n()
  const detailsRef = knowledgeLossDetails()
  const fileMapRef = fileMap()
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

  const statusColorMap: Record<string, string> = {
    ABANDONED: '#000000',
    SINGLE_OWNER: '#40E0D0',
    BALANCED: '#32CD33',
    DIFFUSED: '#BF1B1B',
  }

  const getTranslatedStatus = (status: string): string => {
    const keyMap: Record<string, string> = {
      ABANDONED: 'abandoned',
      SINGLE_OWNER: 'singleOwner',
      BALANCED: 'balanced',
      DIFFUSED: 'diffused',
    }
    const key = keyMap[status] || 'unknown'
    return t(`leftPanel.knowledge-risks.enum.${key}`)
  }

  const getStatusColor = (status: string): string => {
    return statusColorMap[status] || '#F0F0F0'
  }

  const colorData = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item: KnowledgeLossDetails) => ({
      path: item.path,
      color: getStatusColor(item.knowledgeRisk),
      intensity: 1,
    }))
  })

  const leftPanelConfig = computed(() => {
    const items = computed(() => {
      const data = detailsRef.value
      const fileMap = fileMapRef.value

      if (!data || !Array.isArray(data) || !fileMap) {
        return []
      }

      return data
        .map((item: KnowledgeLossDetails) => {
          const file = fileMap.get(item.path)
          return {
            path: item.path,
            name: file?.name || item.path,
            displayValue: item.knowledgeRisk,
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    })

    return {
      labelKey: 'leftPanel.knowledge-risks.header1',
      infoKey: 'leftPanel.knowledge-risks.info1',
      items: items.value,
    }
  })

  const secondLeftPanelConfig = computed(() => {
    const selected = codeCityRef.value?.selectedPath

    if (!selected) {
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
        displayValue: `${author.percentage.toFixed(1)}%`,
      }))
      .sort((a, b) => parseFloat(b.displayValue) - parseFloat(a.displayValue))

    return {
      itemType: 'author' as const,
      labelKey: 'leftPanel.knowledge-risks.header2',
      infoKey: 'leftPanel.knowledge-risks.info2',
      items,
    }
  })
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
