<template>
  <nav class="nav-bar">
    <MobileSidebar v-if="isMobile" :items="items" class="mobile-only" />

    <div v-else class="nav-items">
      <NavBarItem
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :submenu="item.submenu"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import NavBarItem from '@/components/sections/navbar/NavBarItem.vue'
  import MobileSidebar from '@/components/sections/navbar/MobileSidebar.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1200
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  const items = [
    {
      label: t('navbar.summary'),
      icon: '/icons/loupe.png',
      submenu: [
        { label: t('navbar.repository-overview'), to: '/repository-overview' },
        { label: t('navbar.file-extensions'), to: '/file-extensions' },
      ],
    },
    {
      label: t('navbar.code-health'),
      icon: '/icons/cardiogram.png',
      submenu: [
        { label: t('navbar.hotspots'), to: '/hotspots' },
        { label: t('navbar.code-age'), to: '/code-age' },
        { label: t('navbar.files-coupling'), to: '/files-coupling' },
      ],
    },
    {
      label: t('navbar.developers'),
      icon: '/icons/group.png',
      submenu: [
        { label: t('navbar.developers-list'), to: '/developers-list' },
        { label: t('navbar.lead-developers'), to: '/lead-developers' },
        { label: t('navbar.knowledge-risks'), to: '/knowledge-risks' },
        { label: t('navbar.abandoned-code'), to: '/abandoned-code' },
        { label: t('navbar.developer-relationships'), to: '/developer-relationships' },
      ],
    },
  ]
</script>

<style scoped lang="scss">
  .nav-bar {
    width: 100%;
    height: 50px;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    padding: 0 $spacing-xl;
    flex-shrink: 0;
    border-bottom: 1px solid var(--color-border);
    gap: $spacing-sm;
    position: relative;
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    height: 100%;
  }

  .mobile-only {
    @media (min-width: 1201px) {
      display: none;
    }
  }

  @media (max-width: 1200px) {
    .nav-items {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .nav-bar {
      padding: 0 $spacing-md;
    }
  }
</style>
