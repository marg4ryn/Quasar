<template>
  <section class="welcome-screen">
    <div class="welcome-content">
      <img :src="logoSrc" alt="HotSpotter Logo" class="logo" />

      <h1 class="title">{{ t('welcomePage.header') }} <span class="appname1">Hot</span>Spotter!</h1>
      <h2 class="subtitle-heading">{{ t('welcomePage.motto') }}</h2>

      <div class="input-section">
        <label for="repo-link" class="input-label">{{ t('welcomePage.prompt') }}</label>
        <input
          id="repo-link"
          type="text"
          v-model="link"
          placeholder="e.g. https://github.com/johndoe/test.git"
          class="repo-input"
        />
      </div>

      <AppButton :label="t('welcomePage.buttonStart')" variant="primary" @click="handleStart" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNewAnalysisStore } from '@/stores/newAnalysisStore'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import AppButton from '@/components/common/AppButton.vue'

  const { t } = useI18n()
  const userSettingsStore = useUserSettingsStore()
  const router = useRouter()
  const analysisStore = useNewAnalysisStore()
  const link = ref(analysisStore.link || '')

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

  const handleStart = async () => {
    if (!link.value.trim()) {
      alert(t('welcomePage.alertEnterRepo'))
      return
    }
    analysisStore.setLink(link.value.trim())
    router.push('/time-range')
  }
</script>

<style scoped lang="scss">
  .welcome-screen {
    @include flex-center;
    position: relative;
    flex: 1 0 auto;
    width: 100%;
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 500px;
    width: 100%;
    height: 100%;
    gap: 1rem;
  }

  .logo {
    @include floating-logo;
    width: 200px;
    height: 200px;
  }

  .title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin: 0;
    line-height: $line-height-tight;

    .appname1 {
      color: var(--color-primary);
    }
  }

  .subtitle-heading {
    font-size: $font-size-xl;
    font-weight: $font-weight-normal;
    color: var(--color-text-tertiary);
    margin: 0;
    line-height: $line-height-normal;
  }

  .input-section {
    @include flex-column($spacing-md);
    width: 100%;
    margin-top: $spacing-lg;
  }

  .input-label {
    font-size: $font-size-base;
    color: var(--color-text-secondary);
    font-weight: $font-weight-medium;
  }

  .repo-input {
    @include input-base;
  }

  @include respond-to-sm {
    .title {
      font-size: $font-size-2xl;
    }

    .subtitle-heading {
      font-size: $font-size-base;
    }

    .repo-input {
      font-size: $font-size-sm;
      padding: $spacing-md $spacing-lg;
    }
  }
</style>
