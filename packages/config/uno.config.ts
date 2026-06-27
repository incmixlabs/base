import {
  CHART_COLOR_KEYS,
  CHROMATIC_SURFACE_COLOR_NAMES,
  HUE_NAMES,
  HUE_STEPS,
  SEMANTIC_COLOR_NAMES,
  SEMANTIC_COLOR_VAR_TOKENS,
} from '@incmix/theme'
import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

const responsivePrefixes = ['', 'xs:', 'sm:', 'md:', 'lg:', 'xl:'] as const
const spacingTokens = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const spacingUtilityPrefixes = [
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'gap',
  'gap-x',
  'gap-y',
  'inset',
  'top',
  'right',
  'bottom',
  'left',
] as const
const negativeSpacingUtilityPrefixes = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'] as const
const radiusUtilities = [
  'rounded-none',
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
  'rounded-3xl',
  'rounded-4xl',
  'rounded-full',
] as const
const sizeTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const
const semanticColorUtilities = [
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  'border',
  'primary',
  'primary-foreground',
  'accent',
  'accent-foreground',
  'secondary',
] as const
const stateColorUtilities = [
  '[var(--color-neutral-primary)]',
  '[var(--color-info-primary)]',
  '[var(--color-success-primary)]',
  '[var(--color-warning-primary)]',
  '[var(--color-error-primary)]',
] as const
const stateBorderColorUtilities = [
  '[var(--color-primary-border)]',
  '[var(--color-secondary-border)]',
  '[var(--color-accent-border)]',
  '[var(--color-neutral-border)]',
  '[var(--color-info-border)]',
  '[var(--color-success-border)]',
  '[var(--color-warning-border)]',
  '[var(--color-error-border)]',
] as const
const colorUtilityPrefixes = ['bg', 'text', 'border'] as const
const surfaceColorNames = [...SEMANTIC_COLOR_NAMES, ...CHART_COLOR_KEYS] as const
type SemanticSurfaceColorName = (typeof SEMANTIC_COLOR_NAMES)[number]
type ChartSurfaceColorName = (typeof CHART_COLOR_KEYS)[number]
type SurfaceColorName = (typeof surfaceColorNames)[number]
type ChromaticSurfaceColorName = (typeof CHROMATIC_SURFACE_COLOR_NAMES)[number]
type SurfaceInteractionLayer = 'soft' | 'container'

const surfaceInteractionTokenByLayer = {
  soft: 'soft',
  container: 'surface',
} as const satisfies Record<SurfaceInteractionLayer, string>

const surfaceColorPattern = surfaceColorNames.join('|')
const chromaticSurfaceColorPattern = CHROMATIC_SURFACE_COLOR_NAMES.join('|')
const surfaceBackgroundRule = new RegExp(`^bg-(${surfaceColorPattern})-(solid|soft|surface)$`)
const surfaceHighlightBackgroundRule = new RegExp(`^bg-(${chromaticSurfaceColorPattern})-highlight$`)
const surfaceBorderRule = new RegExp(`^border-(${surfaceColorPattern})$`)
const surfaceOutlineRule = new RegExp(`^outline-(${surfaceColorPattern})$`)
const surfaceHighlightOutlineRule = new RegExp(`^outline-(${chromaticSurfaceColorPattern})-highlight$`)
const surfaceTextRule = new RegExp(`^text-(${surfaceColorPattern})(?:-(contrast))?$`)
const rawHueColorRule = new RegExp(`^(bg|text|border)-(${HUE_NAMES.join('|')})-(${HUE_STEPS.join('|')})$`)

function semanticSurfaceColorRoles(color: SemanticSurfaceColorName) {
  return {
    solid: `var(--color-${color}-primary)`,
    soft: `var(--color-${color}-soft)`,
    surface: `var(--color-${color}-surface)`,
    highlight: `var(--color-${color}-primary-alpha)`,
    border: `var(--color-${color}-border)`,
    text: `var(--color-${color}-text)`,
    contrast: `var(--color-${color}-contrast)`,
  }
}

