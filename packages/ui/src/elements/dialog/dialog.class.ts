import type { Transition, Variants } from 'motion/react'
import type { DialogContentSize } from './dialog.props'

export const dialogBackdropBaseCls =
  'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'

export const dialogBackdropBase = '[background-color:rgb(0_0_0_/_0.24)] backdrop-blur-[4px]'

export const dialogPopupBaseCls =
  'fixed z-50 box-border rounded-[var(--element-border-radius)] border border-solid border-neutral bg-neutral-surface text-neutral shadow-[var(--shadow-4)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const dialogPopupBase = 'inset-x-4 mx-auto max-h-[calc(100dvh-2rem)] w-auto overflow-y-auto'

export const dialogContentBySize: Record<DialogContentSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export const dialogContentByAlign = {
  center: 'top-1/2 [translate:0_-50%]',
  start: 'top-[10vh]',
} as const

export const dialogHeaderBySize: Record<DialogContentSize, string> = {
  sm: 'p-6 pb-0',
  md: 'p-6 pb-0',
  lg: 'p-6 pb-0',
  xl: 'p-6 pb-0',
}

export const dialogBodyBySize: Record<DialogContentSize, string> = {
  sm: 'p-6',
  md: 'p-6',
  lg: 'p-6',
  xl: 'p-6',
}

export const dialogContentPaddingBySize = dialogBodyBySize

export const dialogFooterBySize: Record<DialogContentSize, string> = {
  sm: 'gap-2 p-6 pt-0',
  md: 'gap-2 p-6 pt-0',
  lg: 'gap-2 p-6 pt-0',
  xl: 'gap-2 p-6 pt-0',
}

export const alertDialogFooterBySize: Record<DialogContentSize, string> = {
  sm: 'gap-2',
  md: 'gap-2',
  lg: 'gap-2',
  xl: 'gap-2',
}

export const dialogTitleBySize: Record<DialogContentSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

export const dialogDescriptionBySize: Record<DialogContentSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

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
