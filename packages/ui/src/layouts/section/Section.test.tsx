import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'
import { sectionDisplayResponsive, sectionSizeResponsive } from './Section.css'

describe('Section', () => {
  it('uses container-query responsive classes for size and display variants', () => {
    render(
      <Section size={{ initial: '1', md: '3' }} display={{ initial: 'initial', lg: 'none' }}>
        Content
      </Section>,
    )

    const section = screen.getByText('Content').closest('section')
    expect(section).toBeInTheDocument()
    expect(section?.className).toContain(sectionSizeResponsive.md['3'])
    expect(section?.className).toContain(sectionDisplayResponsive.lg.none)
  })
})
