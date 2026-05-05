'use client'

import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { TextField } from './TextField'

// ============================================================================
// Types
// ============================================================================

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
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
  /** Whether to show password strength indicator */
  showStrength?: boolean
  /** Custom strength calculator (returns 0-4) */
  strengthCalculator?: (password: string) => number
}

// ============================================================================
// Password Strength Calculator
// ============================================================================

const defaultStrengthCalculator = (password: string): number => {
  if (!password) return 0

  let strength = 0

  // Length checks
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
  if (/\d/.test(password)) strength += 0.5
  if (/[^a-zA-Z0-9]/.test(password)) strength += 0.5

  return Math.min(4, Math.floor(strength))
}

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = [
  'bg-[var(--color-error-primary)]',
  'bg-[var(--color-error-primary)]',
  'bg-[var(--color-warning-primary)]',
  'bg-[var(--color-success-primary)]',
  'bg-[var(--color-success-primary)]',
]

// ============================================================================
// Strength Indicator Component
// ============================================================================

interface StrengthIndicatorProps {
  strength: number
}

const StrengthIndicator: React.FC<StrengthIndicatorProps> = ({ strength }) => (
  <div className="mt-2 space-y-1">
    <div className="flex gap-1">
      {[0, 1, 2, 3].map(index => (
        <div
          key={index}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors',
            index < strength ? strengthColors[strength] : 'bg-muted',
          )}
        />
      ))}
    </div>
    <p className={cn('text-xs', strength < 2 ? 'text-destructive' : 'text-muted-foreground')}>
      {strengthLabels[strength]}
    </p>
  </div>
)

// ============================================================================
// Toggle Button Component
// ============================================================================

interface ToggleButtonProps {
  showPassword: boolean
  onToggle: () => void
  disabled?: boolean
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ showPassword, onToggle, disabled }) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={cn(
      'flex items-center justify-center w-full h-full',
      'text-muted-foreground hover:text-foreground transition-colors',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
      disabled && 'pointer-events-none opacity-50',
    )}
    tabIndex={-1}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
)

// ============================================================================
// Main Component
// ============================================================================

/** PasswordInput export. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      size,
      variant,
      color,
      radius,
      error = false,
      leftIcon,
      showStrength = false,
      strengthCalculator = defaultStrengthCalculator,
      className,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(() => (value as string) ?? (defaultValue as string) ?? '')

    // Sync internal value with controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string)
      }
    }, [value])

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value)
        onChange?.(e)
      },
      [onChange],
    )

    const strength = showStrength ? strengthCalculator(internalValue) : 0

    return (
      <div className={cn('w-full', className)}>
        <TextField
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          error={error}
          disabled={disabled}
          leftIcon={leftIcon}
          rightElement={
            <ToggleButton
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              disabled={disabled}
            />
          }
          value={internalValue}
          onChange={handleChange}
          {...props}
        />

        {/* Strength indicator */}
        {showStrength && internalValue && <StrengthIndicator strength={strength} />}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
