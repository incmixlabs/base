import { themeSizeTokens } from '@incmix/theme'
import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  type SemanticColorKey,
  type SemanticColorToken,
  semanticColorKeys,
} from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { togglePropDefs, type toggleVariants } from './toggle.props'

type ToggleVariant = (typeof toggleVariants)[number]
type ToggleSize = (typeof togglePropDefs.size.values)[number]

const cls = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ')
const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: SemanticColorKey, token: SemanticColorToken) =>
  joinClass('var(--color-', color, '-', token, ')')
const colorClass = (color: SemanticColorKey, token: SemanticColorToken) =>
  joinClass('[color:', colorVar(color, token), ']')
const backgroundClass = (color: SemanticColorKey, token: SemanticColorToken) =>
  joinClass('[background-color:', colorVar(color, token), ']')
const borderClass = (color: SemanticColorKey, token: SemanticColorToken) =>
  joinClass('[border-color:', colorVar(color, token), ']')
const prefixClass = (prefix: string, className: string) =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .map(token => `${prefix}:${token}`)
    .join(' ')
const pressedClass = (className: string) =>
  cls(prefixClass('aria-[pressed=true]', className), prefixClass('data-[pressed]', className))

const heightByToken = {
  '1.5rem': 'h-6 min-w-6',
  '1.75rem': 'h-7 min-w-7',
  '2rem': 'h-8 min-w-8',
  '2.5rem': 'h-10 min-w-10',
  '2.75rem': 'h-11 min-w-11',
} as const

const iconOnlyWidthByToken = {
  '1.5rem': '[&:has(>svg:only-child)]:w-6',
  '1.75rem': '[&:has(>svg:only-child)]:w-7',
  '2rem': '[&:has(>svg:only-child)]:w-8',
  '2.5rem': '[&:has(>svg:only-child)]:w-10',
  '2.75rem': '[&:has(>svg:only-child)]:w-11',
} as const

const paddingInlineByToken = {
  '0.5rem': 'px-2',
  '0.625rem': 'px-2.5',
  '0.75rem': 'px-3',
  '0.875rem': 'px-3.5',
} as const

const gapByToken = {
  '0.25rem': 'gap-1',
  '0.375rem': 'gap-1.5',
  '0.5rem': 'gap-2',
  '0.625rem': 'gap-2.5',
  '0.6875rem': 'gap-[0.6875rem]',
} as const

const typographyBySize = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const satisfies Record<ToggleSize, string>

const iconByToken = {
  '0.75rem': '[&_svg]:h-3 [&_svg]:w-3',
  '0.875rem': '[&_svg]:h-3.5 [&_svg]:w-3.5',
  '1rem': '[&_svg]:h-4 [&_svg]:w-4',
  '1.25rem': '[&_svg]:h-5 [&_svg]:w-5',
  '1.5rem': '[&_svg]:h-6 [&_svg]:w-6',
} as const

function heightClass(value: string) {
  return heightByToken[value as keyof typeof heightByToken] ?? `[height:${value}] [min-width:${value}]`
}

function iconOnlyWidthClass(value: string) {
  return iconOnlyWidthByToken[value as keyof typeof iconOnlyWidthByToken] ?? `[&:has(>svg:only-child)]:[width:${value}]`
}

function paddingInlineClass(value: string) {
  return paddingInlineByToken[value as keyof typeof paddingInlineByToken] ?? `[padding-inline:${value}]`
}

function gapClass(value: string) {
  return gapByToken[value as keyof typeof gapByToken] ?? `[gap:${value}]`
}

function iconClass(value: string) {
  return iconByToken[value as keyof typeof iconByToken] ?? `[&_svg]:[height:${value}] [&_svg]:[width:${value}]`
}

function resolveToggleBaseColor(color: SemanticColorKey) {
  if (color === 'light' || color === 'dark' || color === 'inverse') return color
  return null
}

function resolveToggleSelectedColor(color: SemanticColorKey) {
  if (color === 'light') return 'dark'
  if (color === 'dark') return 'light'
  if (color === 'inverse') return 'neutral'
  return resolveInteractiveFillColor(color)
}

