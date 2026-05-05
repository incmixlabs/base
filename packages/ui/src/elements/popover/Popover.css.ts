import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { popoverMaxWidthVar, popoverSizeVar } from '@/theme/runtime/component-vars'
import { floatingSurfaceSizeTokens } from '@/theme/token-maps'

export { surfaceArrowFillVariants as popoverArrowColorByVariant } from '../surface/surface.css'

const popoverPaddingVar = createVar()
const popoverFontSizeVar = createVar()
const popoverLineHeightVar = createVar()

export const popoverContentBase = style({
  minWidth: 'var(--popover-trigger-width, var(--radix-popover-trigger-width))',
  outline: 0,
  overflow: 'visible',
  position: 'relative',
  boxSizing: 'border-box',
  borderRadius: 'var(--element-border-radius)',
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  padding: popoverPaddingVar,
  fontSize: popoverFontSizeVar,
  lineHeight: popoverLineHeightVar,
})

export const popoverContentBySize = styleVariants({
  xs: {
    vars: {
      [popoverPaddingVar]: popoverSizeVar('xs', 'padding', floatingSurfaceSizeTokens.xs.padding),
      [popoverFontSizeVar]: popoverSizeVar('xs', 'fontSize', floatingSurfaceSizeTokens.xs.fontSize),
      [popoverLineHeightVar]: popoverSizeVar('xs', 'lineHeight', floatingSurfaceSizeTokens.xs.lineHeight),
    },
  },
  sm: {
    vars: {
      [popoverPaddingVar]: popoverSizeVar('sm', 'padding', floatingSurfaceSizeTokens.sm.padding),
      [popoverFontSizeVar]: popoverSizeVar('sm', 'fontSize', floatingSurfaceSizeTokens.sm.fontSize),
      [popoverLineHeightVar]: popoverSizeVar('sm', 'lineHeight', floatingSurfaceSizeTokens.sm.lineHeight),
    },
  },
  md: {
    vars: {
      [popoverPaddingVar]: popoverSizeVar('md', 'padding', floatingSurfaceSizeTokens.md.padding),
      [popoverFontSizeVar]: popoverSizeVar('md', 'fontSize', floatingSurfaceSizeTokens.md.fontSize),
      [popoverLineHeightVar]: popoverSizeVar('md', 'lineHeight', floatingSurfaceSizeTokens.md.lineHeight),
    },
  },
  lg: {
    vars: {
      [popoverPaddingVar]: popoverSizeVar('lg', 'padding', floatingSurfaceSizeTokens.lg.padding),
      [popoverFontSizeVar]: popoverSizeVar('lg', 'fontSize', floatingSurfaceSizeTokens.lg.fontSize),
      [popoverLineHeightVar]: popoverSizeVar('lg', 'lineHeight', floatingSurfaceSizeTokens.lg.lineHeight),
    },
  },
})

export const popoverContentMaxWidth = styleVariants({
  xs: { maxWidth: popoverMaxWidthVar('xs', 'maxWidth', '20rem') },
  sm: { maxWidth: popoverMaxWidthVar('sm', 'maxWidth', '24rem') },
  md: { maxWidth: popoverMaxWidthVar('md', 'maxWidth', '28rem') },
  lg: { maxWidth: popoverMaxWidthVar('lg', 'maxWidth', '32rem') },
  xl: { maxWidth: popoverMaxWidthVar('xl', 'maxWidth', '36rem') },
  none: { maxWidth: 'none' },
})

// Motion variants for popover panel enter/exit
export const popoverPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
}

export const popoverPanelTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
}
