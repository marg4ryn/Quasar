import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRestApiStore } from '@/stores/restApiStore'
import { api } from '@/services/restApi'
import { ApiError } from '@/types'
import { useLogger } from '@/composables/useLogger'
import { useI18n } from 'vue-i18n'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useNotificationsStore } from '@/stores/notificationsStore'

export function useRestApi() {
  const store = useRestApiStore()
  const { analysisId } = useAnalysisStore()
  const notificationsStore = useNotificationsStore()
  const router = useRouter()
  const log = useLogger('useApi')
  const { t } = useI18n()

  async function handleFetch<T>(
    fetchFn: () => Promise<T>,
    endpointKey: string,
    successMessage?: string
  ): Promise<boolean> {
    store.setLoading(endpointKey, true)

    try {
      await fetchFn()
      if (successMessage) {
        log.info(successMessage)
      }
      return true
    } catch (err) {
      const error = err as ApiError
      const errorMsg = t(error.message)

      notificationsStore.addNotification({
        message: errorMsg,
        type: 'error',
      })

      return false
    } finally {
      store.setLoading(endpointKey, false)
    }
  }

  function structure() {
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

  function authorCouplingDetails() {
    if (store.authorCouplingDetails) {
      log.info('Returning cached author coupling details')
      return computed(() => store.authorCouplingDetails)
    }

    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchAuthorCouplingDetails(analysisId)
          store.setAuthorCouplingDetails(data)
        },
        'authorCouplingDetails',
        'Author coupling details fetched successfully'
      )
    }

    return computed(() => store.authorCouplingDetails)
  }

  function repositoryDetails() {
    if (store.repositoryDetails) {
      log.info('Returning cached repository details')
      return computed(() => store.repositoryDetails)
    }

    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchRepositoryDetails(analysisId)
          store.setRepositoryDetails(data)
        },
        'repositoryDetails',
        'Repository details fetched successfully'
      )
    }

    return computed(() => store.repositoryDetails)
  }

  function analysisTrendsDetails() {
    if (store.analysisTrendsDetails) {
      log.info('Returning cached analysis trends details')
      return computed(() => store.analysisTrendsDetails)
    }

    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchAnalysisTrendsDetails(analysisId)
          store.setAnalysisTrendsDetails(data)
        },
        'analysisTrendsDetails',
        'Analysis trends details fetched successfully'
      )
    }

    return computed(() => store.analysisTrendsDetails)
  }

  function xRayDetails(filePath: string) {
    if (store.hasXRayDetails(filePath)) {
      log.info(`Returning cached X-Ray details for: ${filePath}`)
      router.push({
        path: '/xray-analysis',
        query: { filePath: filePath },
      })
      return computed(() => store.getXRayDetails(filePath))
    }

    if (analysisId) {
      handleFetch(
        async () => {
          const data = await api.fetchXRayDetails(analysisId, filePath)
          store.setXRayDetails(filePath, data)

          notificationsStore.addNotification({
            message: t('notifications.x-ray.completed', {
              filePath: t(data.filePath),
            }),
            type: 'success',
            screenRoute: '/xray-analysis?filePath=' + data.filePath,
          })
        },
        'xRayDetails',
        `X-Ray details fetched for: ${filePath}`
      )
    }

    return computed(() => store.getXRayDetails(filePath))
  }

  const loadingValue = computed(() => store.loading)

  const isFileDetailsLoading = computed(() => Boolean(loadingValue.value['fileDetails']))

  const isXRayDetailsLoading = computed(() => Boolean(loadingValue.value['xRayDetails']))

  const isGeneralLoading = computed(() =>
    Object.entries(loadingValue.value)
      .filter(([key]) => key !== 'fileDetails' && key !== 'xRayDetails')
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
    authorCouplingDetails,
    repositoryDetails,
    analysisTrendsDetails,
    xRayDetails,

    isFileDetailsLoading,
    isXRayDetailsLoading,
    isGeneralLoading,

    clearAll: store.clearAll,
  }
}
