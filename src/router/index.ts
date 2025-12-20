import { createRouter, createWebHistory, Router } from 'vue-router'
import { i18n } from '@/plugins/i18n'
import { useUIStore } from '@/stores/uiStore'

const Welcome = () => import('@/views/common/WelcomePage.vue')
const Settings = () => import('@/views/common/SettingsPage.vue')
const About = () => import('@/views/common/AboutPage.vue')
const AnalysisHistory = () => import('@/views/common/AnalysisHistoryPage.vue')
const RepositoryOverview = () => import('@/views/common/RepositoryOverviewPage.vue')
const DevelopersList = () => import('@/views/common/DevelopersListPage.vue')
const XRayAnalysis = () => import('@/views/common/XRayAnalysisPage.vue')
const DeveloperRelationships = () => import('@/views/common/DeveloperRelationshipsPage.vue')

const FileExtensions = () => import('@/views/cities/FileExtensionsPage.vue')
const Hotspots = () => import('@/views/cities/HotspotsPage.vue')
const CodeAge = () => import('@/views/cities/CodeAgePage.vue')
const FilesCoupling = () => import('@/views/cities/FilesCouplingPage.vue')
const LeadDevelopers = () => import('@/views/cities/LeadDevelopersPage.vue')
const AbandonedCode = () => import('@/views/cities/AbandonedCodePage.vue')
const KnowledgeRisks = () => import('@/views/cities/KnowledgeRisksPage.vue')

const Login = () => import('@/views/auth/LoginPage.vue')
const Register = () => import('@/views/auth/RegisterPage.vue')
const LoginSuccess = () => import('@/views/auth/LoginSuccessPage.vue')

export default function (): Router {
  const routes = [
    {
      path: '/',
      name: 'welcome',
      meta: {
        showNavBar: false,
        showAppBar: false,
      },
      component: Welcome,
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        titleKey: 'title.settings',
        showNavBar: false,
      },
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        titleKey: 'title.about',
        showNavBar: false,
      },
      component: About,
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        titleKey: 'title.login',
        showNavBar: false,
      },
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        titleKey: 'title.register',
        showNavBar: false,
      },
      component: Register,
    },
    {
      path: '/login/success',
      name: 'login-success',
      meta: {
        titleKey: 'title.login',
        showNavBar: false,
      },
      component: LoginSuccess,
    },
    {
      path: '/analysis-history',
      name: 'analysis-history',
      meta: {
        titleKey: 'title.analysis-history',
        showNavBar: false,
      },
      component: AnalysisHistory,
    },
    {
      path: '/repository-overview',
      name: 'repository-overview',
      meta: {
        titleKey: 'title.repository-overview',
        showNavBar: true,
        showAppBar: true,
      },
      component: RepositoryOverview,
    },
    {
      path: '/developers-list',
      name: 'developers-list',
      meta: {
        titleKey: 'title.developers-list',
        showNavBar: true,
        showAppBar: true,
      },
      component: DevelopersList,
    },
    {
      path: '/xray-analysis',
      name: 'xray-analysis',
      meta: {
        titleKey: 'title.xray-analysis',
        showNavBar: true,
        showAppBar: true,
      },
      component: XRayAnalysis,
    },

    {
      path: '/file-extensions',
      name: 'file-extensions',
      meta: {
        titleKey: 'title.file-extensions',
        showNavBar: true,
        showAppBar: true,
      },
      component: FileExtensions,
    },
    {
      path: '/hotspots',
      name: 'hotspots',
      meta: {
        titleKey: 'title.hotspots',
        showNavBar: true,
        showAppBar: true,
      },
      component: Hotspots,
    },
    {
      path: '/code-age',
      name: 'code-age',
      meta: {
        titleKey: 'title.code-age',
        showNavBar: true,
        showAppBar: true,
      },
      component: CodeAge,
    },
    {
      path: '/files-coupling',
      name: 'files-coupling',
      meta: {
        titleKey: 'title.files-coupling',
        showNavBar: true,
        showAppBar: true,
      },
      component: FilesCoupling,
    },
    {
      path: '/lead-developers',
      name: 'lead-developers',
      meta: {
        titleKey: 'title.lead-developers',
        showNavBar: true,
        showAppBar: true,
      },
      component: LeadDevelopers,
    },
    {
      path: '/abandoned-code',
      name: 'abandoned-code',
      meta: {
        titleKey: 'title.abandoned-code',
        showNavBar: true,
        showAppBar: true,
      },
      component: AbandonedCode,
    },
    {
      path: '/knowledge-risks',
      name: 'knowledge-risks',
      meta: {
        titleKey: 'title.knowledge-risks',
        showNavBar: true,
        showAppBar: true,
      },
      component: KnowledgeRisks,
    },

    {
      path: '/developer-relationships',
      name: 'developer-relationships',
      meta: {
        titleKey: 'title.developer-relationships',
        showNavBar: true,
        showAppBar: true,
      },
      component: DeveloperRelationships,
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ]

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  })

  router.beforeEach((to, from, next) => {
    const uiStore = useUIStore()

    if (typeof to.meta.showNavBar === 'boolean') {
      uiStore.isNavBarVisible = to.meta.showNavBar
    } else {
      uiStore.isNavBarVisible = true
    }

    if (typeof to.meta.showAppBar === 'boolean') {
      uiStore.isAppBarVisible = to.meta.showAppBar
    }

    next()
  })

  router.afterEach((to) => {
    const { t } = i18n.global

    const baseTitle = 'Quasar'
    const titleKey = to.meta.titleKey as string | undefined

    if (titleKey) {
      const newTitle = `${t(titleKey)} - ${baseTitle}`
      document.title = newTitle
    } else {
      document.title = baseTitle
    }
  })

  return router
}
