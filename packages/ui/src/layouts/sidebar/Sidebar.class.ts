import { semanticColorKeys, semanticColorVar } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'

export const sidebarGroupAnchorStyles = {
  top: 'sticky top-0 z-10 bg-sidebar',
  bottom: 'mt-auto sticky bottom-0 z-10 bg-sidebar',
} as const

export const sidebarMenuButtonVariantStyles = {
  default: '',
  outline: 'bg-sidebar shadow-[0_0_0_1px_var(--sidebar-border)]',
} as const

const variantBgToken = {
  surface: 'surface',
  solid: 'solid',
  soft: 'soft',
} as const

type SidebarVisualVariant = keyof typeof variantBgToken

type SidebarColorVarName =
  | '--sidebar'
  | '--sidebar-foreground'
  | '--sidebar-hover'
  | '--sidebar-hover-foreground'
  | '--sidebar-active'
  | '--sidebar-active-foreground'
  | '--sidebar-border'
  | '--sidebar-ring'

export type SidebarColorVars = Record<SidebarColorVarName, string>

export const sidebarBg = '[background-color:var(--sidebar)]'
export const sidebarForeground = '[color:var(--sidebar-foreground)]'
export const sidebarBorder = '[border-color:var(--sidebar-border)]'
export const sidebarRing = '[--tw-ring-color:var(--sidebar-ring)]'
export const sidebarBorderBackground = '[background-color:var(--sidebar-border)]'
export const sidebarPrimary = '[background-color:var(--sidebar-active)]'
export const sidebarPrimaryForeground = '[color:var(--sidebar-active-foreground)]'
export const sidebarAccent = '[background-color:var(--sidebar-hover)]'
export const sidebarAccentForeground = '[color:var(--sidebar-hover-foreground)]'

function createSidebarColorVars(panelColor: Color, variant: SidebarVisualVariant): SidebarColorVars {
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
    variant === 'solid' ? 'solid' : variant === 'surface' ? 'soft' : 'soft-hover',
  )
  const activeForeground =
    variant === 'solid' ? semanticColorVar(panelColor, 'contrast') : semanticColorVar(panelColor, 'text')
  const ringColor = semanticColorVar(panelColor, 'solid')

  return {
    '--sidebar': panelBackground,
    '--sidebar-foreground': panelForeground,
    '--sidebar-hover': hoverBackground,
    '--sidebar-hover-foreground': hoverForeground,
    '--sidebar-active': activeBackground,
    '--sidebar-active-foreground': activeForeground,
    '--sidebar-border': panelBorder,
    '--sidebar-ring': ringColor,
  }
}

const sidebarColorClassName = `${sidebarBg} ${sidebarForeground} ${sidebarBorder}`

const sidebarVisualVariants: SidebarVisualVariant[] = ['surface', 'solid', 'soft']

// Color-specific values are set via sidebarColorVars; these classes only bind
// the CSS custom properties to background, foreground, and border utilities.
export const sidebarColorStyles = Object.fromEntries(
  sidebarVisualVariants.map(variant => [
    variant,
    Object.fromEntries(semanticColorKeys.map(color => [color, sidebarColorClassName])),
  ]),
) as Record<SidebarVisualVariant, Record<Color, string>>

export const sidebarColorVars = Object.fromEntries(
  sidebarVisualVariants.map(variant => [
    variant,
    Object.fromEntries(semanticColorKeys.map(color => [color, createSidebarColorVars(color as Color, variant)])),
  ]),
) as Record<SidebarVisualVariant, Record<Color, SidebarColorVars>>

const enabledHoverTone =
  '[&:hover:not(:disabled):not([aria-disabled=true])]:[background-color:var(--sidebar-hover)] [&:hover:not(:disabled):not([aria-disabled=true])]:[color:var(--sidebar-hover-foreground)]'
const enabledActiveTone =
  '[&:active:not(:disabled):not([aria-disabled=true])]:[background-color:var(--sidebar-hover)] [&:active:not(:disabled):not([aria-disabled=true])]:[color:var(--sidebar-hover-foreground)]'
