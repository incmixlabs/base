import type * as React from 'react'
import type { ButtonProps } from '@/elements/button/Button'
import type { Color, Radius } from '@/theme/tokens'
import type { PopoverContentMaxWidth, PopoverContentSize, PopoverContentVariant } from './popover.props'

export type PopoverWrapperAction = {
  id: string
  label: React.ReactNode
  variant?: ButtonProps['variant']
  color?: Color
  disabled?: boolean
  closeOnSelect?: boolean
  onSelect?: () => void
}

export type PopoverWrapperField = {
  id: string
  label: React.ReactNode
  value?: React.ReactNode
  description?: React.ReactNode
}

export type PopoverWrapperSection = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  fields?: PopoverWrapperField[]
  actions?: PopoverWrapperAction[]
}

export type PopoverWrapperData = {
  title?: React.ReactNode
  description?: React.ReactNode
  sections: PopoverWrapperSection[]
}

export type PopoverWrapperRenderField = (
  section: PopoverWrapperSection,
  field: PopoverWrapperField,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type PopoverWrapperRenderSection = (
  section: PopoverWrapperSection,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type PopoverWrapperRenderAction = (
  section: PopoverWrapperSection,
  action: PopoverWrapperAction,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type PopoverWrapperProps = {
  data: PopoverWrapperData
  trigger: React.ReactNode
  showClose?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onActionSelect?: (action: PopoverWrapperAction, section: PopoverWrapperSection) => void
  renderField?: PopoverWrapperRenderField
  renderSection?: PopoverWrapperRenderSection
  renderAction?: PopoverWrapperRenderAction
  variant?: PopoverContentVariant
  color?: Color
  highContrast?: boolean
  radius?: Radius
  size?: PopoverContentSize
  maxWidth?: PopoverContentMaxWidth
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  className?: string
  contentClassName?: string
}
