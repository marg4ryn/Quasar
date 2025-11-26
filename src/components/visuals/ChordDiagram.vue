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
    authorClick: [name: string | null]
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
      console.warn('Container too small for chord diagram')
      return
    }
    
    const minDimension = Math.min(width, height)
    const outerRadius = minDimension * 0.35
    const innerRadius = outerRadius * 0.85
    
    if (innerRadius <= 0 || outerRadius <= 0) {
      console.warn('Invalid radius calculated')
      return
    }

    svgGroup = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const authors = props.data.map((d) => d.name)
    const n = authors.length
    const matrix: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))

    props.data.forEach((author, i) => {
      author.coupledAuthors.forEach((coupled) => {
        const j = authors.indexOf(coupled.name)
        if (j !== -1) {
          matrix[i][j] = coupled.sharedChanges
        }
      })
    })

    // Chord layout
    const chord = d3
      .chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)

    const chords = chord(matrix)

    const group = svgGroup
      .append('g')
      .selectAll('g')
      .data(chords.groups)
      .enter()
      .append('g')

    // łuki 
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

    group
      .append('path')
      .style('fill', (d) => colors[d.index % colors.length])
      .style('stroke', (d) => d3.rgb(colors[d.index % colors.length]).darker().toString())
      .attr('d', arc as any)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        // Podświetl połączenia
        if (svgGroup) {
          svgGroup
            .selectAll('.chord')
            .style('opacity', function(this: any, chord: any) {
              return chord.source.index === d.index || chord.target.index === d.index ? 0.8 : 0.1
            })
        }
        
        d3.select(this).style('opacity', '0.8')
        
        emit('authorHover', authors[d.index])
      })
      .on('mouseout', function () {
        if (svgGroup) {
          svgGroup.selectAll('.chord').style('opacity', '0.6')
        }
        d3.select(this).style('opacity', '1')
        emit('authorHover', null)
      })
      .on('click', (event, d) => {
        emit('authorClick', authors[d.index])
      })

    // Etykiety
    const labelRadius = outerRadius + 15
    
    group
      .append('text')
      .each((d: any) => {
        d.angle = (d.startAngle + d.endAngle) / 2
      })
      .attr('dy', '.35em')
      .attr('transform', (d: any) => {
        const angle = (d.angle * 180) / Math.PI - 90
        const x = Math.cos((d.angle - Math.PI / 2)) * labelRadius
        const y = Math.sin((d.angle - Math.PI / 2)) * labelRadius
        return `translate(${x}, ${y}) rotate(${angle > 90 ? angle + 180 : angle})`
      })
      .attr('text-anchor', (d: any) => {
        return (d.angle * 180) / Math.PI > 90 ? 'end' : 'start'
      })
      .text((d) => authors[d.index])
      .style('font-size', `${Math.max(10, minDimension * 0.02)}px`)
      .style('fill', (d) => colors[d.index % colors.length])
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')

    // Połączenia
    const ribbon = d3.ribbon().radius(innerRadius)

    svgGroup
      .append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(chords)
      .enter()
      .append('path')
      .attr('class', 'chord')
      .attr('d', ribbon as any)
      .style('fill', (d) => colors[d.source.index % colors.length])
      .style('stroke', (d) => d3.rgb(colors[d.source.index % colors.length]).darker().toString())
      .style('opacity', '0.6')
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', '1')
        
        const sourceAuthor = authors[d.source.index]
        const targetAuthor = authors[d.target.index]
        
        emit('authorHover', `${sourceAuthor} ↔ ${targetAuthor}`)
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', '0.6')
        emit('authorHover', null)
      })
      .append('title')
      .text((d) => {
        const sourceAuthor = authors[d.source.index]
        const targetAuthor = authors[d.target.index]
        return `${sourceAuthor} → ${targetAuthor}: ${d.source.value} changes`
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