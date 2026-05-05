import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { headingBase, headingSizeResponsive } from '../typography.ve.css'
import { Heading } from './Heading'

describe('Heading', () => {
  it('applies container-query responsive size classes', () => {
    render(
      <div style={{ containerType: 'inline-size' }}>
        <Heading size={{ initial: 'lg', md: '3x' }}>Headline</Heading>
      </div>,
    )

    const heading = screen.getByText('Headline')
    expect(heading).toBeInTheDocument()
    expect(heading.className).toContain(headingBase)
    expect(heading.className).toContain(headingSizeResponsive.md['3x'])
  })
})
