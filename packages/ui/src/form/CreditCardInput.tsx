'use client'

import { CreditCard, Lock } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { TextField } from './TextField'
import { toBaseTextFieldVariant } from './text-field-variant'

// ============================================================================
// Types
// ============================================================================

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

export interface CreditCardValue {
  /** Card number (formatted with spaces) */
  number: string
  /** Raw card number (digits only) */
  rawNumber: string
  /** Expiry date (MM/YY) */
  expiry: string
  /** CVV/CVC */
  cvv: string
  /** Cardholder name */
  name: string
  /** Detected card type */
  cardType: CardType
  /** Whether all fields are valid */
  isValid: boolean
}

export interface CreditCardInputProps {
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
  /** Whether the input is disabled */
  disabled?: boolean
  /** Current value */
  value?: CreditCardValue
  /** Called when card info changes */
  onChange?: (value: CreditCardValue) => void
  /** Show cardholder name field */
  showName?: boolean
  /** Placeholder for card number */
  numberPlaceholder?: string
  /** Placeholder for expiry */
  expiryPlaceholder?: string
  /** Placeholder for CVV */
  cvvPlaceholder?: string
  /** Placeholder for name */
  namePlaceholder?: string
  /** Additional class name */
  className?: string
}

// ============================================================================
// Card Type Detection
// ============================================================================

function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\s/g, '')

  // Visa: starts with 4
  if (/^4/.test(cleaned)) return 'visa'

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard'

  // Amex: starts with 34 or 37
  if (/^3[47]/.test(cleaned)) return 'amex'

  // Discover: starts with 6011, 644-649, or 65
  if (/^6011|^64[4-9]|^65/.test(cleaned)) return 'discover'

  return 'unknown'
}

function getCardMaxLength(cardType: CardType): number {
  return cardType === 'amex' ? 15 : 16
}

function getCvvLength(cardType: CardType): number {
  return cardType === 'amex' ? 4 : 3
}

// ============================================================================
// Card Type Icons
// ============================================================================

const CardTypeIcon: React.FC<{ type: CardType; className?: string }> = ({ type, className }) => {
  const baseClass = cn('h-6 w-auto', className)

  switch (type) {
    case 'visa':
      return (
        <svg viewBox="0 0 48 32" className={baseClass} aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <path
            d="M19.5 21.5h-3l1.9-11.5h3l-1.9 11.5zm8.2-11.2c-.6-.2-1.5-.5-2.7-.5-3 0-5 1.5-5 3.7 0 1.6 1.5 2.5 2.7 3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.2 0-1.9-.2-3-.7l-.4-.2-.4 2.5c.7.4 2.1.7 3.5.7 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.3-2.6-3.1-1.1-.5-1.7-1-1.7-1.5 0-.5.6-1 1.8-1 1 0 1.7.2 2.3.5l.3.1.4-2.4zm7.8-.3h-2.3c-.7 0-1.3.2-1.6 1l-4.5 10h3.2l.6-1.7h3.9l.4 1.7h2.8l-2.5-11zm-3.7 7.1l1.2-3.2.3-.9.2.8.7 3.3h-2.4zM17 10l-3 7.8-.3-1.5c-.5-1.8-2.2-3.7-4-4.7l2.7 9.9h3.2l4.8-11.5H17z"
            fill="#fff"
          />
        </svg>
      )
    case 'mastercard':
      return (
        <svg viewBox="0 0 48 32" className={baseClass} aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#000" />
          <circle cx="18" cy="16" r="10" fill="#EB001B" />
          <circle cx="30" cy="16" r="10" fill="#F79E1B" />
          <path
            d="M24 8.5a10 10 0 0 0-3.9 7.5 10 10 0 0 0 3.9 7.5 10 10 0 0 0 3.9-7.5 10 10 0 0 0-3.9-7.5z"
            fill="#FF5F00"
          />
        </svg>
      )
    case 'amex':
      return (
        <svg viewBox="0 0 48 32" className={baseClass} aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#006FCF" />
          <path
            d="M12 10l-4 12h6l.5-1.5h1l.5 1.5h6.5v-1l.5 1h3l.5-1v1h12v-12h-12v1l-.5-1h-3l-.5 1v-1H12zm2 2h2l1.5 4.5V12h2.5l1 3 1-3h2.5v8h-1.5v-5l-1.5 5h-1.5l-1.5-5v5h-3l-.5-1.5h-2l-.5 1.5h-1.5l2.5-8zm1.5 2l-.75 2.5h1.5L14.5 14z"
            fill="#fff"
          />
        </svg>
      )
    case 'discover':
      return (
        <svg viewBox="0 0 48 32" className={baseClass} aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#fff" />
          <rect x="0.5" y="0.5" width="47" height="31" rx="3.5" stroke="#E6E6E6" />
          <circle cx="30" cy="16" r="8" fill="#F47216" />
          <text x="10" y="19" fontSize="8" fontWeight="bold" fill="#000">
            DISCOVER
          </text>
        </svg>
      )
    default:
      return <CreditCard className={cn('h-5 w-5 text-muted-foreground', className)} aria-hidden="true" />
  }
}

// ============================================================================
// Format Helpers
// ============================================================================

function formatCardNumber(value: string, cardType: CardType): string {
  const digits = value.replace(/\D/g, '')
  const maxLength = getCardMaxLength(cardType)
  const truncated = digits.slice(0, maxLength)

  if (cardType === 'amex') {
    // Amex: 4-6-5 format
    return truncated.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))
  }

  // Others: 4-4-4-4 format
  return truncated.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
  }
  return digits
}

