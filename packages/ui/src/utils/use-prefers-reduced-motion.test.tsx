import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePrefersReducedMotion } from './use-prefers-reduced-motion'

const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia')

function restoreMatchMedia() {
  if (originalMatchMediaDescriptor) {
    Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor)
    return
  }

  Reflect.deleteProperty(window, 'matchMedia')
}

function mockReducedMotionPreference(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<() => void>()
  const matchMedia = vi.fn((query: string) => ({
    addEventListener: vi.fn((_event: 'change', callback: () => void) => {
      listeners.add(callback)
    }),
    addListener: vi.fn((callback: () => void) => {
      listeners.add(callback)
    }),
    dispatchEvent: vi.fn(),
    get matches() {
      return matches
    },
    media: query,
    onchange: null,
    removeEventListener: vi.fn((_event: 'change', callback: () => void) => {
      listeners.delete(callback)
    }),
    removeListener: vi.fn((callback: () => void) => {
      listeners.delete(callback)
    }),
  }))

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: matchMedia,
  })

  return {
    matchMedia,
    setMatches(nextMatches: boolean) {
      matches = nextMatches
      for (const listener of listeners) {
        listener()
      }
    },
  }
}

function ReducedMotionProbe() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return <span data-testid="preference">{prefersReducedMotion ? 'reduce' : 'no-preference'}</span>
}

afterEach(() => {
  cleanup()
  restoreMatchMedia()
  vi.restoreAllMocks()
})

describe('usePrefersReducedMotion', () => {
  it('reads the initial preference synchronously', () => {
    const media = mockReducedMotionPreference(true)

    render(<ReducedMotionProbe />)

    expect(screen.getByTestId('preference')).toHaveTextContent('reduce')
    expect(media.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('updates when the media query preference changes', () => {
    const media = mockReducedMotionPreference(false)

    render(<ReducedMotionProbe />)

    expect(screen.getByTestId('preference')).toHaveTextContent('no-preference')

    act(() => {
      media.setMatches(true)
    })

    expect(screen.getByTestId('preference')).toHaveTextContent('reduce')
  })
})
