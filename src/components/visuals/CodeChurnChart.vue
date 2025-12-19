<template>
  <div class="chart-wrapper">
    <div v-if="!data || data.length === 0" class="placeholder">
      <p>No data to display</p>
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import {
    Chart,
    BarController,
    BarElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    CategoryScale,
  } from 'chart.js'
  import 'chartjs-adapter-date-fns'

  const CHART_COLORS = {
    linesAdded: '#22c55e',
    linesDeleted: '#ef4444',
    linesAddedHover: '#16a34a',
    linesDeletedHover: '#dc2626',
    grid: 'rgba(156, 163, 175, 0.1)',
    text: '#dadada',
    tooltipBg: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: '#000000',
  }

  const CHART_CONFIG = {
    maxTicksLimit: 8,
    tooltipPadding: 12,
  }

  Chart.register(BarController, BarElement, LinearScale, TimeScale, CategoryScale, Title, Tooltip)

  export interface ChurnData {
    date: string // yyyy-mm-dd
    linesAdded: number
    linesDeleted: number
  }

  interface Props {
    data: ChurnData[] | null
  }

  const props = defineProps<Props>()

  const chartRef = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart | null = null
  let resizeHandler: (() => void) | null = null

  function createChart() {
    if (!chartRef.value || !props.data || props.data.length === 0) return

    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    const sortedData = [...props.data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const ctx = chartRef.value.getContext('2d')
    if (!ctx) return

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedData.map((d) => d.date),
        datasets: [
          {
            label: 'Lines Added',
            data: sortedData.map((d) => d.linesAdded),
            backgroundColor: CHART_COLORS.linesAdded,
            hoverBackgroundColor: CHART_COLORS.linesAddedHover,
            barPercentage: 0.9,
            categoryPercentage: 0.95,
          },
          {
            label: 'Lines Deleted',
            data: sortedData.map((d) => -Math.abs(d.linesDeleted)),
            backgroundColor: CHART_COLORS.linesDeleted,
            hoverBackgroundColor: CHART_COLORS.linesDeletedHover,
            barPercentage: 0.9,
            categoryPercentage: 0.95,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 10,
            bottom: 0,
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: CHART_COLORS.tooltipBg,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: CHART_COLORS.tooltipBorder,
            borderWidth: 1,
            padding: CHART_CONFIG.tooltipPadding,
            displayColors: true,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex
                const dateStr = sortedData[index].date
                const date = new Date(dateStr + 'T00:00:00')
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              },
              label: (context) => {
                const value = Math.abs(context.parsed.y ?? 0)
                const label = context.dataset.label
                return `${label}: ${value.toLocaleString()}`
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'category',
            stacked: true,
            grid: {
              display: false,
              offset: false,
            },
            ticks: {
              color: CHART_COLORS.text,
              maxRotation: 0,
              autoSkip: true,
              autoSkipPadding: 0,
              maxTicksLimit: CHART_CONFIG.maxTicksLimit,
              callback: function (value, index) {
                const dateStr = sortedData[index]?.date
                if (!dateStr) return ''
                const date = new Date(dateStr + 'T00:00:00')
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              },
            },
          },
          y: {
            stacked: false,
            grid: {
              color: CHART_COLORS.grid,
            },
            ticks: {
              color: CHART_COLORS.text,
              callback: function (value) {
                return Math.abs(Number(value)).toLocaleString()
              },
            },
          },
        },
      },
    })
  }

  function handleResize() {
    createChart()
  }

  watch(
    () => props.data,
    () => {
      createChart()
    },
    { deep: true }
  )

  onMounted(() => {
    createChart()
    resizeHandler = handleResize
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }

    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  })
</script>

<style scoped>
  .chart-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: transparent;
    padding: 20px;
  }

  canvas {
    display: block;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 1.2rem;
  }
</style>
