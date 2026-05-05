import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { tooltipMaxWidthVar, tooltipSizeVar } from '@/theme/runtime/component-vars'
import { floatingSurfaceSizeTokens } from '@/theme/token-maps'

export { surfaceArrowFillVariants as tooltipArrowColorByVariant } from '../surface/surface.css'

const tooltipPaddingVar = createVar()
const tooltipFontSizeVar = createVar()
const tooltipLineHeightVar = createVar()

export const tooltipContentBase = style({
  minWidth: 'var(--anchor-width)',
  outline: 0,
  overflow: 'visible',
  position: 'relative',
  boxSizing: 'border-box',
  borderRadius: 'var(--element-border-radius)',
  transformOrigin: 'var(--transform-origin)',
  padding: tooltipPaddingVar,
  fontSize: tooltipFontSizeVar,
  lineHeight: tooltipLineHeightVar,
})

export const tooltipContentBySize = styleVariants({
  xs: {
    vars: {
      [tooltipPaddingVar]: tooltipSizeVar('xs', 'padding', floatingSurfaceSizeTokens.xs.padding),
      [tooltipFontSizeVar]: tooltipSizeVar('xs', 'fontSize', floatingSurfaceSizeTokens.xs.fontSize),
      [tooltipLineHeightVar]: tooltipSizeVar('xs', 'lineHeight', floatingSurfaceSizeTokens.xs.lineHeight),
    },
  },
  sm: {
    vars: {
      [tooltipPaddingVar]: tooltipSizeVar('sm', 'padding', floatingSurfaceSizeTokens.sm.padding),
      [tooltipFontSizeVar]: tooltipSizeVar('sm', 'fontSize', floatingSurfaceSizeTokens.sm.fontSize),
      [tooltipLineHeightVar]: tooltipSizeVar('sm', 'lineHeight', floatingSurfaceSizeTokens.sm.lineHeight),
    },
  },
  md: {
    vars: {
      [tooltipPaddingVar]: tooltipSizeVar('md', 'padding', floatingSurfaceSizeTokens.md.padding),
      [tooltipFontSizeVar]: tooltipSizeVar('md', 'fontSize', floatingSurfaceSizeTokens.md.fontSize),
      [tooltipLineHeightVar]: tooltipSizeVar('md', 'lineHeight', floatingSurfaceSizeTokens.md.lineHeight),
    },
  },
  lg: {
    vars: {
      [tooltipPaddingVar]: tooltipSizeVar('lg', 'padding', floatingSurfaceSizeTokens.lg.padding),
      [tooltipFontSizeVar]: tooltipSizeVar('lg', 'fontSize', floatingSurfaceSizeTokens.lg.fontSize),
      [tooltipLineHeightVar]: tooltipSizeVar('lg', 'lineHeight', floatingSurfaceSizeTokens.lg.lineHeight),
    },
  },
})

export const tooltipContentMaxWidth = styleVariants({
  xs: { maxWidth: tooltipMaxWidthVar('xs', 'maxWidth', '20rem') },
  sm: { maxWidth: tooltipMaxWidthVar('sm', 'maxWidth', '24rem') },
  md: { maxWidth: tooltipMaxWidthVar('md', 'maxWidth', '28rem') },
  lg: { maxWidth: tooltipMaxWidthVar('lg', 'maxWidth', '32rem') },
  xl: { maxWidth: tooltipMaxWidthVar('xl', 'maxWidth', '36rem') },
  none: { maxWidth: 'none' },
})

// Motion variants for tooltip enter/exit
export const tooltipPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
}

export const tooltipPanelTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
}
