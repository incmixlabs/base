'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { resolveSpacingValue } from '@/theme/helpers'
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
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  getSpacingClasses,
  hasBorderWidthUtility,
  isGridColumnsValue,
  isGridRowsValue,
  isSpacingValue,
  type JustifyItems,
  normalizeResponsiveEnumOrStringPropValue,
  normalizeResponsiveEnumPropValue,
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
import { gridPropDefs } from './grid.props'

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
  gap?: Responsive<Spacing | string>
  /** Horizontal gap between items */
  gapX?: Responsive<Spacing | string>
  /** Vertical gap between items */
  gapY?: Responsive<Spacing | string>
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
    const resolvedGap = normalizeResponsiveEnumOrStringPropValue(gridPropDefs.gap, gap)
    const resolvedGapX = normalizeResponsiveEnumOrStringPropValue(gridPropDefs.gapX, gapX)
    const resolvedGapY = normalizeResponsiveEnumOrStringPropValue(gridPropDefs.gapY, gapY)

    const mappedColumns = filterResponsiveTokenValues(resolvedColumns, isGridColumnsValue)
    const mappedRows = filterResponsiveTokenValues(resolvedRows, isGridRowsValue)
    const columnClasses = getGridColumnsClasses(mappedColumns)
    const rowClasses = getGridRowsClasses(mappedRows)
    const hasCustomColumns = typeof resolvedColumns === 'string' && !columnClasses
    const hasTokenColumns = typeof resolvedColumns === 'string' && !!columnClasses
    const hasCustomRows = typeof resolvedRows === 'string' && !rowClasses

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
      typeof resolvedGap === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGap, isSpacingValue), 'gap'),
      typeof resolvedGapX === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGapX, isSpacingValue), 'gap-x'),
      typeof resolvedGapY === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGapY, isSpacingValue), 'gap-y'),
      resolvedColumns ? columnClasses : gridColumns['1'],
      resolvedRows ? rowClasses : '',
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    // Build grid-specific styles.
    const gridStyles: React.CSSProperties = {
      ...(areas && typeof areas === 'string' && { gridTemplateAreas: areas }),
      // Preserve arbitrary templates (e.g. "1fr 2fr") while keeping deterministic token rendering.
      ...(hasCustomColumns && { gridTemplateColumns: resolvedColumns }),
      ...(hasTokenColumns && {
        gridTemplateColumns: resolvedColumns === 'none' ? 'none' : `repeat(${resolvedColumns}, minmax(0, 1fr))`,
      }),
      ...(hasCustomRows && { gridTemplateRows: resolvedRows }),
    }

    const styles: React.CSSProperties = {
      ...gridStyles,
      ...(typeof resolvedGap === 'string' && { gap: resolveSpacingValue(resolvedGap, spacingToPixels) }),
      ...(typeof resolvedGapX === 'string' && { columnGap: resolveSpacingValue(resolvedGapX, spacingToPixels) }),
      ...(typeof resolvedGapY === 'string' && { rowGap: resolveSpacingValue(resolvedGapY, spacingToPixels) }),
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
