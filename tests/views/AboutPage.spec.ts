import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AboutPage from '@/views/common/AboutPage.vue'

describe('AboutPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('renders correctly', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('includes a link to GitHub', () => {
    const wrapper = mount(AboutPage)
    const link = wrapper.find('a[href*="github.com"]')

    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://github.com/Vixoner')
  })

  it('external links open in a new tab', () => {
    const wrapper = mount(AboutPage)
    const externalLinks = wrapper.findAll('a[href^="http"]')

    externalLinks.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
    })
  })
})
