import { CHROMATIC_SURFACE_COLOR_NAMES } from '@incmix/theme'
import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
  semanticColorClassRecipes,
} from '../../theme/helpers/semantic-color-recipe'
import { normalizeChartColor, type SemanticColorKey } from '../../theme/props/color.prop'
import { SURFACE_COLOR_KEYS, type SurfaceColorKey } from '../../theme/tokens'
import { type SurfaceShape, type SurfaceVariant, surfaceVariants } from './surface.props'

export const surfaceVariantSurfaceShadow = '[box-shadow:var(--shadow-xs)]'
export const floatingSurfaceElevation =
  '[box-shadow:0_10px_30px_color-mix(in_oklch,black_14%,transparent),0_2px_10px_color-mix(in_oklch,black_8%,transparent)]'
export const floatingSurfaceSoftElevation =
  '[box-shadow:inset_0_1px_0_var(--color-panel-highlight),0_10px_30px_color-mix(in_oklch,black_10%,transparent),0_2px_10px_color-mix(in_oklch,black_6%,transparent)]'

type FloatingSurfaceSize = 'xs' | 'sm' | 'md' | 'lg'
type FloatingSurfaceMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'

export const floatingSurfaceSizeVariants: Record<FloatingSurfaceSize, string> = {
  xs: 'px-2 py-1 text-xs leading-4',
  sm: 'px-2.5 py-1 text-sm leading-5',
  md: 'px-3 py-1 text-base leading-6',
  lg: 'px-3.5 py-[0.4375rem] text-lg leading-[1.625rem]',
}

export const floatingSurfaceMaxWidthVariants: Record<FloatingSurfaceMaxWidth, string> = {
  xs: 'max-w-[20rem]',
  sm: 'max-w-[24rem]',
  md: 'max-w-[28rem]',
  lg: 'max-w-[32rem]',
  xl: 'max-w-[36rem]',
  none: 'max-w-none',
}

export const surfaceSquare = 'aspect-square'

export const surfaceShapeVariants = {
  rect: '',
  square: surfaceSquare,
  ellipse: 'rounded-full',
  circle: `${surfaceSquare} rounded-full`,
  hexagon: '[clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]',
  pill: 'rounded-full',
} as const satisfies Record<SurfaceShape, string>