function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false

  const monthPart = match[1]
  const yearPart = match[2]
  if (!monthPart || !yearPart) return false

  const month = Number.parseInt(monthPart, 10)
  const year = Number.parseInt(yearPart, 10) + 2000

  if (month < 1 || month > 12) return false

  const now = new Date()
  // Card is valid through the last day of the expiry month
  const cardExpiry = new Date(year, month, 0) // Last day of expiry month
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return cardExpiry >= today
}

function validateCardNumber(number: string): boolean {
  const digits = number.replace(/\s/g, '')
  if (digits.length < 13 || digits.length > 16) return false

  // Luhn algorithm
  let sum = 0
  let isEven = false
  for (let i = digits.length - 1; i >= 0; i--) {
    const digitChar = digits[i]
    if (!digitChar) return false
    let digit = Number.parseInt(digitChar, 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  return sum % 10 === 0
}

// ============================================================================
// Main Component
// ============================================================================

const fieldLabels = {
  number: 'Card number',
  expiry: 'Expiration date',
  cvv: 'Security code',
  name: 'Name on card',
} as const

/** CreditCardInput export. */
export const CreditCardInput = React.forwardRef<HTMLDivElement, CreditCardInputProps>(
  (
    {
      size: sizeProp,
      variant: variantProp,
      color,
      radius: radiusProp,
      error = false,
      disabled = false,
      value,
      onChange,
      showName = false,
      numberPlaceholder = 'Card number',
      expiryPlaceholder = 'MM/YY',
      cvvPlaceholder = 'CVV',
      namePlaceholder = 'Name on card',
      className,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size
    const variant = variantProp ?? fieldGroup.variant

    // Internal state
    const [cardNumber, setCardNumber] = React.useState(value?.number ?? '')
    const [expiry, setExpiry] = React.useState(value?.expiry ?? '')
    const [cvv, setCvv] = React.useState(value?.cvv ?? '')
    const [name, setName] = React.useState(value?.name ?? '')
    const [cardType, setCardType] = React.useState<CardType>(value?.cardType ?? 'unknown')

    // Sync with controlled value
    React.useEffect(() => {
      if (value) {
        setCardNumber(value.number)
        setExpiry(value.expiry)
        setCvv(value.cvv)
        setName(value.name)
        setCardType(value.cardType)
      }
    }, [value])

    // Emit changes
    const emitChange = React.useCallback(
      (updates: Partial<{ number: string; expiry: string; cvv: string; name: string }>) => {
        const newNumber = updates.number ?? cardNumber
        const newExpiry = updates.expiry ?? expiry
        const newCvv = updates.cvv ?? cvv
        const newName = updates.name ?? name

        const detectedType = detectCardType(newNumber)
        const rawNumber = newNumber.replace(/\s/g, '')
        const cvvLength = getCvvLength(detectedType)

        const isValid =
          validateCardNumber(newNumber) &&
          validateExpiry(newExpiry) &&
          newCvv.length === cvvLength &&
          (!showName || newName.trim().length > 0)

        const newValue: CreditCardValue = {
          number: newNumber,
          rawNumber,
          expiry: newExpiry,
          cvv: newCvv,
          name: newName,
          cardType: detectedType,
          isValid,
        }

        onChange?.(newValue)
      },
      [cardNumber, expiry, cvv, name, showName, onChange],
    )

    const handleNumberChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newType = detectCardType(e.target.value)
        setCardType(newType)
        const formatted = formatCardNumber(e.target.value, newType)
        setCardNumber(formatted)
        emitChange({ number: formatted })
      },
      [emitChange],
    )

    const handleExpiryChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value)
        setExpiry(formatted)
        emitChange({ expiry: formatted })
      },
      [emitChange],
    )

    const handleCvvChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, getCvvLength(cardType))
        setCvv(digits)
        emitChange({ cvv: digits })
      },
      [cardType, emitChange],
    )

    const handleNameChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        emitChange({ name: e.target.value })
      },
      [emitChange],
    )

    const textFieldVariant = toBaseTextFieldVariant(variant)
    const sharedTextFieldProps = {
      size,
      variant: textFieldVariant,
      color,
      radius: radiusProp,
      error,
      disabled,
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <TextField
          {...sharedTextFieldProps}
          type="text"
          inputMode="numeric"
          value={cardNumber}
          onChange={handleNumberChange}
          placeholder={numberPlaceholder}
          aria-label={fieldLabels.number}
          maxLength={19}
          autoComplete="cc-number"
          leftElement={<CardTypeIcon type={cardType} />}
        />

        <div className="flex gap-2">
          <TextField
            {...sharedTextFieldProps}
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={handleExpiryChange}
            placeholder={expiryPlaceholder}
            aria-label={fieldLabels.expiry}
            maxLength={5}
            autoComplete="cc-exp"
            className="flex-1"
          />

          <TextField
            {...sharedTextFieldProps}
            type="text"
            inputMode="numeric"
            value={cvv}
            onChange={handleCvvChange}
            placeholder={cvvPlaceholder}
            aria-label={fieldLabels.cvv}
            maxLength={4}
            autoComplete="cc-csc"
            className="flex-1"
            rightIcon={<Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          />
        </div>

        {showName && (
          <TextField
            {...sharedTextFieldProps}
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={namePlaceholder}
            aria-label={fieldLabels.name}
            autoComplete="cc-name"
          />
        )}
      </div>
    )
  },
)

CreditCardInput.displayName = 'CreditCardInput'
