import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import {
  segmentedItemBySize,
  segmentedSurfaceIndicatorByColor,
  segmentedSurfaceRootBySize,
  segmentedSurfaceSelectedHighContrastTextByColor,
  segmentedUnderlineIndicatorByColor,
  segmentedUnderlineItemBySize,
  segmentedUnderlineRootBySize,
} from './segmented-control.shared.css'
import { Tabs } from './Tabs'

afterEach(() => {
  cleanup()
})

describe('Tabs', () => {
  it('normalizes whitespace around size, variant, and color', () => {
    render(
      <Tabs.Root defaultValue="a" size={' lg ' as any} variant={' surface ' as any} color={' info ' as any}>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expect(list.className).toContain(segmentedSurfaceRootBySize.lg)
    const indicator = list.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedSurfaceIndicatorByColor.info)
  })

  it('falls back to defaults for invalid values', () => {
    render(
      <Tabs.Root defaultValue="a" size={'9' as any} variant={'bad' as any} color={'nope' as any}>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expect(list.className).toContain(segmentedUnderlineRootBySize.md)
    const indicator = list.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedUnderlineIndicatorByColor[SemanticColor.slate])
  })

  it('uses defaults when props are undefined', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expect(list.className).toContain(segmentedUnderlineRootBySize.md)
    const indicator = list.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedUnderlineIndicatorByColor[SemanticColor.slate])
  })

  it('applies valid values and high-contrast styles', () => {
    render(
      <Tabs.Root defaultValue="a" size="xl" variant="surface" color="success" highContrast>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expect(list.className).toContain(segmentedSurfaceRootBySize.xl)
    const indicator = list.querySelector('[aria-hidden="true"]')
    expect(indicator?.className).toContain(segmentedSurfaceIndicatorByColor.success)
    const trigger = screen.getByRole('tab', { name: 'A' })
    expect(trigger.className).toContain(segmentedItemBySize.xl)
    expect(trigger.className).toContain(segmentedSurfaceSelectedHighContrastTextByColor.success)
  })

  it('uses underline size classes for line variant triggers', () => {
    render(
      <Tabs.Root defaultValue="a" size="lg" variant="line">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const trigger = screen.getByRole('tab', { name: 'A' })
    expect(trigger.className).toContain(segmentedUnderlineItemBySize.lg)
  })

  it('maps trigger sizing by variant consistently', () => {
    render(
      <>
        <Tabs.Root defaultValue="surface" size="md" variant="surface">
          <Tabs.List>
            <Tabs.Trigger value="surface">Surface Trigger</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Tabs.Root defaultValue="line" size="md" variant="line">
          <Tabs.List>
            <Tabs.Trigger value="line">Line Trigger</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </>,
    )

    const surfaceTrigger = screen.getByRole('tab', { name: 'Surface Trigger' })
    const lineTrigger = screen.getByRole('tab', { name: 'Line Trigger' })

    expect(surfaceTrigger.className).toContain(segmentedItemBySize.md)
    expect(lineTrigger.className).toContain(segmentedUnderlineItemBySize.md)
  })

  it('enables hover classes by default and allows disabling them', () => {
    const { rerender } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const trigger = screen.getByRole('tab', { name: 'B' })
    expect(trigger.className).toContain('enabled:hover:text-foreground')
    expect(trigger.className).toContain('enabled:cursor-pointer')

    rerender(
      <Tabs.Root defaultValue="a" hover={false}>
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    expect(trigger.className).toContain('cursor-default')
    expect(trigger.className).not.toContain('enabled:hover:text-foreground')
  })

  it('renders configured icons and shows a tooltip for icon-only tabs', async () => {
    const user = userEvent.setup()

    render(
      <Tabs.Root
        defaultValue="phone"
        icons={{
          position: 'only',
          icons: [
            { value: 'phone', icon: 'phone' },
            { value: 'email', icon: 'mail' },
          ],
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value="phone">Phone</Tabs.Trigger>
          <Tabs.Trigger value="email">Email</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const tab = screen.getByRole('tab', { name: 'Phone' })
    expect(tab).toHaveAttribute('aria-label', 'Phone')

    await waitFor(() => {
      expect(tab.querySelector('svg')).toBeInTheDocument()
    })

    await user.hover(tab)
    await waitFor(() => {
      expect(screen.getAllByText('Phone').length).toBeGreaterThan(1)
    })
  })
})
