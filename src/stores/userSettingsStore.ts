import { defineStore } from 'pinia'
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export const useUserSettingsStore = defineStore('userSettings', () => {
  const selectedColor = ref<'#bc1922' | '#28abf2'>('#28abf2')
  const selectedTheme = ref<'light' | 'dark' | 'system'>('dark')
  const selectedLanguage = ref<'en' | 'pl' | 'system'>('system')

  const colorPrimary = ref('')
  const colorSecondary = ref('')

  const { locale } = useI18n()

  function setColor(color: '#bc1922' | '#28abf2') {
    selectedColor.value = color
  }

  function setTheme(theme: 'light' | 'dark' | 'system') {
    selectedTheme.value = theme
  }

  function setLanguage(language: 'pl' | 'en' | 'system') {
    selectedLanguage.value = language
  }

  async function applyMainColor(color: string) {
    document.documentElement.style.setProperty('--color-primary', color)

    const favicon = document.querySelector("link[rel='icon']")
    if (favicon) {
      switch (color) {
        case '#bc1922':
          favicon.setAttribute('href', `/logo_red.png`)
          break
        case '#28abf2':
          favicon.setAttribute('href', `/logo_blue.png`)
          break
        default:
          favicon.setAttribute('href', `/logo_red.png`)
      }
    }

    await nextTick()
    colorPrimary.value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim()
  }

  async function applyTheme(theme: 'light' | 'dark' | 'system') {
    let resolvedTheme = theme

    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme)

    await nextTick()
    colorPrimary.value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim()
    colorSecondary.value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-bg-primary')
      .trim()
  }

  function applyLanguage(language: 'pl' | 'en' | 'system') {
    let resolvedLang = language

    if (language === 'system') {
      const browserLang = navigator.language.startsWith('pl') ? 'pl' : 'en'
      resolvedLang = browserLang
    }

    locale.value = resolvedLang
    document.documentElement.setAttribute('lang', resolvedLang)
  }

  applyMainColor(selectedColor.value)
  applyTheme(selectedTheme.value)
  applyLanguage(selectedLanguage.value)

  watch(
    selectedColor,
    async (newColor) => {
      await applyMainColor(newColor)
    },
    { immediate: true }
  )

  watch(
    selectedTheme,
    async (newTheme) => {
      await applyTheme(newTheme)
    },
    { immediate: true }
  )

  watch(
    selectedLanguage,
    (newLanguage) => {
      applyLanguage(newLanguage)
    },
    { immediate: true }
  )

  return {
    selectedColor,
    selectedTheme,
    selectedLanguage,
    setColor,
    setTheme,
    setLanguage,
    colorPrimary,
    colorSecondary,
  }
})
