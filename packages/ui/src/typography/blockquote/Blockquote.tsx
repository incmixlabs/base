import * as React from 'react'
import type { Responsive } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { type SemanticColorKey, semanticColorVar } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue } from '@/theme/props/prop-def'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '../responsive'
import { type TypographyColor, type TypographySize, typographyTokens, type Weight } from '../tokens'
import { textBySize, textSizeResponsive } from '../typography.ve.css'

export interface BlockquoteProps extends React.HTMLAttributes<HTMLElement>, MarginProps {
  size?: Responsive<TypographySize>
  weight?: Weight
  color?: TypographyColor
  highContrast?: boolean
  truncate?: boolean
  wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'
}

function getBlockquoteSizeClasses(sizeProp: Responsive<TypographySize> | undefined): string {
  return getResponsiveVariantClasses(sizeProp, textBySize, textSizeResponsive, 'md', typographyBreakpointKeys)
}

/** Blockquote export. */
export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  (
    {
      size = 'md',
      weight = 'regular',
      color = 'slate',
      highContrast = false,
      truncate = false,
      wrap = 'wrap',
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const weightToken = typographyTokens.weight[weight]
    const colorToken = typographyTokens.color[color]
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const safeHighContrast = normalizeBooleanPropValue(highContrastPropDef.highContrast, highContrast) ?? false

    const blockquoteStyles: React.CSSProperties = {
      ...marginProps.style,
      fontWeight: weightToken,
      color: colorToken.text,
      borderLeftColor: semanticColorVar(color as SemanticColorKey, 'border'),
      ...style,
    }

    return (
      <blockquote
        ref={ref}
        className={cn(
          // Base styles
          'font-sans italic',
          'border-l-4 pl-4 py-2',
          getBlockquoteSizeClasses(size),

          // Truncation
          truncate && 'truncate',

          // Text wrapping
          wrap === 'nowrap' && 'whitespace-nowrap',
          wrap === 'pretty' && 'text-pretty',
          wrap === 'balance' && 'text-balance',

          // High contrast
          safeHighContrast && 'saturate-[1.2]',

          marginProps.className,
          className,
        )}
        style={blockquoteStyles}
        {...props}
      />
    )
  },
)

Blockquote.displayName = 'Blockquote'
