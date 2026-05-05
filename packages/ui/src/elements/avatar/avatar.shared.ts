// Ordered to maximise perceptual distance between adjacent entries so that
// sequential hash indices (common in avatar groups) produce distinct colours.
import { HUE_NAMES, type HueName } from '@/theme/tokens'
export const AVATAR_SOFT_TONES = ['3', '5', '7'] as const
export type AvatarSoftTone = (typeof AVATAR_SOFT_TONES)[number]
export const AVATAR_SOLID_TONES = ['7', '9', '11'] as const
export type AvatarSolidTone = (typeof AVATAR_SOLID_TONES)[number]

function hashString(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function finalizeHash(hash: number): number {
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85ebca6b)
  hash ^= hash >>> 13
  hash = Math.imul(hash, 0xc2b2ae35)
  hash ^= hash >>> 16
  return hash >>> 0
}

export function stringToHue(str: string): HueName {
  const index = finalizeHash(hashString(str)) % HUE_NAMES.length
  return (HUE_NAMES[index] ?? 'orange') as HueName
}

export function stringToAvatarSoftTone(str: string): AvatarSoftTone {
  const index = finalizeHash(hashString(`${str}:soft-tone`)) % AVATAR_SOFT_TONES.length
  return (AVATAR_SOFT_TONES[index] ?? '3') as AvatarSoftTone
}

export function stringToAvatarSolidTone(str: string): AvatarSolidTone {
  const index = finalizeHash(hashString(`${str}:solid-tone`)) % AVATAR_SOLID_TONES.length
  return (AVATAR_SOLID_TONES[index] ?? '9') as AvatarSolidTone
}
