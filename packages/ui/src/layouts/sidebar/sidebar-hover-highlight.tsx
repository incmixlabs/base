'use client'

import * as m from 'motion/react-m'
import * as React from 'react'

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface SidebarHoverHighlightContextValue {
  onItemEnter: (element: HTMLElement) => void
  onItemLeave: () => void
  onItemFocus: (element: HTMLElement) => void
  onItemBlur: () => void
}

const SidebarHoverHighlightContext = React.createContext<SidebarHoverHighlightContextValue | null>(null)

export function useSidebarHoverHighlight() {
  return React.useContext(SidebarHoverHighlightContext)
}

export interface SidebarHoverHighlightProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SidebarHoverHighlight({ children, className, style }: SidebarHoverHighlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [rect, setRect] = React.useState<HighlightRect | null>(null)
  const [visible, setVisible] = React.useState(false)
  const hoveredRef = React.useRef<HTMLElement | null>(null)
  const focusedRef = React.useRef<HTMLElement | null>(null)
  const leaveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLeaveTimeout = React.useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

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

  const showFor = React.useCallback(
    (element: HTMLElement) => {
      clearLeaveTimeout()
      const r = computeRect(element)
      if (r) {
        setRect(r)
        setVisible(true)
      }
    },
    [clearLeaveTimeout, computeRect],
  )

  const resolveActive = React.useCallback(() => {
    const target = hoveredRef.current ?? focusedRef.current
    if (target) {
      showFor(target)
    } else {
      clearLeaveTimeout()
      leaveTimeoutRef.current = setTimeout(() => {
        setVisible(false)
      }, 80)
    }
  }, [showFor, clearLeaveTimeout])

  const onItemEnter = React.useCallback(
    (element: HTMLElement) => {
      hoveredRef.current = element
      showFor(element)
    },
    [showFor],
  )

  const onItemLeave = React.useCallback(() => {
    hoveredRef.current = null
    resolveActive()
  }, [resolveActive])

  const onItemFocus = React.useCallback(
    (element: HTMLElement) => {
      focusedRef.current = element
      showFor(element)
    },
    [showFor],
  )

  const onItemBlur = React.useCallback(() => {
    focusedRef.current = null
    resolveActive()
  }, [resolveActive])

  const contextValue = React.useMemo<SidebarHoverHighlightContextValue>(
    () => ({ onItemEnter, onItemLeave, onItemFocus, onItemBlur }),
    [onItemEnter, onItemLeave, onItemFocus, onItemBlur],
  )

  const activeRef = React.useRef<HTMLElement | null>(null)
  activeRef.current = hoveredRef.current ?? focusedRef.current

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (typeof ResizeObserver === 'undefined') return

    const recalc = () => {
      if (activeRef.current && visible) {
        const r = computeRect(activeRef.current)
        if (r) setRect(r)
      }
    }

    const observer = new ResizeObserver(recalc)
    observer.observe(container)

    return () => observer.disconnect()
  }, [visible, computeRect])

  React.useEffect(() => {
    return () => clearLeaveTimeout()
  }, [clearLeaveTimeout])

  return (
    <SidebarHoverHighlightContext.Provider value={contextValue}>
      <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
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
              opacity: { duration: 0.15 },
            }}
            style={{
              position: 'absolute',
              borderRadius: 'var(--radius-md, 0.375rem)',
              backgroundColor: 'var(--sidebar-hover)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
        {children}
      </div>
    </SidebarHoverHighlightContext.Provider>
  )
}
