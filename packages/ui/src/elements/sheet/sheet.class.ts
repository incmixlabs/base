import type { Transition, Variants } from 'motion/react'
import type { SheetSide } from './sheet.props'

export const sheetBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const sheetBackdropTransition: Transition = {
  duration: 0.2,
  ease: 'easeInOut',
}

export const sheetPanelVariants: Record<SheetSide, Variants> = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
}

export const sheetPanelTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const sheetBackdropBase = 'fixed inset-0 z-[100] bg-black/25'

export const sheetPanelBase =
  'fixed z-[110] bg-neutral-surface shadow-[var(--shadow-2xl,0_25px_50px_-12px_rgba(0,0,0,0.25))] border-solid'

export const sheetPanelBySide: Record<SheetSide, string> = {
  right: 'right-0 top-0 h-full w-full max-w-[420px] border-l border-neutral',
  left: 'left-0 top-0 h-full w-full max-w-[420px] border-r border-neutral',
  top: 'left-0 top-0 h-[min(420px,100dvh)] w-full border-b border-neutral',
  bottom: 'bottom-0 left-0 h-[min(420px,100dvh)] w-full border-t border-neutral',
}

export const sheetResizeHandle =
  'absolute inset-y-0 z-30 w-3 border-0 bg-transparent p-0 cursor-col-resize touch-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:h-12 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-neutral-border hover:after:bg-primary focus-visible:after:bg-primary data-[resizing]:after:bg-primary'

export const sheetResizeHandleLeft = 'right-0'

export const sheetResizeHandleRight = 'left-0'

export const sheetClassNames = [
  sheetBackdropBase,
  sheetPanelBase,
  ...Object.values(sheetPanelBySide),
  sheetResizeHandle,
  sheetResizeHandleLeft,
  sheetResizeHandleRight,
]
