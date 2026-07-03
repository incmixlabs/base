'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type AlignContent,
  type AlignItems,
  type Display,
  filterResponsiveTokenValues,
  type GridColumns,
  type GridFlow,
  type GridRows,
  getAlignContentClasses,
  getAlignItemsClasses,
  getDisplayClasses,
  getGridColumnsClasses,
  getGridFlowClasses,
  getGridRowsClasses,
  getJustifyContentClasses,
  getJustifyItemsClasses,
  getMergedSlotClassName,
  getResponsiveSpacingValueClasses,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  hasBorderWidthUtility,
  isGridColumnsValue,
  isGridRowsValue,
  type JustifyItems,
  normalizeResponsiveEnumOrStringPropValue,
  normalizeResponsiveEnumPropValue,
  normalizeResponsiveSpacingPropValue,
  type Responsive,
  type SharedLayoutProps,
  Slot,
  type Spacing,
} from '../layout-utils'
import {
  gridBase,
  gridBaseCls,
  gridByAlign,
  gridByAlignContent,
  gridByDisplay,
  gridByFlow,
  gridByJustify,
  gridByJustifyItems,
  gridColumns,
  gridTemplateColumnsCustomResponsive,
  gridTemplateRowsCustomResponsive,
} from './Grid.classes'
import { gridPropDefs } from './grid.props'

// ============================================================================
// Grid Props
// ============================================================================

type GridDisplay = 'none' | 'grid' | 'inline-grid'
type GridJustify = 'start' | 'center' | 'end' | 'between'
const responsiveValueKeys = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const responsiveBreakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const

type ResponsiveValueKey = (typeof responsiveValueKeys)[number]
type ResponsiveBreakpointKey = (typeof responsiveBreakpointKeys)[number]
type GridTemplateCustomProperty = '--grid-template-columns' | '--grid-template-rows'
type GridStyles = React.CSSProperties &
  Partial<Record<`${GridTemplateCustomProperty}-${ResponsiveBreakpointKey}`, string>>

function isResponsiveValue<T>(value: Responsive<T> | undefined): value is Partial<Record<ResponsiveValueKey, T>> {
  return !!value && typeof value === 'object'
}

function hasCustomResponsiveValue<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValidTokenValue: (value: string) => value is T,
): boolean {
  if (!isResponsiveValue(prop)) return false

  return responsiveValueKeys.some(key => {
    const value = prop[key]
    return !!value && !isValidTokenValue(value)
  })
}

function getResponsiveCustomGridTemplateClasses<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValidTokenValue: (value: string) => value is T,
  customResponsiveClasses: Record<ResponsiveBreakpointKey, string>,
): string {
  if (!isResponsiveValue(prop) || !hasCustomResponsiveValue(prop, isValidTokenValue)) return ''

  const classes: string[] = []
  for (const bp of responsiveBreakpointKeys) {
    const value = prop[bp]
    if (value && !isValidTokenValue(value)) classes.push(customResponsiveClasses[bp])
  }

  return classes.join(' ')
}

function getGridColumnTemplate(value: GridColumns) {
  return value === 'none' ? 'none' : `repeat(${value}, minmax(0, 1fr))`
}

function getGridRowTemplate(value: GridRows) {
  return value === 'none' ? 'none' : `repeat(${value}, minmax(0, 1fr))`
}

function getGridTemplateStyleValue<T extends string>(
  value: string,
  isValidTokenValue: (value: string) => value is T,
  tokenValueResolver: (value: T) => string,
): string {
  return isValidTokenValue(value) ? tokenValueResolver(value) : value
}

