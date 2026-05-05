'use client'

import { OTPInput, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { Minus } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Re-export patterns for convenience
export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS }

// ============================================================================
// Types
// ============================================================================

export type InputOTPVariant = 'outline' | 'filled' | 'minimal'

/** Derive pattern type from OTPInput for maintainability */
type OTPInputPattern = React.ComponentProps<typeof OTPInput>['pattern']

export interface InputOTPProps {
  /** Number of OTP digits/characters */
  maxLength?: number
  /** Current value (controlled) */
  value?: string
  /** Change handler (controlled) */
  onChange?: (value: string) => void
  /** Called when all slots are filled */
  onComplete?: (value: string) => void
  /** Visual variant */
  variant?: InputOTPVariant
  /** Validation pattern (use REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, or REGEXP_ONLY_DIGITS_AND_CHARS) */
  pattern?: OTPInputPattern
  /** Input mode for mobile keyboards */
  inputMode?: 'numeric' | 'text' | 'decimal' | 'tel'
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether there's an error */
  error?: boolean
  /** Group slots with separators (e.g., [3, 3] for XXX-XXX) */
  groups?: number[]
  /** Custom separator element */
  separator?: React.ReactNode
  /** Additional class name for the container */
  className?: string
  /** Auto focus on mount */
  autoFocus?: boolean
}

// ============================================================================
// Slot Component
// ============================================================================

interface SlotProps {
  char: string | null
  isActive: boolean
  hasFakeCaret: boolean
  variant: InputOTPVariant
  error?: boolean
  disabled?: boolean
}

const Slot: React.FC<SlotProps> = ({ char, isActive, hasFakeCaret, variant, error, disabled }) => {
  return (
    <div
      className={cn(
        'relative flex h-12 w-10 items-center justify-center text-lg font-medium transition-all',

        // Variant styles
        variant === 'outline' && [
          'border border-input rounded-md bg-background',
          isActive && 'border-ring ring-2 ring-ring ring-offset-2',
          error && 'border-destructive',
        ],

        variant === 'filled' && [
          'border-0 rounded-md bg-secondary',
          isActive && 'bg-secondary/80 ring-2 ring-ring ring-offset-2',
          error && 'bg-destructive/10',
        ],

        variant === 'minimal' && [
          'border-b-2 border-input rounded-none bg-transparent',
          isActive && 'border-ring',
          error && 'border-destructive',
        ],

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Separator Component
// ============================================================================

const DefaultSeparator: React.FC = () => (
  <div className="flex items-center justify-center px-1">
    <Minus className="h-4 w-4 text-muted-foreground" />
  </div>
)

// ============================================================================
// Main Component
// ============================================================================

/** InputOTP export. */
export const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      maxLength = 6,
      value,
      onChange,
      onComplete,
      variant = 'outline',
      pattern = REGEXP_ONLY_DIGITS,
      inputMode = 'numeric',
      disabled = false,
      error = false,
      groups,
      separator,
      className,
      autoFocus,
      ...props
    },
    ref,
  ) => {
    // Handle completion
    const handleComplete = React.useCallback(
      (otp: string) => {
        onComplete?.(otp)
      },
      [onComplete],
    )

    // Render slots with optional grouping
    const renderSlots = React.useCallback(
      (slots: Array<{ char: string | null; isActive: boolean; hasFakeCaret: boolean }>) => {
        // Helper to render ungrouped slots
        const renderUngrouped = () => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} variant={variant} error={error} disabled={disabled} />
            ))}
          </div>
        )

        if (!groups || groups.length === 0) {
          // No grouping - render all slots inline
          return renderUngrouped()
        }

        // Guard: if groups don't match slot count, fall back to ungrouped
        const totalGroupSlots = groups.reduce((sum, size) => sum + size, 0)
        if (totalGroupSlots !== slots.length) {
          return renderUngrouped()
        }

        // With grouping - split slots into groups with separators
        const groupedSlots: React.ReactNode[] = []
        let currentIndex = 0

        groups.forEach((groupSize, groupIndex) => {
          const groupSlots = slots.slice(currentIndex, currentIndex + groupSize)

          groupedSlots.push(
            <div key={`group-${groupIndex}`} className="flex gap-1">
              {groupSlots.map((slot, idx) => (
                <Slot key={currentIndex + idx} {...slot} variant={variant} error={error} disabled={disabled} />
              ))}
            </div>,
          )

          // Add separator between groups (not after the last group)
          if (groupIndex < groups.length - 1) {
            groupedSlots.push(
              <React.Fragment key={`sep-${groupIndex}`}>{separator || <DefaultSeparator />}</React.Fragment>,
            )
          }

          currentIndex += groupSize
        })

        return <div className="flex items-center gap-1">{groupedSlots}</div>
      },
      [groups, separator, variant, error, disabled],
    )

    return (
      <OTPInput
        ref={ref}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onComplete={handleComplete}
        pattern={pattern}
        inputMode={inputMode}
        disabled={disabled}
        autoFocus={autoFocus}
        containerClassName={cn('flex items-center', className)}
        render={({ slots }) => renderSlots(slots)}
        {...props}
      />
    )
  },
)

InputOTP.displayName = 'InputOTP'

// ============================================================================
// Compound exports for advanced usage
// ============================================================================

export { OTPInput as InputOTPPrimitive }
