import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Progress } from './Progress'

afterEach(() => {
  cleanup()
})

describe('Progress', () => {
  it('renders the utility class contract for high-contrast soft progress styling', () => {
    render(<Progress value={50} color="success" variant="soft" highContrast data-testid="progress" />)

    const progress = screen.getByTestId('progress')
    const indicator = progress.firstElementChild

    expect(indicator).not.toBeNull()
    expect(progress).toHaveClass('relative')
    expect(progress).toHaveClass('w-full')
    expect(progress).toHaveClass('h-[0.375rem]')
    expect(progress).toHaveClass('bg-neutral-soft')
    expect(progress).toHaveClass('border-0')
    expect(progress).toHaveClass('border-[var(--color-neutral-text)]')
    expect(progress).toHaveClass('rounded-full')
    expect(indicator!).toHaveClass('relative')
    expect(indicator!).toHaveClass('h-full')
    expect(indicator!).toHaveClass('bg-[var(--color-success-soft-hover)]')
    expect(indicator!).toHaveClass('saturate-[1.15]')
    expect(indicator!).toHaveClass('contrast-[1.05]')
    expect(indicator).toHaveStyle({ width: '50%' })
  })

  it('uses the indeterminate animation utility without legacy global classes', () => {
    render(<Progress duration="2s" data-testid="progress" />)

    const progress = screen.getByTestId('progress')
    const indicator = progress.firstElementChild

    expect(indicator).not.toBeNull()
    expect(indicator!).toHaveClass(
      'animate-[progress-indeterminate_var(--progress-indeterminate-duration,1s)_var(--af-ease-standard)_infinite]',
    )
    expect(indicator).toHaveStyle({ '--progress-indeterminate-duration': '2s' })
    expect(progress.innerHTML).not.toContain('animate-progress-indeterminate')
  })

  it('uses explicit rem heights for xs sizing', () => {
    render(<Progress size="xs" value={90} data-testid="progress" />)

    expect(screen.getByTestId('progress')).toHaveClass('h-[0.25rem]')
  })
})
