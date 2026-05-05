import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Container, type ContainerProps } from './Container'
import {
  containerAlignResponsive,
  containerBase,
  containerDisplayResponsive,
  containerSizeResponsive,
} from './container.css'
import { containerPropDefs } from './container.props'

afterEach(() => {
  cleanup()
})

function expectClassToken(element: Element | null | undefined, className: string) {
  expect(element).toBeInTheDocument()
  expect(element?.className.split(/\s+/)).toContain(className)
}

describe('Container', () => {
  it('places the query host on the outer container and applies responsive classes to the inner target', () => {
    const [size1, , , size4] = containerPropDefs.size.values
    const [alignLeft, alignCenter] = containerPropDefs.align.values
    const [displayNone, displayInitial] = containerPropDefs.display.values
    const props = {
      size: { initial: size1, lg: size4 },
      align: { initial: alignLeft, md: alignCenter },
      display: { initial: displayInitial, xl: displayNone },
    } satisfies Pick<ContainerProps, 'size' | 'align' | 'display'>

    render(
      <Container size={props.size} align={props.align} display={props.display}>
        Content
      </Container>,
    )

    const innerContainer = screen.getByText('Content').closest('div')
    const outerContainer = innerContainer?.parentElement

    expect(outerContainer).toBeInTheDocument()
    expect(outerContainer?.className).toContain(containerBase)
    expectClassToken(innerContainer, 'flex')
    expectClassToken(innerContainer, 'items-start')
    expect(innerContainer?.className).toContain(containerSizeResponsive.lg[props.size.lg])
    expect(innerContainer?.className).toContain(containerAlignResponsive.md[props.align.md])
    expect(innerContainer?.className).toContain(containerDisplayResponsive.xl[props.display.xl])
  })

  it('keeps the default flex display when responsive display omits an initial value', () => {
    const display = { lg: containerPropDefs.display.values[0] } satisfies ContainerProps['display']

    render(<Container display={display}>Responsive Content</Container>)

    const innerContainer = screen.getByText('Responsive Content').closest('div')

    expectClassToken(innerContainer, 'flex')
    expect(innerContainer?.className).toContain(containerDisplayResponsive.lg[display.lg])
  })

  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Container data-testid="container">Content</Container>
      </Theme>,
    )

    expect(screen.getByTestId('container').style.borderRadius).toBe(designTokens.radius.lg)
  })

  it('applies layout composition to the inner container without forwarding layout props', () => {
    render(
      <Container data-testid="container" layout="grid" layoutProps={{ columns: '2', gap: '3' }}>
        <span>One</span>
        <span>Two</span>
      </Container>,
    )

    const innerContainer = screen.getByText('One').closest('div')
    const outerContainer = screen.getByTestId('container')

    expectClassToken(innerContainer, 'grid')
    expect(innerContainer?.className.split(/\s+/)).not.toContain('items-center')
    expect(innerContainer?.getAttribute('style')).toContain('grid-template-columns:')
    expect(innerContainer?.getAttribute('style')).toContain('gap:')
    expect(outerContainer).not.toHaveAttribute('layout')
    expect(outerContainer).not.toHaveAttribute('layoutProps')
  })
})
