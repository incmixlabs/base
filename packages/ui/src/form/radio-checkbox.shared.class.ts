import type { FormSize } from './form-size'

export type RadioCheckboxCardSize = FormSize

export const radioCheckboxCardSizes = ['xs', 'sm', 'md', 'lg'] as const satisfies readonly FormSize[]

export const radioCheckboxCardTextSizeVariants = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const satisfies Record<FormSize, string>

export const radioCheckboxCardTextVariants = {
  xs: `${radioCheckboxCardTextSizeVariants.xs} leading-4`,
  sm: `${radioCheckboxCardTextSizeVariants.sm} leading-5`,
  md: `${radioCheckboxCardTextSizeVariants.md} leading-6`,
  lg: `${radioCheckboxCardTextSizeVariants.lg} leading-7`,
} as const satisfies Record<FormSize, string>

export const checkboxControlSizeVariants = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const satisfies Record<FormSize, string>

export const checkboxControlIconSizeVariants = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const satisfies Record<FormSize, string>

export const radioControlSizeVariants = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const satisfies Record<FormSize, string>

export const radioControlIndicatorSizeVariants = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
} as const satisfies Record<FormSize, string>

export const radioControlLabelGapVariants = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
} as const satisfies Record<FormSize, string>

export const radioCardPaddingVariants = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const satisfies Record<FormSize, string>

export const radioCardGapVariants = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
} as const satisfies Record<FormSize, string>

export const checkboxCardPaddingVariants = {
  xs: 'p-3',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const satisfies Record<FormSize, string>

export const checkboxCardGapVariants = {
  xs: 'gap-2',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-3',
} as const satisfies Record<FormSize, string>
