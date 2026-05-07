import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Progress } from './Progress'
import {
  progressIndicatorHighContrast,
  progressSoftIndicatorColorStyles,
  progressTrackHighContrast,
  progressTrackVariantStyles,
} from './Progress.css'

afterEach(() => {
  cleanup()
})

describe('Progress', () => {
  it('uses local track and indicator surface maps for high-contrast progress styling', () => {
    render(<Progress value={50} color="success" variant="soft" highContrast data-testid="progress" />)

    const progress = screen.getByTestId('progress')
    const indicator = progress.firstElementChild

    expect(progress).toHaveClass(progressTrackVariantStyles.soft)
    expect(progress).toHaveClass(progressTrackHighContrast)
    expect(indicator).toHaveClass(progressSoftIndicatorColorStyles.success)
    expect(indicator).toHaveClass(progressIndicatorHighContrast)
  })
})
