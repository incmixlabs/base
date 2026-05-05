import { designTokens, type Radius } from '@/theme/tokens'

export const space = {
  '0': '0',
  '1': 'var(--space-1)',
  '2': 'var(--space-2)',
  '3': 'var(--space-3)',
  '4': 'var(--space-4)',
  '5': 'var(--space-5)',
  '6': 'var(--space-6)',
  '7': 'var(--space-7)',
  '8': 'var(--space-8)',
  '9': 'var(--space-9)',
} as const

/** Concrete space values in rem — portal-safe, for VE styles in floating/card components */
export const spaceRem = {
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.5rem',
  '6': '2rem',
  '7': '2.5rem',
  '8': '3rem',
  '9': '4rem',
} as const

export const radii: Record<Radius, string> = {
  none: designTokens.radius.none,
  sm: designTokens.radius.sm,
  md: designTokens.radius.md,
  lg: designTokens.radius.lg,
  full: designTokens.radius.full,
}

export type PrimitiveSizeToken = keyof typeof designTokens.size

export interface ControlSizeTokenValues {
  height: string
  fontSize: string
  lineHeight: string
  iconSize: string
  gap: string
  paddingX: string
  paddingY: string
}

export const fontSizes = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2x': 'var(--font-size-2x)',
  '3x': 'var(--font-size-3x)',
  '4x': 'var(--font-size-4x)',
  '5x': 'var(--font-size-5x)',
} as const

export const lineHeights = {
  xs: 'var(--line-height-xs)',
  sm: 'var(--line-height-sm)',
  md: 'var(--line-height-md)',
  lg: 'var(--line-height-lg)',
  xl: 'var(--line-height-xl)',
  '2x': 'var(--line-height-2x)',
  '3x': 'var(--line-height-3x)',
  '4x': 'var(--line-height-4x)',
  '5x': 'var(--line-height-5x)',
} as const

export const letterSpacings = {
  xs: 'var(--letter-spacing-xs)',
  sm: 'var(--letter-spacing-sm)',
  md: 'var(--letter-spacing-md)',
  lg: 'var(--letter-spacing-lg)',
  xl: 'var(--letter-spacing-xl)',
  '2x': 'var(--letter-spacing-2x)',
  '3x': 'var(--letter-spacing-3x)',
  '4x': 'var(--letter-spacing-4x)',
  '5x': 'var(--letter-spacing-5x)',
} as const

/** Typography font sizes in rem (portal-safe) */
export const fontSizeRem = Object.fromEntries(
  (Object.keys(designTokens.size) as PrimitiveSizeToken[]).map(size => [size, designTokens.size[size].fontSize]),
) as Record<PrimitiveSizeToken, string>

/** Typography line heights in rem (portal-safe) */
export const lineHeightRem = Object.fromEntries(
  (Object.keys(designTokens.size) as PrimitiveSizeToken[]).map(size => [size, designTokens.size[size].lineHeight]),
) as Record<PrimitiveSizeToken, string>

/** Heading line heights in rem (tighter than text) */
export const headingLineHeightRem = {
  xs: '1rem',
  sm: '1.125rem',
  md: '1.375rem',
  lg: '1.5rem',
  xl: '1.625rem',
  '2x': '1.875rem',
  '3x': '2.25rem',
  '4x': '2.5rem',
  '5x': '3.5rem',
} as const

/** Typography letter spacings in em */
export const letterSpacingRem = {
  xs: '0.0025em',
  sm: '0em',
  md: '0em',
  lg: '-0.0025em',
  xl: '-0.005em',
  '2x': '-0.00625em',
  '3x': '-0.0075em',
  '4x': '-0.01em',
  '5x': '-0.025em',
} as const

export const shadows = {
  '0': 'none',
  '1': 'var(--shadow-1)',
  '2': 'var(--shadow-2)',
  '3': 'var(--shadow-3)',
  '4': 'var(--shadow-4)',
  '5': 'var(--shadow-5)',
  '6': 'var(--shadow-6)',
} as const

