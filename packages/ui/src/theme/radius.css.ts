import { styleVariants } from '@vanilla-extract/css'
import { designTokens, type Radius } from '@/theme/tokens'

export const radiusStyleVariants: Record<Radius, string> = styleVariants({
  none: { borderRadius: designTokens.radius.none },
  sm: { borderRadius: designTokens.radius.sm },
  md: { borderRadius: designTokens.radius.md },
  lg: { borderRadius: designTokens.radius.lg },
  full: { borderRadius: designTokens.radius.full },
})
