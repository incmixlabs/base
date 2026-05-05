'use client'

import * as React from 'react'

type BrowserCookieSameSite = 'strict' | 'lax' | 'none'

export interface BrowserCookieOptions {
  path?: string
  maxAge?: number
  sameSite?: BrowserCookieSameSite
  secure?: boolean
}

type CookieStoreLike = {
  set?: (options: {
    name: string
    value: string
    path?: string
    expires?: number
    sameSite?: BrowserCookieSameSite
    secure?: boolean
  }) => Promise<void>
  delete?: (options: { name: string; path?: string }) => Promise<void>
}

function getCookieStore(): CookieStoreLike | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as typeof window & { cookieStore?: CookieStoreLike }).cookieStore
}

function canUseDocumentCookie() {
  return typeof document !== 'undefined' && typeof document.cookie === 'string'
}

function toCookieString(name: string, value: string, options: BrowserCookieOptions = {}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]

  if (options.path) parts.push(`path=${options.path}`)
  if (options.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`)
  if (options.sameSite) parts.push(`SameSite=${options.sameSite === 'none' ? 'None' : capitalize(options.sameSite)}`)
  if (options.secure) parts.push('Secure')

  return parts.join('; ')
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function writeDocumentCookie(name: string, value: string, options: BrowserCookieOptions = {}) {
  if (!canUseDocumentCookie()) return

  // biome-ignore lint/suspicious/noDocumentCookie: this is the compatibility fallback when Cookie Store API is unavailable.
  document.cookie = toCookieString(name, value, options)
}

export function readCookie(name: string): string | null {
  if (!canUseDocumentCookie()) return null

  const encodedName = encodeURIComponent(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${encodedName}=([^;]*)`))
  return match ? decodeURIComponent(match[1] ?? '') : null
}

export function writeCookie(name: string, value: string, options: BrowserCookieOptions = {}) {
  const cookieStore = getCookieStore()
  if (cookieStore?.set) {
    try {
      void cookieStore
        .set({
          name,
          value,
          path: options.path,
          expires: options.maxAge === undefined ? undefined : Date.now() + options.maxAge * 1000,
          sameSite: options.sameSite,
          secure: options.secure,
        })
        .catch(() => writeDocumentCookie(name, value, options))
    } catch {
      writeDocumentCookie(name, value, options)
    }
    return
  }

  writeDocumentCookie(name, value, options)
}

export function deleteCookie(name: string, options: Pick<BrowserCookieOptions, 'path'> = {}) {
  const cookieStore = getCookieStore()
  if (cookieStore?.delete) {
    try {
      void cookieStore
        .delete({ name, path: options.path })
        .catch(() => writeDocumentCookie(name, '', { path: options.path, maxAge: 0 }))
    } catch {
      writeDocumentCookie(name, '', { path: options.path, maxAge: 0 })
    }
    return
  }

  writeDocumentCookie(name, '', { path: options.path, maxAge: 0 })
}

export function useCookie(
  name: string,
  defaultValue = '',
  options: BrowserCookieOptions = {},
): readonly [string, (value: string) => void, () => void] {
  const [value, setValue] = React.useState(() => readCookie(name) ?? defaultValue)

  React.useEffect(() => {
    setValue(readCookie(name) ?? defaultValue)
  }, [defaultValue, name])

  const updateValue = React.useCallback(
    (nextValue: string) => {
      writeCookie(name, nextValue, options)
      setValue(nextValue)
    },
    [name, options],
  )

  const removeValue = React.useCallback(() => {
    deleteCookie(name, options)
    setValue(defaultValue)
  }, [defaultValue, name, options])

  return [value, updateValue, removeValue] as const
}
