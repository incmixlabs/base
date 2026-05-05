'use client'

import {
  isValidFontWeightDescriptor,
  type ThemeFontDisplay,
  type ThemeFontFileFormat,
  type ThemeFontSource,
  type ThemeFontSourceMap,
  TYPOGRAPHY_DEFAULTS,
  TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT,
  TYPOGRAPHY_RESPONSIVE_PROFILES,
  type TypographyResponsiveProfile,
} from '@incmix/theme'
import { createStore, useSelector } from '@xstate/store-react'
import * as React from 'react'
import type { AvatarVariant } from '@/elements/avatar/Avatar'
import { AvatarProvider } from '@/elements/avatar/avatar.context'
import { ThemeRadiusProvider } from '@/elements/utils'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'
import type { SidebarVariant } from '@/layouts/sidebar/sidebar.props'
import { cn } from '@/lib/utils'
import { escapeCssString, extractPrimaryFontFamily } from '@/utils/strings'
import { getMatchingGrayColor } from './helpers/get-matching-gray-color'
import { MotionProvider } from './MotionProvider'
import { buildThemeResponsiveProfileVars } from './profile-vars'
import { getThemeRadiusValue } from './radius-utils'
import { buildRuntimePaletteVars } from './runtime-palette-vars'
import { buildSemanticLaneVars } from './semantic-lane-vars'
import { useOptionalThemeVarsContext } from './ThemeVarsProvider'
import { normalizeThemeBreakpoints, type ThemeBreakpointConfig, type ThemeBreakpoints } from './theme-breakpoints'
import { defaultThemeConfig } from './theme-config'
import { normalizeThemeDashboardColumns, normalizeThemeDashboardGap, type ThemeDashboard } from './theme-dashboard'
import { RootThemePortalContainerContext, ThemeContext, ThemePortalContainerContext } from './theme-provider.context'
import {
  type AccentColor,
  type Appearance,
  type Color,
  type GrayColor,
  type Radius,
  type Scaling,
  SEMANTIC_COLOR_DEFAULTS,
  type SemanticHue,
  type SemanticLane,
  THEME_COLOR_VARIANT_DEFAULTS,
  typographyBreakpoints,
} from './tokens'

// ============================================================================
// Theme Types
// ============================================================================

export type PanelBackground = 'solid' | 'translucent'

export type { AvatarVariant } from '@/elements/avatar/Avatar'
export type { ThemeBreakpointConfig, ThemeBreakpoints } from './theme-breakpoints'
export type { ThemeDashboard } from './theme-dashboard'

export interface ThemeLocale {
  locale: string
  language: string
  country?: string
  timezone: string
}

export interface ThemeCalendar {
  radius: Radius
  locale?: string
  timezone?: string
  navButtonBordered?: boolean
}

// ============================================================================
// Theme Context
// ============================================================================

export interface ThemeProviderContextValue {
  appearance: Appearance
  resolvedAppearance: 'light' | 'dark'
  accentColor: AccentColor
  grayColor: GrayColor
  resolvedGrayColor: GrayColor
  radius: Radius
  locale: ThemeLocale
  calendar: ThemeCalendar
  breakpoints: ThemeBreakpoints
  dashboard: ThemeDashboard
  scaling: Scaling
  panelBackground: PanelBackground
  avatarVariant: AvatarVariant
  avatarRadius: Radius
  sidebarColor: Color
  sidebarVariant: SidebarVariant
  contentBodyColor: Color
  contentBodyVariant: SidebarVariant
  semanticColors: Record<SemanticLane, SemanticHue>
  typography: {
    fontSans: string
    fontSerif: string
    fontMono: string
    letterSpacing: string
    responsiveProfile: TypographyResponsiveProfile
    fontSources: ThemeFontSourceMap
  }
  hasBackground: boolean
  onAppearanceChange: (appearance: Appearance) => void
  onAccentColorChange: (accentColor: AccentColor) => void
  onGrayColorChange: (grayColor: GrayColor) => void
  onRadiusChange: (radius: Radius) => void
  onLocaleChange: (locale: Partial<ThemeLocale>) => void
  onCalendarChange: (calendar: Partial<ThemeCalendar>) => void
  onScalingChange: (scaling: Scaling) => void
  onPanelBackgroundChange: (panelBackground: PanelBackground) => void
  onAvatarVariantChange: (mode: AvatarVariant) => void
  onAvatarRadiusChange: (radius: Radius) => void
  onSidebarColorChange: (color: Color) => void
  onSidebarVariantChange: (variant: SidebarVariant) => void
  onContentBodyColorChange: (color: Color) => void
  onContentBodyVariantChange: (variant: SidebarVariant) => void
  onSemanticColorChange: (lane: SemanticLane, color: SemanticHue) => void
  onTypographyChange: (value: Partial<ThemeProviderContextValue['typography']>) => void
}

export interface ThemeProviderConfigPatch {
  accentColor?: AccentColor
  grayColor?: GrayColor
  radius?: Radius
  scaling?: Scaling
  panelBackground?: PanelBackground
  avatarVariant?: AvatarVariant
  avatarRadius?: Radius
  sidebarColor?: Color
  sidebarVariant?: SidebarVariant
  contentBodyColor?: Color
  contentBodyVariant?: SidebarVariant
  breakpoints?: ThemeBreakpoints
  dashboard?: ThemeDashboard
  typography?: ThemeProviderContextValue['typography']
}

