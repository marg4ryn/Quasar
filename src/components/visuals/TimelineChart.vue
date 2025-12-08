<template>
  <div class="chart-wrapper">
    <div v-if="!datasets || datasets.length === 0" class="placeholder">
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
    Legend,
    Filler,
    CategoryScale,
  } from 'chart.js'
  import 'chartjs-adapter-date-fns'
  import { useLogger } from '@/composables/useLogger'
  import { ChartColor, type Dataset } from '@/types/timelineChart.js'

  const CHART_COLORS = {
    [ChartColor.Blue]: {
      line: '#3b82f6',
      lineHover: '#60a5fa',
      fill: 'rgba(59, 130, 246, 0.1)',
    },
    [ChartColor.Green]: {
      line: '#10b981',
      lineHover: '#34d399',
      fill: 'rgba(16, 185, 129, 0.1)',
    },
    [ChartColor.Orange]: {
      line: '#f59e0b',
      lineHover: '#fbbf24',
      fill: 'rgba(245, 158, 11, 0.1)',
    },
    [ChartColor.Red]: {
      line: '#ef4444',
      lineHover: '#f87171',
      fill: 'rgba(239, 68, 68, 0.1)',
    },
    [ChartColor.Purple]: {
      line: '#8b5cf6',
      lineHover: '#a78bfa',
      fill: 'rgba(139, 92, 246, 0.1)',
    },
    [ChartColor.Pink]: {
      line: '#ec4899',
      lineHover: '#f472b6',
      fill: 'rgba(236, 72, 153, 0.1)',
    },
  }

  const COLOR_ORDER = [
    ChartColor.Blue,
    ChartColor.Green,
    ChartColor.Orange,
    ChartColor.Red,
    ChartColor.Purple,
    ChartColor.Pink
  ]

  const CHART_CONFIG = {
    lineWidth: 2,
    lineTension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointBorderWidth: 2,
    maxTicksLimit: 5,
    tooltipPadding: 12,
    pointBorder: '#fafafa',
    grid: 'rgba(156, 163, 175, 0.1)',
    text: '#dadada',
    tooltipBg: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: '#000000',
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
    Legend,
    Filler
  )

  interface Props {
    datasets: Dataset[]
    showLegend?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showLegend: true
  })

  const log = useLogger('TimelineChart')
  const chartRef = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart<'line', any, unknown> | null = null
  let resizeHandler: (() => void) | null = null

  function createChart() {
    if (!chartRef.value || !props.datasets || props.datasets.length === 0) return

    try {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }

      const ctx = chartRef.value.getContext('2d')
      if (!ctx) return

      // Sprawdź czy używamy wielu osi
      const leftAxisDatasets = props.datasets.filter(d => !d.yAxisID || d.yAxisID === 'left')
      const rightAxisDatasets = props.datasets.filter(d => d.yAxisID === 'right')
      const hasMultipleAxes = leftAxisDatasets.length > 0 && rightAxisDatasets.length > 0

      // Pobierz kolory osi
      const getAxisColor = (datasets: Dataset[], defaultIndex: number) => {
        if (!hasMultipleAxes) return CHART_CONFIG.text
        const dataset = datasets[0]
        const color = dataset?.color || COLOR_ORDER[defaultIndex]
        return CHART_COLORS[color].line
      }

      const yAxisColor = getAxisColor(leftAxisDatasets, 0)
      const y1AxisColor = getAxisColor(rightAxisDatasets, 1)

      const chartDatasets = props.datasets.map((dataset, index) => {
        const sortedData = [...dataset.data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        // Wybierz kolor
        const color = dataset.color || COLOR_ORDER[index % COLOR_ORDER.length]
        const colors = CHART_COLORS[color]

        return {
          label: dataset.label,
          data: sortedData.map(d => ({ x: d.date, y: d.value })),
          borderColor: colors.line,
          backgroundColor: colors.fill,
          borderWidth: CHART_CONFIG.lineWidth,
          fill: true,
          tension: CHART_CONFIG.lineTension,
          pointRadius: CHART_CONFIG.pointRadius,
          pointHoverRadius: CHART_CONFIG.pointHoverRadius,
          pointBackgroundColor: colors.line,
          pointBorderColor: CHART_CONFIG.pointBorder,
          pointBorderWidth: CHART_CONFIG.pointBorderWidth,
          pointHoverBackgroundColor: colors.lineHover,
          pointHoverBorderColor: CHART_CONFIG.pointBorder,
          tooltipDesc: dataset.tooltipDesc || dataset.label,
          yAxisID: dataset.yAxisID === 'right' ? 'y1' : 'y'
        }
      })

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: chartDatasets
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
              backgroundColor: CHART_CONFIG.tooltipBg,
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: CHART_CONFIG.tooltipBorder,
              borderWidth: 1,
              padding: CHART_CONFIG.tooltipPadding,
              displayColors: true,
              callbacks: {
                title: (context) => {
                  const dateStr = context[0].parsed.x
                  if (!dateStr) return ''
                  const date = new Date(dateStr)
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                },
                label: (context) => {
                  const dataset = context.dataset as any
                  const desc = dataset.tooltipDesc || context.dataset.label
                  return `${desc}: ${context.parsed.y}`
                }
              }
            },
            legend: {
              display: props.showLegend,
              position: 'top',
              labels: {
                color: CHART_CONFIG.text,
                padding: 15,
                font: {
                  size: 12
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM dd yyyy',
                  month: 'MMM yyyy'
                },
                parser: 'yyyy-MM-dd',
              },
              grid: {
                display: false
              },
              ticks: {
                color: CHART_CONFIG.text,
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: CHART_CONFIG.maxTicksLimit
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              grid: {
                color: CHART_CONFIG.grid,
              },
              ticks: {
                color: yAxisColor,
                precision: 0
              }
            },
            y1: {
              type: 'linear',
              display: props.datasets.length >= 2 && props.datasets.some(d => d.yAxisID === 'right'),
              position: 'right',
              beginAtZero: true,
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                color: y1AxisColor,
                precision: 0
              }
            }
          }
        }
      })
    } catch (error) {
      log.error('Failed to create chart:', error)
    }
  }

  function handleResize() {
    createChart()
  }

  watch(
    () => props.datasets,
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