function chartSurfaceColorRoles(color: ChartSurfaceColorName) {
  const chartIndex = color.slice('chart'.length)
  const chartValue = `var(--chart-${chartIndex})`

  return {
    solid: chartValue,
    soft: `color-mix(in oklch, ${chartValue} 28%, var(--color-light-surface))`,
    surface: `color-mix(in oklch, ${chartValue} 12%, var(--color-light-surface))`,
    border: `color-mix(in oklch, ${chartValue} 28%, var(--color-light-border))`,
    text: `color-mix(in oklch, ${chartValue} 34%, var(--color-dark-primary))`,
    contrast: `var(--chart-${chartIndex}-contrast)`,
  }
}

const surfaceSemanticColors = Object.fromEntries(
  SEMANTIC_COLOR_NAMES.map(color => [color, semanticSurfaceColorRoles(color)]),
) as Record<SemanticSurfaceColorName, ReturnType<typeof semanticSurfaceColorRoles>>

const surfaceChartColors = Object.fromEntries(
  CHART_COLOR_KEYS.map(color => [color, chartSurfaceColorRoles(color)]),
) as Record<ChartSurfaceColorName, ReturnType<typeof chartSurfaceColorRoles>>

const surfaceColors = {
  ...surfaceSemanticColors,
  ...surfaceChartColors,
} as Record<SurfaceColorName, ReturnType<typeof semanticSurfaceColorRoles> | ReturnType<typeof chartSurfaceColorRoles>>

function isChromaticSurfaceColor(color: SurfaceColorName): color is ChromaticSurfaceColorName {
  return (CHROMATIC_SURFACE_COLOR_NAMES as readonly string[]).includes(color)
}

function isChartSurfaceColor(color: SurfaceColorName): color is ChartSurfaceColorName {
  return (CHART_COLOR_KEYS as readonly string[]).includes(color)
}

function chartSurfaceInteractionBackgroundUtility(color: ChartSurfaceColorName, layer: SurfaceInteractionLayer) {
  const chartIndex = color.slice('chart'.length)
  const mixPercent = layer === 'container' ? 18 : 36
  return `bg-[color-mix(in_oklch,var(--chart-${chartIndex})_${mixPercent}%,var(--color-light-surface))]`
}

function surfaceStateBackgroundUtility(color: SurfaceColorName, layer: SurfaceInteractionLayer = 'soft') {
  if (isChromaticSurfaceColor(color)) return `bg-${color}-highlight`
  if (isChartSurfaceColor(color)) return chartSurfaceInteractionBackgroundUtility(color, layer)

  return `bg-[var(--color-${color}-${surfaceInteractionTokenByLayer[layer]}-hover)]`
}

function surfaceFocusOutlineUtility(color: SurfaceColorName) {
  return isChromaticSurfaceColor(color) ? `outline-${color}-highlight` : `outline-${color}`
}

const responsiveClasses = (classes: readonly string[]) =>
  responsivePrefixes.flatMap(prefix => classes.map(className => `${prefix}${className}`))

const spacingSafelist = responsiveClasses(
  spacingUtilityPrefixes.flatMap(prefix => spacingTokens.map(token => `${prefix}-${token}`)),
)

const negativeSpacingSafelist = responsiveClasses(
  negativeSpacingUtilityPrefixes.flatMap(prefix => spacingTokens.slice(1).map(token => `-${prefix}-${token}`)),
)

const radiusSafelist = responsiveClasses(radiusUtilities)

const sprinklesClasses = [
  'hidden',
  'block',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'flex-row',
  'flex-col',
  'items-stretch',
  'items-start',
  'items-center',
  'items-end',
  'justify-start',
  'justify-center',
  'justify-end',
  'justify-between',
  'w-auto',
  'w-full',
  'h-auto',
  'h-full',
  ...[...semanticColorUtilities, ...stateColorUtilities].map(color => `text-${color}`),
  ...[...semanticColorUtilities, ...stateColorUtilities].map(color => `bg-${color}`),
  ...[...semanticColorUtilities, ...stateColorUtilities, ...stateBorderColorUtilities].map(color => `border-${color}`),
  ...sizeTokens.map(size => `[font-size:var(--font-size-${size})]`),
  ...sizeTokens.map(size => `leading-[var(--line-height-${size})]`),
  ...sizeTokens.map(size => `tracking-[var(--letter-spacing-${size})]`),
  'shadow-none',
  ...['1', '2', '3', '4', '5', '6'].map(shadow => `shadow-[var(--shadow-${shadow})]`),
]

