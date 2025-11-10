<template>
  <div class="app">
    <MeshGradient
      :primary-color="userSettings.colorPrimary"
      :secondary-color="userSettings.colorSecondary"
      class="background-gradient"
    />
    <AppBar />
    <NavBar v-if="isNavBarVisible" />
    <div class="content">
      <RouterView />
    </div>
    <AppFooter />

    <div class="toast-container">
      <ToastBox
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :variant="toast.variant"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUIStore } from '@/stores/uiStore'
  import { RouterView } from 'vue-router'
  import { computed } from 'vue'
  import { useUserSettingsStore } from './stores/userSettingsStore'
  import { onBeforeUnmount } from 'vue'
  import { useConnectionStore } from '@/stores/connectionsStore'
  import { MockSSEServer } from '@/mocks/SSEServerMock'
  import { initializeCityDataMock } from '@/mocks/cityDataMock'
  import { useToast } from '@/composables/useToast'

  import AppBar from '@/components/sections/AppBar.vue'
  import NavBar from '@/components/sections/navbar/NavBar.vue'
  import AppFooter from '@/components/sections/AppFooter.vue'
  import MeshGradient from '@/components/visuals/MeshGradient.vue'
  import ToastBox from '@/components/modals/ToastBox.vue'

  const uiStore = useUIStore()
  const userSettings = useUserSettingsStore()
  const connectionStore = useConnectionStore()
  const { toasts, removeToast } = useToast()

  const isNavBarVisible = computed(() => uiStore.isNavBarVisible)

  if (import.meta.env.VITE_USE_MOCK_ANALYSIS === 'true') {
    MockSSEServer.initialize()
  }

  if (import.meta.env.VITE_USE_MOCK_CITY_DATA === 'true') {
    initializeCityDataMock()
  }

  onBeforeUnmount(() => {
    connectionStore.closeAllConnections()
  })
</script>

<style lang="scss" scoped>
  .app {
    @include flex-column;
    position: relative;
    min-height: 100vh;
    width: 100%;
  }

  .background-gradient {
    @include fixed-fill;
    z-index: -1;
    pointer-events: none;
  }

  .content {
    @include flex-center;
    @include flex-column;
    flex: 1 0 auto;
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .toast-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    z-index: 2000;

    > :deep(*) {
      pointer-events: auto;
    }
  }
</style>
