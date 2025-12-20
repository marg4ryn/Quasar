import { createI18n } from 'vue-i18n'

export const supportedLanguages = ['pl', 'en'] as const
export type Lang = (typeof supportedLanguages)[number]

export const getUserLanguage = (): Lang => {
  const lang = navigator.language.split('-')[0]
  return supportedLanguages.includes(lang as Lang) ? (lang as Lang) : 'en'
}

interface LocaleModule {
  default: Record<string, unknown>
}

interface Messages {
  [locale: string]: {
    [namespace: string]: Record<string, unknown>
  }
}

// function loadLocaleMessages(): Messages {
//   const locales = import.meta.glob<LocaleModule>('@/locales/*/*.json', {
//     eager: true,
//     import: 'default',
//   })
//   const messages: Messages = {}

//   for (const path in locales) {
//     const match = path.match(/locales\/(\w+)\/(\w+)\.json$/)
//     if (match) {
//       const [, lang, file] = match

//       if (!messages[lang]) {
//         messages[lang] = {}
//       }

//       messages[lang][file] = locales[path].default
//     }
//   }

//   return messages
// }

function loadLocaleMessages(): Record<string, Record<string, unknown>> {
  const locales = import.meta.glob<LocaleModule>('../locales/*/*.json', {
    eager: true,
    import: 'default',
  })
  const messages: Record<string, Record<string, unknown>> = {}

  for (const path in locales) {
    const match = path.match(/locales\/(\w+)\/(\w+)\.json$/)
    if (match) {
      const [, lang, file] = match
      messages[lang] ??= {}

      // Merguj zawartość pliku bezpośrednio do języka (bez namespace)
      Object.assign(messages[lang], locales[path])
    }
  }

  return messages
}

export const i18n = createI18n({
  legacy: false,
  locale: getUserLanguage(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
})

export const t = (key: string) => i18n.global.t(key)
export const getLocale = () => i18n.global.locale.value
export const setLocale = (lang: Lang) => {
  i18n.global.locale.value = lang
}