const enabledFocusTone =
  '[&:focus-visible:not(:disabled):not([aria-disabled=true])]:[background-color:var(--sidebar-hover)] [&:focus-visible:not(:disabled):not([aria-disabled=true])]:[color:var(--sidebar-hover-foreground)]'
const activeTone =
  'data-[active]:[background-color:var(--sidebar-active)] data-[active]:[color:var(--sidebar-active-foreground)] data-[active=true]:[background-color:var(--sidebar-active)] data-[active=true]:[color:var(--sidebar-active-foreground)] [&[aria-current=page]]:[background-color:var(--sidebar-active)] [&[aria-current=page]]:[color:var(--sidebar-active-foreground)]'

export const sidebarMenuButtonTone = `${sidebarForeground} bg-transparent ${enabledHoverTone} ${enabledActiveTone} ${enabledFocusTone} ${activeTone}`

export const sidebarMenuButtonToneHighlight = `${sidebarForeground} bg-transparent relative z-1 ${enabledHoverTone} ${enabledActiveTone} ${enabledFocusTone} ${activeTone}`

export const sidebarContentSurface = sidebarBg

export const sidebarPanelSurface = 'border-0 shadow-none'

export const sidebarMenuSubFloatingPanel = `${sidebarBg} ${sidebarForeground} ${sidebarBorder}`

export const sidebarGroupedMenuSubPanel = 'top-3 w-64 rounded-xl p-2 [box-shadow:var(--shadow-4)]'

export const sidebarGroupedMenuSubHeader = `mb-2 border-b ${sidebarBorder} rounded-lg p-2 text-xs leading-4 tracking-[0.12em] uppercase ${sidebarForeground} opacity-[0.65]`

export const sidebarGroupedMenuSubHeaderIcon = `${sidebarForeground} opacity-80`

export const sidebarGroupedMenuButton = `${sidebarForeground} opacity-70`

export const sidebarSkeletonTone = 'bg-[var(--sidebar-hover)]'

export const sidebarMenuButtonHasActiveChild = `bg-transparent ${sidebarForeground} font-medium`

export const sidebarMenuSubButtonTone = sidebarMenuButtonTone

export const sidebarMenuSubButtonToneHighlight = sidebarMenuButtonToneHighlight

export const sidebarMenuButtonSizeStyles = {
  default: 'h-8 text-sm leading-5',
  sm: 'h-7 text-xs leading-4',
  lg: 'h-12 text-sm leading-5',
} as const

export const sidebarGroupLabelText = 'text-xs leading-4'

export const sidebarBodyText = 'text-sm leading-5'

export const sidebarMetaText = 'text-xs leading-4'

export const sidebarTitleText = 'text-sm leading-5'

export const sidebarMenuBadgeText = 'text-xs leading-4'

export const sidebarInitialsText = 'text-xs leading-4'

export const sidebarMenuSubButtonSizeStyles = {
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
} as const

export const sidebarClassNames = [
  ...Object.values(sidebarGroupAnchorStyles),
  ...Object.values(sidebarMenuButtonVariantStyles),
  ...Object.values(sidebarColorStyles).flatMap(colorMap => Object.values(colorMap)),
  sidebarBg,
  sidebarForeground,
  sidebarBorder,
  sidebarRing,
  sidebarBorderBackground,
  sidebarPrimary,
  sidebarPrimaryForeground,
  sidebarAccent,
  sidebarAccentForeground,
  sidebarMenuButtonTone,
  sidebarMenuButtonToneHighlight,
  sidebarContentSurface,
  sidebarPanelSurface,
  sidebarMenuSubFloatingPanel,
  sidebarGroupedMenuSubPanel,
  sidebarGroupedMenuSubHeader,
  sidebarGroupedMenuSubHeaderIcon,
  sidebarGroupedMenuButton,
  sidebarSkeletonTone,
  sidebarMenuButtonHasActiveChild,
  sidebarMenuSubButtonTone,
  sidebarMenuSubButtonToneHighlight,
  ...Object.values(sidebarMenuButtonSizeStyles),
  sidebarGroupLabelText,
  sidebarBodyText,
  sidebarMetaText,
  sidebarTitleText,
  sidebarMenuBadgeText,
  sidebarInitialsText,
  ...Object.values(sidebarMenuSubButtonSizeStyles),
]
