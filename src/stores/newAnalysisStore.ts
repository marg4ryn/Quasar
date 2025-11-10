import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewAnalysisStore = defineStore('newAnalysis', () => {
  const link = ref('')
  const fromDate = ref('')
  const toDate = ref('')

  function setLink(newLink: string) {
    link.value = newLink
  }

  function setFromDate(from: string) {
    fromDate.value = from
  }

  function setToDate(to: string) {
    toDate.value = to
  }

  return {
    link,
    fromDate,
    toDate,
    setLink,
    setFromDate,
    setToDate,
  }
})
