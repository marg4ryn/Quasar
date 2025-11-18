import { defineStore } from 'pinia'
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export const useUserSettingsStore = defineStore('userSettings', () => {
  const selectedColor = ref<'#bc1922' | '#28abf2'>(
    (localStorage.getItem('selectedColor') as '#bc1922' | '#28abf2') || '#bc1922'
  )

  const selectedTheme = ref<'light' | 'dark' | 'system'>(
    (localStorage.getItem('selectedTheme') as 'light' | 'dark' | 'system') || 'dark'
  )

  const selectedLanguage = ref<'en' | 'pl' | 'system'>(
    (localStorage.getItem('selectedLanguage') as 'en' | 'pl' | 'system') || 'system'
  )

  const isGradientOn = ref<'on' | 'off'>(
    (localStorage.getItem('isGradientOn') as 'on' | 'off') || 'on'
  )

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

  function setIsGradientOn(option: 'on' | 'off') {
    isGradientOn.value = option
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
      .getPropertyValue('--color-bg-secondary')
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
      localStorage.setItem('selectedColor', newColor)
      await applyMainColor(newColor)
    },
    { immediate: true }
  )

  watch(
    selectedTheme,
    async (newTheme) => {
      localStorage.setItem('selectedTheme', newTheme)
      await applyTheme(newTheme)
    },
    { immediate: true }
  )

  watch(
    selectedLanguage,
    (newLanguage) => {
      localStorage.setItem('selectedLanguage', newLanguage)
      applyLanguage(newLanguage)
    },
    { immediate: true }
  )

  watch(isGradientOn, (value) => {
    localStorage.setItem('isGradientOn', value)
  })

  return {
    selectedColor,
    selectedTheme,
    selectedLanguage,
    isGradientOn,
    setColor,
    setTheme,
    setLanguage,
    setIsGradientOn,
    colorPrimary,
    colorSecondary,
  }
})
