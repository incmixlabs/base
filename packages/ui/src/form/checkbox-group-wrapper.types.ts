import type * as React from 'react'
import type { Color } from '@/theme/tokens'
import type { CheckboxGroupProps } from './CheckboxGroup'
import type { CheckboxSize, CheckboxVariant } from './checkbox.css'

export type CheckboxGroupWrapperItem = {
  value: string
  label?: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

export type CheckboxGroupWrapperRenderItem = (
  item: CheckboxGroupWrapperItem,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type CheckboxGroupWrapperProps = Omit<CheckboxGroupProps, 'children'> & {
  data: CheckboxGroupWrapperItem[]
  size?: CheckboxSize
  variant?: CheckboxVariant
  color?: Color
  renderItem?: CheckboxGroupWrapperRenderItem
}
