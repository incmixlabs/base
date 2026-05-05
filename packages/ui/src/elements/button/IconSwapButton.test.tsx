import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IconSwapButton } from './IconSwapButton'

afterEach(() => {
  cleanup()
})

describe('IconSwapButton', () => {
  function getSwapRotator() {
    const rotator = screen.getByRole('button', { name: 'Theme toggle' }).querySelector('[data-icon-swap-rotator]')

    if (!(rotator instanceof HTMLElement)) {
      throw new Error('Expected IconSwapButton to render an icon swap rotator')
    }

    return rotator
  }

  it('calls onToggle with the other icon value when clicked', () => {
    const onToggle = vi.fn()

    render(<IconSwapButton icons={['sun', 'moon'] as const} value="sun" onToggle={onToggle} title="Theme toggle" />)

    fireEvent.click(screen.getByRole('button', { name: 'Theme toggle' }))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('moon', expect.any(Object))
  })

  it('marks the second icon state as pressed', () => {
    render(<IconSwapButton icons={['sun', 'moon'] as const} value="moon" onToggle={() => {}} title="Theme toggle" />)

    expect(screen.getByRole('button', { name: 'Theme toggle' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('rotates the stable icon wrapper when the icon value changes', () => {
    const { rerender } = render(
      <IconSwapButton icons={['sun', 'moon'] as const} value="sun" onToggle={() => {}} title="Theme toggle" />,
    )
    const rotator = getSwapRotator()

    expect(rotator).toHaveAttribute('data-icon-swap-icon', 'sun')
    expect(rotator).not.toHaveAttribute('data-icon-swap-motion')

    rerender(<IconSwapButton icons={['sun', 'moon'] as const} value="moon" onToggle={() => {}} title="Theme toggle" />)

    const nextRotator = getSwapRotator()
    expect(nextRotator).toBe(rotator)
    expect(nextRotator).toHaveAttribute('data-icon-swap-icon', 'moon')
    expect(nextRotator).toHaveAttribute('data-icon-swap-motion', 'forward')
    expect(nextRotator.getAttribute('style') ?? '').not.toContain('rotate(180deg)')
  })
})
