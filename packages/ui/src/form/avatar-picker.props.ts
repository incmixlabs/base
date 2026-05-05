import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { formSizes } from './form-size'

const avatarPickerSizes = formSizes

const avatarPickerPropDefs = {
  size: { type: 'enum', values: avatarPickerSizes, default: 'xs', responsive: true },
  ...colorPropDef,
} satisfies {
  size: PropDef<(typeof avatarPickerSizes)[number]>
}

export { avatarPickerSizes, avatarPickerPropDefs }
