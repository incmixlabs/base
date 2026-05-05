'use client'

import * as m from 'motion/react-m'
import * as React from 'react'

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

export interface MenuHighlightProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MenuHighlight({ children, className, style }: MenuHighlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [rect, setRect] = React.useState<HighlightRect | null>(null)
  const [visible, setVisible] = React.useState(false)
  const [highlightBg, setHighlightBg] = React.useState<string | null>(null)

  const computeRect = React.useCallback((element: HTMLElement): HighlightRect | null => {
    const container = containerRef.current
    if (!container) return null
    const containerRect = container.getBoundingClientRect()
    const itemRect = element.getBoundingClientRect()
    return {
      top: itemRect.top - containerRect.top,
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
      height: itemRect.height,
    }
  }, [])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (typeof MutationObserver === 'undefined') return

    const sync = () => {
      const highlighted = container.querySelector('[data-highlighted]') as HTMLElement | null
      if (highlighted) {
        const r = computeRect(highlighted)
        if (r) {
          setRect(r)
          setVisible(true)
          const bg = getComputedStyle(highlighted).getPropertyValue('--menu-highlight-bg').trim()
          if (bg) setHighlightBg(bg)
        }
      } else {
        setVisible(false)
      }
    }

    sync()

    const observer = new MutationObserver(sync)
    observer.observe(container, {
      attributes: true,
      attributeFilter: ['data-highlighted'],
      subtree: true,
    })

    const onLayoutChange = () => sync()
    window.addEventListener('resize', onLayoutChange)
    container.addEventListener('scroll', onLayoutChange, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onLayoutChange)
      container.removeEventListener('scroll', onLayoutChange, true)
    }
  }, [computeRect])

  return (
    <div ref={containerRef} className={className} style={{ ...style, position: 'relative' }}>
      {rect && (
        <m.div
          aria-hidden
          initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
            opacity: { duration: 0.12 },
          }}
          style={{
            position: 'absolute',
            borderRadius: 'inherit',
            backgroundColor: highlightBg || 'var(--menu-highlight-bg)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      {children}
    </div>
  )
}
