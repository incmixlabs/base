import type { Color, ThemeColorToken } from '@/theme/tokens'

export type PriorityIconPriority = 'none' | 'low' | 'med' | 'medium' | 'high' | 'critical' | 'blocker'

export type PriorityTone = {
  color: string
  background: string
  border: string
  text: string
}

const mediumPriorityTone: PriorityTone = {
  color: 'var(--brown-9)',
  background: 'var(--brown-4)',
  border: 'var(--brown-7)',
  text: 'var(--brown-11)',
}

export const priorityToneByValue: Record<PriorityIconPriority, PriorityTone> = {
  none: {
    color: 'var(--gray-9)',
    background: 'var(--gray-4)',
    border: 'var(--gray-7)',
    text: 'var(--gray-11)',
  },
  low: {
    color: 'var(--slate-10)',
    background: 'var(--slate-4)',
    border: 'var(--slate-7)',
    text: 'var(--slate-11)',
  },
  med: mediumPriorityTone,
  medium: mediumPriorityTone,
  high: {
    color: 'var(--orange-10)',
    background: 'var(--orange-5)',
    border: 'var(--orange-8)',
    text: 'var(--orange-11)',
  },
  critical: {
    color: 'var(--red-9)',
    background: 'var(--red-4)',
    border: 'var(--red-7)',
    text: 'var(--red-11)',
  },
  blocker: {
    color: 'var(--red-10)',
    background: 'var(--red-5)',
    border: 'var(--red-8)',
    text: 'var(--red-11)',
  },
}

export const priorityLabelByValue: Record<PriorityIconPriority, string> = {
  none: 'None',
  low: 'Low',
  med: 'Medium',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
  blocker: 'Blocker',
}

export const priorityRankByValue: Record<PriorityIconPriority, number> = {
  none: 0,
  low: 1,
  med: 2,
  medium: 2,
  high: 3,
  critical: 4,
  blocker: 5,
}

export const prioritySemanticColorByValue: Record<PriorityIconPriority, Color> = {
  none: 'neutral',
  low: 'neutral',
  med: 'warning',
  medium: 'warning',
  high: 'warning',
  critical: 'error',
  blocker: 'error',
}

export function normalizePriorityValue(value: PriorityIconPriority): PriorityIconPriority {
  return value === 'medium' ? 'med' : value
}

export function isKnownPriorityValue(value: string): value is PriorityIconPriority {
  return Object.hasOwn(priorityToneByValue, value)
}

export function getDefaultPriorityIcon(value: PriorityIconPriority): string {
  switch (value) {
    case 'none':
      return 'circle-minus'
    case 'low':
    case 'med':
    case 'medium':
    case 'high':
      return 'chart-column-big'
    case 'critical':
      return 'triangle-alert'
    case 'blocker':
      return 'square'
    default:
      return 'circle-minus'
  }
}

export function getDefaultPriorityIconColor(value: PriorityIconPriority): ThemeColorToken {
  switch (value) {
    case 'none':
      return 'gray-9'
    case 'low':
      return 'gray-10'
    case 'med':
    case 'medium':
      return 'brown-9'
    case 'high':
      return 'orange-10'
    case 'critical':
      return 'red-9'
    case 'blocker':
      return 'red-10'
    default:
      return 'gray-9'
  }
}

export function getPrioritySortValue(value: unknown): number | null {
  if (value === null || value === undefined) return null

  const objectValue =
    typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as { value?: unknown }) : null

  const raw =
    objectValue && Object.hasOwn(objectValue, 'value') && typeof objectValue.value === 'string'
      ? objectValue.value
      : typeof value === 'string'
        ? value
        : null

  if (!raw || !isKnownPriorityValue(raw)) return null
  return priorityRankByValue[normalizePriorityValue(raw)]
}
