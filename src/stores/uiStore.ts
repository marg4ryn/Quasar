import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isNavBarVisible = ref(localStorage.getItem('isNavBarVisible') === 'true')
  const isAppBarVisible = ref(localStorage.getItem('isAppBarVisible') === 'true')

  watch(isNavBarVisible, (value) => {
    localStorage.setItem('isNavBarVisible', String(value))
  })

  watch(isAppBarVisible, (value) => {
    localStorage.setItem('isAppBarVisible', String(value))
  })

  function setIsNavBarVisible(value: boolean) {
    isNavBarVisible.value = value
  }

  function setIsAppBarVisible(value: boolean) {
    isAppBarVisible.value = value
  }

  return {
    isNavBarVisible,
    isAppBarVisible,
    setIsNavBarVisible,
    setIsAppBarVisible,
  }
})
