import { CHROMATIC_SURFACE_COLOR_NAMES } from '@incmix/theme'
import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '../../theme/helpers/semantic-color-recipe'
import { normalizeChartColor } from '../../theme/props/color.prop'
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

function colorToken(recipe: SemanticColorClassRecipe, token: string) {
  return `var(--color-${recipe.colorName}-${token})`
}

function chartSurfaceRoleValue(colorName: string, role: 'solid' | 'soft' | 'surface' | 'border') {
  const chartColor = normalizeChartColor(colorName)
  if (!chartColor) return undefined

  const chartIndex = chartColor.slice('chart'.length)
  const chartValue = `var(--chart-${chartIndex})`

  if (role === 'solid') return chartValue
  if (role === 'soft') return `color-mix(in_oklch,${chartValue}_28%,var(--color-light-surface))`
  if (role === 'surface') return `color-mix(in_oklch,${chartValue}_12%,var(--color-light-surface))`
  return `color-mix(in_oklch,${chartValue}_28%,var(--color-light-border))`
}

function surfaceRoleValue(recipe: SemanticColorClassRecipe, role: 'solid' | 'soft' | 'surface' | 'border') {
  const chartValue = chartSurfaceRoleValue(recipe.colorName, role)
  if (chartValue) return chartValue

  const semanticToken = role === 'solid' ? 'primary' : role
  return colorToken(recipe, semanticToken)
}

function highContrastSolidFillValue(recipe: SemanticColorClassRecipe) {
  return chartSurfaceRoleValue(recipe.colorName, 'solid') ?? colorToken(recipe, 'text')
}

function highContrastSoftFillValue(recipe: SemanticColorClassRecipe) {
  if (chromaticSurfaceColorSet.has(recipe.colorName)) return colorToken(recipe, 'primary-alpha')

  const chartColor = normalizeChartColor(recipe.colorName)
  if (chartColor) {
    const chartIndex = chartColor.slice('chart'.length)
    return `color-mix(in_oklch,var(--chart-${chartIndex})_36%,var(--color-light-surface))`
  }

  return colorToken(recipe, 'soft-hover')
}

function floatingSurfaceArrowVars(fill: string, edge = fill) {
  return `[--af-floating-surface-arrow-fill:${fill}] [--af-floating-surface-arrow-edge:${edge}]`
}

const floatingSurfaceColorByVariant = {
  solid: recipe =>
    `${recipe.fill.solid} ${recipe.border.highContrast} ${recipe.text.contrast} ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'solid'), highContrastSolidFillValue(recipe))}`,
  soft: recipe =>
    `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default} ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'soft'), 'transparent')}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} [box-shadow:var(--shadow-xs)] ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'surface'), surfaceRoleValue(recipe, 'border'))}`,
  outline: recipe =>
    `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default} ${floatingSurfaceArrowVars('transparent', surfaceRoleValue(recipe, 'border'))}`,
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

const floatingSurfaceHighContrastColorByVariant = {
  solid: recipe => `${recipe.highContrast.solid} ${floatingSurfaceArrowVars(highContrastSolidFillValue(recipe))}`,
  soft: recipe =>
    `${recipe.highContrast.soft} ${recipe.border.transparent} ${floatingSurfaceArrowVars(highContrastSoftFillValue(recipe), 'transparent')}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.highContrast.container} [box-shadow:var(--shadow-xs)] ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'surface'), highContrastSolidFillValue(recipe))}`,
  outline: recipe =>
    `${recipe.fill.transparent} ${recipe.highContrast.outline} ${floatingSurfaceArrowVars('transparent', surfaceRoleValue(recipe, 'border'))}`,
} satisfies Record<PopoverContentVariant, (recipe: SemanticColorClassRecipe) => string>

export const floatingSurfaceColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const floatingSurfaceHighContrastColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceHighContrastColorByVariant[variant](recipe),
) as Record<Color, Record<PopoverContentVariant, string>>

export const popoverContentBase =
  'relative box-border overflow-visible rounded-[var(--element-border-radius)] outline-none duration-200 ease-out data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-50 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-50 [min-width:var(--popover-trigger-width,var(--radix-popover-trigger-width))] [transform-origin:var(--transform-origin,var(--radix-popover-content-transform-origin))]'
