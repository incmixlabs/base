import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MediaPlayer } from './MediaPlayer'

afterEach(() => {
  cleanup()
})

describe('MediaPlayer.Controls', () => {
  it('keeps a DOM wrapper for default controls when asChild is set', () => {
    render(
      <MediaPlayer.Root>
        <MediaPlayer.Controls
          asChild
          data-testid="controls"
          showSeek={false}
          showTime={false}
          showVolume={false}
          showFullscreen={false}
        />
      </MediaPlayer.Root>,
    )

    const controls = screen.getByTestId('controls')

    expect(controls.tagName).toBe('DIV')
    expect(controls).toHaveAttribute('data-slot', 'media-player-controls')
    expect(controls).toHaveAttribute('data-placement', 'overlay')
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('uses the provided host when asChild receives a non-fragment element', () => {
    render(
      <MediaPlayer.Root>
        <MediaPlayer.Controls asChild data-testid="controls" placement="docked">
          <section aria-label="Custom controls">Custom</section>
        </MediaPlayer.Controls>
      </MediaPlayer.Root>,
    )

    const controls = screen.getByTestId('controls')

    expect(controls.tagName).toBe('SECTION')
    expect(controls).toHaveAttribute('data-slot', 'media-player-controls')
    expect(controls).toHaveAttribute('data-placement', 'docked')
    expect(controls).toHaveTextContent('Custom')
  })
})
