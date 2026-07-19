import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import * as React from 'react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MediaPlayer } from './MediaPlayer'

beforeAll(() => {
  class MockMediaTrackList extends EventTarget {
    [Symbol.iterator]() {
      return [][Symbol.iterator]()
    }
  }

  const textTracks = new MockMediaTrackList()
  const audioTracks = new MockMediaTrackList()
  Object.defineProperty(HTMLMediaElement.prototype, 'textTracks', {
    configurable: true,
    get: () => textTracks,
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'audioTracks', {
    configurable: true,
    get: () => audioTracks,
  })
})

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

describe('MediaPlayer media refs', () => {
  it('keeps the video ref stable when its parent rerenders', () => {
    const refCalls: Array<HTMLVideoElement | null> = []

    function VideoHarness() {
      const [renderCount, setRenderCount] = React.useState(0)
      const [videoElement, setVideoElement] = React.useState<HTMLVideoElement | null>(null)
      const handleVideoRef = React.useCallback((element: HTMLVideoElement | null) => {
        refCalls.push(element)
        setVideoElement(element)
      }, [])

      return (
        <>
          <button type="button" onClick={() => setRenderCount(count => count + 1)}>
            Rerender
          </button>
          <MediaPlayer.Root data-render-count={renderCount}>
            <MediaPlayer.Video ref={handleVideoRef} />
          </MediaPlayer.Root>
          <span>{videoElement ? 'Video attached' : 'Video detached'}</span>
        </>
      )
    }

    render(<VideoHarness />)

    expect(screen.getByText('Video attached')).toBeInTheDocument()
    const refCallCountBeforeRerender = refCalls.length
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Rerender' }))).not.toThrow()
    expect(screen.getByText('Video attached')).toBeInTheDocument()
    expect(refCalls.slice(refCallCountBeforeRerender)).not.toContain(null)
  })
})
