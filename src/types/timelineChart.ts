export enum ChartColor {
  Blue = 'blue',
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
  Purple = 'purple',
  Pink = 'pink',
}

export interface ChartDataPoint {
  date: string // yyyy-mm-dd
  value: number
}

export interface Dataset {
  label: string
  data: ChartDataPoint[]
  tooltipDesc?: string
  yAxisID?: 'left' | 'right'
  color?: ChartColor
}
