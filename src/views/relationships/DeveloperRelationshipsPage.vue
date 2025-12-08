<template>
  <LoadingBar :show="isGeneralLoading" :label="'common.loading'" :show-cancel-button="false" />

  <div class="page-wrapper">
    <TabNavigation class="tab-nav" :tabs="tabs" />
    <div class="diagram-wrapper">
      <ChordDiagram
        v-if="items.length > 0"
        :key="items.length"
        :data="items"
        @authorHover="handleAuthorHover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useRestApi } from '@/composables/useRestApi'
  import { useLogger } from '@/composables/useLogger'

  import TabNavigation from '@/components/city/TabNavigation.vue'
  import LoadingBar from '@/components/sections/LoadingBar.vue'
  import ChordDiagram from '@/components/visuals/ChordDiagram.vue'

  const { authorCouplingDetails, isGeneralLoading } = useRestApi()

  const log = useLogger('DeveloperRelationshipsPage')

  const detailsRef = authorCouplingDetails()

  watch(
    detailsRef,
    (newVal) => {
      log.info('Data changed:', newVal)
    },
    { deep: true }
  )

  const tabs = [
    { id: 'developers-list', label: 'navbar.developers-list', route: '/developers-list' },
    { id: 'lead-developers', label: 'navbar.lead-developers', route: '/lead-developers' },
    {
      id: 'knowledge-risks',
      label: 'navbar.knowledge-risks',
      route: '/knowledge-risks',
    },
    { id: 'abandoned-code', label: 'navbar.abandoned-code', route: '/abandoned-code' },
    {
      id: 'developer-relationships',
      label: 'navbar.developer-relationships',
      route: '/developer-relationships',
    },
  ]

  const items = computed(() => {
    const data = detailsRef.value

    if (!data || !Array.isArray(data)) return []

    return data.map((item) => ({
      name: item.name,
      coupledAuthors: item.coupledAuthors,
    }))
  })

  function handleAuthorHover(name: string | null) {
    log.info('Hovered over:', name)
  }
</script>

<style scoped lang="scss">
  .tab-nav {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .page-wrapper {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .diagram-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
  }
</style>
