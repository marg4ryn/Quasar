import type { CityNode } from '@/types'

/**
 * Flat representation of CityNode without children hierarchy
 */
export interface FlatCityNode {
  name: string
  path: string
  type: 'file' | 'directory'
  [key: string]: any
}

/**
 * Flattens the CityNode tree into a flat array
 * @param nodes - The array of CityNodes to flatten
 * @returns The FlatCityNode array
 */
export function flattenCityNodes(nodes: CityNode[]): FlatCityNode[] {
  const flattened: FlatCityNode[] = []

  function traverse(node: CityNode) {
    const { children, ...rest } = node
    flattened.push(rest as FlatCityNode)

    if (children && children.length > 0) {
      children.forEach(traverse)
    }
  }

  nodes.forEach(traverse)
  return flattened
}

/**
 * Flattens CityNode and adds intensity from colorData
 */
export function flattenCityNodesWithIntensity(
  nodes: CityNode[],
  colorData: Array<{ path: string; intensity: number }>
): Array<FlatCityNode & { intensity?: number }> {
  const flattened = flattenCityNodes(nodes)

  return flattened.map((node) => {
    const colorInfo = colorData.find((c) => c.path === node.path)
    return {
      ...node,
      intensity: colorInfo?.intensity,
    }
  })
}
