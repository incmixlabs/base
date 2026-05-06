'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Size } from '@/theme/tokens'
import { Text, type TextProps } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'

// Map form Size to Typography size
const sizeMap: Record<Size, TextProps['size']> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'sm',
  xl: 'md',
  '2x': 'md',
  '3x': 'lg',
  '4x': 'lg',
  '5x': 'xl',
}

export interface LabelProps extends Omit<TextProps, 'as' | 'size'> {
  /** The size of the label - inherits from FieldGroup if not specified */
  size?: Size
  /** The id of the form element this label is for */
  htmlFor?: string
  /** Whether the associated field is disabled */
  disabled?: boolean
}

/** Label export. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ size: sizeProp, weight = 'medium', htmlFor, disabled, className, children, ...props }, ref) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size
    const effectiveDisabled = disabled || fieldGroup.disabled
    const textSize = sizeMap[size]

    return (
      <Text
        ref={ref as React.Ref<HTMLElement>}
        as="label"
        size={textSize}
        weight={weight}
        className={cn('leading-none cursor-pointer', effectiveDisabled && 'cursor-not-allowed opacity-70', className)}
        {...props}
        {...(htmlFor && { htmlFor })}
      >
        {children}
      </Text>
    )
  },
)

Label.displayName = 'Label'
