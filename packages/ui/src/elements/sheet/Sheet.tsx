'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Radius } from '@/theme/tokens'
import {
  sheetBackdropTransition,
  sheetBackdropVariants,
  sheetPanelTransition,
  sheetPanelVariants,
  sheetResizeHandle,
  sheetResizeHandleLeft,
  sheetResizeHandleRight,
} from './sheet.css'
import type { SheetSide } from './sheet.props'

const SheetOpenContext = React.createContext<boolean>(false)
const SHEET_RESIZE_MIN_WIDTH = 360
const SHEET_RESIZE_MAX_WIDTH = 960
const SHEET_RESIZE_KEYBOARD_STEP = 24
const SHEET_RESIZE_KEYBOARD_LARGE_STEP = 72

function parseCssLengthToPixels(value: React.CSSProperties['width']) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  const match = /^([0-9]+(?:\.[0-9]+)?)(px|rem)?$/.exec(value.trim())
  if (!match) return null
  const amount = Number.parseFloat(match[1] ?? '')
  if (!Number.isFinite(amount)) return null
  return match[2] === 'rem' ? amount * 16 : amount
}

function clampSheetWidth(width: number, minWidth: number, maxWidth: number) {
  const viewportMax =
    typeof window === 'undefined' ? maxWidth : Math.max(minWidth, Math.min(maxWidth, window.innerWidth - 16))
  return Math.min(Math.max(width, minWidth), viewportMax)
}

export interface SheetRootProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
}

const SheetRoot: React.FC<SheetRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const isOpen = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <SheetOpenContext.Provider value={isOpen}>
      <DialogPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
        {children}
      </DialogPrimitive.Root>
    </SheetOpenContext.Provider>
  )
}

SheetRoot.displayName = 'Sheet.Root'

export interface SheetTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  asChild?: boolean
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild, children, className, ...props }, ref) => {
    if (asChild || React.isValidElement(children)) {
      return <DialogPrimitive.Trigger ref={ref} render={children as React.ReactElement} {...(props as object)} />
    }
    return (
      <DialogPrimitive.Trigger ref={ref} className={cn('outline-none', className)} {...props}>
        {children}
      </DialogPrimitive.Trigger>
    )
  },
)

SheetTrigger.displayName = 'Sheet.Trigger'

export interface SheetCloseProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  asChild?: boolean
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return <DialogPrimitive.Close ref={ref} render={children} {...(props as object)} />
    }
    return (
      <DialogPrimitive.Close
        ref={ref}
        render={
          <IconButton variant="ghost" size="sm" radius="full" className={className as string} aria-label="Close" />
        }
      >
        {children ?? <X />}
      </DialogPrimitive.Close>
    )
  },
)

SheetClose.displayName = 'Sheet.Close'

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> {
  side?: SheetSide
  radius?: Radius
  resize?: boolean
  resizeMinWidth?: number
  resizeMaxWidth?: number
}

