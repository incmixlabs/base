'use client'

import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { NumberInputButtonSize, NumberInputIconButtonProps, NumberInputVariant } from './number-input.props'
import { TextField } from './TextField'

export type { NumberInputIconButtonProps, NumberInputVariant }

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'defaultValue' | 'inputMode' | 'onChange' | 'size' | 'type' | 'value'
  > {
  /** Control layout variant */
  variant?: NumberInputVariant
  /** Current numeric value */
  value?: number | ''
  /** Default numeric value */
  defaultValue?: number | ''
  /** Called when the parsed numeric value changes */
  onValueChange?: (value: number | '') => void
  /** Input change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Shared form size */
  size?: Size
  /** Visual variant for the text field surface */
  inputVariant?: TextFieldVariant
  /** Accent color */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Error state */
  error?: boolean
  /** Step increment */
  step?: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Restrict manual input to integers */
  allowDecimal?: boolean
  /** Optional visible label for the inner text field */
  label?: string
  /** Shared props for increment/decrement icon buttons (button variant only) */
  iconButton?: NumberInputIconButtonProps
}

const DECIMAL_INPUT_PATTERN = /^-?(?:\d+)?(?:\.\d*)?$/
const INTEGER_INPUT_PATTERN = /^-?\d*$/

function formatValue(value: number | '') {
  return value === '' ? '' : String(value)
}

function getPrecision(value: number) {
  if (!Number.isFinite(value)) return 0
  const text = String(value)
  if (text.includes('e-')) {
    const [, exponent] = text.split('e-')
    return Number(exponent) || 0
  }
  const [, decimals = ''] = text.split('.')
  return decimals.length
}

function roundToStepPrecision(value: number, step: number) {
  const precision = getPrecision(step)
  if (precision === 0) return value
  return Number(value.toFixed(precision))
}

function clampValue(value: number, min?: number, max?: number) {
  let next = value
  if (typeof min === 'number') next = Math.max(next, min)
  if (typeof max === 'number') next = Math.min(next, max)
  return next
}

function normalizeCommittedValue(
  value: number,
  { allowDecimal, min, max, step }: Pick<NumberInputProps, 'allowDecimal' | 'min' | 'max' | 'step'>,
) {
  const clamped = clampValue(value, min, max)
  if (!allowDecimal) {
    return Math.trunc(clamped)
  }
  return roundToStepPrecision(clamped, step ?? 1)
}

function isValidPartialNumber(raw: string, allowDecimal: boolean) {
  return (allowDecimal ? DECIMAL_INPUT_PATTERN : INTEGER_INPUT_PATTERN).test(raw)
}

