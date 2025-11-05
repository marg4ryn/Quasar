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
  </div>
</template>

<script setup lang="ts">
  import { useUIStore } from '@/stores/uiStore'
  import { RouterView } from 'vue-router'
  import { computed } from 'vue'
  import { useUserSettingsStore } from './stores/userSettingsStore'
  import { onBeforeUnmount } from 'vue'
  import { useAnalysisStore } from '@/stores/analysisStore'
  import { MockSSEServer } from '@/services/mockSSEServer'

  import AppBar from '@/components/sections/AppBar.vue'
  import NavBar from '@/components/sections/navbar/NavBar.vue'
  import AppFooter from '@/components/sections/AppFooter.vue'
  import MeshGradient from '@/components/visuals/MeshGradient.vue'

  const uiStore = useUIStore()
  const userSettings = useUserSettingsStore()
  const isNavBarVisible = computed(() => uiStore.isNavBarVisible)
  const analysisStore = useAnalysisStore()

  if (import.meta.env.VITE_USE_MOCK_ANALYSIS === 'true') {
    MockSSEServer.initialize()
  }

  onBeforeUnmount(() => {
    analysisStore.closeAllConnections()
  })
</script>

<style lang="scss" scoped>
  .app {
    @include flex-column;
    position: relative;
    min-height: 100vh;
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
  }
</style>
