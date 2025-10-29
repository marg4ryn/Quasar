<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAnalysisStore } from '@/stores/analysisStore'
  import AppButton from '@/components/common/AppButton.vue'
  import LoadingOverlay from '@/components/layout/LoadingOverlay.vue'

  const link = ref('')
  const isAnalyzing = ref(false)
  const router = useRouter()
  const analysisStore = useAnalysisStore()

  const startAnalysis = async () => {
    if (!link.value.trim()) {
      alert('Please enter a repository link before starting!')
      return
    }

    isAnalyzing.value = true

    try {
      analysisStore.setLink(link.value)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      router.push('/time-range')
    } catch (error) {
      console.error('Analysis error:', error)
      alert('An error occurred during analysis. Please try again.')
    } finally {
      isAnalyzing.value = false
    }
  }
</script>

<template>
  <section class="welcome-screen">
    <LoadingOverlay :show="isAnalyzing" label="Loading repository..." />

    <div class="welcome-content">
      <img src="/vite.svg" alt="HotSpotter Logo" class="logo" />

      <h1 class="title">Welcome to HotSpotter!</h1>
      <h2 class="subtitle-heading">Your repository, Your code city.</h2>

      <div class="input-section">
        <label for="repo-link" class="input-label"> Enter link to analysis target: </label>
        <input
          id="repo-link"
          type="text"
          v-model="link"
          placeholder="e.g. https://github.com/johndoe/test.git"
          class="repo-input"
          @keyup.enter="startAnalysis"
          :disabled="isAnalyzing"
        />
      </div>

      <AppButton label="Analyze" variant="primary" @click="startAnalysis" :disabled="isAnalyzing" />
    </div>
  </section>
</template>

<style scoped lang="scss">
  .welcome-screen {
    @include flex-center;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 500px;
    width: 100%;
    height: 100%;
    gap: 1.5rem;
  }

  .logo {
    @include floating-logo;
  }

  .title {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin: 0;
    line-height: 1.2;
  }

  .subtitle-heading {
    font-size: 1.25rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.4;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-top: 1rem;
  }

  .input-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .repo-input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @media (max-width: 640px) {
    .title {
      font-size: 1.5rem;
    }

    .subtitle-heading {
      font-size: 1rem;
    }

    .repo-input {
      font-size: 0.875rem;
      padding: 0.875rem 1rem;
    }
  }
</style>
