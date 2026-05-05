import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { paddingResponsiveClasses, paddingResponsiveVars } from '@/theme/helpers/padding-responsive.css'
import { SemanticColor } from '@/theme/props/color.prop'
import { ScrollArea } from './ScrollArea'
import {
  scrollAreaByDirection,
  scrollAreaBySize,
  scrollAreaByTrackShape,
  scrollAreaByType,
  scrollAreaSurfaceColorVariants,
  scrollAreaThumbColorVariants,
  scrollAreaTrackColorVariants,
} from './scroll-area.css'

afterEach(() => {
  cleanup()
})

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

describe('ScrollArea', () => {
  it('normalizes variant, color, and trackColor props', () => {
    render(
      <ScrollArea
        data-testid="scroll-area"
        type="always"
        variant={' soft ' as any}
        color={' info ' as any}
        trackColor={' neutral ' as any}
      >
        Body
      </ScrollArea>,
    )

    const root = screen.getByTestId('scroll-area')
    expect(root.className).toContain(scrollAreaThumbColorVariants.info.soft)
    expect(root.className).toContain(scrollAreaTrackColorVariants.neutral.soft)
  })

  it('falls back to default token classes for invalid props', () => {
    render(
      <ScrollArea
        data-testid="scroll-area"
        size={'invalid' as any}
        variant={'invalid' as any}
        color={'invalid' as any}
        trackShape={'invalid' as any}
      >
        Body
      </ScrollArea>,
    )

    const root = screen.getByTestId('scroll-area')
    expect(root.className).toContain(scrollAreaBySize.sm)
    expect(root.className).toContain(scrollAreaByTrackShape.line)
    expect(root.className).toContain(scrollAreaByType.hover)
    expect(root.className).toContain(scrollAreaSurfaceColorVariants.neutral.surface)
    expect(root.className).toContain(scrollAreaThumbColorVariants[SemanticColor.neutral].soft)
    expect(root.className).toContain(scrollAreaTrackColorVariants[SemanticColor.neutral].soft)
  })

  it('uses the primary color as the default track color when trackColor is omitted', () => {
    render(
      <ScrollArea data-testid="scroll-area" variant="solid" color="primary">
        Body
      </ScrollArea>,
    )

    const root = screen.getByTestId('scroll-area')
    expect(root.className).toContain(scrollAreaThumbColorVariants.primary.solid)
    expect(root.className).toContain(scrollAreaTrackColorVariants.primary.solid)
  })

  it('uses the primary scroll prop default when no direction props are provided', () => {
    render(<ScrollArea data-testid="scroll-area">Body</ScrollArea>)

    const root = screen.getByTestId('scroll-area')
    expect(root.className).toContain(scrollAreaByDirection.vertical)
    expect(root.className).not.toContain(scrollAreaByDirection.both)
  })

  it('renders directional controls when controls are enabled', () => {
    const { container } = render(
      <ScrollArea controls scroll="both">
        Body
      </ScrollArea>,
    )

    expect(container.querySelector('button[aria-label="Scroll up"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Scroll down"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Scroll left"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Scroll right"]')).not.toBeNull()
  })

  it('disables scrollbar controls when there is no overflow', () => {
    const { container } = render(
      <ScrollArea data-testid="scroll-area" controls scroll="both" className="h-64">
        <div>Body</div>
      </ScrollArea>,
    )

    const root = screen.getByTestId('scroll-area')
    const scrollUp = container.querySelector('button[aria-label="Scroll up"]')
    const scrollDown = container.querySelector('button[aria-label="Scroll down"]')
    const scrollLeft = container.querySelector('button[aria-label="Scroll left"]')
    const scrollRight = container.querySelector('button[aria-label="Scroll right"]')
    const jumpVertical = container.querySelector('button[aria-label="Jump vertical scrollbar"]')
    const jumpHorizontal = container.querySelector('button[aria-label="Jump horizontal scrollbar"]')

    expect(root).toHaveAttribute('data-vertical-rail', 'false')
    expect(root).toHaveAttribute('data-horizontal-rail', 'false')
    expect(scrollUp).toBeDisabled()
    expect(scrollDown).toBeDisabled()
    expect(scrollLeft).toBeDisabled()
    expect(scrollRight).toBeDisabled()
    expect(jumpVertical).toBeDisabled()
    expect(jumpHorizontal).toBeDisabled()
  })

  it('scrolls the viewport when wheeling over the content area', () => {
    const { container } = render(
      <ScrollArea data-testid="scroll-area" scroll="vertical" className="h-64">
        <div style={{ height: 1200 }}>Body</div>
      </ScrollArea>,
    )

    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]') as HTMLDivElement | null
    expect(viewport).not.toBeNull()

    Object.defineProperty(viewport as HTMLDivElement, 'clientHeight', { configurable: true, value: 240 })
    Object.defineProperty(viewport as HTMLDivElement, 'scrollHeight', { configurable: true, value: 1200 })
    Object.defineProperty(viewport as HTMLDivElement, 'scrollTop', { configurable: true, writable: true, value: 0 })

    fireEvent.wheel(viewport as HTMLDivElement, { deltaY: 120 })

    expect((viewport as HTMLDivElement).scrollTop).toBe(120)
  })

  it('applies responsive padding props on the root', () => {
    render(
      <ScrollArea data-testid="scroll-area" py={{ initial: '1', md: '3' }}>
        Body
      </ScrollArea>,
    )

    const root = screen.getByTestId('scroll-area')

    expect(root.className).toContain(paddingResponsiveClasses.py)
    const style = root.getAttribute('style') ?? ''
    expect(style).toContain(`${customPropertyName(paddingResponsiveVars.py.initial)}: var(--space-1, 4px)`)
    expect(style).toContain(`${customPropertyName(paddingResponsiveVars.py.md)}: var(--space-3, 12px)`)
  })
})
