<template>
  <LoadingBar
    :show="true"
    :label="statusLabel || 'welcomePage.loading'"
    :show-cancel-button="true"
    :on-cancel="handleCancelAnalysis"
    :modal-label="t('welcomePage.modal')"
  />
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { t } from '@/plugins/i18n'
  import { useSseConnector } from '@/composables/useSseConnector'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const newAnalysisStore = useNewAnalysisStore()
  const router = useRouter()
  const MIN_DATE = '2000-01-01'
  const today = new Date().toISOString().split('T')[0]
  const MAX_DATE = today

  const { isCompleted, statusLabel, stop } = useSseConnector(
    'download-repository',
    '/repository-overview',
    'sse.analysis.repo-download'
  )

  watch(isCompleted, async (newValue) => {
    if (newValue) {
      resetNewAnalysisStore()
      router.push('/repository-overview')
    }
  })

  const resetNewAnalysisStore = () => {
    newAnalysisStore.setLink('')
    newAnalysisStore.setFromDate(MIN_DATE)
    newAnalysisStore.setToDate(MAX_DATE)
  }

  const handleCancelAnalysis = () => {
    stop()
    router.back()
  }
</script>

<style lang="scss" scoped></style>
