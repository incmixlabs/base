import type { Responsive } from '@/layouts/layout-utils'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from './responsive'
import type { TypographySize } from './tokens'
import { textBySize, textSizeResponsive } from './typography.class'

export function getTextSizeClasses(sizeProp: Responsive<TypographySize> | undefined, fallback: TypographySize = 'md') {
  return getResponsiveVariantClasses(sizeProp, textBySize, textSizeResponsive, fallback, typographyBreakpointKeys)
}
