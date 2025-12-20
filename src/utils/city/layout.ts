import type { CityNode, ProcessedNodeData, LayoutResult } from '@/types'
import {
  SPACING,
  BUILDING_HEIGHT_SCALE,
  BUILDING_WIDTH_SCALE,
  PLATFORM_HEIGHT,
  AREA_BUFFER,
} from '@/utils/city/constants'

interface SkylineSegment {
  x: number
  z: number
  width: number
}

// ========== LAYOUT I PRZETWARZANIE ==========
export function layoutInRows(children: ProcessedNodeData[]): LayoutResult {
  if (children.length === 0) {
    return { positions: [], totalWidth: SPACING * 2, totalDepth: SPACING * 2 }
  }

  let totalArea = 0
  children.forEach((child) => {
    totalArea += (child.width + SPACING) * (child.depth + SPACING)
  })

  const targetWidth = Math.sqrt(totalArea * AREA_BUFFER)

  let bestLayout = null
  let bestWaste = Infinity

  const minWidth = targetWidth * 0.6
  const maxWidth = targetWidth * 1.4 // Conajmniej około 1.4, bo są problemy z platformami z 2 plikami małymi
  const steps = 15

  for (let i = 0; i <= steps; i++) {
    const testWidth = minWidth + (maxWidth - minWidth) * (i / steps)
    const layout = skylineLayout(children, testWidth)

    const aspectRatio = layout.totalWidth / layout.totalDepth
    const aspectRatioDiff = Math.abs(aspectRatio - 1.0)
    const emptySpace = layout.totalWidth * layout.totalDepth - totalArea
    const waste = aspectRatioDiff * 100 + emptySpace * 0.1

    if (waste < bestWaste) {
      bestWaste = waste
      bestLayout = layout
    }
  }

  return bestLayout!
}

function skylineLayout(children: ProcessedNodeData[], containerWidth: number): LayoutResult {
  const skyline: SkylineSegment[] = [
    {
      // Wolne miejsce nad "ziemią". lista wolnych przestrzeni, coś w stylu skyline problem.
      x: SPACING,
      z: SPACING,
      width: containerWidth - SPACING * 2,
    },
  ]

  const positions: Array<{ x: number; z: number; rowDepth: number }> = new Array(children.length)

  children.forEach((child, index) => {
    const childWidthWithSpacing = child.width + SPACING
    const childDepthWithSpacing = child.depth + SPACING

    const placement = findBestSkylinePosition(
      skyline,
      childWidthWithSpacing,
      childDepthWithSpacing,
      containerWidth
    )

    if (placement) {
      positions[index] = {
        x: placement.x + child.width / 2,
        z: placement.z + child.depth / 2,
        rowDepth: childDepthWithSpacing,
      }

      updateSkyline(
        skyline,
        placement.x,
        placement.z + childDepthWithSpacing,
        childWidthWithSpacing
      )
    } else {
      // Fallback - dodaj najniżej jak się da
      const maxZ = Math.max(...skyline.map((s) => s.z + SPACING))
      positions[index] = {
        x: SPACING + child.width / 2,
        z: maxZ + child.depth / 2,
        rowDepth: childDepthWithSpacing,
      }

      updateSkyline(skyline, SPACING, maxZ + childDepthWithSpacing, childWidthWithSpacing)
    }
  })

  // Oblicz finalne wymiary
  let minUsedX = Infinity
  let maxUsedX = -Infinity
  let minUsedZ = Infinity
  let maxUsedZ = -Infinity

  positions.forEach((pos, idx) => {
    if (pos) {
      const child = children[idx]
      minUsedX = Math.min(minUsedX, pos.x - child.width / 2)
      maxUsedX = Math.max(maxUsedX, pos.x + child.width / 2)
      minUsedZ = Math.min(minUsedZ, pos.z - child.depth / 2)
      maxUsedZ = Math.max(maxUsedZ, pos.z + child.depth / 2)
    }
  })

  const offsetX = SPACING - minUsedX
  const offsetZ = SPACING - minUsedZ

  positions.forEach((pos) => {
    if (pos) {
      pos.x += offsetX
      pos.z += offsetZ
    }
  })

  // Oblicz finalne wymiary ze SPACING z obu stron
  const totalWidth = maxUsedX - minUsedX + SPACING * 2
  const totalDepth = maxUsedZ - minUsedZ + SPACING * 2

  return {
    positions,
    totalWidth,
    totalDepth,
  }
}

