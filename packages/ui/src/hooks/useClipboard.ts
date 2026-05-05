'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseClipboardOptions {
  /** Timeout in milliseconds before resetting copied state */
  timeout?: number
}

export interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<void>
  /** Whether the text was recently copied */
  copied: boolean
  /** Error if copy failed */
  error: Error | null
  /** Reset the copied and error state */
  reset: () => void
}

/**
 * Hook for copying text to clipboard with status tracking
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useClipboard();
 *
 * return (
 *   <button onClick={() => copy("Hello!")}>
 *     {copied ? "Copied!" : "Copy"}
 *   </button>
 * );
 * ```
 */
/** useClipboard export. */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setError(null)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => setCopied(false), timeout)
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to copy to clipboard')
        setError(err)
        setCopied(false)
        console.error('Clipboard copy failed:', err.message)
      }
    },
    [timeout],
  )

  const reset = useCallback(() => {
    setCopied(false)
    setError(null)
  }, [])

  return { copy, copied, error, reset }
}
