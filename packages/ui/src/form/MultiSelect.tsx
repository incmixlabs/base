'use client'

import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements'
import { Badge, type BadgeProps } from '@/elements/badge/Badge'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Column, Flex, Row } from '@/layouts/flex/Flex'
import { isActivationKey, KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { partitionVisibleOverflow } from '@/lib/overflow'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { Text } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { formControlBorderFrame } from './form-control.class'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import {
  pickerEmptyStateBase,
  pickerEmptyStateBySize,
  pickerFooterActionsBase,
  pickerFooterBySize,
  pickerFooterStatusBase,
  pickerIndicatorBySize,
  pickerOptionItemBase,
  pickerOptionItemBySize,
  pickerPopupBase,
  pickerPopupViewportBase,
  pickerPopupViewportBySize,
  pickerSearchRowBase,
  pickerStatusRowBase,
  pickerStatusRowBySize,
} from './picker-popup.class'
import { SearchInput } from './SearchInput'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  floatingLabelSizeVariants,
  floatingLabelStyleVariants,
  textFieldEnhancementVariants,
  textFieldFloatingBaseSizeVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingInputSizeVariants,
  textFieldFloatingLabelColorVariants,
  textFieldInputBaseCls,
  textFieldMinControlSizeVariants,
  textFieldRootCls,
  textFieldSurfaceColorVariants,
} from './text-field.class'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'

const multiSelectTextSizeBySize: Record<ExtendedFormSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  '2x': 'xl',
}

export interface MultiSelectOption {
  /** Unique value for the option */
  value: string
  /** Display label for the option */
  label: string
  /** Optional option color */
  color?: Color
  /** Optional icon */
  icon?: React.ReactNode
  /** Whether the option is disabled */
  disabled?: boolean
  /** Optional label variant */
  variant?: BadgeProps['variant']
}

export interface MultiSelectProps {
  /** DOM id for the trigger element */
  id?: string
  /** External label element id */
  ariaLabelledby?: string
  /** Supporting description id */
  'aria-describedby'?: string
  /** Accessible error state override */
  'aria-invalid'?: boolean
  /** Field label. Required for floating-* variants. */
  label?: React.ReactNode
  /** Available options */
  options: MultiSelectOption[]
  /** Selected values */
  value?: string[]
  /** Called when selection changes */
  onChange?: (value: string[]) => void
  /** Placeholder when no items selected */
  placeholder?: string
  /** Maximum number of visible selected badges before folding the remainder into a summary dropdown */
  max?: number
  /** Maximum number of items that can be selected */
  maxSelected?: number
  /** The size of the component */
  size?: Size
  /** The visual variant */
  variant?: TextFieldVariant
  /** The accent color */
  color?: Color
  /** The border radius */
  radius?: Radius
  /** Border radius for colored option badges in the dropdown. */
  optionBadgeRadius?: Radius
  /** Whether the field has an error */
  error?: boolean
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether the input is read-only */
  readOnly?: boolean
  /** Additional class name */
  className?: string
  /** Text shown when max items selected */
  maxSelectedText?: string
  /** Whether to show selected items as badges */
  showBadges?: boolean
  /** Maximum number of selected badges to display before collapsing the remainder into a +N badge */
  maxVisibleBadges?: number
  /** Whether to allow searching/filtering options */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Whether users can create a new option from the current search when no results are found */
  creatable?: boolean
  /** Render only the dropdown content (no trigger button). For embedding inside another component. */
  inline?: boolean
  /** Add popup shell (border, shadow, background) around inline content. Use when rendering as a standalone picker. */
  popup?: boolean
  /** Called when user confirms selection. Shows "Add" button in inline mode. Selections accumulate until confirmed. */
  onApply?: (selectedValues: string[]) => void
  /** Label for the inline apply action. */
  applyLabel?: string
  /** Allows the inline apply action when no values are selected. */
  allowEmptyApply?: boolean
  /** Called when user cancels inline selection. */
  onCancel?: () => void
  /** Label for the inline cancel action. */
  cancelLabel?: string
  /** Called when the picker wants to close itself (inline mode). */
  onClose?: () => void
  /** External search text (e.g. from a trigger query). Used until the user types in the search input. */
  defaultSearch?: string
}

