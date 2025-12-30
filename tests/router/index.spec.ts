import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory, Router } from 'vue-router'
import createRouterInstance from '@/router'
import { useUIStore } from '@/stores/uiStore'
import { t } from '@/plugins/i18n'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    createRouter: vi.fn(),
    createWebHistory: vi.fn(),
  }
})

vi.mock('@/plugins/i18n', () => ({
  t: vi.fn((key: string) => key),
}))

vi.mock('@/stores/uiStore', () => ({
  useUIStore: vi.fn(),
}))

vi.mock('@/views/common/WelcomePage.vue', () => ({
  default: { name: 'WelcomePage' },
}))
vi.mock('@/views/common/SettingsPage.vue', () => ({
  default: { name: 'SettingsPage' },
}))
vi.mock('@/views/common/AboutPage.vue', () => ({
  default: { name: 'AboutPage' },
}))
vi.mock('@/views/common/RepositoryOverviewPage.vue', () => ({
  default: { name: 'RepositoryOverviewPage' },
}))

describe('Router', () => {
  let mockRouter: Router
  let mockUIStore: any
  let beforeEachCallback: any
  let afterEachCallback: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockUIStore = {
      isNavBarVisible: true,
      isAppBarVisible: true,
    }

    vi.mocked(useUIStore).mockReturnValue(mockUIStore)

    mockRouter = {
      beforeEach: vi.fn((callback) => {
        beforeEachCallback = callback
      }),
      afterEach: vi.fn((callback) => {
        afterEachCallback = callback
      }),
      replace: vi.fn().mockResolvedValue(undefined),
      push: vi.fn().mockResolvedValue(undefined),
    } as any

    vi.mocked(createRouter).mockReturnValue(mockRouter)
    vi.mocked(createWebHistory).mockReturnValue({} as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Router creation', () => {
    it('should create router with correct configuration', () => {
      createRouterInstance()

      expect(createWebHistory).toHaveBeenCalledWith(import.meta.env.BASE_URL)
      expect(createRouter).toHaveBeenCalledWith(
        expect.objectContaining({
          history: expect.anything(),
          routes: expect.arrayContaining([
            expect.objectContaining({
              path: '/',
              name: 'welcome',
            }),
          ]),
          scrollBehavior: expect.any(Function),
        })
      )
    })

    it('should have welcome route with correct meta', () => {
      createRouterInstance()

      const createRouterCall = vi.mocked(createRouter).mock.calls[0][0]
      const welcomeRoute = createRouterCall.routes.find((r: any) => r.name === 'welcome')

      expect(welcomeRoute).toBeDefined()
      expect(welcomeRoute?.meta).toEqual({
        showNavBar: false,
        showAppBar: false,
        skipHistory: false,
      })
    })

    it('should have catch-all route that redirects to home', () => {
      createRouterInstance()

      const createRouterCall = vi.mocked(createRouter).mock.calls[0][0]
      const catchAllRoute = createRouterCall.routes.find((r: any) => r.path === '/:pathMatch(.*)*')

      expect(catchAllRoute).toBeDefined()
      expect(catchAllRoute?.redirect).toBe('/')
    })
  })

  describe('beforeEach navigation guard', () => {
    let consoleLogSpy: any

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      createRouterInstance()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('should update UI store when showNavBar meta is defined', () => {
      const to = { path: '/test', meta: { showNavBar: false }, fullPath: '/test' }
      const from = { path: '/', meta: {}, fullPath: '/' }
      const next = vi.fn()

      beforeEachCallback(to, from, next)

      expect(mockUIStore.isNavBarVisible).toBe(false)
      expect(next).toHaveBeenCalled()
    })

    it('should not update UI store when meta is undefined', () => {
      const originalNavBar = mockUIStore.isNavBarVisible
      const originalAppBar = mockUIStore.isAppBarVisible

      const to = { path: '/test', meta: {}, fullPath: '/test' }
      const from = { path: '/', meta: {}, fullPath: '/' }
      const next = vi.fn()

      beforeEachCallback(to, from, next)

      expect(mockUIStore.isNavBarVisible).toBe(originalNavBar)
      expect(mockUIStore.isAppBarVisible).toBe(originalAppBar)
      expect(next).toHaveBeenCalled()
    })

    it('should call next without replace for normal navigation', () => {
      const to = { path: '/test', meta: {}, fullPath: '/test' }
      const from = { path: '/', meta: {}, fullPath: '/' }
      const next = vi.fn()

      beforeEachCallback(to, from, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })

    it('should replace route when leaving skipHistory page', async () => {
      vi.useFakeTimers()

      const to = { path: '/test', meta: {}, fullPath: '/test' }
      const from = { path: '/loading', meta: { skipHistory: true }, fullPath: '/loading' }
      const next = vi.fn()

      beforeEachCallback(to, from, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('Replacing: ', '/loading')

      await vi.runAllTimersAsync()

      expect(mockRouter.replace).toHaveBeenCalledWith('/test')

      vi.useRealTimers()
    })

    it('should handle multiple navigations with skipHistory correctly', async () => {
      vi.useFakeTimers()

      // Pierwsza nawigacja - opuszczamy skipHistory
      const to1 = { path: '/test1', meta: {}, fullPath: '/test1' }
      const from1 = { path: '/loading', meta: { skipHistory: true }, fullPath: '/loading' }
      const next1 = vi.fn()

      beforeEachCallback(to1, from1, next1)
      await vi.runAllTimersAsync()

      expect(mockRouter.replace).toHaveBeenCalledWith('/test1')

      // Druga nawigacja - normalna
      const to2 = { path: '/test2', meta: {}, fullPath: '/test2' }
      const from2 = { path: '/test1', meta: {}, fullPath: '/test1' }
      const next2 = vi.fn()

      vi.mocked(mockRouter.replace).mockClear()
      beforeEachCallback(to2, from2, next2)

      expect(mockRouter.replace).not.toHaveBeenCalled()
      expect(next2).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })
  })

  describe('afterEach navigation guard', () => {
    beforeEach(() => {
      createRouterInstance()
    })

    it('should set document title with translated titleKey', () => {
      vi.mocked(t).mockReturnValue('Translated Title')

      const to = { path: '/test', meta: { titleKey: 'test.title' } }

      afterEachCallback(to)

      expect(t).toHaveBeenCalledWith('test.title')
      expect(document.title).toBe('Translated Title · Quasar')
    })

    it('should set base title when titleKey is not defined', () => {
      const to = { path: '/test', meta: {} }

      afterEachCallback(to)

      expect(document.title).toBe('Quasar')
    })

    it('should handle empty meta object', () => {
      const to = { path: '/test', meta: {} }

      afterEachCallback(to)

      expect(document.title).toBe('Quasar')
      expect(t).not.toHaveBeenCalled()
    })
  })

  describe('Router return value', () => {
    it('should return configured router instance', () => {
      const router = createRouterInstance()

      expect(router).toBe(mockRouter)
      expect(mockRouter.beforeEach).toHaveBeenCalled()
      expect(mockRouter.afterEach).toHaveBeenCalled()
    })
  })
})
