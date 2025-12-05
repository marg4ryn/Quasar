<template>
  <div style="width: 800px; height: 300px;">
    <TimelineChart
      :data="commitData"
      tooltipDesc="Commits"
    />
  </div>
  <div style="width: 800px; height: 300px;">
    <CodeChurnChart :data="churnData" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import TimelineChart from '@/components/visuals/TimelineChart.vue'
  import CodeChurnChart from '@/components/visuals/CodeChurnChart.vue'

  // Przykładowe dane
  const commitData = ref([
    { date: '2024-07-01', value: 65 },
    { date: '2024-07-08', value: 145 },
    { date: '2024-07-15', value: 210 },
    { date: '2024-07-22', value: 190 },
    { date: '2024-07-29', value: 250 },
    { date: '2024-08-05', value: 180 },
    { date: '2024-08-12', value: 120 },
    { date: '2024-08-19', value: 135 },
    { date: '2024-08-26', value: 145 },
    { date: '2024-09-02', value: 125 },
    { date: '2024-09-09', value: 110 },
    { date: '2024-09-16', value: 220 },
    { date: '2024-09-23', value: 185 },
    { date: '2024-09-30', value: 175 },
    { date: '2024-10-07', value: 165 },
    { date: '2024-10-14', value: 190 },
    { date: '2024-10-21', value: 210 },
    { date: '2024-10-28', value: 155 },
  ])

  const churnData = ref([
    { date: '2024-07-01', linesAdded: 120, linesDeleted: 45 },
    { date: '2024-07-08', linesAdded: 85, linesDeleted: 30 },
    { date: '2024-07-15', linesAdded: 210, linesDeleted: 95 },
    { date: '2024-07-22', linesAdded: 65, linesDeleted: 120 },
    { date: '2024-07-29', linesAdded: 340, linesDeleted: 180 },
    { date: '2024-08-05', linesAdded: 155, linesDeleted: 75 },
    { date: '2024-08-12', linesAdded: 90, linesDeleted: 110 },
    { date: '2024-08-19', linesAdded: 180, linesDeleted: 85 },
    { date: '2024-08-26', linesAdded: 225, linesDeleted: 140 },
    { date: '2024-09-02', linesAdded: 95, linesDeleted: 55 },
    { date: '2024-09-09', linesAdded: 310, linesDeleted: 205 },
    { date: '2024-09-16', linesAdded: 420, linesDeleted: 280 },
    { date: '2024-09-23', linesAdded: 165, linesDeleted: 90 },
    { date: '2024-09-30', linesAdded: 135, linesDeleted: 105 },
    { date: '2024-10-07', linesAdded: 245, linesDeleted: 150 },
    { date: '2024-10-14', linesAdded: 190, linesDeleted: 125 },
    { date: '2024-10-21', linesAdded: 280, linesDeleted: 195 },
    { date: '2024-10-28', linesAdded: 155, linesDeleted: 80 },
  ])
</script>

<style scoped></style>
