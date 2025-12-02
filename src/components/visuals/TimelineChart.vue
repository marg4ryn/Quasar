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
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Filler,
    CategoryScale
  } from 'chart.js'
  import 'chartjs-adapter-date-fns'

  const CHART_COLORS = {
    line: '#bfbfbf',
    lineHover: '#ffffff',
    fill: 'rgba(200, 200, 200, 0.1)',
    pointBorder: '#fafafa',
    grid: 'rgba(156, 163, 175, 0.1)',
    text: '#dadada',
    tooltipBg: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: '#000000',
  }

  const CHART_CONFIG = {
    lineWidth: 2,
    lineTension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 0,
    pointBorderWidth: 2,
    maxTicksLimit: 8,
    tooltipPadding: 12,
  }

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    CategoryScale,
    Title,
    Tooltip,
    Filler
  )

  interface ChartData {
    date: string // yyyy-mm-dd
    value: number
  }

  interface Props {
    data: ChartData[] | null
    tooltipDesc: string
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

    const sortedData = [...props.data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const ctx = chartRef.value.getContext('2d')
    if (!ctx) return

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedData.map(d => d.date),
        datasets: [
          {
            data: sortedData.map(d => d.value),
            borderColor: CHART_COLORS.line,
            backgroundColor: CHART_COLORS.fill,
            borderWidth: CHART_CONFIG.lineWidth,
            fill: true,
            tension: CHART_CONFIG.lineTension,
            pointRadius: CHART_CONFIG.pointRadius,
            pointHoverRadius: CHART_CONFIG.pointHoverRadius,
            pointBackgroundColor: CHART_COLORS.line,
            pointBorderColor: CHART_COLORS.pointBorder,
            pointBorderWidth: CHART_CONFIG.pointBorderWidth,
            pointHoverBackgroundColor: CHART_COLORS.lineHover,
            pointHoverBorderColor: CHART_COLORS.pointBorder,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            backgroundColor: CHART_COLORS.tooltipBg,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: CHART_COLORS.tooltipBorder,
            borderWidth: 1,
            padding: CHART_CONFIG.tooltipPadding,
            displayColors: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex
                const dateStr = sortedData[index].date
                const date = new Date(dateStr + 'T00:00:00')
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              },
              label: (context) => {
                return `${props.tooltipDesc}: ${context.parsed.y}`
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM dd',
                month: 'MMM yyyy'
              },
              parser: 'yyyy-MM-dd',
            },
            grid: {
              display: false
            },
            ticks: {
              color: CHART_COLORS.text,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: CHART_CONFIG.maxTicksLimit
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: CHART_COLORS.grid,
            },
            ticks: {
              color: CHART_COLORS.text,
              precision: 0
            }
          }
        }
      }
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
    min-height: 300px;
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