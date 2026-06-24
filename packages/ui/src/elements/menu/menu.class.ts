import type { Transition, Variants } from 'motion/react'
import type { MenuVariant } from './menu.props'

export const menuPopupBaseCls = 'flex flex-col overflow-hidden box-border outline-none'
export const menuPopupOverflowVisibleCls = 'overflow-visible'
export const menuPositionerBase = 'af-menu-positioner'
export const menuViewportBaseCls = 'flex flex-1 flex-col overflow-auto box-border'
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

export const menuLabelBase = 'af-menu-label-base'

export const menuSeparatorBase = 'af-menu-separator-base'

export const menuPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const menuPanelTransition: Transition = { type: 'spring', stiffness: 500, damping: 30 }
