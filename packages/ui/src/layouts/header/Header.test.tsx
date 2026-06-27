import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Header } from './Header'
import { headerRoot, headerSticky } from './header.class'

afterEach(() => {
  cleanup()
})

describe('Header', () => {
  it('renders the utility-backed header surface and sticky state by default', () => {
    render(<Header data-testid="header" />)

    const header = screen.getByTestId('header')

    for (const className of [...headerRoot.split(/\s+/), ...headerSticky.split(/\s+/)]) {
      expect(header.className).toContain(className)
    }
    expect(header.className).not.toContain('af-header')
  })

  it('can render without sticky positioning', () => {
    render(<Header data-testid="header" sticky={false} />)

    const header = screen.getByTestId('header')

    expect(header.className).toContain(headerRoot.split(/\s+/)[0])
    expect(header.className).not.toContain('sticky')
    expect(header.className).not.toContain('top-0')
  })
})
