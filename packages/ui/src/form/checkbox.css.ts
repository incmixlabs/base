import { style, styleVariants } from '@vanilla-extract/css'
import type { Variants } from 'motion/react'
import { getControlSizeValues } from '@/elements/control-size'
import { surfaceHighContrastByVariant } from '@/elements/surface/surface.css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { checkboxSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import { type FormSize, formSizes } from './form-size'

export const checkboxBase =
  'inline-flex shrink-0 items-center justify-center outline-none transition-colors duration-150 ease-in-out'

export const checkboxBaseCls = 'peer'

export const checkboxIndicator = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'var(--cb-icon-size)',
  height: 'var(--cb-icon-size)',
  flexShrink: 0,
  color: 'inherit',
})

export type CheckboxVariant = 'solid' | 'soft' | 'outline'

const createCheckboxColorVariantStyles = (color: Color): Record<CheckboxVariant, string> => ({
  solid: style({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: semanticColorVar(color, 'border'),
    backgroundColor: 'var(--background)',
    color: semanticColorVar(color, 'contrast'),
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
        outlineOffset: '1px',
      },
      '&:hover': {
        borderColor: semanticColorVar(color, 'text'),
      },
      '&[data-checked], &[data-indeterminate]': {
        backgroundColor: semanticColorVar(color, 'primary'),
        borderColor: semanticColorVar(color, 'primary'),
        color: semanticColorVar(color, 'contrast'),
      },
    },
  }),
  soft: style({
    borderWidth: 0,
    backgroundColor: semanticColorVar(color, 'soft'),
    color: semanticColorVar(color, 'text'),
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
        outlineOffset: '1px',
      },
      '&[data-checked], &[data-indeterminate]': {
        backgroundColor: semanticColorVar(color, 'soft-hover'),
        color: semanticColorVar(color, 'text'),
      },
    },
  }),
  outline: style({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: semanticColorVar(color, 'border'),
    backgroundColor: 'transparent',
    color: semanticColorVar(color, 'text'),
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${semanticColorVar(color, 'primary-alpha')}`,
        outlineOffset: '1px',
      },
      '&:hover': {
        borderColor: semanticColorVar(color, 'text'),
      },
      '&[data-checked], &[data-indeterminate]': {
        borderColor: semanticColorVar(color, 'primary'),
        color: semanticColorVar(color, 'text'),
      },
    },
  }),
})

export const checkboxColorVariants: Record<Color, Record<CheckboxVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createCheckboxColorVariantStyles(color)]),
) as Record<Color, Record<CheckboxVariant, string>>

export const checkboxHighContrastByVariant: Record<CheckboxVariant, string> = {
  solid: surfaceHighContrastByVariant.solid,
  soft: surfaceHighContrastByVariant.soft,
  outline: surfaceHighContrastByVariant.outline,
}

// ── Size variants ──
// Checkbox-specific: boxSize and iconSize are intentionally smaller than
// the shared control-size tokens to match standard checkbox proportions.

export type CheckboxSize = FormSize

const checkboxOverrides: Record<FormSize, { boxSize: string; iconSize: string; borderRadius: string }> = {
  xs: { boxSize: '0.875rem', iconSize: getControlSizeValues('xs').iconSize, borderRadius: '0.125rem' },
  sm: { boxSize: '1rem', iconSize: '0.875rem', borderRadius: '0.125rem' },
  md: { boxSize: '1.25rem', iconSize: '1rem', borderRadius: '0.25rem' },
  lg: { boxSize: '1.5rem', iconSize: '1.25rem', borderRadius: '0.25rem' },
  //  xl: { boxSize: '1.75rem', iconSize: '1.5rem', borderRadius: '0.375rem' },
}

export const checkboxSizeVariants: Record<CheckboxSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const cb = checkboxOverrides[size]
      return [
        size,
        {
          width: checkboxSizeVar(size, 'boxSize', cb.boxSize),
          height: checkboxSizeVar(size, 'boxSize', cb.boxSize),
          borderRadius: checkboxSizeVar(size, 'borderRadius', cb.borderRadius),
          vars: {
            '--cb-icon-size': checkboxSizeVar(size, 'iconSize', cb.iconSize),
          },
        },
      ]
    }),
  ),
)

// ── Motion variants ──

export const checkboxCheckVariants: Variants = {
  checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2, delay: 0.2 } },
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
}
