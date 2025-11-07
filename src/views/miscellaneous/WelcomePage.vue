<template>
  <section class="welcome-screen">
    <LoadingBar
      :show="isBusy"
      :label="statusLabel || t('welcomePage.loading')"
      :show-cancel-button="true"
      :on-cancel="handleCancelAnalysis"
      :modal-label="t('welcomePage.modal')"
    />

    <ToastBox
      v-if="showToast"
      :message="t('welcomePage.alertEnterRepo')"
      variant="error"
      :duration="2000"
      @close="showToast = false"
    />

    <div class="welcome-content">
      <img :src="logoSrc" alt="HotSpotter Logo" class="logo" />

      <h1 class="main-title">
        {{ t('welcomePage.header') }} <span class="appname">Hot</span>Spotter!
      </h1>
      <h2 class="subtitle">{{ t('welcomePage.motto') }}</h2>

      <div class="input-section">
        <label for="repo-link" class="input-label">{{ t('welcomePage.prompt') }}</label>
        <input
          id="repo-link"
          type="text"
          v-model="link"
          placeholder="e.g. https://github.com/johndoe/test.git"
          class="repo-input"
          :disabled="isBusy"
        />
      </div>

      <h3 class="input-label">{{ t('welcomePage.analysisInterval') }}</h3>
      <div class="date-inputs">
        <div class="date-input-group">
          <label class="date-label">{{ t('welcomePage.from') }}:</label>
          <input
            type="date"
            class="date-input"
            v-model="fromDate"
            :max="toDate"
            :disabled="isBusy"
            @change="handleFromDateChange"
          />
        </div>
        <div class="date-input-group">
          <label class="date-label">{{ t('welcomePage.to') }}:</label>
          <input
            type="date"
            class="date-input"
            v-model="toDate"
            :min="fromDate"
            :disabled="isBusy"
            @change="handleToDateChange"
          />
        </div>
      </div>

      <AppButton
        style="margin-top: 20px"
        :label="t('welcomePage.buttonStart')"
        variant="primary"
        :disabled="isBusy"
        @click="handleStart"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useAnalysis } from '@/composables/useAnalysis'
  import AppButton from '@/components/common/AppButton.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'
  import ToastBox from '@/components/modals/ToastBox.vue'

  const { t } = useI18n()
  const router = useRouter()
  const newAnalysisStore = useNewAnalysisStore()
  const userSettingsStore = useUserSettingsStore()

  const showToast = ref(false)
  const link = ref(newAnalysisStore.link || '')
  const today = new Date().toISOString().split('T')[0]
  const fromDate = ref(newAnalysisStore.fromDate || '2005-01-01')
  const toDate = ref(newAnalysisStore.toDate || today)

  const { isBusy, isCompleted, statusLabel, start, stop } = useAnalysis(
    'download-repository',
    'Repository Download',
    '/system-overview'
  )

  const logoSrc = computed(() => {
    switch (userSettingsStore.selectedColor) {
      case '#bc1922':
        return '/logo_red.png'
      case '#28abf2':
        return '/logo_blue.png'
      default:
        return '/logo_red.png'
    }
  })

  const handleFromDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date <= toDate.value) {
      fromDate.value = date
      newAnalysisStore.setFromDate(date)
    }
  }

  const handleToDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date >= fromDate.value) {
      toDate.value = date
      newAnalysisStore.setToDate(date)
    }
  }

  const handleStart = async () => {
    if (!link.value.trim()) {
      showToast.value = true
      return
    }

    newAnalysisStore.setLink(link.value.trim())
    newAnalysisStore.setFromDate(fromDate.value)
    newAnalysisStore.setToDate(toDate.value)

    await start({
      repoLink: link.value.trim(),
      fromDate: fromDate.value,
      toDate: toDate.value,
    })
  }

  watch(isCompleted, (newValue) => {
    if (newValue) {
      resetNewAnalysisStore()
      router.push('/system-overview')
    }
  })

  const resetNewAnalysisStore = () => {
    newAnalysisStore.setLink('')
    newAnalysisStore.setFromDate('2005-01-01')
    newAnalysisStore.setToDate(today)
  }

  const handleCancelAnalysis = () => {
    stop()
  }
</script>

<style scoped lang="scss">
  .welcome-screen {
    @include flex-center;
    position: relative;
    flex: 1 0 auto;
    width: 100%;
    padding: $spacing-xl $spacing-lg;
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 600px;
    width: 100%;
    gap: $spacing-lg;
  }

  .logo {
    @include floating-logo;
    width: 200px;
    height: 200px;
    margin-bottom: $spacing-md;
  }

  .main-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin: 0;
    line-height: $line-height-tight;

    .appname {
      color: var(--color-primary);
    }
  }

  .subtitle {
    font-size: $font-size-xl;
    font-weight: $font-weight-normal;
    color: var(--color-text-tertiary);
    margin: 0;
    line-height: $line-height-normal;
  }

  .input-section {
    @include flex-column($spacing-md);
    width: 400px;
    margin-top: $spacing-md;
  }

  .input-label {
    margin-top: 20px;
    font-size: $font-size-base;
    color: var(--color-text-secondary);
    font-weight: $font-weight-medium;
  }

  .repo-input {
    @include input-base;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .date-inputs {
    display: flex;
    gap: $spacing-xl;
    width: 100%;
    max-width: 400px;
  }

  .date-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .date-label {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    text-align: center;
    font-weight: $font-weight-medium;
  }

  .date-input {
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    color: var(--color-text-primary);
    font-size: $font-size-sm;
    text-align: center;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  }

  @include respond-to-sm {
    .welcome-screen {
      padding: $spacing-lg $spacing-md;
    }

    .main-title {
      font-size: $font-size-2xl;
    }

    .subtitle {
      font-size: $font-size-base;
    }

    .section-title {
      font-size: $font-size-lg;
    }

    .repo-input {
      font-size: $font-size-sm;
      padding: $spacing-md $spacing-lg;
    }

    .date-inputs {
      flex-direction: column;
      gap: $spacing-md;
    }

    .logo {
      width: 150px;
      height: 150px;
    }
  }
</style>
