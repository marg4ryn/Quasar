import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useNewAnalysisStore = defineStore('newAnalysis', () => {
  const link = ref(localStorage.getItem('link') || '')
  const fromDate = ref(localStorage.getItem('fromDate') || '')
  const toDate = ref(localStorage.getItem('toDate') || '')

  function setLink(newLink: string) {
    link.value = newLink
  }

  function setFromDate(from: string) {
    fromDate.value = from
  }

  function setToDate(to: string) {
    toDate.value = to
  }

  watch(link, (value) => {
    localStorage.setItem('link', value)
  })

  watch(fromDate, (value) => {
    localStorage.setItem('fromDate', value)
  })

  watch(toDate, (value) => {
    localStorage.setItem('toDate', value)
  })

  return {
    link,
    fromDate,
    toDate,
    setLink,
    setFromDate,
    setToDate,
  }
})
