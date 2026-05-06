'use client'

import { Country, type ICountry } from 'country-state-city'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Icon } from '@/elements/button/Icon'
import { Flex } from '@/layouts/flex/Flex'
import { isActivationKey } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { Text } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { TextField } from './TextField'
import { toBaseTextFieldVariant } from './text-field-variant'

// ============================================================================
// Types
// ============================================================================

export interface PhoneValue {
  /** Country code (e.g., "US") */
  countryCode: string
  /** Phone code (e.g., "+1") */
  phoneCode: string
  /** Phone number without country code */
  number: string
  /** Full formatted number */
  fullNumber: string
}

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
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
  /** Current value */
  value?: PhoneValue
  /** Called when phone changes */
  onChange?: (value: PhoneValue) => void
  /** Default country code */
  defaultCountry?: string
  /** Countries to show (if not provided, shows all) */
  countries?: string[]
  /** Placeholder for the phone number input */
  phonePlaceholder?: string
}

// ============================================================================
// Main Component
// ============================================================================

/** PhoneInput export. */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
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
      defaultCountry = 'US',
      countries: allowedCountries,
      phonePlaceholder = 'Phone number',
      className,
      style,
      placeholder,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size
    const variant = variantProp ?? fieldGroup.variant

    const [dropdownOpen, setDropdownOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    // Get available countries
    const availableCountries = React.useMemo(() => {
      const allCountries = Country.getAllCountries()
      if (allowedCountries && allowedCountries.length > 0) {
        return allCountries.filter(c => allowedCountries.includes(c.isoCode))
      }
      return allCountries
    }, [allowedCountries])

    // Initialize state
    const [selectedCountry, setSelectedCountry] = React.useState<ICountry | undefined>(() => {
      if (value?.countryCode) {
        return availableCountries.find(c => c.isoCode === value.countryCode)
      }
      return availableCountries.find(c => c.isoCode === defaultCountry)
    })

    const [phoneNumber, setPhoneNumber] = React.useState(value?.number ?? '')

    // Sync with controlled value
    React.useEffect(() => {
      if (value) {
        setSelectedCountry(availableCountries.find(c => c.isoCode === value.countryCode))
        setPhoneNumber(value.number)
      }
    }, [value, availableCountries])

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (event: PointerEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false)
        }
      }

      if (dropdownOpen) {
        document.addEventListener('pointerdown', handleClickOutside)
        return () => document.removeEventListener('pointerdown', handleClickOutside)
      }
    }, [dropdownOpen])

    // Emit change
    const emitChange = React.useCallback(
      (country: ICountry | undefined, number: string) => {
        if (!country) return

        const phoneCode = `+${country.phonecode}`
        const newValue: PhoneValue = {
          countryCode: country.isoCode,
          phoneCode,
          number,
          fullNumber: number ? `${phoneCode}${number}` : '',
        }
        onChange?.(newValue)
      },
      [onChange],
    )

    const handleCountrySelect = React.useCallback(
      (country: ICountry) => {
        setSelectedCountry(country)
        setDropdownOpen(false)
        emitChange(country, phoneNumber)
      },
      [phoneNumber, emitChange],
    )

    const handlePhoneChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, spaces, dashes, and parentheses
        const cleaned = e.target.value.replace(/[^\d\s\-()]/g, '')
        setPhoneNumber(cleaned)
        emitChange(selectedCountry, cleaned)
      },
      [selectedCountry, emitChange],
    )

    const textFieldStyle = {
      '--tf-left-slot-width': '8.75rem',
      ...style,
    } as React.CSSProperties
    const resolvedPlaceholder = placeholder ?? phonePlaceholder

    return (
      <div className="relative">
        <TextField
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={disabled}
          placeholder={resolvedPlaceholder}
          aria-label={ariaLabel ?? resolvedPlaceholder}
          size={size}
          variant={toBaseTextFieldVariant(variant)}
          color={color}
          radius={radiusProp}
          error={error}
          className={className}
          style={textFieldStyle}
          leftElement={
            <Flex height="var(--tf-height)" align="center" className={cn(disabled && 'opacity-50')}>
              <Button
                ref={triggerRef}
                type="button"
                variant="ghost"
                color="slate"
                onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
                disabled={disabled}
                className={cn(
                  'h-full gap-1 border-y-0 border-l-0 border-r border-input/50 px-2 py-0',
                  'focus-visible:ring-inset',
                  'rounded-l-[var(--element-border-radius)]',
                  disabled && 'cursor-not-allowed',
                )}
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                aria-label={
                  selectedCountry
                    ? `Change country code, current country ${selectedCountry.name} +${selectedCountry.phonecode}`
                    : 'Select country code'
                }
              >
                <Text size="md">{selectedCountry?.flag}</Text>
                <Text size="sm" color="neutral">
                  +{selectedCountry?.phonecode}
                </Text>
                <Icon
                  icon="chevron-down"
                  size="xs"
                  color="neutral"
                  className={cn('opacity-50 transition-transform', dropdownOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </Button>
              <Flex align="center" justify="center" px="2">
                <Icon icon="phone" size="sm" color="neutral" aria-hidden="true" />
              </Flex>
            </Flex>
          }
          {...props}
        />

        {/* Country Dropdown */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute left-0 top-full mt-1 z-50',
              'w-64 max-h-[200px] overflow-y-auto',
              'rounded-md border bg-popover text-popover-foreground shadow-md',
              'animate-in fade-in-0 zoom-in-95',
            )}
            role="listbox"
          >
            {availableCountries.map(country => (
              <div
                key={country.isoCode}
                onClick={() => handleCountrySelect(country)}
                onKeyDown={e => {
                  if (isActivationKey(e.key)) {
                    e.preventDefault()
                    handleCountrySelect(country)
                  }
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  selectedCountry?.isoCode === country.isoCode && 'bg-accent/50',
                )}
                role="option"
                aria-selected={selectedCountry?.isoCode === country.isoCode}
                tabIndex={0}
              >
                <span className="text-base">{country.flag}</span>
                <span className="flex-1 truncate">{country.name}</span>
                <span className="text-muted-foreground">+{country.phonecode}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
)

PhoneInput.displayName = 'PhoneInput'
