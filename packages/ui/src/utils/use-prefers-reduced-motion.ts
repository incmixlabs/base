'use client'

import * as React from 'react'

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncPreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncPreference)
      return () => {
        mediaQuery.removeEventListener('change', syncPreference)
      }
    }

    mediaQuery.addListener(syncPreference)

    return () => {
      mediaQuery.removeListener(syncPreference)
    }
  }, [])

  return prefersReducedMotion
}