/** MultiSelect export. */
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      id,
      ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      label,
      value,
      onChange,
      placeholder = 'Select items...',
      max = 3,
      maxSelected,
      size: sizeProp,
      variant: variantProp,
      color,
      radius: radiusProp,
      optionBadgeRadius,
      error = false,
      disabled: disabledProp = false,
      readOnly = false,
      className,
      maxSelectedText = 'Max items selected',
      showBadges = true,
      maxVisibleBadges,
      searchable = true,
      searchPlaceholder = 'Search...',
      creatable = false,
      inline = false,
      popup = false,
      onApply,
      applyLabel = 'Add',
      allowEmptyApply = false,
      onCancel,
      cancelLabel = 'Cancel',
      onClose,
      defaultSearch,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = (sizeProp ?? fieldGroup.size ?? 'xs') as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant
    const surfaceVariant = resolveSurfaceVariant(variant ?? 'outline')
    const effectiveColor: Color = error ? SemanticColor.error : (color ?? SemanticColor.slate)
    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const combinedStyles = getRadiusStyles(radius)
    const effectiveReadOnly = readOnly || fieldGroup.readOnly
    const disabled = disabledProp || effectiveReadOnly || fieldGroup.disabled
    const floatingStyle = getFloatingStyle(variant)
    const generatedId = React.useId()
    const triggerId = id ?? generatedId

    const [open, setOpen] = React.useState(false)
    const [overflowOpen, setOverflowOpen] = React.useState(false)
    const [searchInput, setSearchInput] = React.useState<string | null>(null)
    const search = searchInput ?? defaultSearch ?? ''
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>([])
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const overflowRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const isControlled = value !== undefined
    const selectedValues = value ?? uncontrolledValue

    const hydratedOptions = React.useMemo(() => {
      const optionByValue = new Map(options.map(option => [option.value, option] as const))
      for (const value of selectedValues) {
        if (!optionByValue.has(value)) {
          optionByValue.set(value, { value, label: value })
        }
      }
      return Array.from(optionByValue.values())
    }, [options, selectedValues])

    const filteredOptions = React.useMemo(() => {
      if (!search) return hydratedOptions
      const searchLower = search.toLowerCase()
      return hydratedOptions.filter(option => option.label.toLowerCase().includes(searchLower))
    }, [hydratedOptions, search])

    const selectedOptions = React.useMemo(() => {
      const optionByValue = new Map(hydratedOptions.map(option => [option.value, option] as const))
      return selectedValues.map(value => optionByValue.get(value) ?? { value, label: value })
    }, [hydratedOptions, selectedValues])
    const effectiveMaxVisibleBadges = maxVisibleBadges ?? max
    const {
      visibleItems: visibleSelectedOptions,
      overflowItems: hiddenSelectedOptions,
      overflowCount: hiddenSelectedCount,
    } = React.useMemo(
      () => partitionVisibleOverflow(selectedOptions, effectiveMaxVisibleBadges),
      [effectiveMaxVisibleBadges, selectedOptions],
    )
    const useOverflowBadge = showBadges && hiddenSelectedCount > 0
    const labelId = React.useId()
    const summaryId = React.useId()
    const selectedSummary = React.useMemo(() => {
      if (selectedOptions.length === 0) return ''
      if (!showBadges) {
        return selectedOptions.map(option => option.label).join(', ')
      }
      const visibleLabels = visibleSelectedOptions.map(option => option.label).join(', ')
      return hiddenSelectedCount > 0 ? `${visibleLabels} +${hiddenSelectedCount}` : visibleLabels
    }, [hiddenSelectedCount, selectedOptions, showBadges, visibleSelectedOptions])
    const badgeSize = 'xs'
    const textSize = multiSelectTextSizeBySize[size]
    const isMaxReached = maxSelected !== undefined && selectedValues.length >= maxSelected
    const trimmedSearch = search.trim()
    const canCreate =
      creatable &&
      trimmedSearch.length > 0 &&
      filteredOptions.length === 0 &&
      !selectedValues.includes(trimmedSearch) &&
      !options.some(
        option =>
          option.value.toLowerCase() === trimmedSearch.toLowerCase() ||
          option.label.toLowerCase() === trimmedSearch.toLowerCase(),
      )

    const createOption = React.useCallback(() => {
      if (disabled || isMaxReached || !canCreate) {
        return
      }

      const nextValue = [...selectedValues, trimmedSearch]
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue)
      setSearchInput('')
    }, [canCreate, disabled, isControlled, isMaxReached, onChange, selectedValues, trimmedSearch])

    const createAction = canCreate ? (
      <Button
        type="button"
        size="xs"
        variant="ghost"
        color="primary"
        disabled={disabled || isMaxReached}
        onClick={event => {
          event.stopPropagation()
          createOption()
        }}
        className="shrink-0"
      >
        Create "{trimmedSearch}"
      </Button>
    ) : null

    const renderOptionLabel = (option: MultiSelectOption) =>
      option.color ? (
        <Badge size={badgeSize} color={option.color} variant={option.variant ?? 'soft'} radius={optionBadgeRadius}>
          {option.label}
        </Badge>
      ) : (
        <span>{option.label}</span>
      )

    const searchField = searchable ? (
      <Row align="center" gap="2" className="w-full">
        <Flex flexGrow="1" flexBasis="0%" className="min-w-0">
          <SearchInput
            ref={searchInputRef}
            disabled={disabled}
            m="0"
            size={size}
            variant={variant}
            color={effectiveColor}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={event => setSearchInput(event.target.value)}
            onClick={event => event.stopPropagation()}
            onKeyDown={event => {
              if (event.key !== KEYBOARD_KEYS.enter || !canCreate) return
              event.preventDefault()
              event.stopPropagation()
              createOption()
            }}
            className="w-full"
          />
        </Flex>
        {createAction}
      </Row>
    ) : null

    const toggleOption = React.useCallback(
      (optionValue: string) => {
        if (disabled) return

        const isSelected = selectedValues.includes(optionValue)
        if (!isSelected && isMaxReached) {
          return
        }

        const nextValue = isSelected
          ? selectedValues.filter(currentValue => currentValue !== optionValue)
          : [...selectedValues, optionValue]

        if (!isControlled) {
          setUncontrolledValue(nextValue)
        }
        onChange?.(nextValue)
      },
      [disabled, isControlled, isMaxReached, onChange, selectedValues],
    )

    const handleRemove = React.useCallback(
      (optionValue: string) => {
        if (disabled) return
        const nextValue = selectedValues.filter(currentValue => currentValue !== optionValue)
        if (!isControlled) {
          setUncontrolledValue(nextValue)
        }
        onChange?.(nextValue)
      },
      [disabled, isControlled, onChange, selectedValues],
    )

    React.useEffect(() => {
      if (inline) return

      const handleClickOutside = (event: PointerEvent) => {
        const target = event.target as Node
        const inDropdown = dropdownRef.current?.contains(target) ?? false
        const inTrigger = triggerRef.current?.contains(target) ?? false
        const inOverflow = overflowRef.current?.contains(target) ?? false

        if (!inDropdown && !inTrigger && !inOverflow) {
          setOpen(false)
          setOverflowOpen(false)
        }
      }

      if (!open) return

      document.addEventListener('pointerdown', handleClickOutside)
      return () => document.removeEventListener('pointerdown', handleClickOutside)
    }, [open, inline])

    React.useEffect(() => {
      if (inline) return
      if (!open) setSearchInput(null)
    }, [open, inline])

    React.useEffect(() => {
      if (!useOverflowBadge) {
        setOverflowOpen(false)
      }
    }, [useOverflowBadge])

    React.useEffect(() => {
      if (open) {
        setOverflowOpen(false)
      }
    }, [open])

    // Auto-focus the search box as soon as the option surface opens.
    React.useEffect(() => {
      if (!searchable) return
      if (!inline && !open) return
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }, [inline, open, searchable])

    // ── Inline mode: render dropdown content directly ──
    if (inline) {
      return (
        <div ref={ref} className={cn(popup && pickerPopupBase, className)}>
          {searchable ? <div className={pickerSearchRowBase}>{searchField}</div> : null}

          {isMaxReached ? (
            <div className={cn(pickerStatusRowBase, pickerStatusRowBySize[size])}>{maxSelectedText}</div>
          ) : null}

          <div
            className={cn(pickerPopupViewportBase, pickerPopupViewportBySize[size])}
            role="listbox"
            aria-multiselectable="true"
            aria-disabled={disabled || undefined}
          >
            {filteredOptions.length === 0 ? (
              <div className={cn(pickerEmptyStateBase, pickerEmptyStateBySize[size])}>No options found</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selectedValues.includes(option.value)
                const isOptionDisabled = disabled || option.disabled || (isMaxReached && !isSelected)

                return (
                  <Flex
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isOptionDisabled || undefined}
                    tabIndex={isOptionDisabled ? -1 : 0}
                    align="center"
                    onClick={() => !isOptionDisabled && toggleOption(option.value)}
                    onKeyDown={event => {
                      if (event.target !== event.currentTarget) return
                      if (isActivationKey(event.key) && !isOptionDisabled) {
                        event.preventDefault()
                        toggleOption(option.value)
                      }
                    }}
                    className={cn('relative', pickerOptionItemBase, pickerOptionItemBySize[size])}
                  >
                    <Flex align="center" gap="2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        tabIndex={-1}
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none shrink-0 rounded border border-current accent-current',
                          pickerIndicatorBySize[size],
                        )}
                      />
                      {option.icon}
                      {renderOptionLabel(option)}
                    </Flex>
                  </Flex>
                )
              })
            )}
          </div>
          {onApply && selectedValues.length > 0 && (
            <div className={cn(pickerFooterStatusBase, pickerFooterBySize[size])}>
              <Text size={textSize} color="neutral">
                {selectedValues.length} selected
              </Text>
            </div>
          )}
          {(onApply || onCancel) && (
            <div className={cn(pickerFooterActionsBase, pickerFooterBySize[size])}>
              {selectedValues.length > 0 && !onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  color="primary"
                  disabled={disabled}
                  onClick={e => {
                    e.stopPropagation()
                    const nextValue: string[] = []
                    if (!isControlled) setUncontrolledValue(nextValue)
                    onChange?.(nextValue)
                  }}
                >
                  Clear
                </Button>
              )}
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  color="neutral"
                  disabled={disabled}
                  onClick={e => {
                    e.stopPropagation()
                    onCancel()
                    onClose?.()
                  }}
                >
                  {cancelLabel}
                </Button>
              )}
              {onApply && (
                <Button
                  type="button"
                  variant="solid"
                  size="xs"
                  color="primary"
                  disabled={disabled || (!allowEmptyApply && selectedValues.length === 0)}
                  onClick={e => {
                    e.stopPropagation()
                    onApply(selectedValues)
                    onClose?.()
                  }}
                >
                  {applyLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      )
    }
    const triggerContent = (
      <>
        <span id={summaryId} className="sr-only">
          {selectedOptions.length > 0 ? selectedSummary : placeholder}
        </span>
        <Row
          align="center"
          gap="1"
          wrap={useOverflowBadge ? 'nowrap' : 'wrap'}
          flexGrow="1"
          flexBasis="0%"
          className="min-w-0"
        >
          {showBadges && selectedOptions.length > 0 ? (
            <>
              <Row
                align="center"
                gap="1"
                wrap={useOverflowBadge ? 'nowrap' : 'wrap'}
                flexGrow={useOverflowBadge ? '1' : undefined}
                flexBasis={useOverflowBadge ? '0%' : undefined}
                className={cn('min-w-0', useOverflowBadge && 'overflow-hidden')}
              >
                {visibleSelectedOptions.map(option => (
                  <Badge
                    key={option.value}
                    size={badgeSize}
                    variant={option.variant ?? 'soft'}
                    color={option.color ?? effectiveColor}
                    className={cn(option.icon && 'gap-1')}
                    onDelete={disabled ? undefined : () => handleRemove(option.value)}
                    deleteLabel={`Remove ${option.label}`}
                  >
                    {option.icon}
                    {option.label}
                  </Badge>
                ))}
              </Row>
              {hiddenSelectedCount > 0 ? (
                <div ref={overflowRef} className="relative shrink-0">
                  <button
                    type="button"
                    aria-label={`${hiddenSelectedCount} more selected`}
                    aria-expanded={overflowOpen}
                    aria-haspopup="menu"
                    onClick={event => {
                      event.stopPropagation()
                      setOpen(false)
                      setOverflowOpen(currentOpen => !currentOpen)
                    }}
                    onMouseEnter={() => {
                      if (!open) {
                        setOverflowOpen(true)
                      }
                    }}
                    className="appearance-none border-0 bg-transparent p-0 shadow-none focus-visible:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-highlight"
                  >
                    <Badge size={badgeSize} variant="outline" color={effectiveColor}>
                      +{hiddenSelectedCount}
                    </Badge>
                  </button>
                  {overflowOpen ? (
                    <div
                      role="dialog"
                      aria-label="Additional selected items"
                      className={cn(
                        'absolute right-0 top-[calc(100%+0.375rem)] z-50 w-max max-w-64 rounded-xl border border-neutral bg-neutral-surface p-1.5 text-neutral shadow-lg',
                      )}
                      onClick={event => event.stopPropagation()}
                      onMouseLeave={() => setOverflowOpen(false)}
                      onKeyDown={event => {
                        if (event.key === KEYBOARD_KEYS.escape) {
                          event.preventDefault()
                          setOverflowOpen(false)
                        }
                      }}
                    >
                      <ul className="m-0 max-h-64 list-none space-y-1 overflow-auto p-0">
                        {hiddenSelectedOptions.map(option => (
                          <li key={option.value}>
                            <Badge
                              size={badgeSize}
                              variant={option.variant ?? 'soft'}
                              color={option.color ?? effectiveColor}
                              className={cn(option.icon && 'gap-1')}
                              onDelete={disabled ? undefined : () => handleRemove(option.value)}
                              deleteLabel={`Remove ${option.label}`}
                            >
                              {option.icon}
                              {option.label}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : selectedOptions.length > 0 ? (
            <Text size={textSize} className="truncate" title={selectedOptions.map(option => option.label).join(', ')}>
              {selectedSummary}
            </Text>
          ) : (
            <Text size={textSize} color="neutral" className={isFloatingVariant(variant) ? 'opacity-0' : undefined}>
              {placeholder}
            </Text>
          )}
        </Row>
        <ChevronDown
          className={cn(
            'ml-2 shrink-0 opacity-50 transition-transform',
            pickerIndicatorBySize[size],
            open && 'rotate-180',
          )}
        />
      </>
    )

    const triggerProps = {
      ref: triggerRef,
      id: triggerId,
      role: 'button' as const,
      tabIndex: disabled ? -1 : 0,
      'aria-disabled': disabled,
      'aria-labelledby':
        [ariaLabelledby, label != null ? labelId : undefined, summaryId].filter(Boolean).join(' ') || undefined,
      'aria-expanded': open,
      'aria-haspopup': 'listbox' as const,
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return
        const target = event.target
        if (target instanceof HTMLElement && target.closest('button')) return
        setOpen(currentOpen => !currentOpen)
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || event.target !== event.currentTarget) return
        if (event.key === KEYBOARD_KEYS.arrowDown) {
          event.preventDefault()
          setOpen(true)
        }
        if (isActivationKey(event.key)) {
          event.preventDefault()
          setOpen(currentOpen => !currentOpen)
        }
        if (event.key === KEYBOARD_KEYS.escape) {
          setOpen(false)
        }
      },
    }

    const floatingLabel = label || (isFloatingVariant(variant) ? placeholder : undefined)

    return (
      <div ref={ref} className={cn(textFieldRootCls, className)} style={combinedStyles}>
        {isFloatingVariant(variant) ? (
          <div className="relative w-full">
            <div
              {...triggerProps}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid ?? (error || undefined)}
              data-placeholder={selectedOptions.length === 0 ? '' : undefined}
              data-popup-open={open ? '' : undefined}
              className={`${cn(
                'peer inline-flex w-full items-center justify-between outline-none transition-all duration-150 ease-in-out',
                floatingInputBaseCls,
                textFieldFloatingBaseSizeVariants[size],
                floatingStyle && floatingInputStyleVariants[floatingStyle],
                floatingStyle && textFieldFloatingInputSizeVariants[size]?.[floatingStyle],
                disabled && 'opacity-50 cursor-not-allowed',
              )} ${floatingStyle ? textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle] : ''}`}
            >
              {triggerContent}
            </div>
            {floatingLabel ? (
              <label
                id={labelId}
                onPointerDown={() => triggerRef.current?.focus()}
                className={cn(
                  'absolute duration-300 origin-[0] select-none cursor-text',
                  floatingStyle && floatingLabelStyleVariants[floatingStyle],
                  floatingStyle && floatingLabelSizeVariants[size]?.[floatingStyle],
                  textFieldFloatingLabelColorVariants[effectiveColor],
                )}
              >
                {floatingLabel}
              </label>
            ) : null}
          </div>
        ) : (
          <Column className="gap-[0.375rem]">
            {label ? (
              <Label
                id={labelId}
                onPointerDown={() => triggerRef.current?.focus()}
                color={error ? SemanticColor.error : undefined}
                disabled={disabled}
              >
                {label}
              </Label>
            ) : null}
            <div
              {...triggerProps}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid ?? (error || undefined)}
              className={clsx(
                cn(
                  textFieldInputBaseCls,
                  'inline-flex w-full box-border items-center justify-between gap-2',
                  textFieldMinControlSizeVariants[size],
                  'text-left',
                  formControlBorderFrame,
                  textFieldSurfaceColorVariants[effectiveColor][surfaceVariant],
                  disabled && 'opacity-50 cursor-not-allowed',
                ),
                textFieldEnhancementVariants[effectiveColor][surfaceVariant],
              )}
            >
              {triggerContent}
            </div>
          </Column>
        )}

        {open ? (
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label="Multi-select options"
            onKeyDown={event => {
              if (event.key === KEYBOARD_KEYS.escape) {
                event.preventDefault()
                event.stopPropagation()
                setOpen(false)
                triggerRef.current?.focus()
              }
            }}
            className={cn('absolute z-50 w-full min-w-[8rem]', pickerPopupBase, 'animate-in fade-in-0 zoom-in-95')}
            style={{ borderTop: 0 }}
          >
            {searchable ? <div className={pickerSearchRowBase}>{searchField}</div> : null}

            {isMaxReached ? (
              <div className={cn(pickerStatusRowBase, pickerStatusRowBySize[size])}>{maxSelectedText}</div>
            ) : null}

            <div
              className={cn(pickerPopupViewportBase, pickerPopupViewportBySize[size])}
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredOptions.length === 0 ? (
                <div className={cn(pickerEmptyStateBase, pickerEmptyStateBySize[size])}>No options found</div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selectedValues.includes(option.value)
                  const isOptionDisabled = option.disabled || (isMaxReached && !isSelected)

                  return (
                    <Flex
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isOptionDisabled || undefined}
                      tabIndex={isOptionDisabled ? -1 : 0}
                      align="center"
                      onClick={() => !isOptionDisabled && toggleOption(option.value)}
                      onKeyDown={event => {
                        if (event.target !== event.currentTarget) return
                        if (isActivationKey(event.key) && !isOptionDisabled) {
                          event.preventDefault()
                          toggleOption(option.value)
                        }
                      }}
                      className={cn('relative', pickerOptionItemBase, pickerOptionItemBySize[size])}
                    >
                      <Flex align="center" gap="2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          tabIndex={-1}
                          aria-hidden="true"
                          className={cn(
                            'pointer-events-none shrink-0 rounded border border-current accent-current',
                            pickerIndicatorBySize[size],
                          )}
                        />
                        {option.icon}
                        {renderOptionLabel(option)}
                      </Flex>
                    </Flex>
                  )
                })
              )}
            </div>
          </div>
        ) : null}
      </div>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'
