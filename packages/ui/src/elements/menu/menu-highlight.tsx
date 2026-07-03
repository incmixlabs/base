'use client'

import * as React from 'react'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'
import type { Color } from '../../theme/tokens'
import type { MenuVariant } from './menu.props'
import { menuHighlightColorByVariant } from './menu.shared.class'

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

export interface MenuHighlightProps {
  children: React.ReactNode
  variant: MenuVariant
  color: Color
  className?: string
  style?: React.CSSProperties
}

export function MenuHighlight({ children, variant, color, className, style }: MenuHighlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [rect, setRect] = React.useState<HighlightRect | null>(null)
  const [visible, setVisible] = React.useState(false)
  const [highlightClassName, setHighlightClassName] = React.useState(menuHighlightColorByVariant[variant][color])
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    setHighlightClassName(menuHighlightColorByVariant[variant][color])
  }, [color, variant])

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
          const itemColor = highlighted.getAttribute('data-menu-color') as Color | null
          setHighlightClassName(
            menuHighlightColorByVariant[variant][itemColor ?? color] ?? menuHighlightColorByVariant[variant][color],
          )
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
  }, [color, computeRect, variant])

  return (
    <div ref={containerRef} className={className} style={{ ...style, position: 'relative' }}>
      {rect && (
        <div
          aria-hidden
          className={highlightClassName}
          style={{
            position: 'absolute',
            opacity: visible ? 1 : 0,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 0,
            transition: prefersReducedMotion
              ? 'none'
              : 'top 180ms cubic-bezier(0.16, 1, 0.3, 1), left 180ms cubic-bezier(0.16, 1, 0.3, 1), width 180ms cubic-bezier(0.16, 1, 0.3, 1), height 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 120ms ease-in-out',
          }}
        />
      )}
      {children}
    </div>
  )
}
