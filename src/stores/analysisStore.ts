import { defineStore } from 'pinia'
import { ref } from 'vue'

const ANALYSIS_ID_KEY = 'analysisId'

export const useAnalysisStore = defineStore('analysis', () => {
  const analysisId = ref<string | null>(localStorage.getItem(ANALYSIS_ID_KEY))

  function setAnalysisId(id: string | null) {
    analysisId.value = id

    if (id) {
      localStorage.setItem(ANALYSIS_ID_KEY, id)
    } else {
      localStorage.removeItem(ANALYSIS_ID_KEY)
    }
  }

  return { analysisId, setAnalysisId }
})
