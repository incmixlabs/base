import type { Color } from '../../theme/tokens'
import type { NavigationMenuSize, NavigationMenuVariant } from './navigation-menu.props'

const cls = (...tokens: string[]) => tokens.join(' ')

export const navigationMenuRootBaseCls = 'relative z-10 flex max-w-full'
export const navigationMenuRootVerticalCls = 'items-start'
export const navigationMenuRootBase = 'text-neutral'

export const navigationMenuListBaseCls = 'm-0 flex list-none items-center gap-1 p-1'
export const navigationMenuListVerticalCls = 'flex-col items-stretch'

export const navigationMenuItemBaseCls = 'relative list-none'

export const navigationMenuTriggerBaseCls =
  'group inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2'

const navigationMenuActionBase = cls('cursor-pointer bg-transparent text-neutral tracking-normal')

export const navigationMenuTriggerBase = cls(
  navigationMenuActionBase,
  'data-[pressed]:translate-y-px',
  '[&.af-high-contrast]:font-semibold',
)

export const navigationMenuTriggerBySize = {
  sm: 'min-h-[1.75rem] gap-1.5 px-2.5 text-sm leading-5 rounded-sm',
  md: 'min-h-[2rem] gap-2 px-3 text-base leading-6 rounded-md',
  lg: 'min-h-[2.5rem] gap-2.5 px-3.5 text-lg leading-[1.625rem] rounded-lg',
} as const satisfies Record<NavigationMenuSize, string>

export const navigationMenuIconBaseCls = 'inline-flex shrink-0 items-center justify-center transition-transform'
export const navigationMenuIconBase = 'group-data-[popup-open]:rotate-180'

export const navigationMenuIconBySize = {
  sm: 'h-[1rem] w-[1rem]',
  md: 'h-[1rem] w-[1rem]',
  lg: 'h-[1.125rem] w-[1.125rem]',
} as const satisfies Record<NavigationMenuSize, string>

export const navigationMenuContentBaseCls = 'box-border min-w-0'
export const navigationMenuContentBase = cls(
  'max-h-[var(--available-height)] overflow-hidden',
  'transition-[opacity,transform] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:-translate-y-1 data-[ending-style]:-translate-y-1',
)

export const navigationMenuContentBySize = {
  sm: 'p-1 text-sm leading-5',
  md: 'p-1 text-base leading-6',
  lg: 'p-[0.4375rem] text-lg leading-[1.625rem]',
} as const satisfies Record<NavigationMenuSize, string>

export const navigationMenuPositionerBase = 'z-[1000]'

export const navigationMenuPopupBaseCls = 'relative box-border overflow-hidden border border-solid outline-none'
export const navigationMenuPopupBase = cls(
  'min-w-[min(100vw_-_2rem,18rem)] max-w-[calc(100vw_-_2rem)] max-h-[var(--available-height)]',
  'text-neutral origin-[var(--transform-origin)]',
  'transition-[opacity,transform] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:scale-[0.98] data-[ending-style]:scale-[0.98]',
)

export const navigationMenuPopupByVariant = {
  solid: cls(
    '[background-color:var(--color-neutral-background)]',
    '[border-color:var(--color-neutral-border)]',
    '[--af-floating-surface-arrow-fill:var(--color-neutral-background)]',
    '[--af-floating-surface-arrow-edge:var(--color-neutral-border)]',
    '[box-shadow:0_18px_48px_color-mix(in_oklch,black_16%,transparent),0_4px_16px_color-mix(in_oklch,black_10%,transparent)]',
  ),
  soft: cls(
    '[background-color:var(--color-neutral-surface)]',
    '[border-color:var(--color-neutral-border-subtle)]',
    '[--af-floating-surface-arrow-fill:var(--color-neutral-surface)]',
    '[--af-floating-surface-arrow-edge:var(--color-neutral-border-subtle)]',
    'backdrop-saturate-[140%] backdrop-blur-[10px]',
    '[box-shadow:inset_0_1px_0_var(--color-panel-highlight),0_18px_48px_color-mix(in_oklch,black_12%,transparent),0_4px_16px_color-mix(in_oklch,black_8%,transparent)]',
  ),
} as const satisfies Record<NavigationMenuVariant, string>

export const navigationMenuPopupHighContrast = '[border-color:var(--color-neutral-text)]'

export const navigationMenuViewportBaseCls = 'box-border overflow-auto'
export const navigationMenuViewportBase = 'w-max min-w-full max-w-[calc(100vw_-_2rem)] max-h-[var(--available-height)]'

export const navigationMenuLinkBaseCls =
  'group flex min-w-0 gap-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2'

export const navigationMenuLinkBase = cls('text-neutral no-underline tracking-normal')

