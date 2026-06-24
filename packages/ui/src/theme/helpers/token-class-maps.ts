import {
  CHART_COLOR_KEYS,
  HUE_NAMES,
  HUE_STEPS,
  type Radius,
  resolveThemeColorToken,
  SEMANTIC_COLOR_VAR_TOKENS,
  type Spacing,
  semanticColorScale,
  type ThemeColorToken,
} from '@/theme/tokens'

export const spacingClassValueByToken = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
} as const satisfies Record<Spacing, string>

export const radiusClassByToken = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const satisfies Record<Radius, string>

export type SpacingUtilityPrefix =
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'gap'
  | 'gap-x'
  | 'gap-y'
  | 'inset'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'

export type ResponsiveUtilityBreakpoint = 'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const responsiveUtilityPrefixByBreakpoint = {
  initial: '',
  xs: 'xs:',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
} as const satisfies Record<ResponsiveUtilityBreakpoint, string>

const spacingTokenSet = new Set<string>(Object.keys(spacingClassValueByToken))

export function getSpacingUtilityClass(prefix: SpacingUtilityPrefix, value: string | undefined): string | undefined {
  const trimmedValue = value?.trim()
  if (!trimmedValue) return undefined

  const negative = trimmedValue.startsWith('-')
  const token = negative ? trimmedValue.slice(1) : trimmedValue
  if (!spacingTokenSet.has(token)) return undefined

  const classValue = spacingClassValueByToken[token as Spacing]
  if (!negative || classValue === '0') return `${prefix}-${classValue}`
  return `-${prefix}-${classValue}`
}

export function getResponsiveSpacingUtilityClasses(
  prefix: SpacingUtilityPrefix,
  value: Partial<Record<ResponsiveUtilityBreakpoint, string>>,
): string | undefined {
  const classes: string[] = []

  for (const breakpoint of Object.keys(responsiveUtilityPrefixByBreakpoint) as ResponsiveUtilityBreakpoint[]) {
    const breakpointValue = value[breakpoint]
    if (breakpointValue === undefined) continue

    const utilityClass = getSpacingUtilityClass(prefix, breakpointValue)
    if (!utilityClass) return undefined

    classes.push(`${responsiveUtilityPrefixByBreakpoint[breakpoint]}${utilityClass}`)
  }

  return classes.length > 0 ? classes.join(' ') : undefined
}

const semanticColorUtilityByToken = {
  background: 'background',
  foreground: 'foreground',
  'neutral-surface': 'card',
  'neutral-text': 'card-foreground',
  'neutral-border': 'border',
  'primary-primary': 'primary',
  'primary-contrast': 'primary-foreground',
  'secondary-soft': 'secondary',
  'secondary-text': 'secondary-foreground',
  'accent-soft': 'accent',
  'accent-text': 'accent-foreground',
  'error-primary': 'destructive',
  'error-contrast': 'destructive-foreground',
} as const satisfies Partial<Record<ThemeColorToken | 'background' | 'foreground', string>>

const arbitraryThemeColorTokenSet = new Set<string>([
  ...HUE_NAMES.flatMap(hue => HUE_STEPS.map(step => `${hue}-${step}`)),
  ...semanticColorScale.flatMap(color => SEMANTIC_COLOR_VAR_TOKENS.map(token => `${color}-${token}`)),
  ...CHART_COLOR_KEYS,
])

export function getThemeColorUtilityClass(
  prefix: 'bg' | 'text' | 'border',
  token: ThemeColorToken | 'background' | 'foreground' | undefined,
): string | undefined {
  if (!token) return undefined

  const utilityValue = semanticColorUtilityByToken[token as keyof typeof semanticColorUtilityByToken]
  if (utilityValue) return `${prefix}-${utilityValue}`

  if (!arbitraryThemeColorTokenSet.has(token)) return undefined

  return `${prefix}-[${resolveThemeColorToken(token as ThemeColorToken)}]`
}
