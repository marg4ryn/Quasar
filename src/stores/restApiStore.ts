import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type {
  CityNode,
  FileListResponse,
  FileDetailsResponse,
  HotspotsResponse,
  CodeAgeResponse,
  FileCouplingResponse,
} from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('apiStore')
const CACHE_NAME = 'api-store-v1'

async function getCacheItem<T>(key: string): Promise<T | null> {
  try {
    const cache = await caches.open(CACHE_NAME)
    const response = await cache.match(key)
    if (response) {
      return await response.json()
    }
    return null
  } catch (error) {
    log.error(`Failed to get ${key} from cache:`, error)
    return null
  }
}

async function setCacheItem<T>(key: string, value: T): Promise<void> {
  try {
    const cache = await caches.open(CACHE_NAME)
    const response = new Response(JSON.stringify(value), {
      headers: { 'Content-Type': 'application/json' },
    })
    await cache.put(key, response)
  } catch (error) {
    log.error(`Failed to set ${key} in cache:`, error)
  }
}

async function deleteCacheItem(key: string): Promise<void> {
  try {
    const cache = await caches.open(CACHE_NAME)
    await cache.delete(key)
  } catch (error) {
    log.error(`Failed to delete ${key} from cache:`, error)
  }
}

export const useRestApiStore = defineStore('api', () => {
  const structure = ref<CityNode | null>(null)
  const fileMap = ref<Map<string, { path: string; name: string }>>(new Map())
  const fileDetails = ref<Record<string, FileDetailsResponse>>({})
  const hotspotsDetails = ref<HotspotsResponse | null>(null)
  const codeAgeDetails = ref<CodeAgeResponse | null>(null)
  const fileCouplingDetails = ref<FileCouplingResponse | null>(null)
  const loading = ref<Record<string, boolean>>({})
  const errors = ref<Record<string, string | null>>({})

  async function loadFromCache() {
    try {
      const [
        cachedStructure,
        cachedFileMap,
        cachedFileDetailsList,
        cachedHotspots,
        cachedCodeAge,
        cachedFileCoupling,
      ] = await Promise.all([
        getCacheItem<CityNode>('structure'),
        getCacheItem<Array<[string, { path: string; name: string }]>>('fileMap'),
        getCacheItem<FileDetailsResponse[]>('fileDetailsList'),
        getCacheItem<HotspotsResponse>('hotspots'),
        getCacheItem<CodeAgeResponse>('codeAge'),
        getCacheItem<FileCouplingResponse>('fileCoupling'),
      ])

      structure.value = cachedStructure
      fileMap.value = cachedFileMap ? new Map(cachedFileMap) : new Map()

      if (cachedFileDetailsList) {
        fileDetails.value = {}
        for (const detail of cachedFileDetailsList) {
          if (detail.info.path) {
            fileDetails.value[detail.info.path] = detail
          }
        }
      }

      hotspotsDetails.value = cachedHotspots
      codeAgeDetails.value = cachedCodeAge
      fileCouplingDetails.value = cachedFileCoupling

      log.info('Data loaded from Cache API')
    } catch (error) {
      log.error('Failed to load from cache:', error)
    }
  }

  watch(
    structure,
    (value) => {
      if (value) {
        setCacheItem('structure', value)
      } else {
        deleteCacheItem('structure')
      }
    },
    { deep: true }
  )

  watch(
    fileMap,
    (value) => {
      if (value.size > 0) {
        setCacheItem('fileMap', Array.from(value.entries()))
      } else {
        deleteCacheItem('fileMap')
      }
    },
    { deep: true }
  )

  watch(
    fileDetails,
    (value) => {
      const detailsList = Object.values(value)
      if (detailsList.length > 0) {
        setCacheItem('fileDetailsList', detailsList)
      } else {
        deleteCacheItem('fileDetailsList')
      }
    },
    { deep: true }
  )

  watch(
    hotspotsDetails,
    (value) => {
      if (value) setCacheItem('hotspots', value)
      else deleteCacheItem('hotspots')
    },
    { deep: true }
  )

  watch(
    codeAgeDetails,
    (value) => {
      if (value) setCacheItem('codeAge', value)
      else deleteCacheItem('codeAge')
    },
    { deep: true }
  )

  watch(
    fileCouplingDetails,
    (value) => {
      if (value) setCacheItem('fileCoupling', value)
      else deleteCacheItem('fileCoupling')
    },
    { deep: true }
  )

  function setStructure(data: CityNode) {
    structure.value = data
  }

  function setFileMap(data: FileListResponse) {
    fileMap.value = new Map(data.map((file) => [file.path, file]))
  }

  function getFileByPath(path: string): { path: string; name: string } | undefined {
    return fileMap.value.get(path)
  }

  function hasFile(path: string): boolean {
    return fileMap.value.has(path)
  }

  function getAllFiles(): Array<{ path: string; name: string }> {
    return Array.from(fileMap.value.values())
  }

  function setFileDetails(path: string, data: FileDetailsResponse) {
    fileDetails.value[path] = data
  }

  function setHotspotsDetails(data: HotspotsResponse) {
    hotspotsDetails.value = data
  }

  function setCodeAgeDetails(data: CodeAgeResponse) {
    codeAgeDetails.value = data
  }

  function setFileCouplingDetails(data: FileCouplingResponse) {
    fileCouplingDetails.value = data
  }

  function getHotspotsDetails(): HotspotsResponse | null {
    return hotspotsDetails.value
  }

  function getCodeAgeDetails(): CodeAgeResponse | null {
    return codeAgeDetails.value
  }

  function getFileCouplingDetails(): FileCouplingResponse | null {
    return fileCouplingDetails.value
  }

  function getFileDetails(path: string): FileDetailsResponse | undefined {
    return fileDetails.value[path]
  }

  function hasFileDetails(path: string): boolean {
    return path in fileDetails.value
  }

  function setLoading(key: string, value: boolean) {
    loading.value[key] = value
  }

  function setError(key: string, message: string | null) {
    errors.value[key] = message
    if (message) {
      log.error(`Error for ${key}: ${message}`)
    }
  }

  async function clearAll() {
    structure.value = null
    fileMap.value = new Map()
    fileDetails.value = {}
    hotspotsDetails.value = null
    codeAgeDetails.value = null
    fileCouplingDetails.value = null
    loading.value = {}
    errors.value = {}

    try {
      await caches.delete(CACHE_NAME)
      log.info('All API data cleared from cache')
    } catch (error) {
      log.error('Failed to clear cache:', error)
    }
  }

  loadFromCache()

  return {
    // State
    structure,
    fileMap,
    fileDetails,
    hotspotsDetails,
    codeAgeDetails,
    fileCouplingDetails,
    loading,
    errors,

    // Setters
    setStructure,
    setFileMap,
    setFileDetails,
    setHotspotsDetails,
    setCodeAgeDetails,
    setFileCouplingDetails,

    // Getters
    getFileByPath,
    hasFile,
    getAllFiles,
    getHotspotsDetails,
    getCodeAgeDetails,
    getFileCouplingDetails,
    getFileDetails,
    hasFileDetails,

    // State management
    setLoading,
    setError,

    // Clear functions
    clearAll,
  }
})
