import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'

export const switchClassSizes = ['xs', 'sm', 'md', 'lg'] as const
export type SwitchSize = (typeof switchClassSizes)[number]
export type SwitchVariant = 'classic' | 'surface' | 'soft'
export type SwitchGroupOrientation = 'horizontal' | 'vertical'

const switchClassVariants = ['classic', 'surface', 'soft'] as const satisfies readonly SwitchVariant[]

const switchSizeTokens: Record<
  SwitchSize,
  { rootHeight: string; rootWidth: string; thumbSize: string; thumbTranslate: string; gap: string }
> = {
  xs: { rootHeight: '1rem', rootWidth: '1.75rem', thumbSize: '0.75rem', thumbTranslate: '0.75rem', gap: '0.25rem' },
  sm: { rootHeight: '1.25rem', rootWidth: '2.25rem', thumbSize: '1rem', thumbTranslate: '1rem', gap: '0.375rem' },
  md: { rootHeight: '1.5rem', rootWidth: '2.75rem', thumbSize: '1.25rem', thumbTranslate: '1.25rem', gap: '0.5rem' },
  lg: { rootHeight: '1.75rem', rootWidth: '3.5rem', thumbSize: '1.5rem', thumbTranslate: '1.75rem', gap: '0.625rem' },
}

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')
const switchSizeVar = (size: string, slot: string, fallback: string) =>
  joinClass('var(--component-switch-size-', size, '-', slot, ',', fallback, ')')

const switchFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'primary-alpha'),
    ']',
  )

const switchCheckedClassName = (color: string) =>
  [
    joinClass('data-[checked]:bg-', color, '-solid'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'primary'), ']'),
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

export const switchRootSize = 'h-[var(--sw-root-height)] w-[var(--sw-root-width)] [forced-color-adjust:none]'

export const switchThumbBase =
  'pointer-events-none block rounded-full bg-light-surface shadow-lg ring-0 transition-transform h-[var(--sw-thumb-size)] w-[var(--sw-thumb-size)] translate-x-0 data-[checked]:translate-x-[var(--sw-thumb-translate)]'

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

export const switchSizeVariants = Object.fromEntries(
  switchClassSizes.map(size => {
    const token = switchSizeTokens[size]
    return [
      size,
      [
        joinClass('[--sw-root-height:', switchSizeVar(size, 'root-height', token.rootHeight), ']'),
        joinClass('[--sw-root-width:', switchSizeVar(size, 'root-width', token.rootWidth), ']'),
        joinClass('[--sw-thumb-size:', switchSizeVar(size, 'thumb-size', token.thumbSize), ']'),
        joinClass('[--sw-thumb-translate:', switchSizeVar(size, 'thumb-translate', token.thumbTranslate), ']'),
        joinClass('[--sw-gap:', switchSizeVar(size, 'gap', token.gap), ']'),
      ].join(' '),
    ]
  }),
) as Record<SwitchSize, string>

export const switchGroupRootOrientation = {
  vertical: 'flex-col gap-[var(--component-switch-group-gap,0.5rem)]',
  horizontal: 'flex-row gap-[var(--component-switch-group-inline-gap,1rem)]',
} as const satisfies Record<SwitchGroupOrientation, string>

export const switchSegmentedSizeClasses: Record<SwitchSize, string> = {
  xs: 'h-6 min-w-20',
  sm: 'h-7 min-w-24',
  md: 'h-8 min-w-28',
  lg: 'h-9 min-w-32',
}

export const switchClassNames = [
  switchRootBase,
  switchRootSize,
  switchThumbBase,
  switchSegmentedRootBase,
  switchSegmentedControlBase,
  switchSegmentedThumbBase,
  switchSegmentedLabelBase,
  ...switchClassVariants.flatMap(variant => semanticColorKeys.map(color => switchColorVariants[color][variant])),
  ...semanticColorKeys.flatMap(color => Object.values(switchSegmentedLabelColorVariants[color])),
  ...Object.values(switchHighContrastByVariant),
  ...Object.values(switchSizeVariants),
  ...Object.values(switchGroupRootOrientation),
  ...Object.values(switchSegmentedSizeClasses),
]
