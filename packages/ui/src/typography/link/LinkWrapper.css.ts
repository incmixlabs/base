import { SPACING_TO_PIXELS } from '@incmix/theme'
import { style, styleVariants } from '@vanilla-extract/css'
import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@/theme/tokens'

const gapValues = Object.keys(SPACING_TO_PIXELS) as Array<keyof typeof SPACING_TO_PIXELS>

export const linkWrapperQueryHost = style({
  containerType: 'inline-size',
  minWidth: 0,
})

export const linkWrapperInner = style({
  display: 'flex',
  minWidth: 0,
})

export const linkWrapperGap = styleVariants(
  Object.fromEntries(gapValues.map(gap => [gap, { gap: SPACING_TO_PIXELS[gap] }])),
) as Record<(typeof gapValues)[number], string>

export const linkWrapperGapResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [
    bp,
    styleVariants(
      Object.fromEntries(
        gapValues.map(gap => [
          gap,
          {
            '@container': {
              [`(min-width: ${containerBreakpoints[bp]})`]: {
                gap: SPACING_TO_PIXELS[gap],
              },
            },
          },
        ]),
      ) as Record<(typeof gapValues)[number], { '@container': Record<string, { gap: string }> }>,
    ),
  ]),
) as Record<ContainerBreakpoint, Record<(typeof gapValues)[number], string>>
