import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color } from '@/theme/tokens'
import { surfaceVariantSurfaceShadow } from './Surface.css'

export type ControlSurfaceVariant = 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'

const controlSurfaceColorByVariant = {
  classic: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<ControlSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const controlSurfaceHoverByVariant = {
  classic: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
  ghost: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
} satisfies Record<ControlSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const highContrastInteractionFilter =
  'hover:contrast-[1.1] hover:saturate-[1.2] active:contrast-[1.15] active:saturate-[1.25]'

const controlSurfaceHighContrastHoverByVariant = {
  classic: () => highContrastInteractionFilter,
  solid: () => highContrastInteractionFilter,
  soft: () => highContrastInteractionFilter,
  surface: () => highContrastInteractionFilter,
  outline: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
  ghost: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg} ${highContrastInteractionFilter}`,
} satisfies Record<ControlSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const controlSurfaceHighContrastByVariant = {
  classic: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95]`,
  solid: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95]`,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent} saturate-[1.2]`,
  surface: recipe => `${recipe.fill.container} ${recipe.highContrast.container} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.highContrast.outline} font-semibold`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.highContrast.ghost} font-semibold`,
} satisfies Record<ControlSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

export function createControlSurfaceClassMaps<VariantName extends ControlSurfaceVariant>(
  variants: readonly VariantName[],
) {
  return {
    color: createSemanticColorVariantClassMap(variants, (recipe, variant) =>
      controlSurfaceColorByVariant[variant](recipe),
    ) as Record<Color, Record<VariantName, string>>,
    hover: createSemanticColorVariantClassMap(variants, (recipe, variant) =>
      controlSurfaceHoverByVariant[variant](recipe),
    ) as Record<Color, Record<VariantName, string>>,
    highContrastHover: createSemanticColorVariantClassMap(variants, (recipe, variant) =>
      controlSurfaceHighContrastHoverByVariant[variant](recipe),
    ) as Record<Color, Record<VariantName, string>>,
    highContrast: createSemanticColorVariantClassMap(variants, (recipe, variant) =>
      controlSurfaceHighContrastByVariant[variant](recipe),
    ) as Record<Color, Record<VariantName, string>>,
  }
}
