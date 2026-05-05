import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsTo2x } from '@/theme/props/scales'
import { type AvatarVariant, avatarVariants } from './avatar.props'

const avatarGroupSizes = sizesXsTo2x

const layouts = ['spread', 'stack'] as const

const avatarGroupPropDefs = {
  max: { type: 'number', required: false },
  size: { type: 'enum', values: avatarGroupSizes, default: 'sm', responsive: true },
  layout: { type: 'enum', values: layouts, default: 'stack' },
  variant: { type: 'enum', values: avatarVariants, required: false, default: undefined },
  showPresence: { type: 'boolean', default: false },
  hoverCard: { type: 'boolean', default: true },
  overflowHoverCard: { type: 'boolean', default: true },
} satisfies {
  max: PropDef<number>
  size: PropDef<(typeof avatarGroupSizes)[number]>
  layout: PropDef<(typeof layouts)[number]>
  variant: PropDef<AvatarVariant>
  showPresence: PropDef<boolean>
  hoverCard: PropDef<boolean>
  overflowHoverCard: PropDef<boolean>
}

export { avatarGroupPropDefs, avatarGroupSizes }
