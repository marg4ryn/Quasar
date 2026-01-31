import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const DEFAULT_VALUES = {
  link: '',
  fromDate: '2000-01-01',
  toDate: new Date().toISOString().split('T')[0],
} as const

export const useNewAnalysisStore = defineStore('newAnalysis', () => {
  const stored = JSON.parse(localStorage.getItem('newAnalysis') || '{}')

  const link = ref(stored.link || DEFAULT_VALUES.link)
  const fromDate = ref(stored.fromDate || DEFAULT_VALUES.fromDate)
  const toDate = ref(stored.toDate || DEFAULT_VALUES.toDate)

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

  function reset() {
    link.value = DEFAULT_VALUES.link
    fromDate.value = DEFAULT_VALUES.fromDate
    toDate.value = DEFAULT_VALUES.toDate
  }

  return {
    link,
    fromDate,
    toDate,
    setLink,
    setFromDate,
    setToDate,
    reset,
  }
})
