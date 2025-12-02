<template>
  <div style="width: 600px; height: 300px;">
    <TimelineChart
      :data="commitData"
      tooltipDesc="Commits"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import TimelineChart from '@/components/visuals/TimelineChart.vue'

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
</script>

<style scoped></style>
