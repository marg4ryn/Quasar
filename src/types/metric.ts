import { CityNode } from '@/types'

export interface MetricsStore {
  hotspots?: Map<string, HotspotsMetrics>
}

interface HotspotsMetrics {
  intensity: number
}

export type MetricType = 'name' | 'path' | 'height' | 'width' | 'intensity'

export interface MetricItem {
  type: MetricType
  label: string
  getValue: (node: CityNode, metrics?: MetricsStore) => string | number | null
  getStyle?: (node: CityNode, metrics?: MetricsStore) => Record<string, string> | null
}

export const allMetrics: MetricItem[] = [
  {
    type: 'name',
    label: 'Name',
    getValue: (node: CityNode) => node.name,
  },
  {
    type: 'path',
    label: 'Path',
    getValue: (node: CityNode) => node.path,
    getStyle: () => {
      return {
        fontFamily: 'var(--font-family-monospace)',
      }
    },
  },
  {
    type: 'height',
    label: 'Height',
    getValue: (node: CityNode) => node.height ?? null,
  },
  {
    type: 'width',
    label: 'Width',
    getValue: (node: CityNode) => node.width ?? null,
  },
  {
    type: 'intensity',
    label: 'Hotspot Intensity',
    getValue: (node: CityNode, metrics?: MetricsStore) =>
      metrics?.hotspots?.get(node.path)?.intensity ?? null,
    getStyle: (node: CityNode, metrics?: MetricsStore) => {
      const intensity = metrics?.hotspots?.get(node.path)?.intensity
      if (intensity == null) return null
      return {
        color: `rgb(${Math.round(intensity * 255)}, 100, 100)`,
        fontWeight: 'bold',
      }
    },
  },
]

export function getMetricsByTypes(types: MetricType[]): MetricItem[] {
  return types
    .map((type) => allMetrics.find((m) => m.type === type))
    .filter((metric): metric is MetricItem => metric !== undefined)
}