type ThemeStoreContext = {
  appearance: Appearance
  accentColor: AccentColor
  grayColor: GrayColor
  radius: Radius
  locale: ThemeLocale
  calendarOverrides: Partial<ThemeCalendar>
  scaling: Scaling
  panelBackground: PanelBackground
  avatarVariant: AvatarVariant
  avatarRadius: Radius
  sidebarColor: Color
  sidebarVariant: SidebarVariant
  contentBodyColor: Color
  contentBodyVariant: SidebarVariant
  semanticColors: Record<SemanticLane, SemanticHue>
  typography: ThemeProviderContextValue['typography']
  resolvedAppearance: 'light' | 'dark'
}

function createThemeStore(initialContext: ThemeStoreContext) {
  return createStore({
    context: initialContext,
    on: {
      setAppearance: (context, event: { value: Appearance }) => ({ ...context, appearance: event.value }),
      setAccentColor: (context, event: { value: AccentColor }) => ({ ...context, accentColor: event.value }),
      setGrayColor: (context, event: { value: GrayColor }) => ({ ...context, grayColor: event.value }),
      setRadius: (context, event: { value: Radius }) => ({ ...context, radius: event.value }),
      setLocale: (context, event: { value: ThemeLocale }) => ({ ...context, locale: event.value }),
      patchLocale: (context, event: { value: Partial<ThemeLocale> }) => ({
        ...context,
        locale: getResolvedLocale({ ...context.locale, ...event.value }),
      }),
      setCalendarOverrides: (context, event: { value: Partial<ThemeCalendar> }) => ({
        ...context,
        calendarOverrides: event.value,
      }),
      patchCalendarOverrides: (context, event: { value: Partial<ThemeCalendar> }) => ({
        ...context,
        calendarOverrides: { ...context.calendarOverrides, ...event.value },
      }),
      setScaling: (context, event: { value: Scaling }) => ({ ...context, scaling: event.value }),
      setPanelBackground: (context, event: { value: PanelBackground }) => ({
        ...context,
        panelBackground: event.value,
      }),
      setAvatarVariant: (context, event: { value: AvatarVariant }) => ({ ...context, avatarVariant: event.value }),
      setAvatarRadius: (context, event: { value: Radius }) => ({ ...context, avatarRadius: event.value }),
      setSidebarColor: (context, event: { value: Color }) => ({ ...context, sidebarColor: event.value }),
      setSidebarVariant: (context, event: { value: SidebarVariant }) => ({ ...context, sidebarVariant: event.value }),
      setContentBodyColor: (context, event: { value: Color }) => ({ ...context, contentBodyColor: event.value }),
      setContentBodyVariant: (context, event: { value: SidebarVariant }) => ({
        ...context,
        contentBodyVariant: event.value,
      }),
      setSemanticColor: (context, event: { lane: SemanticLane; color: SemanticHue }) => ({
        ...context,
        semanticColors: { ...context.semanticColors, [event.lane]: event.color },
      }),
      setTypography: (context, event: { value: ThemeProviderContextValue['typography'] }) => ({
        ...context,
        typography: event.value,
      }),
      patchTypography: (context, event: { value: Partial<ThemeProviderContextValue['typography']> }) => ({
        ...context,
        typography: getResolvedTypography(mergeTypography(context.typography, event.value)),
      }),
      setResolvedAppearance: (context, event: { value: 'light' | 'dark' }) => ({
        ...context,
        resolvedAppearance: event.value,
      }),
    },
  })
}