const sprinklesSafelist = responsiveClasses(sprinklesClasses)

const arbitraryThemeColorUtilities = colorUtilityPrefixes.flatMap(prefix => [
  ...HUE_NAMES.flatMap(hue => HUE_STEPS.map(step => `${prefix}-[var(--${hue}-${step})]`)),
  ...SEMANTIC_COLOR_NAMES.flatMap(color =>
    SEMANTIC_COLOR_VAR_TOKENS.map(token => `${prefix}-[var(--color-${color}-${token})]`),
  ),
  ...CHART_COLOR_KEYS.map(chart => `${prefix}-[var(--chart-${chart.slice('chart'.length)})]`),
])

const surfaceColorUtilities = surfaceColorNames.flatMap(color => [
  `bg-${color}-solid`,
  `bg-${color}-soft`,
  `bg-${color}-surface`,
  `text-${color}`,
  `text-${color}-contrast`,
  `border-${color}`,
  surfaceStateBackgroundUtility(color),
  `hover:${surfaceStateBackgroundUtility(color)}`,
  `hover:${surfaceStateBackgroundUtility(color, 'container')}`,
  `active:${surfaceStateBackgroundUtility(color)}`,
  `active:${surfaceStateBackgroundUtility(color, 'container')}`,
  `data-[selected]:${surfaceStateBackgroundUtility(color)}`,
  `focus-visible:${surfaceFocusOutlineUtility(color)}`,
])

const surfaceStateUtilities = [
  'bg-transparent',
  'border-transparent',
  '[background-image:none]',
  'hover:brightness-[0.96]',
  'active:brightness-[0.92]',
  'active:brightness-[0.98]',
  'focus-visible:outline-solid',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-2',
  'focus-visible:outline-none',
] as const

const textSizeUtilities = {
  xs: ['var(--font-size-xs)', 'var(--line-height-xs)'],
  sm: ['var(--font-size-sm)', 'var(--line-height-sm)'],
  base: ['var(--font-size-md)', 'var(--line-height-md)'],
  lg: ['var(--font-size-lg)', 'var(--line-height-lg)'],
  xl: ['var(--font-size-xl)', 'var(--line-height-xl)'],
  '2xl': ['var(--font-size-2x)', 'var(--line-height-2x)'],
  '3xl': ['var(--font-size-3x)', 'var(--line-height-3x)'],
  '4xl': ['var(--font-size-4x)', 'var(--line-height-4x)'],
  '5xl': ['var(--font-size-5x)', 'var(--line-height-5x)'],
} as const

const fontWeightUtilities = {
  normal: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
} as const

