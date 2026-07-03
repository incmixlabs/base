import { semanticColorClassRecipes } from '../../theme/helpers/semantic-color-recipe'
import { type Color, semanticColorScale } from '../../theme/tokens'
import { surfaceUnoColorVariants } from '../surface/surface.class'
import type { MenuSize, MenuVariant } from './menu.props'

const cls = (...tokens: string[]) => tokens.join(' ')
const prefixClasses = (prefix: string, className: string) =>
  className
    .split(' ')
    .filter(Boolean)
    .map(token => `${prefix}:${token}`)
    .join(' ')
const createMenuColorClassMap = (getClassName: (color: Color) => string) =>
  Object.fromEntries(semanticColorScale.map(color => [color, getClassName(color)])) as Record<Color, string>

export const menuPopupBaseCls = 'flex flex-col overflow-hidden box-border outline-none'
export const menuPopupOverflowVisibleCls = 'overflow-visible'
export const menuPositionerBase = 'z-[1000]'
export const menuViewportBaseCls = 'flex flex-1 flex-col overflow-auto box-border'
export const menuViewportBase = 'min-w-full min-h-0'
export const menuItemBaseCls = 'group relative flex items-center box-border outline-none select-none'
export const menuIndicatorBaseCls = 'absolute inset-y-0 left-0 inline-flex items-center justify-center'
export const menuShortcutBaseCls = 'ml-auto flex items-center'
export const menuLabelBaseCls = 'flex items-center box-border select-none cursor-default'
export const menuSubTriggerIconCls = 'ml-auto mr-0 opacity-80 shrink-0'

export const menuContentBase = cls(
  'origin-[var(--transform-origin)]',
  'min-w-48 max-w-[22rem] max-h-[var(--available-height)]',
  'duration-200 ease-out data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95',
  'rounded-[var(--element-border-radius)] border border-solid',
)

export const menuContentByVariant = {
  solid: cls(surfaceUnoColorVariants.neutral.surface, 'backdrop-filter-none'),
  soft: cls(surfaceUnoColorVariants.neutral.soft, 'backdrop-saturate-[140%] backdrop-blur-[10px]'),
} as const satisfies Record<MenuVariant, string>

export const menuViewportBySize = {
  sm: 'p-1',
  md: 'p-1',
  lg: 'p-[0.4375rem]',
  xl: 'p-2',
} as const satisfies Record<MenuSize, string>

export const menuItemBase = cls(
  'gap-2 text-neutral',
  '[cursor:var(--cursor-menu-item,pointer)]',
  'data-[disabled]:cursor-default data-[disabled]:pointer-events-none',
  'data-[disabled]:text-[color-mix(in_oklch,var(--color-neutral-text)_45%,transparent)]',
)

export const menuItemTextBold = 'font-semibold'
export const menuItemTextItalic = 'italic'
export const menuItemTextStrikethrough = 'line-through'

export const menuItemMotion =
  'transition-[background-color,color] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const menuSubTriggerIcon = 'text-current'

export const menuItemBySize = {
  sm: 'h-[1.75rem] px-2.5 scroll-my-1 text-sm leading-5 tracking-normal rounded-[var(--element-border-radius)]',
  md: 'h-[2rem] px-3 scroll-my-1 text-base leading-6 tracking-normal rounded-[var(--element-border-radius)]',
  lg: 'h-[2.5rem] px-3.5 scroll-my-[0.4375rem] text-lg leading-[1.625rem] tracking-normal rounded-[var(--element-border-radius)]',
  xl: 'h-[2.75rem] px-3.5 scroll-my-2 text-xl leading-7 tracking-normal rounded-[var(--element-border-radius)]',
} as const satisfies Record<MenuSize, string>

export const menuIconBySize = {
  sm: 'h-[1rem] w-[1rem]',
  md: 'h-[1rem] w-[1rem]',
  lg: 'h-[1.125rem] w-[1.125rem]',
  xl: 'h-[1.25rem] w-[1.25rem]',
} as const satisfies Record<MenuSize, string>

export const menuSubTriggerIconBySize = {
  sm: 'h-[0.75rem] w-[0.75rem]',
  md: 'h-[0.875rem] w-[0.875rem]',
  lg: 'h-[1rem] w-[1rem]',
  xl: 'h-[1rem] w-[1rem]',
} as const satisfies Record<MenuSize, string>

export const menuCheckIndicatorIconBySize = {
  sm: 'h-[0.75rem] w-[0.75rem]',
  md: 'h-[0.75rem] w-[0.75rem]',
  lg: 'h-[0.875rem] w-[0.875rem]',
  xl: 'h-[1rem] w-[1rem]',
} as const satisfies Record<MenuSize, string>

export const menuRadioIndicatorIconBySize = {
  sm: 'h-[0.5rem] w-[0.5rem]',
  md: 'h-[0.625rem] w-[0.625rem]',
  lg: 'h-[0.75rem] w-[0.75rem]',
  xl: 'h-[0.875rem] w-[0.875rem]',
} as const satisfies Record<MenuSize, string>

