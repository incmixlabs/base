'use client'

import * as React from 'react'

type UseAnimatedIndicatorArgs<T extends HTMLElement> = {
  containerRef: React.RefObject<T | null>
  activeValue: string | null | undefined
  getValue?: (el: HTMLElement) => string | null
  itemSelector?: string
}

export function useAnimatedIndicator<T extends HTMLElement>({
  containerRef,
  activeValue,
  getValue,
  itemSelector = '[data-segmented-item]',
}: UseAnimatedIndicatorArgs<T>) {
  const [style, setStyle] = React.useState<React.CSSProperties>({ opacity: 0 })

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      setStyle({ opacity: 0 })
      return
    }

    const update = () => {
      const root = containerRef.current
      if (!root) return

      const items = Array.from(root.querySelectorAll<HTMLElement>(itemSelector))
      let activeItem: HTMLElement | undefined

      if (getValue && activeValue) {
        activeItem = items.find(item => getValue(item) === activeValue)
      }

      if (!activeItem) {
        activeItem =
          root.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]') ??
          root.querySelector<HTMLElement>('[data-segmented-item][aria-checked="true"]') ??
          undefined
      }

      if (!activeItem) {
        setStyle({ opacity: 0 })
        return
      }

      const rootRect = root.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const left = itemRect.left - rootRect.left + root.scrollLeft - root.clientLeft
      const top = itemRect.top - rootRect.top + root.scrollTop - root.clientTop

      setStyle({
        opacity: 1,
        left: `${left}px`,
        top: `${top}px`,
        width: `${itemRect.width}px`,
        height: `${itemRect.height}px`,
      })
    }

    const frame = window.requestAnimationFrame(update)

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(container)
    for (const item of container.querySelectorAll<HTMLElement>(itemSelector)) {
      resizeObserver.observe(item)
    }
    window.addEventListener('resize', update)
    container.addEventListener('scroll', update, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', update)
      container.removeEventListener('scroll', update)
    }
  }, [activeValue, containerRef, getValue, itemSelector])

  return style
}
