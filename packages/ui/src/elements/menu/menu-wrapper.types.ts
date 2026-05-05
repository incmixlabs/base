import type * as React from 'react'
import type { Color } from '@/theme/tokens'
import type { MenuSize, MenuVariant } from './menu.props'

export type MenuWrapperMode = 'dropdown' | 'context'

type MenuWrapperBaseItem = {
  /** Stable identifier for analytics/state restoration. */
  id: string
  /** Human-readable item label. */
  label: string
  /** Optional per-item semantic color lane. */
  color?: Color
  /** Keyboard shortcut hint. */
  shortcut?: string
  /** Disabled visual/interaction state. */
  disabled?: boolean
  /** Text style flags. */
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
}

export type MenuWrapperActionItem = MenuWrapperBaseItem & {
  kind?: 'item'
  onSelect?: () => void
}

export type MenuWrapperCheckboxItem = MenuWrapperBaseItem & {
  kind: 'checkbox'
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export type MenuWrapperRadioOption = {
  id: string
  label: string
  value: string
  color?: Color
  disabled?: boolean
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
}

export type MenuWrapperRadioGroup = {
  kind: 'radio-group'
  id: string
  value?: string
  onValueChange?: (value: string) => void
  items: MenuWrapperRadioOption[]
}

export type MenuWrapperSubmenu = MenuWrapperBaseItem & {
  kind: 'submenu'
  items: MenuWrapperEntry[]
}

export type MenuWrapperLabel = {
  kind: 'label'
  id?: string
  label: string
}

export type MenuWrapperSeparator = {
  kind: 'separator'
  id?: string
}

export type MenuWrapperEntry =
  | MenuWrapperActionItem
  | MenuWrapperCheckboxItem
  | MenuWrapperRadioGroup
  | MenuWrapperSubmenu
  | MenuWrapperLabel
  | MenuWrapperSeparator

export type MenuWrapperGroup = {
  id: string
  label?: string
  items: MenuWrapperEntry[]
}

export type MenuWrapperData = MenuWrapperGroup[]

export type MenuWrapperRenderItem = (item: MenuWrapperEntry, defaultRender: React.ReactNode) => React.ReactNode
export type MenuWrapperRenderGroup = (group: MenuWrapperGroup, defaultRender: React.ReactNode) => React.ReactNode

type MenuWrapperSharedProps = {
  /** Data groups rendered into menu content. */
  data: MenuWrapperData
  /** Trigger node for dropdown or context menu region. */
  trigger?: React.ReactNode
  /** Wrapper-level size/variant/color passed to menu content primitives. */
  size?: MenuSize
  variant?: MenuVariant
  color?: Color
  /** Useful when data is JSON from backend and handlers are wired centrally. */
  onItemSelect?: (item: MenuWrapperActionItem) => void
  onCheckboxChange?: (item: MenuWrapperCheckboxItem, checked: boolean) => void
  onRadioValueChange?: (group: MenuWrapperRadioGroup, value: string) => void
  /** Escape hatch overrides for custom rendering. */
  renderItem?: MenuWrapperRenderItem
  renderGroup?: MenuWrapperRenderGroup
  /** Style hooks for wrapper/content roots. */
  className?: string
  contentClassName?: string
}

export type DropdownMenuWrapperProps = MenuWrapperSharedProps & {
  /** Select trigger behavior mode. */
  mode?: 'dropdown'
  /** Dropdown-only positioning props. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Controlled state for dropdown mode only. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ContextMenuWrapperProps = MenuWrapperSharedProps & {
  /** Select trigger behavior mode. */
  mode: 'context'
}

export type MenuWrapperProps = DropdownMenuWrapperProps | ContextMenuWrapperProps
