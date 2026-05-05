import * as React from 'react'
import type { Radius } from '@/theme/tokens'
import { avatarSizeBySize } from './avatar.css'
import type { AvatarVariant } from './avatar.props'

export const AVATAR_SIZE_CLASS = 'af-avatar-size'

export const avatarSizeStyles = avatarSizeBySize

interface AvatarContextValue {
  variant?: AvatarVariant
  radius?: Radius
}

const AvatarContext = React.createContext<AvatarContextValue>({})

export function useAvatarContext() {
  return React.useContext(AvatarContext)
}

export interface AvatarProviderProps extends AvatarContextValue {
  colorMode?: AvatarVariant
  children: React.ReactNode
}

export function AvatarProvider({ children, variant, colorMode, radius }: AvatarProviderProps) {
  const resolvedVariant = variant ?? colorMode
  const contextValue = React.useMemo(() => ({ variant: resolvedVariant, radius }), [resolvedVariant, radius])
  return React.createElement(AvatarContext.Provider, { value: contextValue }, children)
}
