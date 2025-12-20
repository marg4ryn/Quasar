import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { setLocale, getUserLanguage, type Lang } from '@/plugins/i18n'

function getStorageItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key)
  if (!item) return defaultValue

  try {
    return JSON.parse(item) as T
  } catch {
    return item as T
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof value === 'string') {
    localStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const useUserSettingsStore = defineStore('userSettings', () => {
  const selectedColor = ref('#f593e3')
  const selectedLanguage = ref<'en' | 'pl' | 'system'>(getStorageItem('selectedLanguage', 'system'))
  const isGradientOn = ref<'on' | 'off'>(getStorageItem('isGradientOn', 'on'))
  const isAutoRotateOn = ref(getStorageItem('isAutoRotateOn', true))
  const colorPrimary = ref('')

  function applyLanguage(language: 'pl' | 'en' | 'system'): void {
    const lang: Lang = language === 'system' ? getUserLanguage() : language
    setLocale(lang)
    document.documentElement.setAttribute('lang', lang)
  }

  applyLanguage(selectedLanguage.value)
  document.documentElement.setAttribute('data-theme', 'dark')

  watch(selectedLanguage, (value) => {
    setStorageItem('selectedLanguage', value)
    applyLanguage(value)
  })

  watch(isGradientOn, (value) => {
    setStorageItem('isGradientOn', value)
  })

  watch(isAutoRotateOn, (value) => {
    setStorageItem('isAutoRotateOn', value)
  })

  return {
    selectedColor,
    selectedLanguage,
    isGradientOn,
    isAutoRotateOn,
    colorPrimary,
  }
})
