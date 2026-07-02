import { type SemanticColorClassRecipe, semanticColorClassRecipes } from '../../theme/helpers/semantic-color-recipe'
import { normalizeChartColor } from '../../theme/props/color.prop'
import { SURFACE_COLOR_KEYS, type SurfaceColorKey } from '../../theme/tokens'

export const boxRootBase = 'box-border'

const boxSurfaceVariants = ['solid', 'soft', 'surface'] as const
const boxTextValues = ['auto', 'contrast', 'text', 'primary', 'inverse'] as const

export type BoxSurfaceVariant = (typeof boxSurfaceVariants)[number]
export type BoxTextValue = (typeof boxTextValues)[number]

const boxFillByVariant = {
  solid: (recipe: SemanticColorClassRecipe) => recipe.fill.solid,
  soft: (recipe: SemanticColorClassRecipe) => recipe.fill.soft,
  surface: (recipe: SemanticColorClassRecipe) => recipe.fill.container,
} as const satisfies Record<BoxSurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

function boxPrimaryTextClassName(recipe: SemanticColorClassRecipe) {
  const chartColor = normalizeChartColor(recipe.colorName)
  if (chartColor) return `[color:var(--chart-${chartColor.slice('chart'.length)})]`

  return `[color:var(--color-${recipe.colorName}-solid)]`
}

const boxTextByValue = {
  auto: (recipe: SemanticColorClassRecipe, variant: BoxSurfaceVariant) =>
    variant === 'solid' ? recipe.text.contrast : recipe.text.default,
  contrast: (recipe: SemanticColorClassRecipe) => recipe.text.contrast,
  text: (recipe: SemanticColorClassRecipe) => recipe.text.default,
  primary: boxPrimaryTextClassName,
  inverse: () => 'text-inverse',
} as const satisfies Record<BoxTextValue, (recipe: SemanticColorClassRecipe, variant: BoxSurfaceVariant) => string>

function boxSurfaceClassName(color: SurfaceColorKey, variant: BoxSurfaceVariant, text: BoxTextValue) {
  const recipe = semanticColorClassRecipes[color]
  return `${boxFillByVariant[variant](recipe)} ${boxTextByValue[text](recipe, variant)}`
}

export function getBoxSurfaceClassName(
  color: SurfaceColorKey | string | undefined,
  variant: BoxSurfaceVariant | undefined = 'surface',
  text: BoxTextValue | undefined = 'auto',
) {
  if (!color || !Object.hasOwn(semanticColorClassRecipes, color)) return undefined

  return boxSurfaceClassName(color as SurfaceColorKey, variant, text)
}

export const boxSurfaceColorClassNames = SURFACE_COLOR_KEYS.flatMap(color =>
  boxSurfaceVariants.flatMap(variant => boxTextValues.map(text => boxSurfaceClassName(color, variant, text))),
)
