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
import { sheetBackdropTransition, sheetBackdropVariants, sheetPanelTransition, sheetPanelVariants } from './sheet.css'
import type { SheetSide } from './sheet.props'

const SheetOpenContext = React.createContext<boolean>(false)

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
}

const borderSideStyle: Record<SheetSide, React.CSSProperties> = {
  right: { borderLeft: '1px solid var(--color-neutral-border)' },
  left: { borderRight: '1px solid var(--color-neutral-border)' },
  top: { borderBottom: '1px solid var(--color-neutral-border)' },
  bottom: { borderTop: '1px solid var(--color-neutral-border)' },
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', radius: radiusProp, className, children, style, ...props }, ref) => {
    'use no memo'
    const portalContainer = useThemePortalContainer()
    const isOpen = React.useContext(SheetOpenContext)
    const panelVariants = sheetPanelVariants[side]
    const radius = useThemeRadius(radiusProp)

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
              ref={ref}
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
              }}
              className={className}
              {...props}
            >
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
