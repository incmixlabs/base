import * as React from 'react'
import { getSpacingClasses, type Responsive, Slot, type Spacing } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getTextSizeClasses } from '../get-text-size-classes'
import type { TextColor, TypographyVariant } from '../tokens'
import { resolveTextColor, type TypographySize, type Weight } from '../tokens'
import { textBase, textByWeight } from '../typography.ve.css'

export interface TextOwnProps {
  as?: 'span' | 'div' | 'label' | 'p'
  asChild?: boolean
  size?: Responsive<TypographySize>
  weight?: Weight
  color?: TextColor
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

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> & TextOwnProps & { htmlFor?: string }

/** Text export. */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Tag = 'span',
      asChild = false,
      size = 'md',
      weight = 'regular',
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
    const sizeClasses = getTextSizeClasses(size)
    const resolvedWeight = highContrast
      ? ({
          light: 'regular',
          regular: 'medium',
          medium: 'bold',
          bold: 'bold',
        }[weight] as Weight)
      : weight

    const textStyles: React.CSSProperties = {
      ...(color && { color: resolveTextColor(color, variant) }),
      ...style,
    }

    const sharedProps = {
      className: cn(
        textBase,
        sizeClasses,
        textByWeight[resolvedWeight],

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

        // Margin
        getSpacingClasses(m, 'm'),
        getSpacingClasses(mx, 'mx'),
        getSpacingClasses(my, 'my'),
        getSpacingClasses(mt, 'mt'),
        getSpacingClasses(mr, 'mr'),
        getSpacingClasses(mb, 'mb'),
        getSpacingClasses(ml, 'ml'),

        className,
      ),
      'data-trim': trim,
      style: textStyles,
    }

    if (asChild) {
      return (
        <Slot ref={ref as React.Ref<HTMLElement>} {...sharedProps} {...props}>
          {children}
        </Slot>
      )
    }

    if (Tag === 'div') {
      return (
        <div ref={ref as React.Ref<HTMLDivElement>} {...sharedProps} {...props}>
          {children}
        </div>
      )
    }
    if (Tag === 'label') {
      return (
        <label ref={ref as React.Ref<HTMLLabelElement>} {...sharedProps} {...props}>
          {children}
        </label>
      )
    }
    if (Tag === 'p') {
      return (
        <p ref={ref as React.Ref<HTMLParagraphElement>} {...sharedProps} {...props}>
          {children}
        </p>
      )
    }
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} {...sharedProps} {...props}>
        {children}
      </span>
    )
  },
)

Text.displayName = 'Text'
