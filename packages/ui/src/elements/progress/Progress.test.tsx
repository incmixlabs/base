import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Progress } from './Progress'
import { progressIndeterminateDurationDefault } from './progress.class'

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
    expect(progress).toHaveClass('h-1.5')
    expect(progress).toHaveClass('bg-neutral-soft')
    expect(progress).toHaveClass('border-0')
    expect(progress).toHaveClass('[border-color:var(--color-neutral-text)]')
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

  it('uses static height utilities for xs sizing', () => {
    render(<Progress size="xs" value={90} data-testid="progress" />)

    expect(screen.getByTestId('progress')).toHaveClass('h-1')
  })

  it('uses default indeterminate timing when duration is not provided', () => {
    render(<Progress data-testid="progress" />)

    const indicator = screen.getByTestId('progress').firstElementChild

    expect(indicator).toHaveClass('w-2/5')
    expect(indicator).toHaveStyle({
      '--progress-indeterminate-duration': progressIndeterminateDurationDefault,
    })
  })
})
