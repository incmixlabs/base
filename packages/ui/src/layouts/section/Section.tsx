'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  getMergedSlotClassName,
  getResponsiveLayoutClasses,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  hasBorderWidthUtility,
  type Responsive,
  type SharedLayoutProps,
  Slot,
} from '../layout-utils'
import {
  sectionBase,
  sectionBaseCls,
  sectionByDisplay,
  sectionBySize,
  sectionDisplayResponsive,
  sectionSizeResponsive,
} from './section.class'
import type { SectionDisplay, SectionSize } from './section.props'

export type { SectionDisplay, SectionSize }

// ============================================================================
// Section Props
// ============================================================================

export interface SectionOwnProps extends SharedLayoutProps {
  /** Merge props onto child element */
  asChild?: boolean
  /** CSS display property */
  display?: Responsive<SectionDisplay>
  /** Vertical padding size */
  size?: Responsive<SectionSize>
}

export type SectionProps = SectionOwnProps & Omit<React.ComponentPropsWithoutRef<'section'>, keyof SectionOwnProps>

// ============================================================================
// Section Component
// ============================================================================

/** Section export. */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      asChild = false,
      className,
      style,
      // Section-specific props
      display,
      size = '3',
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
    const Comp = asChild ? Slot : 'section'
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

    // Only apply default size padding if py/p/pt/pb are not specified
    const hasPaddingOverride = py !== undefined || p !== undefined || pt !== undefined || pb !== undefined

    const classes = cn(
      sectionBaseCls,
      sectionBase,
      getResponsiveLayoutClasses(display, sectionByDisplay, sectionDisplayResponsive),
      !hasPaddingOverride && getResponsiveLayoutClasses(size, sectionBySize, sectionSizeResponsive, '3'),
      borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const styles: React.CSSProperties = {
      ...getSharedLayoutStyles(sharedLayoutProps),
      ...style,
    }

    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        style={Object.keys(styles).length > 0 ? styles : undefined}
        {...restProps}
      >
        {children}
      </Comp>
    )
  },
)

Section.displayName = 'Section'
