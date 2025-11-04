import { createRouter, createWebHistory, Router } from 'vue-router'
import { i18n } from '@/i18n'
import { useUIStore } from '@/stores/uiStore'

const Welcome = () => import('@/views/miscellaneous/WelcomePage.vue')
const Settings = () => import('@/views/miscellaneous/SettingsPage.vue')
const About = () => import('@/views/miscellaneous/AboutPage.vue')
const Attributions = () => import('@/views/miscellaneous/AttributionsPage.vue')
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

const DeveloperMapping = () => import('@/views/mappings/DeveloperMappingPage.vue')
const TeamMapping = () => import('@/views/mappings/TeamMappingPage.vue')
const FolderMapping = () => import('@/views/mappings/FolderMappingPage.vue')
const FormerDevsMapping = () => import('@/views/mappings/FormerDevsMappingPage.vue')
const IgnoredFilesMapping = () => import('@/views/mappings/IgnoredFilesMappingPage.vue')
const IgnoredFoldersMapping = () => import('@/views/mappings/IgnoredFoldersMappingPage.vue')

export default function (): Router {
  const { t } = i18n.global

  const routes = [
    {
      path: '/',
      name: 'welcome',
      meta: {
        showNavBar: true,
      },
      component: Welcome,
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        title: t('title.settings'),
        showNavBar: false,
      },
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        title: t('title.about'),
        showNavBar: true,
      },
      component: About,
    },
    {
      path: '/attributions',
      name: 'attributions',
      meta: {
        title: t('title.attributions'),
        showNavBar: true,
      },
      component: Attributions,
    },
    {
      path: '/system-overview',
      name: 'system-overview',
      meta: {
        title: t('title.system-overview'),
        showNavBar: true,
      },
      component: SystemOverview,
    },

    {
      path: '/technical-sprawl',
      name: 'technical-sprawl',
      meta: {
        title: t('title.technical-sprawl'),
        showNavBar: true,
      },
      component: TechnicalSprawl,
    },
    {
      path: '/hotspots',
      name: 'hotspots',
      meta: {
        title: t('title.hotspots'),
        showNavBar: true,
      },
      component: Hotspots,
    },
    {
      path: '/complexity-trends',
      name: 'complexity-trends',
      meta: {
        title: t('title.complexity-trends'),
        showNavBar: true,
      },
      component: ComplexityTrends,
    },
    {
      path: '/code-age',
      name: 'code-age',
      meta: {
        title: t('title.code-age'),
        showNavBar: true,
      },
      component: CodeAge,
    },
    {
      path: '/change-coupling',
      name: 'change-coupling',
      meta: {
        title: t('title.change-coupling'),
        showNavBar: true,
      },
      component: ChangeCoupling,
    },
    {
      path: '/developer-view',
      name: 'developer-view',
      meta: {
        title: t('title.developer-view'),
        showNavBar: true,
      },
      component: DeveloperView,
    },
    {
      path: '/team-view',
      name: 'team-view',
      meta: {
        title: t('title.team-view'),
        showNavBar: true,
      },
      component: TeamView,
    },
    {
      path: '/abandoned-code',
      name: 'abandoned-code',
      meta: {
        title: t('title.abandoned-code'),
        showNavBar: true,
      },
      component: AbandonedCode,
    },
    {
      path: '/responsibility-diffusion',
      name: 'responsibility-diffusion',
      meta: {
        title: t('title.responsibility-diffusion'),
        showNavBar: true,
      },
      component: ResponsibilityDiffusion,
    },

    {
      path: '/developer-relationships',
      name: 'developer-relationships',
      meta: {
        title: t('title.developer-relationships'),
        showNavBar: true,
      },
      component: DeveloperRelationships,
    },

    {
      path: '/developer-mapping',
      name: 'developer-mapping',
      meta: {
        title: t('title.developer-mapping'),
        showNavBar: true,
      },
      component: DeveloperMapping,
    },
    {
      path: '/team-mapping',
      name: 'team-mapping',
      meta: {
        title: t('title.team-mapping'),
        showNavBar: true,
      },
      component: TeamMapping,
    },
    {
      path: '/folder-mapping',
      name: 'folder-mapping',
      meta: {
        title: t('title.folder-mapping'),
        showNavBar: true,
      },
      component: FolderMapping,
    },
    {
      path: '/former-developers-mapping',
      name: 'former-developers-mapping',
      meta: {
        title: t('title.former-developers-mapping'),
        showNavBar: true,
      },
      component: FormerDevsMapping,
    },
    {
      path: '/ignored-files-mapping',
      name: 'ignored-files-mapping',
      meta: {
        title: t('title.ignored-files-mapping'),
        showNavBar: true,
      },
      component: IgnoredFilesMapping,
    },
    {
      path: '/ignored-folders-mapping',
      name: 'ignored-folders-mapping',
      meta: {
        title: t('title.ignored-folders-mapping'),
        showNavBar: true,
      },
      component: IgnoredFoldersMapping,
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

    const baseTitle = 'HotSpotter'
    const newTitle = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle
    document.title = newTitle

    if (typeof to.meta.showNavBar === 'boolean') {
      uiStore.isNavBarVisible = to.meta.showNavBar
    } else {
      uiStore.isNavBarVisible = true
    }

    next()
  })

  return router
}