export const navigationMenuLinkBySize = {
  sm: 'p-2.5 text-sm leading-5 rounded-sm',
  md: 'p-3 text-base leading-6 rounded-md',
  lg: 'p-3.5 text-lg leading-[1.625rem] rounded-lg',
} as const satisfies Record<NavigationMenuSize, string>

export const navigationMenuLinkIconBaseCls =
  'mt-0.5 inline-flex shrink-0 items-center justify-center [&_svg]:h-[1.25rem] [&_svg]:w-[1.25rem]'
export const navigationMenuLinkTitleBase = 'font-semibold text-current'
export const navigationMenuLinkDescriptionBase = '[color:color-mix(in_oklch,var(--color-neutral-text)_72%,transparent)]'

export const navigationMenuLinkDescriptionBySize = {
  sm: 'text-sm leading-5',
  md: 'text-sm leading-5',
  lg: 'text-base leading-6',
} as const satisfies Record<NavigationMenuSize, string>

export const navigationMenuSimpleLinkBase = cls(navigationMenuActionBase, 'no-underline')

const navigationMenuActionColor = {
  slate: 'hover:[background-color:var(--color-slate-soft-hover)] hover:[color:var(--color-slate-text)]',
  primary: 'hover:[background-color:var(--color-primary-soft-hover)] hover:[color:var(--color-primary-text)]',
  secondary: 'hover:[background-color:var(--color-secondary-soft-hover)] hover:[color:var(--color-secondary-text)]',
  accent: 'hover:[background-color:var(--color-accent-soft-hover)] hover:[color:var(--color-accent-text)]',
  neutral: 'hover:[background-color:var(--color-neutral-soft-hover)] hover:[color:var(--color-neutral-text)]',
  info: 'hover:[background-color:var(--color-info-soft-hover)] hover:[color:var(--color-info-text)]',
  success: 'hover:[background-color:var(--color-success-soft-hover)] hover:[color:var(--color-success-text)]',
  warning: 'hover:[background-color:var(--color-warning-soft-hover)] hover:[color:var(--color-warning-text)]',
  error: 'hover:[background-color:var(--color-error-soft-hover)] hover:[color:var(--color-error-text)]',
  inverse: 'hover:[background-color:var(--color-inverse-soft-hover)] hover:[color:var(--color-inverse-text)]',
  light: 'hover:[background-color:var(--color-light-soft-hover)] hover:[color:var(--color-light-text)]',
  dark: 'hover:[background-color:var(--color-dark-soft-hover)] hover:[color:var(--color-dark-text)]',
} as const satisfies Record<Color, string>

export const navigationMenuTriggerColor = {
  slate: cls(
    navigationMenuActionColor.slate,
    'data-[popup-open]:[background-color:var(--color-slate-soft)]',
    'data-[popup-open]:[color:var(--color-slate-text)]',
  ),
  primary: cls(
    navigationMenuActionColor.primary,
    'data-[popup-open]:[background-color:var(--color-primary-soft)]',
    'data-[popup-open]:[color:var(--color-primary-text)]',
  ),
  secondary: cls(
    navigationMenuActionColor.secondary,
    'data-[popup-open]:[background-color:var(--color-secondary-soft)]',
    'data-[popup-open]:[color:var(--color-secondary-text)]',
  ),
  accent: cls(
    navigationMenuActionColor.accent,
    'data-[popup-open]:[background-color:var(--color-accent-soft)]',
    'data-[popup-open]:[color:var(--color-accent-text)]',
  ),
  neutral: cls(
    navigationMenuActionColor.neutral,
    'data-[popup-open]:[background-color:var(--color-neutral-soft)]',
    'data-[popup-open]:[color:var(--color-neutral-text)]',
  ),
  info: cls(
    navigationMenuActionColor.info,
    'data-[popup-open]:[background-color:var(--color-info-soft)]',
    'data-[popup-open]:[color:var(--color-info-text)]',
  ),
  success: cls(
    navigationMenuActionColor.success,
    'data-[popup-open]:[background-color:var(--color-success-soft)]',
    'data-[popup-open]:[color:var(--color-success-text)]',
  ),
  warning: cls(
    navigationMenuActionColor.warning,
    'data-[popup-open]:[background-color:var(--color-warning-soft)]',
    'data-[popup-open]:[color:var(--color-warning-text)]',
  ),
  error: cls(
    navigationMenuActionColor.error,
    'data-[popup-open]:[background-color:var(--color-error-soft)]',
    'data-[popup-open]:[color:var(--color-error-text)]',
  ),
  inverse: cls(
    navigationMenuActionColor.inverse,
    'data-[popup-open]:[background-color:var(--color-inverse-soft)]',
    'data-[popup-open]:[color:var(--color-inverse-text)]',
  ),
  light: cls(
    navigationMenuActionColor.light,
    'data-[popup-open]:[background-color:var(--color-light-soft)]',
    'data-[popup-open]:[color:var(--color-light-text)]',
  ),
  dark: cls(
    navigationMenuActionColor.dark,
    'data-[popup-open]:[background-color:var(--color-dark-soft)]',
    'data-[popup-open]:[color:var(--color-dark-text)]',
  ),
} as const satisfies Record<Color, string>