const borderSideStyle: Record<SheetSide, React.CSSProperties> = {
  right: { borderLeft: '1px solid var(--color-neutral-border)' },
  left: { borderRight: '1px solid var(--color-neutral-border)' },
  top: { borderBottom: '1px solid var(--color-neutral-border)' },
  bottom: { borderTop: '1px solid var(--color-neutral-border)' },
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  (
    {
      side = 'right',
      radius: radiusProp,
      resize = false,
      resizeMinWidth = SHEET_RESIZE_MIN_WIDTH,
      resizeMaxWidth = SHEET_RESIZE_MAX_WIDTH,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    'use no memo'
    const portalContainer = useThemePortalContainer()
    const isOpen = React.useContext(SheetOpenContext)
    const panelVariants = sheetPanelVariants[side]
    const radius = useThemeRadius(radiusProp)
    const popupRef = React.useRef<HTMLDivElement | null>(null)
    const cleanupResizeRef = React.useRef<(() => void) | null>(null)
    const hasUserResizedRef = React.useRef(false)
    const isHorizontal = side === 'left' || side === 'right'
    const parsedStyleWidth = React.useMemo(() => parseCssLengthToPixels(style?.width), [style?.width])
    const initialResizeWidth = React.useMemo(
      () => clampSheetWidth(parsedStyleWidth ?? resizeMinWidth, resizeMinWidth, resizeMaxWidth),
      [parsedStyleWidth, resizeMaxWidth, resizeMinWidth],
    )
    const [resizedWidth, setResizedWidth] = React.useState<number | null>(null)
    const [isResizing, setIsResizing] = React.useState(false)
    const currentResizeWidth = resizedWidth ?? initialResizeWidth

    const setPopupRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        popupRef.current = node
        if (typeof ref === 'function') {
          ref(node)
          return
        }
        if (ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref],
    )

    const applyWidth = React.useCallback(
      (nextWidth: number) => {
        const width = clampSheetWidth(nextWidth, resizeMinWidth, resizeMaxWidth)
        hasUserResizedRef.current = true
        popupRef.current?.style.setProperty('width', `${width}px`)
        setResizedWidth(width)
      },
      [resizeMaxWidth, resizeMinWidth],
    )

    const stopResize = React.useCallback(() => {
      cleanupResizeRef.current?.()
      cleanupResizeRef.current = null
    }, [])

    const beginResize = React.useCallback(
      (startX: number) => {
        if (!resize || !isHorizontal) return
        const element = popupRef.current
        if (!element) return

        stopResize()

        const startWidth = element.getBoundingClientRect().width
        const previousCursor = document.body.style.cursor
        const previousUserSelect = document.body.style.userSelect

        const updateWidth = (clientX: number) => {
          const movement = clientX - startX
          const delta = side === 'right' ? -movement : movement
          applyWidth(startWidth + delta)
        }

        const handleMouseMove = (event: MouseEvent) => {
          event.preventDefault()
          updateWidth(event.clientX)
        }

        const handleTouchMove = (event: TouchEvent) => {
          const touch = event.touches[0]
          if (!touch) return
          event.preventDefault()
          updateWidth(touch.clientX)
        }

        const cleanup = () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', cleanup)
          document.removeEventListener('touchmove', handleTouchMove)
          document.removeEventListener('touchend', cleanup)
          document.removeEventListener('touchcancel', cleanup)
          document.body.style.cursor = previousCursor
          document.body.style.userSelect = previousUserSelect
          setIsResizing(false)
        }

        cleanupResizeRef.current = cleanup
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
        setIsResizing(true)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', cleanup)
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', cleanup)
        document.addEventListener('touchcancel', cleanup)
      },
      [applyWidth, isHorizontal, resize, side, stopResize],
    )

    const handleResizeMouseDown = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        beginResize(event.clientX)
      },
      [beginResize],
    )

    const handleResizeTouchStart = React.useCallback(
      (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0]
        if (!touch) return
        event.preventDefault()
        event.stopPropagation()
        beginResize(touch.clientX)
      },
      [beginResize],
    )

    const handleResizeKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        event.stopPropagation()
        const measuredWidth = popupRef.current?.getBoundingClientRect().width
        const baseWidth = measuredWidth && measuredWidth > 0 ? measuredWidth : currentResizeWidth
        const movement =
          (event.key === 'ArrowRight' ? 1 : -1) *
          (event.shiftKey ? SHEET_RESIZE_KEYBOARD_LARGE_STEP : SHEET_RESIZE_KEYBOARD_STEP)
        const delta = side === 'right' ? -movement : movement
        applyWidth(baseWidth + delta)
      },
      [applyWidth, currentResizeWidth, side],
    )

    React.useEffect(() => {
      if (!resize || !isHorizontal) {
        hasUserResizedRef.current = false
        setResizedWidth(null)
        return
      }
      setResizedWidth(currentWidth =>
        currentWidth == null || !hasUserResizedRef.current
          ? clampSheetWidth(
              popupRef.current?.getBoundingClientRect().width ?? initialResizeWidth,
              resizeMinWidth,
              resizeMaxWidth,
            )
          : clampSheetWidth(currentWidth, resizeMinWidth, resizeMaxWidth),
      )
    }, [initialResizeWidth, isHorizontal, resize, resizeMaxWidth, resizeMinWidth])

    React.useEffect(() => stopResize, [stopResize])

    const resizeStyle =
      resize && isHorizontal
        ? {
            width: `${currentResizeWidth}px`,
            minWidth: resizeMinWidth,
            maxWidth: `min(${resizeMaxWidth}px, calc(100dvw - 1rem))`,
          }
        : null

    return (
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal keepMounted container={portalContainer}>
            <DialogPrimitive.Backdrop
              render={
                <m.div
                  key="sheet-backdrop"
                  variants={sheetBackdropVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={sheetBackdropTransition}
                />
              }
              style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
            />
            <DialogPrimitive.Popup
              ref={setPopupRef}
              data-side={side}
              render={
                <m.div
                  key="sheet-popup"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={sheetPanelTransition}
                />
              }
              style={{
                position: 'fixed',
                zIndex: 110,
                background: 'var(--color-neutral-surface)',
                boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0,0,0,0.25))',
                ...getRadiusStyles(radius),
                ...borderSideStyle[side],
                ...(side === 'top' || side === 'bottom'
                  ? { width: '100%', height: 'min(420px, 100dvh)', left: 0, [side]: 0 }
                  : { height: '100%', width: '100%', maxWidth: 420, top: 0, [side]: 0 }),
                ...style,
                ...resizeStyle,
              }}
              className={className}
              {...props}
            >
              {resize && isHorizontal ? (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize sheet"
                  aria-valuemin={resizeMinWidth}
                  aria-valuemax={resizeMaxWidth}
                  aria-valuenow={Math.round(currentResizeWidth)}
                  tabIndex={0}
                  data-resizing={isResizing ? '' : undefined}
                  className={cn(sheetResizeHandle, side === 'right' ? sheetResizeHandleRight : sheetResizeHandleLeft)}
                  onMouseDown={handleResizeMouseDown}
                  onTouchStart={handleResizeTouchStart}
                  onKeyDown={handleResizeKeyDown}
                />
              ) : null}
              <div className="flex h-full flex-col">{children}</div>
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

SheetContent.displayName = 'Sheet.Content'

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-3 border-b border-border px-6 py-4', className)}
      {...props}
    />
  )
})

SheetHeader.displayName = 'Sheet.Header'

export interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetBody = React.forwardRef<HTMLDivElement, SheetBodyProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('flex-1 overflow-y-auto px-6 py-5', className)} {...props} />
})

SheetBody.displayName = 'Sheet.Body'

export interface SheetTitleProps {
  className?: string
  children: React.ReactNode
}

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </DialogPrimitive.Title>
  )
})

SheetTitle.displayName = 'Sheet.Title'

export interface SheetDescriptionProps {
  className?: string
  children: React.ReactNode
}

const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DialogPrimitive.Description ref={ref} className={cn('mt-1 text-sm text-muted-foreground', className)} {...props}>
        {children}
      </DialogPrimitive.Description>
    )
  },
)

SheetDescription.displayName = 'Sheet.Description'

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Body: SheetBody,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
}
