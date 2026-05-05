import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Kbd } from './Kbd'
import { kbdBySize, kbdSizeResponsive } from './Kbd.css'

describe('Kbd', () => {
  it('applies responsive size classes for container-query typography', () => {
    render(<Kbd size={{ initial: 'sm', md: 'xl' }}>⌘ K</Kbd>)

    const element = screen.getByText('⌘ K')
    expect(element).toHaveClass(kbdBySize.sm, kbdSizeResponsive.md.xl)
  })
})
