import { style } from '@vanilla-extract/css'
import { designTokens } from '@/theme/tokens'

export const wheelPickerOptionItem = style({
  color: designTokens.color.slate.text,
  opacity: 0.6,
  selectors: {
    '&[data-disabled="true"]': {
      opacity: 0.4,
    },
  },
})

export const wheelPickerHighlightWrapper = style({
  backgroundColor: `var(--wheel-picker-highlight-bg, ${designTokens.color.slate.softBackground})`,
  color: `var(--wheel-picker-highlight-text, ${designTokens.color.slate.text})`,
  selectors: {
    '&[data-rwp-focused="true"]': {
      boxShadow: `inset 0 0 0 2px var(--wheel-picker-highlight-border, ${designTokens.color.slate.border})`,
    },
  },
})

export const wheelPickerHighlightItem = style({
  selectors: {
    '&[data-disabled="true"]': {
      opacity: 0.4,
    },
  },
})
