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
} from '../tokens'

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

export const responsiveUtilityPrefixByBreakpoint = {
  initial: '',
  xs: 'xs:',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
} as const satisfies Record<ResponsiveUtilityBreakpoint, string>

export type ResponsiveUtilityValue<T extends string> = T | Partial<Record<ResponsiveUtilityBreakpoint, T>>

export type UtilityClassFormatter = (classValue: string) => string

export function getResponsiveUtilityClassNames(classNames: readonly string[]): string[] {
  return Array.from(
    new Set(
      classNames.flatMap(className =>
        Object.values(responsiveUtilityPrefixByBreakpoint).map(breakpointPrefix => `${breakpointPrefix}${className}`),
      ),
    ),
  )
}

export function getMappedUtilityClass<T extends string>(
  value: T | undefined,
  map: Record<T, string>,
  formatClass: UtilityClassFormatter = classValue => classValue,
): string | undefined {
  if (!value) return undefined

  const classValue = map[value]
  return classValue ? formatClass(classValue) : undefined
}

export function getResponsiveMappedUtilityClasses<T extends string>(
  value: ResponsiveUtilityValue<T> | undefined,
  map: Record<T, string>,
  formatClass: UtilityClassFormatter = classValue => classValue,
): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return getMappedUtilityClass(value, map, formatClass)

  const classes: string[] = []
  for (const breakpoint of Object.keys(responsiveUtilityPrefixByBreakpoint) as ResponsiveUtilityBreakpoint[]) {
    const breakpointValue = value[breakpoint]
    const utilityClass = getMappedUtilityClass(breakpointValue, map, formatClass)
    if (utilityClass) classes.push(`${responsiveUtilityPrefixByBreakpoint[breakpoint]}${utilityClass}`)
  }

  return classes.length > 0 ? classes.join(' ') : undefined
}

const spacingTokenSet = new Set<string>(Object.keys(spacingClassValueByToken))
const spacingUtilityPrefixSupportsNegative = {
  p: false,
  px: false,
  py: false,
  pt: false,
  pr: false,
  pb: false,
  pl: false,
  m: true,
  mx: true,
  my: true,
  mt: true,
  mr: true,
  mb: true,
  ml: true,
  gap: false,
  'gap-x': false,
  'gap-y': false,
  inset: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
} satisfies Record<SpacingUtilityPrefix, boolean>

const spacingUtilityPrefixes = Object.keys(spacingUtilityPrefixSupportsNegative) as SpacingUtilityPrefix[]
const negativeSpacingUtilityPrefixes = new Set<SpacingUtilityPrefix>(
  spacingUtilityPrefixes.filter(prefix => spacingUtilityPrefixSupportsNegative[prefix]),
)

export function getSpacingUtilityClass(prefix: SpacingUtilityPrefix, value: string | undefined): string | undefined {
  const trimmedValue = value?.trim()
  if (!trimmedValue) return undefined

  const negative = trimmedValue.startsWith('-')
  const token = negative ? trimmedValue.slice(1) : trimmedValue
  if (negative && !negativeSpacingUtilityPrefixes.has(prefix)) return undefined
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
    if (!utilityClass) continue

    classes.push(`${responsiveUtilityPrefixByBreakpoint[breakpoint]}${utilityClass}`)
  }

  return classes.length > 0 ? classes.join(' ') : undefined
}

export const spacingUtilityClassNames = spacingUtilityPrefixes.flatMap(prefix => {
  const spacingTokens = Object.keys(spacingClassValueByToken)
  const signedTokens = negativeSpacingUtilityPrefixes.has(prefix)
    ? [...spacingTokens, ...spacingTokens.filter(token => token !== '0').map(token => `-${token}`)]
    : spacingTokens

  return signedTokens.flatMap(token => {
    const utilityClass = getSpacingUtilityClass(prefix, token)
    if (!utilityClass) return []

    return Object.values(responsiveUtilityPrefixByBreakpoint).map(
      breakpointPrefix => `${breakpointPrefix}${utilityClass}`,
    )
  })
})

const semanticColorUtilityByPrefixAndToken = {
  bg: {
    background: 'neutral-background',
    'neutral-surface': 'neutral-surface',
    'primary-solid': 'primary-solid',
    'secondary-soft': 'secondary-soft',
    'accent-soft': 'accent-soft',
    'error-solid': 'error-solid',
  },
  text: {
    foreground: 'neutral',
    'neutral-text': 'neutral',
    'primary-contrast': 'primary-contrast',
    'secondary-text': 'secondary',
    'accent-text': 'accent',
    'error-contrast': 'error-contrast',
  },
  border: {
    'neutral-border': 'neutral',
  },
} as const satisfies Record<
  'bg' | 'text' | 'border',
  Partial<Record<ThemeColorToken | 'background' | 'foreground', string>>
>

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

  const utilityValue =
    semanticColorUtilityByPrefixAndToken[prefix][
      token as keyof (typeof semanticColorUtilityByPrefixAndToken)[typeof prefix]
    ]
  if (utilityValue) return `${prefix}-${utilityValue}`

  if (!arbitraryThemeColorTokenSet.has(token)) return undefined

  return `${prefix}-[${resolveThemeColorToken(token as ThemeColorToken)}]`
}
