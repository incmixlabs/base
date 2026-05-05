import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import { hasOwnProperty as hasOwn } from '@/theme/helpers/has-own-property'
import type { BaseTextFieldVariant, TextFieldVariant } from '@/theme/tokens'

export type FloatingStyle = 'filled' | 'standard' | 'outlined'

const floatingVariantMap = {
  'floating-filled': 'filled',
  'floating-standard': 'standard',
  'floating-outlined': 'outlined',
} as const

const legacyVariantMap = {
  filled: 'solid',
  standard: 'surface',
} as const

export const isFloatingVariant = (variant?: string): variant is keyof typeof floatingVariantMap =>
  !!variant && hasOwn(floatingVariantMap, variant)

export const getFloatingStyle = (variant?: string): FloatingStyle | null =>
  isFloatingVariant(variant) ? floatingVariantMap[variant] : null

export const resolveSurfaceVariant = (
  variant: TextFieldVariant | string,
  options?: { allowLegacy?: boolean },
): SurfaceVariant => {
  const runtimeVariant = variant as string
  if (isFloatingVariant(runtimeVariant)) return 'outline'
  if (options?.allowLegacy && hasOwn(legacyVariantMap, runtimeVariant)) {
    return legacyVariantMap[runtimeVariant]
  }
  return surfaceVariants.includes(runtimeVariant as SurfaceVariant) ? (runtimeVariant as SurfaceVariant) : 'outline'
}

export const toBaseTextFieldVariant = (variant?: TextFieldVariant): BaseTextFieldVariant =>
  resolveSurfaceVariant(variant ?? 'outline')
