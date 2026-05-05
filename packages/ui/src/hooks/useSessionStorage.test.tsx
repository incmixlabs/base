import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSessionStorage } from './useSessionStorage'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

function SessionStorageProbe() {
  const [value, setValue, removeValue] = useSessionStorage('current-project', 'project-a')

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('project-b')}>
        Set project
      </button>
      <button type="button" onClick={() => setValue(previous => `${previous}-draft`)}>
        Append
      </button>
      <button type="button" onClick={removeValue}>
        Remove
      </button>
    </div>
  )
}

describe('useSessionStorage', () => {
  it('hydrates from sessionStorage when a value already exists', () => {
    window.sessionStorage.setItem('current-project', JSON.stringify('project-c'))

    render(<SessionStorageProbe />)

    expect(screen.getByTestId('value')).toHaveTextContent('project-c')
  })

  it('writes updates through to sessionStorage without touching localStorage', () => {
    render(<SessionStorageProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set project' }))

    expect(screen.getByTestId('value')).toHaveTextContent('project-b')
    expect(window.sessionStorage.getItem('current-project')).toBe(JSON.stringify('project-b'))
    expect(window.localStorage.getItem('current-project')).toBeNull()
  })

  it('supports updater functions', () => {
    render(<SessionStorageProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Append' }))

    expect(screen.getByTestId('value')).toHaveTextContent('project-a-draft')
    expect(window.sessionStorage.getItem('current-project')).toBe(JSON.stringify('project-a-draft'))
  })

  it('removes the stored value and resets to the default', () => {
    window.sessionStorage.setItem('current-project', JSON.stringify('project-c'))

    render(<SessionStorageProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('value')).toHaveTextContent('project-a')
    expect(window.sessionStorage.getItem('current-project')).toBeNull()
  })

  it('syncs updates from session storage events', () => {
    render(<SessionStorageProbe />)

    fireEvent(
      window,
      new StorageEvent('storage', {
        key: 'current-project',
        newValue: JSON.stringify('project-d'),
        storageArea: window.sessionStorage,
      }),
    )

    expect(screen.getByTestId('value')).toHaveTextContent('project-d')
  })

  it('falls back to defaults when sessionStorage reads throw', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })

    render(<SessionStorageProbe />)

    expect(screen.getByTestId('value')).toHaveTextContent('project-a')
    getItem.mockRestore()
  })

  it('keeps in-memory updates when sessionStorage writes throw', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })

    render(<SessionStorageProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Set project' }))

    expect(screen.getByTestId('value')).toHaveTextContent('project-b')
    setItem.mockRestore()
  })

  it('resets in-memory state when sessionStorage removal throws', () => {
    window.sessionStorage.setItem('current-project', JSON.stringify('project-c'))
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })

    render(<SessionStorageProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('value')).toHaveTextContent('project-a')
    removeItem.mockRestore()
  })
})
