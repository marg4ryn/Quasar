<template>
  <div style="width: 100%; height: 600px;">
    <ChordDiagram
      :data="sampleData"
      @authorHover="handleAuthorHover"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ChordDiagram from '@/components/visuals/ChordDiagram.vue'
  import { useLogger } from '@/composables/useLogger'

  const log = useLogger('DeveloperRelationshipsPage')

  // Przykładowe dane do testowania
  const sampleData = ref([
    {
      name: 'Alice',
      filesChanged: 45,
      totalChanges: 320,
      coupledAuthors: [
        { name: 'Bob', sharedFilesChanged: 12, sharedChanges: 85, percentage: 26.56 },
        { name: 'Charlie', sharedFilesChanged: 8, sharedChanges: 54, percentage: 16.88 },
        { name: 'David', sharedFilesChanged: 5, sharedChanges: 32, percentage: 10.00 },
        { name: 'Grace', sharedFilesChanged: 6, sharedChanges: 42, percentage: 13.13 }
      ]
    },
    {
      name: 'Bob',
      filesChanged: 38,
      totalChanges: 275,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 12, sharedChanges: 85, percentage: 30.91 },
        { name: 'Eve', sharedFilesChanged: 10, sharedChanges: 68, percentage: 24.73 },
        { name: 'Charlie', sharedFilesChanged: 6, sharedChanges: 41, percentage: 14.91 },
        { name: 'Helen', sharedFilesChanged: 4, sharedChanges: 28, percentage: 10.18 }
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
        { name: 'Eve', sharedFilesChanged: 9, sharedChanges: 61, percentage: 14.88 },
        { name: 'Ivan', sharedFilesChanged: 7, sharedChanges: 48, percentage: 11.71 }
      ]
    },
    {
      name: 'David',
      filesChanged: 31,
      totalChanges: 198,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 5, sharedChanges: 32, percentage: 16.16 },
        { name: 'Charlie', sharedFilesChanged: 15, sharedChanges: 102, percentage: 51.52 },
        { name: 'Frank', sharedFilesChanged: 4, sharedChanges: 28, percentage: 14.14 },
        { name: 'Jack', sharedFilesChanged: 3, sharedChanges: 19, percentage: 9.60 }
      ]
    },
    {
      name: 'Eve',
      filesChanged: 42,
      totalChanges: 305,
      coupledAuthors: [
        { name: 'Bob', sharedFilesChanged: 10, sharedChanges: 68, percentage: 22.30 },
        { name: 'Charlie', sharedFilesChanged: 9, sharedChanges: 61, percentage: 20.00 },
        { name: 'Frank', sharedFilesChanged: 7, sharedChanges: 48, percentage: 15.74 },
        { name: 'Kate', sharedFilesChanged: 5, sharedChanges: 34, percentage: 11.15 }
      ]
    },
    {
      name: 'Frank',
      filesChanged: 28,
      totalChanges: 165,
      coupledAuthors: [
        { name: 'David', sharedFilesChanged: 4, sharedChanges: 28, percentage: 16.97 },
        { name: 'Eve', sharedFilesChanged: 7, sharedChanges: 48, percentage: 29.09 },
        { name: 'Leo', sharedFilesChanged: 5, sharedChanges: 31, percentage: 18.79 }
      ]
    },
    {
      name: 'Grace',
      filesChanged: 36,
      totalChanges: 245,
      coupledAuthors: [
        { name: 'Alice', sharedFilesChanged: 6, sharedChanges: 42, percentage: 17.14 },
        { name: 'Helen', sharedFilesChanged: 8, sharedChanges: 55, percentage: 22.45 },
        { name: 'Mike', sharedFilesChanged: 4, sharedChanges: 29, percentage: 11.84 },
        { name: 'Nina', sharedFilesChanged: 5, sharedChanges: 36, percentage: 14.69 }
      ]
    },
    {
      name: 'Helen',
      filesChanged: 44,
      totalChanges: 312,
      coupledAuthors: [
        { name: 'Bob', sharedFilesChanged: 4, sharedChanges: 28, percentage: 8.97 },
        { name: 'Grace', sharedFilesChanged: 8, sharedChanges: 55, percentage: 17.63 },
        { name: 'Oscar', sharedFilesChanged: 10, sharedChanges: 72, percentage: 23.08 },
        { name: 'Paul', sharedFilesChanged: 6, sharedChanges: 41, percentage: 13.14 }
      ]
    },
    {
      name: 'Ivan',
      filesChanged: 29,
      totalChanges: 185,
      coupledAuthors: [
        { name: 'Charlie', sharedFilesChanged: 7, sharedChanges: 48, percentage: 25.95 },
        { name: 'Jack', sharedFilesChanged: 5, sharedChanges: 33, percentage: 17.84 },
        { name: 'Quinn', sharedFilesChanged: 4, sharedChanges: 25, percentage: 13.51 }
      ]
    },
    {
      name: 'Jack',
      filesChanged: 33,
      totalChanges: 221,
      coupledAuthors: [
        { name: 'David', sharedFilesChanged: 3, sharedChanges: 19, percentage: 8.60 },
        { name: 'Ivan', sharedFilesChanged: 5, sharedChanges: 33, percentage: 14.93 },
        { name: 'Kate', sharedFilesChanged: 7, sharedChanges: 49, percentage: 22.17 },
        { name: 'Rachel', sharedFilesChanged: 6, sharedChanges: 38, percentage: 17.19 }
      ]
    },
    {
      name: 'Kate',
      filesChanged: 39,
      totalChanges: 278,
      coupledAuthors: [
        { name: 'Eve', sharedFilesChanged: 5, sharedChanges: 34, percentage: 12.23 },
        { name: 'Jack', sharedFilesChanged: 7, sharedChanges: 49, percentage: 17.63 },
        { name: 'Leo', sharedFilesChanged: 8, sharedChanges: 58, percentage: 20.86 },
        { name: 'Sam', sharedFilesChanged: 4, sharedChanges: 27, percentage: 9.71 }
      ]
    },
    {
      name: 'Leo',
      filesChanged: 41,
      totalChanges: 295,
      coupledAuthors: [
        { name: 'Frank', sharedFilesChanged: 5, sharedChanges: 31, percentage: 10.51 },
        { name: 'Kate', sharedFilesChanged: 8, sharedChanges: 58, percentage: 19.66 },
        { name: 'Mike', sharedFilesChanged: 9, sharedChanges: 64, percentage: 21.69 },
        { name: 'Tina', sharedFilesChanged: 6, sharedChanges: 43, percentage: 14.58 }
      ]
    },
    {
      name: 'Mike',
      filesChanged: 35,
      totalChanges: 238,
      coupledAuthors: [
        { name: 'Grace', sharedFilesChanged: 4, sharedChanges: 29, percentage: 12.18 },
        { name: 'Leo', sharedFilesChanged: 9, sharedChanges: 64, percentage: 26.89 },
        { name: 'Nina', sharedFilesChanged: 7, sharedChanges: 51, percentage: 21.43 },
        { name: 'Uma', sharedFilesChanged: 3, sharedChanges: 22, percentage: 9.24 }
      ]
    },
    {
      name: 'Nina',
      filesChanged: 37,
      totalChanges: 256,
      coupledAuthors: [
        { name: 'Grace', sharedFilesChanged: 5, sharedChanges: 36, percentage: 14.06 },
        { name: 'Mike', sharedFilesChanged: 7, sharedChanges: 51, percentage: 19.92 },
        { name: 'Oscar', sharedFilesChanged: 6, sharedChanges: 44, percentage: 17.19 },
        { name: 'Victor', sharedFilesChanged: 4, sharedChanges: 28, percentage: 10.94 }
      ]
    },
    {
      name: 'Oscar',
      filesChanged: 48,
      totalChanges: 342,
      coupledAuthors: [
        { name: 'Helen', sharedFilesChanged: 10, sharedChanges: 72, percentage: 21.05 },
        { name: 'Nina', sharedFilesChanged: 6, sharedChanges: 44, percentage: 12.87 },
        { name: 'Paul', sharedFilesChanged: 8, sharedChanges: 59, percentage: 17.25 },
        { name: 'Wendy', sharedFilesChanged: 5, sharedChanges: 37, percentage: 10.82 }
      ]
    },
    {
      name: 'Paul',
      filesChanged: 32,
      totalChanges: 214,
      coupledAuthors: [
        { name: 'Helen', sharedFilesChanged: 6, sharedChanges: 41, percentage: 19.16 },
        { name: 'Oscar', sharedFilesChanged: 8, sharedChanges: 59, percentage: 27.57 },
        { name: 'Quinn', sharedFilesChanged: 4, sharedChanges: 26, percentage: 12.15 },
        { name: 'Xander', sharedFilesChanged: 3, sharedChanges: 18, percentage: 8.41 }
      ]
    },
    {
      name: 'Quinn',
      filesChanged: 26,
      totalChanges: 172,
      coupledAuthors: [
        { name: 'Ivan', sharedFilesChanged: 4, sharedChanges: 25, percentage: 14.53 },
        { name: 'Paul', sharedFilesChanged: 4, sharedChanges: 26, percentage: 15.12 },
        { name: 'Rachel', sharedFilesChanged: 5, sharedChanges: 34, percentage: 19.77 },
        { name: 'Yara', sharedFilesChanged: 3, sharedChanges: 19, percentage: 11.05 }
      ]
    },
    {
      name: 'Rachel',
      filesChanged: 34,
      totalChanges: 229,
      coupledAuthors: [
        { name: 'Jack', sharedFilesChanged: 6, sharedChanges: 38, percentage: 16.59 },
        { name: 'Quinn', sharedFilesChanged: 5, sharedChanges: 34, percentage: 14.85 },
        { name: 'Sam', sharedFilesChanged: 7, sharedChanges: 52, percentage: 22.71 },
        { name: 'Zack', sharedFilesChanged: 4, sharedChanges: 27, percentage: 11.79 }
      ]
    },
    {
      name: 'Sam',
      filesChanged: 40,
      totalChanges: 285,
      coupledAuthors: [
        { name: 'Kate', sharedFilesChanged: 4, sharedChanges: 27, percentage: 9.47 },
        { name: 'Rachel', sharedFilesChanged: 7, sharedChanges: 52, percentage: 18.25 },
        { name: 'Tina', sharedFilesChanged: 9, sharedChanges: 66, percentage: 23.16 },
        { name: 'Uma', sharedFilesChanged: 5, sharedChanges: 35, percentage: 12.28 }
      ]
    },
    {
      name: 'Tina',
      filesChanged: 43,
      totalChanges: 298,
      coupledAuthors: [
        { name: 'Leo', sharedFilesChanged: 6, sharedChanges: 43, percentage: 14.43 },
        { name: 'Sam', sharedFilesChanged: 9, sharedChanges: 66, percentage: 22.15 },
        { name: 'Victor', sharedFilesChanged: 8, sharedChanges: 57, percentage: 19.13 },
        { name: 'Wendy', sharedFilesChanged: 5, sharedChanges: 36, percentage: 12.08 }
      ]
    },
    {
      name: 'Uma',
      filesChanged: 30,
      totalChanges: 195,
      coupledAuthors: [
        { name: 'Mike', sharedFilesChanged: 3, sharedChanges: 22, percentage: 11.28 },
        { name: 'Sam', sharedFilesChanged: 5, sharedChanges: 35, percentage: 17.95 },
        { name: 'Victor', sharedFilesChanged: 6, sharedChanges: 41, percentage: 21.03 },
        { name: 'Xander', sharedFilesChanged: 4, sharedChanges: 25, percentage: 12.82 }
      ]
    },
    {
      name: 'Victor',
      filesChanged: 46,
      totalChanges: 328,
      coupledAuthors: [
        { name: 'Nina', sharedFilesChanged: 4, sharedChanges: 28, percentage: 8.54 },
        { name: 'Tina', sharedFilesChanged: 8, sharedChanges: 57, percentage: 17.38 },
        { name: 'Uma', sharedFilesChanged: 6, sharedChanges: 41, percentage: 12.50 },
        { name: 'Yara', sharedFilesChanged: 7, sharedChanges: 49, percentage: 14.94 }
      ]
    },
    {
      name: 'Wendy',
      filesChanged: 38,
      totalChanges: 265,
      coupledAuthors: [
        { name: 'Oscar', sharedFilesChanged: 5, sharedChanges: 37, percentage: 13.96 },
        { name: 'Tina', sharedFilesChanged: 5, sharedChanges: 36, percentage: 13.58 },
        { name: 'Zack', sharedFilesChanged: 8, sharedChanges: 58, percentage: 21.89 },
        { name: 'Xander', sharedFilesChanged: 4, sharedChanges: 29, percentage: 10.94 }
      ]
    },
    {
      name: 'Xander',
      filesChanged: 27,
      totalChanges: 178,
      coupledAuthors: [
        { name: 'Paul', sharedFilesChanged: 3, sharedChanges: 18, percentage: 10.11 },
        { name: 'Uma', sharedFilesChanged: 4, sharedChanges: 25, percentage: 14.04 },
        { name: 'Wendy', sharedFilesChanged: 4, sharedChanges: 29, percentage: 16.29 },
        { name: 'Yara', sharedFilesChanged: 5, sharedChanges: 32, percentage: 17.98 }
      ]
    },
    {
      name: 'Yara',
      filesChanged: 31,
      totalChanges: 208,
      coupledAuthors: [
        { name: 'Quinn', sharedFilesChanged: 3, sharedChanges: 19, percentage: 9.13 },
        { name: 'Victor', sharedFilesChanged: 7, sharedChanges: 49, percentage: 23.56 },
        { name: 'Xander', sharedFilesChanged: 5, sharedChanges: 32, percentage: 15.38 },
        { name: 'Zack', sharedFilesChanged: 6, sharedChanges: 39, percentage: 18.75 }
      ]
    },
    {
      name: 'Zack',
      filesChanged: 36,
      totalChanges: 248,
      coupledAuthors: [
        { name: 'Rachel', sharedFilesChanged: 4, sharedChanges: 27, percentage: 10.89 },
        { name: 'Wendy', sharedFilesChanged: 8, sharedChanges: 58, percentage: 23.39 },
        { name: 'Yara', sharedFilesChanged: 6, sharedChanges: 39, percentage: 15.73 }
      ]
    }
  ])

  function handleAuthorHover(name: string | null) {
    log.info('Hovered over:', name)
  }

</script>

<style scoped>

</style>