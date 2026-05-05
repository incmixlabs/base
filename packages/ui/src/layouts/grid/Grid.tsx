'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type AlignContent,
  type AlignItems,
  type Display,
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
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  getSpacingClasses,
  hasBorderWidthUtility,
  isGridColumnsValue,
  isGridRowsValue,
  type JustifyItems,
  type Responsive,
  type SharedLayoutProps,
  Slot,
  type Spacing,
  spacingToPixels,
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
} from './Grid.css'

// ============================================================================
// Grid Props
// ============================================================================

type GridDisplay = 'none' | 'grid' | 'inline-grid'
type GridJustify = 'start' | 'center' | 'end' | 'between'

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

function filterResponsiveGridValues<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValid: (value: string) => value is T,
): Responsive<T> | undefined {
  if (!prop) return undefined

  if (typeof prop === 'string') {
    return isValid(prop) ? prop : undefined
  }

  const filtered: Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', T>> = {}

  if (prop.initial && isValid(prop.initial)) filtered.initial = prop.initial
  if (prop.xs && isValid(prop.xs)) filtered.xs = prop.xs
  if (prop.sm && isValid(prop.sm)) filtered.sm = prop.sm
  if (prop.md && isValid(prop.md)) filtered.md = prop.md
  if (prop.lg && isValid(prop.lg)) filtered.lg = prop.lg
  if (prop.xl && isValid(prop.xl)) filtered.xl = prop.xl

  return Object.keys(filtered).length > 0 ? (filtered as Responsive<T>) : undefined
}

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
    const resolvedDisplay = display || 'grid'

    const mappedColumns = filterResponsiveGridValues(columns, isGridColumnsValue)
    const mappedRows = filterResponsiveGridValues(rows, isGridRowsValue)
    const columnClasses = getGridColumnsClasses(mappedColumns)
    const rowClasses = getGridRowsClasses(mappedRows)
    const hasCustomColumns = typeof columns === 'string' && !columnClasses
    const hasTokenColumns = typeof columns === 'string' && !!columnClasses
    const hasCustomRows = typeof rows === 'string' && !rowClasses

    const classes = cn(
      gridBaseCls,
      gridBase,
      typeof resolvedDisplay === 'string' ? gridByDisplay[resolvedDisplay] : '',
      typeof resolvedDisplay !== 'string' ? getDisplayClasses(resolvedDisplay as Responsive<Display>) : '',
      typeof flow === 'string' ? gridByFlow[flow] : '',
      typeof flow !== 'string' ? getGridFlowClasses(flow) : '',
      typeof align === 'string' ? gridByAlign[align] : '',
      typeof align !== 'string' ? getAlignItemsClasses(align) : '',
      typeof alignContent === 'string' ? gridByAlignContent[alignContent] : '',
      typeof alignContent !== 'string' ? getAlignContentClasses(alignContent) : '',
      typeof justify === 'string' ? gridByJustify[justify] : '',
      typeof justify !== 'string' ? getJustifyContentClasses(justify) : '',
      typeof justifyItems === 'string' ? gridByJustifyItems[justifyItems] : '',
      typeof justifyItems !== 'string' ? getJustifyItemsClasses(justifyItems) : '',
      typeof gap === 'string' ? '' : getSpacingClasses(gap, 'gap'),
      typeof gapX === 'string' ? '' : getSpacingClasses(gapX, 'gap-x'),
      typeof gapY === 'string' ? '' : getSpacingClasses(gapY, 'gap-y'),
      columns ? columnClasses : gridColumns['1'],
      rows ? rowClasses : '',
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    // Build grid-specific styles.
    const gridStyles: React.CSSProperties = {
      ...(areas && typeof areas === 'string' && { gridTemplateAreas: areas }),
      // Preserve arbitrary templates (e.g. "1fr 2fr") while keeping deterministic token rendering.
      ...(hasCustomColumns && { gridTemplateColumns: columns }),
      ...(hasTokenColumns && {
        gridTemplateColumns: columns === 'none' ? 'none' : `repeat(${columns}, minmax(0, 1fr))`,
      }),
      ...(hasCustomRows && { gridTemplateRows: rows }),
    }

    const styles: React.CSSProperties = {
      ...gridStyles,
      ...(typeof gap === 'string' && { gap: spacingToPixels[gap] }),
      ...(typeof gapX === 'string' && { columnGap: spacingToPixels[gapX] }),
      ...(typeof gapY === 'string' && { rowGap: spacingToPixels[gapY] }),
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
