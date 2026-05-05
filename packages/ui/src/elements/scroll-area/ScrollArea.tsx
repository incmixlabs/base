'use client'

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { getPaddingProps } from '@/theme/helpers/get-padding-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import type { PaddingProps } from '@/theme/props/padding.props'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import {
  scrollAreaArrowToneVariants,
  scrollAreaBaseCls,
  scrollAreaByDirection,
  scrollAreaBySize,
  scrollAreaByThickness,
  scrollAreaByThumbStyle,
  scrollAreaByTrackShape,
  scrollAreaByType,
  scrollAreaContent,
  scrollAreaControlBase,
  scrollAreaControlIcon,
  scrollAreaRailBase,
  scrollAreaRailHidden,
  scrollAreaRailHorizontal,
  scrollAreaRailToneVariants,
  scrollAreaRailVertical,
  scrollAreaRoot,
  scrollAreaSurfaceColorVariants,
  scrollAreaSurfaceVariant,
  scrollAreaThumbBase,
  scrollAreaThumbColorVariants,
  scrollAreaThumbHorizontal,
  scrollAreaThumbVertical,
  scrollAreaTrackBase,
  scrollAreaTrackColorVariants,
  scrollAreaTrackerColorVariants,
  scrollAreaTrackHorizontal,
  scrollAreaTrackVertical,
  scrollAreaViewport,
} from './scroll-area.css'
import {
  type ScrollAreaArrowTone,
  type ScrollAreaRailTone,
  type ScrollAreaSurfaceVariant,
  type ScrollAreaThickness,
  type ScrollAreaThumbStyle,
  type ScrollAreaTrackerStyle,
  type ScrollAreaTrackShape,
  type ScrollAreaVariant,
  scrollAreaPropDefs,
} from './scroll-area.props'

type ScrollbarSize = (typeof scrollAreaPropDefs.size.values)[number]
type ScrollType = (typeof scrollAreaPropDefs.type.values)[number]
type ScrollDirection = Exclude<(typeof scrollAreaPropDefs.scroll.values)[number], 'auto'>
type ScrollMode = (typeof scrollAreaPropDefs.scroll.values)[number]

type AxisMetrics = {
  visible: boolean
  thumbSize: number
  thumbOffset: number
  maxOffset: number
}

