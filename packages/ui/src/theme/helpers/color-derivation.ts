export interface ColorDerivationDeltas {
  soft: number
  softHover: number
  surface: number
  border: number
  borderSubtle: number
}

const DEFAULT_LIGHT: ColorDerivationDeltas = {
  soft: 30,
  softHover: 24,
  surface: 40,
  border: 18,
  borderSubtle: 28,
}

const DEFAULT_DARK: ColorDerivationDeltas = {
  soft: -22,
  softHover: -16,
  surface: -30,
  border: -16,
  borderSubtle: -26,
}

function readNumberVar(styles: CSSStyleDeclaration, name: string, fallback: number): number {
  const raw = styles.getPropertyValue(name).trim()
  if (!raw) return fallback
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function resolveColorDerivationDeltas(root: HTMLElement, mode: 'light' | 'dark'): ColorDerivationDeltas {
  const defaults = mode === 'light' ? DEFAULT_LIGHT : DEFAULT_DARK
  const suffix = mode
  const styles = getComputedStyle(root)

  return {
    soft: readNumberVar(styles, `--theme-color-derivation-soft-${suffix}`, defaults.soft),
    softHover: readNumberVar(styles, `--theme-color-derivation-soft-hover-${suffix}`, defaults.softHover),
    surface: readNumberVar(styles, `--theme-color-derivation-surface-${suffix}`, defaults.surface),
    border: readNumberVar(styles, `--theme-color-derivation-border-${suffix}`, defaults.border),
    borderSubtle: readNumberVar(styles, `--theme-color-derivation-border-subtle-${suffix}`, defaults.borderSubtle),
  }
}

export function resolvePrimaryAlpha(root: HTMLElement, mode: 'light' | 'dark', lane: string): number {
  const styles = getComputedStyle(root)
  const laneOverride = readNumberVar(styles, `--theme-color-derivation-primary-alpha-${lane}-${mode}`, Number.NaN)
  if (Number.isFinite(laneOverride)) return laneOverride
  return readNumberVar(styles, `--theme-color-derivation-primary-alpha-${mode}`, 0.28)
}
