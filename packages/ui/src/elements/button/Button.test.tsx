import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Button } from './Button'
import {
  buttonColorVariants,
  buttonHighContrastColorVariants,
  buttonHoverColorVariants,
  buttonLoading,
  buttonLoadingContentCls,
  buttonLoadingOverlayCls,
  buttonSizeVariants,
} from './button.class'
import { iconSizeVariants } from './icon-button.class'

afterEach(() => {
  cleanup()
})

describe('Button', () => {
  it('normalizes whitespace around color and variant', () => {
    render(
      <Button color={' info ' as any} variant={' soft ' as any}>
        Click
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Click' })
    expect(button.className).toContain(buttonColorVariants.info.soft)
    expect(button.className).toContain(buttonHoverColorVariants.info.soft)
    expect(button.className).not.toContain('surface-color-')
    expect(button.className).not.toContain('surface-variant-')
  })

  it('falls back to primary color and variant for invalid values', () => {
    render(
      <Button color={'not-a-color' as any} variant={'invalid' as any}>
        Click
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Click' })
    expect(button.className).toContain(buttonColorVariants[SemanticColor.primary].solid)
  })

  it('falls back to default size for invalid values', () => {
    render(<Button size={'9' as any}>Click</Button>)

    const button = screen.getByRole('button', { name: 'Click' })
    expect(button.className).toContain(buttonSizeVariants.md)
  })

  it('applies high-contrast styles when enabled', () => {
    render(
      <Button variant="soft" highContrast>
        High contrast
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'High contrast' })
    expect(button.className).toContain('af-high-contrast')
    expect(button.className).toContain(buttonHighContrastColorVariants[SemanticColor.primary].soft)
    expect(button.className).not.toContain(buttonColorVariants[SemanticColor.primary].soft)
  })

  it('normalizes case-insensitive enum values and boolean-like visual props', () => {
    render(
      <Button variant={' SOFT ' as any} color={' INFO ' as any} highContrast={'false' as any} loading={'false' as any}>
        Normalized
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Normalized' })
    expect(button.className).toContain(buttonColorVariants.info.soft)
    expect(button.className).not.toContain('af-high-contrast')
    expect(button).not.toBeDisabled()
    expect(button).not.toHaveAttribute('aria-busy')
  })

  it('keeps loading spinner separate from hidden button content', () => {
    render(<Button loading>Saving</Button>)

    const button = screen.getByRole('button', { name: 'Saving' })
    const loadingOverlayClass = buttonLoadingOverlayCls.split(' ')[0]
    const loadingContentClass = buttonLoadingContentCls.split(' ')[0]

    expect(button).toHaveClass(buttonLoading)
    expect(button.querySelector(`.${loadingOverlayClass}`)).toBeInTheDocument()
    expect(button.querySelector(`.${loadingContentClass}`)).toHaveTextContent('Saving')
  })

  it('keeps grayscale semantic lanes on the readable primary fill in high-contrast solid mode', () => {
    render(
      <>
        <Button color="neutral" variant="solid" highContrast>
          Neutral
        </Button>
        <Button color="light" variant="solid" highContrast>
          Light
        </Button>
        <Button color="dark" variant="solid" highContrast>
          Dark
        </Button>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Neutral' }).className).toContain(
      buttonHighContrastColorVariants.neutral.solid,
    )
    expect(screen.getByRole('button', { name: 'Light' }).className).toContain(
      buttonHighContrastColorVariants.light.solid,
    )
    expect(screen.getByRole('button', { name: 'Dark' }).className).toContain(buttonHighContrastColorVariants.dark.solid)
    expect(screen.getByRole('button', { name: 'Neutral' }).className).toContain('af-high-contrast')
    expect(screen.getByRole('button', { name: 'Light' }).className).toContain('af-high-contrast')
    expect(screen.getByRole('button', { name: 'Dark' }).className).toContain('af-high-contrast')
  })

  it('renders dynamic icon at the start when iconStart is provided', async () => {
    render(<Button iconStart="search">Search</Button>)

    const button = screen.getByRole('button', { name: 'Search' })
    await waitFor(() => {
      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      if (!svg) {
        throw new Error('Expected icon svg to be rendered')
      }

      const nodes = Array.from(button.childNodes)
      const iconNode = nodes.find(
        node => node === svg || (node.nodeType === Node.ELEMENT_NODE && (node as Element).contains(svg)),
      )
      expect(iconNode).toBeTruthy()
      if (!iconNode) {
        throw new Error('Expected icon node to be rendered')
      }
      const iconIndex = nodes.indexOf(iconNode)
      const textIndex = nodes.findIndex(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      expect(textIndex).toBeGreaterThan(-1)
      expect(iconIndex).toBeLessThan(textIndex)
    })
  })

  it('renders dynamic icon at the end when iconEnd is provided', async () => {
    render(<Button iconEnd="chevron-right">Continue</Button>)

    const button = screen.getByRole('button', { name: 'Continue' })
    await waitFor(() => {
      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      if (!svg) {
        throw new Error('Expected icon svg to be rendered')
      }

      const nodes = Array.from(button.childNodes)
      const iconNode = nodes.find(
        node => node === svg || (node.nodeType === Node.ELEMENT_NODE && (node as Element).contains(svg)),
      )
      expect(iconNode).toBeTruthy()
      if (!iconNode) {
        throw new Error('Expected icon node to be rendered')
      }
      const iconIndex = nodes.indexOf(iconNode)
      const textIndex = nodes.findIndex(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      expect(textIndex).toBeGreaterThan(-1)
      expect(iconIndex).toBeGreaterThan(textIndex)
    })
  })

  it('renders both iconStart and iconEnd together', async () => {
    render(
      <Button iconStart="download" iconEnd="chevron-down">
        Download
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Download' })
    await waitFor(() => {
      const nodes = Array.from(button.childNodes)
      const textIndex = nodes.findIndex(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      expect(textIndex).toBeGreaterThan(-1)

      const iconIndexes = nodes.flatMap((node, index) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return []
        const element = node as Element
        const hasSvg = element.tagName.toLowerCase() === 'svg' || !!element.querySelector('svg')
        return hasSvg ? [index] : []
      })

      expect(iconIndexes).toHaveLength(2)
      expect(iconIndexes[0]).toBeLessThan(textIndex)
      expect(iconIndexes[1]).toBeGreaterThan(textIndex)
    })
  })

  it('renders button icons with inherited text color and button-weight stroke', async () => {
    render(
      <Button color="secondary" variant="solid" iconStart="upload">
        Upload
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Upload' })

    await waitFor(() => {
      const iconWrapper = button.querySelector('span')
      expect(iconWrapper).not.toBeNull()
      expect(iconWrapper?.style.color).toBe('inherit')

      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('stroke', 'currentColor')
      expect(svg).toHaveAttribute('stroke-width', '2.25')
    })
  })

  it('propagates button size to start icons', async () => {
    render(
      <Button size="sm" color="secondary" variant="solid" iconStart="upload">
        Upload
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Upload' })

    await waitFor(() => {
      const iconWrapper = button.querySelector('span')
      expect(iconWrapper).not.toBeNull()
      expect(iconWrapper?.className).toContain(iconSizeVariants.sm)
    })
  })

  it('accepts inverse without emitting legacy Button-specific surface classes', () => {
    const { rerender } = render(
      <Button color="secondary" variant="soft">
        Soft
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Soft' })
    const beforeInverse = button.className
    expect(beforeInverse).toContain(buttonColorVariants.secondary.soft)
    expect(beforeInverse).not.toContain('af-button-inverse')

    rerender(
      <Button color="secondary" variant="soft" inverse>
        Soft
      </Button>,
    )

    expect(button.className).toContain(buttonColorVariants.secondary.soft)
    expect(button.className).not.toContain('af-button-inverse')
    expect(button).not.toHaveAttribute('inverse')
    expect(button.className).toBe(beforeInverse)
  })

  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Button>Click</Button>
      </Theme>,
    )

    expect(screen.getByRole('button', { name: 'Click' })).toHaveStyle({
      '--element-border-radius': designTokens.radius.lg,
    })
  })
})
