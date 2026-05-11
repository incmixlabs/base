'use client'

import * as React from 'react'
import { withMask } from 'use-mask-input'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { TextField } from './TextField'

// Common mask presets
/** maskPresets export. */
export const maskPresets = {
  phone: '(999) 999-9999',
  phoneInternational: '+9 (999) 999-9999',
  date: '99/99/9999',
  dateISO: '9999-99-99',
  time: '99:99',
  time12h: '99:99 aa',
  ssn: '999-99-9999',
  zip: '99999',
  zipPlus4: '99999-9999',
  creditCard: '9999 9999 9999 9999',
  cvv: '999',
  expiry: '99/99',
  currency: '$ 9{1,3}[,999][,999][,999]',
  percentage: '9{1,3}%',
  ipAddress: '999.999.999.999',
} as const

export type MaskPreset = keyof typeof maskPresets

/** Mask options for use-mask-input */
export interface MaskOptions {
  /** Show mask on focus */
  showMaskOnFocus?: boolean
  /** Show mask on hover */
  showMaskOnHover?: boolean
  /** Placeholder character */
  placeholder?: string
  /** Auto unmask value */
  autoUnmask?: boolean
  /** Right align the value */
  rightAlign?: boolean
  /** Clear incomplete input on blur */
  clearIncomplete?: boolean
  /** Allow input to be optional */
  nullable?: boolean
  /** JIT masking - mask expands as you type */
  jitMasking?: boolean
}

export interface InputMaskProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The mask pattern or a preset name.
   * Use '9' for digits, 'a' for letters, '*' for alphanumeric.
   * Or use a preset like 'phone', 'date', 'creditCard', etc.
   */
  mask: string | MaskPreset
  /** Additional mask options from use-mask-input */
  maskOptions?: MaskOptions
  /** The size of the input */
  size?: Size
  /** The visual variant */
  variant?: TextFieldVariant
  /** The accent color */
  color?: Color
  /** The border radius */
  radius?: Radius
  /** Whether the field has an error */
  error?: boolean
  /** Icon to display on the left */
  leftIcon?: React.ReactNode
  /** Icon to display on the right */
  rightIcon?: React.ReactNode
  /** Interactive element on the left */
  leftElement?: React.ReactNode
  /** Interactive element on the right */
  rightElement?: React.ReactNode
}

// Helper to get the actual mask pattern
function getMaskPattern(mask: string | MaskPreset): string {
  if (mask in maskPresets) {
    return maskPresets[mask as MaskPreset]
  }
  return mask
}

/** InputMask export. */
export const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  (
    {
      mask,
      maskOptions,
      size,
      variant,
      color,
      radius,
      error = false,
      leftIcon,
      rightIcon,
      leftElement,
      rightElement,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Get the mask pattern
    const maskPattern = getMaskPattern(mask)

    // Memoize the mask ref to avoid recreating on every render
    const maskRef = React.useMemo(() => withMask(maskPattern, maskOptions), [maskPattern, maskOptions])

    // Combine refs - withMask returns a ref callback
    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        // Handle the forwarded ref
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        // Handle the mask ref
        maskRef(node)
      },
      [ref, maskRef],
    )

    return (
      <TextField
        ref={combinedRef}
        size={size}
        variant={variant}
        color={color}
        radius={radius}
        error={error}
        disabled={disabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        leftElement={leftElement}
        rightElement={rightElement}
        className={cn(className)}
        {...props}
      />
    )
  },
)

InputMask.displayName = 'InputMask'
