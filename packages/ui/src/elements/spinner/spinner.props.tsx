import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg } from '@/theme/props/scales'

const sizes = sizesXsToLg
const variants = ['spinner', 'code', 'ai'] as const

const spinnerPropDefs = {
  size: { type: 'enum', values: sizes, default: 'md', responsive: true },
  variant: { type: 'enum', values: variants, default: 'spinner' },
  loading: { type: 'boolean', default: true },
  color: { ...colorPropDef.color, default: 'primary' as const },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  loading: PropDef<boolean>
  color: PropDef<string>
}

export { spinnerPropDefs, variants as spinnerVariants }
