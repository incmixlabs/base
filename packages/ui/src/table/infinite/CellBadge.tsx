'use client'

import type * as React from 'react'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

export type CellBadgeMapping = {
  value: string | number
  label?: React.ReactNode
  color?: Color
}

export interface CellBadgeProps {
  /** The current cell value to match against the mappings */
  value: string | number
  /** Value-to-color mapping array */
  values: CellBadgeMapping[]
  /** Fallback color when no match is found (default: 'slate') */
  defaultColor?: Color
  /** Override label (instead of using matched label or stringified value) */
  children?: React.ReactNode
}

export function CellBadge({ value, values, defaultColor = 'slate', children }: CellBadgeProps) {
  const match = values.find(v => String(v.value) === String(value))
  const color = match?.color ?? defaultColor
  const label = children ?? match?.label ?? String(value)

  return <span style={{ color: semanticColorVar(color, 'primary') }}>{label}</span>
}

CellBadge.displayName = 'CellBadge'
