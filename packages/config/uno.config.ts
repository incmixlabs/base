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
const radiusUtilities = ['rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full'] as const

const responsiveClasses = (classes: readonly string[]) =>
  responsivePrefixes.flatMap(prefix => classes.map(className => `${prefix}${className}`))

const spacingSafelist = responsiveClasses(
  spacingUtilityPrefixes.flatMap(prefix => spacingTokens.map(token => `${prefix}-${token}`)),
)

const negativeSpacingSafelist = responsiveClasses(
  negativeSpacingUtilityPrefixes.flatMap(prefix => spacingTokens.slice(1).map(token => `-${prefix}-${token}`)),
)

const radiusSafelist = responsiveClasses(radiusUtilities)

export const baseUnoConfig = {
  presets: [presetWind4()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
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
    borderRadius: {
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
    fontSize: {
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
    fontFamily: {
      sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    breakpoints: {
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
  ],
}

export default defineConfig(baseUnoConfig)
