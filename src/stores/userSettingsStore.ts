import { defineStore } from 'pinia'
import { ref, watch, nextTick } from 'vue'
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
  const selectedColor = ref<'#bc1922' | '#28abf2'>(getStorageItem('selectedColor', '#bc1922'))
  const selectedLanguage = ref<'en' | 'pl' | 'system'>(getStorageItem('selectedLanguage', 'system'))
  const isGradientOn = ref<'on' | 'off'>(getStorageItem('isGradientOn', 'on'))
  const isAutoRotateOn = ref(getStorageItem('isAutoRotateOn', true))
  const colorPrimary = ref('')

  async function applyColor(color: string) {
    document.documentElement.style.setProperty('--color-primary', color)

    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (favicon) {
      favicon.href = color === '#28abf2' ? '/logo_blue.png' : '/logo_red.png'
    }
    await nextTick()
    colorPrimary.value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim()
  }

  function applyLanguage(language: 'pl' | 'en' | 'system'): void {
    const lang: Lang = language === 'system' ? getUserLanguage() : language
    setLocale(lang)
    document.documentElement.setAttribute('lang', lang)
  }

  applyColor(selectedColor.value)
  applyLanguage(selectedLanguage.value)
  document.documentElement.setAttribute('data-theme', 'dark')

  watch(selectedColor, (value) => {
    setStorageItem('selectedColor', value)
    applyColor(value)
  })

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
