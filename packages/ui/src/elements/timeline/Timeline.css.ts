import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { connectorIndicatorBase, connectorSeparatorColor } from '@/shared/connector.css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { timelineSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'

// ─── CSS Variables (set on root, cascaded to children) ───────────────────────

export const indicatorSizeVar = createVar()
export const itemOffsetVar = createVar()
const activeIndicatorBgVar = createVar()
const activeIndicatorBorderVar = createVar()
const activeIndicatorColorVar = createVar()
const activeSeparatorColorVar = createVar()
export const timelineItemGapVar = createVar()
const itemPaddingInlineEndVar = createVar()
const itemPaddingBlockEndVar = createVar()

// ─── Size tokens (applied to root) ──────────────────────────────────────────

export const timelineSizeVars = styleVariants({
  xs: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('xs', 'indicatorSize', '0.75rem'),
      [itemOffsetVar]: timelineSizeVar('xs', 'itemOffset', '1.75rem'),
      [timelineItemGapVar]: timelineSizeVar('xs', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('xs', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('xs', 'itemPaddingBlockEnd', '1.5rem'),
    },
  },
  sm: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('sm', 'indicatorSize', '1rem'),
      [itemOffsetVar]: timelineSizeVar('sm', 'itemOffset', '2rem'),
      [timelineItemGapVar]: timelineSizeVar('sm', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('sm', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('sm', 'itemPaddingBlockEnd', '1.5rem'),
    },
  },
  md: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('md', 'indicatorSize', '1.125rem'),
      [itemOffsetVar]: timelineSizeVar('md', 'itemOffset', '2.25rem'),
      [timelineItemGapVar]: timelineSizeVar('md', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('md', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('md', 'itemPaddingBlockEnd', '1.5rem'),
    },
  },
  lg: {
    vars: {
      [indicatorSizeVar]: timelineSizeVar('lg', 'indicatorSize', '1.25rem'),
      [itemOffsetVar]: timelineSizeVar('lg', 'itemOffset', '2.5rem'),
      [timelineItemGapVar]: timelineSizeVar('lg', 'itemGap', '0.25rem'),
      [itemPaddingInlineEndVar]: timelineSizeVar('lg', 'itemPaddingInlineEnd', '2rem'),
      [itemPaddingBlockEndVar]: timelineSizeVar('lg', 'itemPaddingBlockEnd', '1.5rem'),
    },
  },
})

export const timelineColorVars: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        [activeIndicatorBorderVar]: semanticColorVar(color, 'primary'),
        [activeIndicatorBgVar]: semanticColorVar(color, 'primary'),
        [activeIndicatorColorVar]: semanticColorVar(color, 'contrast'),
        [activeSeparatorColorVar]: semanticColorVar(color, 'primary'),
      },
    }),
  ]),
) as Record<Color, string>

// ─── Root ────────────────────────────────────────────────────────────────────

export const timelineRoot = styleVariants({
  horizontal: { display: 'flex', flexDirection: 'row', width: '100%' },
  vertical: { display: 'flex', flexDirection: 'column' },
})

// ─── Item ────────────────────────────────────────────────────────────────────

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
    color: semanticColorVar('neutral', 'text'),
    height: indicatorSizeVar,
    position: 'absolute',
    transition: 'border-color 150ms ease, background-color 150ms ease, color 150ms ease',
    width: indicatorSizeVar,
  },
])

export const timelineIndicatorVariant = styleVariants({
  solid: {
    selectors: {
      '&[data-state="completed"]': {
        backgroundColor: activeIndicatorBgVar,
        borderColor: activeIndicatorBorderVar,
        color: activeIndicatorColorVar,
      },
      '&[data-state="active"]': {
        backgroundColor: activeIndicatorBgVar,
        borderColor: activeIndicatorBorderVar,
        color: activeIndicatorColorVar,
      },
    },
  },
  outline: {
    selectors: {
      '&[data-state="completed"]': {
        backgroundColor: 'transparent',
        borderColor: activeIndicatorBorderVar,
        color: activeIndicatorBorderVar,
      },
      '&[data-state="active"]': {
        backgroundColor: 'transparent',
        borderColor: activeIndicatorBorderVar,
        color: activeIndicatorBorderVar,
      },
    },
  },
})

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
    top: `calc(-1 * ${itemOffsetVar} + ${indicatorSizeVar} - 1px)`,
  },
  vertical: {
    bottom: 0,
    left: `calc(-1 * ${itemOffsetVar} + ${indicatorSizeVar} - 1px)`,
    top: `calc(${indicatorSizeVar} + 0.25rem)`,
    width: '2px',
  },
})

export const timelineSeparatorCompleted = style({
  backgroundColor: activeSeparatorColorVar,
})
