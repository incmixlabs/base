import { semanticColorVar } from '../../theme/props/color.prop'
import { type Color, semanticColorScale } from '../../theme/tokens'
import type { NavigationMenuSize, NavigationMenuVariant } from './navigation-menu.props'

const cls = (...tokens: string[]) => tokens.join(' ')

function classValue(value: string) {
  return value.replace(/\s+/g, '_')
}

function cssDeclaration(property: string, value: string) {
  return `[${property}:${classValue(value)}]`
}

function variantCssDeclaration(variant: string, property: string, value: string) {
  return `${variant}:${cssDeclaration(property, value)}`
}

function stateBackgroundClass(variant: string, color: Color, token: 'surface' | 'surface-hover') {
  return variantCssDeclaration(variant, 'background-color', semanticColorVar(color, token))
}

function stateTextClass(variant: string, color: Color) {
  return variantCssDeclaration(variant, 'color', semanticColorVar(color, 'text'))
}

function stateHighContrastOutlineClass(variant: string, color: Color) {
  return variantCssDeclaration(
    `[${variant}.af-high-contrast]`,
    'box-shadow',
    `inset 0 0 0 1px ${semanticColorVar(color, 'solid')}`,
  )
}

function createNavigationMenuColorRecord(createValue: (color: Color) => string): Record<Color, string> {
  const colorCoverage: Record<Exclude<Color, (typeof semanticColorScale)[number]>, never> = {}
  void colorCoverage

  return Object.fromEntries(semanticColorScale.map(color => [color, createValue(color)])) as Record<Color, string>
}

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

const navigationMenuActionColor = createNavigationMenuColorRecord(color =>
  cls(stateBackgroundClass('hover', color, 'surface-hover'), stateTextClass('hover', color)),
)

export const navigationMenuTriggerColor = createNavigationMenuColorRecord(color =>
  cls(
    navigationMenuActionColor[color],
    stateBackgroundClass('data-[popup-open]', color, 'surface'),
    stateTextClass('data-[popup-open]', color),
    stateHighContrastOutlineClass('&[data-popup-open]', color),
  ),
)

export const navigationMenuLinkColor = createNavigationMenuColorRecord(color =>
  cls(
    navigationMenuActionColor[color],
    stateBackgroundClass('data-[active]', color, 'surface'),
    stateTextClass('data-[active]', color),
    stateHighContrastOutlineClass('&[data-active]', color),
  ),
)

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
