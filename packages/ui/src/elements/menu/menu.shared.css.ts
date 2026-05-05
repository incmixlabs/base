import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { menuSizeTokens, space } from '@/theme/token-maps'
import { type Color, designTokens } from '@/theme/tokens'
import { contentSizes, type MenuSize } from './menu.props'

// ---------------------------------------------------------------------------
// Color vars — kept because they are set per-color dynamically (menuItemColor)
// and consumed by variant selectors (menuItemByVariant).
// ---------------------------------------------------------------------------
const menuItemSolidBgVar = createVar()
const menuItemSolidColorVar = createVar()
const menuItemSoftBgVar = createVar()
const menuItemSoftBgHoverVar = createVar()
const menuSubtriggerIconColorVar = createVar()

// ---------------------------------------------------------------------------
// Tailwind utility class constants
// ---------------------------------------------------------------------------
export const menuPopupBaseCls = 'z-50 flex flex-col overflow-hidden box-border outline-none'
export const menuPopupOverflowVisibleCls = 'overflow-visible'

export const menuViewportBaseCls = 'flex flex-1 flex-col overflow-auto box-border'

export const menuItemBaseCls = 'relative flex items-center box-border outline-none select-none'

export const menuIndicatorBaseCls = 'absolute left-0 inline-flex items-center justify-center'

export const menuShortcutBaseCls = 'ml-auto flex items-center'

export const menuLabelBaseCls = 'flex items-center box-border select-none cursor-default'

const menuRadiusScale: Record<MenuSize, keyof typeof designTokens.radius> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
}

const byMenuSize = <T extends Record<string, string>>(build: (size: MenuSize) => T) =>
  styleVariants(Object.fromEntries(contentSizes.map(size => [size, build(size)])) as Record<MenuSize, T>)

// ---------------------------------------------------------------------------
// Content (popup wrapper) — size-independent base + per-size variant
// ---------------------------------------------------------------------------

// TODO(ve-card): Replace menu shadow with shared Card panel depth once Card is migrated to vanilla-extract.
export const menuContentBase = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  color: semanticColorVar('neutral', 'text'),
  minWidth: '12rem',
  maxWidth: '22rem',
})

export const menuContentByVariant = styleVariants({
  solid: {
    backgroundColor: designTokens.color.neutral.background,
    backdropFilter: 'none',
    // TODO(ve-card): Replace menu shadow with shared Card panel depth once Card is migrated to vanilla-extract.
    boxShadow:
      '0 10px 30px color-mix(in oklch, black 14%, transparent), 0 2px 10px color-mix(in oklch, black 8%, transparent)',
  },
  soft: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    backdropFilter: 'saturate(140%) blur(10px)',
    boxShadow:
      'inset 0 1px 0 var(--color-panel-highlight), 0 10px 30px color-mix(in oklch, black 10%, transparent), 0 2px 10px color-mix(in oklch, black 6%, transparent)',
  },
})

export const menuContentBySize = byMenuSize(size => ({
  borderRadius: designTokens.radius[menuRadiusScale[size]],
}))

// ---------------------------------------------------------------------------
// Viewport (scrollable area inside popup) — per-size padding
// ---------------------------------------------------------------------------

export const menuViewportBase = style({
  minWidth: '100%',
})

export const menuViewportBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return { padding: token.paddingY }
})

// ---------------------------------------------------------------------------
// Item — size-independent base + per-size variant
// ---------------------------------------------------------------------------

