import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatDaysOnly, formatDaysSince } from '@/utils/dateFormatter'
import { setLocale } from '@/plugins/i18n'

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('formats the date in English', () => {
      setLocale('en')

      const result = formatDate('2024-12-19')

      expect(result).toBe('December 19, 2024')
    })

    it('formats the date in Polish', () => {
      setLocale('pl')

      const result = formatDate('2024-12-19')

      expect(result).toBe('19 grudnia 2024')
    })

    it('accepts a Date object', () => {
      setLocale('en')

      const result = formatDate(new Date('2024-12-19'))

      expect(result).toContain('December')
    })
  })

  describe('formatDateTime', () => {
    it('formats the date and time in English', () => {
      setLocale('en')

      const result = formatDateTime('2024-12-19T15:30:45')

      expect(result).toContain('December 19, 2024')
      expect(result).toContain('15:30:45')
    })

    it('formats the date and time in Polish', () => {
      setLocale('pl')

      const result = formatDateTime('2024-12-19T15:30:45')

      expect(result).toContain('grudnia')
      expect(result).toContain('15:30:45')
    })
  })

  describe('formatDaysOnly', () => {
    it('returns "today" for 0 days in English', () => {
      setLocale('en')

      const result = formatDaysOnly(0)

      expect(result).toBe('today')
    })

    it('returns "dzisiaj" for 0 days in Polish', () => {
      setLocale('pl')

      const result = formatDaysOnly(0)

      expect(result).toBe('dzisiaj')
    })

    it('formats 1 day correctly in English', () => {
      setLocale('en')

      const result = formatDaysOnly(1)

      expect(result).toBe('1 day ago')
    })

    it('formats 1 day correctly in Polish', () => {
      setLocale('pl')

      const result = formatDaysOnly(1)

      expect(result).toBe('1 dzień temu')
    })

    it('formats multiple days in English', () => {
      setLocale('en')

      const result = formatDaysOnly(5)

      expect(result).toBe('5 days ago')
    })

    it('formats multiple days in Polish', () => {
      setLocale('pl')

      const result = formatDaysOnly(5)

      expect(result).toBe('5 dni temu')
    })
  })

  describe('formatDaysSince', () => {
    it('returns "today" for 0 days in English', () => {
      setLocale('en')

      const result = formatDaysSince(0)

      expect(result).toBe('today')
    })

    it('returns "dzisiaj" for 0 days in Polish', () => {
      setLocale('pl')

      const result = formatDaysSince(0)

      expect(result).toBe('dzisiaj')
    })

    it('returns "yesterday" for 1 day in English', () => {
      setLocale('en')

      const result = formatDaysSince(1)

      expect(result).toBe('yesterday')
    })

    it('returns "wczoraj" for 1 day in Polish', () => {
      setLocale('pl')

      const result = formatDaysSince(1)

      expect(result).toBe('wczoraj')
    })

    it('formats days for 2-6 days', () => {
      setLocale('en')

      const result = formatDaysSince(5)

      expect(result).toBe('5 days ago')
    })

    it('formats weeks for 7-29 days', () => {
      setLocale('en')

      const result = formatDaysSince(16)

      expect(result).toBe('2 weeks ago')
    })

    it('formats 1 week correctly', () => {
      setLocale('en')

      const result = formatDaysSince(7)

      expect(result).toBe('1 week ago')
    })

    it('formats months for 30-364 days', () => {
      setLocale('en')

      const result = formatDaysSince(65)

      expect(result).toBe('2 months ago')
    })

    it('formats years for 365+ days', () => {
      setLocale('en')

      const result = formatDaysSince(730)

      expect(result).toBe('2 years ago')
    })

    it('uses Polish plural forms correctly', () => {
      setLocale('pl')

      expect(formatDaysSince(2)).toBe('2 dni temu')
      expect(formatDaysSince(14)).toBe('2 tygodnie temu')
      expect(formatDaysSince(60)).toBe('2 miesiące temu')
      expect(formatDaysSince(150)).toBe('5 miesięcy temu')
      expect(formatDaysSince(730)).toBe('2 lata temu')
      expect(formatDaysSince(1825)).toBe('5 lat temu')
    })
  })
})