const surfaceUnoColorByVariant = {
  classic: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const surfaceUnoHoverByVariant = {
  classic: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  ghost: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const surfaceUnoHighContrastByVariant = {
  classic: recipe => `[background-image:none] ${recipe.highContrast.solid}`,
  solid: recipe => recipe.highContrast.solid,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent}`,
  surface: recipe => `${recipe.fill.container} ${recipe.highContrast.container} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.highContrast.outline}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.highContrast.ghost}`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

function surfaceUnoColorClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoColorByVariant[variant](semanticColorClassRecipes[color])
}

function surfaceUnoHoverClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoHoverByVariant[variant](semanticColorClassRecipes[color])
}

function surfaceUnoSelectedClassName(color: SurfaceColorKey) {
  return semanticColorClassRecipes[color].state.selectedBg
}

function surfaceUnoFocusClassName(color: SurfaceColorKey) {
  return semanticColorClassRecipes[color].state.focus
}

function surfaceUnoHighContrastClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoHighContrastByVariant[variant](semanticColorClassRecipes[color])
}

export const surfaceUnoColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoColorClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

export const surfaceUnoHoverColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoHoverClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

export const surfaceUnoSelectedColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, surfaceUnoSelectedClassName(color)]),
) as Record<SurfaceColorKey, string>

export const surfaceUnoFocusColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, surfaceUnoFocusClassName(color)]),
) as Record<SurfaceColorKey, string>

export const surfaceUnoHighContrastColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoHighContrastClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

const chromaticSurfaceColorSet = new Set<string>(CHROMATIC_SURFACE_COLOR_NAMES)

type FloatingSurfaceVariant = 'solid' | 'soft' | 'surface' | 'outline'

export const floatingSurfaceHighContrastEffectByVariant: Record<FloatingSurfaceVariant, string> = {
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

  return colorToken(recipe, role)
}

function highContrastSolidFillValue(recipe: SemanticColorClassRecipe) {
  return chartSurfaceRoleValue(recipe.colorName, 'solid') ?? colorToken(recipe, 'text')
}

function highContrastSoftFillValue(recipe: SemanticColorClassRecipe) {
  if (chromaticSurfaceColorSet.has(recipe.colorName)) return colorToken(recipe, 'solid-alpha')

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
    `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default} ${floatingSurfaceSoftElevation} ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'soft'), 'transparent')}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${floatingSurfaceElevation} ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'surface'), surfaceRoleValue(recipe, 'border'))}`,
  outline: recipe =>
    `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default} ${floatingSurfaceArrowVars('transparent', surfaceRoleValue(recipe, 'border'))}`,
} satisfies Record<FloatingSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const floatingSurfaceHighContrastColorByVariant = {
  solid: recipe => `${recipe.highContrast.solid} ${floatingSurfaceArrowVars(highContrastSolidFillValue(recipe))}`,
  soft: recipe =>
    `${recipe.highContrast.soft} ${recipe.border.transparent} ${floatingSurfaceSoftElevation} ${floatingSurfaceArrowVars(highContrastSoftFillValue(recipe), 'transparent')}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.highContrast.container} ${floatingSurfaceElevation} ${floatingSurfaceArrowVars(surfaceRoleValue(recipe, 'surface'), highContrastSolidFillValue(recipe))}`,
  outline: recipe =>
    `${recipe.fill.transparent} ${recipe.highContrast.outline} ${floatingSurfaceArrowVars('transparent', surfaceRoleValue(recipe, 'border'))}`,
} satisfies Record<FloatingSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

export const floatingSurfaceColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceColorByVariant[variant](recipe),
) as Record<SemanticColorKey, Record<FloatingSurfaceVariant, string>>

export const floatingSurfaceHighContrastColorVariants = createSemanticColorVariantClassMap(
  ['solid', 'soft', 'surface', 'outline'] as const,
  (recipe, variant) => floatingSurfaceHighContrastColorByVariant[variant](recipe),
) as Record<SemanticColorKey, Record<FloatingSurfaceVariant, string>>

export const floatingArrowBase =
  'flex data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-full data-[side=top]:bottom-0 data-[side=top]:translate-y-full data-[side=top]:rotate-180 data-[side=right]:left-0 data-[side=right]:-translate-x-full data-[side=right]:-rotate-90 data-[side=left]:right-0 data-[side=left]:translate-x-full data-[side=left]:rotate-90 ltr:data-[side=inline-end]:left-0 ltr:data-[side=inline-end]:-translate-x-full ltr:data-[side=inline-end]:-rotate-90 rtl:data-[side=inline-end]:right-0 rtl:data-[side=inline-end]:translate-x-full rtl:data-[side=inline-end]:rotate-90 ltr:data-[side=inline-start]:right-0 ltr:data-[side=inline-start]:translate-x-full ltr:data-[side=inline-start]:rotate-90 rtl:data-[side=inline-start]:left-0 rtl:data-[side=inline-start]:-translate-x-full rtl:data-[side=inline-start]:-rotate-90'

export const floatingArrowSurface =
  '[fill:var(--af-floating-surface-arrow-fill,currentColor)] [color:var(--af-floating-surface-arrow-edge,currentColor)]'

export const surfaceHighContrastByVariant = {
  classic: 'saturate-[1.1] brightness-[0.95]',
  solid: 'saturate-[1.1] brightness-[0.95]',
  soft: 'saturate-[1.2]',
  surface: '',
  outline: 'font-semibold',
  ghost: 'font-semibold',
} as const satisfies Record<SurfaceVariant, string>
