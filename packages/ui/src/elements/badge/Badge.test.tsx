import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { iconSizeVariants } from '@/elements/button/icon-button.class'
import { SemanticColor } from '@/theme/props/color.prop'
import { Badge } from './Badge'
import {
  badgeColorVariants,
  badgeHighContrastColorVariants,
  badgeHighContrastHoverColorVariants,
  badgeHoverColorVariants,
  badgeSizeVariants,
} from './badge.class'

afterEach(() => {
  cleanup()
})

describe('Badge', () => {
  it('normalizes whitespace around size, color, and variant', () => {
    render(
      <Badge size={' xs ' as any} color={' info ' as any} variant={' soft ' as any}>
        Test
      </Badge>,
    )

    const badge = screen.getByText('Test')
    expect(badge.className).toContain(badgeSizeVariants.xs)
    expect(badge.className).toContain(badgeColorVariants.info.soft)
    expect(badge.className).not.toContain('surface-color-')
    expect(badge.className).not.toContain('surface-variant-')
  })

  it('falls back to default size/color/variant for invalid values', () => {
    render(
      <Badge size={'9' as any} color={'not-a-color' as any} variant={'invalid' as any}>
        Test
      </Badge>,
    )

    const badge = screen.getByText('Test')
    expect(badge.className).toContain(badgeSizeVariants.xs)
    expect(badge.className).toContain(badgeColorVariants[SemanticColor.slate].soft)
  })

  it('applies high-contrast styles when enabled', () => {
    render(
      <Badge variant="soft" highContrast>
        Test
      </Badge>,
    )

    const badge = screen.getByText('Test')
    expect(badge.className).toContain('af-high-contrast')
    expect(badge.className).toContain(badgeHighContrastColorVariants[SemanticColor.slate].soft)
    expect(badge.className).not.toContain(badgeColorVariants[SemanticColor.slate].soft)
  })

  it('uses high-contrast hover classes for hoverable high-contrast badges', () => {
    render(
      <Badge variant="soft" highContrast hover>
        Test
      </Badge>,
    )

    const badge = screen.getByText('Test')
    expect(badge.className).toContain(badgeHighContrastHoverColorVariants[SemanticColor.slate].soft)
    expect(badge.className).not.toContain(badgeHoverColorVariants[SemanticColor.slate].soft)
  })

  it('normalizes boolean-like highContrast and hover values', () => {
    render(
      <Badge variant="soft" highContrast={'false' as any} hover={'true' as any}>
        Test
      </Badge>,
    )

    const badge = screen.getByText('Test')
    expect(badge.className).not.toContain('af-high-contrast')
    expect(badge.className).not.toContain(badgeHighContrastColorVariants[SemanticColor.slate].soft)
    expect(badge.className).toContain(badgeHoverColorVariants[SemanticColor.slate].soft)
  })

  it('defaults hover to false and applies hover classes when enabled', () => {
    const { rerender } = render(<Badge>Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge.className).not.toContain(badgeHoverColorVariants[SemanticColor.slate].soft)

    rerender(<Badge hover>Test</Badge>)
    expect(badge.className).toContain(badgeHoverColorVariants[SemanticColor.slate].soft)
  })

  it('renders avatar and delete button for chip-style usage', () => {
    render(
      <Badge avatar={{ name: 'Alice' }} onDelete={() => undefined}>
        Test
      </Badge>,
    )

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('renders a dynamic lucide icon when icon is provided as a string', async () => {
    const { container } = render(<Badge icon="info">Test</Badge>)

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  it('propagates badge size to icon-based badges', async () => {
    const { container } = render(
      <Badge size="xs" icon="info">
        Test
      </Badge>,
    )

    await waitFor(() => {
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      const iconWrapper = svg?.closest('span')
      expect(iconWrapper?.className).toContain(iconSizeVariants.xs)
      expect(iconWrapper).toHaveStyle({ width: 'auto', height: 'auto' })
    })
  })

  it('calls onDelete and stops propagation when delete button is clicked', () => {
    let deleteCount = 0
    let clickCount = 0

    render(
      <Badge
        onClick={() => {
          clickCount += 1
        }}
        onDelete={() => {
          deleteCount += 1
        }}
      >
        Test
      </Badge>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(deleteCount).toBe(1)
    expect(clickCount).toBe(0)
  })
})
