import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Link } from './Link'
import { linkBase, linkSizeResponsive } from './link.class'
import { linkPropDefs } from './link.props'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

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

  it('keeps underline hover scoped to hover-capable devices', () => {
    const { getByRole } = render(
      <Link href="#" underline="hover">
        Hover docs
      </Link>,
    )

    const link = getByRole('link', { name: 'Hover docs' })
    expectClassTokens(link.className, ['[@media_(hover:_hover)]:hover:underline'])
  })

  it('keeps color hover disabled-safe', () => {
    const { getByRole } = render(
      <Link href="#" color="primary">
        Primary docs
      </Link>,
    )

    const link = getByRole('link', { name: 'Primary docs' })
    expectClassTokens(link.className, [
      '[&:hover:not(:disabled)]:text-[var(--color-primary-solid)]',
      '[&:hover:not(:disabled)]:[text-decoration-color:var(--color-primary-solid)]',
    ])
  })
})
