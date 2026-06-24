'use client'

import * as React from 'react'
import { useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { resolveSurfaceToneStyle, type SurfaceColorVariant, type SurfaceForeground } from '@/theme/props/color.prop'
import type { SurfaceColorKey } from '@/theme/tokens'
import {
  type Display,
  extractLayoutCompositionProps,
  extractSharedLayoutProps,
  getDisplayClasses,
  getLayoutCompositionClasses,
  getLayoutCompositionStyles,
  getMergedSlotClassName,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  hasBorderWidthUtility,
  type LayoutCompositionProps,
  type Responsive,
  type SharedLayoutProps,
  Slot,
} from '../layout-utils'

// ============================================================================
// Box Props
// ============================================================================

export interface BoxOwnProps extends SharedLayoutProps, LayoutCompositionProps {
  /** Render as a different element */
  as?: 'div' | 'span'
  /** Merge props onto child element */
  asChild?: boolean
  /** Alias for `p`. */
  padding?: SharedLayoutProps['p']
  /** Alias for `m`. */
  margin?: SharedLayoutProps['m']
  /** CSS display property */
  display?: Responsive<Display>
  /** Preferred alias for the surface tone lane. */
  tone?: BoxColor
  /** Semantic or chart color lane for paired background/text resolution. */
  color?: BoxColor
  /** Surface treatment for the color lane. */
  variant?: BoxVariant
  /** Text color treatment. Defaults to readable text for the selected variant. */
  text?: BoxText
}

type BoxDivProps = BoxOwnProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof BoxOwnProps>
type BoxSpanProps = BoxOwnProps & { as: 'span' } & Omit<React.ComponentPropsWithoutRef<'span'>, keyof BoxOwnProps>

export type BoxProps = BoxDivProps | BoxSpanProps

type BoxColor = SurfaceColorKey
type BoxVariant = SurfaceColorVariant
type BoxText = SurfaceForeground

// ============================================================================
// Box Component
// ============================================================================

/** Box export. */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Tag = 'div',
      asChild = false,
      className,
      style,
      display,
      tone,
      color,
      variant,
      text,
      padding,
      margin,
      children,
      ...props
    },
    ref,
  ) => {
    const { layoutProps: layoutCompositionProps, rest: propsWithoutLayoutComposition } =
      extractLayoutCompositionProps(props)
    const resolvedRadius = useThemeRadius(propsWithoutLayoutComposition.radius)
    const { layoutProps: sharedLayoutProps, rest: restProps } = extractSharedLayoutProps({
      ...propsWithoutLayoutComposition,
      p: propsWithoutLayoutComposition.p ?? padding,
      m: propsWithoutLayoutComposition.m ?? margin,
      radius: resolvedRadius,
    })
    const Comp = asChild ? Slot : Tag
    const effectiveClassName = asChild ? getMergedSlotClassName(children, className) : className

    const classes = cn(
      'box-border',
      !layoutCompositionProps.layout && getDisplayClasses(display),
      getLayoutCompositionClasses(layoutCompositionProps),
      sharedLayoutProps.borderColor && !hasBorderWidthUtility(effectiveClassName) && 'border',
      getSharedLayoutClasses(sharedLayoutProps),
      className,
    )

    const styles: React.CSSProperties = {
      ...resolveSurfaceToneStyle(tone ?? color, variant, text),
      ...getLayoutCompositionStyles(layoutCompositionProps),
      ...getSharedLayoutStyles(sharedLayoutProps),
      ...style,
    }

    return (
      <Comp ref={ref} className={classes} style={Object.keys(styles).length > 0 ? styles : undefined} {...restProps}>
        {children}
      </Comp>
    )
  },
)

Box.displayName = 'Box'
