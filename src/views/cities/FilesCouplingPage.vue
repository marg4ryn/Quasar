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
        v-if="item.coupledFilesCount !== undefined"
        class="item-value"
        :style="{ color: numberToHexColor(getIntensityColorForFiles(item.coupledFilesCount ?? 0)) }"
      >
        {{ item.coupledFilesCount }} {{ $t('common.files') }}
      </span>
    </template>

    <template #secondLeftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span
        v-if="item.percentage !== undefined"
        class="item-value"
        :style="{ color: numberToHexColor(getIntensityColorForCommits(item.percentage ?? 0)) }"
      >
        {{ item.sharedCommits }} ({{ item.percentage }}%)
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { useRestApiStore } from '@/stores/restApiStore'
  import { MetricType } from '@/types'
  import type { FileCouplingDetails, CoupledFile } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { fileCouplingDetails, itemsMap, isGeneralLoading } = useRestApi()

  const detailsRef = fileCouplingDetails()
  const itemsMapRef = itemsMap()
  const restApiStore = useRestApiStore()
  const codeCityRef = ref<InstanceType<typeof CodeCityPageTemplate>>()

  const rightPanelConfig = ref({
    metricTypes: [
      'name',
      'path',
      'fileType',
      'fileSize',
      'totalLines',
      'codeLines',
      'blankLines',
      'commentLines',
      'totalLinesAdded',
      'duplicatedLinesDensity',
      'bugs',
      'vulnerabilities',
      'codeSmells',
      'complexity',
      'totalCommits',
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

  function numberToHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, '0')}`
  }

  const colorData = computed(() => {
    const data = detailsRef.value
    const selected = codeCityRef.value?.selectedPath

    if (!data || !Array.isArray(data)) {
      return []
    }

    if (selected && restApiStore.getItemByPath(selected)?.type === 'file') {
      const selectedFileDetails = data.find((item: FileCouplingDetails) => item.path === selected)

      const activePaths = new Map<string, number>()

      if (selectedFileDetails) {
        selectedFileDetails.coupledFiles.forEach((coupled: CoupledFile) => {
          activePaths.set(coupled.path, coupled.percentage)
        })
      }

      return data.map((item: FileCouplingDetails) => {
        const percentage = activePaths.get(item.path)
        const isActive = percentage !== undefined
        const isSelected = item.path === selected

        if (isSelected) {
          return {
            path: item.path,
            color: 0xffd700,
            intensity: 1,
          }
        }

        return {
          path: item.path,
          color: isActive ? getIntensityColorForCommits(percentage) : 0xf0f0f0,
          intensity: 1,
        }
      })
    }

    return data.map((item: FileCouplingDetails) => ({
      path: item.path,
      color:
        item.coupledFiles.length > 0
          ? getIntensityColorForFiles(item.coupledFiles.length)
          : 0xf0f0f0,
      intensity: 1,
    }))
  })

  const leftPanelConfig = computed(() => {
    const data = detailsRef.value
    const itemsMap = itemsMapRef.value

    if (!data || !Array.isArray(data) || !itemsMap) {
      return {
        labelKey: 'leftPanel.filesCoupling.header1',
        infoKey: 'leftPanel.filesCoupling.info1',
        items: [],
      }
    }

    const filesWithCoupling = data
      .filter((item: FileCouplingDetails) => item.coupledFiles.length > 0)
      .map((item: FileCouplingDetails) => {
        const file = itemsMap.get(item.path)
        return {
          path: item.path,
          name: file?.name || item.path,
          coupledFilesCount: item.coupledFiles.length,
        }
      })
      .sort((a, b) => b.coupledFilesCount - a.coupledFilesCount)

    return {
      labelKey: 'leftPanel.filesCoupling.header1',
      infoKey: 'leftPanel.filesCoupling.info1',
      items: filesWithCoupling,
    }
  })

  const secondLeftPanelConfig = computed(() => {
    const data = detailsRef.value
    const itemsMap = itemsMapRef.value
    const selected = codeCityRef.value?.selectedPath

    if (!data || !Array.isArray(data) || !itemsMap || !selected) {
      return {
        labelKey: 'leftPanel.filesCoupling.header2',
        infoKey: 'leftPanel.filesCoupling.info2',
        items: [],
      }
    }

    const selectedFileDetails = data.find((item: FileCouplingDetails) => item.path === selected)

    if (!selectedFileDetails || selectedFileDetails.coupledFiles.length === 0) {
      return {
        labelKey: 'leftPanel.filesCoupling.header2',
        infoKey: 'leftPanel.filesCoupling.info2',
        items: [],
      }
    }

    const coupledItems = selectedFileDetails.coupledFiles
      .map((coupled: CoupledFile) => {
        const file = itemsMap.get(coupled.path)
        return {
          path: coupled.path,
          name: file?.name || coupled.path,
          sharedCommits: coupled.sharedCommits,
          percentage: coupled.percentage,
        }
      })
      .sort((a: { percentage: number }, b: { percentage: number }) => b.percentage - a.percentage)

    return {
      labelKey: 'leftPanel.filesCoupling.header2',
      infoKey: 'leftPanel.filesCoupling.info2',
      items: coupledItems,
    }
  })

  function getGradientColor(value: number): number {
    const normalizedValue = Math.min(1, Math.max(0, value))

    const startR = 0xff,
      startG = 0xee,
      startB = 0x44
    const endR = 0xbf,
      endG = 0x1b,
      endB = 0x1b

    const r = Math.round(startR + (endR - startR) * normalizedValue)
    const g = Math.round(startG + (endG - startG) * normalizedValue)
    const b = Math.round(startB + (endB - startB) * normalizedValue)

    return (r << 16) | (g << 8) | b
  }

  function getIntensityColorForFiles(files: number): number {
    const maxFiles = 5
    const value = Math.min(files, maxFiles) / maxFiles
    return getGradientColor(value)
  }

  function getIntensityColorForCommits(percentage: number): number {
    const maxPercentage = 80
    const value = Math.min(percentage, maxPercentage) / maxPercentage
    return getGradientColor(value)
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
