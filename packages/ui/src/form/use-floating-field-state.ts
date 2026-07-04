'use client'

import * as React from 'react'

type FloatingFieldElement = HTMLInputElement | HTMLTextAreaElement
type FloatingFieldValue = string | number | readonly string[] | null | undefined

interface FloatingFieldStateOptions<TElement extends FloatingFieldElement> {
  value?: FloatingFieldValue
  defaultValue?: FloatingFieldValue
  onBlur?: React.FocusEventHandler<TElement>
  onChange?: React.ChangeEventHandler<TElement>
  onFocus?: React.FocusEventHandler<TElement>
}

export function hasFieldValue(value: FloatingFieldValue): boolean {
  if (Array.isArray(value)) return value.length > 0
  return value != null && String(value).length > 0
}

export function useFloatingFieldState<TElement extends FloatingFieldElement>({
  value,
  defaultValue,
  onBlur,
  onChange,
  onFocus,
}: FloatingFieldStateOptions<TElement>) {
  const [floatingFocused, setFloatingFocused] = React.useState(false)
  const [floatingHasValue, setFloatingHasValue] = React.useState(() => hasFieldValue(value ?? defaultValue))

  React.useEffect(() => {
    if (value !== undefined) {
      setFloatingHasValue(hasFieldValue(value))
    }
  }, [value])

  const handleBlur = React.useCallback<React.FocusEventHandler<TElement>>(
    event => {
      setFloatingFocused(false)
      onBlur?.(event)
    },
    [onBlur],
  )

  const handleChange = React.useCallback<React.ChangeEventHandler<TElement>>(
    event => {
      setFloatingHasValue(hasFieldValue(event.currentTarget.value))
      onChange?.(event)
    },
    [onChange],
  )

  const handleFocus = React.useCallback<React.FocusEventHandler<TElement>>(
    event => {
      setFloatingFocused(true)
      onFocus?.(event)
    },
    [onFocus],
  )

  return {
    floatingFocused,
    floatingHasValue,
    handleBlur,
    handleChange,
    handleFocus,
  }
}
