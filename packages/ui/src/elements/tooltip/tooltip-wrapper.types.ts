import type * as React from 'react'
import type { Color, Radius } from '@/theme/tokens'
import type { TooltipMaxWidth, TooltipSize, TooltipVariant } from './Tooltip'

export type TooltipWrapperItem = {
  id: string
  label: React.ReactNode
  value?: React.ReactNode
  description?: React.ReactNode
}

export type TooltipWrapperData = {
  title?: React.ReactNode
  description?: React.ReactNode
  items?: TooltipWrapperItem[]
  footer?: React.ReactNode
}

export type TooltipWrapperRenderItem = (item: TooltipWrapperItem, defaultRender: React.ReactNode) => React.ReactNode

export type TooltipWrapperProps = {
  data: TooltipWrapperData
  trigger: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showArrow?: boolean
  renderItem?: TooltipWrapperRenderItem
  variant?: TooltipVariant
  color?: Color
  highContrast?: boolean
  radius?: Radius
  size?: TooltipSize
  maxWidth?: TooltipMaxWidth
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  className?: string
  contentClassName?: string
}
