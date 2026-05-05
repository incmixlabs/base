import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { connectorIndicatorBase, connectorSeparatorColor, connectorSeparatorCompleted } from '@/shared/connector.css'
import { semanticColorVar } from '@/theme/props/color.prop'
import { timelineSizeVar } from '@/theme/runtime/component-vars'

// ─── CSS Variables (set on root, cascaded to children) ───────────────────────

export const indicatorSizeVar = createVar()
export const itemOffsetVar = createVar()
const itemGapVar = createVar()
const itemPaddingInlineEndVar = createVar()
const itemPaddingBlockEndVar = createVar()
const titleFontSizeVar = createVar()
const dateFontSizeVar = createVar()
const contentFontSizeVar = createVar()

// ─── Size tokens (applied to root) ──────────────────────────────────────────

export const timelineSizeVars = styleVariants({
  xs: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('xs', 'indicatorSize', '0.75rem'),
      [itemOffsetVar]: timelineSizeVar('xs', 'itemOffset', '1.75rem'),
      [itemGapVar]: timelineSizeVar('xs', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('xs', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('xs', 'itemPaddingBlockEnd', '1.5rem'),
      [titleFontSizeVar]: timelineSizeVar('xs', 'titleFontSize', '0.75rem'),
      [dateFontSizeVar]: timelineSizeVar('xs', 'dateFontSize', '0.6875rem'),
      [contentFontSizeVar]: timelineSizeVar('xs', 'contentFontSize', '0.6875rem'),
    },
  },
  sm: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('sm', 'indicatorSize', '1rem'),
      [itemOffsetVar]: timelineSizeVar('sm', 'itemOffset', '2rem'),
      [itemGapVar]: timelineSizeVar('sm', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('sm', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('sm', 'itemPaddingBlockEnd', '1.5rem'),
      [titleFontSizeVar]: timelineSizeVar('sm', 'titleFontSize', '0.875rem'),
      [dateFontSizeVar]: timelineSizeVar('sm', 'dateFontSize', '0.75rem'),
      [contentFontSizeVar]: timelineSizeVar('sm', 'contentFontSize', '0.75rem'),
    },
  },
  md: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('md', 'indicatorSize', '1.125rem'),
      [itemOffsetVar]: timelineSizeVar('md', 'itemOffset', '2.25rem'),
      [itemGapVar]: timelineSizeVar('md', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('md', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('md', 'itemPaddingBlockEnd', '1.5rem'),
      [titleFontSizeVar]: timelineSizeVar('md', 'titleFontSize', '0.9375rem'),
      [dateFontSizeVar]: timelineSizeVar('md', 'dateFontSize', '0.8125rem'),
      [contentFontSizeVar]: timelineSizeVar('md', 'contentFontSize', '0.8125rem'),
    },
  },
  lg: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('lg', 'indicatorSize', '1.25rem'),
      [itemOffsetVar]: timelineSizeVar('lg', 'itemOffset', '2.5rem'),
      [itemGapVar]: timelineSizeVar('lg', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('lg', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('lg', 'itemPaddingBlockEnd', '1.5rem'),
      [titleFontSizeVar]: timelineSizeVar('lg', 'titleFontSize', '1rem'),
      [dateFontSizeVar]: timelineSizeVar('lg', 'dateFontSize', '0.875rem'),
      [contentFontSizeVar]: timelineSizeVar('lg', 'contentFontSize', '0.875rem'),
    },
  },
})

// ─── Root ────────────────────────────────────────────────────────────────────

export const timelineRoot = styleVariants({
  horizontal: { display: 'flex', flexDirection: 'row', width: '100%' },
  vertical: { display: 'flex', flexDirection: 'column' },
})

// ─── Item ────────────────────────────────────────────────────────────────────

export const timelineItemBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: itemGapVar,
  position: 'relative',
})

export const timelineItemOrientation = styleVariants({
  horizontal: {
    flex: '1 1 0%',
    marginBlockStart: itemOffsetVar,
    paddingInlineEnd: itemPaddingInlineEndVar,
    selectors: {
      '&:last-child': { paddingInlineEnd: 0 },
    },
  },
  vertical: {
    marginInlineStart: itemOffsetVar,
    paddingBlockEnd: itemPaddingBlockEndVar,
    selectors: {
      '&:last-child': { paddingBlockEnd: 0 },
    },
  },
})

// ─── Indicator ───────────────────────────────────────────────────────────────

export const timelineIndicatorBase = style([
  connectorIndicatorBase,
  {
    border: `2px solid ${semanticColorVar('neutral', 'border')}`,
    height: indicatorSizeVar,
    position: 'absolute',
    transition: 'border-color 150ms ease, background-color 150ms ease',
    width: indicatorSizeVar,
    selectors: {
      '&[data-state="completed"]': {
        borderColor: semanticColorVar('primary', 'primary'),
      },
      '&[data-state="active"]': {
        borderColor: semanticColorVar('primary', 'primary'),
        backgroundColor: semanticColorVar('primary', 'soft'),
      },
    },
  },
])

export const timelineIndicatorPosition = styleVariants({
  horizontal: {
    left: 0,
    top: `calc(-1 * ${itemOffsetVar})`,
    transform: 'translateY(50%)',
  },
  vertical: {
    left: `calc(-1 * ${itemOffsetVar})`,
    top: '0.125rem',
    transform: 'translateX(50%)',
  },
})

// ─── Separator ───────────────────────────────────────────────────────────────

export const timelineSeparatorBase = style([
  connectorSeparatorColor,
  {
    position: 'absolute',
    transition: 'background-color 150ms ease',
    selectors: {
      ':last-child > &': {
        display: 'none',
      },
    },
  },
])

export const timelineSeparatorPosition = styleVariants({
  horizontal: {
    height: '2px',
    left: `calc(${indicatorSizeVar} + 0.25rem)`,
    right: 0,
    top: `calc(-1 * ${itemOffsetVar} + ${indicatorSizeVar} / 2 - 1px)`,
  },
  vertical: {
    bottom: 0,
    left: `calc(-1 * ${itemOffsetVar} + ${indicatorSizeVar} / 2 - 1px)`,
    top: `calc(${indicatorSizeVar} + 0.25rem)`,
    width: '2px',
  },
})

export { connectorSeparatorCompleted as timelineSeparatorCompleted }

// ─── Text ────────────────────────────────────────────────────────────────────

export const timelineHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
})

export const timelineTitle = style({
  fontSize: titleFontSizeVar,
  fontWeight: 500,
  lineHeight: 1.4,
})

export const timelineDate = style({
  color: semanticColorVar('neutral', 'text'),
  fontSize: dateFontSizeVar,
  fontWeight: 500,
  opacity: 0.6,
})

export const timelineContent = style({
  color: semanticColorVar('neutral', 'text'),
  fontSize: contentFontSizeVar,
  opacity: 0.72,
})
