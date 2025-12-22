<template>
  <div class="app">
    <MeshGradient
      v-if="userSettings.isGradientOn === 'on'"
      :primary-color="'#240046'"
      :secondary-color="'#08040c'"
      class="background-gradient"
    />
    <AppBar v-if="isAppBarVisible" />
    <RightSection />
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
  import { computed, onBeforeMount } from 'vue'
  import { RouterView } from 'vue-router'
  import { useUIStore } from '@/stores/uiStore'
  import { useUserSettingsStore } from './stores/userSettingsStore'
  import { useNotificationsStore } from './stores/notificationsStore'
  import { useToast } from '@/composables/useToast'

  import AppBar from '@/components/sections/appbar/AppBar.vue'
  import RightSection from './components/sections/appbar/RightSection.vue'
  import NavBar from '@/components/sections/navbar/NavBar.vue'
  import AppFooter from '@/components/sections/AppFooter.vue'
  import MeshGradient from '@/components/visuals/MeshGradient.vue'
  import ToastBox from '@/components/modals/ToastBox.vue'

  const uiStore = useUIStore()
  const userSettings = useUserSettingsStore()
  const notificationsStore = useNotificationsStore()
  const { toasts, removeToast } = useToast()

  const isNavBarVisible = computed(() => uiStore.isNavBarVisible)
  const isAppBarVisible = computed(() => uiStore.isAppBarVisible)

  onBeforeMount(() => {
    notificationsStore.clearAll()
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
