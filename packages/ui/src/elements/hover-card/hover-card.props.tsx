import { asChildPropDef } from '@/theme/props/as-child.prop'
import { heightPropDefs } from '@/theme/props/height.props'
import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'
import { widthPropDefs } from '@/theme/props/width.props'

const contentSizes = ['sm', 'md', 'lg'] as const

const hoverCardContentPropDefs = {
  ...asChildPropDef,
  size: {
    type: 'enum',
    values: contentSizes,
    default: 'md',
    responsive: true,
  },
  width: widthPropDefs.width,
  minWidth: widthPropDefs.minWidth,
  maxWidth: { ...widthPropDefs.maxWidth, default: '480px' },
  ...heightPropDefs,
} satisfies {
  width: PropDef<string>
  minWidth: PropDef<string>
  maxWidth: PropDef<string>
  size: PropDef<(typeof contentSizes)[number]>
}

type HoverCardContentOwnProps = GetPropDefTypes<
  typeof hoverCardContentPropDefs & typeof asChildPropDef & typeof widthPropDefs & typeof heightPropDefs
>

export type { HoverCardContentOwnProps }
export { hoverCardContentPropDefs }
