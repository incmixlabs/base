import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { deleteCookie, readCookie, useCookie, writeCookie } from './useCookie'

const cookieOptions = { path: '/', maxAge: 60, sameSite: 'lax' } as const

afterEach(() => {
  cleanup()
  deleteCookie('theme-mode', { path: '/' })
  deleteCookie('encoded cookie', { path: '/' })
  Object.defineProperty(window, 'cookieStore', { configurable: true, value: undefined })
})

function CookieProbe() {
  const [value, setValue, removeValue] = useCookie('theme-mode', 'inherit', cookieOptions)

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('dark')}>
        Set dark
      </button>
      <button type="button" onClick={removeValue}>
        Remove
      </button>
    </div>
  )
}

describe('cookie helpers', () => {
  it('reads and writes encoded cookie values', () => {
    writeCookie('encoded cookie', 'dark mode', cookieOptions)

    expect(readCookie('encoded cookie')).toBe('dark mode')
  })

  it('reads empty cookie values as an empty string', () => {
    writeCookie('theme-mode', '', cookieOptions)

    expect(readCookie('theme-mode')).toBe('')
  })

  it('uses Cookie Store API when available', () => {
    const set = vi.fn(() => Promise.resolve())
    Object.defineProperty(window, 'cookieStore', {
      configurable: true,
      value: { set },
    })

    writeCookie('theme-mode', 'dark', cookieOptions)

    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'theme-mode',
        path: '/',
        sameSite: 'lax',
        value: 'dark',
      }),
    )
  })
})

describe('useCookie', () => {
  it('hydrates from an existing cookie', () => {
    writeCookie('theme-mode', 'light', cookieOptions)

    render(<CookieProbe />)

    expect(screen.getByTestId('value')).toHaveTextContent('light')
  })

  it('writes updates through to cookies', () => {
    render(<CookieProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set dark' }))

    expect(screen.getByTestId('value')).toHaveTextContent('dark')
    expect(readCookie('theme-mode')).toBe('dark')
  })

  it('removes the cookie and resets to the default', () => {
    writeCookie('theme-mode', 'light', cookieOptions)

    render(<CookieProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('value')).toHaveTextContent('inherit')
    expect(readCookie('theme-mode')).toBeNull()
  })
})
