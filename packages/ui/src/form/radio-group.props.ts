import type * as React from 'react'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import type { PropDef } from '@/theme/props/prop-def'
import { variantsClassicSurfaceSoft } from '@/theme/props/scales'
import type { Color } from '@/theme/tokens'
import { formSizes } from './form-size'

const sizes = formSizes
const variants = variantsClassicSurfaceSoft
const orientations = ['horizontal', 'vertical'] as const

export type RadioSize = (typeof sizes)[number]
export type RadioVariant = (typeof variants)[number]
export type RadioGroupOrientation = (typeof orientations)[number]

export interface RadioGroupRootProps extends MarginProps {
  /** Size of the radio buttons. */
  size?: RadioSize
  /** Color of the radio buttons. */
  color?: Color
  /** Visual variant. */
  variant?: RadioVariant
  /** Whether to apply high-contrast styles. */
  highContrast?: boolean
  /** Current value. */
  value?: string
  /** Default value. */
  defaultValue?: string
  /** Callback when value changes. */
  onValueChange?: (value: string) => void
  /** Whether all radios are disabled. */
  disabled?: boolean
  /** Orientation. */
  orientation?: RadioGroupOrientation
  /** Additional class names. */
  className?: string
  /** Inline styles. */
  style?: React.CSSProperties
  /** Children. */
  children: React.ReactNode
}

export interface RadioGroupItemProps {
  /** Value of this radio. */
  value: string
  /** Label for the radio. */
  label?: string
  /** Whether this radio is disabled. */
  disabled?: boolean
  /** Additional class names. */
  className?: string
  /** Children, alternative to label. */
  children?: React.ReactNode
}

const radioGroupRootPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: sizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: variants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  value: { type: 'string' },
  defaultValue: { type: 'string' },
  onValueChange: { type: 'callback', typeFullName: '(value: string) => void' },
  disabled: { type: 'boolean', default: false },
  orientation: { type: 'enum', values: orientations, default: 'vertical' },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  value: PropDef<string>
  defaultValue: PropDef<string>
  onValueChange: PropDef<(value: string) => void>
  disabled: PropDef<boolean>
  orientation: PropDef<(typeof orientations)[number]>
}

export { orientations as radioGroupOrientations, radioGroupRootPropDefs }
