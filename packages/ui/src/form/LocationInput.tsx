'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { Country, type ICountry, type IState, State } from 'country-state-city'
import { CheckIcon, ChevronDown, Search } from 'lucide-react'
import * as React from 'react'
import { getRadiusStyles, getSizeStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import type { BaseTextFieldVariant, Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldSizeVariants,
} from './text-field.css'
import { type FloatingStyle, getFloatingStyle, isFloatingVariant, toBaseTextFieldVariant } from './text-field-variant'
// TBD - need to use our Select Component instead of re-implementing select logic here. This is currently separate to avoid adding @base-ui/react as a dependency to the entire ui package, but we may want to move the Select component into ui at some point which would allow us to unify the select logic and styles.
// ============================================================================
// Helpers
// ============================================================================

export interface LocationValue {
  country?: string
  countryCode?: string
  state?: string
  stateCode?: string
}

export interface LocationInputProps {
  /** Label text */
  label?: React.ReactNode
  /** The size of the selects */
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
  value?: LocationValue
  /** Called when location changes */
  onChange?: (value: LocationValue) => void
  /** Called when country changes */
  onCountryChange?: (country: ICountry | null) => void
  /** Called when state changes */
  onStateChange?: (state: IState | null) => void
  /** Default country code (e.g., "US") */
  defaultCountry?: string
  /** Placeholder for country select */
  countryPlaceholder?: string
  /** Placeholder for state select */
  statePlaceholder?: string
  /** Whether to show state selector */
  showStateSelector?: boolean
  /** Additional class name for the container */
  className?: string
}

// ============================================================================
// Searchable Select Component (Internal)
// ============================================================================

interface SearchableSelectProps<T> {
  items: T[]
  value?: string
  onValueChange: (value: string | null) => void
  getItemValue: (item: T) => string
  getItemLabel: (item: T) => string
  getItemSearchText?: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: Size
  variant?: BaseTextFieldVariant
  radius?: Radius
  combinedStyles: React.CSSProperties
  triggerId?: string
  label?: React.ReactNode
  ariaLabel?: string
  floating?: boolean
  floatingStyle?: FloatingStyle | null
}

function SearchableSelect<T>({
  items,
  value,
  onValueChange,
  getItemValue,
  getItemLabel,
  getItemSearchText,
  renderItem,
  placeholder = 'Select...',
  disabled,
  error,
  variant,
  combinedStyles,
  triggerId,
  label,
  ariaLabel,
  floating = false,
  floatingStyle,
}: Omit<SearchableSelectProps<T>, 'radius' | 'size'>) {
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const searchLower = search.toLowerCase()
    return items.filter(item => {
      const searchText = getItemSearchText ? getItemSearchText(item) : getItemLabel(item)
      return searchText.toLowerCase().includes(searchLower)
    })
  }, [items, search, getItemSearchText, getItemLabel])

  const selectedItem = React.useMemo(
    () => items.find(item => getItemValue(item) === value),
    [items, value, getItemValue],
  )

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <div className={cn(floating && 'relative w-full')}>
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-label={label ? undefined : ariaLabel}
          className={cn(
            'inline-flex items-center justify-between w-full outline-none transition-all duration-150 ease-in-out',
            floating
              ? [
                  'peer text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)]',
                  floatingInputBaseCls,
                  floatingStyle && floatingInputStyleVariants[floatingStyle],
                  floatingStyle && textFieldFloatingColorVariants[error ? 'error' : 'slate']?.[floatingStyle],
                ]
              : [
                  'h-[var(--element-height)]',
                  'px-[var(--element-padding-x)] py-[var(--element-padding-y)]',
                  'text-[var(--element-font-size)] leading-[var(--element-line-height)]',
                  'rounded-[var(--element-border-radius)]',
                  'text-[var(--color-text)]',

                  variant === 'solid' && [
                    'border-0',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90',
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  ],
                  variant === 'outline' && [
                    'border border-input',
                    'bg-background',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  ],
                  variant === 'soft' && [
                    'border-0',
                    'bg-secondary text-secondary-foreground',
                    'hover:bg-secondary/80',
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  ],
                  variant === 'ghost' && [
                    'border-0',
                    'bg-transparent',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  ],

                  error && [
                    'border-destructive focus:border-destructive',
                    'focus:ring-destructive/20',
                    variant === 'soft' && 'bg-destructive/10',
                  ],
                ],
            disabled && ['opacity-50 cursor-not-allowed'],
          )}
          style={combinedStyles}
        >
          <SelectPrimitive.Value>
            {() =>
              selectedItem ? (
                renderItem ? (
                  renderItem(selectedItem)
                ) : (
                  getItemLabel(selectedItem)
                )
              ) : floating ? (
                <span className="opacity-0">{placeholder}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            }
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon render={<ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />} />
        </SelectPrimitive.Trigger>

        {floating && label ? (
          <label
            htmlFor={triggerId}
            className={cn(
              'absolute text-[length:var(--tf-font-size)] text-[color:var(--tf-color-text)]',
              'duration-300 origin-[0]',
              'pointer-events-none select-none',
              floatingStyle === 'filled' && [
                'left-[var(--tf-padding-x)] top-[0.875rem] z-10',
                '-translate-y-4 scale-75',
                'peer-data-[popup-open]:text-[color:var(--tf-color-primary)]',
              ],
              floatingStyle === 'outlined' && [
                'left-[var(--tf-padding-x)] top-[0.375rem] z-10',
                '-translate-y-4 scale-75 bg-background px-1',
                'peer-data-[popup-open]:text-[color:var(--tf-color-primary)] peer-data-[popup-open]:bg-background peer-data-[popup-open]:px-1',
              ],
              floatingStyle === 'standard' && [
                'left-0 top-[0.625rem] z-10',
                '-translate-y-6 scale-75',
                'peer-data-[popup-open]:text-[color:var(--tf-color-primary)]',
              ],
            )}
          >
            {label}
          </label>
        ) : null}
      </div>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={4} className="z-50">
          <SelectPrimitive.Popup
            className={cn(
              'relative min-w-[12rem] max-h-[300px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
              'data-open:animate-in data-closed:animate-out',
              'data-closed:fade-out-0 data-open:fade-in-0',
              'data-closed:zoom-out-95 data-open:zoom-in-95',
            )}
          >
            {/* Search input */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <SelectPrimitive.List className="p-1 max-h-[250px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No results found</div>
              ) : (
                filteredItems.map(item => (
                  <SelectPrimitive.Item
                    key={getItemValue(item)}
                    value={getItemValue(item)}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                      'focus:bg-accent focus:text-accent-foreground',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {renderItem ? renderItem(item) : getItemLabel(item)}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator
                      render={
                        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                      }
                    >
                      <CheckIcon className="size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/** LocationInput export. */
export const LocationInput = React.forwardRef<HTMLDivElement, LocationInputProps>(
  (
    {
      label,
      size: sizeProp,
      variant: variantProp,
      color: _color,
      radius: radiusProp,
      error = false,
      disabled: disabledProp = false,
      value,
      onChange,
      onCountryChange,
      onStateChange,
      defaultCountry = 'US',
      countryPlaceholder = 'Select country',
      statePlaceholder = 'Select state',
      showStateSelector = true,
      className,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = (sizeProp ?? fieldGroup.size) as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant
    const disabled = disabledProp || fieldGroup.disabled
    const floatingStyle = label ? getFloatingStyle(variant) : null
    const floating = label ? isFloatingVariant(variant) : false

    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const sizeStyles = getSizeStyles(size)
    const radiusStyles = getRadiusStyles(radius)
    const combinedStyles = { ...sizeStyles, ...radiusStyles }

    // Get all countries
    const countries = React.useMemo(() => Country.getAllCountries(), [])

    // Determine if component is controlled
    const isControlled = value !== undefined

    // Initialize with default country if no value provided
    const [internalCountryCode, setInternalCountryCode] = React.useState<string | undefined>(() => {
      if (value?.countryCode) return value.countryCode
      if (defaultCountry) {
        const country = countries.find(c => c.isoCode === defaultCountry)
        return country?.isoCode
      }
      return undefined
    })

    const [internalStateCode, setInternalStateCode] = React.useState<string | undefined>(value?.stateCode)

    // Derive selected codes from controlled value or internal state
    const selectedCountryCode = isControlled ? value?.countryCode : internalCountryCode
    const selectedStateCode = isControlled ? value?.stateCode : internalStateCode

    // Sync with controlled value (only for uncontrolled -> controlled transitions)
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalCountryCode(value.countryCode)
        setInternalStateCode(value.stateCode)
      }
    }, [value])

    // Get states for selected country
    const states = React.useMemo(() => {
      if (!selectedCountryCode) return []
      return State.getStatesOfCountry(selectedCountryCode)
    }, [selectedCountryCode])

    // Get selected country and state objects
    const selectedCountry = React.useMemo(
      () => countries.find(c => c.isoCode === selectedCountryCode),
      [countries, selectedCountryCode],
    )

    // Track if initial value has been emitted
    const hasEmittedInitialValue = React.useRef(false)

    // Emit initial value with default country (only once on mount)
    React.useEffect(() => {
      if (hasEmittedInitialValue.current) return
      if (!value && defaultCountry && selectedCountry) {
        hasEmittedInitialValue.current = true
        const initialValue: LocationValue = {
          country: selectedCountry.name,
          countryCode: selectedCountry.isoCode,
        }
        onChange?.(initialValue)
        onCountryChange?.(selectedCountry)
      }
    }, [value, defaultCountry, selectedCountry, onChange, onCountryChange])

    const handleCountryChange = React.useCallback(
      (countryCode: string | null) => {
        if (!countryCode) return

        const country = countries.find(c => c.isoCode === countryCode)
        if (!country) return

        // Only update internal state when uncontrolled
        if (!isControlled) {
          setInternalCountryCode(countryCode)
          setInternalStateCode(undefined)
        }

        const newValue: LocationValue = {
          country: country.name,
          countryCode: country.isoCode,
          state: undefined,
          stateCode: undefined,
        }

        onChange?.(newValue)
        onCountryChange?.(country)
        onStateChange?.(null)
      },
      [countries, onChange, onCountryChange, onStateChange, isControlled],
    )

    const handleStateChange = React.useCallback(
      (stateCode: string | null) => {
        if (!stateCode || !selectedCountry) return

        const state = states.find(s => s.isoCode === stateCode)
        if (!state) return

        // Only update internal state when uncontrolled
        if (!isControlled) {
          setInternalStateCode(stateCode)
        }

        const newValue: LocationValue = {
          country: selectedCountry.name,
          countryCode: selectedCountry.isoCode,
          state: state.name,
          stateCode: state.isoCode,
        }

        onChange?.(newValue)
        onStateChange?.(state)
      },
      [selectedCountry, states, onChange, onStateChange, isControlled],
    )

    // Render country item with flag
    const renderCountryItem = React.useCallback(
      (country: ICountry) => (
        <span className="flex items-center gap-2">
          <span className="text-base">{country.flag}</span>
          <span className="truncate">{country.name}</span>
        </span>
      ),
      [],
    )

    const generatedId = React.useId()
    const countryId = `${generatedId}-country`
    const stateId = `${generatedId}-state`

    const controls = (
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {/* Country Select */}
        <div className="flex-1">
          <SearchableSelect
            items={countries}
            value={selectedCountryCode}
            onValueChange={handleCountryChange}
            getItemValue={c => c.isoCode}
            getItemLabel={c => c.name}
            getItemSearchText={c => `${c.name} ${c.isoCode}`}
            renderItem={renderCountryItem}
            placeholder={countryPlaceholder}
            disabled={disabled}
            error={error}
            variant={variant ? toBaseTextFieldVariant(variant) : undefined}
            combinedStyles={combinedStyles}
            triggerId={countryId}
            label={label}
            ariaLabel={typeof label === 'string' ? label : countryPlaceholder}
            floating={floating}
            floatingStyle={floatingStyle}
          />
        </div>

        {/* State Select */}
        {showStateSelector && states.length > 0 && (
          <div className="flex-1">
            <SearchableSelect
              items={states}
              value={selectedStateCode}
              onValueChange={handleStateChange}
              getItemValue={s => s.isoCode}
              getItemLabel={s => s.name}
              getItemSearchText={s => `${s.name} ${s.isoCode}`}
              placeholder={statePlaceholder}
              disabled={disabled}
              error={error}
              variant={variant ? toBaseTextFieldVariant(variant) : undefined}
              combinedStyles={combinedStyles}
              triggerId={stateId}
              label={floating ? statePlaceholder : undefined}
              ariaLabel={statePlaceholder}
              floating={floating}
              floatingStyle={floatingStyle}
            />
          </div>
        )}
      </div>
    )

    if (floating) {
      return (
        <div
          ref={ref}
          className={cn(
            textFieldSizeVariants[size],
            textFieldFloatingWrapperColorVariants[error ? 'error' : 'slate'],
            className,
          )}
          style={radiusStyles}
        >
          {controls}
        </div>
      )
    }

    if (!label) {
      return (
        <div ref={ref} className={className}>
          {controls}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('grid gap-1.5', className)}>
        <Label htmlFor={countryId} size={size} disabled={disabled}>
          {label}
        </Label>
        {controls}
      </div>
    )
  },
)

LocationInput.displayName = 'LocationInput'
