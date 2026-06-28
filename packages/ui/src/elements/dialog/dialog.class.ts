import type { Transition, Variants } from 'motion/react'
import { dialogSizeVar } from '../../theme/runtime/component-vars'
import type { DialogContentSize } from './dialog.props'

function unoValue(value: string) {
  return value.replace(/\s+/g, '_')
}

function utility(prefix: string, value: string) {
  return `${prefix}-[${unoValue(value)}]`
}

function dialogMaxWidthClassName(size: DialogContentSize, fallback: string) {
  return utility('max-w', dialogSizeVar(size, 'maxWidth', fallback))
}

function dialogPaddingClassName(size: DialogContentSize) {
  return utility('p', dialogSizeVar(size, 'padding', '1.5rem'))
}

function dialogFooterGapClassName(size: DialogContentSize) {
  return utility('gap', dialogSizeVar(size, 'footerGap', '0.5rem'))
}

function dialogTitleClassName(size: DialogContentSize, fontSizeFallback: string, lineHeightFallback: string) {
  return [
    utility('text', `length:${dialogSizeVar(size, 'titleFontSize', fontSizeFallback)}`),
    utility('leading', dialogSizeVar(size, 'titleLineHeight', lineHeightFallback)),
  ].join(' ')
}

function dialogDescriptionClassName(size: DialogContentSize, fontSizeFallback: string, lineHeightFallback: string) {
  return [
    utility('text', `length:${dialogSizeVar(size, 'descriptionFontSize', fontSizeFallback)}`),
    utility('leading', dialogSizeVar(size, 'descriptionLineHeight', lineHeightFallback)),
  ].join(' ')
}

export const dialogBackdropBaseCls =
  'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'

export const dialogBackdropBase = '[background-color:rgb(0_0_0_/_0.24)] backdrop-blur-[4px]'

export const dialogPopupBaseCls =
  'fixed z-50 box-border rounded-[var(--element-border-radius)] border border-solid border-neutral bg-neutral-surface text-neutral [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const dialogPopupBase = 'inset-x-4 mx-auto max-h-[calc(100dvh-2rem)] w-auto overflow-y-auto'

export const dialogContentBySize: Record<DialogContentSize, string> = {
  sm: dialogMaxWidthClassName('sm', '24rem'),
  md: dialogMaxWidthClassName('md', '28rem'),
  lg: dialogMaxWidthClassName('lg', '32rem'),
  xl: dialogMaxWidthClassName('xl', '36rem'),
}

export const dialogContentByAlign = {
  center: 'top-1/2 [translate:0_-50%]',
  start: 'top-[10vh]',
} as const

export const dialogHeaderBySize: Record<DialogContentSize, string> = {
  sm: `${dialogPaddingClassName('sm')} pb-0`,
  md: `${dialogPaddingClassName('md')} pb-0`,
  lg: `${dialogPaddingClassName('lg')} pb-0`,
  xl: `${dialogPaddingClassName('xl')} pb-0`,
}

export const dialogBodyBySize: Record<DialogContentSize, string> = {
  sm: dialogPaddingClassName('sm'),
  md: dialogPaddingClassName('md'),
  lg: dialogPaddingClassName('lg'),
  xl: dialogPaddingClassName('xl'),
}

export const dialogContentPaddingBySize = dialogBodyBySize

export const dialogFooterBySize: Record<DialogContentSize, string> = {
  sm: `${dialogFooterGapClassName('sm')} ${dialogPaddingClassName('sm')} pt-0`,
  md: `${dialogFooterGapClassName('md')} ${dialogPaddingClassName('md')} pt-0`,
  lg: `${dialogFooterGapClassName('lg')} ${dialogPaddingClassName('lg')} pt-0`,
  xl: `${dialogFooterGapClassName('xl')} ${dialogPaddingClassName('xl')} pt-0`,
}

export const alertDialogFooterBySize: Record<DialogContentSize, string> = {
  sm: dialogFooterGapClassName('sm'),
  md: dialogFooterGapClassName('md'),
  lg: dialogFooterGapClassName('lg'),
  xl: dialogFooterGapClassName('xl'),
}

export const dialogTitleBySize: Record<DialogContentSize, string> = {
  sm: dialogTitleClassName('sm', 'var(--font-size-sm)', 'var(--line-height-sm)'),
  md: dialogTitleClassName('md', 'var(--font-size-md)', 'var(--line-height-md)'),
  lg: dialogTitleClassName('lg', 'var(--font-size-lg)', 'var(--line-height-lg)'),
  xl: dialogTitleClassName('xl', 'var(--font-size-xl)', 'var(--line-height-xl)'),
}

export const dialogDescriptionBySize: Record<DialogContentSize, string> = {
  sm: dialogDescriptionClassName('sm', 'var(--font-size-xs)', 'var(--line-height-xs)'),
  md: dialogDescriptionClassName('md', 'var(--font-size-sm)', 'var(--line-height-sm)'),
  lg: dialogDescriptionClassName('lg', 'var(--font-size-md)', 'var(--line-height-md)'),
  xl: dialogDescriptionClassName('xl', 'var(--font-size-lg)', 'var(--line-height-lg)'),
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
