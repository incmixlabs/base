import { style, styleVariants } from '@vanilla-extract/css'
import { cardSizeVar } from '@/theme/runtime/component-vars'
import { panelSizeTokens } from '@/theme/token-maps'
import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@/theme/tokens'
import { cardSizes } from './card.props'

const cardPaddingBySize = {
  xs: panelSizeTokens.xs.padding,
  sm: panelSizeTokens.sm.padding,
  md: panelSizeTokens.md.padding,
  lg: panelSizeTokens.lg.padding,
  xl: panelSizeTokens.xl.padding,
} as const

export const cardRootBase = style({
  containerType: 'inline-size',
})

export const cardSurfaceBase = style({})

export const cardHeaderBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

export const cardTitleBase = style({
  fontSize: '1.125rem',
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.025em',
})

export const cardContentBase = style({
  paddingTop: '1rem',
})

export const cardFooterBase = style({
  display: 'flex',
  alignItems: 'center',
  paddingTop: '1rem',
})

export const cardRootSizeVariants = styleVariants(
  Object.fromEntries(
    cardSizes.map(size => [
      size,
      {
        vars: {
          '--inset-padding': `var(--theme-rhythm-card-padding-${size}, ${cardSizeVar(size, 'padding', cardPaddingBySize[size])})`,
          '--inset-border-width': '0px',
        },
        padding: `var(--theme-rhythm-card-padding-${size}, ${cardSizeVar(size, 'padding', cardPaddingBySize[size])})`,
      },
    ]),
  ) as unknown as Record<(typeof cardSizes)[number], { vars: Record<string, string>; padding: string }>,
)

export const cardRootSizeResponsiveVariants = Object.fromEntries(
  containerBreakpointKeys.map(bp => [
    bp,
    styleVariants(
      Object.fromEntries(
        cardSizes.map(size => [
          size,
          {
            '@container': {
              [`(min-width: ${containerBreakpoints[bp]})`]: {
                vars: {
                  '--inset-padding': `var(--theme-rhythm-card-padding-${size}, ${cardSizeVar(size, 'padding', cardPaddingBySize[size])})`,
                  '--inset-border-width': '0px',
                },
                padding: `var(--theme-rhythm-card-padding-${size}, ${cardSizeVar(size, 'padding', cardPaddingBySize[size])})`,
              },
            },
          },
        ]),
      ) as unknown as Record<
        (typeof cardSizes)[number],
        { '@container': Record<string, { vars: Record<string, string>; padding: string }> }
      >,
    ),
  ]),
) as Record<ContainerBreakpoint, Record<(typeof cardSizes)[number], string>>
