import type { Transition, Variants } from 'motion/react'
import type { DialogContentSize } from './dialog.props'

export const dialogBackdropBaseCls =
  'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'

export const dialogBackdropBase = 'af-dialog-backdrop-base'

export const dialogPopupBaseCls =
  'fixed z-50 rounded-[var(--element-border-radius)] border bg-background shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const dialogPopupBase = 'af-dialog-popup-base'

export const dialogContentBySize: Record<DialogContentSize, string> = {
  sm: 'af-dialog-size-sm',
  md: 'af-dialog-size-md',
  lg: 'af-dialog-size-lg',
  xl: 'af-dialog-size-xl',
}

export const dialogContentByAlign = {
  center: 'af-dialog-align-center',
  start: 'af-dialog-align-start',
} as const

export const dialogHeader = 'af-dialog-header'
export const dialogBody = 'af-dialog-body'
export const dialogContentPadding = 'af-dialog-body'

export const dialogFooter = 'af-dialog-footer'
export const alertDialogFooter = 'af-dialog-alert-footer'

export const dialogTitle = 'af-dialog-title'
export const dialogDescription = 'af-dialog-description'

// Motion variants
export const dialogBackdropVariants: Variants = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, backdropFilter: 'blur(4px)' },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' },
}

export const dialogBackdropTransition: Transition = { duration: 0.2, ease: 'easeInOut' }

export const dialogPopupVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const dialogPopupTransition: Transition = { type: 'spring', stiffness: 150, damping: 25 }
