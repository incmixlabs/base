'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Column, Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import {
  dialogBackdropBase,
  dialogBackdropBaseCls,
  dialogBackdropTransition,
  dialogBackdropVariants,
  dialogBody,
  dialogContentByAlign,
  dialogContentBySize,
  dialogDescription,
  dialogFooter,
  dialogHeader,
  dialogPopupBase,
  dialogPopupBaseCls,
  dialogPopupTransition,
  dialogPopupVariants,
  dialogTitle,
} from './dialog.css'
import {
  type DialogBodyProps,
  type DialogCloseProps,
  type DialogContentAlign,
  type DialogContentProps,
  type DialogContentSize,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
  dialogContentPropDefs,
} from './dialog.props'
import { createComposedCloseRender, createComposedTriggerRender } from './trigger.utils'

export type { DialogProps } from './dialog.props'

// ============================================================================
// Context
// ============================================================================

const DialogSizeContext = React.createContext<DialogContentSize>('md')
const DialogOpenContext = React.createContext<boolean>(false)

// ============================================================================
// Root
// ============================================================================

const DialogRoot: React.FC<DialogRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
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
    <DialogOpenContext.Provider value={isOpen}>
      <DialogPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  )
}

DialogRoot.displayName = 'Dialog.Root'

// ============================================================================
// Trigger
// ============================================================================

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, className, ...props }, ref) => {
    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { className?: string }>

      return (
        <DialogPrimitive.Trigger ref={ref} render={createComposedTriggerRender(childElement, className)} {...props} />
      )
    }

    return (
      <DialogPrimitive.Trigger ref={ref} className={cn('outline-none', className)} {...props}>
        {children}
      </DialogPrimitive.Trigger>
    )
  },
)

DialogTrigger.displayName = 'Dialog.Trigger'

// ============================================================================
// Content
// ============================================================================

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      size,
      radius: radiusProp,
      align,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      style,
      className,
      container: containerProp,
      children,
      ...props
    },
    ref,
  ) => {
    const themePortalContainer = useThemePortalContainer()
    const resolvedSize = (normalizeEnumPropValue(dialogContentPropDefs.size, size) ??
      dialogContentPropDefs.size.default ??
      'md') as DialogContentSize
    const radius = useThemeRadius(radiusProp)
    const resolvedAlign = (normalizeEnumPropValue(dialogContentPropDefs.align, align) ??
      dialogContentPropDefs.align.default ??
      'center') as DialogContentAlign
    const widthProps = getWidthProps({ width, minWidth, maxWidth })
    const heightProps = getHeightProps({ height, minHeight, maxHeight })
    const popupStyle = {
      ...getRadiusStyles(radius),
      ...widthProps.style,
      ...heightProps.style,
      ...style,
    }

    const isOpen = React.useContext(DialogOpenContext)

    return (
      <DialogSizeContext.Provider value={resolvedSize}>
        <AnimatePresence>
          {isOpen && (
            <DialogPrimitive.Portal keepMounted container={containerProp ?? themePortalContainer}>
              <DialogPrimitive.Backdrop
                render={
                  <m.div
                    key="dialog-backdrop"
                    variants={dialogBackdropVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dialogBackdropTransition}
                  />
                }
                className={cn(dialogBackdropBaseCls, dialogBackdropBase)}
              />
              <DialogPrimitive.Popup
                ref={ref}
                render={
                  <m.div
                    key="dialog-popup"
                    variants={dialogPopupVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dialogPopupTransition}
                  />
                }
                className={cn(
                  dialogPopupBaseCls,
                  dialogPopupBase,
                  dialogContentBySize[resolvedSize],
                  dialogContentByAlign[resolvedAlign],
                  widthProps.className,
                  heightProps.className,
                  className,
                )}
                style={popupStyle}
                {...props}
              >
                {children}
              </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogSizeContext.Provider>
    )
  },
)

DialogContent.displayName = 'Dialog.Content'

// ============================================================================
// Header
// ============================================================================

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, children, ...props }, ref) => {
  return (
    <Column ref={ref as React.Ref<HTMLElement>} className={cn('gap-1.5', dialogHeader, className)} {...props}>
      {children}
    </Column>
  )
})

DialogHeader.displayName = 'Dialog.Header'

// ============================================================================
// Body
// ============================================================================

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(dialogBody, className)} {...props}>
      {children}
    </div>
  )
})

DialogBody.displayName = 'Dialog.Body'

// ============================================================================
// Footer
// ============================================================================

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, children, ...props }, ref) => {
  return (
    <Flex
      ref={ref as React.Ref<HTMLElement>}
      direction={{ initial: 'column-reverse', sm: 'row' }}
      justify={{ sm: 'end' }}
      className={cn(dialogFooter, className)}
      {...props}
    >
      {children}
    </Flex>
  )
})

DialogFooter.displayName = 'Dialog.Footer'

// ============================================================================
// Title
// ============================================================================

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Title ref={ref} className={cn(dialogTitle, 'font-semibold text-foreground', className)} {...props}>
      {children}
    </DialogPrimitive.Title>
  )
})

DialogTitle.displayName = 'Dialog.Title'

// ============================================================================
// Description
// ============================================================================

const DialogDescription = React.forwardRef<HTMLDivElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DialogPrimitive.Description
        ref={ref as React.Ref<HTMLDivElement>}
        render={<div />}
        className={cn(dialogDescription, 'text-muted-foreground', className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Description>
    )
  },
)

DialogDescription.displayName = 'Dialog.Description'

// ============================================================================
// Close
// ============================================================================

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const size = React.useContext(DialogSizeContext)

    // When asChild is true, render as the child element (e.g., for footer cancel buttons)
    if (asChild && React.isValidElement(children)) {
      return <DialogPrimitive.Close ref={ref} render={children} {...props} />
    }

    // Auto-render child element to avoid nested button markup.
    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { className?: string }>

      return <DialogPrimitive.Close ref={ref} render={createComposedCloseRender(childElement, className)} {...props} />
    }

    // Default: render as X icon button in top-right corner
    return (
      <DialogPrimitive.Close
        ref={ref}
        render={
          <IconButton
            variant="ghost"
            size={size}
            radius="full"
            className={cn('absolute right-4 top-4', className)}
            aria-label="Close"
          />
        }
        {...props}
      >
        {children ?? <X />}
      </DialogPrimitive.Close>
    )
  },
)

DialogClose.displayName = 'Dialog.Close'

// ============================================================================
// Export compound component
// ============================================================================

/** Dialog export. */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
}
