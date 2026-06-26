import { surfaceVariantSurfaceShadow } from '@/elements/surface/Surface.css'
import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color } from '@/theme/tokens'
import type { BadgeVariant } from './badge.props'

export const badgeBaseCls =
  'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 leading-none h-fit'

export const badgeBase = 'af-badge-base'
export const badgeIconBase = 'af-badge-icon-base'
export const badgeDeleteButtonBase = 'af-badge-delete-button-base'
export const badgeAvatarBase = 'af-badge-avatar-base'

export const badgeSizeVariants = {
  xs: 'af-badge-size-xs',
  sm: 'af-badge-size-sm',
  md: 'af-badge-size-md',
} as const

export const badgeDeleteButtonSizeVariants = {
  xs: 'af-badge-delete-button-size-xs',
  sm: 'af-badge-delete-button-size-sm',
  md: 'af-badge-delete-button-size-md',
} as const

export const badgeIconSizeVariants = {
  xs: 'af-badge-icon-size-xs',
  sm: 'af-badge-icon-size-sm',
  md: 'af-badge-icon-size-md',
} as const

export const badgeAvatarSizeVariants = {
  xs: 'af-badge-avatar-size-xs',
  sm: 'af-badge-avatar-size-sm',
  md: 'af-badge-avatar-size-md',
} as const

const badgeVariants = ['solid', 'soft', 'surface', 'outline'] as const satisfies readonly BadgeVariant[]

const badgeColorByVariant = {
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
} satisfies Record<BadgeVariant, (recipe: SemanticColorClassRecipe) => string>

const badgeHoverByVariant = {
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
} satisfies Record<BadgeVariant, (recipe: SemanticColorClassRecipe) => string>

const badgeHighContrastByVariant = {
  solid: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95]`,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent} saturate-[1.2]`,
  surface: recipe => `${recipe.fill.container} ${recipe.highContrast.container} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.highContrast.outline} font-semibold`,
} satisfies Record<BadgeVariant, (recipe: SemanticColorClassRecipe) => string>

export const badgeColorVariants = createSemanticColorVariantClassMap(badgeVariants, (recipe, variant) =>
  badgeColorByVariant[variant](recipe),
) as Record<Color, Record<BadgeVariant, string>>

export const badgeHoverColorVariants = createSemanticColorVariantClassMap(badgeVariants, (recipe, variant) =>
  badgeHoverByVariant[variant](recipe),
) as Record<Color, Record<BadgeVariant, string>>

export const badgeHighContrastColorVariants = createSemanticColorVariantClassMap(badgeVariants, (recipe, variant) =>
  badgeHighContrastByVariant[variant](recipe),
) as Record<Color, Record<BadgeVariant, string>>

export const badgeVariantBorderWidth = {
  solid: 'border-0',
  soft: 'border-0',
  outline: 'border-1',
  surface: 'border-1',
} as const
