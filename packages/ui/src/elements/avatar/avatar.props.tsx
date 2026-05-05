import type { CSSProperties } from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesXsTo2x } from '@/theme/props/scales'
import type { Radius } from '@/theme/tokens'
import type { AvatarHoverCardData, AvatarHoverCardRenderer, AvatarPresence } from './AvatarHoverCard'

const sizes = sizesXsTo2x

const avatarPropDefs = {
  id: { type: 'string', required: false },
  src: { type: 'string', required: false },
  alt: { type: 'string', required: false },
  name: { type: 'string', required: false },
  size: { type: 'enum', values: sizes, default: 'sm', responsive: true },
  ...radiusPropDef,
} satisfies {
  id: PropDef<string>
  src: PropDef<string>
  alt: PropDef<string>
  name: PropDef<string>
  size: PropDef<(typeof sizes)[number]>
  radius: typeof radiusPropDef.radius
}

export type AvatarSize = (typeof sizes)[number]
export const avatarVariants = ['soft', 'solid'] as const
export type AvatarVariant = (typeof avatarVariants)[number]
export { HUE_NAMES, type HueName } from '@/theme/tokens'
export interface AvatarProps {
  id?: string
  src?: string
  alt?: string
  name?: string
  title?: string
  email?: string
  description?: string
  presence?: AvatarPresence
  managerId?: string
  showPresence?: boolean
  size?: AvatarSize
  radius?: Radius
  hoverCard?: boolean | AvatarHoverCardData
  renderHoverCard?: AvatarHoverCardRenderer
  className?: string
  style?: CSSProperties
}

export { avatarPropDefs }
