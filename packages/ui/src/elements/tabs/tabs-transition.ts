import * as React from 'react'

function parseTransitionTime(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 0
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed)
  if (trimmed.endsWith('s')) return Number.parseFloat(trimmed) * 1000
  return Number.parseFloat(trimmed) || 0
}

export function getMaxTransitionTime(element: HTMLElement) {
  const styles = window.getComputedStyle(element)
  const durations = styles.transitionDuration.split(',').map(parseTransitionTime)
  const delays = styles.transitionDelay.split(',').map(parseTransitionTime)

  const transitionCount = Math.max(durations.length, delays.length)
  let maxTransitionTime = 0

  for (let index = 0; index < transitionCount; index++) {
    const duration = durations[index % durations.length] ?? 0
    const delay = delays[index % delays.length] ?? 0
    maxTransitionTime = Math.max(maxTransitionTime, duration + delay)
  }

  return maxTransitionTime
}

export function useExitTransitionFallback(
  elementRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  onComplete: () => void,
) {
  React.useEffect(() => {
    if (!enabled) return undefined

    const element = elementRef.current
    if (!element) return undefined

    let timeoutId: number | undefined
    const frameId = window.requestAnimationFrame(() => {
      const transitionTime = getMaxTransitionTime(element)
      if (transitionTime <= 0) {
        onComplete()
        return
      }

      timeoutId = window.setTimeout(onComplete, transitionTime + 50)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [elementRef, enabled, onComplete])
}
