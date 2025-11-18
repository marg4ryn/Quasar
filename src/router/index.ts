import { createRouter, createWebHistory, Router } from 'vue-router'
import { i18n } from '@/i18n'
import { useUIStore } from '@/stores/uiStore'

const Welcome = () => import('@/views/miscellaneous/WelcomePage.vue')
const Settings = () => import('@/views/miscellaneous/SettingsPage.vue')
const About = () => import('@/views/miscellaneous/AboutPage.vue')
const SystemOverview = () => import('@/views/miscellaneous/SystemOverviewPage.vue')

const DeveloperRelationships = () => import('@/views/relationships/DeveloperRelationshipsPage.vue')

const TechnicalSprawl = () => import('@/views/cities/TechnicalSprawlPage.vue')
const Hotspots = () => import('@/views/cities/HotspotsPage.vue')
const ComplexityTrends = () => import('@/views/cities/ComplexityTrendsPage.vue')
const CodeAge = () => import('@/views/cities/CodeAgePage.vue')
const ChangeCoupling = () => import('@/views/cities/ChangeCouplingPage.vue')
const DeveloperView = () => import('@/views/cities/DeveloperViewPage.vue')
const TeamView = () => import('@/views/cities/TeamViewPage.vue')
const AbandonedCode = () => import('@/views/cities/AbandonedCodePage.vue')
const ResponsibilityDiffusion = () => import('@/views/cities/ResponsibilityDiffusionPage.vue')

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
      path: '/system-overview',
      name: 'system-overview',
      meta: {
        titleKey: 'title.system-overview',
        showNavBar: true,
        showAppBar: true,
      },
      component: SystemOverview,
    },

    {
      path: '/technical-sprawl',
      name: 'technical-sprawl',
      meta: {
        titleKey: 'title.technical-sprawl',
        showNavBar: true,
        showAppBar: true,
      },
      component: TechnicalSprawl,
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
      path: '/complexity-trends',
      name: 'complexity-trends',
      meta: {
        titleKey: 'title.complexity-trends',
        showNavBar: true,
        showAppBar: true,
      },
      component: ComplexityTrends,
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
      path: '/change-coupling',
      name: 'change-coupling',
      meta: {
        titleKey: 'title.change-coupling',
        showNavBar: true,
        showAppBar: true,
      },
      component: ChangeCoupling,
    },
    {
      path: '/developer-view',
      name: 'developer-view',
      meta: {
        titleKey: 'title.developer-view',
        showNavBar: true,
        showAppBar: true,
      },
      component: DeveloperView,
    },
    {
      path: '/team-view',
      name: 'team-view',
      meta: {
        titleKey: 'title.team-view',
        showNavBar: true,
        showAppBar: true,
      },
      component: TeamView,
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
      path: '/responsibility-diffusion',
      name: 'responsibility-diffusion',
      meta: {
        titleKey: 'title.responsibility-diffusion',
        showNavBar: true,
        showAppBar: true,
      },
      component: ResponsibilityDiffusion,
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

    const baseTitle = 'HotSpotter'
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
