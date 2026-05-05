import type * as React from 'react'
import type { AvatarProps } from '@/elements/avatar/avatar.props'
import type { BadgeProps } from '@/elements/badge/Badge'
import type { PriorityIconPriority } from '@/elements/priority-icon/PriorityIcon'
import type { StatusIconStatus } from '@/elements/status-icon/StatusIcon'
import type { CheckboxProps } from '@/form/Checkbox'
import type { SemanticColorKey } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

export type TableStringRenderer = {
  type: 'string'
}

type TableLabelRendererValue = {
  value: string
  label?: React.ReactNode
  color?: Color
  variant?: BadgeProps['variant']
}

type TableLabelRenderer = {
  type: 'label'
  color?: Color | null
  variant?: BadgeProps['variant']
  radius?: BadgeProps['radius']
  monochrome?: Color | null
  values?: TableLabelRendererValue[]
}

type TableAvatarRenderer = {
  type: 'avatar'
  size?: AvatarProps['size']
  display?: 'icon-and-label' | 'icon-only'
  values?: AvatarProps[]
}

type TableAvatarGroupRenderer = {
  type: 'avatar-group'
  size?: AvatarProps['size']
  max?: number
  values?: AvatarProps[]
}

type TableCheckboxRenderer = {
  type: 'checkbox'
  color?: CheckboxProps['color']
  variant?: CheckboxProps['variant']
}

type TableTimelineRenderer = {
  type: 'timeline'
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle']
  color?: SemanticColorKey
  values?: Array<{
    value: string
    color: SemanticColorKey
  }>
}

type TableSparklineRenderer = {
  type: 'sparkline'
  color?: string
  strokeWidth?: number
  width?: number
  height?: number
}

type TablePriorityDisplay = 'icon-and-label' | 'icon-only' | 'label-only'

type TablePriorityRendererValue = {
  value: PriorityIconPriority
  label?: React.ReactNode
  color?: Color
  icon?: string
}

type TablePriorityRenderer = {
  type: 'priority'
  display?: TablePriorityDisplay
  variant?: BadgeProps['variant']
  values?: TablePriorityRendererValue[]
}

type TableStatusDisplay = 'icon-and-label' | 'icon-only' | 'label-only'

type TableStatusRendererValue = {
  value: StatusIconStatus
  label?: React.ReactNode
  icon?: string
  color?: Color
}

type TableStatusRenderer = {
  type: 'status'
  display?: TableStatusDisplay
  variant?: BadgeProps['variant']
  values?: TableStatusRendererValue[]
}

type TableClassificationDisplay = 'icon-and-label' | 'icon-only' | 'label-only'

export type TableClassificationValue = 'bug' | 'release' | 'feature' | 'checklist' | 'milestone'

type TableClassificationRendererValue = {
  value: TableClassificationValue
  label?: React.ReactNode
  icon?: string
  color?: Color
}

type TableClassificationRenderer = {
  type: 'classification'
  display?: TableClassificationDisplay
  variant?: BadgeProps['variant']
  values?: TableClassificationRendererValue[]
}

export type TableCellRenderer =
  | TableStringRenderer
  | TableLabelRenderer
  | TableAvatarRenderer
  | TableAvatarGroupRenderer
  | TableCheckboxRenderer
  | TableTimelineRenderer
  | TableSparklineRenderer
  | TablePriorityRenderer
  | TableStatusRenderer
  | TableClassificationRenderer

export type TableLabelCellValue =
  | string
  | number
  | {
      value: string
      label?: React.ReactNode
      color?: Color
      variant?: BadgeProps['variant']
      radius?: BadgeProps['radius']
    }

export type TableAvatarCellValue = string | AvatarProps

export type TableAvatarGroupCellValue = AvatarProps[] | { items: AvatarProps[] }

export type TableCheckboxCellValue = boolean | { checked: boolean; indeterminate?: boolean }

export type TableTimelineCellValue =
  | string
  | number
  | Date
  | {
      date: string | number | Date
      label?: React.ReactNode
      value?: string
      color?: SemanticColorKey
    }
  | {
      start: string | number | Date
      end: string | number | Date
      current?: string | number | Date
      label?: React.ReactNode
      value?: string
      color?: SemanticColorKey
    }

export type TableSparklineCellValue = number[] | { data: number[]; color?: string }

export type TablePriorityCellValue =
  | PriorityIconPriority
  | {
      value: PriorityIconPriority
      label?: React.ReactNode
      color?: Color
      icon?: string
    }

export type TableStatusCellValue =
  | StatusIconStatus
  | {
      value: StatusIconStatus
      label?: React.ReactNode
      icon?: string
    }

export type TableClassificationCellValue =
  | TableClassificationValue
  | {
      value: TableClassificationValue
      label?: React.ReactNode
      color?: Color
      icon?: string
    }

export type TableCellValue =
  | React.ReactNode
  | TableLabelCellValue
  | TableAvatarCellValue
  | TableAvatarGroupCellValue
  | TableCheckboxCellValue
  | TableTimelineCellValue
  | TableSparklineCellValue
  | TablePriorityCellValue
  | TableStatusCellValue
  | TableClassificationCellValue

export type TableCellRender = {
  Label: TableLabelCellValue
  Avatar: TableAvatarCellValue
  AvatarGroup: TableAvatarGroupCellValue
  Checkbox: TableCheckboxCellValue
  Timeline: TableTimelineCellValue
  Sparkline: TableSparklineCellValue
  Priority: TablePriorityCellValue
  Status: TableStatusCellValue
  Classification: TableClassificationCellValue
  Renderer: TableCellRenderer
}
