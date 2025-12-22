import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import { t } from '@/plugins/i18n'
import { useUIStore } from '@/stores/uiStore'

const commonViews = {
  Welcome: () => import('@/views/common/WelcomePage.vue'),
  Settings: () => import('@/views/common/SettingsPage.vue'),
  About: () => import('@/views/common/AboutPage.vue'),
  AnalysisHistory: () => import('@/views/common/AnalysisHistoryPage.vue'),
  RepositoryOverview: () => import('@/views/common/RepositoryOverviewPage.vue'),
  DevelopersList: () => import('@/views/common/DevelopersListPage.vue'),
  XRayAnalysis: () => import('@/views/common/XRayAnalysisPage.vue'),
  DeveloperRelationships: () => import('@/views/common/DeveloperRelationshipsPage.vue'),
  LoadingScreen: () => import('@/views/common/LoadingPage.vue'),
}

const citiesViews = {
  FileExtensions: () => import('@/views/cities/FileExtensionsPage.vue'),
  Hotspots: () => import('@/views/cities/HotspotsPage.vue'),
  CodeAge: () => import('@/views/cities/CodeAgePage.vue'),
  FilesCoupling: () => import('@/views/cities/FilesCouplingPage.vue'),
  LeadDevelopers: () => import('@/views/cities/LeadDevelopersPage.vue'),
  AbandonedCode: () => import('@/views/cities/AbandonedCodePage.vue'),
  KnowledgeRisks: () => import('@/views/cities/KnowledgeRisksPage.vue'),
}

const authViews = {
  Login: () => import('@/views/auth/LoginPage.vue'),
  Register: () => import('@/views/auth/RegisterPage.vue'),
  LoginSuccess: () => import('@/views/auth/LoginSuccessPage.vue'),
}

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    showNavBar?: boolean
    showAppBar?: boolean
    skipHistory?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    component: commonViews.Welcome,
    meta: {
      showNavBar: false,
      showAppBar: false,
      skipHistory: false,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: commonViews.Settings,
    meta: {
      titleKey: 'title.settings',
      showNavBar: false,
      skipHistory: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: commonViews.About,
    meta: {
      titleKey: 'title.about',
      showNavBar: false,
      skipHistory: true,
    },
  },
  {
    path: '/loading',
    name: 'loading',
    component: commonViews.LoadingScreen,
    meta: {
      titleKey: 'title.loading',
      showNavBar: false,
      skipHistory: true,
    },
  },
  {
    path: '/analysis-history',
    name: 'analysis-history',
    component: commonViews.AnalysisHistory,
    meta: {
      titleKey: 'title.analysis-history',
      showNavBar: false,
      skipHistory: true,
    },
  },
  {
    path: '/repository-overview',
    name: 'repository-overview',
    component: commonViews.RepositoryOverview,
    meta: {
      titleKey: 'title.repository-overview',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/developers-list',
    name: 'developers-list',
    component: commonViews.DevelopersList,
    meta: {
      titleKey: 'title.developers-list',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/developer-relationships',
    name: 'developer-relationships',
    meta: {
      titleKey: 'title.developer-relationships',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
    component: commonViews.DeveloperRelationships,
  },
  {
    path: '/xray-analysis',
    name: 'xray-analysis',
    component: commonViews.XRayAnalysis,
    meta: {
      titleKey: 'title.xray-analysis',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/file-extensions',
    name: 'file-extensions',
    component: citiesViews.FileExtensions,
    meta: {
      titleKey: 'title.file-extensions',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/hotspots',
    name: 'hotspots',
    component: citiesViews.Hotspots,
    meta: {
      titleKey: 'title.hotspots',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/code-age',
    name: 'code-age',
    component: citiesViews.CodeAge,
    meta: {
      titleKey: 'title.code-age',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/files-coupling',
    name: 'files-coupling',
    component: citiesViews.FilesCoupling,
    meta: {
      titleKey: 'title.files-coupling',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/lead-developers',
    name: 'lead-developers',
    component: citiesViews.LeadDevelopers,
    meta: {
      titleKey: 'title.lead-developers',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/abandoned-code',
    name: 'abandoned-code',
    component: citiesViews.AbandonedCode,
    meta: {
      titleKey: 'title.abandoned-code',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/knowledge-risks',
    name: 'knowledge-risks',
    component: citiesViews.KnowledgeRisks,
    meta: {
      titleKey: 'title.knowledge-risks',
      showNavBar: true,
      showAppBar: true,
      skipHistory: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: authViews.Login,
    meta: {
      titleKey: 'title.login',
      showNavBar: false,
      showAppBAr: false,
      skipHistory: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: authViews.Register,
    meta: {
      titleKey: 'title.register',
      showNavBar: false,
      showAppBAr: false,
      skipHistory: true,
    },
  },
  {
    path: '/login/success',
    name: 'login-success',
    component: authViews.LoginSuccess,
    meta: {
      titleKey: 'title.login',
      showNavBar: false,
      showAppBAr: false,
      skipHistory: true,
    },
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export default function (): Router {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  })

  // Flaga do wykrywania czy nawigacja pochodzi z History API
  let isHistoryNavigation = false

  // Nasłuchuj na zmiany historii przeglądarki (back/forward)
  window.addEventListener('popstate', () => {
    isHistoryNavigation = true
  })

  // Zachowaj oryginalną metodę push
  const originalPush = router.push.bind(router)

  // Nadpisz push aby automatycznie używać replace dla skipHistory
  router.push = function (to) {
    const resolved = router.resolve(to)

    if (resolved.meta.skipHistory) {
      console.log('Auto-replacing (skipHistory):', resolved.path)
      return router.replace(to)
    }

    return originalPush(to)
  }

  router.beforeEach((to, from, next) => {
    const uiStore = useUIStore()

    uiStore.isNavBarVisible = to.meta.showNavBar ?? false
    uiStore.isAppBarVisible = to.meta.showAppBar ?? false

    console.log('Navigation [To:', to.path, 'From:', from.path, ']', {
      skipHistory: to.meta.skipHistory,
      isHistoryNav: isHistoryNavigation,
    })

    // Jeśli to nawigacja z History API (back/forward), tylko ją obsłuż
    if (isHistoryNavigation) {
      isHistoryNavigation = false
      next()
      return
    }

    next()
  })

  router.afterEach((to) => {
    const baseTitle = 'Quasar'
    document.title = to.meta.titleKey ? `${t(to.meta.titleKey)} - ${baseTitle}` : baseTitle
  })

  return router
}
