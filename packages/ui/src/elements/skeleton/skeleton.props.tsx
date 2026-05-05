import { heightPropDefs } from '@/theme/props/height.props'
import type { PropDef } from '@/theme/props/prop-def'
import { widthPropDefs } from '@/theme/props/width.props'

const skeletonPropDefs = {
  loading: { type: 'boolean', default: true },
  ...widthPropDefs,
  ...heightPropDefs,
} satisfies {
  loading: PropDef<boolean>
}

export { skeletonPropDefs }
