import { type SemanticColorClassRecipe, semanticColorClassRecipes } from '../../theme/helpers/semantic-color-recipe'
import { SURFACE_COLOR_KEYS, type SurfaceColorKey } from '../../theme/tokens'
import { type SurfaceShape, type SurfaceVariant, surfaceVariants } from './surface.props'

export const surfaceVariantSurfaceShadow = '[box-shadow:var(--af-surface-variant-surface-box-shadow,var(--shadow-xs))]'

export const surfaceSquare = 'aspect-square'

export const surfaceShapeVariants = {
  rect: '',
  square: surfaceSquare,
  ellipse: 'rounded-[var(--af-surface-shape-ellipse-radius,50%)]',
  circle: `${surfaceSquare} rounded-[var(--af-surface-shape-circle-radius,9999px)]`,
  hexagon: '[clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]',
  pill: 'rounded-[var(--af-surface-shape-pill-radius,9999px)]',
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
