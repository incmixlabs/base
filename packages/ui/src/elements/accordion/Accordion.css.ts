import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { accordionSizeVar } from '@/theme/runtime/component-vars'
import { panelSizeTokens } from '@/theme/token-maps'
import { accordionRootPropDefs } from './accordion.props'

const triggerPaddingVar = createVar()
const contentPaddingVar = createVar()
const fontSizeVar = createVar()
const lineHeightVar = createVar()
const triggerGapVar = createVar()
const iconSizeVar = createVar()

type AccordionSize = (typeof accordionRootPropDefs.size.values)[number]

export const accordionRootBase = style({
  border: '1px solid var(--color-neutral-border)',
  borderRadius: 'var(--element-border-radius)',
  overflow: 'hidden',
  background: 'var(--color-neutral-surface)',
})

export const accordionRootBorderless = style({
  border: 0,
})

export const accordionItemBase = style({
  selectors: {
    '& + &': {
      borderTop: '1px solid var(--color-neutral-border)',
    },
  },
})

export const accordionItemBorderless = style({
  border: 0,
  selectors: {
    '& + &': {
      borderTop: 0,
    },
  },
})

export const accordionHeaderBase = style({
  margin: 0,
  minWidth: 0,
  width: '100%',
})

export const accordionTriggerPaddingless = style({
  paddingInline: 0,
  paddingBlock: 0,
})

export const accordionTriggerBase = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: triggerGapVar,
  textAlign: 'left',
  color: 'var(--color-neutral-text)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  paddingInline: accordionSizeVar('base', 'triggerPaddingInline', '1rem'),
  paddingBlock: triggerPaddingVar,
  fontSize: fontSizeVar,
  lineHeight: lineHeightVar,
  transition: accordionSizeVar('base', 'triggerTransition', 'background-color 160ms ease'),
  selectors: {
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary-primary)',
      outlineOffset: '-2px',
    },
    '&:hover:not([data-disabled])': {
      background: 'var(--color-neutral-soft)',
    },
  },
})

export const accordionChevron = style({
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
  transition: 'transform 160ms ease',
  selectors: {
    [`${accordionTriggerBase}[data-panel-open] &`]: {
      transform: 'rotate(180deg)',
    },
    [`${accordionTriggerBase}[data-open] &`]: {
      transform: 'rotate(180deg)',
    },
  },
})

export const accordionContentBase = style({
  overflow: 'hidden',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: fontSizeVar,
  lineHeight: lineHeightVar,
})

export const accordionContentInner = style({
  paddingInline: accordionSizeVar('base', 'contentPaddingInline', '1rem'),
  paddingBlock: contentPaddingVar,
})

export const accordionContentPaddingless = style({
  paddingInline: 0,
  paddingBlock: 0,
})

function getSizeVars(size: AccordionSize) {
  const token = panelSizeTokens[size]
  return {
    vars: {
      [triggerPaddingVar]: accordionSizeVar(size, 'triggerPaddingBlock', token.padding),
      [contentPaddingVar]: accordionSizeVar(size, 'contentPaddingBlock', token.padding),
      [fontSizeVar]: accordionSizeVar(size, 'fontSize', token.fontSize),
      [lineHeightVar]: accordionSizeVar(size, 'lineHeight', token.lineHeight),
      [triggerGapVar]: accordionSizeVar(size, 'gap', token.gap),
      [iconSizeVar]: accordionSizeVar(size, 'iconSize', token.iconSize),
    },
  }
}

export const accordionSizeVars = styleVariants({
  ...Object.fromEntries(accordionRootPropDefs.size.values.map(size => [size, getSizeVars(size)])),
} as Record<AccordionSize, ReturnType<typeof getSizeVars>>)

// ── Motion variants ──

export const accordionPanelVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export const accordionPanelTransition: Transition = { duration: 0.35, ease: 'easeInOut' }
