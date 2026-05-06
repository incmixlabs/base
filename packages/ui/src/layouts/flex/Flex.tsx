'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { resolveSpacingValue } from '@/theme/helpers'
import {
  type AlignItems,
  type Display,
  type FlexDirection,
  type FlexWrap,
  filterResponsiveTokenValues,
  getAlignItemsClasses,
  getDisplayClasses,
  getFlexDirectionClasses,
  getFlexWrapClasses,
  getJustifyContentClasses,
  getMergedSlotClassName,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  getSpacingClasses,
  hasBorderWidthUtility,
  isSpacingValue,
  normalizeResponsiveEnumOrStringPropValue,
  normalizeResponsiveEnumPropValue,
  type Responsive,
  type SharedLayoutProps,
  Slot,
  type Spacing,
  spacingToPixels,
} from '../layout-utils'
import {
  flexBase,
  flexBaseCls,
  flexByAlign,
  flexByDirection,
  flexByDisplay,
  flexByJustify,
  flexByWrap,
} from './Flex.css'
import { flexPropDefs } from './flex.props'

// ============================================================================
// Flex Props
// ============================================================================

type FlexDisplay = 'none' | 'flex' | 'inline-flex'
type FlexJustify = 'start' | 'center' | 'end' | 'between'

export interface FlexOwnProps extends SharedLayoutProps {
  /** Render as a different element */
  as?: 'div' | 'span'
  /** Merge props onto child element */
  asChild?: boolean
  /** CSS display property */
  display?: Responsive<FlexDisplay>
  /** Flex direction */
  direction?: Responsive<FlexDirection>
  /** Align items along the cross axis */
  align?: Responsive<AlignItems>
  /** Justify content along the main axis */
  justify?: Responsive<FlexJustify>
  /** Flex wrap behavior */
  wrap?: Responsive<FlexWrap>
  /** Gap between items */
  gap?: Responsive<Spacing | string>
  /** Horizontal gap between items */
  gapX?: Responsive<Spacing | string>
  /** Vertical gap between items */
  gapY?: Responsive<Spacing | string>
}

type FlexDivProps = FlexOwnProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof FlexOwnProps>
type FlexSpanProps = FlexOwnProps & { as: 'span' } & Omit<React.ComponentPropsWithoutRef<'span'>, keyof FlexOwnProps>

export type FlexProps = FlexDivProps | FlexSpanProps
export type RowProps = Omit<FlexProps, 'direction'>
export type ColumnProps = Omit<FlexProps, 'direction'>

// ============================================================================
// Flex Component
// ============================================================================

/** Flex export. */
export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  (
    {
      as: Tag = 'div',
      asChild = false,
      className,
      style,
      // Flex-specific props
      display = 'flex',
      direction,
      align,
      justify,
      wrap,
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

    // display already defaults to 'flex' via destructuring
    const resolvedDisplay = normalizeResponsiveEnumPropValue(flexPropDefs.display, display) ?? 'flex'
    const resolvedDirection = normalizeResponsiveEnumPropValue(flexPropDefs.direction, direction)
    const resolvedWrap = normalizeResponsiveEnumPropValue(flexPropDefs.wrap, wrap)
    const resolvedAlign = normalizeResponsiveEnumPropValue(flexPropDefs.align, align)
    const resolvedJustify = normalizeResponsiveEnumPropValue(flexPropDefs.justify, justify)
    const resolvedGap = normalizeResponsiveEnumOrStringPropValue(flexPropDefs.gap, gap)
    const resolvedGapX = normalizeResponsiveEnumOrStringPropValue(flexPropDefs.gapX, gapX)
    const resolvedGapY = normalizeResponsiveEnumOrStringPropValue(flexPropDefs.gapY, gapY)

    const classes = cn(
      flexBaseCls,
      flexBase,
      typeof resolvedDisplay === 'string' ? flexByDisplay[resolvedDisplay] : '',
      typeof resolvedDisplay !== 'string' ? getDisplayClasses(resolvedDisplay as Responsive<Display>) : '',
      typeof resolvedDirection === 'string' ? flexByDirection[resolvedDirection] : '',
      typeof resolvedDirection !== 'string' ? getFlexDirectionClasses(resolvedDirection) : '',
      typeof resolvedWrap === 'string' ? flexByWrap[resolvedWrap] : '',
      typeof resolvedWrap !== 'string' ? getFlexWrapClasses(resolvedWrap) : '',
      typeof resolvedAlign === 'string' ? flexByAlign[resolvedAlign] : '',
      typeof resolvedAlign !== 'string' ? getAlignItemsClasses(resolvedAlign) : '',
      typeof resolvedJustify === 'string' ? flexByJustify[resolvedJustify] : '',
      typeof resolvedJustify !== 'string' ? getJustifyContentClasses(resolvedJustify) : '',
      typeof resolvedGap === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGap, isSpacingValue), 'gap'),
      typeof resolvedGapX === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGapX, isSpacingValue), 'gap-x'),
      typeof resolvedGapY === 'string'
        ? ''
        : getSpacingClasses(filterResponsiveTokenValues(resolvedGapY, isSpacingValue), 'gap-y'),
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const styles: React.CSSProperties = {
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

Flex.displayName = 'Flex'

export const Row = React.forwardRef<HTMLElement, RowProps>((props, ref) => (
  <Flex {...props} ref={ref} direction="row" />
))

Row.displayName = 'Row'

export const Column = React.forwardRef<HTMLElement, ColumnProps>((props, ref) => (
  <Flex {...props} ref={ref} direction="column" />
))

Column.displayName = 'Column'
