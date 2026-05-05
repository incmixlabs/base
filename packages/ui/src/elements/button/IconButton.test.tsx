import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { resolveIconExport } from './dynamic-icon'
import { IconButton } from './IconButton'
import { iconButtonColorVariants, iconButtonSizeVariants, iconSizeVariants } from './IconButton.css'

afterEach(() => {
  cleanup()
})

describe('IconButton', () => {
  it('normalizes whitespace around color and variant', () => {
    render(
      <IconButton aria-label="Test" color={' info ' as any} variant={' soft ' as any}>
        <span>Icon</span>
      </IconButton>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(iconButtonColorVariants.info.soft)
  })

  it('falls back to primary color and variant for invalid values', () => {
    render(
      <IconButton aria-label="Test" color={'not-a-color' as any} variant={'invalid' as any}>
        <span>Icon</span>
      </IconButton>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(iconButtonColorVariants[SemanticColor.primary].soft)
  })

  it('falls back to default size for invalid values', () => {
    render(
      <IconButton aria-label="Test" size={'9' as any}>
        <span>Icon</span>
      </IconButton>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(iconButtonSizeVariants.md)
  })

  it('uses string title as tooltip content source and fallback aria-label', () => {
    render(<IconButton title="Copy" icon="copy" />)

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('uses an explicit aria-label when title is not provided', () => {
    render(<IconButton icon="copy" aria-label="Copy" />)

    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button).not.toHaveAttribute('title')
    expect(button).toHaveAttribute('aria-label', 'Copy')
  })

  it('renders named icons with inherited button color', async () => {
    render(<IconButton icon="search" size="xs" color="secondary" variant="solid" aria-label="Search" />)

    const button = screen.getByRole('button', { name: 'Search' })
    expect(button.className).toContain(iconButtonSizeVariants.xs)

    await waitFor(() => {
      const iconWrapper = button.querySelector('span')
      expect(iconWrapper).not.toBeNull()
      expect(iconWrapper?.className).toContain(iconSizeVariants.xs)
      expect(iconWrapper?.className).not.toContain(iconButtonSizeVariants.md)
      expect(iconWrapper?.style.color).toBe('inherit')

      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('stroke', 'currentColor')
      expect(svg).toHaveAttribute('stroke-width', '2.25')
    })
  })

  it('does not apply a native title fallback when title is a render function', () => {
    render(<IconButton icon="copy" title={() => 'Copy'} />)

    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button).not.toHaveAttribute('title')
    expect(button).toHaveAttribute('aria-label', 'Copy')
  })

  it('resolves icon aliases for dynamically loaded icons', () => {
    expect(resolveIconExport('close')).not.toBeNull()
    expect(resolveIconExport('copy')).not.toBeNull()
    expect(resolveIconExport('copy-check')).not.toBeNull()
    expect(resolveIconExport('refresh-cw')).not.toBeNull()
    expect(resolveIconExport('chevron-up')).not.toBeNull()
    expect(resolveIconExport('chevrons-up-down')).not.toBeNull()
    expect(resolveIconExport('indent-decrease')).not.toBeNull()
    expect(resolveIconExport('indent-increase')).not.toBeNull()
  })

  it('fetches non-safelisted lucide icons from the BFF api path', async () => {
    const iconName = 'camera-bff-fallback-test'
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          `<svg xmlns:xlink="http://www.w3.org/1999/xlink" data-lucide="${iconName}" stroke="currentColor" onclick="alert(1)" style="color:red" href="https://example.com"><path d="M1 1h2" onload="alert(2)" style="display:none" xlink:href="https://example.com"></path><script>alert(3)</script></svg>`,
        ),
    })
    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock as unknown as typeof fetch

    try {
      const { container } = render(<IconButton icon={iconName} aria-label="Camera" />)

      expect(await screen.findByRole('button', { name: 'Camera' })).toBeInTheDocument()
      await waitFor(() => {
        expect(container.querySelector(`svg[data-lucide="${iconName}"]`)).toBeInTheDocument()
      })
      const svg = container.querySelector(`svg[data-lucide="${iconName}"]`)
      const path = container.querySelector('path')
      expect(svg).not.toHaveAttribute('onclick')
      expect(svg).not.toHaveAttribute('style')
      expect(svg).not.toHaveAttribute('href')
      expect(path).toHaveAttribute('d', 'M1 1h2')
      expect(path).not.toHaveAttribute('onload')
      expect(path).not.toHaveAttribute('style')
      expect(path).not.toHaveAttribute('xlink:href')
      expect(container.querySelector('script')).not.toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledWith(`/api/icons/lucide/${iconName}`, {
        headers: {
          accept: 'image/svg+xml',
        },
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('does not render a stale remote SVG when the icon name changes', async () => {
    let resolveSecondSvg: (svg: string) => void = () => undefined
    const secondSvg = new Promise<string>(resolve => {
      resolveSecondSvg = resolve
    })
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve({
        ok: true,
        text: () =>
          url.includes('remote-two')
            ? secondSvg
            : Promise.resolve('<svg data-lucide="remote-one" stroke="currentColor"></svg>'),
      }),
    )
    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock as unknown as typeof fetch

    try {
      const { container, rerender } = render(<IconButton icon="remote-one" aria-label="Remote" />)

      await waitFor(() => {
        expect(container.querySelector('svg[data-lucide="remote-one"]')).toBeInTheDocument()
      })

      rerender(<IconButton icon="remote-two" aria-label="Remote" />)

      expect(container.querySelector('svg[data-lucide="remote-one"]')).not.toBeInTheDocument()

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('/api/icons/lucide/remote-two', {
          headers: {
            accept: 'image/svg+xml',
          },
        })
      })

      resolveSecondSvg('<svg data-lucide="remote-two" stroke="currentColor"></svg>')

      await waitFor(() => {
        expect(container.querySelector('svg[data-lucide="remote-two"]')).toBeInTheDocument()
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('retries remote icon lookup after transient failures', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('<svg data-lucide="retry-icon" stroke="currentColor"></svg>'),
      })
    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock as unknown as typeof fetch

    try {
      const { container, unmount } = render(<IconButton icon="retry-icon" aria-label="Retry" />)

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(1)
      })
      expect(container.querySelector('svg[data-lucide="retry-icon"]')).not.toBeInTheDocument()

      unmount()
      render(<IconButton icon="retry-icon" aria-label="Retry" />)

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(2)
      })
      await waitFor(() => {
        expect(document.querySelector('svg[data-lucide="retry-icon"]')).toBeInTheDocument()
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('negative-caches missing remote icons', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve(''),
    })
    const originalFetch = globalThis.fetch
    globalThis.fetch = fetchMock as unknown as typeof fetch

    try {
      const { unmount } = render(<IconButton icon="missing-remote-icon" aria-label="Missing" />)

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(1)
      })

      unmount()
      render(<IconButton icon="missing-remote-icon" aria-label="Missing" />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Missing' })).toBeInTheDocument()
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
