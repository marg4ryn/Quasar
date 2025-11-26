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
        :style="{ color: getIntensityColorForFiles(item.coupledFilesCount ?? 0) }"
      >
        {{ item.coupledFilesCount }} {{ $t('common.files') }}
      </span>
    </template>

    <template #secondLeftPanelItem="{ item }">
      <span class="item-name">{{ item.name }}</span>
      <span
        v-if="item.percentage !== undefined"
        class="item-value"
        :style="{ color: getIntensityColorForCommits(item.percentage ?? 0) }"
      >
        {{ item.sharedCommits }} ({{ item.percentage }}%)
      </span>
    </template>
  </CodeCityPageTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { MetricType } from '@/types'
  import type { FileCouplingDetails, CoupledFile } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { fileCouplingDetails, fileMap, isGeneralLoading } = useRestApi()

  const detailsRef = fileCouplingDetails()
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

  const colorData = computed(() => {
    const data = detailsRef.value
    const selected = codeCityRef.value?.selectedPath

    if (!data || !Array.isArray(data)) {
      return []
    }

    if (selected) {
      const selectedFileDetails = data.find((item: FileCouplingDetails) => item.path === selected)

      const activePaths = new Map<string, number>()

      if (selectedFileDetails) {
        selectedFileDetails.coupledFiles.forEach((coupled: CoupledFile) => {
          activePaths.set(coupled.path, coupled.percentage / 100)
        })
      }

      return data.map((item: FileCouplingDetails) => {
        const intensity = activePaths.get(item.path)
        const isActive = intensity !== undefined
        const isSelected = item.path === selected

        if (isSelected) {
          return {
            path: item.path,
            color: 0xe6b400,
            intensity: 0.35,
          }
        }

        return {
          path: item.path,
          color: isActive ? 0xbf1b1b : 0xf0f0f0,
          intensity: isActive ? intensity : 1,
        }
      })
    }

    return data.map((item: FileCouplingDetails) => ({
      path: item.path,
      color: item.coupledFiles.length > 0 ? 0xbf1b1b : 0xf0f0f0,
      intensity: 1,
    }))
  })

  const leftPanelConfig = computed(() => {
    const data = detailsRef.value
    const fileMap = fileMapRef.value

    if (!data || !Array.isArray(data) || !fileMap) {
      return {
        labelKey: 'leftPanel.filesCoupling.header1',
        infoKey: 'leftPanel.filesCoupling.info1',
        items: [],
      }
    }

    const filesWithCoupling = data
      .filter((item: FileCouplingDetails) => item.coupledFiles.length > 0)
      .map((item: FileCouplingDetails) => {
        const file = fileMap.get(item.path)
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
    const fileMap = fileMapRef.value
    const selected = codeCityRef.value?.selectedPath

    if (!data || !Array.isArray(data) || !fileMap || !selected) {
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
        const file = fileMap.get(coupled.path)
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

  function getIntensityColorForFiles(files: number): string {
    if (files >= 5) return '#ff4444'
    if (files >= 4) return '#ff8844'
    if (files >= 3) return '#ffaa44'
    if (files >= 2) return '#ffcc44'
    return '#ffee44'
  }

  function getIntensityColorForCommits(percentage: number): string {
    if (percentage >= 60) return '#ff4444'
    if (percentage >= 45) return '#ff8844'
    if (percentage >= 30) return '#ffaa44'
    if (percentage >= 15) return '#ffcc44'
    return '#ffee44'
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