function findBestSkylinePosition(
  skyline: SkylineSegment[],
  width: number,
  depth: number,
  containerWidth: number
): { x: number; z: number } | null {
  let bestPlacement: { x: number; z: number } | null = null
  let bestScore = Infinity

  for (let i = 0; i < skyline.length; i++) {
    const seg = skyline[i]

    let availableWidth = 0
    let maxHeightInRange = seg.z // Jest po to, żeby obiekt zawsze na czymś "stał" i się nie clipował - to jest pozycja z finalnie.

    // Sprawdź ile miejsca jest dostępne od tego segmentu
    for (let j = i; j < skyline.length && availableWidth < width; j++) {
      const checkSeg = skyline[j]

      // Sprawdź czy jest przerwa w skyline
      if (j > i) {
        const prevSeg = skyline[j - 1]
        if (Math.abs(checkSeg.x - (prevSeg.x + prevSeg.width)) > 0.1) {
          break // Przerwa
        }
      }

      availableWidth += checkSeg.width
      maxHeightInRange = Math.max(maxHeightInRange, checkSeg.z)
    }

    // Check czy się zmieści
    if (availableWidth >= width && seg.x + width <= containerWidth - SPACING) {
      // Preferuj niskie pozycje (Z) i lewe pozycje (X). Ważniejsze jest Z (wysokość) niż X (lewa strona)
      const score = maxHeightInRange * 1000 + seg.x

      if (score < bestScore) {
        bestScore = score
        bestPlacement = {
          x: seg.x,
          z: maxHeightInRange,
        }
      }
    }
  }

  return bestPlacement
}

function updateSkyline(skyline: SkylineSegment[], x: number, newZ: number, width: number): void {
  const endX = x + width
  const newSegments: SkylineSegment[] = []

  let i = 0

  // Segmenty przed nowym elementem są nie dotknięte
  while (i < skyline.length && skyline[i].x + skyline[i].width <= x + 0.01) {
    newSegments.push({ ...skyline[i] })
    i++
  }

  // Jeśli nowy element zaczyna się w środku segmentu - podziel segment (lewa część)
  if (i < skyline.length && skyline[i].x < x - 0.01) {
    const seg = skyline[i]
    newSegments.push({
      x: seg.x,
      z: seg.z,
      width: x - seg.x,
    })
  }

  // Pomiń segmenty całkowicie pokryte przez nowy element
  while (i < skyline.length && skyline[i].x + skyline[i].width <= endX + 0.01) {
    i++
  }

  // Dodaj nowy segment na wysokości nowego elementu
  newSegments.push({
    x: x,
    z: newZ,
    width: width,
  })

  // Jeśli nowy element kończy się w środku segmentu - podziel segment (prawa część)
  if (i < skyline.length && skyline[i].x < endX - 0.01) {
    const seg = skyline[i]
    const remaining = seg.x + seg.width - endX
    if (remaining > 0.01) {
      newSegments.push({
        x: endX,
        z: seg.z,
        width: remaining,
      })
    }
    i++
  }

  // Dodaj pozostałe segmenty
  while (i < skyline.length) {
    newSegments.push({ ...skyline[i] })
    i++
  }

  // Scal sąsiadujące segmenty na tej samej wysokości
  skyline.length = 0

  for (let j = 0; j < newSegments.length; j++) {
    if (skyline.length > 0) {
      const last = skyline[skyline.length - 1]
      const current = newSegments[j]

      if (Math.abs(last.z - current.z) < 0.1 && Math.abs(last.x + last.width - current.x) < 0.1) {
        last.width += current.width
        continue
      }
    }

    skyline.push(newSegments[j])
  }
}

export function processNode(node: CityNode): ProcessedNodeData {
  const result: ProcessedNodeData = {
    width: 0,
    depth: 0,
    height: 0,
    children: [] as ProcessedNodeData[],
    positions: [] as Array<{ x: number; z: number; rowDepth: number }>,
  }

  // Jeśli to plik
  if (node.height !== undefined && node.width !== undefined) {
    const width = (0.1 + node.width) * BUILDING_WIDTH_SCALE
    const depth = width
    const height = (0.1 + node.height) * BUILDING_HEIGHT_SCALE

    return {
      width,
      depth,
      height,
      children: [],
      positions: [],
    }
  }

  // Jeśli to folder
  if (node.children && node.children.length > 0) {
    const processedChildren = node.children.map((child) => processNode(child))
    result.children = processedChildren

    // Sortuj dzieci po szerokości i wysokości
    const sortedIndices = processedChildren
      .map((child, index) => ({ child, index }))
      .sort((a, b) => {
        if (b.child.width !== a.child.width) {
          return b.child.width - a.child.width
        }
        return b.child.height - a.child.height
      })

    const sortedChildren = sortedIndices.map((item) => item.child)
    const originalIndices = sortedIndices.map((item) => item.index)

    const layout = layoutInRows(sortedChildren)

    result.positions = new Array(processedChildren.length)
    layout.positions.forEach((pos, sortedIdx) => {
      result.positions[originalIndices[sortedIdx]] = pos
    })

    result.width = layout.totalWidth
    result.depth = layout.totalDepth
    result.height = PLATFORM_HEIGHT
  } else if (node.children !== undefined) {
    // Pusty folder - ustalony rozmiar
    result.width = 5
    result.depth = 5
    result.height = PLATFORM_HEIGHT
  }

  return result
}
