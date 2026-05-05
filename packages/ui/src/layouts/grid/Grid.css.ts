import { style, styleVariants } from '@vanilla-extract/css'
import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@/theme/tokens'

export const gridBaseCls = 'box-border'

export const gridBase = style({
  containerType: 'inline-size',
  display: 'grid',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gridTemplateRows: 'none',
})

export const gridByDisplay = styleVariants({
  none: { display: 'none' },
  grid: { display: 'grid' },
  'inline-grid': { display: 'inline-grid' },
})

export const gridByFlow = styleVariants({
  row: { gridAutoFlow: 'row' },
  column: { gridAutoFlow: 'column' },
  dense: { gridAutoFlow: 'dense' },
  'row-dense': { gridAutoFlow: 'row dense' },
  'column-dense': { gridAutoFlow: 'column dense' },
})

export const gridByAlign = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  baseline: { alignItems: 'baseline' },
  stretch: { alignItems: 'stretch' },
})

export const gridByAlignContent = styleVariants({
  start: { alignContent: 'flex-start' },
  center: { alignContent: 'center' },
  end: { alignContent: 'flex-end' },
  baseline: { alignContent: 'baseline' },
  between: { alignContent: 'space-between' },
  around: { alignContent: 'space-around' },
  evenly: { alignContent: 'space-evenly' },
  stretch: { alignContent: 'stretch' },
})

export const gridByJustify = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
})

export const gridByJustifyItems = styleVariants({
  start: { justifyItems: 'start' },
  center: { justifyItems: 'center' },
  end: { justifyItems: 'end' },
  baseline: { justifyItems: 'baseline' },
  stretch: { justifyItems: 'stretch' },
})

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

export const gridColumns = styleVariants(
  Object.fromEntries(
    Object.entries(gridColumnTemplates).map(([key, value]) => [key, { gridTemplateColumns: value }]),
  ) as Record<GridColumnValue, { gridTemplateColumns: string }>,
)

export const gridRows = styleVariants(
  Object.fromEntries(
    Object.entries(gridRowTemplates).map(([key, value]) => [key, { gridTemplateRows: value }]),
  ) as Record<GridRowValue, { gridTemplateRows: string }>,
)

export const gridColumnsResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants(
      Object.fromEntries(
        Object.entries(gridColumnTemplates).map(([key, value]) => [
          key,
          {
            '@container': {
              [`(min-width: ${containerBreakpoints[bp]})`]: {
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
              [`(min-width: ${containerBreakpoints[bp]})`]: {
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
        [`(min-width: ${containerBreakpoints[bp]})`]: {
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
        [`(min-width: ${containerBreakpoints[bp]})`]: {
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
        [`(min-width: ${containerBreakpoints[bp]})`]: {
          gridTemplateRows: `var(--grid-template-rows-${bp})`,
        },
      },
    }),
  ]),
) as Record<GridBreakpoint, string>
