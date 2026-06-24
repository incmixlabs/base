import { style, styleVariants } from '@vanilla-extract/css'
import { containerBreakpointQuery } from '@/theme/helpers/responsive/breakpoints'
import { type ContainerBreakpoint, containerBreakpointKeys } from '@/theme/tokens'
import { type GridColumnValue, type GridRowValue, gridColumnTemplates, gridRowTemplates } from './Grid.classes'

export const gridBase = style({
  containerType: 'inline-size',
})

const breakpointKeys = containerBreakpointKeys
type GridBreakpoint = ContainerBreakpoint

export const gridColumnsResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants(
      Object.fromEntries(
        Object.entries(gridColumnTemplates).map(([key, value]) => [
          key,
          {
            '@container': {
              [containerBreakpointQuery.up(bp)]: {
                gridTemplateColumns: value,
              },
            },
          },
        ]),
      ) as Record<GridColumnValue, { '@container': Record<string, { gridTemplateColumns: string }> }>,
    ),
  ]),
) as Record<GridBreakpoint, Record<GridColumnValue, string>>

export const gridRowsResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants(
      Object.fromEntries(
        Object.entries(gridRowTemplates).map(([key, value]) => [
          key,
          {
            '@container': {
              [containerBreakpointQuery.up(bp)]: {
                gridTemplateRows: value,
              },
            },
          },
        ]),
      ) as Record<GridRowValue, { '@container': Record<string, { gridTemplateRows: string }> }>,
    ),
  ]),
) as Record<GridBreakpoint, Record<GridRowValue, string>>

export const gridTemplateAreasCustomResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    style({
      '@container': {
        [containerBreakpointQuery.up(bp)]: {
          gridTemplateAreas: `var(--grid-template-areas-${bp})`,
        },
      },
    }),
  ]),
) as Record<GridBreakpoint, string>

export const gridTemplateColumnsCustomResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    style({
      '@container': {
        [containerBreakpointQuery.up(bp)]: {
          gridTemplateColumns: `var(--grid-template-columns-${bp})`,
        },
      },
    }),
  ]),
) as Record<GridBreakpoint, string>

export const gridTemplateRowsCustomResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    style({
      '@container': {
        [containerBreakpointQuery.up(bp)]: {
          gridTemplateRows: `var(--grid-template-rows-${bp})`,
        },
      },
    }),
  ]),
) as Record<GridBreakpoint, string>
