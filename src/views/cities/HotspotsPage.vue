<template>
  <CodeCityPageTemplate
    v-if="!isLoading"
    :tabs="tabs"
    :colorData="hotspotsColorData"
    :leftPanelConfig="leftPanelConfig"
    :rightPanelConfig="rightPanelConfig"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useApi } from '@/composables/useApi'
  import { useConnectionStore } from '@/stores/connectionsStore'
  import { MetricType } from '@/types'
  import type { HotspotsDetails } from '@/types'
  import CodeCityPageTemplate from '@/components/city/CodeCityPageTemplate.vue'

  const connectionStore = useConnectionStore()
  const { fetchHotspotsDetails, hotspotsDetails } = useApi()

  const isLoading = ref(false)

  const rightPanelConfig = ref({
    metricTypes: [
      'name',
      'path',
      'height',
      'width',
      'fileSize',
      'fileType',
      'totalLines',
      'codeLines',
      'commentLines',
      'blankLines',
      'totalCommits',
      'firstCommitDate',
      'lastCommitDate',
      'commitsLastMonth',
      'commitsLastYear',
      'activeAuthors',
      'leadAuthor',
      'knowledgeRisk',
      'knowledgeLoss',
    ] as MetricType[],
    showFindCoupling: false,
  })

  const tabs = [
    { id: 'hotspots', label: 'navbar.hotspots', route: '/hotspots' },
    { id: 'complexity-trends', label: 'navbar.complexity-trends', route: '/complexity-trends' },
    { id: 'code-age', label: 'navbar.code-age', route: '/code-age' },
  ]

  const hotspotsColorData = computed(() => {
    if (!hotspotsDetails.value || !Array.isArray(hotspotsDetails.value)) {
      return []
    }

    return hotspotsDetails.value.map((item: HotspotsDetails) => ({
      path: item.path,
      color: 0xbf1b1b,
      intensity: item.normalizedValue,
    }))
  })

  const hotspotsItems = computed(() => {
    if (!hotspotsDetails.value || !Array.isArray(hotspotsDetails.value)) {
      return []
    }

    return hotspotsDetails.value.map((item: HotspotsDetails) => ({
      ...item,
      normalizedValue: Math.round(item.normalizedValue * 100),
    }))
  })

  const leftPanelConfig = computed(() => ({
    label: 'SUSPICIOUS FILES',
    items: hotspotsItems.value,
    showInfo: true,
  }))

  onMounted(async () => {
    isLoading.value = true

    const analysis = connectionStore.analyses.get('/system-overview')

    if (analysis?.result?.success && analysis.result.data) {
      await fetchHotspotsDetails(analysis.result.data)
    }

    isLoading.value = false
  })
</script>

<style scoped lang="scss"></style>
