import { CHROMATIC_SURFACE_COLOR_NAMES } from '@incmix/theme'
import type { Transition, Variants } from 'motion/react'
import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '../../theme/helpers/semantic-color-recipe'
import type { Color } from '../../theme/tokens'
import type { PopoverContentMaxWidth, PopoverContentSize, PopoverContentVariant } from './popover.props'

const chromaticSurfaceColorSet = new Set<string>(CHROMATIC_SURFACE_COLOR_NAMES)

export const floatingSurfaceSizeVariants: Record<PopoverContentSize, string> = {
  xs: 'px-2 py-1 text-xs leading-4',
  sm: 'px-2.5 py-1 text-sm leading-5',
  md: 'px-3 py-1 text-base leading-6',
  lg: 'px-3.5 py-[0.4375rem] text-lg leading-[1.625rem]',
}

export const floatingSurfaceMaxWidthVariants: Record<PopoverContentMaxWidth, string> = {
  xs: 'max-w-[20rem]',
  sm: 'max-w-[24rem]',
  md: 'max-w-[28rem]',
  lg: 'max-w-[32rem]',
  xl: 'max-w-[36rem]',
  none: 'max-w-none',
}

export const floatingSurfaceHighContrastEffectByVariant: Record<PopoverContentVariant, string> = {
  solid: 'saturate-[1.1] brightness-[0.95]',
  soft: 'saturate-[1.2]',
  surface: '',
  outline: 'font-semibold',
}

const floatingSurfaceColorByVariant = {
  solid: recipe => `${recipe.fill.solid} ${recipe.border.highContrast} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} [box-shadow:var(--shadow-xs)]`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

const floatingSurfaceHighContrastColorByVariant = {
  solid: recipe => recipe.highContrast.solid,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent}`,
  surface: recipe => `${recipe.fill.container} ${recipe.highContrast.container} [box-shadow:var(--shadow-xs)]`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.highContrast.outline}`,
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

function colorToken(recipe: SemanticColorClassRecipe, token: string) {
  return `var(--color-${recipe.colorName}-${token})`
}

function floatingSurfaceHighContrastSoftArrowFill(recipe: SemanticColorClassRecipe) {
  return chromaticSurfaceColorSet.has(recipe.colorName)
    ? colorToken(recipe, 'primary-alpha')
    : colorToken(recipe, 'soft-hover')
}

const floatingSurfaceArrowColorByVariant = {
  solid: recipe => `[fill:${colorToken(recipe, 'primary')}] [color:${colorToken(recipe, 'text')}]`,
  soft: recipe => `[fill:${colorToken(recipe, 'soft')}] [color:transparent]`,
  surface: recipe => `[fill:${colorToken(recipe, 'surface')}] [color:${colorToken(recipe, 'border')}]`,
  outline: recipe => `[fill:transparent] [color:${colorToken(recipe, 'border')}]`,
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

const floatingSurfaceHighContrastArrowColorByVariant = {
  solid: recipe => `[fill:${colorToken(recipe, 'text')}] [color:${colorToken(recipe, 'text')}]`,
  soft: recipe => `[fill:${floatingSurfaceHighContrastSoftArrowFill(recipe)}] [color:transparent]`,
  surface: recipe => `[fill:${colorToken(recipe, 'surface')}] [color:${colorToken(recipe, 'text')}]`,
  outline: recipe => floatingSurfaceArrowColorByVariant.outline(recipe),
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

export const floatingSurfaceColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const floatingSurfaceHighContrastColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceHighContrastColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const floatingSurfaceArrowColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceArrowColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const floatingSurfaceHighContrastArrowColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceHighContrastArrowColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const popoverContentBase =
  'relative box-border overflow-visible rounded-[var(--element-border-radius)] outline-none [min-width:var(--popover-trigger-width,var(--radix-popover-trigger-width))] [transform-origin:var(--transform-origin,var(--radix-popover-content-transform-origin))]'

export const popoverPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
}

export const popoverPanelTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
}