const MIN_THUMB_SIZE = 18
const MAX_LINE_THUMB_SIZE: Record<ScrollAreaThickness, number> = {
  thin: 72,
  thick: 56,
}
const DOT_THUMB_SIZES: Record<Exclude<ScrollbarSize, 'none'>, number> = {
  xs: 12,
  sm: 14,
  md: 18,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getDotThumbSize(size: ScrollbarSize): number {
  if (size === 'none') return 0
  return DOT_THUMB_SIZES[size]
}

function getAxisMetrics(
  viewport: HTMLDivElement,
  trackSize: number,
  axis: 'x' | 'y',
  thumbStyle: ScrollAreaThumbStyle,
  size: ScrollbarSize,
  thickness: ScrollAreaThickness,
): AxisMetrics {
  const viewportSize = axis === 'y' ? viewport.clientHeight : viewport.clientWidth
  const contentSize = axis === 'y' ? viewport.scrollHeight : viewport.scrollWidth
  const scrollOffset = axis === 'y' ? viewport.scrollTop : viewport.scrollLeft

  if (contentSize <= viewportSize + 1 || viewportSize <= 0 || trackSize <= 0) {
    return { visible: false, thumbSize: 0, thumbOffset: 0, maxOffset: 0 }
  }

  const thumbSize =
    thumbStyle === 'dot'
      ? clamp(getDotThumbSize(size), 0, trackSize)
      : clamp(
          (viewportSize / contentSize) * trackSize,
          MIN_THUMB_SIZE,
          Math.min(trackSize, MAX_LINE_THUMB_SIZE[thickness]),
        )
  const maxScroll = contentSize - viewportSize
  const maxOffset = Math.max(trackSize - thumbSize, 0)
  const thumbOffset = maxScroll > 0 ? (scrollOffset / maxScroll) * maxOffset : 0

  return { visible: true, thumbSize, thumbOffset, maxOffset }
}

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps, PaddingProps {
  type?: ScrollType
  scroll?: ScrollMode
  scrollbars?: ScrollDirection
  size?: ScrollbarSize
  variant?: ScrollAreaVariant
  color?: Color
  surfaceColor?: Color
  surfaceVariant?: ScrollAreaSurfaceVariant
  trackColor?: Color
  rail?: ScrollAreaRailTone
  arrow?: ScrollAreaArrowTone
  tracker?: Color
  thickness?: ScrollAreaThickness
  trackerStyle?: ScrollAreaTrackerStyle
  trackShape?: ScrollAreaTrackShape
  thumbStyle?: ScrollAreaThumbStyle
  controls?: boolean
  radius?: Radius
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      type = scrollAreaPropDefs.type.default,
      scroll,
      scrollbars,
      size = 'sm',
      variant = scrollAreaPropDefs.variant.default,
      color = SemanticColor.neutral,
      surfaceColor,
      surfaceVariant = scrollAreaPropDefs.surfaceVariant.default,
      trackColor,
      rail = scrollAreaPropDefs.rail.default,
      arrow = scrollAreaPropDefs.arrow.default,
      tracker,
      thickness = scrollAreaPropDefs.thickness.default,
      trackerStyle = scrollAreaPropDefs.trackerStyle.default,
      trackShape = scrollAreaPropDefs.trackShape.default,
      thumbStyle = scrollAreaPropDefs.thumbStyle.default,
      controls = scrollAreaPropDefs.controls.default,
      radius: radiusProp,
      className,
      children,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      ...props
    },
    ref,
  ) => {
    const safeType = (normalizeEnumPropValue(scrollAreaPropDefs.type, type) ??
      scrollAreaPropDefs.type.default) as ScrollType
    // Prefer the newer `scroll` prop and fall back to the legacy `scrollbars` alias.
    const safeScrollMode = (normalizeEnumPropValue(scrollAreaPropDefs.scroll, scroll) ??
      normalizeEnumPropValue(scrollAreaPropDefs.scrollbars, scrollbars) ??
      scrollAreaPropDefs.scroll.default) as ScrollMode
    const safeScrollbars = (safeScrollMode === 'auto' ? 'both' : safeScrollMode) as ScrollDirection
    const safeSize = (normalizeEnumPropValue(scrollAreaPropDefs.size, size) ??
      scrollAreaPropDefs.size.default) as ScrollbarSize
    const safeVariant = (normalizeEnumPropValue(scrollAreaPropDefs.variant, variant) ??
      scrollAreaPropDefs.variant.default) as ScrollAreaVariant
    const safeColor = (normalizeEnumPropValue(scrollAreaPropDefs.color, color) ?? SemanticColor.neutral) as Color
    const safeSurfaceColor = (normalizeEnumPropValue(scrollAreaPropDefs.surfaceColor, surfaceColor) ??
      scrollAreaPropDefs.surfaceColor.default) as Color
    const safeSurfaceVariant = (normalizeEnumPropValue(scrollAreaPropDefs.surfaceVariant, surfaceVariant) ??
      scrollAreaPropDefs.surfaceVariant.default) as ScrollAreaSurfaceVariant
    const safeTrackColor = (normalizeEnumPropValue(scrollAreaPropDefs.trackColor, trackColor) ?? safeColor) as Color
    const safeRail = (normalizeEnumPropValue(scrollAreaPropDefs.rail, rail) ??
      scrollAreaPropDefs.rail.default) as ScrollAreaRailTone
    const safeArrow = (normalizeEnumPropValue(scrollAreaPropDefs.arrow, arrow) ??
      scrollAreaPropDefs.arrow.default) as ScrollAreaArrowTone
    const safeTracker = (normalizeEnumPropValue(scrollAreaPropDefs.tracker, tracker) ?? safeColor) as Color
    const safeThickness = (normalizeEnumPropValue(scrollAreaPropDefs.thickness, thickness) ??
      scrollAreaPropDefs.thickness.default) as ScrollAreaThickness
    const safeTrackerStyle = (normalizeEnumPropValue(scrollAreaPropDefs.trackerStyle, trackerStyle) ??
      scrollAreaPropDefs.trackerStyle.default) as ScrollAreaTrackerStyle
    const safeTrackShape = (normalizeEnumPropValue(scrollAreaPropDefs.trackShape, trackShape) ??
      scrollAreaPropDefs.trackShape.default) as ScrollAreaTrackShape
    const safeThumbStyle = ((safeTrackerStyle === 'dot'
      ? 'dot'
      : normalizeEnumPropValue(scrollAreaPropDefs.thumbStyle, thumbStyle)) ??
      (safeTrackerStyle === 'dot' ? 'dot' : scrollAreaPropDefs.thumbStyle.default)) as ScrollAreaThumbStyle
    const safeRadius = normalizeEnumPropValue(scrollAreaPropDefs.radius, radiusProp) as Radius | undefined
    const radius = useThemeRadius(safeRadius)
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const paddingProps = getPaddingProps({ p, px, py, pt, pr, pb, pl })

    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const verticalTrackRef = React.useRef<HTMLButtonElement | null>(null)
    const horizontalTrackRef = React.useRef<HTMLButtonElement | null>(null)
    const [verticalMetrics, setVerticalMetrics] = React.useState<AxisMetrics>({
      visible: false,
      thumbSize: 0,
      thumbOffset: 0,
      maxOffset: 0,
    })
    const [horizontalMetrics, setHorizontalMetrics] = React.useState<AxisMetrics>({
      visible: false,
      thumbSize: 0,
      thumbOffset: 0,
      maxOffset: 0,
    })
    const dragStateRef = React.useRef<{
      axis: 'x' | 'y'
      startPointer: number
      startScroll: number
      viewportSize: number
      contentSize: number
      trackSize: number
      thumbSize: number
    } | null>(null)
    const [draggingAxis, setDraggingAxis] = React.useState<'x' | 'y' | null>(null)

    const setRootRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const updateMetrics = React.useCallback(() => {
      const viewport = viewportRef.current
      const verticalTrack = verticalTrackRef.current
      const horizontalTrack = horizontalTrackRef.current
      if (!viewport) return
      setVerticalMetrics(
        getAxisMetrics(viewport, verticalTrack?.clientHeight ?? 0, 'y', safeThumbStyle, safeSize, safeThickness),
      )
      setHorizontalMetrics(
        getAxisMetrics(viewport, horizontalTrack?.clientWidth ?? 0, 'x', safeThumbStyle, safeSize, safeThickness),
      )
    }, [safeSize, safeThickness, safeThumbStyle])

    React.useEffect(() => {
      const viewport = viewportRef.current
      if (!viewport) return

      updateMetrics()

      const handleScroll = () => updateMetrics()
      viewport.addEventListener('scroll', handleScroll, { passive: true })

      if (typeof ResizeObserver === 'undefined') {
        return () => {
          viewport.removeEventListener('scroll', handleScroll)
        }
      }

      const observer = new ResizeObserver(() => updateMetrics())
      observer.observe(viewport)
      if (contentRef.current) observer.observe(contentRef.current)

      return () => {
        viewport.removeEventListener('scroll', handleScroll)
        observer.disconnect()
      }
    }, [updateMetrics])

    React.useEffect(() => {
      if (!draggingAxis) return

      const handlePointerMove = (event: PointerEvent) => {
        const viewport = viewportRef.current
        const dragState = dragStateRef.current
        if (!viewport || !dragState) return

        const currentPointer = dragState.axis === 'y' ? event.clientY : event.clientX
        const delta = currentPointer - dragState.startPointer
        const maxScroll = dragState.contentSize - dragState.viewportSize
        const maxThumbTravel = dragState.trackSize - dragState.thumbSize
        const nextScroll =
          maxThumbTravel > 0 ? dragState.startScroll + (delta / maxThumbTravel) * maxScroll : dragState.startScroll

        if (dragState.axis === 'y') viewport.scrollTop = nextScroll
        else viewport.scrollLeft = nextScroll
      }

      const endDrag = () => {
        dragStateRef.current = null
        setDraggingAxis(null)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', endDrag)
      window.addEventListener('pointercancel', endDrag)

      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', endDrag)
        window.removeEventListener('pointercancel', endDrag)
      }
    }, [draggingAxis])

    const scrollByAmount = React.useCallback((axis: 'x' | 'y', direction: -1 | 1) => {
      const viewport = viewportRef.current
      if (!viewport) return
      const viewportSize = axis === 'y' ? viewport.clientHeight : viewport.clientWidth
      const amount = Math.max(viewportSize * 0.72, 48) * direction
      if (axis === 'y') {
        viewport.scrollTop += amount
      } else {
        viewport.scrollLeft += amount
      }
    }, [])

    const handleViewportWheel = React.useCallback(
      (event: WheelEvent) => {
        const viewport = viewportRef.current
        if (!viewport) return

        let consumed = false

        if (safeScrollbars === 'vertical' || safeScrollbars === 'both') {
          const maxScrollTop = Math.max(viewport.scrollHeight - viewport.clientHeight, 0)
          const nextScrollTop = clamp(viewport.scrollTop + event.deltaY, 0, maxScrollTop)
          if (nextScrollTop !== viewport.scrollTop) {
            viewport.scrollTop = nextScrollTop
            consumed = true
          }
        }

        if (safeScrollbars === 'horizontal' || safeScrollbars === 'both') {
          const horizontalDelta = event.deltaX !== 0 ? event.deltaX : safeScrollbars === 'horizontal' ? event.deltaY : 0
          if (horizontalDelta !== 0) {
            const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0)
            const nextScrollLeft = clamp(viewport.scrollLeft + horizontalDelta, 0, maxScrollLeft)
            if (nextScrollLeft !== viewport.scrollLeft) {
              viewport.scrollLeft = nextScrollLeft
              consumed = true
            }
          }
        }

        if (consumed) {
          event.preventDefault()
        }
      },
      [safeScrollbars],
    )

    React.useEffect(() => {
      const viewport = viewportRef.current
      if (!viewport) return

      viewport.addEventListener('wheel', handleViewportWheel, { passive: false })

      return () => {
        viewport.removeEventListener('wheel', handleViewportWheel)
      }
    }, [handleViewportWheel])

    const startThumbDrag = React.useCallback(
      (axis: 'x' | 'y', event: React.PointerEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        const viewportSize = axis === 'y' ? viewport.clientHeight : viewport.clientWidth
        const contentSize = axis === 'y' ? viewport.scrollHeight : viewport.scrollWidth
        const pointer = axis === 'y' ? event.clientY : event.clientX
        const scroll = axis === 'y' ? viewport.scrollTop : viewport.scrollLeft
        const thumbSize = axis === 'y' ? verticalMetrics.thumbSize : horizontalMetrics.thumbSize
        const trackSize =
          axis === 'y'
            ? (verticalTrackRef.current?.clientHeight ?? viewport.clientHeight)
            : (horizontalTrackRef.current?.clientWidth ?? viewport.clientWidth)

        dragStateRef.current = {
          axis,
          startPointer: pointer,
          startScroll: scroll,
          viewportSize,
          contentSize,
          trackSize,
          thumbSize,
        }
        setDraggingAxis(axis)
        event.stopPropagation()
        event.preventDefault()
      },
      [horizontalMetrics.thumbSize, verticalMetrics.thumbSize],
    )

    const jumpToTrackPosition = React.useCallback(
      (axis: 'x' | 'y', event: React.MouseEvent<HTMLButtonElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        const rect = event.currentTarget.getBoundingClientRect()
        const pointer = axis === 'y' ? event.clientY - rect.top : event.clientX - rect.left
        const viewportSize = axis === 'y' ? viewport.clientHeight : viewport.clientWidth
        const contentSize = axis === 'y' ? viewport.scrollHeight : viewport.scrollWidth
        const metrics = axis === 'y' ? verticalMetrics : horizontalMetrics
        const maxScroll = contentSize - viewportSize
        const maxOffset = Math.max(metrics.maxOffset, 0)
        const thumbCenter = clamp(pointer - metrics.thumbSize / 2, 0, maxOffset)
        const nextScroll = maxOffset > 0 ? (thumbCenter / maxOffset) * maxScroll : 0

        if (axis === 'y') viewport.scrollTo({ top: nextScroll, behavior: 'smooth' })
        else viewport.scrollTo({ left: nextScroll, behavior: 'smooth' })
      },
      [horizontalMetrics, verticalMetrics],
    )

    const handleTrackKeyDown = React.useCallback(
      (axis: 'x' | 'y', event: React.KeyboardEvent<HTMLButtonElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        const scrollStep = (direction: -1 | 1) => {
          scrollByAmount(axis, direction)
          event.preventDefault()
        }

        if (axis === 'y') {
          if (event.key === 'ArrowUp') {
            scrollStep(-1)
            return
          }
          if (event.key === 'ArrowDown') {
            scrollStep(1)
            return
          }
          if (event.key === 'Home') {
            viewport.scrollTo({ top: 0, behavior: 'smooth' })
            event.preventDefault()
            return
          }
          if (event.key === 'End') {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
            event.preventDefault()
          }
          return
        }

        if (event.key === 'ArrowLeft') {
          scrollStep(-1)
          return
        }
        if (event.key === 'ArrowRight') {
          scrollStep(1)
          return
        }
        if (event.key === 'Home') {
          viewport.scrollTo({ left: 0, behavior: 'smooth' })
          event.preventDefault()
          return
        }
        if (event.key === 'End') {
          viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' })
          event.preventDefault()
        }
      },
      [scrollByAmount],
    )

    const combinedStyles = {
      ...marginProps.style,
      ...paddingProps.style,
      ...getRadiusStyles(radius),
      ...style,
    }

    const wantsVertical = safeScrollbars === 'vertical' || safeScrollbars === 'both'
    const wantsHorizontal = safeScrollbars === 'horizontal' || safeScrollbars === 'both'
    const showVerticalRail = safeSize !== 'none' && wantsVertical && verticalMetrics.visible
    const showHorizontalRail = safeSize !== 'none' && wantsHorizontal && horizontalMetrics.visible
    const isDotThumb = safeThumbStyle === 'dot'

    return (
      <div
        ref={setRootRefs}
        className={cn(
          scrollAreaBaseCls,
          scrollAreaRoot,
          scrollAreaByType[safeType],
          scrollAreaByDirection[safeScrollbars],
          scrollAreaBySize[safeSize],
          scrollAreaByThickness[safeThickness],
          scrollAreaByTrackShape[safeTrackShape],
          scrollAreaByThumbStyle[safeThumbStyle],
          scrollAreaTrackColorVariants[safeTrackColor][safeVariant],
          scrollAreaThumbColorVariants[safeColor][safeVariant],
          safeSurfaceColor
            ? scrollAreaSurfaceColorVariants[safeSurfaceColor][safeSurfaceVariant]
            : scrollAreaSurfaceVariant[safeSurfaceVariant],
          scrollAreaTrackerColorVariants[safeTracker],
          scrollAreaRailToneVariants[safeRail],
          scrollAreaArrowToneVariants[safeArrow],
          'rounded-[var(--element-border-radius)]',
          marginProps.className,
          paddingProps.className,
          className,
        )}
        data-controls={controls ? 'true' : 'false'}
        data-scrollarea-thumb-style={safeThumbStyle}
        data-vertical-rail={showVerticalRail ? 'true' : 'false'}
        data-horizontal-rail={showHorizontalRail ? 'true' : 'false'}
        style={combinedStyles}
        {...props}
      >
        <div ref={viewportRef} data-slot="scroll-area-viewport" className={scrollAreaViewport}>
          <div ref={contentRef} className={scrollAreaContent}>
            {children}
          </div>
        </div>

        <div className={cn(scrollAreaRailBase, scrollAreaRailVertical, !showVerticalRail && scrollAreaRailHidden)}>
          {controls && (
            <button
              type="button"
              aria-label="Scroll up"
              className={scrollAreaControlBase}
              disabled={!showVerticalRail}
              tabIndex={showVerticalRail ? undefined : -1}
              aria-hidden={!showVerticalRail}
              onClick={() => scrollByAmount('y', -1)}
            >
              <ChevronUp className={scrollAreaControlIcon} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            aria-label="Jump vertical scrollbar"
            ref={verticalTrackRef}
            className={cn(scrollAreaTrackBase, scrollAreaTrackVertical)}
            disabled={!showVerticalRail}
            tabIndex={showVerticalRail ? undefined : -1}
            aria-hidden={!showVerticalRail}
            onClick={event => jumpToTrackPosition('y', event)}
            onKeyDown={event => handleTrackKeyDown('y', event)}
          >
            <div
              role="presentation"
              data-dragging={draggingAxis === 'y' ? 'true' : 'false'}
              className={cn(scrollAreaThumbBase, scrollAreaThumbVertical)}
              style={{
                height: `${verticalMetrics.thumbSize}px`,
                width: isDotThumb ? `${verticalMetrics.thumbSize}px` : undefined,
                left: isDotThumb ? '50%' : undefined,
                marginLeft: isDotThumb ? `${verticalMetrics.thumbSize / -2}px` : undefined,
                transform: `translateY(${verticalMetrics.thumbOffset}px)`,
              }}
              onPointerDown={event => startThumbDrag('y', event)}
            />
          </button>
          {controls && (
            <button
              type="button"
              aria-label="Scroll down"
              className={scrollAreaControlBase}
              disabled={!showVerticalRail}
              tabIndex={showVerticalRail ? undefined : -1}
              aria-hidden={!showVerticalRail}
              onClick={() => scrollByAmount('y', 1)}
            >
              <ChevronDown className={scrollAreaControlIcon} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className={cn(scrollAreaRailBase, scrollAreaRailHorizontal, !showHorizontalRail && scrollAreaRailHidden)}>
          {controls && (
            <button
              type="button"
              aria-label="Scroll left"
              className={scrollAreaControlBase}
              disabled={!showHorizontalRail}
              tabIndex={showHorizontalRail ? undefined : -1}
              aria-hidden={!showHorizontalRail}
              onClick={() => scrollByAmount('x', -1)}
            >
              <ChevronLeft className={scrollAreaControlIcon} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            aria-label="Jump horizontal scrollbar"
            ref={horizontalTrackRef}
            className={cn(scrollAreaTrackBase, scrollAreaTrackHorizontal)}
            disabled={!showHorizontalRail}
            tabIndex={showHorizontalRail ? undefined : -1}
            aria-hidden={!showHorizontalRail}
            onClick={event => jumpToTrackPosition('x', event)}
            onKeyDown={event => handleTrackKeyDown('x', event)}
          >
            <div
              role="presentation"
              data-dragging={draggingAxis === 'x' ? 'true' : 'false'}
              className={cn(scrollAreaThumbBase, scrollAreaThumbHorizontal)}
              style={{
                width: `${horizontalMetrics.thumbSize}px`,
                height: isDotThumb ? `${horizontalMetrics.thumbSize}px` : undefined,
                top: isDotThumb ? '50%' : undefined,
                marginTop: isDotThumb ? `${horizontalMetrics.thumbSize / -2}px` : undefined,
                transform: `translateX(${horizontalMetrics.thumbOffset}px)`,
              }}
              onPointerDown={event => startThumbDrag('x', event)}
            />
          </button>
          {controls && (
            <button
              type="button"
              aria-label="Scroll right"
              className={scrollAreaControlBase}
              disabled={!showHorizontalRail}
              tabIndex={showHorizontalRail ? undefined : -1}
              aria-hidden={!showHorizontalRail}
              onClick={() => scrollByAmount('x', 1)}
            >
              <ChevronRight className={scrollAreaControlIcon} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    )
  },
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
