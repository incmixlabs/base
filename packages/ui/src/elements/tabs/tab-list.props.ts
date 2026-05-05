import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesSmToMd } from '@/theme/props/scales'

const sizes = sizesSmToMd
const wrapValues = ['nowrap', 'wrap', 'wrap-reverse'] as const
const justifyValues = ['start', 'center', 'end'] as const

const tabListPropDefs = {
  size: { type: 'enum', values: sizes, default: 'md', responsive: true },
  wrap: {
    type: 'enum',
    values: wrapValues,
    responsive: true,
  },
  justify: {
    type: 'enum',
    values: justifyValues,
    responsive: true,
  },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  wrap: PropDef<(typeof wrapValues)[number]>
  justify: PropDef<(typeof justifyValues)[number]>
}

export { tabListPropDefs }
