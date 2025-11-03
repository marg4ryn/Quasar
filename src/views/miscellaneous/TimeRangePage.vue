<template>
  <div class="analysis-container">
    <LoadingOverlay
      :show="isDownloading"
      :label="t('welcomePage.loading') + ' ' + progress + '%'"
    />

    <div class="content">
      <h1 class="title">
        Please set the analysis interval.<br />
        You can skip this section.
      </h1>

      <div class="date-inputs">
        <div class="date-input-group">
          <label class="date-label">From:</label>
          <input
            type="date"
            class="date-input"
            v-model="fromDate"
            :max="toDate"
            @change="handleFromDateChange"
          />
        </div>
        <div class="date-input-group">
          <label class="date-label">To:</label>
          <input
            type="date"
            class="date-input"
            v-model="toDate"
            :min="fromDate"
            @change="handleToDateChange"
          />
        </div>
      </div>

      <div class="buttons">
        <AppButton label="Back" variant="secondary" @click="handleBack" />
        <AppButton label="Analyze" variant="primary" @click="handleDownload" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import { useI18n } from 'vue-i18n'
  import { downloadService } from '@/services/downloadService'
  import AppButton from '@/components/common/AppButton.vue'
  import LoadingOverlay from '@/components/layout/LoadingOverlay.vue'

  const { t } = useI18n()
  const router = useRouter()
  const analysisStore = useNewAnalysisStore()
  const today = new Date().toISOString().split('T')[0]
  const fromDate = ref(analysisStore.fromDate || '2005-01-01')
  const toDate = ref(analysisStore.toDate || today)
  const progress = ref(0)
  const link = ref(analysisStore.link)
  const status = ref('')
  const isDownloading = ref(false)
  const error = ref('')

  const handleFromDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date <= toDate.value) {
      fromDate.value = date
      analysisStore.setFromDate(date)
    }
  }

  const handleToDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date >= fromDate.value) {
      toDate.value = date
      analysisStore.setToDate(date)
    }
  }

  const handleDownload = async () => {
    progress.value = 0
    status.value = ''
    error.value = ''
    isDownloading.value = true
    analysisStore.setDates(fromDate.value, toDate.value)

    downloadService.startDownloadMock(
      link.value,
      // onProgress callback
      (data) => {
        progress.value = data.progress
        status.value = data.status
      },
      // onComplete callback
      (data) => {
        status.value = `Zakończono! Plik: ${data.filename}`
        isDownloading.value = false
        router.push('/system-overview')
      },
      // onError callback
      (errorMsg) => {
        error.value = errorMsg
        isDownloading.value = false
      }
    )

    // downloadService.startDownload(
    //   link.value,
    //   (data) => {
    //     progress.value = data.progress;
    //     status.value = data.status;
    //   },
    //   (data) => {
    //     status.value = `Zakończono! Plik: ${data.filename}`;
    //     isDownloading.value = false;
    //   },
    //   (errorMsg) => {
    //     error.value = errorMsg;
    //     isDownloading.value = false;
    //   }
    // );

    // const handleCancel = () => {
    //   downloadService.abort()
    //   isDownloading.value = false
    //   status.value = 'Anulowano'
    // }
  }

  const handleBack = () => {
    router.back()
  }
</script>

<style scoped lang="scss">
  .analysis-container {
    @include flex-center;
    position: relative;
    flex: 1 0 auto;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 500px;
    width: 100%;
    gap: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 400;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    color: rgba(255, 255, 255, 0.95);
  }

  .date-inputs {
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 400px;
  }

  .date-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .date-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  .date-input {
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 0.875rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: #0ea5e9;
    }

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
