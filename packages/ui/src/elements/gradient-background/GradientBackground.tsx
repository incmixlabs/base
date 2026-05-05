'use client'

import * as React from 'react'
import { Card, type CardProps } from '@/elements/card/Card'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Box, type BoxProps } from '@/layouts/box/Box'
import { Container, type ContainerProps } from '@/layouts/container/Container'
import {
  getLayoutCompositionClasses,
  getLayoutCompositionStyles,
  type LayoutCompositionProps,
} from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import type { Radius } from '@/theme/tokens'
import { type GradientPresetKey, gradientPresets } from './gradient-presets'

const KEYFRAMES_STYLE_ID = 'af-gradient-background-keyframes'
const KEYFRAMES_CSS = `@keyframes af-gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`

function useGradientBackgroundKeyframes(enabled: boolean) {
  React.useInsertionEffect(() => {
    if (!enabled || typeof document === 'undefined' || document.getElementById(KEYFRAMES_STYLE_ID)) return

    const style = document.createElement('style')
    style.id = KEYFRAMES_STYLE_ID
    style.textContent = KEYFRAMES_CSS
    document.head.appendChild(style)
  }, [enabled])
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GradientBackgroundOwnProps {
  /** Gradient color stops (CSS color values). */
  colors?: string[]
  /** Named preset from the built-in collection. Overridden by `colors`. */
  preset?: GradientPresetKey
  /** Animation cycle duration in seconds. Set to `0` to disable animation. */
  duration?: number
  /** CSS linear-gradient angle in degrees. */
  direction?: number
  /** Border-radius token. Defaults to the current ThemeProvider radius. */
  radius?: Radius
  /** Child layout mode for the rendered gradient root. */
  layout?: LayoutCompositionProps['layout']
  /** Layout props applied when `layout` is set. Kept nested to avoid conflicts with target props. */
  layoutProps?: Omit<LayoutCompositionProps, 'layout'>
}

type NativeGradientBackgroundProps = GradientBackgroundOwnProps & { as?: 'div' } & Omit<
    React.HTMLAttributes<HTMLDivElement>,
    keyof GradientBackgroundOwnProps | 'as'
  >
type GradientBoxProps = GradientBackgroundOwnProps & { as: 'Box' } & Omit<
    BoxProps,
    keyof GradientBackgroundOwnProps | 'as'
  >
type GradientCardProps = GradientBackgroundOwnProps & { as: 'Card' } & Omit<
    CardProps.Root,
    keyof GradientBackgroundOwnProps | 'as'
  >
type GradientContainerProps = GradientBackgroundOwnProps & { as: 'Container' } & Omit<
    ContainerProps,
    keyof GradientBackgroundOwnProps | 'as'
  >

export type GradientBackgroundProps =
  | NativeGradientBackgroundProps
  | GradientBoxProps
  | GradientCardProps
  | GradientContainerProps

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const GradientBackground = React.forwardRef<HTMLDivElement, GradientBackgroundProps>(
  (
    {
      as = 'div',
      colors,
      preset = 'cosmic',
      duration = 15,
      direction = 135,
      radius,
      layout,
      layoutProps,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolvedColors = colors && colors.length >= 2 ? colors : gradientPresets[preset].colors
    const gradient = `linear-gradient(${direction}deg, ${resolvedColors.join(', ')})`
    const resolvedRadius = useThemeRadius(radius)

    const animated = duration > 0
    useGradientBackgroundKeyframes(animated)

    const gradientBaseStyle: React.CSSProperties = {
      background: gradient,
      backgroundSize: animated ? '400% 400%' : undefined,
      animation: animated ? `af-gradient-shift ${duration}s ease infinite` : undefined,
    }
    const gradientLayoutProps: LayoutCompositionProps = { layout, ...layoutProps }
    const layoutClassName = getLayoutCompositionClasses(gradientLayoutProps)
    const layoutStyle = getLayoutCompositionStyles(gradientLayoutProps)
    const nativeGradientStyle: React.CSSProperties = {
      ...gradientBaseStyle,
      ...getRadiusStyles(resolvedRadius),
      ...layoutStyle,
      ...style,
    }
    const primitiveGradientStyle: React.CSSProperties = {
      ...gradientBaseStyle,
      ...layoutStyle,
      ...style,
    }
    const containerGradientStyle: React.CSSProperties = {
      ...gradientBaseStyle,
      ...style,
    }
    const nativeClassName = cn('overflow-hidden rounded-[var(--element-border-radius)]', layoutClassName, className)
    const primitiveClassName = cn('overflow-hidden', layoutClassName, className)

    if (as === 'Box') {
      return (
        <Box
          ref={ref}
          radius={resolvedRadius}
          className={primitiveClassName}
          style={primitiveGradientStyle}
          {...(rest as Omit<BoxProps, 'as' | 'radius' | 'className' | 'style'>)}
        >
          {children}
        </Box>
      )
    }

    if (as === 'Card') {
      return (
        <Card.Root
          ref={ref}
          radius={resolvedRadius}
          className={primitiveClassName}
          style={primitiveGradientStyle}
          {...(rest as Omit<CardProps.Root, 'radius' | 'className' | 'style'>)}
        >
          {children}
        </Card.Root>
      )
    }

    if (as === 'Container') {
      const { width, minWidth, maxWidth, height, minHeight, maxHeight, ...containerProps } = rest as Omit<
        ContainerProps,
        'radius' | 'className' | 'style'
      >
      const widthProps = getWidthProps({ width, minWidth, maxWidth })
      const heightProps = getHeightProps({ height, minHeight, maxHeight })
      return (
        <Container
          ref={ref}
          radius={resolvedRadius}
          layout={layout}
          layoutProps={layoutProps}
          width={width ?? 'full'}
          minWidth={minWidth}
          maxWidth={maxWidth}
          height={height}
          minHeight={minHeight}
          maxHeight={maxHeight}
          className={cn('overflow-hidden', widthProps.className, heightProps.className, className)}
          style={{ ...containerGradientStyle, ...widthProps.style, ...heightProps.style }}
          {...containerProps}
        >
          {children}
        </Container>
      )
    }

    return (
      <div ref={ref} className={nativeClassName} style={nativeGradientStyle} {...rest}>
        {children}
      </div>
    )
  },
)

GradientBackground.displayName = 'GradientBackground'
