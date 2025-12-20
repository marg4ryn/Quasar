import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import pl from '@/locales/pl.json'

export const supportedLanguages = ['pl', 'en'] as const
export type Lang = (typeof supportedLanguages)[number]

export const getUserLanguage = (): Lang => {
  const lang = navigator.language.split('-')[0]
  return supportedLanguages.includes(lang as Lang) ? (lang as Lang) : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getUserLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    pl,
  },
})

export const t = (key: string) => i18n.global.t(key)
export const getLocale = () => i18n.global.locale.value
export const setLocale = (lang: Lang) => {
  i18n.global.locale.value = lang
}
