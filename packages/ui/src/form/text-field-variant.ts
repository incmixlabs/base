import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import { hasOwnProperty as hasOwn } from '@/theme/helpers/has-own-property'
import { type BaseTextFieldVariant, type TextFieldVariant, textFieldTokens } from '@/theme/tokens'

export type FloatingStyle = 'filled' | 'standard' | 'outlined'

const floatingVariantMap = {
  'floating-filled': 'filled',
  'floating-standard': 'standard',
  'floating-outlined': 'outlined',
} as const

export const isFloatingVariant = (variant?: string): variant is keyof typeof floatingVariantMap =>
  !!variant && hasOwn(floatingVariantMap, variant)

export const getFloatingStyle = (variant?: string): FloatingStyle | null =>
  isFloatingVariant(variant) ? floatingVariantMap[variant] : null

export const resolveSurfaceVariant = (variant: TextFieldVariant | string): SurfaceVariant => {
  const runtimeVariant = variant as string
  if (isFloatingVariant(runtimeVariant)) return 'outline'
  return surfaceVariants.includes(runtimeVariant as SurfaceVariant) ? (runtimeVariant as SurfaceVariant) : 'outline'
}

const isBaseTextFieldVariant = (variant: string): variant is BaseTextFieldVariant =>
  (textFieldTokens.baseVariant as readonly string[]).includes(variant)

export const toBaseTextFieldVariant = (variant?: TextFieldVariant): BaseTextFieldVariant => {
  const runtimeVariant = variant ?? 'outline'
  if (isFloatingVariant(runtimeVariant)) return 'outline'
  const resolvedVariant = resolveSurfaceVariant(runtimeVariant)
  return isBaseTextFieldVariant(resolvedVariant) ? resolvedVariant : 'outline'
}
