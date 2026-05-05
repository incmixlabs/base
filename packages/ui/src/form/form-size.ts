import { sizesXsToLg, sizesXsToLgAnd2x } from '@/theme/props/scales'
import type { Size } from '@/theme/tokens'

/**
 * Standard form component size range (xs–lg).
 */
export const formSizes = sizesXsToLg
export type FormSize = (typeof formSizes)[number]

/**
 * Extended sizes for TextField (large single-input use cases like search, sign-up).
 */
export const extendedFormSizes = sizesXsToLgAnd2x
export type ExtendedFormSize = (typeof extendedFormSizes)[number]

/** Resolve any Size to FormSize. Unsupported sizes fall back to 'md'. */
export function resolveFormSize(size: Size): FormSize {
  if (formSizes.includes(size as FormSize)) return size as FormSize
  return 'md'
}
