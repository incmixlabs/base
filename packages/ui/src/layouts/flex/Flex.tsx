'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type AlignItems,
  type Display,
  type FlexDirection,
  type FlexWrap,
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
  gap?: Responsive<Spacing>
  /** Horizontal gap between items */
  gapX?: Responsive<Spacing>
  /** Vertical gap between items */
  gapY?: Responsive<Spacing>
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
    const resolvedDisplay = display

    const classes = cn(
      flexBaseCls,
      flexBase,
      typeof resolvedDisplay === 'string' ? flexByDisplay[resolvedDisplay] : '',
      typeof resolvedDisplay !== 'string' ? getDisplayClasses(resolvedDisplay as Responsive<Display>) : '',
      typeof direction === 'string' ? flexByDirection[direction] : '',
      typeof direction !== 'string' ? getFlexDirectionClasses(direction) : '',
      typeof wrap === 'string' ? flexByWrap[wrap] : '',
      typeof wrap !== 'string' ? getFlexWrapClasses(wrap) : '',
      typeof align === 'string' ? flexByAlign[align] : '',
      typeof align !== 'string' ? getAlignItemsClasses(align) : '',
      typeof justify === 'string' ? flexByJustify[justify] : '',
      typeof justify !== 'string' ? getJustifyContentClasses(justify) : '',
      typeof gap === 'string' ? '' : getSpacingClasses(gap, 'gap'),
      typeof gapX === 'string' ? '' : getSpacingClasses(gapX, 'gap-x'),
      typeof gapY === 'string' ? '' : getSpacingClasses(gapY, 'gap-y'),
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const styles: React.CSSProperties = {
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

Flex.displayName = 'Flex'

export const Row = React.forwardRef<HTMLElement, RowProps>((props, ref) => (
  <Flex {...props} ref={ref} direction="row" />
))

Row.displayName = 'Row'

export const Column = React.forwardRef<HTMLElement, ColumnProps>((props, ref) => (
  <Flex {...props} ref={ref} direction="column" />
))

Column.displayName = 'Column'