export const menuItemBase = style({
  gap: space['2'],
  cursor: 'var(--cursor-menu-item, pointer)',
  color: semanticColorVar('neutral', 'text'),
  selectors: {
    '&[data-disabled]': {
      cursor: 'default',
      color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 45%, transparent)`,
      pointerEvents: 'none',
    },
  },
})

export const menuItemBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    height: token.height,
    paddingLeft: token.paddingX,
    paddingRight: token.paddingX,
    scrollMargin: `${token.paddingY} 0`,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: '0',
    borderRadius: designTokens.radius[menuRadiusScale[size]],
  }
})

// ---------------------------------------------------------------------------
// Item text style modifiers (size-independent)
// ---------------------------------------------------------------------------

export const menuItemTextBold = style({ fontWeight: 600 })
export const menuItemTextItalic = style({ fontStyle: 'italic' })
export const menuItemTextStrikethrough = style({ textDecorationLine: 'line-through' })

// ---------------------------------------------------------------------------
// Item motion (size-independent)
// ---------------------------------------------------------------------------

export const menuItemMotion = style({
  transition:
    'background-color var(--af-motion-fast) var(--af-ease-standard), color var(--af-motion-fast) var(--af-ease-standard)',
})

// ---------------------------------------------------------------------------
// SubTrigger icon — per-size width/height
// ---------------------------------------------------------------------------

export const menuSubTriggerIconCls = 'ml-auto mr-0 opacity-80 shrink-0'

export const menuSubTriggerIcon = style({
  color: menuSubtriggerIconColorVar,
})

export const menuIconBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return { width: token.iconSize, height: token.iconSize }
})

// ---------------------------------------------------------------------------
// Item variant (solid / soft) — color-var driven, size-independent
// ---------------------------------------------------------------------------

export const menuItemByVariant = styleVariants({
  solid: {
    vars: {
      [menuSubtriggerIconColorVar]: menuItemSolidColorVar,
    },
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: menuItemSolidBgVar,
        color: menuItemSolidColorVar,
      },
      '&[data-state="open"]': {
        backgroundColor: menuItemSoftBgHoverVar,
        color: menuItemSolidColorVar,
      },
    },
  },
  soft: {
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: menuItemSoftBgHoverVar,
      },
      '&[data-state="open"]': {
        backgroundColor: menuItemSoftBgVar,
        color: semanticColorVar('neutral', 'text'),
      },
    },
  },
})

export const menuItemByVariantHighlight = styleVariants({
  solid: {
    vars: {
      [menuSubtriggerIconColorVar]: menuItemSolidColorVar,
    },
    position: 'relative',
    zIndex: 1,
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: 'transparent',
        color: menuItemSolidColorVar,
      },
      '&[data-state="open"]': {
        backgroundColor: menuItemSoftBgHoverVar,
        color: menuItemSolidColorVar,
      },
    },
  },
  soft: {
    position: 'relative',
    zIndex: 1,
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: 'transparent',
      },
      '&[data-state="open"]': {
        backgroundColor: menuItemSoftBgVar,
        color: semanticColorVar('neutral', 'text'),
      },
    },
  },
})

export const menuHighlightBgByVariant = styleVariants({
  solid: {
    vars: {
      '--menu-highlight-bg': menuItemSolidBgVar,
    } as Record<string, string>,
  },
  soft: {
    vars: {
      '--menu-highlight-bg': menuItemSoftBgHoverVar,
    } as Record<string, string>,
  },
})

// ---------------------------------------------------------------------------
// Indicator (checkbox / radio) — per-size paddingLeft + indicator width
// ---------------------------------------------------------------------------

export const menuItemWithIndicatorBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return { paddingLeft: token.paddingX }
})

export const menuItemIndicatorBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return { width: token.paddingX }
})

// ---------------------------------------------------------------------------
// Shortcut — per-size fontSize
// ---------------------------------------------------------------------------

export const menuShortcutBase = style({
  paddingLeft: space['4'],
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 70%, transparent)`,
  selectors: {
    [`${menuItemBase}[data-disabled] &`]: {
      color: 'inherit',
    },
    [`${menuItemBase}[data-highlighted] &`]: {
      color: 'inherit',
    },
    [`${menuItemBase}[data-state="open"] &`]: {
      color: 'inherit',
    },
  },
})

export const menuShortcutBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return { fontSize: token.fontSize }
})

// ---------------------------------------------------------------------------
// Label — per-size height, padding, font
// ---------------------------------------------------------------------------

export const menuLabelBase = style({
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 82%, transparent)`,
  selectors: {
    [`${menuItemBase} + &`]: {
      marginTop: space['2'],
    },
  },
})

export const menuLabelBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    minHeight: token.height,
    paddingLeft: token.paddingX,
    paddingRight: token.paddingX,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: '0',
  }
})

// ---------------------------------------------------------------------------
// Separator — per-size horizontal margins
// ---------------------------------------------------------------------------

export const menuSeparatorBase = style({
  height: 0,
  flexShrink: 0,
  marginTop: space['2'],
  marginBottom: space['2'],
  borderTop: `1px solid ${semanticColorVar('neutral', 'border')}`,
  alignSelf: 'stretch',
})

export const menuSeparatorBySize = byMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    marginLeft: token.paddingX,
    marginRight: token.paddingX,
  }
})

// ---------------------------------------------------------------------------
// Per-color styling (sets the 5 color vars consumed by menuItemByVariant)
// ---------------------------------------------------------------------------

export const menuItemColor: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      color: semanticColorVar(color, 'text'),
      vars: {
        [menuItemSolidBgVar]: semanticColorVar(color, 'primary'),
        [menuItemSolidColorVar]: semanticColorVar(color, 'contrast'),
        [menuItemSoftBgVar]: semanticColorVar(color, 'soft'),
        [menuItemSoftBgHoverVar]: semanticColorVar(color, 'soft-hover'),
        [menuSubtriggerIconColorVar]: 'currentColor',
      },
    }),
  ]),
) as Record<Color, string>

// ── Motion variants ──

export const menuPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const menuPanelTransition: Transition = { type: 'spring', stiffness: 500, damping: 30 }
