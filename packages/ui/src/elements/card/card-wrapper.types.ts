import type * as React from 'react'
import type { ButtonProps } from '@/elements/button/Button'
import type { Radius, Responsive } from '@/theme/tokens'
import type { CardProps } from './Card'
import type { CardSize, CardVariant } from './card.props'

export type CardWrapperAction = {
  id: string
  label: React.ReactNode
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  disabled?: boolean
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
  onSelect?: () => void
}

export type CardWrapperData = {
  title?: React.ReactNode
  description?: React.ReactNode
  media?: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
  actions?: CardWrapperAction[]
  /** Optional style defaults used when the same prop is not passed at wrapper level. */
  size?: Responsive<CardSize>
  /** Optional style defaults used when the same prop is not passed at wrapper level. */
  variant?: CardVariant
  /** Optional style defaults used when the same prop is not passed at wrapper level. */
  color?: CardProps.Root['color']
  /** Optional style defaults used when the same prop is not passed at wrapper level. */
  radius?: Radius
}

export type CardWrapperRenderAction = (action: CardWrapperAction, defaultRender: React.ReactNode) => React.ReactNode

export type CardWrapperRenderSlot = (
  slot: 'media' | 'header' | 'content' | 'footer',
  defaultRender: React.ReactNode,
) => React.ReactNode

export type CardWrapperProps = Omit<CardProps.Root, 'children' | 'size' | 'variant' | 'color' | 'radius'> & {
  data: CardWrapperData
  /** Wrapper-level override; takes precedence over data.size when provided. */
  size?: Responsive<CardSize>
  /** Wrapper-level override; takes precedence over data.variant when provided. */
  variant?: CardVariant
  /** Wrapper-level override; takes precedence over data.color when provided. */
  color?: CardProps.Root['color']
  /** Wrapper-level override; takes precedence over data.radius when provided. */
  radius?: Radius
  onActionSelect?: (action: CardWrapperAction) => void
  renderAction?: CardWrapperRenderAction
  renderSlot?: CardWrapperRenderSlot
}
