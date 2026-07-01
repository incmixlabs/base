const SEMANTIC_COLOR_NAMES = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
  'neutral',
  'slate',
  'inverse',
  'light',
  'dark',
]

const semanticColor = color => ({
  DEFAULT: `var(--color-${color}-solid)`,
  solid: `var(--color-${color}-solid)`,
  soft: `var(--color-${color}-soft)`,
  surface: `var(--color-${color}-surface)`,
  background: `var(--color-${color}-background)`,
  border: `var(--color-${color}-border)`,
  text: `var(--color-${color}-text)`,
  contrast: `var(--color-${color}-contrast)`,
})

const semanticColorThemeColors = (colors = SEMANTIC_COLOR_NAMES) =>
  Object.fromEntries(colors.map(color => [color, semanticColor(color)]))

module.exports = {
  SEMANTIC_COLOR_NAMES,
  semanticColor,
  semanticColorThemeColors,
}
