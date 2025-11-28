<template>
  <div class="code-city-wrapper">
    <div v-if="!data || data.length === 0" class="placeholder">
      <p>No data to display</p>
    </div>
    <div v-else ref="containerRef" class="chord-diagram-container"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as d3 from 'd3'
  import { useLogger } from '@/composables/useLogger'

  // Stałe
  const DIAGRAM_SIZE = 0.35

  const ARC_TRANSPARENCY_NORMAL = 1.0
  const ARC_TRANSPARENCY_DISABLED = 0.1
  const ARC_THICKNESS = 0.85 // mniej = grubsze
  const ARC_GAP_SIZE = 0.1

  const LABEL_TRANSPARENCY_NORMAL = 1.0
  const LABEL_TRANSPARENCY_DISABLED = 0.1
  const LABEL_DISTANCE = 15 // odległość labela od diagramu

  const RIBBON_TRANSPARENCY_NORMAL = 0.7
  const RIBBON_TRANSPARENCY_HIGHLIGHT = 1.0
  const RIBBON_TRANSPARENCY_DISABELD = 0.1

  const log = useLogger('ChordDiagram')

  interface CoupledAuthor {
    name: string
    sharedFilesChanged: number
    sharedChanges: number
    percentage: number
  }

  interface AuthorData {
    name: string
    filesChanged: number
    totalChanges: number
    coupledAuthors: CoupledAuthor[]
  }

  interface Props {
    data: AuthorData[] | null
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    authorHover: [name: string | null]
  }>()

  const containerRef = ref<HTMLDivElement | null>(null)
  let svgGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
  let resizeHandler: (() => void) | null = null

  const colors = d3.schemeCategory10.concat(d3.schemePaired)

  function createChordDiagram() {
    if (!containerRef.value || !props.data || props.data.length === 0) return

    // clear poprzedni diagram
    d3.select(containerRef.value).selectAll('*').remove()

    const container = containerRef.value
    const width = container.clientWidth
    const height = container.clientHeight
    
    if (width < 100 || height < 100) {
      log.warn('Container too small for chord diagram')
      return
    }
    
    const minDimension = Math.min(width, height)
    const outerRadius = minDimension * DIAGRAM_SIZE
    const innerRadius = outerRadius * ARC_THICKNESS

    svgGroup = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    svgGroup
      .append('defs')
      .append('filter')
      .attr('id', 'blur')
      .append('feGaussianBlur')
      .attr('stdDeviation', 20)

    svgGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', outerRadius + 10)
      .attr('fill', 'rgba(0, 0, 0, 0.5)')
      .attr('filter', 'url(#blur)')
      .attr('class', 'background-circle')

    const authors = props.data.map((d) => d.name)
    const authors_count = authors.length
    const matrix: number[][] = Array(authors_count)
      .fill(0)
      .map(() => Array(authors_count).fill(0))

    props.data.forEach((author, i) => {
      author.coupledAuthors.forEach((coupled) => {
        const j = authors.indexOf(coupled.name)
        if (j !== -1) {
          matrix[i][j] = coupled.sharedChanges // Czy na pewno sharedChanges?
        }
      })
    })

    // Chord layout
    const chord = d3
      .chord()
      .padAngle(ARC_GAP_SIZE)
      .sortSubgroups(d3.descending)

    const chords = chord(matrix)

    const group = svgGroup
      .append('g')
      .selectAll('g')
      .data(chords.groups)
      .enter()
      .append('g')

    // Łuki (Arcs)
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

    group
      .append('path')
      .style('fill', (d) => colors[d.index % colors.length])
      .style('stroke', (d) => d3.rgb(colors[d.index % colors.length]).darker().toString())
      .attr('d', arc as any)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        // Znajdź wszystkich developerów połączonych z aktualnym
        const connectedIndices = new Set<number>()
        connectedIndices.add(d.index)
        
        chords.forEach((chord: any) => {
          if (chord.source.index === d.index) {
            connectedIndices.add(chord.target.index)
          }
          if (chord.target.index === d.index) {
            connectedIndices.add(chord.source.index)
          }
        })
        
        // Przyciemnij wszystkie arcs i labele oprócz połączonych
        if (svgGroup) {
          svgGroup
            .selectAll('g > path')
            .style('opacity', function(this: any, arcData: any) {
              return connectedIndices.has(arcData.index) ? ARC_TRANSPARENCY_NORMAL : ARC_TRANSPARENCY_DISABLED
            })
          
          svgGroup
            .selectAll('g > text')
            .style('opacity', function(this: any, arcData: any) {
              return connectedIndices.has(arcData.index) ? LABEL_TRANSPARENCY_NORMAL : LABEL_TRANSPARENCY_DISABLED
            })
          
          // Podświetl odpowiednie ribbony
          svgGroup
            .selectAll('.chord')
            .style('opacity', function(this: any, chord: any) {
              return chord.source.index === d.index || chord.target.index === d.index ? RIBBON_TRANSPARENCY_HIGHLIGHT : RIBBON_TRANSPARENCY_DISABELD
            })
        }
        
        emit('authorHover', authors[d.index])
      })
      .on('mouseout', function () {
        if (svgGroup) {
          // Przywróć przezroczystość
          svgGroup.selectAll('g > path').style('opacity', ARC_TRANSPARENCY_NORMAL)
          svgGroup.selectAll('g > text').style('opacity', LABEL_TRANSPARENCY_NORMAL)
          svgGroup.selectAll('.chord').style('opacity', RIBBON_TRANSPARENCY_NORMAL)
        }
        emit('authorHover', null)
      })

    // Etykiety (Labels)
    const labelRadius = outerRadius + LABEL_DISTANCE

    group
      .append('text')
      .each((d: any) => {
        d.angle = (d.startAngle + d.endAngle) / 2
      })
      .attr('dy', '.35em')
      .attr('text-anchor', (d: any) => {
        const degrees = (d.angle * 180) / Math.PI
        return degrees > 0 && degrees < 180 ? 'start' : 'end'
      })
      .attr('transform', (d: any) => {
        const angle = (d.angle * 180) / Math.PI - 90
        const rotate = angle > 90 ? angle + 180 : angle
        const x = Math.cos((d.angle - Math.PI / 2)) * labelRadius
        const y = Math.sin((d.angle - Math.PI / 2)) * labelRadius
        return `translate(${x}, ${y}) rotate(${rotate})`
      })
      .text((d) => authors[d.index])
      .style('font-size', `${Math.max(10, minDimension * 0.03)}px`)
      .style('fill', (d) => colors[d.index % colors.length])
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)')

    // Połączenia (Ribbons)
    const ribbon = d3.ribbon().radius(innerRadius)

    svgGroup
      .append('g')
      .attr('fill-opacity', RIBBON_TRANSPARENCY_NORMAL)
      .selectAll('path')
      .data(chords)
      .enter()
      .append('path')
      .attr('class', 'chord')
      .attr('d', ribbon as any)
      .style('fill', (d) => colors[d.source.index % colors.length])
      .style('stroke', (d) => d3.rgb(colors[d.source.index % colors.length]).darker().toString())
      .style('opacity', RIBBON_TRANSPARENCY_NORMAL)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', RIBBON_TRANSPARENCY_HIGHLIGHT)
        
        const sourceAuthor = authors[d.source.index]
        const targetAuthor = authors[d.target.index]
        
        emit('authorHover', `${sourceAuthor}; ${targetAuthor}`)
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', RIBBON_TRANSPARENCY_NORMAL)
        emit('authorHover', null)
      })
      .append('title')
      .text((d) => {
        const sourceAuthor = authors[d.source.index]
        const targetAuthor = authors[d.target.index]
        return `${sourceAuthor} → ${targetAuthor}: ${d.source.value}`
      })
  }

  function handleResize() {
    createChordDiagram()
  }

  watch(
    () => props.data,
    () => {
      createChordDiagram()
    },
    { deep: true }
  )

  onMounted(() => {
    createChordDiagram()
    resizeHandler = handleResize
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }
    
    if (containerRef.value) {
      d3.select(containerRef.value).selectAll('*').remove()
    }
  })
</script>

<style scoped>
.code-city-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  min-width: 400px;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.chord-diagram-container {
  width: 100%;
  height: 100%;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.2rem;
}

:deep(svg) {
  display: block;
  background: transparent;
}
</style>