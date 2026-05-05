import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'

const ratingSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const

const ratingPropDefs = {
  size: { type: 'enum', values: ratingSizes, default: 'md', responsive: true },
  ...colorPropDef,
} satisfies {
  size: PropDef<(typeof ratingSizes)[number]>
}

export { ratingSizes, ratingPropDefs }
