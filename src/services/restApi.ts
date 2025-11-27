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
} from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('restApi')
const API_BASE_URL = import.meta.env.VITE_API_URL
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT)

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  log.info(`Request: ${options.method || 'GET'} ${endpoint}`)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'api.errors.unknown',
        message: `api.errors.httpError`,
        errorCode: response.status,
      }))
      log.error(`Request failed: ${response.status}`, errorData)
      throw errorData
    }

    return await response.json()
  } catch (err) {
    clearTimeout(timeoutId)

    if (err instanceof Error && err.name === 'AbortError') {
      log.error('Request timeout', endpoint)
      throw {
        error: 'api.errors.timeout',
        message: 'api.errors.requestTimeout',
        errorCode: 408,
      } as ApiError
    }

    log.error('Request error:', err)
    throw err
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

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
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
