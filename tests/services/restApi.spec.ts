import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request } from '@/services/restApi'

global.fetch = vi.fn()

describe('request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Successful requests', () => {
    it('should make a successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await request('/users/1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockData)
    })

    it('should make a successful POST request with body', async () => {
      const mockData = { success: true }
      const requestBody = { name: 'New User' }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await request('/users', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      )
      expect(result).toEqual(mockData)
    })

    it('should include custom headers', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await request('/users', {
        headers: {
          Authorization: 'Bearer token123',
        },
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
          },
        })
      )
    })
  })

  describe('HTTP errors', () => {
    it('should handle 404 error', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: 'Error 404',
          message: 'errors.resourceNotFound',
        }),
      })

      await expect(request('/users/999')).rejects.toMatchObject({
        error: 'Error 404',
        message: 'errors.resourceNotFound',
      })
    })

    it('should handle 4xx client errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Client Error',
        message: 'errors.clientError',
      })
    })

    it('should handle 5xx server errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Server Error',
        message: 'errors.serverError',
      })
    })
  })

  describe('Network errors', () => {
    it('should handle network failure (TypeError)', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Network Error',
        message: 'errors.networkFailure',
      })
    })
  })

  describe('Timeout and abort', () => {
    it('should timeout after API_TIMEOUT', async () => {
      ;(global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 10000)
          })
      )

      const requestPromise = request('/slow-endpoint')

      vi.advanceTimersByTime(5000)

      await expect(requestPromise).rejects.toMatchObject({
        error: 'Request Interrupted',
        message: 'errors.requestInterrupted',
      })
    })

    it('should handle manual abort', async () => {
      const controller = new AbortController()

      ;(global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              const error = new Error('The operation was aborted')
              error.name = 'AbortError'
              reject(error)
            })
          })
      )

      const requestPromise = request('/users', { signal: controller.signal })

      controller.abort()

      await expect(requestPromise).rejects.toMatchObject({
        error: 'Request Interrupted',
        message: 'errors.requestInterrupted',
      })
    })
  })

  describe('Unknown errors', () => {
    it('should handle unknown error types', async () => {
      ;(global.fetch as any).mockRejectedValueOnce('Some random string error')

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Unknown Error',
        message: 'errors.unknown',
      })
    })

    it('should handle null errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(null)

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Unknown Error',
        message: 'errors.unknown',
      })
    })

    it('should handle undefined errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(undefined)

      await expect(request('/users')).rejects.toMatchObject({
        error: 'Unknown Error',
        message: 'errors.unknown',
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle empty response body', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      })

      const result = await request('/users')
      expect(result).toBeNull()
    })

    it('should handle malformed JSON in successful response', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      })

      await expect(request('/users')).rejects.toThrow()
    })

    it('should preserve request method', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await request('/users', { method: 'DELETE' })

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    it('should handle custom credentials', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await request('/users', { credentials: 'omit' })

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'omit',
        })
      )
    })
  })
})
