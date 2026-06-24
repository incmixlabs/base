import type { NavigationMenuVariant } from './navigation-menu.props'

export const navigationMenuRootBaseCls = 'relative z-10 flex max-w-full'
export const navigationMenuRootVerticalCls = 'items-start'
export const navigationMenuListBaseCls = 'm-0 flex list-none items-center gap-1 p-1'
export const navigationMenuListVerticalCls = 'flex-col items-stretch'
export const navigationMenuItemBaseCls = 'relative list-none'
export const navigationMenuTriggerBaseCls =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2'
export const navigationMenuIconBaseCls = 'inline-flex shrink-0 items-center justify-center transition-transform'
export const navigationMenuContentBaseCls = 'box-border min-w-0'
export const navigationMenuLinkBaseCls =
  'group flex min-w-0 gap-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2'
export const navigationMenuLinkIconBaseCls = 'mt-0.5 inline-flex shrink-0 items-center justify-center'
export const navigationMenuPopupBaseCls = 'relative box-border overflow-hidden border outline-none'
export const navigationMenuViewportBaseCls = 'box-border overflow-auto'

export const navigationMenuRootBase = 'af-navigation-menu-root'
export const navigationMenuTriggerBase = 'af-navigation-menu-trigger'
export const navigationMenuIconBase = 'af-navigation-menu-icon'
export const navigationMenuContentBase = 'af-navigation-menu-content'
export const navigationMenuPositionerBase = 'af-menu-positioner'
export const navigationMenuPopupBase = 'af-navigation-menu-popup'

export const navigationMenuPopupByVariant: Record<NavigationMenuVariant, string> = {
  solid: 'af-navigation-menu-popup-solid',
  soft: 'af-navigation-menu-popup-soft',
}

export const navigationMenuPopupHighContrast = 'af-navigation-menu-popup-high-contrast'
export const navigationMenuViewportBase = 'af-navigation-menu-viewport'

export const navigationMenuLinkBase = 'af-navigation-menu-link'
export const navigationMenuLinkTitleBase = 'af-navigation-menu-link-title'
export const navigationMenuLinkDescriptionBase = 'af-navigation-menu-link-description'

export const navigationMenuArrowByVariant: Record<NavigationMenuVariant, string> = {
  solid: 'af-navigation-menu-arrow-solid',
  soft: 'af-navigation-menu-arrow-soft',
}

export const navigationMenuBackdropBase = 'af-navigation-menu-backdrop'
