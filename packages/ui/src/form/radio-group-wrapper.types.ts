import type * as React from 'react'
import type { Color } from '@/theme/tokens'
import type { RadioGroupRootProps, RadioSize, RadioVariant } from './radio-group.props'

export type RadioGroupWrapperItem = {
  value: string
  label?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

export type RadioGroupWrapperRenderItem = (
  item: RadioGroupWrapperItem,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type RadioGroupWrapperProps = Omit<RadioGroupRootProps, 'children'> & {
  data: RadioGroupWrapperItem[]
  size?: RadioSize
  variant?: RadioVariant
  color?: Color
  renderItem?: RadioGroupWrapperRenderItem
}
