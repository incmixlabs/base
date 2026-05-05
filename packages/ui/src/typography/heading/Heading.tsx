import * as React from 'react'
import { getSpacingClasses, type Responsive, Slot, type Spacing } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '../responsive'
import type { TypographyColor, TypographyVariant } from '../tokens'
import { type TypographySize, typographyTokens, type Weight } from '../tokens'
import { headingBase, headingBySize, headingByWeight, headingSizeResponsive } from '../typography.ve.css'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  asChild?: boolean
  size?: Responsive<TypographySize>
  weight?: Weight
  color?: TypographyColor
  variant?: TypographyVariant
  align?: 'left' | 'center' | 'right'
  trim?: 'normal' | 'start' | 'end' | 'both'
  truncate?: boolean
  wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'
  highContrast?: boolean
  m?: Responsive<Spacing>
  mx?: Responsive<Spacing>
  my?: Responsive<Spacing>
  mt?: Responsive<Spacing>
  mr?: Responsive<Spacing>
  mb?: Responsive<Spacing>
  ml?: Responsive<Spacing>
}

function getHeadingSizeClasses(sizeProp: Responsive<TypographySize> | undefined): string {
  return getResponsiveVariantClasses(sizeProp, headingBySize, headingSizeResponsive, '2x', typographyBreakpointKeys)
}

/** Heading export. */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Tag = 'h1',
      asChild = false,
      size = '2x',
      weight = 'bold',
      color,
      variant = 'solid',
      align,
      trim,
      truncate = false,
      wrap = 'wrap',
      highContrast = false,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = getHeadingSizeClasses(size)
    const resolvedWeight = highContrast
      ? ({
          light: 'regular',
          regular: 'medium',
          medium: 'bold',
          bold: 'bold',
        }[weight] as Weight)
      : weight
    const headingStyles: React.CSSProperties = {
      ...(color && { color: typographyTokens.color[color][variant] }),
      ...style,
    }

    const Component = asChild ? Slot : Tag

    return (
      <Component
        ref={ref}
        className={cn(
          headingBase,
          headingByWeight[resolvedWeight],
          sizeClasses,

          // Text alignment
          align === 'left' && 'text-left',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',

          // Truncation
          truncate && 'truncate',

          // Text wrapping
          wrap === 'nowrap' && 'whitespace-nowrap',
          wrap === 'pretty' && 'text-pretty',
          wrap === 'balance' && 'text-balance',

          // High contrast
          highContrast && 'saturate-[1.1]',

          // Margin
          getSpacingClasses(m, 'm'),
          getSpacingClasses(mx, 'mx'),
          getSpacingClasses(my, 'my'),
          getSpacingClasses(mt, 'mt'),
          getSpacingClasses(mr, 'mr'),
          getSpacingClasses(mb, 'mb'),
          getSpacingClasses(ml, 'ml'),

          className,
        )}
        data-trim={trim}
        style={headingStyles}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

Heading.displayName = 'Heading'
