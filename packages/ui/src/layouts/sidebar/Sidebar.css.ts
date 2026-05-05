import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

export const sidebarGroupAnchorStyles = styleVariants({
  top: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'var(--sidebar)',
  },
  bottom: {
    marginTop: 'auto',
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'var(--sidebar)',
  },
})

export const sidebarMenuButtonVariantStyles = styleVariants({
  default: {},
  outline: {
    backgroundColor: 'var(--sidebar)',
    boxShadow: '0 0 0 1px var(--sidebar-border)',
  },
})

/** Map sidebar variant → the semantic token Surface uses for its background */
const variantBgToken = {
  surface: 'surface',
  solid: 'primary',
  soft: 'soft',
} as const

type SidebarVisualVariant = keyof typeof variantBgToken

function createSidebarColorStyle(panelColor: Color, variant: SidebarVisualVariant) {
  const panelBackground = semanticColorVar(panelColor, variantBgToken[variant])
  const panelForeground =
    variant === 'surface'
      ? semanticColorVar('neutral', 'text')
      : semanticColorVar(panelColor, variant === 'solid' ? 'contrast' : 'text')
  const panelBorder = semanticColorVar(panelColor, 'border')
  const hoverBackground = semanticColorVar(
    panelColor,
    variant === 'surface' ? 'surface-hover' : variant === 'solid' ? 'soft' : 'soft-hover',
  )
  const hoverForeground =
    variant === 'surface' ? semanticColorVar('neutral', 'text') : semanticColorVar(panelColor, 'text')
  const activeBackground = semanticColorVar(
    panelColor,
    variant === 'solid' ? 'primary' : variant === 'surface' ? 'surface-hover' : 'soft-hover',
  )
  const activeForeground =
    variant === 'solid' ? semanticColorVar(panelColor, 'contrast') : semanticColorVar('neutral', 'text')
  const ringColor = semanticColorVar(panelColor, 'primary')

  return style({
    vars: {
      '--sidebar': panelBackground,
      '--sidebar-foreground': panelForeground,
      '--sidebar-hover': hoverBackground,
      '--sidebar-hover-foreground': hoverForeground,
      '--sidebar-active': activeBackground,
      '--sidebar-active-foreground': activeForeground,
      '--sidebar-border': panelBorder,
      '--sidebar-ring': ringColor,
    } as Record<string, string>,
    backgroundColor: 'var(--sidebar)',
    color: 'var(--sidebar-foreground)',
    borderColor: 'var(--sidebar-border)',
  })
}

const sidebarVisualVariants: SidebarVisualVariant[] = ['surface', 'solid', 'soft']

export const sidebarColorStyles = Object.fromEntries(
  sidebarVisualVariants.map(variant => [
    variant,
    Object.fromEntries(semanticColorKeys.map(color => [color, createSidebarColorStyle(color as Color, variant)])),
  ]),
) as Record<SidebarVisualVariant, Record<Color, string>>

const interactiveToneSelectors = {
  '&:hover:not(:disabled):not([aria-disabled=true])': {
    backgroundColor: 'var(--sidebar-hover)',
    color: 'var(--sidebar-hover-foreground)',
  },
  '&:active:not(:disabled):not([aria-disabled=true])': {
    backgroundColor: 'var(--sidebar-hover)',
    color: 'var(--sidebar-hover-foreground)',
  },
  '&[data-active], &[data-active=true], &[data-active="true"], &[aria-current=page]': {
    backgroundColor: 'var(--sidebar-active)',
    color: 'var(--sidebar-active-foreground)',
  },
}

export const sidebarMenuButtonTone = style({
  color: 'var(--sidebar-foreground)',
  backgroundColor: 'transparent',
  selectors: interactiveToneSelectors,
})

const interactiveToneHighlightSelectors = {
  '&:is(:hover, :focus-visible, :active):not(:disabled):not([aria-disabled=true])': {
    color: 'var(--sidebar-hover-foreground)',
  },
  '&[data-active], &[data-active=true], &[data-active="true"], &[aria-current=page]': {
    backgroundColor: 'var(--sidebar-active)',
    color: 'var(--sidebar-active-foreground)',
  },
}

export const sidebarMenuButtonToneHighlight = style({
  color: 'var(--sidebar-foreground)',
  backgroundColor: 'transparent',
  position: 'relative',
  zIndex: 1,
  selectors: interactiveToneHighlightSelectors,
})

export const sidebarContentSurface = style({
  backgroundColor: 'var(--sidebar)',
})

export const sidebarPanelSurface = style({
  borderWidth: 0,
  boxShadow: 'none',
})

export const sidebarMenuSubFloatingPanel = style({
  backgroundColor: 'var(--sidebar)',
  borderColor: 'var(--sidebar-border)',
})

export const sidebarGroupedMenuSubPanel = style({
  top: '0.75rem',
  width: '16rem',
  borderRadius: '0.75rem',
  padding: '0.5rem',
  boxShadow:
    '0 24px 48px -12px color-mix(in srgb, var(--sidebar-foreground) 18%, transparent), 0 8px 18px -8px color-mix(in srgb, var(--sidebar-foreground) 12%, transparent)',
})

export const sidebarGroupedMenuSubHeader = style({
  marginBottom: '0.5rem',
  borderBottom: '1px solid var(--sidebar-border)',
  borderRadius: '0.5rem',
  padding: '0.5rem',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'color-mix(in srgb, var(--sidebar-foreground) 65%, transparent)',
})

export const sidebarGroupedMenuSubHeaderIcon = style({
  color: 'color-mix(in srgb, var(--sidebar-foreground) 80%, transparent)',
})

export const sidebarGroupedMenuButton = style({
  color: 'color-mix(in srgb, var(--sidebar-foreground) 70%, transparent)',
})

export const sidebarSkeletonTone = style({
  backgroundColor: 'var(--sidebar-hover)',
})

export const sidebarMenuButtonHasActiveChild = style({
  backgroundColor: 'transparent',
  color: 'var(--sidebar-foreground)',
  fontWeight: 500,
})

export const sidebarMenuSubButtonTone = style({
  color: 'var(--sidebar-foreground)',
  backgroundColor: 'transparent',
  selectors: interactiveToneSelectors,
})

export const sidebarMenuSubButtonToneHighlight = style({
  color: 'var(--sidebar-foreground)',
  backgroundColor: 'transparent',
  position: 'relative',
  zIndex: 1,
  selectors: interactiveToneHighlightSelectors,
})

export const sidebarMenuButtonSizeStyles = styleVariants({
  default: {
    height: '2rem',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  },
  sm: {
    height: '1.75rem',
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--line-height-xs)',
  },
  lg: {
    height: '3rem',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  },
})

export const sidebarGroupLabelText = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
})

export const sidebarBodyText = style({
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
})

export const sidebarMetaText = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
})

export const sidebarTitleText = style({
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
})

export const sidebarMenuBadgeText = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
})

export const sidebarInitialsText = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
})

export const sidebarMenuSubButtonSizeStyles = styleVariants({
  sm: {
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--line-height-xs)',
  },
  md: {
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-sm)',
  },
})
