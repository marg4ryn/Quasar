import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {
  type CityNode,
  type ItemsListItem,
  type ItemsListResponse,
  type FileDetailsResponse,
  type HotspotsResponse,
  type CodeAgeResponse,
  type FileCouplingResponse,
  type KnowledgeLossResponse,
  type AuthorsStatisticsResponse,
  type LeadAuthorsResponse,
  type FilesExtensionsResponse,
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
  const itemsMap = ref<Map<string, ItemsListItem>>(new Map())
  const fileDetails = ref<Record<string, FileDetailsResponse>>({})
  const hotspotsDetails = ref<HotspotsResponse | null>(null)
  const codeAgeDetails = ref<CodeAgeResponse | null>(null)
  const fileCouplingDetails = ref<FileCouplingResponse | null>(null)
  const knowledgeLossDetails = ref<KnowledgeLossResponse | null>(null)
  const authorsStatisticsDetails = ref<AuthorsStatisticsResponse | null>(null)
  const leadAuthorsDetails = ref<LeadAuthorsResponse | null>(null)
  const filesExtensionsDetails = ref<FilesExtensionsResponse | null>(null)
  const loading = ref<Record<string, boolean>>({})
  const errors = ref<Record<string, string | null>>({})

  async function loadFromCache() {
    try {
      const [
        cachedStructure,
        cachedItemsMap,
        cachedFileDetailsList,
        cachedHotspots,
        cachedCodeAge,
        cachedFileCoupling,
        cachedKnowledgeLoss,
        cachedAuthorsStatistics,
        cachedLeadAuthors,
        cachedFilesExtensions,
      ] = await Promise.all([
        getCacheItem<CityNode>('structure'),
        getCacheItem<Array<[string, ItemsListItem]>>('itemsMap'),
        getCacheItem<FileDetailsResponse[]>('fileDetailsList'),
        getCacheItem<HotspotsResponse>('hotspots'),
        getCacheItem<CodeAgeResponse>('codeAge'),
        getCacheItem<FileCouplingResponse>('fileCoupling'),
        getCacheItem<KnowledgeLossResponse>('knowledgeLoss'),
        getCacheItem<AuthorsStatisticsResponse>('authorsStatistics'),
        getCacheItem<LeadAuthorsResponse>('leadAuthors'),
        getCacheItem<FilesExtensionsResponse>('filesExtensions'),
      ])

      structure.value = cachedStructure
      itemsMap.value = cachedItemsMap ? new Map(cachedItemsMap) : new Map()

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
      knowledgeLossDetails.value = cachedKnowledgeLoss
      authorsStatisticsDetails.value = cachedAuthorsStatistics
      leadAuthorsDetails.value = cachedLeadAuthors
      filesExtensionsDetails.value = cachedFilesExtensions

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
    itemsMap,
    (value) => {
      if (value.size > 0) {
        setCacheItem('itemsMap', Array.from(value.entries()))
      } else {
        deleteCacheItem('itemsMap')
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

  watch(
    knowledgeLossDetails,
    (value) => {
      if (value) setCacheItem('knowledgeLoss', value)
      else deleteCacheItem('knowledgeLoss')
    },
    { deep: true }
  )

  watch(
    authorsStatisticsDetails,
    (value) => {
      if (value) setCacheItem('authorsStatistics', value)
      else deleteCacheItem('authorsStatistics')
    },
    { deep: true }
  )

  watch(
    leadAuthorsDetails,
    (value) => {
      if (value) setCacheItem('leadAuthors', value)
      else deleteCacheItem('leadAuthors')
    },
    { deep: true }
  )

  watch(
    filesExtensionsDetails,
    (value) => {
      if (value) setCacheItem('filesExtensions', value)
      else deleteCacheItem('filesExtensions')
    },
    { deep: true }
  )

  function setStructure(data: CityNode) {
    structure.value = data
  }

  function setItemsMap(data: ItemsListResponse) {
    itemsMap.value = new Map(data.map((item) => [item.path, item]))
  }

  function getItemByPath(path: string): ItemsListItem | undefined {
    return itemsMap.value.get(path)
  }

  function hasItem(path: string): boolean {
    return itemsMap.value.has(path)
  }

  function getAllItems(): ItemsListItem[] {
    return Array.from(itemsMap.value.values())
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

  function setKnowledgeLossDetails(data: KnowledgeLossResponse) {
    knowledgeLossDetails.value = data
  }

  function setAuthorsStatisticsDetails(data: AuthorsStatisticsResponse) {
    authorsStatisticsDetails.value = data
  }

  function setLeadAuthorsDetails(data: LeadAuthorsResponse) {
    leadAuthorsDetails.value = data
  }

  function setFilesExtensionsDetails(data: FilesExtensionsResponse) {
    filesExtensionsDetails.value = data
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

  function getKnowledgeLossDetails(): KnowledgeLossResponse | null {
    return knowledgeLossDetails.value
  }

  function getAuthorsStatisticsDetails(): AuthorsStatisticsResponse | null {
    return authorsStatisticsDetails.value
  }

  function getLeadAuthorsDetails(): LeadAuthorsResponse | null {
    return leadAuthorsDetails.value
  }

  function getFilesExtensionsDetails(): FilesExtensionsResponse | null {
    return filesExtensionsDetails.value
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
    itemsMap.value = new Map()
    fileDetails.value = {}
    hotspotsDetails.value = null
    codeAgeDetails.value = null
    fileCouplingDetails.value = null
    knowledgeLossDetails.value = null
    authorsStatisticsDetails.value = null
    leadAuthorsDetails.value = null
    filesExtensionsDetails.value = null
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
    itemsMap,
    fileDetails,
    hotspotsDetails,
    codeAgeDetails,
    fileCouplingDetails,
    knowledgeLossDetails,
    authorsStatisticsDetails,
    leadAuthorsDetails,
    filesExtensionsDetails,
    loading,
    errors,

    // Setters
    setStructure,
    setItemsMap,
    setFileDetails,
    setHotspotsDetails,
    setCodeAgeDetails,
    setFileCouplingDetails,
    setKnowledgeLossDetails,
    setAuthorsStatisticsDetails,
    setLeadAuthorsDetails,
    setFilesExtensionsDetails,

    // Getters
    getItemByPath,
    hasItem,
    getAllItems,
    getHotspotsDetails,
    getCodeAgeDetails,
    getFileCouplingDetails,
    getFileDetails,
    getKnowledgeLossDetails,
    getAuthorsStatisticsDetails,
    getLeadAuthorsDetails,
    getFilesExtensionsDetails,
    hasFileDetails,

    // State management
    setLoading,
    setError,

    // Clear functions
    clearAll,
  }
})
