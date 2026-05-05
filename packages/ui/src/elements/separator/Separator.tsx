'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import * as React from 'react'
import { formColorVars } from '@/form/form-color'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color, Size } from '@/theme/tokens'
import { type SeparatorSize, separatorSizeVariants } from './Separator.css'

export type { SeparatorSize }

function resolveSeparatorSize(size: Size): SeparatorSize {
  if (size === 'xl' || size === '2x' || size === '3x' || size === '4x' || size === '5x') return 'lg'
  return size
}

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Size (thickness) */
  size?: SeparatorSize
  /** Color */
  color?: Color
  /** Whether to use decorative styling */
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      size = 'xs',
      color = SemanticColor.slate,
      decorative = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const separatorSize = resolveSeparatorSize(size)
    const isDefault = color === SemanticColor.slate
    const colorVarStyle = !isDefault ? (formColorVars[color] as React.CSSProperties) : undefined

    return (
      <SeparatorPrimitive
        ref={ref}
        orientation={orientation}
        className={cn(
          'shrink-0',
          separatorSizeVariants[separatorSize],
          orientation === 'horizontal'
            ? 'w-full border-t border-t-[length:var(--separator-width)]'
            : 'h-full border-l border-l-[length:var(--separator-width)]',
          isDefault ? 'border-border' : 'border-[var(--fc-primary)]',
          className,
        )}
        style={{ ...colorVarStyle, ...style }}
        {...props}
      />
    )
  },
)

Separator.displayName = 'Separator'

export { Separator }
