<template>
  <nav class="nav-bar">
    <NavBarItem
      v-for="item in items"
      :key="item.label"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      :active="false"
      :submenu="item.submenu"
    />
  </nav>
</template>

<script setup lang="ts">
  import NavBarItem from '@/components/sections/navbar/NavBarItem.vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const items = [
    {
      label: t('navbar.summary'),
      icon: '/icons/loupe.png',
      submenu: [
        { label: t('navbar.system-overview'), to: '/system-overview' },
        { label: t('navbar.technical-sprawl'), to: '/technical-sprawl' },
      ],
    },
    {
      label: t('navbar.code-health'),
      icon: '/icons/cardiogram.png',
      submenu: [
        { label: t('navbar.hotspots'), to: '/hotspots' },
        { label: t('navbar.complexity-trends'), to: '/complexity-trends' },
        { label: t('navbar.code-age'), to: '/code-age' },
      ],
    },
    {
      label: t('navbar.change-coupling'),
      icon: '/icons/coupling.png',
      to: '/change-coupling',
    },
    {
      label: t('navbar.developers'),
      icon: '/icons/group.png',
      submenu: [
        { label: t('navbar.developer-view'), to: '/developer-view' },
        { label: t('navbar.team-view'), to: '/team-view' },
        { label: t('navbar.abandoned-code'), to: '/abandoned-code' },
        { label: t('navbar.responsibility-diffusion'), to: '/responsibility-diffusion' },
        { label: t('navbar.developer-relationships'), to: '/developer-relationships' },
      ],
    },
    {
      label: t('navbar.mappings'),
      icon: '/icons/mapping.png',
      submenu: [
        { label: t('navbar.developer-mapping'), to: '/developer-mapping' },
        { label: t('navbar.team-mapping'), to: '/team-mapping' },
        { label: t('navbar.folder-mapping'), to: '/folder-mapping' },
        { label: t('navbar.former-developers-mapping'), to: '/former-developers-mapping' },
        { label: t('navbar.ignored-files-mapping'), to: '/ignored-files-mapping' },
        { label: t('navbar.ignored-folders-mapping'), to: '/ignored-folders-mapping' },
      ],
    },
  ]
</script>

<style scoped lang="scss">
  .nav-bar {
    width: 100%;
    min-width: 1100px;
    height: 50px;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    padding: 0 $spacing-xl;
    flex-shrink: 0;
    border-bottom: 1px solid var(--color-border);
    gap: $spacing-sm;
  }
</style>
