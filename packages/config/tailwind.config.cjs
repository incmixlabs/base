/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
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
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
        '4xl': 'calc(var(--radius) + 16px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      screens: {
        xs: '520px',
        sm: '768px',
        md: '1024px',
        lg: '1280px',
        xl: '1640px',
      },
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
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
    {
      pattern:
        /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|inset|top|right|bottom|left)-(0|1|2|3|4|5|6|8|10|12)$/,
    },
    {
      pattern: /^-(m|mx|my|mt|mr|mb|ml)-(0|1|2|3|4|5|6|8|10|12)$/,
    },
    {
      pattern: /^col-span-(1[0-2]|[1-9])$/,
    },
    {
      pattern: /^(xs|sm|md|lg|xl):col-span-(1[0-2]|[1-9])$/,
    },
  ],
}
