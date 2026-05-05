import { fontSizes, letterSpacings, lineHeights } from '@/theme/token-maps'
import { designTokens, type PaletteColorToken, resolveThemeColorToken, type Size } from '@/theme/tokens'

/** Typography tokens use the named typography scale rather than raw element-control sizing. */
export const typographyTokens = {
  size: Object.fromEntries(
    (Object.keys(fontSizes) as Size[]).map(key => [
      key,
      {
        fontSize: fontSizes[key],
        lineHeight: lineHeights[key],
        letterSpacing: letterSpacings[key],
      },
    ]),
  ) as Record<Size, { fontSize: string; lineHeight: string; letterSpacing: string }>,

  weight: designTokens.weight,

  // Colors reference the canonical semantic tokens from theme/design-tokens.css
  // via designTokens.color — no separate typography-color CSS vars needed.
  // `text` is kept as the canonical base token for existing internal consumers.
  // Public Text emphasis should use `variant="solid"` rather than `variant="text"`.
  color: Object.fromEntries(
    (Object.keys(designTokens.color) as Array<keyof typeof designTokens.color>).map(key => [
      key,
      {
        text: designTokens.color[key].text,
        solid: designTokens.color[key].text,
        soft: designTokens.color[key].primary,
        muted: designTokens.color[key].border,
      },
    ]),
  ) as Record<keyof typeof designTokens.color, { text: string; solid: string; soft: string; muted: string }>,
} as const

export function resolveTextColor(color: TextColor, variant: TypographyVariant): string {
  if (Object.hasOwn(typographyTokens.color, color)) {
    const semanticColor = color as keyof typeof typographyTokens.color
    return typographyTokens.color[semanticColor][variant]
  }

  return resolveThemeColorToken(color as PaletteColorToken)
}

// Re-export Size as the typography size type (unified with element sizes)
export type { Size as TypographySize } from '@/theme/tokens'

// Font weight
export type Weight = 'light' | 'regular' | 'medium' | 'bold'

// Typography colors
export type TypographyColor = keyof typeof designTokens.color
export type TextColor = TypographyColor | PaletteColorToken
// `solid` is the public successor to direct `.text` access for Text emphasis.
export type TypographyVariant = 'solid' | 'soft' | 'muted'