/** Shared control sizing — the semantic wrapper around the primitive size token source. */
export const controlSizeTokens = Object.fromEntries(
  Object.entries(designTokens.size).map(([size, token]) => [
    size,
    {
      height: token.height,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      iconSize: token.iconSize,
      gap: token.gap,
      paddingX: token.paddingX,
      paddingY: token.paddingY,
    },
  ]),
) as Record<PrimitiveSizeToken, ControlSizeTokenValues>

type PanelSizeToken = Extract<PrimitiveSizeToken, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'>

/** Shared panel sizing for Card and Callout */
export const panelSizeTokens = {
  xs: {
    padding: controlSizeTokens.xs.paddingX,
    gap: controlSizeTokens.xs.gap,
    fontSize: controlSizeTokens.xs.fontSize,
    lineHeight: controlSizeTokens.xs.lineHeight,
    iconSize: controlSizeTokens.xs.iconSize,
  },
  sm: {
    padding: controlSizeTokens.sm.paddingX,
    gap: controlSizeTokens.sm.gap,
    fontSize: controlSizeTokens.sm.fontSize,
    lineHeight: controlSizeTokens.sm.lineHeight,
    iconSize: controlSizeTokens.sm.iconSize,
  },
  md: {
    padding: controlSizeTokens.md.paddingX,
    gap: controlSizeTokens.md.gap,
    fontSize: controlSizeTokens.md.fontSize,
    lineHeight: controlSizeTokens.md.lineHeight,
    iconSize: controlSizeTokens.md.iconSize,
  },
  lg: {
    padding: controlSizeTokens.lg.paddingX,
    gap: controlSizeTokens.lg.gap,
    fontSize: controlSizeTokens.lg.fontSize,
    lineHeight: controlSizeTokens.lg.lineHeight,
    iconSize: controlSizeTokens.lg.iconSize,
  },
  xl: {
    padding: controlSizeTokens.xl.paddingX,
    gap: controlSizeTokens.xl.gap,
    fontSize: controlSizeTokens.xl.fontSize,
    lineHeight: controlSizeTokens.xl.lineHeight,
    iconSize: controlSizeTokens.xl.iconSize,
  },
  '2x': {
    padding: controlSizeTokens['2x'].paddingX,
    gap: controlSizeTokens['2x'].gap,
    fontSize: controlSizeTokens['2x'].fontSize,
    lineHeight: controlSizeTokens['2x'].lineHeight,
    iconSize: controlSizeTokens['2x'].iconSize,
  },
} as const satisfies Record<
  PanelSizeToken,
  { padding: string; gap: string; fontSize: string; lineHeight: string; iconSize: string }
>

type MenuSizeToken = 'sm' | 'md' | 'lg' | 'xl'

/** Menu sizing is a denser semantic family than general panels, even though it derives from the same primitive source. */
export const menuSizeTokens = {
  sm: {
    ...controlSizeTokens.sm,
    fontSize: fontSizeRem.sm,
    lineHeight: lineHeightRem.sm,
    iconSize: '1rem',
  },
  md: {
    ...controlSizeTokens.md,
    fontSize: fontSizeRem.md,
    lineHeight: lineHeightRem.md,
    iconSize: '1rem',
  },
  lg: {
    ...controlSizeTokens.lg,
    fontSize: fontSizeRem.lg,
    lineHeight: lineHeightRem.lg,
    iconSize: '1.125rem',
  },
  xl: {
    ...controlSizeTokens.xl,
    fontSize: fontSizeRem.xl,
    lineHeight: lineHeightRem.xl,
    iconSize: '1.25rem',
  },
} as const satisfies Record<MenuSizeToken, ControlSizeTokenValues>

