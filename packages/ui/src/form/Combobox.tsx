'use client'

import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { TextField } from './TextField'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
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
  disabled?: boolean
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
      error = false,
      disabled = false,
      readOnly = false,
      className,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const effectiveReadOnly = fieldGroup.readOnly || readOnly
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const listboxId = `${inputId}-listbox`
    const selectedOption = options.find(option => option.value === value)
    const selectedLabel = selectedOption?.label ?? value ?? ''
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState(selectedLabel)
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const closeTimerRef = React.useRef<number | undefined>(undefined)

    React.useEffect(() => {
      if (!open) setQuery(selectedLabel)
    }, [open, selectedLabel])

    React.useEffect(() => {
      return () => window.clearTimeout(closeTimerRef.current)
    }, [])

    const normalizedQuery = query.trim().toLowerCase()
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
        disabled: option.disabled,
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

    React.useEffect(() => {
      if (!open) {
        setActiveIndex(-1)
        return
      }

      setActiveIndex(current => {
        if (current >= 0 && current < visibleItems.length && !visibleItems[current]?.disabled) return current
        return getNextEnabledItemIndex(visibleItems, -1, 1)
      })
    }, [open, visibleItems])

    const selectValue = React.useCallback(
      (nextValue: string) => {
        const nextOption = options.find(option => option.value === nextValue)
        setQuery(nextOption?.label ?? nextValue)
        setOpen(false)
        setActiveIndex(-1)
        onValueChange?.(nextValue)
      },
      [onValueChange, options],
    )

    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        <TextField
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
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          error={error}
          disabled={disabled}
          readOnly={effectiveReadOnly}
          rightElement={<ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />}
          onFocus={() => {
            if (!disabled && !effectiveReadOnly) setOpen(true)
          }}
          onClick={() => {
            if (!disabled && !effectiveReadOnly) setOpen(true)
          }}
          onBlur={() => {
            closeTimerRef.current = window.setTimeout(() => {
              setOpen(false)
              setActiveIndex(-1)
              setQuery(selectedLabel)
            }, 0)
          }}
          onChange={event => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              if (disabled || effectiveReadOnly) return
              setOpen(true)
              setActiveIndex(current => getNextEnabledItemIndex(visibleItems, current, 1))
              return
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault()
              if (disabled || effectiveReadOnly) return
              setOpen(true)
              setActiveIndex(current => getNextEnabledItemIndex(visibleItems, current, -1))
              return
            }

            if (event.key === 'Escape') {
              event.preventDefault()
              setOpen(false)
              setActiveIndex(-1)
              setQuery(selectedLabel)
              return
            }

            if (event.key === 'Enter') {
              event.preventDefault()
              const item = activeItem && !activeItem.disabled ? activeItem : visibleItems.find(next => !next.disabled)
              if (!disabled && !effectiveReadOnly && item) selectValue(item.value)
            }
          }}
        />

        {open && !disabled && !effectiveReadOnly ? (
          <div
            id={listboxId}
            role="listbox"
            className={cn(
              'absolute left-0 top-full z-50 mt-1 max-h-64 w-full min-w-[12rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            )}
          >
            {visibleItems.map((item, index) => (
              <button
                key={`${item.kind}-${item.value}`}
                id={item.id}
                type="button"
                role="option"
                aria-selected={item.kind === 'option' ? item.value === value : false}
                disabled={item.disabled}
                className={cn(
                  'flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  item.kind === 'create' && 'text-primary',
                  index === activeIndex && 'bg-accent text-accent-foreground',
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
                {item.label}
              </button>
            ))}

            {filteredOptions.length === 0 && !canCreate ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{noResultsText}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)

Combobox.displayName = 'Combobox'
