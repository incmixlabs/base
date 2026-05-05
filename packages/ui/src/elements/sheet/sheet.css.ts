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