/** Floating surface content sizing for Popover/Tooltip */
export const floatingSurfaceSizeTokens = {
  xs: {
    padding: `${controlSizeTokens.xs.paddingY} ${controlSizeTokens.xs.paddingX}`,
    fontSize: controlSizeTokens.xs.fontSize,
    lineHeight: controlSizeTokens.xs.lineHeight,
  },
  sm: {
    padding: `${controlSizeTokens.sm.paddingY} ${controlSizeTokens.sm.paddingX}`,
    fontSize: controlSizeTokens.sm.fontSize,
    lineHeight: controlSizeTokens.sm.lineHeight,
  },
  md: {
    padding: `${controlSizeTokens.md.paddingY} ${controlSizeTokens.md.paddingX}`,
    fontSize: controlSizeTokens.md.fontSize,
    lineHeight: controlSizeTokens.md.lineHeight,
  },
  lg: {
    padding: `${controlSizeTokens.lg.paddingY} ${controlSizeTokens.lg.paddingX}`,
    fontSize: controlSizeTokens.lg.fontSize,
    lineHeight: controlSizeTokens.lg.lineHeight,
  },
} as const

type PickerPopupSizeToken = 'xs' | 'sm' | 'md' | 'lg' | '2x'

/** Shared picker popup/list sizing for MultiSelect, AvatarPicker, and related selection surfaces. */
export const pickerPopupSizeTokens = {
  xs: {
    viewportMaxHeight: '10rem',
    searchHeight: '1.5rem',
    fontSize: fontSizeRem.xs,
    lineHeight: lineHeightRem.xs,
    iconSize: '0.875rem',
    rowPaddingX: '0.5rem',
    rowPaddingY: '0.25rem',
    rowTrailingPadding: '1.75rem',
    popupPadding: spaceRem['1'],
    statusPaddingX: spaceRem['3'],
    statusPaddingY: spaceRem['2'],
  },
  sm: {
    viewportMaxHeight: '12rem',
    searchHeight: '2rem',
    fontSize: fontSizeRem.sm,
    lineHeight: lineHeightRem.sm,
    iconSize: '1rem',
    rowPaddingX: '0.5rem',
    rowPaddingY: '0.375rem',
    rowTrailingPadding: '2rem',
    popupPadding: spaceRem['1'],
    statusPaddingX: spaceRem['3'],
    statusPaddingY: spaceRem['2'],
  },
  md: {
    viewportMaxHeight: '12.5rem',
    searchHeight: '2.25rem',
    fontSize: fontSizeRem.sm,
    lineHeight: lineHeightRem.sm,
    iconSize: '1rem',
    rowPaddingX: '0.625rem',
    rowPaddingY: '0.5rem',
    rowTrailingPadding: '2rem',
    popupPadding: spaceRem['1'],
    statusPaddingX: spaceRem['3'],
    statusPaddingY: spaceRem['2'],
  },
  lg: {
    viewportMaxHeight: '14rem',
    searchHeight: '2.5rem',
    fontSize: fontSizeRem.md,
    lineHeight: lineHeightRem.md,
    iconSize: '1.25rem',
    rowPaddingX: '0.75rem',
    rowPaddingY: '0.625rem',
    rowTrailingPadding: '2.25rem',
    popupPadding: spaceRem['1'],
    statusPaddingX: spaceRem['3'],
    statusPaddingY: spaceRem['2'],
  },
  '2x': {
    viewportMaxHeight: '16rem',
    searchHeight: '3rem',
    fontSize: fontSizeRem.xl,
    lineHeight: lineHeightRem.xl,
    iconSize: '1.5rem',
    rowPaddingX: '1rem',
    rowPaddingY: '0.875rem',
    rowTrailingPadding: '2.5rem',
    popupPadding: spaceRem['1'],
    statusPaddingX: spaceRem['3'],
    statusPaddingY: spaceRem['2'],
  },
} as const satisfies Record<
  PickerPopupSizeToken,
  {
    viewportMaxHeight: string
    searchHeight: string
    fontSize: string
    lineHeight: string
    iconSize: string
    rowPaddingX: string
    rowPaddingY: string
    rowTrailingPadding: string
    popupPadding: string
    statusPaddingX: string
    statusPaddingY: string
  }
>

// Compatibility aliases while consumers migrate to the semantic names above.
export const panelSizeRem = panelSizeTokens
export const floatingContentSizeRem = floatingSurfaceSizeTokens
