import { designTokens, type Radius } from '@/theme/tokens'

export const RADIUS_VALUE_MAP: Record<Radius, string> = {
  none: designTokens.radius.none,
  sm: designTokens.radius.sm,
  md: designTokens.radius.md,
  lg: designTokens.radius.lg,
  full: designTokens.radius.full,
}

const RADIUS_REVERSE_MAP = Object.fromEntries(
  Object.entries(RADIUS_VALUE_MAP).map(([token, value]) => [value, token]),
) as Record<string, Radius>

/** getThemeRadiusValue export. */
export function getThemeRadiusValue(radius: Radius): string {
  return RADIUS_VALUE_MAP[radius] ?? RADIUS_VALUE_MAP.md
}

/** resolveThemeRadius export. */
export function resolveThemeRadius(value: string): Radius {
  return RADIUS_REVERSE_MAP[value] ?? 'md'
}

export const RADIUS_OPTIONS: { value: Radius; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'full', label: 'Full' },
]

const RADIUS_ICON_MAP: Record<string, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 14,
  full: 28,
}

/** RadiusIcon export. */
export function RadiusIcon({ value }: { value: string }) {
  const r = RADIUS_ICON_MAP[value] ?? 8
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx={r} ry={r} className="fill-primary/15" stroke="none" />
      <path
        d={`M2 ${32 - r < 2 ? 2 : 32}V${2 + r < 32 ? 2 + r : 2}${r > 0 ? `Q2 2 ${2 + r} 2` : ''}H${32 - r < 2 + r ? 30 : 32}`}
        className="stroke-primary/40"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}
