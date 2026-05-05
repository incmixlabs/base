'use client'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import {
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
  type AlertDialogContentAlign,
  type AlertDialogContentProps,
  type AlertDialogContentSize,
  type AlertDialogDescriptionProps,
  type AlertDialogFooterProps,
  type AlertDialogRootProps,
  type AlertDialogTitleProps,
  type AlertDialogTriggerProps,
  alertDialogContentPropDefs,
} from './alert-dialog.props'
import {
  alertDialogFooter,
  dialogBackdropBase,
  dialogBackdropBaseCls,
  dialogBackdropTransition,
  dialogBackdropVariants,
  dialogContentByAlign,
  dialogContentBySize,
  dialogContentPadding,
  dialogDescription,
  dialogPopupBase,
  dialogPopupBaseCls,
  dialogPopupTransition,
  dialogPopupVariants,
  dialogTitle,
} from './dialog.css'
import { createComposedCloseRender, createComposedTriggerRender } from './trigger.utils'

export type { AlertDialogProps } from './alert-dialog.props'

// Root
// ============================================================================

const AlertDialogOpenContext = React.createContext<boolean>(false)

const AlertDialogRoot: React.FC<AlertDialogRootProps> = ({ open: openProp, onOpenChange, defaultOpen, children }) => {
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
    <AlertDialogOpenContext.Provider value={isOpen}>
      <AlertDialogPrimitive.Root open={openProp} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
        {children}
      </AlertDialogPrimitive.Root>
    </AlertDialogOpenContext.Provider>
  )
}

AlertDialogRoot.displayName = 'AlertDialog.Root'

// ============================================================================
// Trigger
// ============================================================================

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ children, className, ...props }, ref) => {
    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { className?: string }>

      return (
        <AlertDialogPrimitive.Trigger
          ref={ref}
          render={createComposedTriggerRender(childElement, className)}
          {...props}
        />
      )
    }

    return (
      <AlertDialogPrimitive.Trigger ref={ref} className={cn('outline-none', className)} {...props}>
        {children}
      </AlertDialogPrimitive.Trigger>
    )
  },
)

AlertDialogTrigger.displayName = 'AlertDialog.Trigger'

// ============================================================================
// Content
// ============================================================================

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  (
    { size, radius: radiusProp, align, maxWidth, style, className, container: containerProp, children, ...props },
    ref,
  ) => {
    const themePortalContainer = useThemePortalContainer()
    const resolvedSize = (normalizeEnumPropValue(alertDialogContentPropDefs.size, size) ??
      alertDialogContentPropDefs.size.default ??
      'md') as AlertDialogContentSize
    const radius = useThemeRadius(radiusProp)
    const resolvedAlign = (normalizeEnumPropValue(alertDialogContentPropDefs.align, align) ??
      alertDialogContentPropDefs.align.default ??
      'center') as AlertDialogContentAlign
    const popupStyle = {
      ...getRadiusStyles(radius),
      ...style,
      ...(maxWidth ? { maxWidth } : {}),
    }

    const isOpen = React.useContext(AlertDialogOpenContext)

    return (
      <AnimatePresence>
        {isOpen && (
          <AlertDialogPrimitive.Portal keepMounted container={containerProp ?? themePortalContainer}>
            <AlertDialogPrimitive.Backdrop
              render={
                <m.div
                  key="alert-dialog-backdrop"
                  variants={dialogBackdropVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={dialogBackdropTransition}
                />
              }
              className={cn(dialogBackdropBaseCls, dialogBackdropBase)}
            />
            <AlertDialogPrimitive.Popup
              ref={ref}
              render={
                <m.div
                  key="alert-dialog-popup"
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
                dialogContentPadding,
                dialogContentBySize[resolvedSize],
                dialogContentByAlign[resolvedAlign],
                className,
              )}
              style={popupStyle}
              {...props}
            >
              {children}
            </AlertDialogPrimitive.Popup>
          </AlertDialogPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

AlertDialogContent.displayName = 'AlertDialog.Content'

// ============================================================================
// Title
// ============================================================================

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <AlertDialogPrimitive.Title
        ref={ref}
        className={cn(dialogTitle, 'font-semibold text-foreground', className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Title>
    )
  },
)

AlertDialogTitle.displayName = 'AlertDialog.Title'

// ============================================================================
// Description
// ============================================================================

const AlertDialogDescription = React.forwardRef<HTMLDivElement, AlertDialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <AlertDialogPrimitive.Description
        ref={ref as React.Ref<HTMLDivElement>}
        render={<div />}
        className={cn(dialogDescription, 'mt-2 text-muted-foreground', className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Description>
    )
  },
)

AlertDialogDescription.displayName = 'AlertDialog.Description'

// ============================================================================
// Footer
// ============================================================================

const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Row
        ref={ref as React.Ref<HTMLElement>}
        justify="end"
        mt="5"
        className={cn(alertDialogFooter, className)}
        {...props}
      >
        {children}
      </Row>
    )
  },
)

AlertDialogFooter.displayName = 'AlertDialog.Footer'

// ============================================================================
// Action (Confirm button)
// ============================================================================

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return <AlertDialogPrimitive.Close ref={ref} render={children} {...props} />
    }

    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { className?: string }>

      return (
        <AlertDialogPrimitive.Close ref={ref} render={createComposedCloseRender(childElement, className)} {...props} />
      )
    }

    return (
      <AlertDialogPrimitive.Close
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'transition-colors',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Close>
    )
  },
)

AlertDialogAction.displayName = 'AlertDialog.Action'

// ============================================================================
// Cancel
// ============================================================================

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return <AlertDialogPrimitive.Close ref={ref} render={children} {...props} />
    }

    if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { className?: string }>

      return (
        <AlertDialogPrimitive.Close ref={ref} render={createComposedCloseRender(childElement, className)} {...props} />
      )
    }

    return (
      <AlertDialogPrimitive.Close
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'transition-colors',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Close>
    )
  },
)

AlertDialogCancel.displayName = 'AlertDialog.Cancel'

// ============================================================================
// Export compound component
// ============================================================================

/** AlertDialog export. */
export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Footer: AlertDialogFooter,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
}
