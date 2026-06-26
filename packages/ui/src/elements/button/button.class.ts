import { surfaceVariantSurfaceShadow } from '@/elements/surface/Surface.css'
import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color, Variant } from '@/theme/tokens'

export const buttonBaseCls =
  'relative inline-flex items-center justify-center select-none border outline-none box-border'

export const buttonLoadingContentCls = 'af-button-loading-content inline-flex items-center justify-center gap-[inherit]'

export const buttonLoadingOverlayCls = 'af-button-loading-overlay absolute inset-0 flex items-center justify-center'

export const buttonSizeIconScope = 'af-button-icon-scope'

export const buttonSizeVariants = {
  xs: 'af-button-size-xs',
  sm: 'af-button-size-sm',
  md: 'af-button-size-md',
  lg: 'af-button-size-lg',
  xl: 'af-button-size-xl',
} as const

export const buttonMotion = 'af-button-motion'

export const buttonLoading = 'af-button-loading'

const buttonColorByVariant = {
  classic: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const buttonHoverByVariant = {
  classic: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  ghost: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const buttonHighContrastByVariant = {
  classic: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95]`,
  solid: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95]`,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent} saturate-[1.2]`,
  surface: recipe => `${recipe.fill.container} ${recipe.highContrast.container} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.highContrast.outline} font-semibold`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.highContrast.ghost} font-semibold`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

export const buttonColorVariants = createSemanticColorVariantClassMap(surfaceVariants, (recipe, variant) =>
  buttonColorByVariant[variant](recipe),
) as Record<Color, Record<Variant, string>>

export const buttonHoverColorVariants = createSemanticColorVariantClassMap(surfaceVariants, (recipe, variant) =>
  buttonHoverByVariant[variant](recipe),
) as Record<Color, Record<Variant, string>>

export const buttonHighContrastColorVariants = createSemanticColorVariantClassMap(surfaceVariants, (recipe, variant) =>
  buttonHighContrastByVariant[variant](recipe),
) as Record<Color, Record<Variant, string>>
