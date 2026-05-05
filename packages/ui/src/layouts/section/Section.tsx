'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  getMergedSlotClassName,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  hasBorderWidthUtility,
  type Responsive,
  type SectionSize,
  type SharedLayoutProps,
  Slot,
} from '../layout-utils'
import {
  type SectionDisplay,
  sectionBase,
  sectionBaseCls,
  sectionByDisplay,
  sectionBySize,
  sectionDisplayResponsive,
  sectionSizeResponsive,
} from './Section.css'

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

// Generate responsive size classes
function getSectionSizeClasses(sizeProp: Responsive<SectionSize> | undefined): string {
  if (!sizeProp) return sectionBySize['3']
  if (typeof sizeProp === 'string') return sectionBySize[sizeProp]

  const classes: string[] = []
  if (sizeProp.initial) classes.push(sectionBySize[sizeProp.initial])
  if (sizeProp.xs) classes.push(sectionSizeResponsive.xs[sizeProp.xs])
  if (sizeProp.sm) classes.push(sectionSizeResponsive.sm[sizeProp.sm])
  if (sizeProp.md) classes.push(sectionSizeResponsive.md[sizeProp.md])
  if (sizeProp.lg) classes.push(sectionSizeResponsive.lg[sizeProp.lg])
  if (sizeProp.xl) classes.push(sectionSizeResponsive.xl[sizeProp.xl])
  return classes.join(' ')
}

// Generate responsive display classes
function getSectionDisplayClasses(displayProp: Responsive<SectionDisplay> | undefined): string {
  if (!displayProp) return ''
  if (typeof displayProp === 'string') return sectionByDisplay[displayProp]

  const classes: string[] = []
  if (displayProp.initial) classes.push(sectionByDisplay[displayProp.initial])
  if (displayProp.xs) classes.push(sectionDisplayResponsive.xs[displayProp.xs])
  if (displayProp.sm) classes.push(sectionDisplayResponsive.sm[displayProp.sm])
  if (displayProp.md) classes.push(sectionDisplayResponsive.md[displayProp.md])
  if (displayProp.lg) classes.push(sectionDisplayResponsive.lg[displayProp.lg])
  if (displayProp.xl) classes.push(sectionDisplayResponsive.xl[displayProp.xl])
  return classes.join(' ')
}

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
      getSectionDisplayClasses(display),
      !hasPaddingOverride && getSectionSizeClasses(size),
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
