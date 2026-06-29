'use client'

import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { Badge, type BadgeProps } from '@/elements/badge/Badge'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import {
  pickerEmptyStateBase,
  pickerEmptyStateBySize,
  pickerIndicatorBySize,
  pickerOptionItemBase,
  pickerOptionItemBySize,
  pickerPopupBase,
  pickerPopupViewportBase,
  pickerPopupViewportBySize,
} from './picker-popup.class'
import { TextField } from './TextField'

export interface ComboboxOption {
  value: string
  label: string
  color?: Color
  disabled?: boolean
  variant?: BadgeProps['variant']
}

export interface ComboboxProps {
  id?: string
  ariaLabelledby?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  noResultsText?: string
  creatable?: boolean
  size?: Size
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
  optionBadgeRadius?: Radius
  error?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

type ComboboxListItem = {
  kind: 'option' | 'create'
  id: string
  value: string
  label: string
  color?: Color
  disabled?: boolean
  variant?: BadgeProps['variant']
}

type ComboboxPickerSize = keyof typeof pickerPopupViewportBySize

function resolveComboboxPickerSize(size: Size | undefined): ComboboxPickerSize {
  if (size && size in pickerPopupViewportBySize) return size as ComboboxPickerSize
  return 'md'
}

function getNextEnabledItemIndex(items: readonly ComboboxListItem[], currentIndex: number, direction: 1 | -1) {
  if (items.length === 0) return -1

  for (let step = 1; step <= items.length; step += 1) {
    const nextIndex = (currentIndex + direction * step + items.length) % items.length
    if (!items[nextIndex]?.disabled) return nextIndex
  }

  return -1
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id,
      ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      options,
      value,
      onValueChange,
      placeholder = 'Select...',
      noResultsText = 'No options found',
      creatable = false,
      size,
      variant,
      color,
      radius,
      optionBadgeRadius,
      error = false,
      disabled = false,
      readOnly = false,
      className,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly || fieldGroup.readOnly
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const listboxId = `${inputId}-listbox`
    const selectedOption = options.find(option => option.value === value)
    const selectedLabel = selectedOption?.label ?? value ?? ''
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState(selectedLabel)
    const [isFiltering, setIsFiltering] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const closeTimerRef = React.useRef<number | undefined>(undefined)
    const popupSize = resolveComboboxPickerSize(size ?? fieldGroup.size)

    React.useEffect(() => {
      if (!open) {
        setQuery(selectedLabel)
        setIsFiltering(false)
      }
    }, [open, selectedLabel])

    React.useEffect(() => {
      if (effectiveDisabled || effectiveReadOnly) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }, [effectiveDisabled, effectiveReadOnly])

    React.useEffect(() => {
      return () => window.clearTimeout(closeTimerRef.current)
    }, [])

    const normalizedQuery = (isFiltering ? query : '').trim().toLowerCase()
    const filteredOptions = React.useMemo(
      () =>
        normalizedQuery
          ? options.filter(
              option =>
                option.label.toLowerCase().includes(normalizedQuery) ||
                option.value.toLowerCase().includes(normalizedQuery),
            )
          : options,
      [normalizedQuery, options],
    )
    const canCreate =
      creatable &&
      isFiltering &&
      query.trim().length > 0 &&
      !options.some(
        option => option.value.toLowerCase() === normalizedQuery || option.label.toLowerCase() === normalizedQuery,
      )
    const visibleItems = React.useMemo<ComboboxListItem[]>(() => {
      const items: ComboboxListItem[] = filteredOptions.map((option, index) => ({
        kind: 'option',
        id: `${listboxId}-option-${index}`,
        value: option.value,
        label: option.label,
        color: option.color,
        disabled: option.disabled,
        variant: option.variant,
      }))

      if (canCreate) {
        const value = query.trim()
        items.push({
          kind: 'create',
          id: `${listboxId}-create`,
          value,
          label: `Create "${value}"`,
        })
      }

      return items
    }, [canCreate, filteredOptions, listboxId, query])
    const activeItem = activeIndex >= 0 ? visibleItems[activeIndex] : undefined
    const selectedVisibleIndex = visibleItems.findIndex(
      item => item.kind === 'option' && item.value === value && !item.disabled,
    )

    React.useEffect(() => {
      if (!open) {
        setActiveIndex(-1)
        return
      }

      setActiveIndex(current => {
        if (current >= 0 && current < visibleItems.length && !visibleItems[current]?.disabled) return current
        if (!isFiltering && selectedVisibleIndex >= 0) return selectedVisibleIndex
        return getNextEnabledItemIndex(visibleItems, -1, 1)
      })
    }, [isFiltering, open, selectedVisibleIndex, visibleItems])

    const selectValue = React.useCallback(
      (nextValue: string) => {
        const nextOption = options.find(option => option.value === nextValue)
        setQuery(nextOption?.label ?? nextValue)
        setIsFiltering(false)
        setOpen(false)
        setActiveIndex(-1)
        onValueChange?.(nextValue)
      },
      [onValueChange, options],
    )
    const openForBrowse = React.useCallback(() => {
      if (effectiveDisabled || effectiveReadOnly) return

      window.clearTimeout(closeTimerRef.current)
      setIsFiltering(false)
      setOpen(true)
      inputRef.current?.focus()
    }, [effectiveDisabled, effectiveReadOnly])

    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        <TextField
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={open ? activeItem?.id : undefined}
          aria-expanded={open}
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          error={error}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              aria-label="Show options"
              className="inline-flex h-full w-full appearance-none items-center justify-center border-0 bg-transparent p-0 leading-none text-neutral opacity-50 enabled:cursor-pointer"
              disabled={effectiveDisabled || effectiveReadOnly}
              onMouseDown={event => event.preventDefault()}
              onClick={openForBrowse}
            >
              <ChevronDown className={cn('block shrink-0', pickerIndicatorBySize[popupSize])} aria-hidden="true" />
            </button>
          }
          onFocus={() => {
            openForBrowse()
          }}
          onClick={() => {
            openForBrowse()
          }}
          onBlur={() => {
            closeTimerRef.current = window.setTimeout(() => {
              setOpen(false)
              setIsFiltering(false)
              setActiveIndex(-1)
              setQuery(selectedLabel)
            }, 0)
          }}
          onChange={event => {
            setQuery(event.target.value)
            setIsFiltering(true)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              if (effectiveDisabled || effectiveReadOnly) return
              setOpen(true)
              if (!open) {
                setIsFiltering(false)
              } else {
                setActiveIndex(current => getNextEnabledItemIndex(visibleItems, current, 1))
              }
              return
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              if (effectiveDisabled || effectiveReadOnly) return
              setOpen(true)
              if (!open) {
                setIsFiltering(false)
              } else {
                setActiveIndex(current => getNextEnabledItemIndex(visibleItems, current, -1))
              }
              return
            }

            if (event.key === 'Escape') {
              event.preventDefault()
              setOpen(false)
              setIsFiltering(false)
              setActiveIndex(-1)
              setQuery(selectedLabel)
              return
            }

            if (event.key === 'Enter') {
              event.preventDefault()
              const item = activeItem && !activeItem.disabled ? activeItem : visibleItems.find(next => !next.disabled)
              if (!effectiveDisabled && !effectiveReadOnly && item) selectValue(item.value)
            }
          }}
        />

        {open && !effectiveDisabled && !effectiveReadOnly ? (
          <div className={cn('absolute left-0 top-full z-50 mt-1 w-full min-w-[12rem]', pickerPopupBase)}>
            <div
              id={listboxId}
              role="listbox"
              className={cn(pickerPopupViewportBase, pickerPopupViewportBySize[popupSize])}
            >
              {visibleItems.map((item, index) => {
                const isSelected = item.kind === 'option' && item.value === value

                return (
                  <button
                    key={`${item.kind}-${item.value}`}
                    id={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={item.disabled}
                    className={cn(
                      'relative flex appearance-none items-center border-0 bg-transparent text-left font-[inherit] text-inherit',
                      pickerOptionItemBase,
                      pickerOptionItemBySize[popupSize],
                      item.kind === 'create' && 'text-primary',
                      isSelected && 'bg-accent-soft text-accent',
                      index === activeIndex && 'bg-accent-soft text-accent',
                      item.disabled && 'pointer-events-none opacity-50',
                    )}
                    onMouseDown={event => event.preventDefault()}
                    onMouseEnter={() => {
                      if (!item.disabled) setActiveIndex(index)
                    }}
                    onClick={() => {
                      if (!item.disabled) selectValue(item.value)
                    }}
                  >
                    {item.color ? (
                      <Badge size="xs" color={item.color} variant={item.variant ?? 'soft'} radius={optionBadgeRadius}>
                        {item.label}
                      </Badge>
                    ) : (
                      item.label
                    )}
                    {isSelected ? (
                      <Check
                        className={cn('ml-auto shrink-0 text-accent', pickerIndicatorBySize[popupSize])}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                )
              })}

              {filteredOptions.length === 0 && !canCreate ? (
                <div className={cn(pickerEmptyStateBase, pickerEmptyStateBySize[popupSize])}>{noResultsText}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    )
  },
)

Combobox.displayName = 'Combobox'
