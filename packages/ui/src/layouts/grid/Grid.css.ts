import { style, styleVariants } from '@vanilla-extract/css'
import { containerBreakpointQuery } from '@/theme/helpers/responsive/breakpoints'
import { type ContainerBreakpoint, containerBreakpointKeys } from '@/theme/tokens'

export const gridBaseCls = 'box-border'

export const gridBase = style({
  containerType: 'inline-size',
})

export const gridByDisplay = {
  none: 'hidden',
  grid: 'grid',
  'inline-grid': 'inline-grid',
} as const

export const gridByFlow = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row-dense': 'grid-flow-row-dense',
  'column-dense': 'grid-flow-col-dense',
} as const

export const gridByAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const

export const gridByAlignContent = {
  start: 'content-start',
  center: 'content-center',
  end: 'content-end',
  baseline: '[align-content:baseline]',
  between: 'content-between',
  around: 'content-around',
  evenly: 'content-evenly',
  stretch: 'content-stretch',
} as const

export const gridByJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

export const gridByJustifyItems = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  baseline: '[justify-items:baseline]',
  stretch: 'justify-items-stretch',
} as const

const breakpointKeys = containerBreakpointKeys
type GridBreakpoint = ContainerBreakpoint

const gridColumnTemplates = {
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  '7': 'repeat(7, minmax(0, 1fr))',
  '8': 'repeat(8, minmax(0, 1fr))',
  '9': 'repeat(9, minmax(0, 1fr))',
  '10': 'repeat(10, minmax(0, 1fr))',
  '11': 'repeat(11, minmax(0, 1fr))',
  '12': 'repeat(12, minmax(0, 1fr))',
  none: 'none',
} as const

const gridRowTemplates = {
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  none: 'none',
} as const

type GridColumnValue = keyof typeof gridColumnTemplates
type GridRowValue = keyof typeof gridRowTemplates

export const gridColumns = Object.fromEntries(
  Object.keys(gridColumnTemplates).map(key => [key, key === 'none' ? 'grid-cols-none' : `grid-cols-${key}`]),
) as Record<GridColumnValue, string>

export const gridRows = Object.fromEntries(
  Object.keys(gridRowTemplates).map(key => [key, key === 'none' ? 'grid-rows-none' : `grid-rows-${key}`]),
) as Record<GridRowValue, string>

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
