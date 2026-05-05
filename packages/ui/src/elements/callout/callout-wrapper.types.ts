import type * as React from 'react'
import type { ButtonProps } from '@/elements/button/Button'
import type { Color } from '@/theme/tokens'
import type { CalloutProps, CalloutVariant } from './Callout'

export type CalloutWrapperAction = {
  id: string
  label: React.ReactNode
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  disabled?: boolean
  variant?: ButtonProps['variant']
  color?: Color
  onSelect?: () => void
}

export type CalloutWrapperData = {
  title?: React.ReactNode
  message: React.ReactNode
  variant?: CalloutVariant
  color?: Color
  actions?: CalloutWrapperAction[]
  icon?: string
}

export type CalloutWrapperRenderAction = (
  action: CalloutWrapperAction,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type CalloutWrapperProps = Omit<CalloutProps.Root, 'children' | 'variant' | 'color'> & {
  data: CalloutWrapperData
  variant?: CalloutVariant
  color?: Color
  onActionSelect?: (action: CalloutWrapperAction) => void
  renderAction?: CalloutWrapperRenderAction
}
