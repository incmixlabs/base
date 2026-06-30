import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { controlButtonSizes } from './control-button-sizes'

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
