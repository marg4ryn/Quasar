import { getUserLanguage } from '@/plugins/i18n'

export function useDateFormatter() {
  const formatDate = (date: Date | string): string => {
    const lang = getUserLanguage()

    return new Date(date).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: Date | string): string => {
    const lang = getUserLanguage()

    return new Date(date).toLocaleString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return { formatDate, formatDateTime }
}
