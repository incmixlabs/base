import type * as React from 'react'
import type { Color, Radius } from '@/theme/tokens'
import type { SwitchGroupProps, SwitchGroupSize } from './SwitchGroup'

export type SwitchGroupWrapperItem = {
  name: string
  label?: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

export type SwitchGroupWrapperRenderItem = (
  item: SwitchGroupWrapperItem,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type SwitchGroupWrapperProps = Omit<SwitchGroupProps, 'children'> & {
  data: SwitchGroupWrapperItem[]
  size?: SwitchGroupSize
  variant?: 'surface' | 'classic' | 'soft'
  color?: Color
  radius?: Radius
  renderItem?: SwitchGroupWrapperRenderItem
}
