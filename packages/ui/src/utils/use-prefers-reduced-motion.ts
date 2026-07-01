'use client'

import * as React from 'react'

const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

let reducedMotionMediaQuery: MediaQueryList | null = null
let reducedMotionMatchMedia: typeof window.matchMedia | null = null

function canReadReducedMotionPreference() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

function getReducedMotionMediaQuery() {
  if (!canReadReducedMotionPreference()) return null

  if (reducedMotionMatchMedia !== window.matchMedia) {
    reducedMotionMediaQuery = null
    reducedMotionMatchMedia = window.matchMedia
  }

  reducedMotionMediaQuery ??= window.matchMedia(PREFERS_REDUCED_MOTION_QUERY)
  return reducedMotionMediaQuery
}

function subscribeToReducedMotionPreference(callback: () => void) {
  const mediaQuery = getReducedMotionMediaQuery()
  if (!mediaQuery) return () => {}

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
  return getReducedMotionMediaQuery()?.matches ?? false
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
