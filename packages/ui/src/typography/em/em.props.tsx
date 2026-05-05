import { asChildPropDef } from '@/theme/props/as-child.prop'
import { textWrapPropDef } from '@/theme/props/text-wrap.prop'
import { truncatePropDef } from '@/theme/props/truncate.prop'

const emPropDefs = {
  ...asChildPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
}

export { emPropDefs }
