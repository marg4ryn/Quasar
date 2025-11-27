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
      <span class="item-value">{{ item.filesCount }} {{ $t('common.files') }}</span>
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
  import type { MetricType, FilesExtensionsDetails, AuthorContribution } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { filesExtensionsDetails, fileDetails, isGeneralLoading } = useRestApi()

  const restApiStore = useRestApiStore()
  const detailsRef = filesExtensionsDetails()
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
    {
      id: 'repository-overview',
      label: 'navbar.repository-overview',
      route: '/repository-overview',
    },
    { id: 'file-extensions', label: 'navbar.file-extensions', route: '/file-extensions' },
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

  const extensionCounts = computed(() => {
    const data = detailsRef.value
    const counts = new Map<string, number>()

    if (!data || !Array.isArray(data)) {
      return counts
    }

    data.forEach((item: FilesExtensionsDetails) => {
      const type = item.type ?? '-'
      const currentCount = counts.get(type) || 0
      counts.set(type, currentCount + 1)
    })

    return counts
  })

  const extensionsColorMap = computed(() => {
    const map = new Map<string, number>()
    const uniqueExtensions = Array.from(extensionCounts.value.keys())

    uniqueExtensions.forEach((extension, index) => {
      if (extension === '-') return
      map.set(extension, getRandomColor(index))
    })

    return map
  })

  const colorData = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((item: FilesExtensionsDetails) => {
      const extensionColor = extensionsColorMap.value.get(item.type) || 0xf0f0f0
      return {
        path: item.path,
        color: extensionColor,
        intensity: 1,
      }
    })
  })

  const items = computed(() => {
    return Array.from(extensionCounts.value.entries())
      .map(([extension, count]) => ({
        name: extension,
        filesCount: count,
        color: extensionsColorMap.value.get(extension) || 0xf0f0f0,
      }))
      .sort((a, b) => b.filesCount - a.filesCount)
  })

  const leftPanelConfig = computed(() => ({
    itemType: 'default' as const,
    labelKey: 'leftPanel.file-extensions.header',
    infoKey: 'leftPanel.file-extensions.info',
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