function assignResponsiveGridTemplateStyles<T extends string>(
  styles: GridStyles,
  prop: Responsive<T | string> | undefined,
  cssProperty: 'gridTemplateColumns' | 'gridTemplateRows',
  customProperty: GridTemplateCustomProperty,
  isValidTokenValue: (value: string) => value is T,
  tokenValueResolver: (value: T) => string,
) {
  if (typeof prop === 'string') {
    styles[cssProperty] = getGridTemplateStyleValue(prop, isValidTokenValue, tokenValueResolver)
    return
  }

  if (!isResponsiveValue(prop) || !hasCustomResponsiveValue(prop, isValidTokenValue)) return

  if (prop.initial && !isValidTokenValue(prop.initial)) {
    styles[cssProperty] = prop.initial
  }

  for (const bp of responsiveBreakpointKeys) {
    const value = prop[bp]
    if (value && !isValidTokenValue(value)) {
      styles[`${customProperty}-${bp}`] = value
    }
  }
}

export interface GridOwnProps extends SharedLayoutProps {
  /** Render as a different element */
  as?: 'div' | 'span'
  /** Merge props onto child element */
  asChild?: boolean
  /** CSS display property */
  display?: Responsive<GridDisplay>
  /** Grid template areas */
  areas?: Responsive<string>
  /** Number of columns */
  columns?: Responsive<GridColumns | string>
  /** Number of rows */
  rows?: Responsive<GridRows | string>
  /** Grid auto-flow direction */
  flow?: Responsive<GridFlow>
  /** Align items along the cross axis */
  align?: Responsive<AlignItems>
  /** Align content along the cross axis */
  alignContent?: Responsive<AlignContent>
  /** Justify content along the main axis */
  justify?: Responsive<GridJustify>
  /** Justify items along the inline axis */
  justifyItems?: Responsive<JustifyItems>
  /** Gap between items */
  gap?: Responsive<Spacing>
  /** Horizontal gap between items */
  gapX?: Responsive<Spacing>
  /** Vertical gap between items */
  gapY?: Responsive<Spacing>
}

type GridDivProps = GridOwnProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof GridOwnProps>
type GridSpanProps = GridOwnProps & { as: 'span' } & Omit<React.ComponentPropsWithoutRef<'span'>, keyof GridOwnProps>

export type GridProps = GridDivProps | GridSpanProps

// ============================================================================
// Grid Component
// ============================================================================