function getInitialResolvedAppearance(appearance: Appearance | undefined): 'light' | 'dark' {
  if (appearance === 'dark') return 'dark'
  if (appearance === 'light') return 'light'

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

function getSurfaceVariantVars(prefix: string, color: Color, variant: SidebarVariant): Record<string, string> {
  if (variant === 'solid') {
    return {
      [`--component-${prefix}-background`]: `var(--color-${color}-primary)`,
      [`--component-${prefix}-foreground`]: `var(--color-${color}-contrast)`,
      [`--component-${prefix}-border-color`]: `var(--color-${color}-primary)`,
    }
  }

  if (variant === 'soft') {
    return {
      [`--component-${prefix}-background`]: `var(--color-${color}-soft)`,
      [`--component-${prefix}-foreground`]: `var(--color-${color}-text)`,
      [`--component-${prefix}-border-color`]: 'transparent',
    }
  }

  return {
    [`--component-${prefix}-background`]: `var(--color-${color}-surface)`,
    [`--component-${prefix}-foreground`]: `var(--color-${color}-text)`,
    [`--component-${prefix}-border-color`]: `var(--color-${color}-border)`,
  }
}

const selectThemeStoreAppearance = (snapshot: { context: ThemeStoreContext }) => snapshot.context.appearance
const selectThemeStoreAccentColor = (snapshot: { context: ThemeStoreContext }) => snapshot.context.accentColor
const selectThemeStoreGrayColor = (snapshot: { context: ThemeStoreContext }) => snapshot.context.grayColor
const selectThemeStoreRadius = (snapshot: { context: ThemeStoreContext }) => snapshot.context.radius
const selectThemeStoreLocale = (snapshot: { context: ThemeStoreContext }) => snapshot.context.locale
const selectThemeStoreTypography = (snapshot: { context: ThemeStoreContext }) => snapshot.context.typography
const selectThemeStoreScaling = (snapshot: { context: ThemeStoreContext }) => snapshot.context.scaling
const selectThemeStorePanelBackground = (snapshot: { context: ThemeStoreContext }) => snapshot.context.panelBackground
const selectThemeStoreAvatarVariant = (snapshot: { context: ThemeStoreContext }) => snapshot.context.avatarVariant
const selectThemeStoreAvatarRadius = (snapshot: { context: ThemeStoreContext }) => snapshot.context.avatarRadius
const selectThemeStoreSidebarColor = (snapshot: { context: ThemeStoreContext }) => snapshot.context.sidebarColor
const selectThemeStoreSidebarVariant = (snapshot: { context: ThemeStoreContext }) => snapshot.context.sidebarVariant
const selectThemeStoreContentBodyColor = (snapshot: { context: ThemeStoreContext }) => snapshot.context.contentBodyColor
const selectThemeStoreContentBodyVariant = (snapshot: { context: ThemeStoreContext }) =>
  snapshot.context.contentBodyVariant
const selectThemeStoreCalendarOverrides = (snapshot: { context: ThemeStoreContext }) =>
  snapshot.context.calendarOverrides
const selectThemeStoreSemanticColors = (snapshot: { context: ThemeStoreContext }) => snapshot.context.semanticColors
const selectThemeStoreResolvedAppearance = (snapshot: { context: ThemeStoreContext }) =>
  snapshot.context.resolvedAppearance

// ============================================================================
// Theme Props
// ============================================================================

export interface ThemeProviderProps {
  /** Visual appearance mode */
  appearance?: Appearance
  /** Accent color for interactive elements */
  accentColor?: AccentColor
  /** Gray color palette */
  grayColor?: GrayColor
  /** Border radius scale */
  radius?: Radius
  /** Global locale metadata used by date/time-aware components */
  locale?: Partial<ThemeLocale>
  /** Calendar-specific defaults */
  calendar?: Partial<ThemeCalendar>
  /** Global responsive breakpoints in px */
  breakpoints?: ThemeBreakpointConfig
  /** Dashboard layout defaults */
  dashboard?: Partial<ThemeDashboard>
  /** Typography defaults and responsive profile */
  typography?: Partial<ThemeProviderContextValue['typography']>
  /** UI scaling factor */
  scaling?: Scaling
  /** Panel background style */
  panelBackground?: PanelBackground
  /** Avatar default color mode */
  avatarVariant?: AvatarVariant
  /** Avatar default radius */
  avatarRadius?: Radius
  /** Whether to render a background */
  hasBackground?: boolean
  /** Sidebar color token for app shells */
  sidebarColor?: Color
  /** Sidebar surface variant for app shells */
  sidebarVariant?: SidebarVariant
  /** Content body color token for app shell content */
  contentBodyColor?: Color
  /** Content body surface variant for app shell content */
  contentBodyVariant?: SidebarVariant
  /** Callback when appearance changes */
  onAppearanceChange?: (appearance: Appearance) => void
  /** Callback when accent color changes */
  onAccentColorChange?: (accentColor: AccentColor) => void
  /** Callback when gray color changes */
  onGrayColorChange?: (grayColor: GrayColor) => void
  /** Callback when radius changes */
  onRadiusChange?: (radius: Radius) => void
  /** Callback when locale metadata changes */
  onLocaleChange?: (locale: ThemeLocale) => void
  /** Callback when calendar defaults change */
  onCalendarChange?: (calendar: ThemeCalendar) => void
  /** Callback when typography defaults change */
  onTypographyChange?: (typography: ThemeProviderContextValue['typography']) => void
  /** Callback when scaling changes */
  onScalingChange?: (scaling: Scaling) => void
  /** Callback when panel background changes */
  onPanelBackgroundChange?: (panelBackground: PanelBackground) => void
  /** Callback when avatar color mode changes */
  onAvatarVariantChange?: (mode: AvatarVariant) => void
  /** Callback when avatar radius changes */
  onAvatarRadiusChange?: (radius: Radius) => void
  /** Callback when sidebar color changes */
  onSidebarColorChange?: (color: Color) => void
  /** Callback when sidebar variant changes */
  onSidebarVariantChange?: (variant: SidebarVariant) => void
  /** Callback when content body color changes */
  onContentBodyColorChange?: (color: Color) => void
  /** Callback when content body variant changes */
  onContentBodyVariantChange?: (variant: SidebarVariant) => void
  /** Callback when persisted theme config fields change */
  onThemeConfigChange?: (patch: ThemeProviderConfigPatch) => void
  /** Render as child element */
  asChild?: boolean
  /** Additional class names */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

// ============================================================================
// Theme Component
// ============================================================================

/** Theme export. */
export const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>((providerProps, ref) => {
  const {
    appearance: appearanceProp,
    accentColor: accentColorProp,
    grayColor: grayColorProp,
    radius: radiusProp,
    locale: localeProp,
    calendar: calendarProp,
    breakpoints: breakpointsProp,
    dashboard: dashboardProp,
    typography: typographyProp,
    scaling: scalingProp,
    panelBackground: panelBackgroundProp,
    avatarVariant: avatarVariantProp,
    avatarRadius: avatarRadiusProp,
    hasBackground: hasBackgroundProp = true,
    sidebarColor: sidebarColorProp,
    sidebarVariant: sidebarVariantProp,
    contentBodyColor: contentBodyColorProp,
    contentBodyVariant: contentBodyVariantProp,
    onAppearanceChange: onAppearanceChangeProp,
    onAccentColorChange: onAccentColorChangeProp,
    onGrayColorChange: onGrayColorChangeProp,
    onRadiusChange: onRadiusChangeProp,
    onLocaleChange: onLocaleChangeProp,
    onCalendarChange: onCalendarChangeProp,
    onTypographyChange: onTypographyChangeProp,
    onScalingChange: onScalingChangeProp,
    onPanelBackgroundChange: onPanelBackgroundChangeProp,
    onAvatarVariantChange: onAvatarVariantChangeProp,
    onAvatarRadiusChange: onAvatarRadiusChangeProp,
    onSidebarColorChange: onSidebarColorChangeProp,
    onSidebarVariantChange: onSidebarVariantChangeProp,
    onContentBodyColorChange: onContentBodyColorChangeProp,
    onContentBodyVariantChange: onContentBodyVariantChangeProp,
    onThemeConfigChange: onThemeConfigChangeProp,
    asChild = false,
    className,
    children,
    ...props
  } = providerProps

  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)
  const themeDivRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setPortalContainer(node)
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    },
    [ref],
  )

  const isAppearanceControlled = appearanceProp !== undefined
  const isAccentColorControlled = accentColorProp !== undefined
  const isGrayColorControlled = grayColorProp !== undefined
  const isRadiusControlled = radiusProp !== undefined
  const isLocaleControlled = localeProp !== undefined
  const isCalendarControlled = calendarProp !== undefined
  const isTypographyControlled = typographyProp !== undefined
  const isScalingControlled = scalingProp !== undefined
  const isPanelBackgroundControlled = panelBackgroundProp !== undefined
  const isAvatarVariantControlled = avatarVariantProp !== undefined
  const isAvatarRadiusControlled = avatarRadiusProp !== undefined
  const isSidebarColorControlled = sidebarColorProp !== undefined
  const isSidebarVariantControlled = sidebarVariantProp !== undefined
  const isContentBodyColorControlled = contentBodyColorProp !== undefined
  const isContentBodyVariantControlled = contentBodyVariantProp !== undefined

  const themeStore = React.useState(() =>
    createThemeStore({
      appearance: appearanceProp ?? 'inherit',
      accentColor: accentColorProp ?? 'indigo',
      grayColor: grayColorProp ?? 'auto',
      radius: radiusProp ?? 'md',
      locale: getResolvedLocale(localeProp),
      calendarOverrides: calendarProp ?? {},
      scaling: scalingProp ?? '100%',
      panelBackground: panelBackgroundProp ?? 'translucent',
      avatarVariant: avatarVariantProp ?? 'soft',
      avatarRadius: avatarRadiusProp ?? defaultThemeConfig.layout.avatarRadius,
      sidebarColor: sidebarColorProp ?? 'slate',
      sidebarVariant: sidebarVariantProp ?? 'soft',
      contentBodyColor: contentBodyColorProp ?? 'info',
      contentBodyVariant: contentBodyVariantProp ?? 'surface',
      semanticColors: { ...SEMANTIC_COLOR_DEFAULTS },
      typography: getResolvedTypography(typographyProp),
      resolvedAppearance: getInitialResolvedAppearance(appearanceProp),
    }),
  )[0]

  const storeAppearance = useSelector(themeStore, selectThemeStoreAppearance)
  const storeAccentColor = useSelector(themeStore, selectThemeStoreAccentColor)
  const storeGrayColor = useSelector(themeStore, selectThemeStoreGrayColor)
  const storeRadius = useSelector(themeStore, selectThemeStoreRadius)
  const storeLocale = useSelector(themeStore, selectThemeStoreLocale)
  const storeTypography = useSelector(themeStore, selectThemeStoreTypography)
  const storeScaling = useSelector(themeStore, selectThemeStoreScaling)
  const storePanelBackground = useSelector(themeStore, selectThemeStorePanelBackground)
  const storeAvatarVariant = useSelector(themeStore, selectThemeStoreAvatarVariant)
  const storeAvatarRadius = useSelector(themeStore, selectThemeStoreAvatarRadius)
  const storeSidebarColor = useSelector(themeStore, selectThemeStoreSidebarColor)
  const storeSidebarVariant = useSelector(themeStore, selectThemeStoreSidebarVariant)
  const storeContentBodyColor = useSelector(themeStore, selectThemeStoreContentBodyColor)
  const storeContentBodyVariant = useSelector(themeStore, selectThemeStoreContentBodyVariant)
  const storeCalendarOverrides = useSelector(themeStore, selectThemeStoreCalendarOverrides)
  const storeSemanticColors = useSelector(themeStore, selectThemeStoreSemanticColors)
  const resolvedAppearance = useSelector(themeStore, selectThemeStoreResolvedAppearance)
  const themeVars = useOptionalThemeVarsContext()
  const parentThemeContext = React.useContext(ThemeContext)
  const parentRootContainer = React.useContext(RootThemePortalContainerContext)
  const isRootProvider = parentThemeContext == null
  const rootContainer = isRootProvider ? portalContainer : parentRootContainer
  const shouldSyncDocumentAppearance = parentThemeContext == null
  const parentResolvedAppearance = parentThemeContext?.resolvedAppearance

  const controlledLocale = React.useMemo(() => getResolvedLocale(localeProp), [localeProp])
  const breakpoints = React.useMemo(() => normalizeThemeBreakpoints(breakpointsProp), [breakpointsProp])
  const dashboard = React.useMemo(() => getResolvedDashboard(dashboardProp), [dashboardProp])
  const controlledTypography = React.useMemo(() => getResolvedTypography(typographyProp), [typographyProp])

  const appearance = appearanceProp ?? storeAppearance
  const accentColor = accentColorProp ?? storeAccentColor
  const grayColor = grayColorProp ?? storeGrayColor
  const radius = radiusProp ?? storeRadius
  const locale = isLocaleControlled ? controlledLocale : storeLocale
  const typography = isTypographyControlled ? controlledTypography : storeTypography
  const scaling = scalingProp ?? storeScaling
  const panelBackground = panelBackgroundProp ?? storePanelBackground
  const avatarVariant = avatarVariantProp ?? storeAvatarVariant
  const sidebarColor = sidebarColorProp ?? storeSidebarColor
  const sidebarVariant = sidebarVariantProp ?? storeSidebarVariant
  const contentBodyColor = contentBodyColorProp ?? storeContentBodyColor
  const contentBodyVariant = contentBodyVariantProp ?? storeContentBodyVariant
  const avatarRadius = avatarRadiusProp ?? storeAvatarRadius
  const calendarOverrides = isCalendarControlled ? (calendarProp ?? {}) : storeCalendarOverrides
  const semanticColors = themeVars?.tokens.colors.semantic ?? storeSemanticColors
  const calendar = React.useMemo(
    () => getResolvedCalendar(calendarOverrides, radius, locale),
    [calendarOverrides, radius, locale],
  )
  React.useEffect(() => {
    if (isLocaleControlled || typeof window === 'undefined') return
    // Hydrate locale/timezone from browser after mount to avoid SSR/client mismatches.
    themeStore.trigger.setLocale({ value: getResolvedLocale(getBrowserLocale()) })
  }, [isLocaleControlled, themeStore])

  useIsomorphicLayoutEffect(() => {
    if (!shouldSyncDocumentAppearance) {
      themeStore.trigger.setResolvedAppearance({
        value: appearance === 'inherit' ? (parentResolvedAppearance ?? 'light') : appearance,
      })
      return
    }

    if (typeof document === 'undefined') return

    const root = document.documentElement
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const previousDarkClass = root.classList.contains('dark')
    const previousColorScheme = root.style.colorScheme
    const applyAppearance = () => {
      const resolved = appearance === 'inherit' ? (mediaQuery.matches ? 'dark' : 'light') : appearance
      themeStore.trigger.setResolvedAppearance({ value: resolved })
      root.classList.toggle('dark', resolved === 'dark')
      root.style.colorScheme = resolved
    }

    applyAppearance()

    if (appearance === 'inherit') {
      mediaQuery.addEventListener('change', applyAppearance)
    }

    return () => {
      if (appearance === 'inherit') {
        mediaQuery.removeEventListener('change', applyAppearance)
      }
      root.classList.toggle('dark', previousDarkClass)
      root.style.colorScheme = previousColorScheme
    }
  }, [appearance, parentResolvedAppearance, shouldSyncDocumentAppearance, themeStore])

  // Resolve gray color
  const resolvedGrayColor = grayColor === 'auto' ? getMatchingGrayColor(accentColor) : grayColor
  // Change handlers
  const handleAppearanceChange = React.useCallback(
    (value: Appearance) => {
      if (!isAppearanceControlled) themeStore.trigger.setAppearance({ value })
      onAppearanceChangeProp?.(value)
    },
    [isAppearanceControlled, onAppearanceChangeProp, themeStore],
  )

  const handleAccentColorChange = React.useCallback(
    (value: AccentColor) => {
      if (!isAccentColorControlled) themeStore.trigger.setAccentColor({ value })
      onAccentColorChangeProp?.(value)
      onThemeConfigChangeProp?.({ accentColor: value })
    },
    [isAccentColorControlled, onAccentColorChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleGrayColorChange = React.useCallback(
    (value: GrayColor) => {
      if (!isGrayColorControlled) themeStore.trigger.setGrayColor({ value })
      onGrayColorChangeProp?.(value)
      onThemeConfigChangeProp?.({ grayColor: value })
    },
    [isGrayColorControlled, onGrayColorChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleRadiusChange = React.useCallback(
    (value: Radius) => {
      if (!isRadiusControlled) themeStore.trigger.setRadius({ value })
      onRadiusChangeProp?.(value)
      onThemeConfigChangeProp?.({ radius: value })
    },
    [isRadiusControlled, onRadiusChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleLocaleChange = React.useCallback(
    (value: Partial<ThemeLocale>) => {
      const next = isLocaleControlled
        ? getResolvedLocale({ ...locale, ...value })
        : getResolvedLocale({ ...themeStore.getSnapshot().context.locale, ...value })
      if (!isLocaleControlled) {
        themeStore.trigger.patchLocale({ value })
      }
      onLocaleChangeProp?.(next)
    },
    [isLocaleControlled, locale, onLocaleChangeProp, themeStore],
  )

  const handleCalendarChange = React.useCallback(
    (value: Partial<ThemeCalendar>) => {
      const nextOverrides = isCalendarControlled
        ? { ...calendarOverrides, ...value }
        : { ...themeStore.getSnapshot().context.calendarOverrides, ...value }
      const nextLocale = isLocaleControlled ? locale : themeStore.getSnapshot().context.locale
      const nextRadius = isRadiusControlled ? radius : themeStore.getSnapshot().context.radius
      const next = getResolvedCalendar(nextOverrides, nextRadius, nextLocale)
      if (!isCalendarControlled) themeStore.trigger.patchCalendarOverrides({ value })
      onCalendarChangeProp?.(next)
    },
    [
      calendarOverrides,
      isCalendarControlled,
      isLocaleControlled,
      isRadiusControlled,
      locale,
      onCalendarChangeProp,
      radius,
      themeStore,
    ],
  )

  const handleScalingChange = React.useCallback(
    (value: Scaling) => {
      if (!isScalingControlled) themeStore.trigger.setScaling({ value })
      onScalingChangeProp?.(value)
      onThemeConfigChangeProp?.({ scaling: value })
    },
    [isScalingControlled, onScalingChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handlePanelBackgroundChange = React.useCallback(
    (value: PanelBackground) => {
      if (!isPanelBackgroundControlled) themeStore.trigger.setPanelBackground({ value })
      onPanelBackgroundChangeProp?.(value)
      onThemeConfigChangeProp?.({ panelBackground: value })
    },
    [isPanelBackgroundControlled, onPanelBackgroundChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleAvatarVariantChange = React.useCallback(
    (value: AvatarVariant) => {
      if (!isAvatarVariantControlled) themeStore.trigger.setAvatarVariant({ value })
      onAvatarVariantChangeProp?.(value)
      onThemeConfigChangeProp?.({ avatarVariant: value })
    },
    [isAvatarVariantControlled, onAvatarVariantChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleAvatarRadiusChange = React.useCallback(
    (value: Radius) => {
      if (!isAvatarRadiusControlled) themeStore.trigger.setAvatarRadius({ value })
      onAvatarRadiusChangeProp?.(value)
      onThemeConfigChangeProp?.({ avatarRadius: value })
    },
    [isAvatarRadiusControlled, onAvatarRadiusChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleSidebarColorChange = React.useCallback(
    (value: Color) => {
      if (!isSidebarColorControlled) themeStore.trigger.setSidebarColor({ value })
      onSidebarColorChangeProp?.(value)
      onThemeConfigChangeProp?.({ sidebarColor: value })
    },
    [isSidebarColorControlled, onSidebarColorChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleSidebarVariantChange = React.useCallback(
    (value: SidebarVariant) => {
      if (!isSidebarVariantControlled) themeStore.trigger.setSidebarVariant({ value })
      onSidebarVariantChangeProp?.(value)
      onThemeConfigChangeProp?.({ sidebarVariant: value })
    },
    [isSidebarVariantControlled, onSidebarVariantChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleContentBodyColorChange = React.useCallback(
    (value: Color) => {
      if (!isContentBodyColorControlled) themeStore.trigger.setContentBodyColor({ value })
      onContentBodyColorChangeProp?.(value)
      onThemeConfigChangeProp?.({ contentBodyColor: value })
    },
    [isContentBodyColorControlled, onContentBodyColorChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleContentBodyVariantChange = React.useCallback(
    (value: SidebarVariant) => {
      if (!isContentBodyVariantControlled) themeStore.trigger.setContentBodyVariant({ value })
      onContentBodyVariantChangeProp?.(value)
      onThemeConfigChangeProp?.({ contentBodyVariant: value })
    },
    [isContentBodyVariantControlled, onContentBodyVariantChangeProp, onThemeConfigChangeProp, themeStore],
  )

  const handleSemanticColorChange = React.useCallback(
    (lane: SemanticLane, color: SemanticHue) => {
      if (themeVars) {
        themeVars.onSemanticColorChange(lane, color)
        return
      }
      themeStore.trigger.setSemanticColor({ lane, color })
    },
    [themeStore, themeVars],
  )

  const handleTypographyChange = React.useCallback(
    (value: Partial<ThemeProviderContextValue['typography']>) => {
      const next = isTypographyControlled
        ? getResolvedTypography(mergeTypography(typography, value))
        : getResolvedTypography(mergeTypography(themeStore.getSnapshot().context.typography, value))
      if (!isTypographyControlled) themeStore.trigger.patchTypography({ value })
      onTypographyChangeProp?.(next)
      onThemeConfigChangeProp?.({ typography: next })
    },
    [isTypographyControlled, onThemeConfigChangeProp, onTypographyChangeProp, themeStore, typography],
  )

  const contextValue = React.useMemo<ThemeProviderContextValue>(
    () => ({
      appearance,
      resolvedAppearance,
      accentColor,
      grayColor,
      resolvedGrayColor,
      radius,
      locale,
      calendar,
      breakpoints,
      dashboard,
      scaling,
      panelBackground,
      avatarVariant,
      avatarRadius,
      sidebarColor,
      sidebarVariant,
      contentBodyColor,
      contentBodyVariant,
      semanticColors,
      typography,
      hasBackground: hasBackgroundProp,
      onAppearanceChange: handleAppearanceChange,
      onAccentColorChange: handleAccentColorChange,
      onGrayColorChange: handleGrayColorChange,
      onRadiusChange: handleRadiusChange,
      onLocaleChange: handleLocaleChange,
      onCalendarChange: handleCalendarChange,
      onScalingChange: handleScalingChange,
      onPanelBackgroundChange: handlePanelBackgroundChange,
      onAvatarVariantChange: handleAvatarVariantChange,
      onAvatarRadiusChange: handleAvatarRadiusChange,
      onSidebarColorChange: handleSidebarColorChange,
      onSidebarVariantChange: handleSidebarVariantChange,
      onContentBodyColorChange: handleContentBodyColorChange,
      onContentBodyVariantChange: handleContentBodyVariantChange,
      onSemanticColorChange: handleSemanticColorChange,
      onTypographyChange: handleTypographyChange,
    }),
    [
      appearance,
      resolvedAppearance,
      accentColor,
      grayColor,
      resolvedGrayColor,
      radius,
      locale,
      calendar,
      breakpoints,
      dashboard,
      scaling,
      panelBackground,
      avatarVariant,
      avatarRadius,
      sidebarColor,
      sidebarVariant,
      contentBodyColor,
      contentBodyVariant,
      semanticColors,
      typography,
      hasBackgroundProp,
      handleAppearanceChange,
      handleAccentColorChange,
      handleGrayColorChange,
      handleRadiusChange,
      handleLocaleChange,
      handleCalendarChange,
      handleScalingChange,
      handlePanelBackgroundChange,
      handleAvatarVariantChange,
      handleAvatarRadiusChange,
      handleSidebarColorChange,
      handleSidebarVariantChange,
      handleContentBodyColorChange,
      handleContentBodyVariantChange,
      handleSemanticColorChange,
      handleTypographyChange,
    ],
  )

  // CSS custom properties for theming
  const themeStyles: React.CSSProperties = {
    '--theme-accent-color': accentColor,
    '--theme-radius': getThemeRadiusValue(radius),
    '--theme-calendar-radius': getThemeRadiusValue(calendar.radius),
    '--theme-scaling': scaling,
    '--font-sans': typography.fontSans,
    '--font-serif': typography.fontSerif,
    '--font-mono': typography.fontMono,
    '--letter-spacing': typography.letterSpacing,
    ...buildRuntimePaletteVars(resolvedAppearance),
    ...buildThemeResponsiveProfileVars(typography.responsiveProfile, typographyBreakpoints),
    ...buildSemanticLaneVars(semanticColors, themeVars?.tokens.colors.variants ?? THEME_COLOR_VARIANT_DEFAULTS),
    ...getSurfaceVariantVars('content-body', contentBodyColor, contentBodyVariant),
  } as React.CSSProperties

  const themeClassName = cn(
    'af-themes',
    appearance === 'light' && 'light',
    appearance === 'dark' && 'dark',
    hasBackgroundProp && 'bg-background text-foreground',
    className,
  )

  const themeDataAttributes = {
    'data-accent-color': accentColor,
    'data-gray-color': resolvedGrayColor,
    'data-radius': radius,
    'data-locale': locale.locale,
    'data-language': locale.language,
    'data-country': locale.country,
    'data-timezone': locale.timezone,
    'data-calendar-radius': calendar.radius,
    'data-scaling': scaling,
    'data-panel-background': panelBackground,
    'data-sidebar-color': sidebarColor,
    'data-sidebar-variant': sidebarVariant,
    'data-content-body-color': contentBodyColor,
    'data-content-body-variant': contentBodyVariant,
    'data-has-background': hasBackgroundProp,
    'data-typography-responsive-profile': typography.responsiveProfile,
  }

  const fontSourceCss = React.useMemo(() => buildFontSourceCss(typography), [typography])

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string
      style?: React.CSSProperties
      children?: React.ReactNode
      ref?: React.Ref<HTMLElement>
    }>
    const propsStyle = (props as { style?: React.CSSProperties }).style
    const composedChildren = (
      <>
        {fontSourceCss ? <style data-theme-font-sources>{fontSourceCss}</style> : null}
        {child.props.children}
      </>
    )

    return (
      <ThemeContext.Provider value={contextValue}>
        <RootThemePortalContainerContext.Provider value={rootContainer}>
          <ThemePortalContainerContext.Provider value={portalContainer}>
            <ThemeRadiusProvider value={radius}>
              <AvatarProvider variant={avatarVariant} radius={avatarRadius}>
                <MotionProvider>
                  {React.cloneElement(
                    child,
                    {
                      ...props,
                      ref: themeDivRef,
                      className: cn(child.props.className, themeClassName),
                      style: { ...themeStyles, ...child.props.style, ...propsStyle },
                      ...themeDataAttributes,
                    },
                    composedChildren,
                  )}
                </MotionProvider>
              </AvatarProvider>
            </ThemeRadiusProvider>
          </ThemePortalContainerContext.Provider>
        </RootThemePortalContainerContext.Provider>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <RootThemePortalContainerContext.Provider value={rootContainer}>
        <ThemePortalContainerContext.Provider value={portalContainer}>
          <ThemeRadiusProvider value={radius}>
            <AvatarProvider variant={avatarVariant} radius={avatarRadius}>
              <MotionProvider>
                <div
                  {...props}
                  ref={themeDivRef}
                  className={themeClassName}
                  style={{ ...themeStyles, ...(props as { style?: React.CSSProperties }).style }}
                  {...themeDataAttributes}
                >
                  {fontSourceCss ? <style data-theme-font-sources>{fontSourceCss}</style> : null}
                  {children}
                </div>
              </MotionProvider>
            </AvatarProvider>
          </ThemeRadiusProvider>
        </ThemePortalContainerContext.Provider>
      </RootThemePortalContainerContext.Provider>
    </ThemeContext.Provider>
  )
})

ThemeProvider.displayName = 'ThemeProvider'

export const Theme = ThemeProvider
export type ThemeProps = ThemeProviderProps

function getResolvedLocale(locale?: Partial<ThemeLocale>): ThemeLocale {
  const defaults = getDefaultLocale()
  const resolvedLocale = locale?.locale ?? defaults.locale
  const [languageFromLocale, countryFromLocale] = resolvedLocale.split('-')
  return {
    locale: resolvedLocale,
    language: locale?.language ?? languageFromLocale ?? defaults.language,
    country: locale?.country ?? countryFromLocale ?? defaults.country,
    timezone: locale?.timezone ?? defaults.timezone,
  }
}

function getResolvedCalendar(
  calendar: Partial<ThemeCalendar> | undefined,
  radius: Radius,
  locale: Partial<ThemeLocale> | ThemeLocale | undefined,
): ThemeCalendar {
  const resolvedLocale = getResolvedLocale(locale)
  return {
    radius: calendar?.radius ?? radius,
    locale: calendar?.locale ?? resolvedLocale.locale,
    timezone: calendar?.timezone ?? resolvedLocale.timezone,
    navButtonBordered: calendar?.navButtonBordered ?? false,
  }
}

function getResolvedDashboard(dashboard?: Partial<ThemeDashboard>): ThemeDashboard {
  return {
    gap: normalizeThemeDashboardGap(dashboard?.gap),
    columns: normalizeThemeDashboardColumns(dashboard?.columns),
  }
}

function getResolvedTypography(
  typography?: Partial<ThemeProviderContextValue['typography']>,
): ThemeProviderContextValue['typography'] {
  const responsiveProfile =
    typography?.responsiveProfile && TYPOGRAPHY_RESPONSIVE_PROFILES.includes(typography.responsiveProfile)
      ? typography.responsiveProfile
      : TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT

  return {
    ...TYPOGRAPHY_DEFAULTS,
    letterSpacing: '0em',
    ...typography,
    fontSources: getResolvedFontSources(typography?.fontSources ?? {}),
    responsiveProfile,
  }
}

function mergeTypography(
  previous: ThemeProviderContextValue['typography'],
  next: Partial<ThemeProviderContextValue['typography']>,
) {
  return {
    ...previous,
    ...next,
    fontSources: {
      ...previous.fontSources,
      ...(next.fontSources ?? {}),
    },
  }
}

function getResolvedFontSources(fontSources?: ThemeFontSourceMap): ThemeFontSourceMap {
  return {
    ...(fontSources ?? {}),
  }
}

function buildFontSourceCss(typography: ThemeProviderContextValue['typography']) {
  const imports: string[] = []
  const faces: string[] = []

  for (const [slot, source] of Object.entries(typography.fontSources) as Array<
    [keyof ThemeFontSourceMap, ThemeFontSource | undefined]
  >) {
    if (!source?.url.trim()) continue

    if (source.kind === 'css-url') {
      imports.push(`@import url("${escapeCssUrl(source.url)}");`)
      continue
    }

    const fontFamily = extractPrimaryFontFamily(getTypographyFontFamily(typography, slot))
    if (!fontFamily) continue

    faces.push(buildFontFaceRule(fontFamily, source))
  }

  return [...imports, ...faces].join('\n')
}

function getTypographyFontFamily(typography: ThemeProviderContextValue['typography'], slot: keyof ThemeFontSourceMap) {
  if (slot === 'serif') return typography.fontSerif
  if (slot === 'mono') return typography.fontMono
  return typography.fontSans
}

function buildFontFaceRule(fontFamily: string, source: Extract<ThemeFontSource, { kind: 'file-url' }>) {
  const declarations = [
    `font-family: "${escapeCssString(fontFamily)}"`,
    `src: url("${escapeCssUrl(source.url)}")${formatFontDescriptor(source.format)}`,
    `font-display: ${normalizeFontDisplay(source.display)}`,
    `font-style: ${source.style ?? 'normal'}`,
  ]

  const weight = source.weight?.trim()
  if (weight && isValidFontWeightDescriptor(weight)) {
    declarations.push(`font-weight: ${weight}`)
  }

  return `@font-face { ${declarations.join('; ')}; }`
}

function formatFontDescriptor(format?: ThemeFontFileFormat) {
  if (!format) return ''
  if (format === 'woff2') return ` format("woff2")`
  if (format === 'woff') return ` format("woff")`
  if (format === 'truetype') return ` format("truetype")`
  if (format === 'opentype') return ` format("opentype")`
  return ''
}

function normalizeFontDisplay(display?: ThemeFontDisplay) {
  return display ?? 'swap'
}

function escapeCssUrl(value: string) {
  return escapeCssString(value)
}

function getDefaultLocale(): ThemeLocale {
  return {
    locale: 'en-US',
    language: 'en',
    country: 'US',
    timezone: 'UTC',
  }
}

function getBrowserLocale(): ThemeLocale {
  try {
    const resolved = new Intl.DateTimeFormat().resolvedOptions()
    const locale = resolved.locale || 'en-US'
    const [language, country] = locale.split('-')
    return {
      locale,
      language: language || 'en',
      country: country || 'US',
      timezone: resolved.timeZone || 'UTC',
    }
  } catch {
    return getDefaultLocale()
  }
}
