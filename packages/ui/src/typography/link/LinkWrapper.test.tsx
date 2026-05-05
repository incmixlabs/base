import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkWrapper } from './LinkWrapper'
import { linkWrapperGap, linkWrapperGapResponsive, linkWrapperInner, linkWrapperQueryHost } from './LinkWrapper.css'

describe('LinkWrapper', () => {
  it('uses a query host plus responsive gap classes when gap is responsive', () => {
    const { container } = render(
      <LinkWrapper
        data={[
          { id: 'one', label: 'One', href: '#' },
          { id: 'two', label: 'Two', href: '#' },
        ]}
        direction="row"
        gap={{ initial: '2', sm: '4' }}
      />,
    )

    const host = container.firstElementChild as HTMLDivElement | null
    const inner = host?.firstElementChild as HTMLDivElement | null

    expect(inner).toBeInstanceOf(HTMLDivElement)
    expect(host).toBeInstanceOf(HTMLDivElement)
    expect(host).toHaveClass(linkWrapperQueryHost)
    expect(inner).toHaveClass(linkWrapperInner, linkWrapperGap['2'], linkWrapperGapResponsive.sm['4'])
  })
})