function parseCommittedValue(raw: string, allowDecimal: boolean) {
  if (raw === '') return ''
  if (!isValidPartialNumber(raw, allowDecimal)) return undefined
  if (raw === '-' || raw === '.' || raw === '-.') return undefined

  const parsed = allowDecimal ? Number(raw) : Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * When stepping from an empty value, return an offset so that adding
 * `step * direction` lands exactly on the nearest boundary (min or max).
 * e.g. increment with min=5, step=1 → base=4 → 4+1=5 (lands on min).
 */
function getStepBase(
  currentValue: number | '',
  min: number | undefined,
  max: number | undefined,
  step: number,
  direction: 1 | -1,
) {
  const stepSize = Number.isFinite(step) && step > 0 ? step : 1
  if (typeof currentValue === 'number' && Number.isFinite(currentValue)) {
    return currentValue
  }
  if (direction > 0 && typeof min === 'number') {
    // Offset by one step-size so incrementing from empty lands exactly on min.
    return min - stepSize
  }
  if (direction < 0 && typeof max === 'number') {
    // Offset by one step-size so decrementing from empty lands exactly on max.
    return max + stepSize
  }
  if (direction < 0 && typeof min === 'number') {
    return min + stepSize
  }
  return 0
}

function mapControlButtonSize(size: Size | undefined): NumberInputButtonSize {
  switch (size) {
    case 'xs':
    case 'sm':
    case 'md':
    case 'lg':
    case 'xl':
      return size
    default:
      return 'sm'
  }
}

function calculateWidth(min?: number, max?: number) {
  const minLen = min !== undefined ? String(min).length : 0
  const maxLen = max !== undefined ? String(max).length : 0
  const charCount = Math.max(minLen, maxLen, 1)
  // Keep quantity-style controls compact while still leaving room for padding and caret.
  return `${Math.max(charCount + 2, 3)}ch`
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      variant = 'button',
      value,
      defaultValue = '',
      onValueChange,
      onChange,
      size: sizeProp,
      inputVariant,
      color,
      radius: radiusProp,
      error = false,
      step = 1,
      min,
      max,
      allowDecimal = true,
      className,
      disabled,
      readOnly,
      label,
      iconButton,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size ?? 'sm'
    const resolvedInputVariant = inputVariant ?? fieldGroup.variant
    const radius = radiusProp ?? fieldGroup.radius
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly === true
    const isControlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState<number | ''>(defaultValue)
    const currentValue = isControlled ? value : uncontrolledValue
    const [inputValue, setInputValue] = React.useState(() => formatValue(currentValue))
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const isFocusedRef = React.useRef(false)

    React.useEffect(() => {
      if (!isFocusedRef.current) {
        setInputValue(formatValue(currentValue))
      }
    }, [currentValue])

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') {
          ref(node)
          return
        }
        if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const commitValue = React.useCallback(
      (nextValue: number | '') => {
        if (!isControlled) {
          setUncontrolledValue(nextValue)
        }
        onValueChange?.(nextValue)
      },
      [isControlled, onValueChange],
    )

    const focusInput = React.useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const handleInputChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        if (!isValidPartialNumber(raw, allowDecimal)) {
          return
        }

        setInputValue(raw)
        const parsed = parseCommittedValue(raw, allowDecimal)
        if (parsed === '') {
          commitValue('')
        } else if (typeof parsed === 'number') {
          commitValue(parsed)
        }

        onChange?.(event)
      },
      [allowDecimal, commitValue, onChange],
    )

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = true
        onFocus?.(event)
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = false
        const parsed = parseCommittedValue(inputValue, allowDecimal)

        if (parsed === '') {
          setInputValue('')
          commitValue('')
        } else if (typeof parsed === 'number') {
          const normalized = normalizeCommittedValue(parsed, { allowDecimal, min, max, step })
          setInputValue(formatValue(normalized))
          commitValue(normalized)
        } else {
          setInputValue(formatValue(currentValue ?? ''))
        }

        onBlur?.(event)
      },
      [allowDecimal, commitValue, currentValue, inputValue, max, min, onBlur, step],
    )

    const stepValue = React.useCallback(
      (direction: 1 | -1) => {
        if (effectiveDisabled || effectiveReadOnly) return

        const safeStep = Number.isFinite(step) && step > 0 ? step : 1
        const base = getStepBase(currentValue ?? '', min, max, safeStep, direction)
        const normalized = normalizeCommittedValue(base + safeStep * direction, {
          allowDecimal,
          min,
          max,
          step: safeStep,
        })

        setInputValue(formatValue(normalized))
        commitValue(normalized)
        focusInput()
      },
      [allowDecimal, commitValue, currentValue, effectiveDisabled, effectiveReadOnly, focusInput, max, min, step],
    )

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          stepValue(1)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          stepValue(-1)
        }
      },
      [stepValue],
    )

    const decrementLabel = label ? `Decrease ${label}` : 'Decrease value'
    const incrementLabel = label ? `Increase ${label}` : 'Increase value'
    const canDecrement =
      !effectiveDisabled &&
      !effectiveReadOnly &&
      !(typeof min === 'number' && typeof currentValue === 'number' && currentValue <= min)
    const canIncrement =
      !effectiveDisabled &&
      !effectiveReadOnly &&
      !(typeof max === 'number' && typeof currentValue === 'number' && currentValue >= max)
    const controlButtonSize = iconButton?.size ?? mapControlButtonSize(size)
    const iconButtonColor = iconButton?.color ?? SemanticColor.slate
    const iconButtonVariant = iconButton?.variant ?? 'soft'
    const iconButtonRadius = iconButton?.radius ?? radius
    const iconButtonClassName = iconButton?.className
    const iconButtonHighContrast = iconButton?.highContrast
    const iconButtonTitle = iconButton?.title

    const calculatedWidth = calculateWidth(min, max)

    const controlInput = (
      <TextField
        {...props}
        ref={setRefs}
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        size={size}
        variant={resolvedInputVariant}
        color={color}
        radius={radius}
        error={error}
        disabled={effectiveDisabled}
        readOnly={effectiveReadOnly}
        label={label}
        value={inputValue}
        min={min}
        max={max}
        step={step}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          variant === 'button' && 'flex-1',
          variant === 'button' &&
            '[&_input]:rounded-none [&_input]:border-x-0 [&_input]:text-right [&_input]:tabular-nums',
        )}
        style={
          {
            ...style,
            width: variant === 'button' ? calculatedWidth : undefined,
          } as React.CSSProperties
        }
        rightElement={
          variant === 'icon' ? (
            <div className="flex h-full w-full flex-col justify-center overflow-hidden">
              <button
                type="button"
                className={cn(
                  'flex h-1/2 w-full items-center justify-center border-b border-border/60 text-muted-foreground transition-colors',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  !canIncrement && 'pointer-events-none opacity-50',
                )}
                aria-label={incrementLabel}
                tabIndex={-1}
                disabled={!canIncrement}
                onMouseDown={event => event.preventDefault()}
                onClick={() => stepValue(1)}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={cn(
                  'flex h-1/2 w-full items-center justify-center text-muted-foreground transition-colors',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  !canDecrement && 'pointer-events-none opacity-50',
                )}
                aria-label={decrementLabel}
                tabIndex={-1}
                disabled={!canDecrement}
                onMouseDown={event => event.preventDefault()}
                onClick={() => stepValue(-1)}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : undefined
        }
      />
    )

    if (variant === 'icon') {
      return <div className={className}>{controlInput}</div>
    }

    return (
      <div className={cn('flex w-fit items-stretch', className)}>
        <IconButton
          aria-label={decrementLabel}
          title={iconButtonTitle}
          variant={iconButtonVariant}
          color={iconButtonColor}
          radius={iconButtonRadius}
          size={controlButtonSize}
          highContrast={iconButtonHighContrast}
          className={cn('rounded-r-none border-r-0', iconButtonClassName)}
          disabled={!canDecrement}
          onMouseDown={event => event.preventDefault()}
          onClick={() => stepValue(-1)}
        >
          <Minus className="h-4 w-4" />
        </IconButton>
        {controlInput}
        <IconButton
          aria-label={incrementLabel}
          title={iconButtonTitle}
          variant={iconButtonVariant}
          color={iconButtonColor}
          radius={iconButtonRadius}
          size={controlButtonSize}
          highContrast={iconButtonHighContrast}
          className={cn('rounded-l-none border-l-0', iconButtonClassName)}
          disabled={!canIncrement}
          onMouseDown={event => event.preventDefault()}
          onClick={() => stepValue(1)}
        >
          <Plus className="h-4 w-4" />
        </IconButton>
      </div>
    )
  },
)

NumberInput.displayName = 'NumberInput'
