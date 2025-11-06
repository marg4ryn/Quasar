export interface CityNode {
  name: string
  type: string
  path: string
  height?: number
  width?: number
  children?: CityNode[]
}

export interface ProcessedNodeData {
  width: number
  depth: number
  height: number
  children: ProcessedNodeData[]
  positions: Array<{ x: number; z: number; rowDepth: number }>
}

export interface LayoutResult {
  positions: Array<{ x: number; z: number; rowDepth: number }>
  totalWidth: number
  totalDepth: number
}

export interface BuildingColorData {
  path: string
  color: number
  intensity: number
}