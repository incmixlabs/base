import * as React from 'react'
import { cn } from '@/lib/utils'
import { breakpointMedia } from '@/theme/helpers/responsive/breakpoints'
import type { DeviceOverlayProps } from './device-overlay.props'
import { EditorGrid } from './EditorGrid'
import type { EditorSizeToken } from './editor.shared.props'
import './device-overlay.css'

export type { DeviceOverlayProps, DeviceOverlayType } from './device-overlay.props'

function toCssUnit(value: EditorSizeToken): string {
  return typeof value === 'number' ? `${value}px` : value
}

export const DeviceOverlay = React.forwardRef<HTMLDivElement, DeviceOverlayProps>(
  (
    {
      className,
      style,
      children,
      device = 'desktop',
      frameColor,
      bezelColor,
      overlayTint,
      maxWidth,
      contentClassName,
      showGridInside = false,
      gridProps,
      ...props
    },
    ref,
  ) => {
    const isPhone = device === 'phone-small' || device === 'phone' || device === 'phone-large'
    const isDesktop = device === 'desktop' || device === 'desktop-wide' || device === 'tv'

    const [compact, setCompact] = React.useState(false)

    React.useEffect(() => {
      const mediaQuery = window.matchMedia(breakpointMedia.down('sm'))
      const syncCompact = () => setCompact(mediaQuery.matches)
      syncCompact()
      mediaQuery.addEventListener('change', syncCompact)
      return () => mediaQuery.removeEventListener('change', syncCompact)
    }, [])

    const overlayStyle: React.CSSProperties = {
      ...style,
      ...(frameColor ? { '--device-frame-color': frameColor } : {}),
      ...(bezelColor ? { '--device-bezel-color': bezelColor } : {}),
      ...(overlayTint ? { '--device-overlay-tint': overlayTint } : {}),
      ...(maxWidth !== undefined ? { '--device-max-width': toCssUnit(maxWidth) } : {}),
    } as React.CSSProperties

    const content = showGridInside ? (
      <EditorGrid {...gridProps} className="editor-DeviceOverlay__grid">
        {children}
      </EditorGrid>
    ) : (
      children
    )

    return (
      <div
        ref={ref}
        data-device={device}
        data-compact={compact}
        className={cn('editor-DeviceOverlay', className)}
        style={overlayStyle}
        {...props}
      >
        <div className="editor-DeviceOverlay__shell">
          <div className={cn('editor-DeviceOverlay__content', contentClassName)}>{content}</div>
          <div aria-hidden className="editor-DeviceOverlay__overlay" />
          {isPhone && <div aria-hidden className="editor-DeviceOverlay__notch" />}
        </div>
        {isDesktop && <div aria-hidden className="editor-DeviceOverlay__stand" />}
        {device === 'laptop' && <div aria-hidden className="editor-DeviceOverlay__base" />}
      </div>
    )
  },
)

DeviceOverlay.displayName = 'DeviceOverlay'
