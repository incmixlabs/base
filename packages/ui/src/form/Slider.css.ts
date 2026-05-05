import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'
import { sliderSizeVar, sliderVariantVar } from '@/theme/runtime/component-vars'
import { type FormSize, formSizes } from './form-size'

const sliderSizeTokens: Record<FormSize, { trackHeight: string; thumbSize: string }> = {
  xs: { trackHeight: '0.25rem', thumbSize: '0.75rem' },
  sm: { trackHeight: '0.375rem', thumbSize: '1rem' },
  md: { trackHeight: '0.5rem', thumbSize: '1.25rem' },
  lg: { trackHeight: '0.75rem', thumbSize: '1.5rem' },
  // xl: { trackHeight: '1rem', thumbSize: '1.75rem' },
}

export const sliderSizeVariants: Record<FormSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const token = sliderSizeTokens[size]
      return [
        size,
        {
          vars: {
            '--slider-track-height': sliderSizeVar(size, 'trackHeight', token.trackHeight),
            '--slider-thumb-size': sliderSizeVar(size, 'thumbSize', token.thumbSize),
          },
        },
      ]
    }),
  ),
)

export const sliderTrackVariantStyles = styleVariants({
  solid: {
    backgroundColor: 'var(--fc-primary-alpha)',
  },
  surface: {
    backgroundColor: semanticColorVar('neutral', 'surface'),
    border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  },
  classic: {
    backgroundColor: semanticColorVar('neutral', 'surface'),
    border: `1px solid ${semanticColorVar('neutral', 'border')}`,
    boxShadow: sliderVariantVar('classic', 'boxShadow', 'var(--shadow-xs)'),
  },
  soft: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
  },
})

// TODO(#244-followup): Consolidate slider/progress track + high-contrast styles
// into a shared helper once Slider high-contrast semantics are finalized.
export const sliderTrackHighContrast = style({
  borderColor: semanticColorVar('neutral', 'text'),
})

export const sliderIndicatorHighContrast = style({
  filter: 'saturate(1.15) contrast(1.05)',
})
