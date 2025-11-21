import { computed } from 'vue'
import { useApiStore } from '@/stores/apiStore'
import { api } from '@/services/api'
import type { ApiError } from '@/types/api'
import { useLogger } from '@/composables/useLogger'
import { useI18n } from 'vue-i18n'
import { useConnectionStore } from '@/stores/connectionsStore'

export function useApi() {
  const store = useApiStore()
  const connectionStore = useConnectionStore()
  const log = useLogger('useApi')
  const { t } = useI18n()

  const isLoading = computed(() => Object.values(store.loading).some((v) => v))

  async function fetchStructure(analysisId: string) {
    if (!analysisId) {
      const errorMsg = t('api.errors.noAnalysisId')
      store.setError('structure', errorMsg)
      log.error('No analysis ID provided')
      return false
    }

    log.info(`Fetching structure for analysis: ${analysisId}`)
    store.setLoading('structure', true)
    store.setError('structure', null)

    try {
      const data = await api.fetchStructure(analysisId)
      store.setStructure(data)
      log.info('Structure fetched successfully')
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message) || t('api.errors.fetchStructureFailed')
      store.setError('structure', errorMsg)
      log.error('Failed to fetch structure:', error)
      return false
    } finally {
      store.setLoading('structure', false)
    }
  }

  async function fetchCodeCity() {
    const analysis = connectionStore.analyses.get('/system-overview')

    if (!analysis) {
      log.error('System overview analysis not found')
      return false
    }

    if (!analysis.result?.success) {
      log.error('Analysis result is not successful')
      return false
    }

    const analysisId = analysis.result.data

    if (!analysisId) {
      log.error('Analysis ID is missing in result data')
      return false
    }

    log.info(`Fetching structure from system overview, analysis ID: ${analysisId}`)
    return await fetchStructure(analysisId)
  }

  async function fetchFileList(analysisId: string) {
    if (!analysisId) {
      const errorMsg = t('api.errors.noAnalysisId')
      store.setError('fileList', errorMsg)
      log.error('No analysis ID provided for file list')
      return false
    }

    log.info(`Fetching file list for analysis: ${analysisId}`)
    store.setLoading('fileList', true)
    store.setError('fileList', null)

    try {
      const data = await api.fetchFileList(analysisId)
      store.setFileList(data)
      log.info(`File list fetched successfully: ${data.length} files`)
      log.info(`Data: `, data)
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message) || t('api.errors.fetchFileListFailed')
      store.setError('fileList', errorMsg)
      log.error('Failed to fetch file list:', error)
      return false
    } finally {
      store.setLoading('fileList', false)
    }
  }

  async function fetchFileDetails(analysisId: string, filePath: string, force = false) {
    if (!analysisId) {
      const errorMsg = t('api.errors.noAnalysisId')
      store.setError('fileDetails', errorMsg)
      log.error('No analysis ID provided for file details')
      return false
    }

    if (!filePath) {
      const errorMsg = t('api.errors.noFilePath')
      store.setError('fileDetails', errorMsg)
      log.error('No file path provided')
      return false
    }

    if (!force && store.hasFileDetails(filePath)) {
      log.info(`Using cached file details for: ${filePath}`)
      store.setSelectedFile(filePath)
      return true
    }

    log.info(`Fetching file details for: ${filePath}`)
    store.setLoading('fileDetails', true)
    store.setError('fileDetails', null)

    try {
      const data = await api.fetchFileDetails(analysisId, filePath)
      store.setFileDetails(filePath, data)
      store.setSelectedFile(filePath)
      log.info(`File details fetched successfully for: ${filePath}`)
      log.info(`Data: `, data)
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message) || t('api.errors.fetchFileDetailsFailed')
      store.setError('fileDetails', errorMsg)
      log.error('Failed to fetch file details:', error)
      return false
    } finally {
      store.setLoading('fileDetails', false)
    }
  }

  async function fetchHotspotsDetails(analysisId: string) {
    if (!analysisId) {
      const errorMsg = t('api.errors.noAnalysisId')
      store.setError('hotspotsDetails', errorMsg)
      log.error('No analysis ID provided for hotspots details')
      return false
    }

    log.info(`Fetching hotspots details for analysis: ${analysisId}`)
    store.setLoading('hotspotsDetails', true)
    store.setError('hotspotsDetails', null)

    try {
      const data = await api.fetchHotspotsDetails(analysisId)
      store.setHotspotsDetails(data)
      log.info('Hotspots details fetched successfully')
      log.info(`Data: `, data)
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message) || t('api.errors.fetchHotspotsDetailsFailed')
      store.setError('hotspotsDetails', errorMsg)
      log.error('Failed to fetch hotspots details:', error)
      return false
    } finally {
      store.setLoading('hotspotsDetails', false)
    }
  }

  const selectedFileDetails = computed(() => {
    if (!store.selectedFilePath) return null
    return store.getFileDetails(store.selectedFilePath)
  })

  return {
    // Structure
    structure: computed(() => store.structure),
    fetchStructure,
    fetchCodeCity,

    // File list
    fileList: computed(() => store.fileList),
    fetchFileList,

    // File details
    fileDetails: computed(() => store.fileDetails),
    selectedFilePath: computed(() => store.selectedFilePath),
    selectedFileDetails,
    fetchFileDetails,
    selectFile: store.setSelectedFile,

    // Hotspots details
    hotspotsDetails: computed(() => store.getHotspotsDetails()),
    fetchHotspotsDetails,

    // Common
    isLoading,
    error: computed(
      () => store.errors.structure || store.errors.fileList || store.errors.fileDetails || null
    ),
    errors: computed(() => store.errors),
    clearAll: store.clearAll,
    clearFileData: store.clearFileData,
  }
}
