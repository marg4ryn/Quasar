<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAnalysisStore } from '@/stores/analysisStore'
  import AppButton from '@/components/common/AppButton.vue'

  const minDate = '2021-07-12'
  const maxDate = '2025-09-06'

  const fromDate = ref('2021-07-12')
  const toDate = ref('2025-09-06')

  const router = useRouter()
  const analysisStore = useAnalysisStore()

  // Konwersja daty na liczbę dni od minDate
  const dateToValue = (date: string): number => {
    const min = new Date(minDate).getTime()
    const current = new Date(date).getTime()
    const max = new Date(maxDate).getTime()
    return ((current - min) / (max - min)) * 100
  }

  // Konwersja wartości slidera na datę
  const valueToDate = (value: number, isStart: boolean): string => {
    const min = new Date(minDate).getTime()
    const max = new Date(maxDate).getTime()
    const timestamp = min + (value / 100) * (max - min)
    const date = new Date(timestamp)
    return date.toISOString().split('T')[0]
  }

  const fromValue = ref(0)
  const toValue = ref(100)

  // Synchronizacja wartości slidera z datami
  watch(
    [fromDate, toDate],
    () => {
      fromValue.value = dateToValue(fromDate.value)
      toValue.value = dateToValue(toDate.value)
    },
    { immediate: true }
  )

  const handleFromSliderChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseFloat(target.value)

    if (value < toValue.value) {
      fromValue.value = value
      fromDate.value = valueToDate(value, true)
    }
  }

  const handleToSliderChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseFloat(target.value)

    if (value > fromValue.value) {
      toValue.value = value
      toDate.value = valueToDate(value, false)
    }
  }

  const handleFromDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date <= toDate.value && date >= minDate) {
      fromDate.value = date
    }
  }

  const handleToDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const date = target.value

    if (date >= fromDate.value && date <= maxDate) {
      toDate.value = date
    }
  }

  const handleAnalyze = () => {
    if (!fromDate.value || !toDate.value) {
      alert('Wybierz obie daty przed kontynuowaniem!')
      return
    }

    // Zapisz daty do store
    analysisStore.setDates(fromDate.value, toDate.value)

    // Przekierowanie do kolejnego ekranu (np. /results)
    router.push('/results')
  }

  const handleBack = () => {
    // Cofnij do poprzedniego ekranu
    router.back()
  }
</script>

<template>
  <div class="analysis-container">
    <div class="content">
      <h1 class="title">
        The repository download has<br />
        completed. Please set the analysis<br />
        interval.
      </h1>

      <div class="slider-container">
        <div class="slider-track">
          <div
            class="slider-range"
            :style="{
              left: `${fromValue}%`,
              width: `${toValue - fromValue}%`,
            }"
          ></div>
        </div>
        <input
          type="range"
          class="slider slider-from"
          min="0"
          max="100"
          step="0.1"
          :value="fromValue"
          @input="handleFromSliderChange"
        />
        <input
          type="range"
          class="slider slider-to"
          min="0"
          max="100"
          step="0.1"
          :value="toValue"
          @input="handleToSliderChange"
        />
      </div>

      <div class="date-inputs">
        <div class="date-input-group">
          <label class="date-label">From:</label>
          <input
            type="date"
            class="date-input"
            :value="fromDate"
            :min="minDate"
            :max="toDate"
            @change="handleFromDateChange"
          />
        </div>
        <div class="date-input-group">
          <label class="date-label">To:</label>
          <input
            type="date"
            class="date-input"
            :value="toDate"
            :min="fromDate"
            :max="maxDate"
            @change="handleToDateChange"
          />
        </div>
      </div>

      <div class="buttons">
        <AppButton label="Back" variant="secondary" @click="handleBack" />
        <AppButton label="Analyze" variant="primary" @click="handleAnalyze" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .analysis-container {
    @include flex-center;
    position: relative;
    width: 100%;
    height: 100%;
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

  .slider-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 40px;
    margin: 1.5rem 0;
  }

  .slider-track {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    transform: translateY(-50%);
  }

  .slider-range {
    position: absolute;
    height: 100%;
    background: #0ea5e9;
    border-radius: 2px;
    transition:
      left 0.1s,
      width 0.1s;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 40px;
    top: 0;
    left: 0;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    pointer-events: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0ea5e9;
      cursor: pointer;
      pointer-events: all;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        transform: scale(1.1);
      }
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0ea5e9;
      cursor: pointer;
      pointer-events: all;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .slider-to {
    z-index: 2;
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
