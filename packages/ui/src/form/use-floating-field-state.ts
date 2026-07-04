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
  const isControlled = value !== undefined
  const [floatingFocused, setFloatingFocused] = React.useState(false)
  const [uncontrolledHasValue, setUncontrolledHasValue] = React.useState(() => hasFieldValue(defaultValue))
  const floatingHasValue = isControlled ? hasFieldValue(value) : uncontrolledHasValue

  const handleBlur = React.useCallback<React.FocusEventHandler<TElement>>(
    event => {
      setFloatingFocused(false)
      onBlur?.(event)
    },
    [onBlur],
  )

  const handleChange = React.useCallback<React.ChangeEventHandler<TElement>>(
    event => {
      if (!isControlled) {
        setUncontrolledHasValue(hasFieldValue(event.currentTarget.value))
      }
      onChange?.(event)
    },
    [isControlled, onChange],
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
