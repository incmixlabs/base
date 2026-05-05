import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { formSizes } from './form-size'

const radioSizes = formSizes
const radioVariants = ['classic', 'surface', 'soft'] as const

const radioPropDefs = {
  size: { type: 'enum', values: radioSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: radioVariants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  size: PropDef<(typeof radioSizes)[number]>
  variant: PropDef<(typeof radioVariants)[number]>
}

export { radioSizes, radioVariants, radioPropDefs }
