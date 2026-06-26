'use client'

import * as React from 'react'
import { Slot } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { radiusClassByToken } from '@/theme/helpers'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius, SurfaceColorKey } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
  surfaceShapeVariants,
  surfaceSquare,
  surfaceUnoColorVariants,
  surfaceUnoFocusColorVariants,
  surfaceUnoHighContrastColorVariants,
  surfaceUnoHoverColorVariants,
  surfaceUnoSelectedColorVariants,
} from './surface.class'
import type { SurfaceShape, SurfaceVariant } from './surface.props'
import { surfacePropDefs } from './surface.props'

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  variant?: SurfaceVariant
  tone?: SurfaceColorKey
  color?: SurfaceColorKey
  radius?: Radius
  highContrast?: boolean
  hover?: boolean
  focus?: boolean
  selected?: boolean
  shape?: SurfaceShape
  square?: boolean
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      asChild = false,
      variant = surfacePropDefs.variant.default,
      tone,
      color = SemanticColor.neutral,
      radius: radiusProp,
      highContrast = surfacePropDefs.highContrast.default,
      hover = surfacePropDefs.hover.default,
      focus = surfacePropDefs.focus.default,
      selected = surfacePropDefs.selected.default,
      shape = surfacePropDefs.shape.default,
      square = surfacePropDefs.square.default,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div'
    const safeVariant = normalizeEnumPropValue(surfacePropDefs.variant, variant) ?? surfacePropDefs.variant.default
    const safeColor = (normalizeEnumPropValue(surfacePropDefs.tone, tone) ??
      normalizeEnumPropValue(surfacePropDefs.color, color) ??
      SemanticColor.neutral) as SurfaceColorKey
    const safeShape = normalizeEnumPropValue(surfacePropDefs.shape, shape) ?? surfacePropDefs.shape.default
    const safeRadius = normalizeEnumPropValue(surfacePropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(surfacePropDefs.highContrast, highContrast) ?? false
    const safeHover = normalizeBooleanPropValue(surfacePropDefs.hover, hover)
    const safeFocus = normalizeBooleanPropValue(surfacePropDefs.focus, focus) ?? false
    const safeSelected = normalizeBooleanPropValue(surfacePropDefs.selected, selected) ?? false
    const safeSquare = normalizeBooleanPropValue(surfacePropDefs.square, square)
    const radius = useThemeRadius(safeRadius)
    const colorVariantClassName = safeHighContrast
      ? surfaceUnoHighContrastColorVariants[safeColor][safeVariant]
      : surfaceUnoColorVariants[safeColor][safeVariant]

    return (
      <Comp
        ref={ref}
        className={cn(
          'relative box-border border',
          radiusClassByToken[radius],
          colorVariantClassName,
          safeHover && surfaceHoverEnabledClass,
          safeHover && surfaceUnoHoverColorVariants[safeColor][safeVariant],
          safeFocus && surfaceUnoFocusColorVariants[safeColor],
          safeSelected && surfaceUnoSelectedColorVariants[safeColor],
          safeHighContrast && 'af-high-contrast',
          safeHighContrast && surfaceHighContrastByVariant[safeVariant],
          surfaceShapeVariants[safeShape],
          safeSquare && surfaceSquare,
          className,
        )}
        data-selected={safeSelected ? '' : undefined}
        style={{ ...getRadiusStyles(radius), ...style }}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

Surface.displayName = 'Surface'
