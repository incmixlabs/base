import * as React from 'react'
import type { Responsive } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { codeBase, codeByColor, codeBySize, codeHighContrast, codeSizeResponsive } from '../inline-elements.css'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '../responsive'
import type { TypographyColor, TypographySize } from '../tokens'
import { codePropDefs } from './code.props'

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  size?: Responsive<TypographySize>
  color?: TypographyColor
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'
  highContrast?: boolean
}

function getCodeSizeClasses(sizeProp: Responsive<TypographySize> | undefined): string {
  return getResponsiveVariantClasses(sizeProp, codeBySize, codeSizeResponsive, 'sm', typographyBreakpointKeys)
}

/** Code export. */
export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ size = 'sm', color = 'slate', variant = 'soft', highContrast = false, className, style, ...props }, ref) => {
    const safeSize =
      typeof size === 'string' ? ((normalizeEnumPropValue(codePropDefs.size, size) ?? 'sm') as TypographySize) : 'sm'
    const safeColor = (normalizeEnumPropValue(codePropDefs.color, color) ??
      codePropDefs.color.default ??
      'slate') as TypographyColor
    const safeVariant = (normalizeEnumPropValue(codePropDefs.variant, variant) ??
      codePropDefs.variant.default ??
      'soft') as 'solid' | 'soft' | 'outline' | 'ghost'
    const safeHighContrast = normalizeBooleanPropValue(codePropDefs.highContrast, highContrast) ?? false

    return (
      <code
        ref={ref}
        className={cn(
          codeBase,
          typeof size === 'string' ? codeBySize[safeSize] : getCodeSizeClasses(size),
          codeByColor[safeColor][safeVariant],
          safeHighContrast && codeHighContrast,
          className,
        )}
        style={style}
        {...props}
      />
    )
  },
)

Code.displayName = 'Code'