export const navigationMenuLinkColor = {
  slate: cls(
    navigationMenuActionColor.slate,
    'data-[active]:[background-color:var(--color-slate-soft)]',
    'data-[active]:[color:var(--color-slate-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-slate-solid)]',
  ),
  primary: cls(
    navigationMenuActionColor.primary,
    'data-[active]:[background-color:var(--color-primary-soft)]',
    'data-[active]:[color:var(--color-primary-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-primary-solid)]',
  ),
  secondary: cls(
    navigationMenuActionColor.secondary,
    'data-[active]:[background-color:var(--color-secondary-soft)]',
    'data-[active]:[color:var(--color-secondary-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-secondary-solid)]',
  ),
  accent: cls(
    navigationMenuActionColor.accent,
    'data-[active]:[background-color:var(--color-accent-soft)]',
    'data-[active]:[color:var(--color-accent-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-accent-solid)]',
  ),
  neutral: cls(
    navigationMenuActionColor.neutral,
    'data-[active]:[background-color:var(--color-neutral-soft)]',
    'data-[active]:[color:var(--color-neutral-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-neutral-solid)]',
  ),
  info: cls(
    navigationMenuActionColor.info,
    'data-[active]:[background-color:var(--color-info-soft)]',
    'data-[active]:[color:var(--color-info-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-info-solid)]',
  ),
  success: cls(
    navigationMenuActionColor.success,
    'data-[active]:[background-color:var(--color-success-soft)]',
    'data-[active]:[color:var(--color-success-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-success-solid)]',
  ),
  warning: cls(
    navigationMenuActionColor.warning,
    'data-[active]:[background-color:var(--color-warning-soft)]',
    'data-[active]:[color:var(--color-warning-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-warning-solid)]',
  ),
  error: cls(
    navigationMenuActionColor.error,
    'data-[active]:[background-color:var(--color-error-soft)]',
    'data-[active]:[color:var(--color-error-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-error-solid)]',
  ),
  inverse: cls(
    navigationMenuActionColor.inverse,
    'data-[active]:[background-color:var(--color-inverse-soft)]',
    'data-[active]:[color:var(--color-inverse-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-inverse-solid)]',
  ),
  light: cls(
    navigationMenuActionColor.light,
    'data-[active]:[background-color:var(--color-light-soft)]',
    'data-[active]:[color:var(--color-light-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-light-solid)]',
  ),
  dark: cls(
    navigationMenuActionColor.dark,
    'data-[active]:[background-color:var(--color-dark-soft)]',
    'data-[active]:[color:var(--color-dark-text)]',
    '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-dark-solid)]',
  ),
} as const satisfies Record<Color, string>

export const navigationMenuBackdropBase =
  'fixed inset-0 [background-color:color-mix(in_oklch,black_8%,transparent)] backdrop-blur-[1px]'

export const navigationMenuClassNames = [
  navigationMenuRootBaseCls,
  navigationMenuRootVerticalCls,
  navigationMenuRootBase,
  navigationMenuListBaseCls,
  navigationMenuListVerticalCls,
  navigationMenuItemBaseCls,
  navigationMenuTriggerBaseCls,
  navigationMenuActionBase,
  navigationMenuTriggerBase,
  ...Object.values(navigationMenuTriggerBySize),
  navigationMenuIconBaseCls,
  navigationMenuIconBase,
  ...Object.values(navigationMenuIconBySize),
  navigationMenuContentBaseCls,
  navigationMenuContentBase,
  ...Object.values(navigationMenuContentBySize),
  navigationMenuPositionerBase,
  navigationMenuPopupBaseCls,
  navigationMenuPopupBase,
  ...Object.values(navigationMenuPopupByVariant),
  navigationMenuPopupHighContrast,
  navigationMenuViewportBaseCls,
  navigationMenuViewportBase,
  navigationMenuLinkBaseCls,
  navigationMenuLinkBase,
  ...Object.values(navigationMenuLinkBySize),
  navigationMenuLinkIconBaseCls,
  navigationMenuLinkTitleBase,
  navigationMenuLinkDescriptionBase,
  ...Object.values(navigationMenuLinkDescriptionBySize),
  navigationMenuSimpleLinkBase,
  navigationMenuBackdropBase,
  ...Object.values(navigationMenuTriggerColor),
  ...Object.values(navigationMenuLinkColor),
]
