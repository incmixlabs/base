'use client'

import * as React from 'react'
import { useThemeRadius } from '@/elements/utils'
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
import { designTokens, type Radius, type Responsive, type SurfaceColorKey } from '@/theme/tokens'
import { SubTitle, type SubTitleProps } from '@/typography/title/SubTitle'
import { Title, type TitleProps } from '@/typography/title/Title'
import { Surface } from '../surface/Surface'
import type { SurfaceShape } from '../surface/surface.props'
import {
  cardActionsBase,
  cardActionsRevealHoverFocus,
  cardContentActionClearance,
  cardContentBase,
  cardFooterBase,
  cardHeaderBase,
  cardPaddingBySize,
  cardRootBase,
  cardRootSizeClassName,
  cardRootSizeWrapperBase,
  cardTitleBase,
} from './card.class'
import type { CardSize, CardVariant } from './card.props'
import { cardPropDefs } from './card.props'

const responsiveSizeKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const

type CardSizeStyle = React.CSSProperties &
  Record<`--af-card-padding-${'initial' | (typeof responsiveSizeKeys)[number]}`, string>
type CardRootSizeStyle = React.CSSProperties & {
  '--inset-border-width': string
  '--inset-padding': string
}

function cardPaddingValue(size: CardSize) {
  return `var(--theme-rhythm-card-padding-${size}, ${cardPaddingBySize[size]})`
}

function resolveCardSize(value: unknown) {
  return (normalizeEnumPropValue(cardPropDefs.size, value) ?? cardPropDefs.size.default) as CardSize
}

function getCardSizeStyles(size: Responsive<CardSize>): Partial<CardSizeStyle> {
  if (typeof size === 'string') {
    return { '--af-card-padding-initial': cardPaddingValue(resolveCardSize(size)) }
  }

  const styles: Partial<CardSizeStyle> = {
    '--af-card-padding-initial': cardPaddingValue(resolveCardSize(size.initial)),
  }

  for (const key of responsiveSizeKeys) {
    const value = size[key]
    if (value) styles[`--af-card-padding-${key}`] = cardPaddingValue(resolveCardSize(value))
  }

  return styles
}

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
    const themeRadius = useThemeRadius(resolvedRadius)
    const { layoutProps: layoutCompositionProps, rest: propsWithoutLayoutComposition } =
      extractLayoutCompositionProps(props)
    const { layoutProps: sharedLayoutProps, rest: rootProps } = extractSharedLayoutProps({
      ...propsWithoutLayoutComposition,
      radius: resolvedRadius,
    })
    const { onClick: onRootClick, ...surfaceProps } = rootProps
    const hasExplicitPaddingProps = [
      sharedLayoutProps.p,
      sharedLayoutProps.px,
      sharedLayoutProps.py,
      sharedLayoutProps.pt,
      sharedLayoutProps.pr,
      sharedLayoutProps.pb,
      sharedLayoutProps.pl,
    ].some(value => value !== undefined)
    const sizeStyles = hasExplicitPaddingProps ? undefined : getCardSizeStyles(size)
    const asChildSizeStyles =
      asChild && !hasExplicitPaddingProps && sizeStyles
        ? ({
            ...sizeStyles,
            '--inset-border-width': '0px',
            '--inset-padding': 'var(--af-card-padding-initial)',
            padding: 'var(--af-card-padding-initial)',
          } as CardRootSizeStyle)
        : undefined
    const resolvedVariant = normalizeEnumPropValue(cardPropDefs.variant, variant) ?? cardPropDefs.variant.default
    const resolvedColor = (normalizeEnumPropValue(cardPropDefs.tone, tone) ??
      normalizeEnumPropValue(cardPropDefs.color, color) ??
      SemanticColor.neutral) as SurfaceColorKey
    const resolvedShape = (normalizeEnumPropValue(cardPropDefs.shape, shape) ??
      cardPropDefs.shape.default) as SurfaceShape
    const content =
      !asChild && !hasExplicitPaddingProps ? (
        <div className={cn(cardRootSizeWrapperBase, cardRootSizeClassName)} style={sizeStyles as React.CSSProperties}>
          {children}
        </div>
      ) : (
        children
      )

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
          getLayoutCompositionClasses(layoutCompositionProps),
          getSharedLayoutClasses(sharedLayoutProps),
          className,
        )}
        style={
          {
            ...getLayoutCompositionStyles(layoutCompositionProps),
            ...getSharedLayoutStyles(sharedLayoutProps),
            ...asChildSizeStyles,
            ...style,
            '--inset-border-radius': designTokens.radius[themeRadius],
          } as React.CSSProperties
        }
        {...surfaceProps}
        onClick={event => {
          const target = event.target as HTMLElement
          if (target.closest?.('[data-slot="card-actions"]')) {
            event.stopPropagation()
            return
          }
          onRootClick?.(event)
        }}
      >
        {content}
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

export interface CardTitleProps extends Omit<TitleProps, 'asChild'> {}

/** CardTitle export. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Title ref={ref} className={cn(cardTitleBase, className)} {...props}>
        {children}
      </Title>
    )
  },
)

CardTitle.displayName = 'Card.Title'

// ============================================================================
// Card Description
// ============================================================================

export interface CardDescriptionProps extends Omit<SubTitleProps, 'as' | 'asChild'> {}

/** CardDescription export. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <SubTitle ref={ref} as="p" className={className} {...props}>
        {children}
      </SubTitle>
    )
  },
)

CardDescription.displayName = 'Card.Description'

// ============================================================================
// Card Actions
// ============================================================================

export type CardActionsReveal = 'always' | 'hover-focus'

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls whether actions remain visible or appear when the card is hovered or focused. */
  reveal?: CardActionsReveal
}

/** Actions positioned at the logical top-end of the card. */
export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, children, reveal = 'always', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-actions"
        className={cn(cardActionsBase, reveal === 'hover-focus' && cardActionsRevealHoverFocus, className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

CardActions.displayName = 'Card.Actions'

// ============================================================================
// Card Content
// ============================================================================

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** CardContent export. */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, style, ...props }, ref) => {
    const hasActions = React.Children.toArray(children).some(
      child => React.isValidElement(child) && child.type === CardActions,
    )

    return (
      <div
        ref={ref}
        className={cn(cardContentBase, className)}
        style={{ paddingTop: hasActions ? cardContentActionClearance : undefined, ...style }}
        {...props}
      >
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
  Actions: CardActions,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
}

export namespace CardProps {
  export type Root = CardRootProps
  export type Actions = CardActionsProps
  export type Header = CardHeaderProps
  export type Title = CardTitleProps
  export type Description = CardDescriptionProps
  export type Content = CardContentProps
  export type Footer = CardFooterProps
}
