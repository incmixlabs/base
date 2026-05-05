import type { Transition, Variants } from 'motion/react'

export const tabsPanelVariants: Variants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' },
}

export const tabsPanelTransition: Transition = { duration: 0.3, ease: 'easeInOut' }
