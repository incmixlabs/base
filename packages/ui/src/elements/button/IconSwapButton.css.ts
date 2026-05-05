import { keyframes, style } from '@vanilla-extract/css'

const iconSwapRotateForward = keyframes({
  '0%': {
    transform: 'rotate(-120deg)',
  },
  '100%': {
    transform: 'rotate(0deg)',
  },
})

const iconSwapRotateBackward = keyframes({
  '0%': {
    transform: 'rotate(120deg)',
  },
  '100%': {
    transform: 'rotate(0deg)',
  },
})

export const iconSwapButtonRotator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'inherit',
  transformOrigin: '50% 50%',
  transform: 'rotate(0deg)',
  willChange: 'transform',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      willChange: 'auto',
    },
  },
})

export const iconSwapButtonMotionForward = style({
  animation: `${iconSwapRotateForward} 280ms var(--af-ease-standard) both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})

export const iconSwapButtonMotionBackward = style({
  animation: `${iconSwapRotateBackward} 280ms var(--af-ease-standard) both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})

export const iconSwapButtonIcon = style({
  color: 'inherit',
})
