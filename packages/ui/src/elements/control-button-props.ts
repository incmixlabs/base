import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { possibleSizes } from '@/theme/tokens'

const controlButtonSizes = [
  possibleSizes.xs,
  possibleSizes.sm,
  possibleSizes.md,
  possibleSizes.lg,
  possibleSizes.xl,
] as const

function createControlButtonPropDefs<const Variants extends readonly string[]>({
  variants,
  defaultVariant,
  includeAsChild = false,
}: {
  variants: Variants
  defaultVariant: Variants[number]
  includeAsChild?: boolean
}) {
  const baseDefs = {
    size: { type: 'enum', values: controlButtonSizes, default: 'md', responsive: true },
    variant: { type: 'enum', values: variants, default: defaultVariant },
    ...colorPropDef,
    ...highContrastPropDef,
    ...radiusPropDef,
    loading: { type: 'boolean', default: false },
  } as const

  return includeAsChild ? { ...asChildPropDef, ...baseDefs } : baseDefs
}

export { controlButtonSizes, createControlButtonPropDefs }
