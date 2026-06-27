import { type ContainerBreakpoint, containerBreakpointKeys } from '../../theme/tokens'

export const gridBaseCls = 'box-border'
export const gridBase = '[container-type:inline-size]'

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

export const gridColumnTemplates = {
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

export const gridRowTemplates = {
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  none: 'none',
} as const

export type GridColumnValue = keyof typeof gridColumnTemplates
export type GridRowValue = keyof typeof gridRowTemplates

export const gridColumns = Object.fromEntries(
  Object.keys(gridColumnTemplates).map(key => [key, key === 'none' ? 'grid-cols-none' : `grid-cols-${key}`]),
) as Record<GridColumnValue, string>

export const gridRows = Object.fromEntries(
  Object.keys(gridRowTemplates).map(key => [key, key === 'none' ? 'grid-rows-none' : `grid-rows-${key}`]),
) as Record<GridRowValue, string>

export const gridColumnsResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [
    bp,
    Object.fromEntries(
      Object.keys(gridColumnTemplates).map(key => [key, `cq-${bp}:${gridColumns[key as GridColumnValue]}`]),
    ),
  ]),
) as Record<ContainerBreakpoint, Record<GridColumnValue, string>>

export const gridRowsResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [
    bp,
    Object.fromEntries(Object.keys(gridRowTemplates).map(key => [key, `cq-${bp}:${gridRows[key as GridRowValue]}`])),
  ]),
) as Record<ContainerBreakpoint, Record<GridRowValue, string>>

export const gridTemplateAreasCustomResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [bp, `cq-${bp}:[grid-template-areas:var(--grid-template-areas-${bp})]`]),
) as Record<ContainerBreakpoint, string>

export const gridTemplateColumnsCustomResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [bp, `cq-${bp}:[grid-template-columns:var(--grid-template-columns-${bp})]`]),
) as Record<ContainerBreakpoint, string>

export const gridTemplateRowsCustomResponsive = Object.fromEntries(
  containerBreakpointKeys.map(bp => [bp, `cq-${bp}:[grid-template-rows:var(--grid-template-rows-${bp})]`]),
) as Record<ContainerBreakpoint, string>
