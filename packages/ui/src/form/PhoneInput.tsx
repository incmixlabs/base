'use client'

import { Country, type ICountry } from 'country-state-city'
import { ChevronDown, Phone } from 'lucide-react'
import * as React from 'react'
import { getRadiusStyles, getSizeStyles, useThemeRadius } from '@/elements/utils'
import { isActivationKey } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { containerColorStyles, containerVariantStyles, getBaseVariant } from './textFieldStyles'

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
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size
    const variant = variantProp ?? fieldGroup.variant

    const radius = useThemeRadius(radiusProp)
    const sizeStyles = getSizeStyles(size)
    const radiusStyles = getRadiusStyles(radius)
    const combinedStyles = { ...sizeStyles, ...radiusStyles, ...style }

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

    const effectiveColor = error ? 'error' : color
    const baseVariant = getBaseVariant(variant)

    return (
      <div
        className={cn(
          'relative flex items-center',
          'h-[var(--element-height)]',
          'rounded-[var(--element-border-radius)]',
          containerVariantStyles[baseVariant],
          effectiveColor && containerColorStyles[effectiveColor],
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        style={
          { ...(effectiveColor ? formColorVars[effectiveColor] : undefined), ...combinedStyles } as React.CSSProperties
        }
      >
        {/* Country Selector */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1 px-2 h-full border-r border-input/50',
            'hover:bg-accent/50 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            'rounded-l-[var(--element-border-radius)]',
          )}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="text-base">{selectedCountry?.flag}</span>
          <span className="text-sm text-muted-foreground">+{selectedCountry?.phonecode}</span>
          <ChevronDown className={cn('h-3 w-3 opacity-50', dropdownOpen && 'rotate-180')} />
        </button>

        {/* Phone Icon */}
        <div className="flex items-center justify-center px-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Phone Number Input */}
        <input
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={disabled}
          placeholder={phonePlaceholder}
          className={cn(
            'flex-1 h-full bg-transparent outline-none',
            'text-[var(--element-font-size)]',
            'pr-[var(--element-padding-x)]',
            'placeholder:text-muted-foreground',
          )}
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
