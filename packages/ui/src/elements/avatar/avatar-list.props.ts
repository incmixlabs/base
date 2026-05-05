'use client'

import type { AvatarHoverCardData } from './Avatar'

export interface AvatarListItem {
  id: string
  name: string
  title?: string
  email?: string
  description?: string
  presence?: 'offline' | 'unknown' | 'busy' | 'online'
  managerId?: string
  avatar?: string
  hoverCard?: boolean | AvatarHoverCardData
  disabled?: boolean
}
