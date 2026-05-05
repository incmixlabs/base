import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

function LocalStorageProbe() {
  const [value, setValue, removeValue] = useLocalStorage('theme-accent', 'indigo')

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('teal')}>
        Set teal
      </button>
      <button type="button" onClick={() => setValue(previous => `${previous}-next`)}>
        Append
      </button>
      <button type="button" onClick={removeValue}>
        Remove
      </button>
    </div>
  )
}

describe('useLocalStorage', () => {
  it('hydrates from localStorage when a value already exists', () => {
    window.localStorage.setItem('theme-accent', JSON.stringify('orange'))

    render(<LocalStorageProbe />)

    expect(screen.getByTestId('value')).toHaveTextContent('orange')
  })

  it('writes updates through to localStorage', () => {
    render(<LocalStorageProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set teal' }))

    expect(screen.getByTestId('value')).toHaveTextContent('teal')
    expect(window.localStorage.getItem('theme-accent')).toBe(JSON.stringify('teal'))
  })

  it('supports updater functions', () => {
    render(<LocalStorageProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Append' }))

    expect(screen.getByTestId('value')).toHaveTextContent('indigo-next')
    expect(window.localStorage.getItem('theme-accent')).toBe(JSON.stringify('indigo-next'))
  })

  it('removes the stored value and resets to the default', () => {
    window.localStorage.setItem('theme-accent', JSON.stringify('violet'))

    render(<LocalStorageProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('value')).toHaveTextContent('indigo')
    expect(window.localStorage.getItem('theme-accent')).toBeNull()
  })

  it('syncs updates from storage events', () => {
    render(<LocalStorageProbe />)

    fireEvent(
      window,
      new StorageEvent('storage', {
        key: 'theme-accent',
        newValue: JSON.stringify('lime'),
        storageArea: window.localStorage,
      }),
    )

    expect(screen.getByTestId('value')).toHaveTextContent('lime')
  })
})
