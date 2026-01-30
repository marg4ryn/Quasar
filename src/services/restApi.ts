import type {
  ApiError,
  CityNode,
  ItemsListResponse,
  FileDetailsResponse,
  HotspotsResponse,
  CodeAgeResponse,
  FileCouplingResponse,
  KnowledgeLossResponse,
  AuthorsStatisticsResponse,
  LeadAuthorsResponse,
  FilesExtensionsResponse,
  AuthorCouplingResponse,
  RepositoryResponse,
  AnalysisTrendsResponse,
  XRayResponse,
} from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('restApi')
const API_BASE_URL = import.meta.env.VITE_API_URL
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT)

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  log.info(`Request: ${options.method || 'GET'} ${endpoint}`)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData: ApiError = await response
        .json()
        .catch(() => createHttpError(response.status))

      log.error(`Request failed: ${response.status}`, errorData)
      throw errorData
    }

    return await response.json()
  } catch (err) {
    clearTimeout(timeoutId)

    // 1. Timeout or manual interrupt
    if (err instanceof Error && err.name === 'AbortError') {
      const requestError: ApiError = {
        error: 'Request Interrupted',
        message: 'errors.requestInterrupted',
      }
      log.error('Request timeout', endpoint)
      throw requestError
    }

    // 2. Network errors
    if (err instanceof TypeError) {
      const networkError: ApiError = {
        error: 'Network Error',
        message: 'errors.networkFailure',
      }
      log.error('Network error:', err.message)
      throw networkError
    }

    // 3. Http errors
    if (err && typeof err === 'object') {
      throw err as ApiError
    }

    // 4. Unknown error
    const unknownError: ApiError = {
      error: 'Unknown Error',
      message: 'errors.unknown',
    }
    log.error('Unknown error:', err)
    throw unknownError
  }
}

function createHttpError(status: number): ApiError {
  if (status === 404) {
    return {
      error: 'Error 404',
      message: 'errors.resourceNotFound',
    }
  }

  if (status >= 400 && status < 500) {
    return {
      error: 'Client Error',
      message: `errors.clientError`,
    }
  }

  if (status >= 500 && status < 600) {
    return {
      error: 'Server Error',
      message: 'errors.serverError',
    }
  }

  return {
    error: 'Unknown Error',
    message: `errors.unknown`,
  }
}

function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value))
  })
  return searchParams.toString()
}

export const api = {
  async fetchStructure(analysisId: string): Promise<CityNode> {
    return request<CityNode>(`analysis/${analysisId}/structure`)
  },

  async fetchItemsList(analysisId: string): Promise<ItemsListResponse> {
    return request<ItemsListResponse>(`analysis/${analysisId}/items`)
  },

  async fetchFileDetails(analysisId: string, filePath: string): Promise<FileDetailsResponse> {
    const queryString = buildQueryString({ path: filePath })
    return request<FileDetailsResponse>(`analysis/${analysisId}/files?${queryString}`)
  },

  async fetchHotspotsDetails(analysisId: string): Promise<HotspotsResponse> {
    return request<HotspotsResponse>(`analysis/${analysisId}/files/hotspots`)
  },

  async fetchCodeAgeDetails(analysisId: string): Promise<CodeAgeResponse> {
    return request<CodeAgeResponse>(`analysis/${analysisId}/files/code-age`)
  },

  async fetchFileCouplingDetails(analysisId: string): Promise<FileCouplingResponse> {
    return request<FileCouplingResponse>(`analysis/${analysisId}/files/coupling`)
  },

  async fetchKnowledgeLossDetails(analysisId: string): Promise<KnowledgeLossResponse> {
    return request<KnowledgeLossResponse>(`analysis/${analysisId}/files/knowledge-loss-risk`)
  },

  async fetchAuthorsStatisticsDetails(analysisId: string): Promise<AuthorsStatisticsResponse> {
    return request<AuthorsStatisticsResponse>(`analysis/${analysisId}/authors/statistics`)
  },

  async fetchLeadAuthorsDetails(analysisId: string): Promise<LeadAuthorsResponse> {
    return request<LeadAuthorsResponse>(`analysis/${analysisId}/files/lead-authors`)
  },

  async fetchFilesExtensionsDetails(analysisId: string): Promise<FilesExtensionsResponse> {
    return request<FilesExtensionsResponse>(`analysis/${analysisId}/files/types`)
  },

  async fetchAuthorCouplingDetails(analysisId: string): Promise<AuthorCouplingResponse> {
    return request<AuthorCouplingResponse>(`analysis/${analysisId}/authors/coupling`)
  },

  async fetchRepositoryDetails(analysisId: string): Promise<RepositoryResponse> {
    return request<RepositoryResponse>(`analysis/${analysisId}/summary`)
  },

  async fetchAnalysisTrendsDetails(analysisId: string): Promise<AnalysisTrendsResponse> {
    return request<AnalysisTrendsResponse>(`analysis/${analysisId}/trends`)
  },

  async fetchXRayDetails(analysisId: string, filePath: string): Promise<XRayResponse> {
    const queryString = buildQueryString({ path: filePath })
    return request<XRayResponse>(`analysis/${analysisId}/x-ray?${queryString}`)
  },

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const queryString = params ? `?${buildQueryString(params)}` : ''
    return request<T>(`${endpoint}${queryString}`, { method: 'GET' })
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' })
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

export type ApiService = typeof api
