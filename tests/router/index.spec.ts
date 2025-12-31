import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import {
  createRouter,
  createWebHistory,
  Router,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router'
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
vi.mock('@/views/common/RepositoryOverviewPage.vue', () => ({
  default: { name: 'RepositoryOverviewPage' },
}))

interface MockUIStore {
  isNavBarVisible: boolean
  isAppBarVisible: boolean
}

interface MockRouter extends Partial<Router> {
  beforeEach: Mock
  afterEach: Mock
  replace: Mock
  push: Mock
}

type BeforeEachCallback = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => void

type AfterEachCallback = (to: RouteLocationNormalized, from?: RouteLocationNormalized) => void

describe('Router', () => {
  let mockRouter: MockRouter
  let mockUIStore: MockUIStore
  let beforeEachCallback: BeforeEachCallback
  let afterEachCallback: AfterEachCallback

  beforeEach(() => {
    vi.clearAllMocks()

    mockUIStore = {
      isNavBarVisible: true,
      isAppBarVisible: true,
    }

    vi.mocked(useUIStore).mockReturnValue(mockUIStore as ReturnType<typeof useUIStore>)

    mockRouter = {
      beforeEach: vi.fn((callback: BeforeEachCallback) => {
        beforeEachCallback = callback
      }),
      afterEach: vi.fn((callback: AfterEachCallback) => {
        afterEachCallback = callback
      }),
      replace: vi.fn().mockResolvedValue(undefined),
      push: vi.fn().mockResolvedValue(undefined),
    }

    vi.mocked(createRouter).mockReturnValue(mockRouter as Router)
    vi.mocked(createWebHistory).mockReturnValue({} as ReturnType<typeof createWebHistory>)
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
      const welcomeRoute = createRouterCall.routes.find((r: RouteRecordRaw) => r.name === 'welcome')

      expect(welcomeRoute).toBeDefined()
      expect(welcomeRoute?.meta).toEqual({
        showNavBar: false,
        showAppBar: false,
      })
    })

    it('should have catch-all route that redirects to home', () => {
      createRouterInstance()

      const createRouterCall = vi.mocked(createRouter).mock.calls[0][0]
      const catchAllRoute = createRouterCall.routes.find(
        (r: RouteRecordRaw) => r.path === '/:pathMatch(.*)*'
      )

      expect(catchAllRoute).toBeDefined()
      expect(catchAllRoute?.redirect).toBe('/')
    })
  })

  describe('beforeEach navigation guard', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      createRouterInstance()
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('should update UI store when showNavBar meta is defined', () => {
      const to: Partial<RouteLocationNormalized> = {
        path: '/test',
        meta: { showNavBar: false },
        fullPath: '/test',
      }
      const from: Partial<RouteLocationNormalized> = {
        path: '/',
        meta: {},
        fullPath: '/',
      }
      const next = vi.fn()

      beforeEachCallback(to as RouteLocationNormalized, from as RouteLocationNormalized, next)

      expect(mockUIStore.isNavBarVisible).toBe(false)
      expect(next).toHaveBeenCalled()
    })

    it('should not update UI store when meta is undefined', () => {
      const originalNavBar = mockUIStore.isNavBarVisible
      const originalAppBar = mockUIStore.isAppBarVisible

      const to: Partial<RouteLocationNormalized> = {
        path: '/test',
        meta: {},
        fullPath: '/test',
      }
      const from: Partial<RouteLocationNormalized> = {
        path: '/',
        meta: {},
        fullPath: '/',
      }
      const next = vi.fn()

      beforeEachCallback(to as RouteLocationNormalized, from as RouteLocationNormalized, next)

      expect(mockUIStore.isNavBarVisible).toBe(originalNavBar)
      expect(mockUIStore.isAppBarVisible).toBe(originalAppBar)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('afterEach navigation guard', () => {
    beforeEach(() => {
      createRouterInstance()
    })

    it('should set document title with translated titleKey', () => {
      vi.mocked(t).mockReturnValue('Translated Title')

      const to: Partial<RouteLocationNormalized> = {
        path: '/test',
        meta: { titleKey: 'test.title' },
      }

      afterEachCallback(to as RouteLocationNormalized)

      expect(t).toHaveBeenCalledWith('test.title')
      expect(document.title).toBe('Translated Title · Quasar')
    })

    it('should set base title when titleKey is not defined', () => {
      const to: Partial<RouteLocationNormalized> = {
        path: '/test',
        meta: {},
      }

      afterEachCallback(to as RouteLocationNormalized)

      expect(document.title).toBe('Quasar')
    })

    it('should handle empty meta object', () => {
      const to: Partial<RouteLocationNormalized> = {
        path: '/test',
        meta: {},
      }

      afterEachCallback(to as RouteLocationNormalized)

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
