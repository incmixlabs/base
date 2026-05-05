/**
 * Gradient presets inspired by popular gradient collections
 * (gradient.page, uigradients.com, webgradients.com).
 */
export interface GradientPreset {
  /** Human-readable name. */
  name: string
  /** Array of CSS color stops (at least two). */
  colors: readonly [string, string, ...string[]]
}

export const gradientPresets = {
  sunset: {
    name: 'Sunset',
    colors: ['var(--yellow-6)', 'var(--orange-9)', 'var(--red-9)', 'var(--crimson-11)'],
  },
  ocean: {
    name: 'Ocean',
    colors: ['var(--cyan-7)', 'var(--blue-9)', 'var(--indigo-9)', 'var(--violet-12)'],
  },
  forest: {
    name: 'Forest',
    colors: ['var(--green-5)', 'var(--green-9)', 'var(--teal-9)', 'var(--teal-12)'],
  },
  aurora: {
    name: 'Aurora',
    colors: ['var(--teal-7)', 'var(--violet-8)', 'var(--pink-9)', 'var(--green-8)'],
  },
  lavender: {
    name: 'Lavender',
    colors: ['var(--blue-6)', 'var(--purple-8)', 'var(--pink-9)', 'var(--pink-6)'],
  },
  peach: {
    name: 'Peach',
    colors: ['var(--amber-5)', 'var(--orange-8)', 'var(--red-9)', 'var(--crimson-9)'],
  },
  midnight: {
    name: 'Midnight',
    colors: ['var(--indigo-12)', 'var(--purple-9)', 'var(--blue-7)', 'var(--violet-11)'],
  },
  tropical: {
    name: 'Tropical',
    colors: ['var(--yellow-8)', 'var(--green-8)', 'var(--cyan-9)', 'var(--blue-9)'],
  },
  berry: {
    name: 'Berry',
    colors: ['var(--indigo-9)', 'var(--purple-9)', 'var(--plum-9)', 'var(--pink-9)'],
  },
  cosmic: {
    name: 'Cosmic',
    colors: ['var(--blue-9)', 'var(--violet-9)', 'var(--pink-9)', 'var(--orange-9)'],
  },
} as const satisfies Record<string, GradientPreset>

export type GradientPresetKey = keyof typeof gradientPresets
