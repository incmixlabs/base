import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { expectClassTokens, expectNoClassTokens, splitClassNames } from '@/test/class-name-utils'
import { Header } from './Header'
import { headerRoot, headerSticky } from './header.class'

afterEach(() => {
  cleanup()
})

describe('Header', () => {
  it('renders the utility-backed header surface and sticky state by default', () => {
    render(<Header data-testid="header" />)

    const header = screen.getByTestId('header')

    expectClassTokens(header.className, [...splitClassNames(headerRoot), ...splitClassNames(headerSticky)])
    expectNoClassTokens(header.className, ['af-header'])
  })

  it('can render without sticky positioning', () => {
    render(<Header data-testid="header" sticky={false} />)

    const header = screen.getByTestId('header')

    expectClassTokens(header.className, splitClassNames(headerRoot))
    expectNoClassTokens(header.className, splitClassNames(headerSticky))
  })
})
