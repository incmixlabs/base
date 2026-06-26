import { CHROMATIC_SURFACE_COLOR_NAMES } from '@incmix/theme'
import { normalizeChartColor, semanticColorKeys } from '@/theme/props/color.prop'
import { type Color, SURFACE_COLOR_KEYS, type SurfaceColorKey } from '@/theme/tokens'

type SemanticColorInteractionLayer = 'soft' | 'container'

export interface SemanticColorClassRecipe {
  colorName: string
  fill: {
    solid: string
    soft: string
    container: string
    transparent: string
  }
  text: {
    default: string
    contrast: string
  }
  border: {
    default: string
    transparent: string
    highContrast: string
  }
  interactionFill: {
    soft: string
    container: string
    selected: string
  }
  state: {
    hoverBg: string
    hoverContainerBg: string
    selectedBg: string
    focus: string
  }
  highContrast: {
    solid: string
    soft: string
    container: string
    outline: string
    ghost: string
  }
}

const chromaticSurfaceColorSet = new Set<string>(CHROMATIC_SURFACE_COLOR_NAMES)
const interactionTokenByLayer = {
  soft: 'soft',
  container: 'surface',
} as const satisfies Record<SemanticColorInteractionLayer, string>

function semanticColorClassName(color: SurfaceColorKey) {
  return normalizeChartColor(color) ?? color
}

function chartInteractionBackgroundClassName(colorName: string, layer: SemanticColorInteractionLayer) {
  const chartColor = normalizeChartColor(colorName)
  if (!chartColor) return undefined

  const chartIndex = chartColor.slice('chart'.length)
  const mixPercent = layer === 'container' ? 18 : 36
  return `bg-[color-mix(in_oklch,var(--chart-${chartIndex})_${mixPercent}%,var(--color-light-surface))]`
}

function interactionBackgroundClassName(colorName: string, layer: SemanticColorInteractionLayer = 'soft') {
  if (chromaticSurfaceColorSet.has(colorName)) return `bg-${colorName}-highlight`

  return (
    chartInteractionBackgroundClassName(colorName, layer) ??
    `bg-[var(--color-${colorName}-${interactionTokenByLayer[layer]}-hover)]`
  )
}

function focusOutlineClassName(colorName: string) {
  return chromaticSurfaceColorSet.has(colorName) ? `outline-${colorName}-highlight` : `outline-${colorName}`
}

function highContrastFillClassName(colorName: string) {
  return normalizeChartColor(colorName) ? `bg-${colorName}-solid` : `bg-[var(--color-${colorName}-text)]`
}

function highContrastBorderClassName(colorName: string) {
  return normalizeChartColor(colorName) ? `border-${colorName}` : `border-[var(--color-${colorName}-text)]`
}

function createSemanticColorClassRecipe(color: SurfaceColorKey): SemanticColorClassRecipe {
  const colorName = semanticColorClassName(color)
  const softInteractionBg = interactionBackgroundClassName(colorName)
  const containerInteractionBg = interactionBackgroundClassName(colorName, 'container')

  return {
    colorName,
    fill: {
      solid: `bg-${colorName}-solid`,
      soft: `bg-${colorName}-soft`,
      container: `bg-${colorName}-surface`,
      transparent: 'bg-transparent',
    },
    text: {
      default: `text-${colorName}`,
      contrast: `text-${colorName}-contrast`,
    },
    border: {
      default: `border-${colorName}`,
      transparent: 'border-transparent',
      highContrast: highContrastBorderClassName(colorName),
    },
    interactionFill: {
      soft: softInteractionBg,
      container: containerInteractionBg,
      selected: softInteractionBg,
    },
    state: {
      hoverBg: `hover:${softInteractionBg}`,
      hoverContainerBg: `hover:${containerInteractionBg}`,
      selectedBg: `data-[selected]:${softInteractionBg}`,
      focus: `focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:${focusOutlineClassName(colorName)}`,
    },
    highContrast: {
      solid: `${highContrastFillClassName(colorName)} ${highContrastBorderClassName(colorName)} text-${colorName}-contrast`,
      soft: `${softInteractionBg} text-${colorName}`,
      container: `${highContrastBorderClassName(colorName)} text-${colorName}`,
      outline: `border-${colorName} text-${colorName}`,
      ghost: `text-${colorName}`,
    },
  }
}

export const semanticColorClassRecipes = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, createSemanticColorClassRecipe(color)]),
) as Record<SurfaceColorKey, SemanticColorClassRecipe>

export function getSemanticColorClassRecipe(color: SurfaceColorKey) {
  return semanticColorClassRecipes[color]
}

export function createSemanticColorVariantClassMap<VariantName extends string>(
  variants: readonly VariantName[],
  getClassName: (recipe: SemanticColorClassRecipe, variant: VariantName, color: Color) => string,
) {
  return Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      Object.fromEntries(
        variants.map(variant => [variant, getClassName(semanticColorClassRecipes[color], variant, color)]),
      ),
    ]),
  ) as Record<Color, Record<VariantName, string>>
}
