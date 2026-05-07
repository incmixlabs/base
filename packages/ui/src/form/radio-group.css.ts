import { styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceHighContrastByVariant } from '@/elements/surface/surface.css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { radioGroupVar, radioSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import { type FormSize, formSizes } from './form-size'

// ── Static base classes (tailwind) ──

export const radioBaseCls =
  'peer inline-flex items-center justify-center rounded-full border-2 border-input bg-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export type RadioVariant = 'classic' | 'surface' | 'soft'

// Radio is intentionally not a direct `surfaceColorVariants` consumer.
// The control combines an outer ring, checked fill, and inner indicator, so its
// color maps need local checked-state selectors. Shared surface high-contrast
// classes are still reused by matching variant.
const createBaseVariantStyle = (color: Color) => ({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
      outlineOffset: '1px',
    },
    '&:hover': {
      borderColor: semanticColorVar(color, 'text'),
    },
    '&[data-checked]': {
      borderColor: semanticColorVar(color, 'primary'),
      backgroundColor: semanticColorVar(color, 'primary'),
      backgroundImage: 'none',
    },
  },
})

const createClassicVariantStyle = (color: Color) => ({
  ...createBaseVariantStyle(color),
  borderColor: semanticColorVar(color, 'primary'),
  backgroundImage: `linear-gradient(to bottom, color-mix(in oklch, ${semanticColorVar(color, 'primary')} 88%, white), ${semanticColorVar(color, 'primary')})`,
  color: semanticColorVar(color, 'contrast'),
})

const createSurfaceVariantStyle = (color: Color) => ({
  ...createBaseVariantStyle(color),
  borderColor: semanticColorVar(color, 'border'),
  backgroundColor: semanticColorVar(color, 'surface'),
  color: semanticColorVar(color, 'primary'),
})

const createSoftVariantStyle = (color: Color) => {
  const base = createBaseVariantStyle(color)
  return {
    ...base,
    borderColor: semanticColorVar(color, 'border'),
    backgroundColor: semanticColorVar(color, 'soft'),
    color: semanticColorVar(color, 'primary'),
    selectors: {
      ...base.selectors,
      '&[data-checked]': {
        borderColor: semanticColorVar(color, 'primary'),
        backgroundColor: semanticColorVar(color, 'soft-hover'),
        backgroundImage: 'none',
      },
    },
  }
}

const createRadioColorVariantStyles = (color: Color): Record<RadioVariant, string> => ({
  classic: styleVariants({
    base: createClassicVariantStyle(color),
  }).base,
  surface: styleVariants({
    base: createSurfaceVariantStyle(color),
  }).base,
  soft: styleVariants({
    base: createSoftVariantStyle(color),
  }).base,
})

export const radioColorVariants: Record<Color, Record<RadioVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createRadioColorVariantStyles(color)]),
) as Record<Color, Record<RadioVariant, string>>

export const radioHighContrastByVariant: Record<RadioVariant, string> = {
  classic: surfaceHighContrastByVariant.classic,
  surface: surfaceHighContrastByVariant.surface,
  soft: surfaceHighContrastByVariant.soft,
}

// ── Size variants ──
// Radio-specific: radioSize is intentionally smaller than control-size iconSize
// to match standard radio indicator proportions.

export type RadioSize = FormSize

const radioIndicatorTokens: Record<FormSize, { radioSize: string }> = {
  xs: { radioSize: '0.75rem' },
  sm: { radioSize: '1rem' },
  md: { radioSize: '1.25rem' },
  lg: { radioSize: '1.5rem' },
  //  xl: { radioSize: '1.75rem' },
}

export const radioSizeVariants: Record<RadioSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const radio = radioIndicatorTokens[size]
      return [
        size,
        {
          width: radioSizeVar(size, 'radioSize', radio.radioSize),
          height: radioSizeVar(size, 'radioSize', radio.radioSize),
          vars: {
            '--radio-indicator-size': radioSizeVar(size, 'indicatorSize', `calc(${radio.radioSize} / 2)`),
          },
        },
      ]
    }),
  ),
)

// Gap-only variant for the label wrapper (no width/height constraints)
export const radioGapVariants: Record<RadioSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const controlSize = getControlSizeValues(size)
      return [size, { vars: { '--radio-gap': radioSizeVar(size, 'gap', controlSize.gap) } }]
    }),
  ),
)

export const radioGroupRootOrientation = styleVariants({
  vertical: {
    flexDirection: 'column',
    gap: radioGroupVar('gap', '0.5rem'),
  },
  horizontal: {
    flexDirection: 'row',
    gap: radioGroupVar('inlineGap', '1rem'),
  },
})
