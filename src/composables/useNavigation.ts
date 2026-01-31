import { useRouter } from 'vue-router'
import { useAnalysisStore } from '@/stores/analysisStore'

export function useNavigation() {
  const router = useRouter()
  const store = useAnalysisStore()

  const navigateTo = (path: string) => {
    if (!store.analysisId) {
      console.error('No analysisId in store')
      return
    }
    router.push(`/${store.analysisId}${path}`)
  }

  return { navigateTo }
}
