import { t, getLocale } from '@/plugins/i18n'

const getPolishPluralForm = (count: number): 'one' | 'few' | 'many' => {
  if (count === 1) return 'one'

  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return 'few'
  }

  return 'many'
}

export const formatDate = (date: Date | string): string => {
  const lang = getLocale()

  return new Date(date).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (date: Date | string): string => {
  const lang = getLocale()

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

export const formatDaysOnly = (days: number): string => {
  if (days === 0) {
    return t('dates.today')
  }

  if (days === 1) {
    return `1 ${t('dates.units.day.one')} ${t('dates.ago')}`
  }

  const form = getLocale() === 'pl' ? getPolishPluralForm(days) : 'other'
  const unit = t(`dates.units.day.${form}`)
  return `${days} ${unit} ${t('dates.ago')}`
}

export const formatDaysSince = (days: number): string => {
  if (days === 0) {
    return t('dates.today')
  }

  if (days === 1) {
    return t('dates.yesterday')
  }

  if (days < 7) {
    const form = getLocale() === 'pl' ? getPolishPluralForm(days) : 'other'
    const unit = t(`dates.units.day.${form}`)
    return `${days} ${unit} ${t('dates.ago')}`
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7)
    const form =
      getLocale() === 'pl'
        ? weeks === 1
          ? 'one'
          : getPolishPluralForm(weeks)
        : weeks === 1
          ? 'one'
          : 'other'
    const unit = t(`dates.units.week.${form}`)
    return `${weeks} ${unit} ${t('dates.ago')}`
  }

  if (days < 365) {
    const months = Math.floor(days / 30)
    const form =
      getLocale() === 'pl'
        ? months === 1
          ? 'one'
          : getPolishPluralForm(months)
        : months === 1
          ? 'one'
          : 'other'
    const unit = t(`dates.units.month.${form}`)
    return `${months} ${unit} ${t('dates.ago')}`
  }

  const years = Math.floor(days / 365)
  const form =
    getLocale() === 'pl'
      ? years === 1
        ? 'one'
        : getPolishPluralForm(years)
      : years === 1
        ? 'one'
        : 'other'
  const unit = t(`dates.units.year.${form}`)
  return `${years} ${unit} ${t('dates.ago')}`
}
