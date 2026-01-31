<template>
  <form @submit.prevent="onSubmit" class="analysis-form">
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
      <label class="checkbox-label" for="show-date-inputs">
        <input
          id="show-date-inputs"
          type="checkbox"
          v-model="showDateInputs"
          class="checkbox-input"
        />
        <span>{{ t('welcomePage.customDateRange') }}</span>
      </label>
    </div>

    <transition name="slide-fade">
      <div v-if="showDateInputs" class="date-section">
        <div class="date-inputs">
          <div class="date-input-group">
            <label class="date-label" for="date-from">{{ t('welcomePage.from') }}:</label>
            <input
              id="date-from"
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
            <label class="date-label" for="date-to">{{ t('welcomePage.to') }}:</label>
            <input
              id="date-to"
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
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useLogger } from '@/composables/useLogger'
  import { useNewAnalysisStore, DEFAULT_VALUES } from '@/stores/newAnalysisStore'
  import AppButton from '@/components/common/AppButton.vue'

  export interface AnalysisFormData {
    repositoryUrl: string
    startDate: string
    endDate: string
  }

  const emit = defineEmits<{
    submit: [data: AnalysisFormData]
  }>()

  const { t } = useI18n()
  const log = useLogger('StartAnalysisForm')

  const newAnalysisStore = useNewAnalysisStore()
  const MIN_DATE = DEFAULT_VALUES.fromDate
  const MAX_DATE = DEFAULT_VALUES.toDate
  const { link, fromDate, toDate } = storeToRefs(newAnalysisStore)

  const REPO_URL_PATTERN =
    /^(?:https:\/\/)?(?:git(?:hub|lab))\.com\/(?:[^/]+)\/(?:(?!\.git$)[^/]+?)(?:\.git)*$/

  const validationError = ref('')
  const isLinkValid = ref(false)
  const showDateInputs = ref(true)
  const fromDateError = ref('')
  const toDateError = ref('')

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
    validateFromDate()

    if (toDate.value) {
      validateToDate()
    }
  }

  const handleToDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    toDate.value = date
    validateToDate()

    if (fromDate.value) {
      validateFromDate()
    }
  }

  const onSubmit = () => {
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

    emit('submit', {
      repositoryUrl: trimmedLink,
      startDate: showDateInputs.value ? fromDate.value : '',
      endDate: showDateInputs.value ? toDate.value : '',
    })
  }
</script>

<style scoped lang="scss">
  .analysis-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
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
    .input-section,
    .checkbox-section,
    .date-section {
      width: 100%;
    }

    .repo-input {
      font-size: $font-size-sm;
      padding: $spacing-md $spacing-lg;
    }

    .date-inputs {
      flex-direction: column;
      gap: $spacing-md;
    }
  }
</style>
