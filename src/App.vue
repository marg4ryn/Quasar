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

  import AppBar from '@/components/layout/AppBar.vue'
  import NavBar from '@/components/layout/NavBar.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'
  import MeshGradient from '@/components/layout/MeshGradient.vue'

  const uiStore = useUIStore()
  const userSettings = useUserSettingsStore()
  const isNavBarVisible = computed(() => uiStore.isNavBarVisible)
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
