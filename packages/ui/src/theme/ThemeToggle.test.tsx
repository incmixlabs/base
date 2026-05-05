import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'
import type { Appearance } from './tokens'

function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, reject, resolve }
}

interface ThemeToggleHarnessProps {
  initialAppearance?: Appearance
  modes?: Array<'light' | 'dark' | 'inherit'>
  parentAppearance?: Appearance
}

const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia')
const originalStartViewTransitionDescriptor = Object.getOwnPropertyDescriptor(document, 'startViewTransition')
const originalDocumentElementAnimateDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'animate')

function ThemeToggleHarness({ initialAppearance = 'light', modes, parentAppearance }: ThemeToggleHarnessProps) {
  const [appearance, setAppearance] = React.useState<Appearance>(initialAppearance)

  const toggle = (
    <ThemeProvider appearance={appearance} onAppearanceChange={setAppearance}>
      <ThemeToggle modes={modes} />
    </ThemeProvider>
  )

  return parentAppearance == null ? toggle : <ThemeProvider appearance={parentAppearance}>{toggle}</ThemeProvider>
}

function restoreProperty(target: object, property: PropertyKey, descriptor: PropertyDescriptor | undefined) {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor)
    return
  }

  Reflect.deleteProperty(target, property)
}

afterEach(() => {
  cleanup()
  restoreProperty(window, 'matchMedia', originalMatchMediaDescriptor)
  restoreProperty(document, 'startViewTransition', originalStartViewTransitionDescriptor)
  restoreProperty(document.documentElement, 'animate', originalDocumentElementAnimateDescriptor)
  vi.restoreAllMocks()
})

describe('ThemeToggle', () => {
  function mockSystemAppearance(appearance: 'light' | 'dark') {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: appearance === 'dark',
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })
  }

  it('waits for the page transition animation before swapping the icon', async () => {
    const transitionReady = deferred()
    const transitionFinished = deferred()
    const pageAnimationFinished = deferred()

    const startViewTransition = vi.fn((callback: () => void) => {
      callback()

      return {
        finished: transitionFinished.promise,
        ready: transitionReady.promise,
        updateCallbackDone: Promise.resolve(),
      } as ViewTransition
    })
    const animate = vi.fn(() => ({ finished: pageAnimationFinished.promise }) as unknown as Animation)

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    })
    Object.defineProperty(document.documentElement, 'animate', {
      configurable: true,
      value: animate,
    })

    render(<ThemeToggleHarness />)

    const button = screen.getByRole('button', { name: 'Toggle theme' })
    const getIcon = () => button.querySelector('[data-theme-toggle-icon]')
    const getIconMode = () => getIcon()?.getAttribute('data-theme-toggle-icon')

    expect(getIconMode()).toBe('light')

    fireEvent.click(button)

    expect(startViewTransition).toHaveBeenCalledTimes(1)
    expect(getIconMode()).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme-toggle-transition')

    await act(async () => {
      transitionReady.resolve()
      await transitionReady.promise
    })

    expect(animate).toHaveBeenCalledTimes(1)
    expect(getIconMode()).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme-toggle-transition')

    await act(async () => {
      pageAnimationFinished.resolve()
      await pageAnimationFinished.promise
    })

    expect(getIconMode()).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme-toggle-transition')

    await act(async () => {
      transitionFinished.resolve()
      await transitionFinished.promise
    })

    expect(getIconMode()).toBe('dark')
    expect(getIcon()?.getAttribute('data-theme-toggle-motion')).toBe('forward')
    expect(getIcon()?.getAttribute('style') ?? '').not.toContain('rotate(180deg)')
    expect(document.documentElement).not.toHaveAttribute('data-theme-toggle-transition')
  })

  it('uses the system-resolved icon when cycling into inherit mode', () => {
    mockSystemAppearance('light')
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: undefined,
    })

    render(<ThemeToggleHarness initialAppearance="dark" modes={['dark', 'inherit']} />)

    const button = screen.getByRole('button', { name: 'Toggle theme' })
    const getIconMode = () => button.querySelector('[data-theme-toggle-icon]')?.getAttribute('data-theme-toggle-icon')

    expect(getIconMode()).toBe('dark')

    fireEvent.click(button)

    expect(getIconMode()).toBe('light')
  })

  it('uses the latest resolved icon when inherit resolves during a delayed transition', async () => {
    mockSystemAppearance('dark')
    const transitionReady = deferred()
    const transitionFinished = deferred()
    const pageAnimationFinished = deferred()

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn((callback: () => void) => {
        callback()

        return {
          finished: transitionFinished.promise,
          ready: transitionReady.promise,
          updateCallbackDone: Promise.resolve(),
        } as ViewTransition
      }),
    })
    Object.defineProperty(document.documentElement, 'animate', {
      configurable: true,
      value: vi.fn(() => ({ finished: pageAnimationFinished.promise }) as unknown as Animation),
    })

    render(<ThemeToggleHarness initialAppearance="dark" modes={['dark', 'inherit']} parentAppearance="light" />)

    const button = screen.getByRole('button', { name: 'Toggle theme' })
    const getIconMode = () => button.querySelector('[data-theme-toggle-icon]')?.getAttribute('data-theme-toggle-icon')

    expect(getIconMode()).toBe('dark')

    fireEvent.click(button)

    await act(async () => {
      transitionReady.resolve()
      await transitionReady.promise
    })
    await act(async () => {
      pageAnimationFinished.resolve()
      await pageAnimationFinished.promise
    })

    expect(getIconMode()).toBe('dark')

    await act(async () => {
      transitionFinished.resolve()
      await transitionFinished.promise
    })

    expect(getIconMode()).toBe('light')
  })
})
