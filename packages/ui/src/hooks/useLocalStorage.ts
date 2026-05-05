'use client'

import * as React from 'react'

export type UseLocalStorageOptions<T> = {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  initializeWithStorage?: boolean
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readLocalStorageValue<T>(key: string, defaultValue: T, deserialize: (value: string) => T) {
  if (!canUseLocalStorage()) return defaultValue

  const rawValue = window.localStorage.getItem(key)
  if (rawValue == null) return defaultValue

  try {
    return deserialize(rawValue)
  } catch {
    return defaultValue
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {},
): readonly [T, (value: T | ((previous: T) => T)) => void, () => void] {
  const serializeRef = React.useRef(options.serialize ?? (JSON.stringify as (value: T) => string))
  const deserializeRef = React.useRef(options.deserialize ?? (JSON.parse as (value: string) => T))
  const initializeWithStorage = options.initializeWithStorage ?? true

  React.useEffect(() => {
    serializeRef.current = options.serialize ?? (JSON.stringify as (value: T) => string)
    deserializeRef.current = options.deserialize ?? (JSON.parse as (value: string) => T)
  })

  const [value, setValue] = React.useState<T>(() =>
    initializeWithStorage ? readLocalStorageValue(key, defaultValue, deserializeRef.current) : defaultValue,
  )

  React.useEffect(() => {
    setValue(readLocalStorageValue(key, defaultValue, deserializeRef.current))
  }, [defaultValue, key])

  React.useEffect(() => {
    if (!canUseLocalStorage()) return

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return
      if (event.key !== key) return

      if (event.newValue == null) {
        setValue(defaultValue)
        return
      }

      try {
        setValue(deserializeRef.current(event.newValue))
      } catch {
        setValue(defaultValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [defaultValue, key])

  const updateValue = React.useCallback(
    (nextValue: T | ((previous: T) => T)) => {
      setValue(previous => {
        const resolvedValue = typeof nextValue === 'function' ? (nextValue as (previous: T) => T)(previous) : nextValue

        if (canUseLocalStorage()) {
          window.localStorage.setItem(key, serializeRef.current(resolvedValue))
        }

        return resolvedValue
      })
    },
    [key],
  )

  const removeValue = React.useCallback(() => {
    if (canUseLocalStorage()) {
      window.localStorage.removeItem(key)
    }

    setValue(defaultValue)
  }, [defaultValue, key])

  return [value, updateValue, removeValue] as const
}
