import {
  createSemanticColorVariantClassMap,
  type SemanticColorClassRecipe,
} from '../../theme/helpers/semantic-color-recipe'
import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type { calloutRootPropDefs } from './callout.props'

type CalloutVariant = 'soft' | 'surface' | 'solid' | 'outline' | 'split'
type CalloutSize = (typeof calloutRootPropDefs.size.values)[number]

export const calloutRootBaseCls =
  'box-border grid border [grid-template-columns:auto_1fr] items-start justify-start text-left rounded-[var(--element-border-radius)] transition-[background-color,color,border-color,box-shadow,filter] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const calloutIconBaseCls = 'flex items-center justify-center shrink-0'

export const calloutTextBase = 'm-0 min-w-0'

export const calloutRootSizeVariants = {
  sm: 'p-2.5 gap-x-1.5 gap-y-1.5',
  md: 'p-3 gap-x-2 gap-y-2',
  lg: 'p-3.5 gap-x-2.5 gap-y-2.5',
  xl: 'p-3.5 gap-x-[0.6875rem] gap-y-[0.6875rem]',
  '2x': 'p-6 gap-x-[0.875rem] gap-y-[0.875rem]',
} as const satisfies Record<CalloutSize, string>

export const calloutTextSizeVariants = {
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
  '2x': 'text-2xl leading-[2.25rem]',
} as const satisfies Record<CalloutSize, string>

export const calloutIconSizeVariants = {
  sm: 'h-[1.25rem] [&>svg]:h-[0.875rem] [&>svg]:w-[0.875rem]',
  md: 'h-[1.5rem] [&>svg]:h-[1rem] [&>svg]:w-[1rem]',
  lg: 'h-[1.625rem] [&>svg]:h-[1.25rem] [&>svg]:w-[1.25rem]',
  xl: 'h-[1.75rem] [&>svg]:h-[1.5rem] [&>svg]:w-[1.5rem]',
  '2x': 'h-[2.25rem] [&>svg]:h-[2rem] [&>svg]:w-[2rem]',
} as const satisfies Record<CalloutSize, string>

export const calloutSplitIconBase = 'self-stretch h-auto'
export const calloutSplitTextBase = 'flex items-center self-stretch min-w-0'
export const calloutSplitTextHover = 'group-hover:bg-neutral-soft'

export const calloutSplitSlotSizeVariants = {
  sm: 'px-2.5 py-2.5',
  md: 'px-3 py-3',
  lg: 'px-3.5 py-3.5',
  xl: 'px-3.5 py-3.5',
  '2x': 'px-6 py-6',
} as const satisfies Record<CalloutSize, string>

const calloutColorByVariant = {
  soft: recipe => `${recipe.fill.soft} ${recipe.border.default} ${recipe.text.default}`,
  surface: recipe => `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default}`,
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  split: recipe =>
    `group p-0 gap-0 overflow-hidden items-stretch border-1 border-solid ${recipe.border.default} bg-neutral-surface text-neutral`,
} satisfies Record<CalloutVariant, (recipe: SemanticColorClassRecipe) => string>

export const calloutColorVariants = createSemanticColorVariantClassMap(
  ['soft', 'surface', 'solid', 'outline', 'split'] as const,
  (recipe, variant) => calloutColorByVariant[variant](recipe),
) as Record<Color, Record<CalloutVariant, string>>

const calloutHoverByColorVariant = {
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  outline: recipe => `${recipe.state.hoverBg} ${recipe.state.activeBg}`,
  split: () => 'group',
} satisfies Record<CalloutVariant, (recipe: SemanticColorClassRecipe) => string>

export const calloutHoverColorVariants = createSemanticColorVariantClassMap(
  ['soft', 'surface', 'solid', 'outline', 'split'] as const,
  (recipe, variant) => calloutHoverByColorVariant[variant](recipe),
) as Record<Color, Record<CalloutVariant, string>>

export const calloutSplitIconColorVariants = createSemanticColorVariantClassMap(
  ['split'] as const,
  recipe => `${recipe.fill.solid} ${recipe.text.contrast}`,
) as Record<Color, Record<'split', string>>

export const calloutSplitTextColorVariants = createSemanticColorVariantClassMap(
  ['split'] as const,
  recipe => `bg-neutral-surface border-l ${recipe.border.default}`,
) as Record<Color, Record<'split', string>>

export const calloutInverseByVariant = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      soft: `text-${color}-contrast`,
      surface: '',
      solid: `text-${color}`,
      outline: '',
      split: '',
    },
  ]),
) as Record<Color, Record<CalloutVariant, string>>

export const calloutHighContrastByVariant = {
  soft: 'saturate-[1.2]',
  surface: 'font-semibold',
  solid: 'saturate-[1.1] brightness-[0.95]',
  outline: 'font-semibold',
  split: 'shadow-[inset_0_0_0_2px_var(--color-neutral-text)]',
} as const
