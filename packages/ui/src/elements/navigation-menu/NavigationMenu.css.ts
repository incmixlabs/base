import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { menuSizeTokens, space } from '@/theme/token-maps'
import { type Color, designTokens } from '@/theme/tokens'
import { type NavigationMenuSize, navigationMenuSizes } from './navigation-menu.props'

const navigationMenuAccentPrimaryVar = createVar()
const navigationMenuAccentContrastVar = createVar()
const navigationMenuAccentSoftVar = createVar()
const navigationMenuAccentSoftHoverVar = createVar()
const navigationMenuAccentTextVar = createVar()

const navigationMenuRadiusScale: Record<NavigationMenuSize, keyof typeof designTokens.radius> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

const byNavigationMenuSize = <T extends Record<string, string>>(build: (size: NavigationMenuSize) => T) =>
  styleVariants(
    Object.fromEntries(navigationMenuSizes.map(size => [size, build(size)])) as Record<NavigationMenuSize, T>,
  )

export const navigationMenuRootBaseCls = 'relative z-10 flex max-w-full'
export const navigationMenuRootVerticalCls = 'items-start'

export const navigationMenuRootBase = style({
  color: semanticColorVar('neutral', 'text'),
})

export const navigationMenuListBaseCls = 'm-0 flex list-none items-center gap-1 p-1'
export const navigationMenuListVerticalCls = 'flex-col items-stretch'

export const navigationMenuItemBaseCls = 'relative list-none'

export const navigationMenuTriggerBaseCls =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2'

export const navigationMenuTriggerBase = style({
  cursor: 'pointer',
  color: semanticColorVar('neutral', 'text'),
  backgroundColor: 'transparent',
  letterSpacing: '0',
  selectors: {
    '&:hover': {
      backgroundColor: navigationMenuAccentSoftHoverVar,
      color: navigationMenuAccentTextVar,
    },
    '&[data-popup-open]': {
      backgroundColor: navigationMenuAccentSoftVar,
      color: navigationMenuAccentTextVar,
    },
    '&[data-pressed]': {
      transform: 'translateY(1px)',
    },
    '&.af-high-contrast': {
      fontWeight: 600,
    },
  },
})

export const navigationMenuTriggerBySize = byNavigationMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    minHeight: token.height,
    gap: token.gap,
    paddingLeft: token.paddingX,
    paddingRight: token.paddingX,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    borderRadius: designTokens.radius[navigationMenuRadiusScale[size]],
  }
})

export const navigationMenuIconBaseCls = 'inline-flex shrink-0 items-center justify-center transition-transform'

export const navigationMenuIconBase = style({
  selectors: {
    [`${navigationMenuTriggerBase}[data-popup-open] &`]: {
      transform: 'rotate(180deg)',
    },
  },
})

export const navigationMenuIconBySize = byNavigationMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    width: token.iconSize,
    height: token.iconSize,
  }
})

export const navigationMenuContentBaseCls = 'box-border min-w-0'

export const navigationMenuContentBase = style({
  maxHeight: 'var(--available-height)',
  overflow: 'hidden',
  transition:
    'opacity var(--af-motion-fast) var(--af-ease-standard), transform var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      transform: 'translateY(-0.25rem)',
    },
  },
})

export const navigationMenuContentBySize = byNavigationMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    padding: token.paddingY,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
  }
})

export const navigationMenuPositionerBase = style({
  zIndex: 1000,
})

export const navigationMenuPopupBaseCls = 'relative box-border overflow-hidden border outline-none'

export const navigationMenuPopupBase = style({
  minWidth: 'min(100vw - 2rem, 18rem)',
  maxWidth: 'calc(100vw - 2rem)',
  maxHeight: 'var(--available-height)',
  color: semanticColorVar('neutral', 'text'),
  transformOrigin: 'var(--transform-origin)',
  transition:
    'opacity var(--af-motion-fast) var(--af-ease-standard), transform var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      transform: 'scale(0.98)',
    },
  },
})

export const navigationMenuPopupByVariant = styleVariants({
  solid: {
    backgroundColor: designTokens.color.neutral.background,
    borderColor: semanticColorVar('neutral', 'border'),
    boxShadow:
      '0 18px 48px color-mix(in oklch, black 16%, transparent), 0 4px 16px color-mix(in oklch, black 10%, transparent)',
  },
  soft: {
    backgroundColor: semanticColorVar('neutral', 'surface'),
    borderColor: semanticColorVar('neutral', 'border-subtle'),
    backdropFilter: 'saturate(140%) blur(10px)',
    boxShadow:
      'inset 0 1px 0 var(--color-panel-highlight), 0 18px 48px color-mix(in oklch, black 12%, transparent), 0 4px 16px color-mix(in oklch, black 8%, transparent)',
  },
})

export const navigationMenuPopupHighContrast = style({
  borderColor: semanticColorVar('neutral', 'text'),
})

export const navigationMenuViewportBaseCls = 'box-border overflow-auto'

export const navigationMenuViewportBase = style({
  width: 'max-content',
  minWidth: '100%',
  maxWidth: 'calc(100vw - 2rem)',
  maxHeight: 'var(--available-height)',
})

export const navigationMenuLinkBaseCls =
  'group flex min-w-0 gap-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2'

export const navigationMenuLinkBase = style({
  color: semanticColorVar('neutral', 'text'),
  textDecoration: 'none',
  letterSpacing: '0',
  selectors: {
    '&:hover': {
      backgroundColor: navigationMenuAccentSoftHoverVar,
      color: navigationMenuAccentTextVar,
    },
    '&[data-active]': {
      backgroundColor: navigationMenuAccentSoftVar,
      color: navigationMenuAccentTextVar,
    },
    '&[data-active].af-high-contrast': {
      boxShadow: `inset 0 0 0 1px ${navigationMenuAccentPrimaryVar}`,
    },
  },
})

export const navigationMenuLinkBySize = byNavigationMenuSize(size => {
  const token = menuSizeTokens[size]
  return {
    padding: token.paddingX,
    borderRadius: designTokens.radius[navigationMenuRadiusScale[size]],
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
  }
})

export const navigationMenuLinkIconBaseCls = 'mt-0.5 inline-flex shrink-0 items-center justify-center'

export const navigationMenuLinkTitleBase = style({
  fontWeight: 600,
  color: 'currentColor',
})

export const navigationMenuLinkDescriptionBase = style({
  marginTop: space['1'],
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 72%, transparent)`,
})

export const navigationMenuLinkDescriptionBySize = byNavigationMenuSize(size => {
  const token = size === 'lg' ? menuSizeTokens.md : menuSizeTokens.sm
  return {
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
  }
})

export const navigationMenuArrowByVariant = styleVariants({
  solid: {
    fill: designTokens.color.neutral.background,
    color: semanticColorVar('neutral', 'border'),
  },
  soft: {
    fill: semanticColorVar('neutral', 'surface'),
    color: semanticColorVar('neutral', 'border-subtle'),
  },
})

export const navigationMenuBackdropBase = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'color-mix(in oklch, black 8%, transparent)',
  backdropFilter: 'blur(1px)',
})

export const navigationMenuColor: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        [navigationMenuAccentPrimaryVar]: semanticColorVar(color, 'primary'),
        [navigationMenuAccentContrastVar]: semanticColorVar(color, 'contrast'),
        [navigationMenuAccentSoftVar]: semanticColorVar(color, 'soft'),
        [navigationMenuAccentSoftHoverVar]: semanticColorVar(color, 'soft-hover'),
        [navigationMenuAccentTextVar]: semanticColorVar(color, 'text'),
      },
    }),
  ]),
) as Record<Color, string>
