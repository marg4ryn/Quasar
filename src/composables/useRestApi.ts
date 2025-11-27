import { computed } from 'vue'
import { useRestApiStore } from '@/stores/restApiStore'
import { api } from '@/services/restApi'
import { ApiError } from '@/types'
import { useLogger } from '@/composables/useLogger'
import { useI18n } from 'vue-i18n'
import { useConnectionStore } from '@/stores/sseConnectorStore'

export function useRestApi() {
  const store = useRestApiStore()
  const connectionStore = useConnectionStore()
  const log = useLogger('useApi')
  const { t } = useI18n()

  function getAnalysisId(): string | null {
    const analysis = connectionStore.analyses.get('download-repository')
    if (analysis?.result?.data) {
      return analysis.result.data
    }
    log.warn('Analysis ID not found in connectionStore')
    return null
  }

  async function handleFetch<T>(
    fetchFn: () => Promise<T>,
    errorKey: string,
    successMessage?: string
  ): Promise<boolean> {
    store.setLoading(errorKey, true)
    store.setError(errorKey, null)

    try {
      await fetchFn()
      if (successMessage) {
        log.info(successMessage)
      }
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message) || t(`api.errors.${errorKey}Failed`)
      store.setError(errorKey, errorMsg)
      log.error(`${errorKey}:`, error)
      return false
    } finally {
      store.setLoading(errorKey, false)
    }
  }

  function structure() {
    const analysisId = getAnalysisId()

    const structureComputed = computed(() => store.structure)

    if (!store.structure && analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchStructure(analysisId)
          store.setStructure(data)
        },
        'structure',
        'Structure fetched successfully'
      )
    } else if (store.structure) {
      log.info('Returning cached structure')
    }

    return structureComputed
  }

  function itemsMap() {
    if (!store.itemsMap || store.itemsMap.size === 0) {
      const analysisId = getAnalysisId()
      if (analysisId) {
        handleFetch(
          async () => {
            const data = await api.fetchItemsList(analysisId)
            store.setItemsMap(data)
          },
          'itemsMap',
          'Items map fetched successfully'
        )
      }
    } else {
      log.info('Returning cached items map')
    }

    return computed(() => store.itemsMap)
  }

  function fileDetails(filePath: string) {
    if (store.hasFileDetails(filePath)) {
      log.info(`Returning cached file details for: ${filePath}`)
      return computed(() => store.getFileDetails(filePath))
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchFileDetails(analysisId, filePath)
          store.setFileDetails(filePath, data)
        },
        'fileDetails',
        `File details fetched for: ${filePath}`
      )
    }

    return computed(() => store.getFileDetails(filePath))
  }

  function hotspotsDetails() {
    if (store.hotspotsDetails) {
      log.info('Returning cached hotspots details')
      return computed(() => store.hotspotsDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchHotspotsDetails(analysisId)
          store.setHotspotsDetails(data)
        },
        'hotspotsDetails',
        'Hotspots details fetched successfully'
      )
    }

    return computed(() => store.hotspotsDetails)
  }

  function codeAgeDetails() {
    if (store.codeAgeDetails) {
      log.info('Returning cached code age details')
      return computed(() => store.codeAgeDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchCodeAgeDetails(analysisId)
          store.setCodeAgeDetails(data)
        },
        'codeAgeDetails',
        'Code age details fetched successfully'
      )
    }

    return computed(() => store.codeAgeDetails)
  }

  function fileCouplingDetails() {
    if (store.fileCouplingDetails) {
      log.info('Returning cached file coupling details')
      return computed(() => store.fileCouplingDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchFileCouplingDetails(analysisId)
          store.setFileCouplingDetails(data)
        },
        'codeAgeDetails',
        'File coupling details fetched successfully'
      )
    }

    return computed(() => store.fileCouplingDetails)
  }

  function knowledgeLossDetails() {
    if (store.knowledgeLossDetails) {
      log.info('Returning cached knowledge loss details')
      return computed(() => store.knowledgeLossDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchKnowledgeLossDetails(analysisId)
          store.setKnowledgeLossDetails(data)
        },
        'knowledgeLossDetails',
        'Knowledge loss details fetched successfully'
      )
    }

    return computed(() => store.knowledgeLossDetails)
  }

  function authorsStatisticsDetails() {
    if (store.authorsStatisticsDetails) {
      log.info('Returning cached authors statistics details')
      return computed(() => store.authorsStatisticsDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchAuthorsStatisticsDetails(analysisId)
          store.setAuthorsStatisticsDetails(data)
        },
        'authorsStatisticsDetails',
        'Authors statistics details fetched successfully'
      )
    }

    return computed(() => store.authorsStatisticsDetails)
  }

  function leadAuthorsDetails() {
    if (store.leadAuthorsDetails) {
      log.info('Returning cached lead authors details')
      return computed(() => store.leadAuthorsDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchLeadAuthorsDetails(analysisId)
          store.setLeadAuthorsDetails(data)
        },
        'leadAuthorsDetails',
        'Lead authors details fetched successfully'
      )
    }

    return computed(() => store.leadAuthorsDetails)
  }

  function filesExtensionsDetails() {
    if (store.filesExtensionsDetails) {
      log.info('Returning cached files extensions details')
      return computed(() => store.filesExtensionsDetails)
    }

    const analysisId = getAnalysisId()
    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchFilesExtensionsDetails(analysisId)
          store.setFilesExtensionsDetails(data)
        },
        'filesExtensionsDetails',
        'Files extensions details fetched successfully'
      )
    }

    return computed(() => store.filesExtensionsDetails)
  }

  const loadingValue = computed(() => store.loading)

  const isFileDetailsLoading = computed(() => Boolean(loadingValue.value['fileDetails']))

  const isGeneralLoading = computed(() =>
    Object.entries(loadingValue.value)
      .filter(([key]) => key !== 'fileDetails')
      .some(([, v]) => v)
  )

  return {
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

    isFileDetailsLoading,
    isGeneralLoading,
    errors: computed(() => store.errors),

    clearAll: store.clearAll,
  }
}
