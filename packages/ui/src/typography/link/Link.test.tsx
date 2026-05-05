import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Link } from './Link'
import { linkBase, linkSizeResponsive } from './Link.css'

describe('Link', () => {
  it('applies container-query responsive size classes', () => {
    render(
      <div style={{ containerType: 'inline-size' }}>
        <Link href="#" size={{ initial: 'sm', md: 'xl' }}>
          Docs
        </Link>
      </div>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toBeInTheDocument()
    expect(link.className).toContain(linkBase)
    expect(link.className).toContain(linkSizeResponsive.md.xl)
  })
})
