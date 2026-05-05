import type { useRender } from '@base-ui/react/use-render'
import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'

const sidebarSides = ['left', 'right'] as const
const sidebarVariants = ['surface', 'solid', 'soft'] as const
const sidebarCollapsibleModes = ['offcanvas', 'icon', 'none'] as const
const sidebarMenuButtonVariants = ['default', 'outline'] as const
const sidebarMenuButtonSizes = ['default', 'sm', 'lg'] as const
const sidebarMenuSubButtonSizes = ['sm', 'md'] as const
const sidebarGroupAnchors = ['top', 'bottom'] as const

const sidebarRootPropDefs = {
  side: {
    type: 'enum',
    values: sidebarSides,
    default: 'left',
  },
  variant: {
    type: 'enum',
    values: sidebarVariants,
    default: 'soft',
  },
  collapsible: {
    type: 'enum',
    values: sidebarCollapsibleModes,
    default: 'offcanvas',
  },
  color: {
    ...colorPropDef.color,
    default: 'slate',
  },
} satisfies {
  side: PropDef<(typeof sidebarSides)[number]>
  variant: PropDef<(typeof sidebarVariants)[number]>
  collapsible: PropDef<(typeof sidebarCollapsibleModes)[number]>
  color: PropDef<Color>
}

const sidebarMenuButtonPropDefs = {
  variant: {
    type: 'enum',
    values: sidebarMenuButtonVariants,
    default: 'default',
  },
  size: {
    type: 'enum',
    values: sidebarMenuButtonSizes,
    default: 'default',
  },
} satisfies {
  variant: PropDef<(typeof sidebarMenuButtonVariants)[number]>
  size: PropDef<(typeof sidebarMenuButtonSizes)[number]>
}

const sidebarMenuSubButtonPropDefs = {
  size: {
    type: 'enum',
    values: sidebarMenuSubButtonSizes,
    default: 'md',
  },
} satisfies {
  size: PropDef<(typeof sidebarMenuSubButtonSizes)[number]>
}

type SidebarSide = (typeof sidebarSides)[number]
type SidebarVariant = (typeof sidebarVariants)[number]
type SidebarCollapsible = (typeof sidebarCollapsibleModes)[number]
type SidebarMenuButtonVariant = (typeof sidebarMenuButtonVariants)[number]
type SidebarMenuButtonSize = (typeof sidebarMenuButtonSizes)[number]
type SidebarMenuSubButtonSize = (typeof sidebarMenuSubButtonSizes)[number]
type SidebarColor = Color
type SidebarGroupAnchor = (typeof sidebarGroupAnchors)[number]

export interface SidebarProviderProps extends React.ComponentPropsWithoutRef<'div'> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface SidebarRootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
  color?: SidebarColor
}

export interface SidebarGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  anchor?: SidebarGroupAnchor
}

export interface SidebarMenuButtonProps extends useRender.ComponentProps<'button'>, React.ComponentProps<'button'> {
  isActive?: boolean
  hasActiveChild?: boolean
  tooltip?: string
  variant?: SidebarMenuButtonVariant
  size?: SidebarMenuButtonSize
}

export interface SidebarMenuActionProps extends useRender.ComponentProps<'button'>, React.ComponentProps<'button'> {
  showOnHover?: boolean
}

export interface SidebarMenuSkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
  showIcon?: boolean
}

export interface SidebarMenuSubButtonProps extends useRender.ComponentProps<'a'>, React.ComponentProps<'a'> {
  size?: SidebarMenuSubButtonSize
  isActive?: boolean
}

export namespace SidebarProps {
  export type Provider = SidebarProviderProps
  export type Root = SidebarRootProps
  export type Group = SidebarGroupProps
  export type MenuButton = SidebarMenuButtonProps
  export type MenuAction = SidebarMenuActionProps
  export type MenuSkeleton = SidebarMenuSkeletonProps
  export type MenuSubButton = SidebarMenuSubButtonProps
  export type Side = SidebarSide
  export type Variant = SidebarVariant
  export type Collapsible = SidebarCollapsible
  export type Color = SidebarColor
  export type GroupAnchor = SidebarGroupAnchor
}

export type {
  SidebarCollapsible,
  SidebarColor,
  SidebarGroupAnchor,
  SidebarMenuButtonSize,
  SidebarMenuButtonVariant,
  SidebarMenuSubButtonSize,
  SidebarSide,
  SidebarVariant,
}
export { sidebarGroupAnchors, sidebarMenuButtonPropDefs, sidebarMenuSubButtonPropDefs, sidebarRootPropDefs }
