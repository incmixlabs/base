import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { semanticColorVar } from '@/theme/props/color.prop'
import { treeViewSizeVar } from '@/theme/runtime/component-vars'
import { controlSizeTokens } from '@/theme/token-maps'
import { treeViewRootPropDefs } from './tree-view.props'

const itemPaddingInlineVar = createVar()
const itemPaddingVar = createVar()
const fontSizeVar = createVar()
const lineHeightVar = createVar()
const iconSizeVar = createVar()
const gapVar = createVar()
const itemRadiusVar = createVar()
export const treeViewItemHoverBgVar = createVar()
export const treeViewItemSelectedBgVar = createVar()
export const treeViewItemSelectedColorVar = createVar()

type TreeViewSize = (typeof treeViewRootPropDefs.size.values)[number]

export const treeViewRootBase = style({
  position: 'relative',
  minHeight: 0,
  flex: '1 1 0',
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const treeViewItemBase = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: gapVar,
  paddingInline: itemPaddingInlineVar,
  paddingBlock: itemPaddingVar,
  fontSize: fontSizeVar,
  lineHeight: lineHeightVar,
  cursor: 'pointer',
  borderRadius: itemRadiusVar,
  userSelect: 'none',
  transition: 'background-color 120ms ease',
  // Reset button defaults (accordion trigger renders as <button>)
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      background: `var(${treeViewItemHoverBgVar}, ${semanticColorVar('slate', 'soft')})`,
    },
    '&:focus-visible': {
      outline: `2px solid ${semanticColorVar('primary', 'primary')}`,
      outlineOffset: '-2px',
    },
    '&[data-selected]': {
      background: `var(${treeViewItemSelectedBgVar}, ${semanticColorVar('slate', 'soft')})`,
      color: `var(${treeViewItemSelectedColorVar}, ${semanticColorVar('slate', 'text')})`,
    },
    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    '&[data-drag-over]': {
      background: `color-mix(in oklch, ${semanticColorVar('primary', 'primary')} 20%, transparent)`,
    },
  },
})

export const treeViewChevron = style({
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
  transition: 'transform 160ms ease',
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`,
})

export const treeViewChevronOpen = style({
  transform: 'rotate(90deg)',
})

export const treeViewLeafSpacer = style({
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
})

export const treeViewIcon = style({
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
})

export const treeViewActions = style({
  marginInlineStart: 'auto',
  display: 'flex',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 120ms ease',
  selectors: {
    [`${treeViewItemBase}:hover + &, &:hover`]: {
      opacity: 1,
    },
    [`${treeViewItemBase}[data-selected] + &`]: {
      opacity: 1,
    },
  },
})

export const treeViewIndentGuide = style({
  borderInlineStart: `1px solid ${semanticColorVar('neutral', 'border')}`,
  marginInlineStart: `calc(${iconSizeVar} / 2 + ${itemPaddingInlineVar})`,
})

export const treeViewCompactItemVars = style({
  vars: {
    [itemPaddingInlineVar]: '0.25rem',
    [itemPaddingVar]: '0.125rem',
    [itemRadiusVar]: 'var(--radius-sm)',
  },
})

function getSizeVars(size: TreeViewSize) {
  const token = controlSizeTokens[size]
  return {
    vars: {
      [itemPaddingInlineVar]: treeViewSizeVar(size, 'itemPaddingInline', token.paddingX),
      [itemPaddingVar]: treeViewSizeVar(size, 'itemPaddingBlock', token.paddingY),
      [fontSizeVar]: treeViewSizeVar(size, 'fontSize', token.fontSize),
      [lineHeightVar]: treeViewSizeVar(size, 'lineHeight', token.lineHeight),
      [gapVar]: treeViewSizeVar(size, 'gap', token.gap),
      [iconSizeVar]: treeViewSizeVar(size, 'iconSize', token.iconSize),
      [itemRadiusVar]: treeViewSizeVar(size, 'itemRadius', 'var(--radius-md)'),
    },
  }
}

export const treeViewSizeVars = styleVariants({
  ...Object.fromEntries(treeViewRootPropDefs.size.values.map(size => [size, getSizeVars(size)])),
} as Record<TreeViewSize, ReturnType<typeof getSizeVars>>)

// ── Motion variants ──

export const treeViewBranchVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export const treeViewBranchTransition: Transition = { duration: 0.2, ease: 'easeInOut' }
