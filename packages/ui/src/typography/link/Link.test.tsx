import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Link } from './Link'
import { linkBase, linkSizeResponsive } from './link.class'
import { linkPropDefs } from './link.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Link', () => {
  it('applies container-query responsive size classes', () => {
    const initialSize = expectPropValue(getPropDefValues(linkPropDefs.size), 'sm')
    const responsiveSize = expectPropValue(getPropDefValues(linkPropDefs.size), 'xl')

    render(
      <div style={{ containerType: 'inline-size' }}>
        <Link href="#" size={{ initial: initialSize, md: responsiveSize }}>
          Docs
        </Link>
      </div>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toBeInTheDocument()
    expect(link.className).toContain(linkBase)
    expect(link.className).toContain(linkSizeResponsive.md[responsiveSize])
  })
})