/** Grid export. */
export const Grid = React.forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Tag = 'div',
      asChild = false,
      className,
      style,
      // Grid-specific props
      display,
      areas,
      columns,
      rows,
      flow,
      align,
      alignContent,
      justify,
      justifyItems,
      gap,
      gapX,
      gapY,
      // Shared layout props
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      bg,
      borderColor,
      radius,
      position,
      inset,
      top,
      right,
      bottom,
      left,
      overflow,
      overflowX,
      overflowY,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      justifySelf,
      gridArea,
      gridColumn,
      gridColumnStart,
      gridColumnEnd,
      gridRow,
      gridRowStart,
      gridRowEnd,
      children,
      ...restProps
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : Tag
    const effectiveClassName = asChild ? getMergedSlotClassName(children, className) : className

    const sharedLayoutProps: SharedLayoutProps = {
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      bg,
      borderColor,
      radius,
      position,
      inset,
      top,
      right,
      bottom,
      left,
      overflow,
      overflowX,
      overflowY,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      justifySelf,
      gridArea,
      gridColumn,
      gridColumnStart,
      gridColumnEnd,
      gridRow,
      gridRowStart,
      gridRowEnd,
    }

    // Default to grid display if not specified
    const resolvedDisplay = normalizeResponsiveEnumPropValue(gridPropDefs.display, display) ?? 'grid'
    const resolvedColumns = normalizeResponsiveEnumOrStringPropValue(gridPropDefs.columns, columns)
    const resolvedRows = normalizeResponsiveEnumOrStringPropValue(gridPropDefs.rows, rows)
    const resolvedFlow = normalizeResponsiveEnumPropValue(gridPropDefs.flow, flow)
    const resolvedAlign = normalizeResponsiveEnumPropValue(gridPropDefs.align, align)
    const resolvedAlignContent = normalizeResponsiveEnumPropValue(gridPropDefs.alignContent, alignContent)
    const resolvedJustify = normalizeResponsiveEnumPropValue(gridPropDefs.justify, justify)
    const resolvedJustifyItems = normalizeResponsiveEnumPropValue(gridPropDefs.justifyItems, justifyItems)
    const resolvedGap = normalizeResponsiveSpacingPropValue(gridPropDefs.gap, gap, 'gap', 'Grid')
    const resolvedGapX = normalizeResponsiveSpacingPropValue(gridPropDefs.gapX, gapX, 'gapX', 'Grid')
    const resolvedGapY = normalizeResponsiveSpacingPropValue(gridPropDefs.gapY, gapY, 'gapY', 'Grid')

    const mappedColumns = filterResponsiveTokenValues(resolvedColumns, isGridColumnsValue)
    const mappedRows = filterResponsiveTokenValues(resolvedRows, isGridRowsValue)
    const columnClasses = getGridColumnsClasses(mappedColumns)
    const rowClasses = getGridRowsClasses(mappedRows)
    const columnCustomClasses = getResponsiveCustomGridTemplateClasses(
      resolvedColumns,
      isGridColumnsValue,
      gridTemplateColumnsCustomResponsive,
    )
    const rowCustomClasses = getResponsiveCustomGridTemplateClasses(
      resolvedRows,
      isGridRowsValue,
      gridTemplateRowsCustomResponsive,
    )

    const classes = cn(
      gridBaseCls,
      gridBase,
      typeof resolvedDisplay === 'string' ? gridByDisplay[resolvedDisplay] : '',
      typeof resolvedDisplay !== 'string' ? getDisplayClasses(resolvedDisplay as Responsive<Display>) : '',
      typeof resolvedFlow === 'string' ? gridByFlow[resolvedFlow] : '',
      typeof resolvedFlow !== 'string' ? getGridFlowClasses(resolvedFlow) : '',
      typeof resolvedAlign === 'string' ? gridByAlign[resolvedAlign] : '',
      typeof resolvedAlign !== 'string' ? getAlignItemsClasses(resolvedAlign) : '',
      typeof resolvedAlignContent === 'string' ? gridByAlignContent[resolvedAlignContent] : '',
      typeof resolvedAlignContent !== 'string'
        ? getAlignContentClasses(resolvedAlignContent as Responsive<AlignContent>)
        : '',
      typeof resolvedJustify === 'string' ? gridByJustify[resolvedJustify] : '',
      typeof resolvedJustify !== 'string' ? getJustifyContentClasses(resolvedJustify) : '',
      typeof resolvedJustifyItems === 'string' ? gridByJustifyItems[resolvedJustifyItems] : '',
      typeof resolvedJustifyItems !== 'string'
        ? getJustifyItemsClasses(resolvedJustifyItems as Responsive<JustifyItems>)
        : '',
      getResponsiveSpacingValueClasses(resolvedGap, 'gap'),
      getResponsiveSpacingValueClasses(resolvedGapX, 'gap-x'),
      getResponsiveSpacingValueClasses(resolvedGapY, 'gap-y'),
      resolvedColumns ? columnClasses : gridColumns['1'],
      columnCustomClasses,
      resolvedRows ? rowClasses : '',
      rowCustomClasses,
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    // Build grid-specific styles.
    const gridStyles: GridStyles = {
      ...(areas && typeof areas === 'string' && { gridTemplateAreas: areas }),
    }
    assignResponsiveGridTemplateStyles(
      gridStyles,
      resolvedColumns,
      'gridTemplateColumns',
      '--grid-template-columns',
      isGridColumnsValue,
      getGridColumnTemplate,
    )
    assignResponsiveGridTemplateStyles(
      gridStyles,
      resolvedRows,
      'gridTemplateRows',
      '--grid-template-rows',
      isGridRowsValue,
      getGridRowTemplate,
    )
    const styles: React.CSSProperties = {
      ...gridStyles,
      ...getSharedLayoutStyles(sharedLayoutProps),
      ...style,
    }

    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        style={Object.keys(styles).length > 0 ? styles : undefined}
        {...restProps}
      >
        {children}
      </Comp>
    )
  },
)

Grid.displayName = 'Grid'
