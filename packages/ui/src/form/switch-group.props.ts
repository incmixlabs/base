import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import type { Color, Radius } from '@/theme/tokens'
import type { SwitchSize, SwitchVariant } from './switch.props'
import { switchSizes, switchVariants } from './switch.props'

export const switchGroupOrientations = ['horizontal', 'vertical'] as const

export type SwitchGroupSize = SwitchSize
export type SwitchGroupOrientation = (typeof switchGroupOrientations)[number]

export interface SwitchGroupRootProps {
  /** The size of all switches in the group. */
  size?: SwitchGroupSize
  /** The visual variant of all switches. */
  variant?: SwitchVariant
  /** The accent color of all switches. */
  color?: Color
  /** Border radius. */
  radius?: Radius
  /** The controlled value, an array of checked switch names. */
  value?: string[]
  /** The default value for uncontrolled usage. */
  defaultValue?: string[]
  /** Callback when values change. */
  onValueChange?: (value: string[]) => void
  /** Whether all switches are disabled. */
  disabled?: boolean
  /** Orientation. */
  orientation?: SwitchGroupOrientation
  /** Additional class names. */
  className?: string
  /** Inline styles. */
  style?: React.CSSProperties
  /** Children elements. */
  children: React.ReactNode
}

export interface SwitchGroupItemProps {
  /** Unique name/value for this switch. */
  name: string
  /** The label text. */
  label?: string
  /** Optional description text. */
  description?: string
  /** Whether this specific switch is disabled. */
  disabled?: boolean
  /** Additional class names. */
  className?: string
  /** Children, alternative to label prop. */
  children?: React.ReactNode
}

export const switchGroupRootPropDefs = {
  size: { type: 'enum', values: switchSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: switchVariants, default: 'surface' },
  ...colorPropDef,
  ...radiusPropDef,
  onValueChange: { type: 'callback', typeFullName: '(value: string[]) => void' },
  disabled: { type: 'boolean', default: false },
  orientation: { type: 'enum', values: switchGroupOrientations, default: 'vertical' },
} satisfies {
  size: PropDef<SwitchSize>
  variant: PropDef<SwitchVariant>
  onValueChange: PropDef<(value: string[]) => void>
  disabled: PropDef<boolean>
  orientation: PropDef<SwitchGroupOrientation>
}
