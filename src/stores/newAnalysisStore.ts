import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useNewAnalysisStore = defineStore('newAnalysis', () => {
  const stored = JSON.parse(localStorage.getItem('newAnalysis') || '{}')

  const link = ref(stored.link || '')
  const fromDate = ref(stored.fromDate || '')
  const toDate = ref(stored.toDate || '')

  watch([link, fromDate, toDate], () => {
    localStorage.setItem(
      'newAnalysis',
      JSON.stringify({
        link: link.value,
        fromDate: fromDate.value,
        toDate: toDate.value,
      })
    )
  })

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
