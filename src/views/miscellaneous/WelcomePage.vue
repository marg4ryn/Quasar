<template>
  <section class="welcome-screen">
    <LoadingBar
      :show="isRunning"
      :label="statusLabel || 'welcomePage.loading'"
      :show-cancel-button="true"
      :on-cancel="handleCancelAnalysis"
      :modal-label="t('welcomePage.modal')"
    />

    <div class="welcome-content">
      <img :src="logoSrc" alt="HotSpotter Logo" class="logo" />

      <h1 class="main-title">
        {{ t('welcomePage.header') }} <span class="appname">Hot</span>Spotter!
      </h1>
      <h2 class="subtitle">{{ t('welcomePage.motto') }}</h2>

      <form @submit.prevent="onSubmit">
        <div class="input-section">
          <label for="repo-link" class="input-label">{{ t('welcomePage.prompt') }}</label>
          <input
            id="repo-link"
            type="text"
            v-model="link"
            :placeholder="t('welcomePage.repoPlaceholder')"
            class="repo-input"
            :class="{ error: validationError }"
            @input="validateLink"
            @blur="validateLink"
          />
          <span v-if="validationError" class="error-message">{{ validationError }}</span>
        </div>

        <div class="checkbox-section">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showDateInputs" class="checkbox-input" />
            <span>{{ t('welcomePage.customDateRange') }}</span>
          </label>
        </div>

        <transition name="slide-fade">
          <div v-if="showDateInputs" class="date-section">
            <div class="date-inputs">
              <div class="date-input-group">
                <label class="date-label">{{ t('welcomePage.from') }}:</label>
                <input
                  type="date"
                  class="date-input"
                  :class="{ error: fromDateError }"
                  v-model="fromDate"
                  :min="MIN_DATE"
                  :max="MAX_DATE"
                  @change="handleFromDateChange"
                  @blur="validateFromDate"
                />
                <span v-if="fromDateError" class="error-message">{{ fromDateError }}</span>
              </div>
              <div class="date-input-group">
                <label class="date-label">{{ t('welcomePage.to') }}:</label>
                <input
                  type="date"
                  class="date-input"
                  :class="{ error: toDateError }"
                  v-model="toDate"
                  :min="MIN_DATE"
                  :max="MAX_DATE"
                  @change="handleToDateChange"
                  @blur="validateToDate"
                />
                <span v-if="toDateError" class="error-message">{{ toDateError }}</span>
              </div>
            </div>
          </div>
        </transition>

        <AppButton
          type="submit"
          style="margin-top: 20px"
          :label="t('welcomePage.buttonStart')"
          variant="primary"
        />
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useSseConnector } from '@/composables/useSseConnector'
  import { useRestApi } from '@/composables/useRestApi'
  import { useLogger } from '@/composables/useLogger'
  import AppButton from '@/components/common/AppButton.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const { t } = useI18n()
  const router = useRouter()
  const api = useRestApi()
  const log = useLogger('WelcomePage')
  const newAnalysisStore = useNewAnalysisStore()
  const userSettingsStore = useUserSettingsStore()

  const REPO_URL_PATTERN =
    /^(?:https:\/\/)?(?:git(?:hub|lab))\.com\/(?:[^/]+)\/(?:(?!\.git$)[^/]+?)(?:\.git)*$/

  const MIN_DATE = '2000-01-01'
  const today = new Date().toISOString().split('T')[0]
  const MAX_DATE = today
  const link = ref(newAnalysisStore.link || '')
  const validationError = ref('')
  const isLinkValid = ref(false)
  const showDateInputs = ref(false)
  const fromDate = ref(newAnalysisStore.fromDate || MIN_DATE)
  const toDate = ref(newAnalysisStore.toDate || MAX_DATE)
  const fromDateError = ref('')
  const toDateError = ref('')

  onBeforeRouteLeave((to, from, next) => {
    api.clearAll().then(() => next())
  })

  const { isRunning, isCompleted, statusLabel, start, stop } = useSseConnector(
    'download-repository',
    '/repository-overview',
    'sse.analysis.repo-download'
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

  const validateLink = () => {
    const trimmedLink = link.value.trim()

    if (!trimmedLink) {
      validationError.value = ''
      isLinkValid.value = false
      return
    }

    if (REPO_URL_PATTERN.test(trimmedLink)) {
      validationError.value = ''
      isLinkValid.value = true
    } else {
      validationError.value = t('welcomePage.invalidRepoUrl')
      isLinkValid.value = false
    }
  }

  const validateFromDate = () => {
    if (!fromDate.value) {
      fromDateError.value = t('welcomePage.dateRequired')
      return false
    }

    if (fromDate.value < MIN_DATE) {
      fromDateError.value = t('welcomePage.dateTooEarly', { date: MIN_DATE })
      return false
    }

    if (fromDate.value > MAX_DATE) {
      fromDateError.value = t('welcomePage.dateTooLate', { date: MAX_DATE })
      return false
    }

    if (toDate.value && fromDate.value > toDate.value) {
      fromDateError.value = t('welcomePage.fromDateAfterToDate')
      return false
    }

    fromDateError.value = ''
    return true
  }

  const validateToDate = () => {
    if (!toDate.value) {
      toDateError.value = t('welcomePage.dateRequired')
      return false
    }

    if (toDate.value < MIN_DATE) {
      toDateError.value = t('welcomePage.dateTooEarly', { date: MIN_DATE })
      return false
    }

    if (toDate.value > MAX_DATE) {
      toDateError.value = t('welcomePage.dateTooLate', { date: MAX_DATE })
      return false
    }

    if (fromDate.value && toDate.value < fromDate.value) {
      toDateError.value = t('welcomePage.toDateBeforeFromDate')
      return false
    }

    toDateError.value = ''
    return true
  }

  const areDatesValid = computed(() => {
    if (!showDateInputs.value) return true
    return validateFromDate() && validateToDate()
  })

  const handleFromDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    fromDate.value = date
    newAnalysisStore.setFromDate(date)
    validateFromDate()

    if (toDate.value) {
      validateToDate()
    }
  }

  const handleToDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    toDate.value = date
    newAnalysisStore.setToDate(date)
    validateToDate()

    if (fromDate.value) {
      validateFromDate()
    }
  }

  const onSubmit = async () => {
    const trimmedLink = link.value.trim()

    if (!trimmedLink) {
      validationError.value = t('welcomePage.alertEnterRepo')
      isLinkValid.value = false
      log.warn('Enter the repo link')
      return
    }

    if (REPO_URL_PATTERN.test(trimmedLink)) {
      validationError.value = ''
      isLinkValid.value = true
    } else {
      validationError.value = t('welcomePage.invalidRepoUrl')
      isLinkValid.value = false
      log.warn('Invalid repo link')
      return
    }

    if (showDateInputs.value) {
      if (!areDatesValid.value) {
        log.warn('Invalid dates')
        return
      }
    }

    newAnalysisStore.setLink(link.value.trim())

    if (showDateInputs.value) {
      newAnalysisStore.setFromDate(fromDate.value)
      newAnalysisStore.setToDate(toDate.value)
    } else {
      newAnalysisStore.setFromDate('')
      newAnalysisStore.setToDate('')
    }

    start({
      repositoryUrl: link.value.trim(),
      startDate: newAnalysisStore.fromDate.value,
      endDate: newAnalysisStore.toDate.value,
    })
  }

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
  }

  if (link.value) {
    validateLink()
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
    width: 200px;
    height: 200px;
    margin-bottom: $spacing-md;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 1));
  }

  .main-title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin: 0;
    line-height: $line-height-tight;

    .appname {
      font-weight: 800;
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

    &.error {
      border-color: $color-error;
      background: rgba(239, 68, 68, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .error-message {
    font-size: $font-size-sm;
    color: $color-error;
    text-align: left;
    width: 100%;
    margin-top: -$spacing-sm;
  }

  .checkbox-section {
    width: 100%;
    max-width: 400px;
    margin-top: $spacing-sm;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-base;
    color: var(--color-text-secondary);
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--color-primary);

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .date-section {
    width: 100%;
    max-width: 400px;
    margin-top: 8px;
  }

  .date-inputs {
    display: flex;
    gap: $spacing-xl;
    width: 100%;
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
    @include input-base;
    padding: $spacing-md;
    font-size: $font-size-sm;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-fast;

    &.error {
      border-color: $color-error;
      background: rgba(239, 68, 68, 0.1);
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

  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.2s ease-in;
  }

  .slide-fade-enter-from {
    transform: translateY(-10px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
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

    .input-section,
    .checkbox-section,
    .date-section {
      width: 100%;
    }
  }
</style>
