<template>
  <div style="width: 100%; height: 600px;">
    <ChordDiagram
      :data="sampleData"
      @authorClick="handleAuthorClick"
      @authorHover="handleAuthorHover"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ChordDiagram from '@/components/visuals/ChordDiagram.vue'
  import { useLogger } from '@/composables/useLogger'

  const log = useLogger('CodeCityPageTemplate')

  // Przykładowe dane do testowania
  const sampleData = ref([
    {
      name: 'Alice',
      filesChanged: 45,
      totalChanges: 320,
      coupledAuthors: [
        { name: 'Bob', sharedFilesChanged: 12, sharedChanges: 85, percentage: 26.56 },
        { name: 'Charlie', sharedFilesChanged: 8, sharedChanges: 54, percentage: 16.88 },
        { name: 'David', sharedFilesChanged: 5, sharedChanges: 32, percentage: 10.00 }
      ]
    },
    {
      name: 'Bob',
      filesChanged: 38,
      totalChanges: 275,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 12, sharedChanges: 85, percentage: 30.91 },
        { name: 'Eve', sharedFilesChanged: 10, sharedChanges: 68, percentage: 24.73 },
        { name: 'Charlie', sharedFilesChanged: 6, sharedChanges: 41, percentage: 14.91 }
      ]
    },
    {
      name: 'Charlie',
      filesChanged: 52,
      totalChanges: 410,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 8, sharedChanges: 54, percentage: 13.17 },
        { name: 'Bob', sharedFilesChanged: 6, sharedChanges: 41, percentage: 10.00 },
        { name: 'David', sharedFilesChanged: 15, sharedChanges: 102, percentage: 24.88 },
        { name: 'Eve', sharedFilesChanged: 9, sharedChanges: 61, percentage: 14.88 }
      ]
    },
    {
      name: 'David',
      filesChanged: 31,
      totalChanges: 198,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 5, sharedChanges: 32, percentage: 16.16 },
        { name: 'Charlie', sharedFilesChanged: 15, sharedChanges: 102, percentage: 51.52 },
        { name: 'Frank', sharedFilesChanged: 4, sharedChanges: 28, percentage: 14.14 }
      ]
    },
    {
      name: 'Eve',
      filesChanged: 42,
      totalChanges: 305,
      coupledAuthors: [
        { name: 'Bob', sharedFilesChanged: 10, sharedChanges: 68, percentage: 22.30 },
        { name: 'Charlie', sharedFilesChanged: 9, sharedChanges: 61, percentage: 20.00 },
        { name: 'Frank', sharedFilesChanged: 7, sharedChanges: 48, percentage: 15.74 }
      ]
    },
    {
      name: 'Frank',
      filesChanged: 28,
      totalChanges: 165,
      coupledAuthors: [
        { name: 'David', sharedFilesChanged: 4, sharedChanges: 28, percentage: 16.97 },
        { name: 'Eve', sharedFilesChanged: 7, sharedChanges: 48, percentage: 29.09 }
      ]
    }
  ])

  function handleAuthorClick(name: string | null) {
    log.info('Clicked on:', name)
  }

  function handleAuthorHover(name: string | null) {
    log.info('Hovered over:', name)
  }
</script>

<style scoped>

</style>