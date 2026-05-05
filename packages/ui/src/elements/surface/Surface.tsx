'use client'

import * as React from 'react'
import { Slot } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius, SurfaceColorKey } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
  surfaceShapeVariants,
  surfaceSquare,
} from './surface.css'
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
    const radius = useThemeRadius(safeRadius)

    return (
      <Comp
        ref={ref}
        className={cn(
          'relative box-border border rounded-[var(--element-border-radius)]',
          surfaceColorVariants[safeColor][safeVariant],
          hover && surfaceHoverEnabledClass,
          highContrast && 'af-high-contrast',
          highContrast && surfaceHighContrastByVariant[safeVariant],
          surfaceShapeVariants[safeShape],
          square && surfaceSquare,
          className,
        )}
        style={{ ...getRadiusStyles(radius), ...style }}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

Surface.displayName = 'Surface'
