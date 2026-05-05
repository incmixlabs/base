import type { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import type { Color, Radius } from '@/theme/tokens'
import { formSizes } from './form-size'

const switchSizes = formSizes
const switchVariants = ['classic', 'surface', 'soft'] as const

export type SwitchSize = (typeof switchSizes)[number]
export type SwitchVariant = (typeof switchVariants)[number]

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    'checked' | 'defaultChecked' | 'onCheckedChange'
  > {
  /** Whether the switch is checked. */
  checked?: boolean
  /** Default checked state. */
  defaultChecked?: boolean
  /** Callback when checked state changes. */
  onCheckedChange?: (checked: boolean) => void
  /** Size of the switch. */
  size?: SwitchSize
  /** Visual variant. */
  variant?: SwitchVariant
  /** Color when checked. */
  color?: Color
  /** Border radius. */
  radius?: Radius
  /** High contrast mode. */
  highContrast?: boolean
}

export interface SwitchWithLabelProps extends SwitchProps {
  /** Label text. */
  label: string
  /** Label position. */
  labelPosition?: 'left' | 'right'
}

const switchPropDefs = {
  size: { type: 'enum', values: switchSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: switchVariants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  ...radiusPropDef,
  checked: { type: 'boolean' },
  defaultChecked: { type: 'boolean' },
  onCheckedChange: { type: 'callback', typeFullName: '(checked: boolean) => void' },
  disabled: { type: 'boolean', default: false },
} satisfies {
  size: PropDef<(typeof switchSizes)[number]>
  variant: PropDef<(typeof switchVariants)[number]>
  checked: PropDef<boolean>
  defaultChecked: PropDef<boolean>
  onCheckedChange: PropDef<(checked: boolean) => void>
  disabled: PropDef<boolean>
}

export { switchPropDefs, switchSizes, switchVariants }
