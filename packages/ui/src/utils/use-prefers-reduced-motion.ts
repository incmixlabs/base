'use client'

import * as React from 'react'

const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function canReadReducedMotionPreference() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

function subscribeToReducedMotionPreference(callback: () => void) {
  if (!canReadReducedMotionPreference()) return () => {}

  const mediaQuery = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY)

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', callback)
    return () => {
      mediaQuery.removeEventListener('change', callback)
    }
  }

  mediaQuery.addListener(callback)
  return () => {
    mediaQuery.removeListener(callback)
  }
}

function getReducedMotionSnapshot() {
  return canReadReducedMotionPreference() ? window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches : false
}

function getReducedMotionServerSnapshot() {
  return false
}

export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotionPreference,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
}
