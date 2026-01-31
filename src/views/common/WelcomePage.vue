<template>
  <section class="welcome-screen">
    <div v-if="!isRunning" class="welcome-content">
      <div class="welcome-header">
        <img src="/logo.svg" alt="HotSpotter Logo" class="welcome-header__logo" />
        <span class="welcome-header__appname">uasar</span>
        <h2 class="welcome-header__subtitle">{{ t('welcomePage.motto') }}</h2>
      </div>
      <AnalysisForm @submit="handleFormSubmit" />
    </div>

    <div v-else class="loading-content">
      <LoadingBar
        :show="true"
        :label="statusLabel || 'welcomePage.loading'"
        :show-cancel-button="true"
        :on-cancel="handleCancelAnalysis"
        :modal-label="t('welcomePage.modal')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import { useSseConnector } from '@/composables/useSseConnector'
  import AnalysisForm, { type AnalysisFormData } from '@/components/forms/StartAnalysisForm.vue'
  import { watch } from 'vue'
  import { t } from '@/plugins/i18n'
  import { useRestApi } from '@/composables/useRestApi'
  import LoadingBar from '@/components/sections/LoadingBar.vue'

  const router = useRouter()
  const newAnalysisStore = useNewAnalysisStore()
  const { start, stop, isRunning, isCompleted, statusLabel } = useSseConnector()
  const api = useRestApi()

  const handleFormSubmit = (data: AnalysisFormData) => {
    start({
      repositoryUrl: data.repositoryUrl,
      startDate: data.startDate,
      endDate: data.endDate,
    })
  }

  watch(isCompleted, async (newValue) => {
    if (newValue) {
      newAnalysisStore.reset()
      api.clearAll()
      router.push('/repository-overview')
    }
  })

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
    min-height: 100vh;
    padding: $spacing-xl $spacing-lg;
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 600px;
    width: 100%;
    height: 100%;
    gap: $spacing-lg;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
  }

  .welcome-header {
    flex: 3;

    &__logo {
      width: 200px;
      height: 200px;
      caret-color: transparent;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 1));
    }

    &__appname {
      font-size: 78px;
      font-weight: $font-weight-semibold;
      color: var(--color-text-primary);
      margin: 0;
      line-height: $line-height-tight;
    }

    &__subtitle {
      font-size: $font-size-xl;
      font-weight: $font-weight-normal;
      color: var(--color-text-secondary);
      margin: 0;
      line-height: $line-height-normal;
    }
  }

  @include respond-to-sm {
    .welcome-screen {
      padding: $spacing-lg $spacing-md;
    }

    .welcome-header {
      &__logo {
        width: 150px;
        height: 150px;
      }

      &__appname {
        font-size: $font-size-2xl;
      }

      &__subtitle {
        font-size: $font-size-base;
      }
    }
  }
</style>
