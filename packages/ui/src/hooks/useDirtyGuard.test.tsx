import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDirtyGuard } from './useDirtyGuard'

afterEach(() => {
  cleanup()
})

function DirtyGuardProbe({ dirty, onRun }: { dirty: boolean; onRun: (label: string) => void }) {
  const guard = useDirtyGuard<{ label: string }>({ isDirty: dirty })

  return (
    <div>
      <button type="button" onClick={() => void guard.confirmOrRun(() => onRun('next'), { label: 'Next record' })}>
        Select next
      </button>
      <div role="status">{guard.open ? `Pending ${guard.pendingContext?.label ?? 'next item'}` : 'Clean'}</div>
      <button type="button" onClick={() => void guard.confirm()} disabled={!guard.open}>
        Confirm pending
      </button>
      <button type="button" onClick={guard.cancel} disabled={!guard.open}>
        Cancel pending
      </button>
    </div>
  )
}

describe('useDirtyGuard', () => {
  it('runs the action immediately when the guard is clean', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()

    render(<DirtyGuardProbe dirty={false} onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Select next' }))

    expect(onRun).toHaveBeenCalledWith('next')
    expect(screen.getByRole('status')).toHaveTextContent('Clean')
  })

  it('captures a pending action until the user confirms', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()

    render(<DirtyGuardProbe dirty onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Select next' }))

    expect(onRun).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Pending Next record')

    await user.click(screen.getByRole('button', { name: 'Confirm pending' }))

    expect(onRun).toHaveBeenCalledWith('next')
    expect(screen.getByRole('status')).toHaveTextContent('Clean')
  })

  it('drops the pending action when the user cancels the pending action', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()

    render(<DirtyGuardProbe dirty onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Select next' }))
    await user.click(screen.getByRole('button', { name: 'Cancel pending' }))

    expect(onRun).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Clean')
  })
})
