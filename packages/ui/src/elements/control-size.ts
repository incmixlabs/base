import { controlSizeTokens } from '@/theme/token-maps'
import type { Size } from '@/theme/tokens'

export interface ControlSizeValues {
  height: string
  fontSize: string
  lineHeight: string
  iconSize: string
  gap: string
  paddingX: string
  paddingY: string
}

export type ControlSizeOverrides = Partial<ControlSizeValues>
export type ControlSizeName = Size | '2x'

export function getControlSizeValues(size: ControlSizeName, overrides?: ControlSizeOverrides): ControlSizeValues {
  const token = controlSizeTokens[size]
  const baseValues: ControlSizeValues = {
    height: token.height,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    iconSize: token.iconSize,
    gap: token.gap,
    paddingX: token.paddingX,
    paddingY: token.paddingY,
  }
  return {
    ...baseValues,
    ...overrides,
  }
}
