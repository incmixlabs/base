'use client'

import * as React from 'react'

export type UseSessionStorageOptions<T> = {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function readSessionStorageValue<T>(key: string, defaultValue: T, deserialize: (value: string) => T) {
  if (!canUseSessionStorage()) return defaultValue

  let rawValue: string | null = null
  try {
    rawValue = window.sessionStorage.getItem(key)
  } catch {
    return defaultValue
  }
  if (rawValue == null) return defaultValue

  try {
    return deserialize(rawValue)
  } catch {
    return defaultValue
  }
}

export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  options: UseSessionStorageOptions<T> = {},
): readonly [T, (value: T | ((previous: T) => T)) => void, () => void] {
  const serializeRef = React.useRef(options.serialize ?? (JSON.stringify as (value: T) => string))
  const deserializeRef = React.useRef(options.deserialize ?? (JSON.parse as (value: string) => T))

  React.useEffect(() => {
    serializeRef.current = options.serialize ?? (JSON.stringify as (value: T) => string)
    deserializeRef.current = options.deserialize ?? (JSON.parse as (value: string) => T)
  })

  const [value, setValue] = React.useState<T>(() => readSessionStorageValue(key, defaultValue, deserializeRef.current))

  React.useEffect(() => {
    setValue(readSessionStorageValue(key, defaultValue, deserializeRef.current))
  }, [defaultValue, key])

  React.useEffect(() => {
    if (!canUseSessionStorage()) return

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.sessionStorage) return
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

        if (canUseSessionStorage()) {
          try {
            window.sessionStorage.setItem(key, serializeRef.current(resolvedValue))
          } catch {
            // Keep in-memory state when browser storage is blocked or full.
          }
        }

        return resolvedValue
      })
    },
    [key],
  )

  const removeValue = React.useCallback(() => {
    if (canUseSessionStorage()) {
      try {
        window.sessionStorage.removeItem(key)
      } catch {
        // Reset hook state even when browser storage removal fails.
      }
    }

    setValue(defaultValue)
  }, [defaultValue, key])

  return [value, updateValue, removeValue] as const
}
