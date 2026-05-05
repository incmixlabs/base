export const compositeGlyphs = Object.freeze({
  dot: '•',
  star: '★',
  dash: '–',
  check: '✓',
  diamond: '◆',
  triangle: '▸',
  circle: '○',
  square: '▪',
  arrow: '→',
  sparkle: '✦',
})

export type CompositeGlyphName = keyof typeof compositeGlyphs

export function resolveCompositeGlyph(value: unknown, fallback: CompositeGlyphName = 'dot') {
  if (typeof value !== 'string' || !value.trim()) return compositeGlyphs[fallback]
  const normalized = value.trim()
  return compositeGlyphs[normalized as CompositeGlyphName] ?? normalized
}
