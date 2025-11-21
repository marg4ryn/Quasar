import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { CityNode, FileListItem, FileDetails, HotspotsDetails } from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('apiStore')
const STORAGE_KEY = 'api-store'

export const useApiStore = defineStore('api', () => {
  const structure = ref<CityNode>({} as CityNode)

  const fileList = ref<FileListItem[]>([])
  const fileDetails = ref<Record<string, FileDetails>>({})
  const selectedFilePath = ref<string | null>(null)

  const hotspotsDetails = ref<HotspotsDetails>({} as HotspotsDetails)

  const loading = ref<Record<string, boolean>>({})
  const errors = ref<Record<string, string | null>>({})

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        structure.value = data.structure || ({} as CityNode)
        fileList.value = data.fileList || []
        fileDetails.value = data.fileDetails || {}
        selectedFilePath.value = data.selectedFilePath || null
        hotspotsDetails.value = data.hotspotsDetails || ({} as HotspotsDetails)
        loading.value = data.loading || {}
        errors.value = data.errors || {}
        log.info('Data loaded from localStorage')
      }
    } catch (error) {
      log.error('Failed to load from localStorage:', error)
    }
  }

  function saveToStorage() {
    try {
      const data = {
        structure: structure.value,
        fileList: fileList.value,
        fileDetails: fileDetails.value,
        selectedFilePath: selectedFilePath.value,
        hotspotsDetails: hotspotsDetails.value,
        loading: loading.value,
        errors: errors.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      log.info('Data saved to localStorage')
    } catch (error) {
      log.error('Failed to save to localStorage:', error)
    }
  }

  watch(
    [structure, fileList, fileDetails, selectedFilePath, hotspotsDetails, loading, errors],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  function setStructure(data: CityNode) {
    structure.value = data
    log.info('Structure set successfully')
  }

  function setFileList(data: FileListItem[]) {
    fileList.value = data
    log.info(`File list set with ${data.length} files`)
  }

  function setFileDetails(path: string, data: FileDetails) {
    fileDetails.value[path] = data
    log.info(`File details set for: ${path}`)
  }

  function setSelectedFile(path: string | null) {
    selectedFilePath.value = path
    log.info(`Selected file: ${path}`)
  }

  function setHotspotsDetails(data: HotspotsDetails) {
    hotspotsDetails.value = data
    log.info(`Hotspots details set: ${data}`)
  }

  function getHotspotsDetails(): HotspotsDetails | undefined {
    return hotspotsDetails.value
  }

  function getFileDetails(path: string): FileDetails | undefined {
    return fileDetails.value[path]
  }

  function hasFileDetails(path: string): boolean {
    return path in fileDetails.value
  }

  function setLoading(key: string, value: boolean) {
    loading.value[key] = value
    log.info(`Loading state for ${key}: ${value}`)
  }

  function setError(key: string, message: string | null) {
    errors.value[key] = message
    if (message) {
      log.error(`Error for ${key}: ${message}`)
    }
  }

  function clearAll() {
    structure.value = {} as CityNode
    fileList.value = []
    fileDetails.value = {}
    selectedFilePath.value = null
    hotspotsDetails.value = {} as HotspotsDetails
    loading.value = {}
    errors.value = {}
    localStorage.removeItem(STORAGE_KEY)
    log.info('All API data cleared')
  }

  function clearFileData() {
    fileList.value = []
    fileDetails.value = {}
    selectedFilePath.value = null
    log.info('File data cleared')
  }

  loadFromStorage()

  return {
    structure,
    fileList,
    fileDetails,
    selectedFilePath,
    loading,
    errors,

    setStructure,
    setFileList,
    setFileDetails,
    setSelectedFile,
    setHotspotsDetails,
    getHotspotsDetails,
    getFileDetails,
    hasFileDetails,
    setLoading,
    setError,
    clearAll,
    clearFileData,
  }
})