function createToggleColorVariant(color: SemanticColorKey, variant: ToggleVariant) {
  const baseFillColor = resolveToggleBaseColor(color)
  const selectedColor = resolveToggleSelectedColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  const foregroundToken = resolveInteractiveForegroundToken(color)
  const unpressedColor = baseFillColor ?? unfilledColor
  const unpressedBase = cls(
    colorClass(unpressedColor, baseFillColor ? (variant === 'solid' ? 'contrast' : 'text') : foregroundToken),
    baseFillColor && backgroundClass(baseFillColor, variant === 'solid' ? 'primary' : 'soft'),
    !baseFillColor && 'bg-transparent',
    borderClass(unpressedColor, baseFillColor ? 'text' : 'border'),
  )
  const unpressedHover =
    variant === 'solid' && baseFillColor
      ? 'hover:brightness-[0.96] active:brightness-[0.92]'
      : cls(
          prefixClass('hover', backgroundClass(unpressedColor, variant === 'solid' ? 'soft' : 'soft-hover')),
          prefixClass('active', backgroundClass(unpressedColor, variant === 'solid' ? 'soft-hover' : 'primary-alpha')),
        )
  const selectedBase = cls(
    colorClass(selectedColor, variant === 'solid' ? 'contrast' : 'text'),
    backgroundClass(selectedColor, variant === 'solid' ? 'primary' : 'soft'),
    borderClass(selectedColor, 'text'),
  )
  const selectedHover =
    variant === 'solid'
      ? cls(
          prefixClass('hover', backgroundClass(selectedColor, 'primary')),
          prefixClass('active', backgroundClass(selectedColor, 'primary')),
          'hover:brightness-[0.96] active:brightness-[0.92]',
        )
      : cls(
          prefixClass('hover', backgroundClass(selectedColor, 'soft-hover')),
          prefixClass('active', backgroundClass(selectedColor, 'primary-alpha')),
        )

  return cls(unpressedBase, unpressedHover, pressedClass(selectedBase), pressedClass(selectedHover))
}

export const toggleBase =
  'inline-flex shrink-0 appearance-none select-none items-center justify-center border border-solid p-0 m-0 box-border leading-none outline-none transition-[background-color,color,border-color,filter,box-shadow] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)] enabled:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&:has(>svg:only-child)]:px-0'

export const toggleSizeVariants = Object.fromEntries(
  togglePropDefs.size.values.map(size => {
    const token = themeSizeTokens[size]
    return [
      size,
      cls(
        heightClass(token.height),
        paddingInlineClass(token.paddingX),
        gapClass(token.gap),
        typographyBySize[size],
        iconClass(token.iconSize),
        iconOnlyWidthClass(token.height),
      ),
    ]
  }),
) as Record<ToggleSize, string>

export const toggleColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    Object.fromEntries(
      togglePropDefs.variant.values.map(variant => [variant, createToggleColorVariant(color, variant)]),
    ),
  ]),
) as Record<Color, Record<ToggleVariant, string>>

export const toggleHighContrastByVariant = {
  solid: 'shadow-[var(--shadow-3)]',
  soft: '',
} as const satisfies Record<ToggleVariant, string>

export const toggleGroupRoot = 'group/toggle-group inline-flex items-center'

export const toggleGroupRootVertical = 'flex-col items-stretch'

export const toggleGroupRootLoose = 'gap-0.5'

export const toggleGroupItemFlushByOrientation = {
  horizontal:
    '[&:not(:first-child)]:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none [&:first-child:not(:last-child)]:rounded-r-none [&:last-child:not(:first-child)]:rounded-l-none',
  vertical:
    '[&:not(:first-child)]:-mt-px [&:not(:first-child):not(:last-child)]:rounded-none [&:first-child:not(:last-child)]:rounded-b-none [&:last-child:not(:first-child)]:rounded-t-none',
} as const

export const toggleClassNames = [
  toggleBase,
  ...Object.values(toggleSizeVariants),
  ...Object.values(toggleHighContrastByVariant),
  toggleGroupRoot,
  toggleGroupRootVertical,
  toggleGroupRootLoose,
  ...Object.values(toggleGroupItemFlushByOrientation),
  ...Object.values(toggleColorVariants).flatMap(variantMap => Object.values(variantMap)),
]