export const baseUnoConfig = {
  presets: [
    presetWind4({
      preflights: {
        theme: true,
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  rules: [
    [
      surfaceBackgroundRule,
      ([, color, role]) => {
        const roles = surfaceColors[color as SurfaceColorName]
        if (!roles) return

        return {
          'background-color': roles[role as 'solid' | 'soft' | 'surface'],
        }
      },
    ],
    [
      surfaceHighlightBackgroundRule,
      ([, color]) => ({
        'background-color': surfaceSemanticColors[color as ChromaticSurfaceColorName].highlight,
      }),
    ],
    [
      surfaceBorderRule,
      ([, color]) => {
        const roles = surfaceColors[color as SurfaceColorName]
        if (!roles) return

        return {
          'border-color': roles.border,
        }
      },
    ],
    [
      surfaceOutlineRule,
      ([, color]) => {
        const roles = surfaceColors[color as SurfaceColorName]
        if (!roles) return

        return {
          'outline-color': roles.border,
        }
      },
    ],
    [
      surfaceHighlightOutlineRule,
      ([, color]) => ({
        'outline-color': surfaceSemanticColors[color as ChromaticSurfaceColorName].highlight,
      }),
    ],
    [
      surfaceTextRule,
      ([, color, contrast]) => {
        const roles = surfaceColors[color as SurfaceColorName]
        if (!roles) return

        return {
          color: contrast ? roles.contrast : roles.text,
        }
      },
    ],
    [
      rawHueColorRule,
      ([, utility, hue, step]) => {
        const value = `var(--${hue}-${step})`

        if (utility === 'bg') return { 'background-color': value }
        if (utility === 'border') return { 'border-color': value }

        return { color: value }
      },
    ],
    [
      /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)$/,
      ([, size]) => {
        const values = textSizeUtilities[size as keyof typeof textSizeUtilities]
        if (!values) return
        const [fontSize, lineHeight] = values
        return {
          'font-size': fontSize,
          'line-height': lineHeight,
        }
      },
    ],
    [
      /^(?:font|fw)-(normal|medium|semibold|bold)$/,
      ([, weight]) => {
        const value = fontWeightUtilities[weight as keyof typeof fontWeightUtilities]
        if (!value) return
        return {
          '--un-font-weight': value,
          'font-weight': value,
        }
      },
    ],
  ],
  theme: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: {
        DEFAULT: 'var(--color-neutral-surface)',
        foreground: 'var(--color-neutral-text)',
      },
      popover: {
        DEFAULT: 'var(--color-neutral-surface)',
        foreground: 'var(--color-neutral-text)',
      },
      primary: {
        DEFAULT: 'var(--color-primary-primary)',
        foreground: 'var(--color-primary-contrast)',
      },
      secondary: {
        DEFAULT: 'var(--color-secondary-soft)',
        foreground: 'var(--color-secondary-text)',
      },
      muted: {
        DEFAULT: 'var(--color-neutral-soft)',
        foreground: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
      },
      accent: {
        DEFAULT: 'var(--color-accent-soft)',
        foreground: 'var(--color-accent-text)',
      },
      destructive: {
        DEFAULT: 'var(--color-error-primary)',
        foreground: 'var(--color-error-contrast)',
      },
      border: 'var(--color-neutral-border)',
      input: 'var(--color-neutral-border-subtle)',
      ring: 'var(--color-primary-primary)',
      chart: {
        1: 'var(--chart-1)',
        2: 'var(--chart-2)',
        3: 'var(--chart-3)',
        4: 'var(--chart-4)',
        5: 'var(--chart-5)',
      },
      sidebar: {
        DEFAULT: 'var(--sidebar)',
        foreground: 'var(--sidebar-foreground)',
        primary: 'var(--sidebar-primary)',
        'primary-foreground': 'var(--sidebar-primary-foreground)',
        accent: 'var(--sidebar-accent)',
        'accent-foreground': 'var(--sidebar-accent-foreground)',
        border: 'var(--sidebar-border)',
        ring: 'var(--sidebar-ring)',
      },
    },
    radius: {
      none: '0',
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 4px)',
      '2xl': 'calc(var(--radius) + 8px)',
      '3xl': 'calc(var(--radius) + 12px)',
      '4xl': 'calc(var(--radius) + 16px)',
      full: '9999px',
    },
    spacing: {
      0: '0',
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      3: 'var(--space-3)',
      4: 'var(--space-4)',
      5: 'var(--space-5)',
      6: 'var(--space-6)',
      7: 'var(--space-7)',
      8: 'var(--space-8)',
      9: 'var(--space-9)',
    },
    text: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
    },
    boxShadow: {
      '2xs': '0 1px rgb(0 0 0 / 0.05)',
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
    font: {
      sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    breakpoint: {
      xs: '520px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1640px',
    },
  },
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
    'grid-cols-none',
    'grid-rows-1',
    'grid-rows-2',
    'grid-rows-3',
    'grid-rows-4',
    'grid-rows-5',
    'grid-rows-6',
    'grid-rows-none',
    ...Array.from({ length: 12 }, (_, i) => `col-span-${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `sm:col-span-${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `md:col-span-${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `lg:col-span-${i + 1}`),
    ...spacingSafelist,
    ...negativeSpacingSafelist,
    ...radiusSafelist,
    ...sprinklesSafelist,
    ...arbitraryThemeColorUtilities,
    ...surfaceColorUtilities,
    ...surfaceStateUtilities,
  ],
}

export default defineConfig(baseUnoConfig)
