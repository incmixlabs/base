import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color } from '@/theme/tokens'
import type { iconButtonPropDefs } from './icon-button.props'

type IconButtonVariant = (typeof iconButtonPropDefs.variant.values)[number]
const iconButtonVariants = ['solid', 'soft', 'outline', 'ghost'] as const satisfies readonly IconButtonVariant[]

export const iconButtonSizeIconScope = 'af-icon-button-icon-scope'

export const iconButtonBase = 'af-icon-button-base'

const iconButtonColorByVariant = {
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<IconButtonVariant, (recipe: SemanticColorClassRecipe) => string>

const iconButtonHoverByVariant = {
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  ghost: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
} satisfies Record<IconButtonVariant, (recipe: SemanticColorClassRecipe) => string>

const iconButtonHighContrastByVariant = {
  solid: recipe => `${recipe.highContrast.solid} saturate-[1.1] brightness-[0.95] shadow-[var(--shadow-3)]`,
  soft: recipe => `${recipe.highContrast.soft} ${recipe.border.transparent} saturate-[1.2]`,
  outline: recipe =>
    `${recipe.fill.transparent} ${recipe.highContrast.outline} font-semibold contrast-[1.15] saturate-[1.1]`,
  ghost: recipe =>
    `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.highContrast.ghost} font-semibold contrast-[1.15] saturate-[1.1]`,
} satisfies Record<IconButtonVariant, (recipe: SemanticColorClassRecipe) => string>

export const iconButtonColorVariants = createSemanticColorVariantClassMap(iconButtonVariants, (recipe, variant) =>
  iconButtonColorByVariant[variant](recipe),
) as Record<Color, Record<IconButtonVariant, string>>

export const iconButtonHoverColorVariants = createSemanticColorVariantClassMap(iconButtonVariants, (recipe, variant) =>
  iconButtonHoverByVariant[variant](recipe),
) as Record<Color, Record<IconButtonVariant, string>>

export const iconButtonHighContrastColorVariants = createSemanticColorVariantClassMap(
  iconButtonVariants,
  (recipe, variant) => iconButtonHighContrastByVariant[variant](recipe),
) as Record<Color, Record<IconButtonVariant, string>>

export const iconButtonSizeVariants = {
  xs: 'af-icon-button-size-xs',
  sm: 'af-icon-button-size-sm',
  md: 'af-icon-button-size-md',
  lg: 'af-icon-button-size-lg',
  xl: 'af-icon-button-size-xl',
} as const

export const iconSizeVariants = {
  xs: 'af-icon-size-xs',
  sm: 'af-icon-size-sm',
  md: 'af-icon-size-md',
  lg: 'af-icon-size-lg',
  xl: 'af-icon-size-xl',
} as const
