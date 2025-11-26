import { createRouter, createWebHistory, Router } from 'vue-router'
import { i18n } from '@/i18n'
import { useUIStore } from '@/stores/uiStore'

const Welcome = () => import('@/views/miscellaneous/WelcomePage.vue')
const Settings = () => import('@/views/miscellaneous/SettingsPage.vue')
const About = () => import('@/views/miscellaneous/AboutPage.vue')
const RepositoryOverview = () => import('@/views/miscellaneous/RepositoryOverviewPage.vue')
const DevelopersList = () => import('@/views/miscellaneous/DevelopersListPage.vue')

const DeveloperRelationships = () => import('@/views/relationships/DeveloperRelationshipsPage.vue')

const FileExtensions = () => import('@/views/cities/FileExtensionsPage.vue')
const Hotspots = () => import('@/views/cities/HotspotsPage.vue')
const CodeAge = () => import('@/views/cities/CodeAgePage.vue')
const FilesCoupling = () => import('@/views/cities/FilesCouplingPage.vue')
const LeadDevelopers = () => import('@/views/cities/LeadDevelopersPage.vue')
const AbandonedCode = () => import('@/views/cities/AbandonedCodePage.vue')
const KnowledgeRisks = () => import('@/views/cities/KnowledgeRisksPage.vue')

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
