import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color } from '@/theme/tokens'
import type { iconButtonPropDefs } from './icon-button.props'

type IconButtonVariant = (typeof iconButtonPropDefs.variant.values)[number]
const iconButtonVariants = ['solid', 'soft', 'outline', 'ghost'] as const satisfies readonly IconButtonVariant[]

export const iconButtonBase = 'border-0 border-solid'

const iconButtonColorByVariant = {
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<IconButtonVariant, (recipe: SemanticColorClassRecipe) => string>

const iconButtonHoverByVariant = {
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
  ghost: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
} satisfies Record<IconButtonVariant, (recipe: SemanticColorClassRecipe) => string>

const highContrastInteractionFilter =
  'hover:contrast-[1.1] hover:saturate-[1.2] active:contrast-[1.15] active:saturate-[1.25]'

const iconButtonHighContrastHoverByVariant = {
  solid: () => highContrastInteractionFilter,
  soft: () => highContrastInteractionFilter,
  outline: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
  ghost: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg} ${highContrastInteractionFilter}`,
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

export const iconButtonHighContrastHoverColorVariants = createSemanticColorVariantClassMap(
  iconButtonVariants,
  (recipe, variant) => iconButtonHighContrastHoverByVariant[variant](recipe),
) as Record<Color, Record<IconButtonVariant, string>>

export const iconButtonHighContrastColorVariants = createSemanticColorVariantClassMap(
  iconButtonVariants,
  (recipe, variant) => iconButtonHighContrastByVariant[variant](recipe),
) as Record<Color, Record<IconButtonVariant, string>>

export const iconButtonSizeVariants = {
  xs: 'h-6 w-6 text-xs [&_svg]:h-3 [&_svg]:w-3',
  sm: 'h-7 w-7 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5',
  md: 'h-8 w-8 text-base [&_svg]:h-4 [&_svg]:w-4',
  lg: 'h-10 w-10 text-lg [&_svg]:h-5 [&_svg]:w-5',
  xl: 'h-11 w-11 text-xl [&_svg]:h-6 [&_svg]:w-6',
} as const

export const iconSizeVariants = {
  xs: 'h-3 w-3 text-xs [&_svg]:h-3 [&_svg]:w-3',
  sm: 'h-3.5 w-3.5 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5',
  md: 'h-4 w-4 text-base [&_svg]:h-4 [&_svg]:w-4',
  lg: 'h-5 w-5 text-lg [&_svg]:h-5 [&_svg]:w-5',
  xl: 'h-6 w-6 text-xl [&_svg]:h-6 [&_svg]:w-6',
} as const
