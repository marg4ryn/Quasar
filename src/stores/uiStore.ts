import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isNavBarVisible = ref(true)
  const showAnalysisTitle = ref(false)

  function setIsNavBarVisible(value: boolean) {
    isNavBarVisible.value = value
  }

  function setShowAnalysisTitle(value: boolean) {
    showAnalysisTitle.value = value
  }

  return {
    isNavBarVisible,
    showAnalysisTitle,
    setIsNavBarVisible,
    setShowAnalysisTitle,
  }
})
