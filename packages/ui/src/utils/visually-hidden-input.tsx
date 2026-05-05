'use client'

import * as React from 'react'

type InputValue = string[] | string

interface VisuallyHiddenInputProps<T = InputValue>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'checked' | 'onReset'> {
  value?: T
  checked?: boolean
  control: HTMLElement | null
  bubbles?: boolean
}

function VisuallyHiddenInput<T = InputValue>(props: VisuallyHiddenInputProps<T>) {
  const { control, value, checked, bubbles = true, type = 'hidden', style, ...inputProps } = props

  const normalizedType = type === 'switch' ? 'checkbox' : type
  const isCheckInput = normalizedType === 'checkbox' || normalizedType === 'radio'
  const inputRef = React.useRef<HTMLInputElement>(null)
  const initialComparableValue: string | boolean | undefined = isCheckInput
    ? checked
    : typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : (value as string | undefined)

  const prevValueRef = React.useRef<string | boolean | undefined>(initialComparableValue)

  const [controlSize, setControlSize] = React.useState<{
    width?: number
    height?: number
  }>({})

  React.useLayoutEffect(() => {
    if (!control) {
      setControlSize({})
      return
    }

    setControlSize({
      width: control.offsetWidth,
      height: control.offsetHeight,
    })

    if (typeof window === 'undefined') return

    const resizeObserver = new ResizeObserver((entries, _observer) => {
      if (!Array.isArray(entries) || !entries.length) return

      const entry = entries[0]
      if (!entry) return

      let width: number
      let height: number

      if ('borderBoxSize' in entry) {
        const borderSizeEntry = entry.borderBoxSize
        const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry
        width = borderSize.inlineSize
        height = borderSize.blockSize
      } else {
        width = control.offsetWidth
        height = control.offsetHeight
      }

      setControlSize({ width, height })
    })

    resizeObserver.observe(control, { box: 'border-box' })
    return () => {
      resizeObserver.disconnect()
    }
  }, [control])

  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const inputProto = window.HTMLInputElement.prototype
    const propertyKey = isCheckInput ? 'checked' : 'value'
    const eventType = isCheckInput ? 'click' : 'input'

    const serializedCurrentValue: string | boolean | undefined = isCheckInput
      ? checked
      : typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : (value as string | undefined)

    const descriptor = Object.getOwnPropertyDescriptor(inputProto, propertyKey)

    const setter = descriptor?.set

    if (prevValueRef.current !== serializedCurrentValue && setter) {
      const event = new Event(eventType, { bubbles })
      setter.call(input, serializedCurrentValue)
      input.dispatchEvent(event)
    }

    prevValueRef.current = serializedCurrentValue
  }, [value, checked, bubbles, isCheckInput])

  const composedStyle: React.CSSProperties = {
    ...style,
    border: 0,
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
    ...(controlSize.width !== undefined ? { width: controlSize.width } : {}),
    ...(controlSize.height !== undefined ? { height: controlSize.height } : {}),
  }

  return (
    <input
      type={normalizedType}
      {...inputProps}
      ref={inputRef}
      aria-hidden={isCheckInput}
      tabIndex={-1}
      defaultChecked={isCheckInput ? checked : undefined}
      style={composedStyle}
    />
  )
}

export { VisuallyHiddenInput }
