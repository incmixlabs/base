import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { SegmentedControl } from './SegmentedControl'
import {
  segmentedSurfaceIndicatorByColor,
  segmentedSurfaceRootBySize,
  segmentedSurfaceSelectedHighContrastTextByColor,
  segmentedUnderlineIndicatorByColor,
  segmentedUnderlineRootBySize,
} from './segmented-control.shared.css'

afterEach(() => {
  cleanup()
})

describe('SegmentedControl', () => {
  it('normalizes whitespace around size, variant, and color', () => {
    render(
      <SegmentedControl.Root
        data-testid="segmented"
        value="a"
        size={' xl ' as any}
        variant={' underline ' as any}
        color={' info ' as any}
      >
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expect(root.className).toContain(segmentedUnderlineRootBySize.xl)
    const indicator = root.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedUnderlineIndicatorByColor.info)
  })

  it('falls back to defaults for invalid values', () => {
    render(
      <SegmentedControl.Root
        data-testid="segmented"
        value="a"
        size={'9' as any}
        variant={'bad' as any}
        color={'nope' as any}
      >
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expect(root.className).toContain(segmentedSurfaceRootBySize.md)
    const indicator = root.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedSurfaceIndicatorByColor[SemanticColor.slate])
  })

  it('applies high-contrast styles for selected items', () => {
    render(
      <SegmentedControl.Root data-testid="segmented" value="a" color="success" highContrast>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const selected = screen.getByRole('radio', { name: 'A' })
    expect(selected.className).toContain(segmentedSurfaceSelectedHighContrastTextByColor.success)
  })

  it('enables hover classes by default and allows disabling them', () => {
    const { rerender } = render(
      <SegmentedControl.Root value="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const item = screen.getByRole('radio', { name: 'B' })
    expect(item.className).toContain('enabled:hover:bg-muted')
    expect(item.className).toContain('enabled:cursor-pointer')

    rerender(
      <SegmentedControl.Root value="a" hover={false}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    expect(item.className).toContain('cursor-default')
    expect(item.className).not.toContain('enabled:hover:bg-muted')
  })

  it('renders configured icons and shows a tooltip for icon-only items', async () => {
    const user = userEvent.setup()

    render(
      <SegmentedControl.Root
        value="phone"
        icons={{
          position: 'only',
          icons: [
            { value: 'phone', icon: 'phone' },
            { value: 'email', icon: 'mail' },
          ],
        }}
      >
        <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
        <SegmentedControl.Item value="email">Email</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const phoneItem = screen.getByRole('radio', { name: 'Phone' })
    expect(phoneItem).toHaveAttribute('aria-label', 'Phone')

    await waitFor(() => {
      expect(phoneItem.querySelector('svg')).toBeInTheDocument()
    })

    await user.hover(phoneItem)
    await waitFor(() => {
      expect(screen.getAllByText('Phone').length).toBeGreaterThan(1)
    })
  })
})
