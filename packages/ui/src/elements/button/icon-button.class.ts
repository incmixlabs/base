import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '@/theme/helpers/semantic-color-recipe'
import type { Color } from '@/theme/tokens'
import type { iconButtonPropDefs } from './icon-button.props'

type IconButtonVariant = (typeof iconButtonPropDefs.variant.values)[number]
type IconButtonSize = (typeof iconButtonPropDefs.size.values)[number]
const iconButtonVariants = ['solid', 'soft', 'outline', 'ghost'] as const satisfies readonly IconButtonVariant[]
const iconButtonSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly IconButtonSize[]

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

const iconControlSizeVariants = {
  xs: {
    button: 'h-[1.5rem] w-[1.5rem] text-xs',
    icon: 'h-[0.75rem] w-[0.75rem] text-xs',
    svg: 'h-[0.75rem] w-[0.75rem]',
  },
  sm: {
    button: 'h-[1.75rem] w-[1.75rem] text-sm',
    icon: 'h-[0.875rem] w-[0.875rem] text-sm',
    svg: 'h-[0.875rem] w-[0.875rem]',
  },
  md: {
    button: 'h-[2rem] w-[2rem] text-base',
    icon: 'h-[1rem] w-[1rem] text-base',
    svg: 'h-[1rem] w-[1rem]',
  },
  lg: {
    button: 'h-[2.5rem] w-[2.5rem] text-lg',
    icon: 'h-[1.25rem] w-[1.25rem] text-lg',
    svg: 'h-[1.25rem] w-[1.25rem]',
  },
  xl: {
    button: 'h-[2.75rem] w-[2.75rem] text-xl',
    icon: 'h-[1.5rem] w-[1.5rem] text-xl',
    svg: 'h-[1.5rem] w-[1.5rem]',
  },
} as const satisfies Record<IconButtonSize, { button: string; icon: string; svg: string }>

export const iconButtonSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].button]),
) as Record<IconButtonSize, string>

export const iconSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].icon]),
) as Record<IconButtonSize, string>

export const iconSvgSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].svg]),
) as Record<IconButtonSize, string>
