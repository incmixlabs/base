'use client'

import * as React from 'react'
import {
  extractLayoutCompositionProps,
  extractSharedLayoutProps,
  getLayoutCompositionClasses,
  getLayoutCompositionStyles,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  type LayoutCompositionProps,
  type SharedLayoutProps,
} from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius, Responsive, SurfaceColorKey } from '@/theme/tokens'
import { Text } from '@/typography/text/Text'
import { Surface } from '../surface/Surface'
import type { SurfaceShape } from '../surface/surface.props'
import {
  cardContentBase,
  cardFooterBase,
  cardHeaderBase,
  cardRootBase,
  cardRootSizeResponsiveVariants,
  cardRootSizeVariants,
  cardSurfaceBase,
  cardTitleBase,
} from './Card.css'
import type { CardSize, CardVariant } from './card.props'
import { cardPropDefs } from './card.props'

interface CardRootOwnProps extends SharedLayoutProps, LayoutCompositionProps {
  /** Size (padding) */
  size?: Responsive<CardSize>
  /** Visual variant */
  variant?: CardVariant
  /** Preferred alias for surface tone on the card surface. */
  tone?: SurfaceColorKey
  /** Surface tone for the card surface, including semantic and chart tones. */
  color?: SurfaceColorKey
  /** Border radius token */
  radius?: Radius
  /** High contrast mode */
  highContrast?: boolean
  /** Geometric shape */
  shape?: SurfaceShape
  /** Force a square aspect ratio */
  square?: boolean
  /** As child element */
  asChild?: boolean
}

export type CardRootProps = CardRootOwnProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof CardRootOwnProps>

/** CardRoot export. */
export const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      size = 'xs',
      variant = 'surface',
      tone,
      color = SemanticColor.neutral,
      radius,
      highContrast = cardPropDefs.highContrast.default,
      shape = cardPropDefs.shape.default,
      square = cardPropDefs.square.default,
      asChild = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedRadius = normalizeEnumPropValue(cardPropDefs.radius, radius) as Radius | undefined
    const { layoutProps: layoutCompositionProps, rest: propsWithoutLayoutComposition } =
      extractLayoutCompositionProps(props)
    const { layoutProps: sharedLayoutProps, rest: rootProps } = extractSharedLayoutProps({
      ...propsWithoutLayoutComposition,
      radius: resolvedRadius,
    })
    const hasExplicitPaddingProps = [
      sharedLayoutProps.p,
      sharedLayoutProps.px,
      sharedLayoutProps.py,
      sharedLayoutProps.pt,
      sharedLayoutProps.pr,
      sharedLayoutProps.pb,
      sharedLayoutProps.pl,
    ].some(value => value !== undefined)
    const resolveSize = (value: unknown) =>
      (normalizeEnumPropValue(cardPropDefs.size, value) ?? cardPropDefs.size.default) as CardSize
    const sizeClasses = hasExplicitPaddingProps
      ? []
      : typeof size === 'string'
        ? [cardRootSizeVariants[resolveSize(size)]]
        : [
            cardRootSizeVariants[resolveSize(size.initial)],
            ...(size.xs ? [cardRootSizeResponsiveVariants.xs[resolveSize(size.xs)]] : []),
            ...(size.sm ? [cardRootSizeResponsiveVariants.sm[resolveSize(size.sm)]] : []),
            ...(size.md ? [cardRootSizeResponsiveVariants.md[resolveSize(size.md)]] : []),
            ...(size.lg ? [cardRootSizeResponsiveVariants.lg[resolveSize(size.lg)]] : []),
            ...(size.xl ? [cardRootSizeResponsiveVariants.xl[resolveSize(size.xl)]] : []),
          ]
    const resolvedVariant = normalizeEnumPropValue(cardPropDefs.variant, variant) ?? cardPropDefs.variant.default
    const resolvedColor = (normalizeEnumPropValue(cardPropDefs.tone, tone) ??
      normalizeEnumPropValue(cardPropDefs.color, color) ??
      SemanticColor.neutral) as SurfaceColorKey
    const resolvedShape = (normalizeEnumPropValue(cardPropDefs.shape, shape) ??
      cardPropDefs.shape.default) as SurfaceShape
    return (
      <Surface
        ref={ref}
        asChild={asChild}
        variant={resolvedVariant}
        color={resolvedColor}
        radius={resolvedRadius}
        highContrast={highContrast}
        shape={resolvedShape}
        square={square}
        className={cn(
          cardRootBase,
          cardSurfaceBase,
          ...sizeClasses,
          getLayoutCompositionClasses(layoutCompositionProps),
          getSharedLayoutClasses(sharedLayoutProps),
          className,
        )}
        style={
          {
            ...getLayoutCompositionStyles(layoutCompositionProps),
            ...getSharedLayoutStyles(sharedLayoutProps),
            ...style,
            '--inset-border-radius': 'var(--element-border-radius)',
          } as React.CSSProperties
        }
        {...rootProps}
      >
        {children}
      </Surface>
    )
  },
)

CardRoot.displayName = 'Card.Root'

// ============================================================================
// Card Header
// ============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/** CardHeader export. */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardHeaderBase, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardHeader.displayName = 'Card.Header'

// ============================================================================
// Card Title
// ============================================================================

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** As child element */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/** CardTitle export. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Comp = 'h3', className, children, ...props }, ref) => {
    return (
      <Comp ref={ref} className={cn(cardTitleBase, className)} {...props}>
        {children}
      </Comp>
    )
  },
)

CardTitle.displayName = 'Card.Title'

// ============================================================================
// Card Description
// ============================================================================

export interface CardDescriptionProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> {}

/** CardDescription export. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text ref={ref} as="p" size="sm" variant="muted" className={className} {...props}>
        {children}
      </Text>
    )
  },
)

CardDescription.displayName = 'Card.Description'

// ============================================================================
// Card Content
// ============================================================================

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** CardContent export. */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardContentBase, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardContent.displayName = 'Card.Content'

// ============================================================================
// Card Footer
// ============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/** CardFooter export. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardFooterBase, className)} {...props}>
        {children}
      </div>
    )
  },
)

CardFooter.displayName = 'Card.Footer'

// ============================================================================
// Export compound component
// ============================================================================

/** Card export. */
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
}

export namespace CardProps {
  export type Root = CardRootProps
  export type Header = CardHeaderProps
  export type Title = CardTitleProps
  export type Description = CardDescriptionProps
  export type Content = CardContentProps
  export type Footer = CardFooterProps
}