export const menuItemByVariant = {
  solid: createMenuColorClassMap(color => {
    const recipe = semanticColorClassRecipes[color]
    return cls(
      prefixClasses('data-[highlighted]', recipe.fill.solid),
      prefixClasses('data-[highlighted]', recipe.text.contrast),
      prefixClasses('data-[state=open]', recipe.interactionFill.soft),
      prefixClasses('data-[state=open]', recipe.text.contrast),
    )
  }),
  soft: createMenuColorClassMap(color => {
    const recipe = semanticColorClassRecipes[color]
    return cls(
      prefixClasses('data-[highlighted]', recipe.interactionFill.soft),
      prefixClasses('data-[state=open]', recipe.fill.soft),
      'data-[state=open]:text-neutral',
    )
  }),
} as const satisfies Record<MenuVariant, Record<Color, string>>

export const menuItemByVariantHighlight = {
  solid: createMenuColorClassMap(color => {
    const recipe = semanticColorClassRecipes[color]
    return cls(
      'relative z-[1]',
      'data-[highlighted]:bg-transparent',
      prefixClasses('data-[highlighted]', recipe.text.contrast),
      prefixClasses('data-[state=open]', recipe.interactionFill.soft),
      prefixClasses('data-[state=open]', recipe.text.contrast),
    )
  }),
  soft: createMenuColorClassMap(color => {
    const recipe = semanticColorClassRecipes[color]
    return cls(
      'relative z-[1]',
      'data-[highlighted]:bg-transparent',
      prefixClasses('data-[state=open]', recipe.fill.soft),
      'data-[state=open]:text-neutral',
    )
  }),
} as const satisfies Record<MenuVariant, Record<Color, string>>

export const menuHighlightColorByVariant = {
  solid: createMenuColorClassMap(color => semanticColorClassRecipes[color].fill.solid),
  soft: createMenuColorClassMap(color => semanticColorClassRecipes[color].interactionFill.soft),
} as const satisfies Record<MenuVariant, Record<Color, string>>

export const menuItemWithIndicatorBySize = {
  sm: 'pl-4',
  md: 'pl-4',
  lg: 'pl-5',
  xl: 'pl-6',
} as const satisfies Record<MenuSize, string>

export const menuItemIndicatorBySize = {
  sm: 'w-[1rem]',
  md: 'w-[1rem]',
  lg: 'w-[1.25rem]',
  xl: 'w-[1.5rem]',
} as const satisfies Record<MenuSize, string>

export const menuShortcutBase = cls(
  'pl-4 text-inherit opacity-70',
  'group-data-[disabled]:opacity-100 group-data-[highlighted]:opacity-100 group-data-[state=open]:opacity-100',
)

export const menuShortcutBySize = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const satisfies Record<MenuSize, string>

export const menuLabelBase = 'text-[color-mix(in_oklch,var(--color-neutral-text)_82%,transparent)] [.group+&]:mt-2'

export const menuLabelBySize = {
  sm: 'min-h-[1.75rem] px-2.5 text-sm leading-5 tracking-normal',
  md: 'min-h-[2rem] px-3 text-base leading-6 tracking-normal',
  lg: 'min-h-[2.5rem] px-3.5 text-lg leading-[1.625rem] tracking-normal',
  xl: 'min-h-[2.75rem] px-3.5 text-xl leading-7 tracking-normal',
} as const satisfies Record<MenuSize, string>

export const menuSeparatorBase = 'h-0 shrink-0 my-0 border-0 border-t border-solid border-neutral self-stretch'

export const menuSeparatorBySize = {
  sm: 'mx-2.5',
  md: 'mx-3',
  lg: 'mx-3.5',
  xl: 'mx-3.5',
} as const satisfies Record<MenuSize, string>

export const menuItemColor = Object.fromEntries(
  semanticColorScale.map(color => [color, semanticColorClassRecipes[color].text.default]),
) as Record<Color, string>

export const menuSharedClassNames = [
  menuPopupBaseCls,
  menuPopupOverflowVisibleCls,
  menuPositionerBase,
  menuViewportBaseCls,
  menuViewportBase,
  menuItemBaseCls,
  menuIndicatorBaseCls,
  menuShortcutBaseCls,
  menuLabelBaseCls,
  menuSubTriggerIconCls,
  menuContentBase,
  ...Object.values(menuContentByVariant),
  ...Object.values(menuViewportBySize),
  menuItemBase,
  ...Object.values(menuItemBySize),
  menuItemTextBold,
  menuItemTextItalic,
  menuItemTextStrikethrough,
  menuItemMotion,
  menuSubTriggerIcon,
  ...Object.values(menuIconBySize),
  ...Object.values(menuSubTriggerIconBySize),
  ...Object.values(menuCheckIndicatorIconBySize),
  ...Object.values(menuRadioIndicatorIconBySize),
  ...Object.values(menuItemByVariant).flatMap(colorMap => Object.values(colorMap)),
  ...Object.values(menuItemByVariantHighlight).flatMap(colorMap => Object.values(colorMap)),
  ...Object.values(menuHighlightColorByVariant).flatMap(colorMap => Object.values(colorMap)),
  ...Object.values(menuItemWithIndicatorBySize),
  ...Object.values(menuItemIndicatorBySize),
  menuShortcutBase,
  ...Object.values(menuShortcutBySize),
  menuLabelBase,
  ...Object.values(menuLabelBySize),
  menuSeparatorBase,
  ...Object.values(menuSeparatorBySize),
  ...Object.values(menuItemColor),
]
