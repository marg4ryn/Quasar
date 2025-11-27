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
      <span class="item-name" :style="{ color: numberToHexColor(getStatusColor(item.name)) }">{{
        getTranslatedStatus(item.name)
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
  import { useI18n } from 'vue-i18n'
  import { useRestApi } from '@/composables/useRestApi'
  import { useRestApiStore } from '@/stores/restApiStore'
  import { MetricType, KnowledgeLossDetails, AuthorContribution } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { knowledgeLossDetails, fileDetails, isGeneralLoading } = useRestApi()

  const { t } = useI18n()
  const restApiStore = useRestApiStore()
  const detailsRef = knowledgeLossDetails()
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

  const statusColorMap: Record<string, number> = {
    ABANDONED: 0x777777,
    SINGLE_OWNER: 0x00bfff,
    BALANCED: 0x32cd33,
    DIFFUSED: 0xff4444,
  }

  function numberToHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, '0')}`
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

  const getStatusColor = (status: string): number => {
    return statusColorMap[status] || 0xf0f0f0
  }

  const risksCounts = computed(() => {
    const data = detailsRef.value
    const counts = new Map<string, number>()

    if (!data || !Array.isArray(data)) {
      return counts
    }

    data.forEach((item: KnowledgeLossDetails) => {
      const currentCount = counts.get(item.knowledgeRisk) || 0
      counts.set(item.knowledgeRisk, currentCount + 1)
    })

    return counts
  })

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

      if (!data || !Array.isArray(data)) {
        return []
      }

      return Array.from(risksCounts.value.entries())
        .map(([risk, count]) => ({
          name: risk,
          filesCount: count,
          color: getStatusColor(risk) || 0xf0f0f0,
        }))
        .sort((a, b) => b.filesCount - a.filesCount)
    })

    return {
      itemType: 'default' as const,
      labelKey: 'leftPanel.knowledge-risks.header1',
      infoKey: 'leftPanel.knowledge-risks.info1',
      items: items.value,
    }
  })

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
  }
</style>
