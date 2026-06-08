import { style } from '@vanilla-extract/css'
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

export const sheetResizeHandle = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  zIndex: 30,
  width: '0.75rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'col-resize',
  touchAction: 'none',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '0.25rem',
      height: '3rem',
      transform: 'translate(-50%, -50%)',
      borderRadius: '999px',
      backgroundColor: 'var(--border)',
    },
    '&:hover::after': {
      backgroundColor: 'var(--ring)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '-2px',
    },
    '&:focus-visible::after': {
      backgroundColor: 'var(--ring)',
    },
    '&[data-resizing]::after': {
      backgroundColor: 'var(--ring)',
    },
  },
})

export const sheetResizeHandleLeft = style({
  right: 0,
})

export const sheetResizeHandleRight = style({
  left: 0,
})
