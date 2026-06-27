import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Info } from 'lucide-react'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { designTokens } from '@/theme/tokens'
import { Callout } from './Callout'
import {
  calloutColorVariants,
  calloutHoverColorVariants,
  calloutIconSizeVariants,
  calloutInverseByVariant,
  calloutRootSizeVariants,
  calloutSplitIconBase,
  calloutSplitIconColorVariants,
  calloutSplitSlotSizeVariants,
  calloutSplitTextBase,
} from './callout.class'
import { calloutRootPropDefs } from './callout.props'

afterEach(() => {
  cleanup()
})

describe('Callout', () => {
  it('normalizes whitespace around color and variant', () => {
    render(
      <Callout.Root data-testid="callout" color={' info ' as any} variant={' soft ' as any}>
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    expect(root.className).toContain(calloutColorVariants.info.soft)
  })

  it('falls back to default color and surface variant for invalid values', () => {
    render(
      <Callout.Root data-testid="callout" color={'not-a-color' as any} variant={'invalid' as any}>
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    expect(root.className).toContain(calloutColorVariants[SemanticColor.slate].surface)
  })

  it('falls back to default size for invalid values', () => {
    render(
      <Callout.Root data-testid="callout" size={'9' as any}>
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    expect(root.className).toContain(calloutRootSizeVariants[calloutRootPropDefs.size.default])
  })

  it('applies radius token via css variable', () => {
    render(
      <Callout.Root data-testid="callout-default">
        <Callout.Text>Default Radius</Callout.Text>
      </Callout.Root>,
    )
    render(
      <Callout.Root data-testid="callout-full" radius="full">
        <Callout.Text>Full Radius</Callout.Text>
      </Callout.Root>,
    )

    const defaultRoot = screen.getByTestId('callout-default')
    const fullRoot = screen.getByTestId('callout-full')

    expect(defaultRoot.style.getPropertyValue('--element-border-radius')).toBe(designTokens.radius.lg)
    expect(fullRoot.style.getPropertyValue('--element-border-radius')).toBe(designTokens.radius.full)
  })

  it('defaults hover to false and applies hover styles when enabled', () => {
    const { rerender } = render(
      <Callout.Root data-testid="callout">
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    expect(root.className).not.toContain(calloutHoverColorVariants.slate.surface)

    rerender(
      <Callout.Root data-testid="callout" hover>
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )
    expect(root.className).toContain(calloutHoverColorVariants.slate.surface)
  })

  it('supports split variant class mapping', () => {
    render(
      <Callout.Root data-testid="callout" color="info" variant="split">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Split</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    const icon = root.querySelector('[data-slot="callout-icon"]')
    const text = root.querySelector('[data-slot="callout-text"]')

    expect(root.className).toContain(calloutColorVariants.info.split)
    expect(root.classList.contains('border-info')).toBe(true)
    expect(icon?.className).toContain(calloutSplitIconBase)
    expect(icon?.className).toContain(calloutSplitSlotSizeVariants[calloutRootPropDefs.size.default])
    expect(icon?.className).toContain(calloutSplitIconColorVariants.info.split)
    expect(text?.className).toContain(calloutSplitTextBase)
    expect(text?.className).toContain('bg-neutral-surface')
    expect(text?.className).toContain('border-l')
    expect(text?.className).toContain('border-info')
    expect(text?.className).toContain(calloutSplitSlotSizeVariants[calloutRootPropDefs.size.default])
  })

  it('renders icon and text directly from root props', async () => {
    const { container } = render(
      <Callout.Root data-testid="callout" color="info" size="2x" icon="info" text="Dynamic icon" />,
    )

    expect(screen.getByText('Dynamic icon')).toBeInTheDocument()
    await waitFor(() => {
      expect(container.querySelector('[data-slot="callout-icon"] svg')).not.toBeNull()
    })

    const root = screen.getByTestId('callout')
    const icon = root.querySelector('[data-slot="callout-icon"]')
    expect(root.className).toContain(calloutRootSizeVariants['2x'])
    expect(icon?.className).toContain(calloutIconSizeVariants['2x'])
  })

  it('uses solid contrast class by default and applies inverse override when enabled', () => {
    const { rerender } = render(
      <Callout.Root data-testid="callout" color="secondary" variant="solid">
        <Callout.Text>Solid</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')
    expect(root.className).toContain(calloutColorVariants.secondary.solid)
    expect(root.classList.contains(calloutInverseByVariant.secondary.solid)).toBe(false)

    rerender(
      <Callout.Root data-testid="callout" color="secondary" variant="solid" inverse>
        <Callout.Text>Solid</Callout.Text>
      </Callout.Root>,
    )
    expect(root.classList.contains('bg-secondary-solid')).toBe(true)
    expect(root.classList.contains('border-secondary')).toBe(true)
    expect(root.classList.contains(calloutInverseByVariant.secondary.solid)).toBe(true)
  })

  it('applies responsive padding props on the root', () => {
    render(
      <Callout.Root data-testid="callout" px={{ initial: '2', lg: '5' }}>
        <Callout.Text>Test</Callout.Text>
      </Callout.Root>,
    )

    const root = screen.getByTestId('callout')

    expect(root).toHaveClass('px-2', 'lg:px-5')
  })
})
