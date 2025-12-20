<template>
  <header class="app-bar" :class="{ 'app-bar--minimal': !isAppBarVisible }">
    <template v-if="isAppBarVisible">
      <button
        class="app-bar__left clickable-area"
        :title="t('appbar.new-analysis')"
        :aria-label="t('appbar.new-analysis')"
        @click="openNewAnalysis"
      >
        <img :src="logoSrc" alt="Logo" class="app_logo" />
        <span class="app-name">
          <span class="app-name__1">Hot</span><span class="app-name__2">Spotter</span>
        </span>
      </button>

      <div class="app-bar__center">
        <span
          class="repo-label"
          :style="{ fontFamily: 'var(--font-family-monospace)' }"
          v-if="repoName && startDate && endDate"
        >
          {{ repoName }}: {{ startDate ? formatDate(startDate) : '' }} -
          {{ endDate ? formatDate(endDate) : '' }}
        </span>
      </div>
    </template>
  </header>

  <ModalBox
    v-if="showDialog"
    :label="t('appbar.modal')"
    :onConfirm="handleNewAnalysis"
    @close="showDialog = false"
  />
</template>

<script setup lang="ts">
  import { useUIStore } from '@/stores/uiStore'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useRestApi } from '@/composables/useRestApi'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import { formatDate } from '@/utils/dateFormatter'
  import ModalBox from '@/components/modals/ModalBox.vue'

  const { repositoryDetails } = useRestApi()
  const { t } = useI18n()

  const detailsRef = repositoryDetails()
  const router = useRouter()
  const uiStore = useUIStore()
  const isAppBarVisible = computed(() => uiStore.isAppBarVisible)
  const userSettingsStore = useUserSettingsStore()
  const showDialog = ref(false)

  const repoName = computed(() => detailsRef.value?.info.repositoryName)
  const startDate = computed(() => detailsRef.value?.info.analysisRangeStartDate)
  const endDate = computed(() => detailsRef.value?.info.analysisRangeEndDate)

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

  function openNewAnalysis() {
    showDialog.value = true
  }

  function handleNewAnalysis() {
    router.push('/welcome')
  }
</script>

<style lang="scss" scoped>
  .app-bar {
    width: 100%;
    height: 50px;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    flex-shrink: 0;
    position: relative;
    transition: background-color 0.3s ease;

    &--minimal {
      background-color: transparent;
      justify-content: flex-end;
    }

    &__left {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--color-text-primary);
      border-radius: $radius-md;
      background-color: var(--color-bg-primary);
      border: none;
      padding: 0;
      background: none;
    }

    &__center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-size: 1.1rem;
    }

    .app_logo {
      height: 40px;
      width: 40px;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 1));
    }

    .app-name {
      font-size: 1.6rem;
      text-decoration: none;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

      &__1 {
        font-weight: 800;
        color: var(--color-primary);
      }
      &__2 {
        color: var(--color-text-primary);
      }
    }

    .repo-label {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-tertiary);
      letter-spacing: 0.3px;
    }
  }
</style>
