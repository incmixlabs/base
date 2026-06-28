import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'
import { sectionByDisplay, sectionDisplayResponsive, sectionSizeResponsive } from './section.class'

describe('Section', () => {
  it('uses viewport responsive classes for size and display variants', () => {
    render(
      <Section size={{ initial: '1', md: '3' }} display={{ initial: 'initial', lg: 'none' }}>
        Content
      </Section>,
    )

    const section = screen.getByText('Content').closest('section')
    expect(section).toBeInTheDocument()
    expect(section?.className).toContain(sectionByDisplay.initial)
    expect(section?.className).toContain(sectionSizeResponsive.md['3'])
    expect(section?.className).toContain(sectionDisplayResponsive.lg.none)
  })

  it('uses display initial instead of block for responsive display restoration', () => {
    render(
      <Section display={{ initial: 'none', md: 'initial' }} data-testid="section">
        Content
      </Section>,
    )

    const section = screen.getByTestId('section')
    expect(section.className).toContain(sectionDisplayResponsive.md.initial)
    expect(section.className).not.toContain('md:block')
  })
})
