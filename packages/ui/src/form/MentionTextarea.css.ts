import { styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

export const mentionItemHighlightColorVariants: Record<Color, string> = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        backgroundColor: semanticColorVar(color, 'soft'),
        color: semanticColorVar(color, 'text'),
      },
    ]),
  ) as Record<Color, { backgroundColor: string; color: string }>,
)
