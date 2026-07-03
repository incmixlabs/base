import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'

export const switchClassSizes = ['xs', 'sm', 'md', 'lg'] as const
export type SwitchSize = (typeof switchClassSizes)[number]
export type SwitchVariant = 'classic' | 'surface' | 'soft'
export type SwitchGroupOrientation = 'horizontal' | 'vertical'

const switchClassVariants = ['classic', 'surface', 'soft'] as const satisfies readonly SwitchVariant[]

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const switchFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'solid-alpha'),
    ']',
  )

const switchCheckedClassName = (color: string) =>
  [
    joinClass('data-[checked]:bg-', color, '-solid'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'solid'), ']'),
  ].join(' ')

const createSwitchColorVariantClasses = (color: Color): Record<SwitchVariant, string> => ({
  classic: [
    switchFocusClassName(color),
    switchCheckedClassName(color),
    'bg-neutral-surface border-neutral shadow-[inset_0_1px_2px_color-mix(in_oklch,black_10%,transparent)]',
  ].join(' '),
  surface: [switchFocusClassName(color), switchCheckedClassName(color), 'bg-neutral-surface border-neutral'].join(' '),
  soft: [switchFocusClassName(color), switchCheckedClassName(color), 'bg-neutral-soft border-transparent'].join(' '),
})

const createSegmentedLabelColorClasses = (color: Color) => ({
  unchecked: [
    joinClass('text-', color),
    joinClass('peer-data-[checked]:text-[color-mix(in_oklch,', colorVar(color, 'contrast'), '_80%,transparent)]'),
  ].join(' '),
  checked: [
    joinClass('text-[color-mix(in_oklch,', colorVar(color, 'text'), '_55%,transparent)]'),
    joinClass('peer-data-[checked]:text-', color),
  ].join(' '),
})

export const switchRootBase =
  'peer inline-flex shrink-0 cursor-pointer items-center border-2 border-solid transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50'

export const switchRootForcedColorAdjust = '[forced-color-adjust:none]'

export const switchThumbBase =
  'pointer-events-none block rounded-full bg-light-surface shadow-lg ring-0 transition-transform translate-x-0'

export const switchSegmentedRootBase = 'relative inline-grid grid-cols-[1fr_1fr] items-center font-medium'

export const switchSegmentedControlBase =
  'peer group/switch absolute inset-0 h-[inherit] w-auto cursor-pointer overflow-hidden border border-solid transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export const switchSegmentedThumbBase =
  'pointer-events-none block h-full w-1/2 bg-light-surface shadow-sm ring-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[checked]:translate-x-full data-[checked]:rtl:-translate-x-full'

export const switchSegmentedLabelBase =
  'pointer-events-none relative z-10 px-2 text-center transition-colors duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const switchColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createSwitchColorVariantClasses(color)]),
) as Record<Color, Record<SwitchVariant, string>>

export const switchSegmentedLabelColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createSegmentedLabelColorClasses(color)]),
) as Record<Color, ReturnType<typeof createSegmentedLabelColorClasses>>

export const switchHighContrastByVariant: Record<SwitchVariant, string> = {
  classic: 'saturate-[1.1] brightness-[0.95]',
  surface: 'saturate-[1.05] font-semibold',
  soft: 'saturate-[1.2]',
}

export const switchRootSizeVariants = {
  xs: 'h-4 w-7',
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-14',
} as const satisfies Record<SwitchSize, string>

// Translate distance = root width - thumb width - 2 * border width for each size.
export const switchThumbSizeVariants = {
  xs: 'h-3 w-3 data-[checked]:translate-x-3 data-[checked]:rtl:-translate-x-3',
  sm: 'h-4 w-4 data-[checked]:translate-x-4 data-[checked]:rtl:-translate-x-4',
  md: 'h-5 w-5 data-[checked]:translate-x-5 data-[checked]:rtl:-translate-x-5',
  lg: 'h-6 w-6 data-[checked]:translate-x-7 data-[checked]:rtl:-translate-x-7',
} as const satisfies Record<SwitchSize, string>

export const switchItemGapVariants = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
} as const satisfies Record<SwitchSize, string>

export const switchGroupRootOrientation = {
  vertical: 'flex-col gap-2',
  horizontal: 'flex-row gap-4',
} as const satisfies Record<SwitchGroupOrientation, string>

export const switchSegmentedSizeClasses: Record<SwitchSize, string> = {
  xs: 'h-6 min-w-20',
  sm: 'h-7 min-w-24',
  md: 'h-8 min-w-28',
  lg: 'h-9 min-w-32',
}

export const switchClassNames = [
  switchRootBase,
  switchRootForcedColorAdjust,
  switchThumbBase,
  switchSegmentedRootBase,
  switchSegmentedControlBase,
  switchSegmentedThumbBase,
  switchSegmentedLabelBase,
  ...switchClassVariants.flatMap(variant => semanticColorKeys.map(color => switchColorVariants[color][variant])),
  ...semanticColorKeys.flatMap(color => Object.values(switchSegmentedLabelColorVariants[color])),
  ...Object.values(switchHighContrastByVariant),
  ...Object.values(switchRootSizeVariants),
  ...Object.values(switchThumbSizeVariants),
  ...Object.values(switchItemGapVariants),
  ...Object.values(switchGroupRootOrientation),
  ...Object.values(switchSegmentedSizeClasses),
]
