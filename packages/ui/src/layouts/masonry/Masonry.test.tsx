import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Masonry } from './Masonry'

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

describe('Masonry', () => {
  let offsetWidthSpy: ReturnType<typeof vi.spyOn>
  let offsetHeightSpy: ReturnType<typeof vi.spyOn>
  let clientWidthSpy: ReturnType<typeof vi.spyOn>
  let clientHeightSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => window.setTimeout(callback, 0))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))

    clientWidthSpy = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(720)
    clientHeightSpy = vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(0)

    offsetWidthSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function offsetWidth(
      this: HTMLElement,
    ) {
      return this.getAttribute('data-slot') === 'masonry' ? 0 : 220
    })
    offsetHeightSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function offsetHeight(
      this: HTMLElement,
    ) {
      return this.getAttribute('data-slot') === 'masonry-item' ? 120 : 0
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    offsetWidthSpy.mockRestore()
    offsetHeightSpy.mockRestore()
    clientWidthSpy.mockRestore()
    clientHeightSpy.mockRestore()
  })

  it('uses the viewport fallback width before container measurement resolves', async () => {
    render(
      <Masonry.Root columnWidth={200} gap={12}>
        <Masonry.Item>
          <div>Alpha</div>
        </Masonry.Item>
        <Masonry.Item>
          <div>Beta</div>
        </Masonry.Item>
      </Masonry.Root>,
    )

    await waitFor(() => {
      const item = screen.getByText('Alpha').closest('[data-slot="masonry-item"]') as HTMLElement | null
      expect(item).not.toBeNull()
      expect(item?.style.visibility).toBe('visible')
      expect(item?.style.width).not.toBe('0px')
    })
  })

  it('renders an initial measurement batch when no fallback is provided', () => {
    const markup = renderToStaticMarkup(
      <Masonry.Root columnWidth={200} gap={12}>
        <Masonry.Item>
          <div>Alpha</div>
        </Masonry.Item>
      </Masonry.Root>,
    )

    expect(markup).toContain('Alpha')
    expect(markup).toContain('visibility:hidden')
  })

  it('promotes the initial measurement batch to visible items without a scroll event', async () => {
    const onScroll = vi.fn()
    window.addEventListener('scroll', onScroll)

    try {
      render(
        <Masonry.Root columnWidth={200} gap={12}>
          <Masonry.Item>
            <div>Alpha</div>
          </Masonry.Item>
          <Masonry.Item>
            <div>Beta</div>
          </Masonry.Item>
        </Masonry.Root>,
      )

      await waitFor(() => {
        const item = screen.getByText('Alpha').closest('[data-slot="masonry-item"]') as HTMLElement | null
        expect(item).not.toBeNull()
        expect(item?.style.visibility).toBe('visible')
      })

      expect(onScroll).not.toHaveBeenCalled()
    } finally {
      window.removeEventListener('scroll', onScroll)
    }
  })
})
