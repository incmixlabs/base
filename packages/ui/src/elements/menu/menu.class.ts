import type { Transition, Variants } from 'motion/react'
import type { MenuSize, MenuVariant } from './menu.props'

export const menuPopupBaseCls = 'flex flex-col overflow-hidden box-border outline-none'
export const menuPopupOverflowVisibleCls = 'overflow-visible'
export const menuPositionerBase = 'af-menu-positioner'
export const menuViewportBaseCls = 'flex flex-1 flex-col overflow-auto box-border min-w-full min-h-0'
export const menuItemBaseCls = 'relative flex items-center box-border outline-none select-none'
export const menuIndicatorBaseCls = 'absolute left-0 inline-flex items-center justify-center'
export const menuShortcutBaseCls = 'ml-auto flex items-center pl-4'
export const menuLabelBaseCls = 'flex items-center box-border select-none cursor-default'
export const menuSubTriggerIconCls = 'ml-auto mr-0 opacity-80 shrink-0'

export const menuContentBase = 'af-menu-content'
export const menuContentByVariant: Record<MenuVariant, string> = {
  solid: 'af-menu-content-solid',
  soft: 'af-menu-content-soft',
}

export const menuViewportBase = 'af-menu-viewport'
export const menuItemBase = 'af-menu-item'
export const menuItemMotion = 'af-menu-item-motion'
export const menuSubTriggerIcon = 'af-menu-subtrigger-icon'
export const menuShortcutBase = 'af-menu-shortcut-base'
export const menuItemSubtitle = 'af-menu-item-subtitle'
export const menuLabelBase = 'af-menu-label-base'
export const menuSeparatorBase = 'af-menu-separator-base'

// Size mappings for dynamic spacing and layouts
export const menuViewportSizeClasses: Record<MenuSize, string> = {
  sm: 'py-1',
  md: 'py-1.5',
  lg: 'py-2',
  xl: 'py-2.5',
}

export const menuItemSizeClasses: Record<MenuSize, string> = {
  sm: 'h-7 text-xs px-2 gap-2',
  md: 'h-8 text-sm px-3 gap-2',
  lg: 'h-9 text-base px-4 gap-2',
  xl: 'h-10 text-lg px-[1.125rem] gap-2.5',
}

export const menuIconSizeClasses: Record<MenuSize, string> = {
  sm: '[&_svg]:w-4 [&_svg]:h-4',
  md: '[&_svg]:w-4 [&_svg]:h-4',
  lg: '[&_svg]:w-[1.125rem] [&_svg]:h-[1.125rem]',
  xl: '[&_svg]:w-5 [&_svg]:h-5',
}

export const menuLabelSizeClasses: Record<MenuSize, string> = {
  sm: 'h-6 text-[11px] px-2 mt-1',
  md: 'h-7 text-xs px-3 mt-1.5',
  lg: 'h-8 text-sm px-4 mt-2',
  xl: 'h-9 text-md px-[1.125rem] mt-2.5',
}

export const menuSeparatorMarginClasses: Record<MenuSize, string> = {
  sm: 'my-1',
  md: 'my-1.5',
  lg: 'my-2',
  xl: 'my-2.5',
}

export const menuPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const menuPanelTransition: Transition = { type: 'spring', stiffness: 500, damping: 30 }
