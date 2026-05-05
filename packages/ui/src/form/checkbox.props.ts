import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { formSizes } from './form-size'

const checkboxSizes = formSizes
const checkboxVariants = ['solid', 'soft', 'outline'] as const

export type CheckboxSize = (typeof checkboxSizes)[number]
export type CheckboxVariant = (typeof checkboxVariants)[number]

export interface CheckboxProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  /** The size of the checkbox. */
  size?: CheckboxSize
  /** The visual variant. */
  variant?: CheckboxVariant
  /** The accent color. */
  color?: Color
  /** Whether the checkbox is checked. */
  checked?: boolean
  /** Default checked state for uncontrolled usage. */
  defaultChecked?: boolean
  /** Callback when checked state changes. */
  onCheckedChange?: (checked: boolean) => void
  /** Whether the checkbox is in an indeterminate state. */
  indeterminate?: boolean
  /** Whether the checkbox is disabled. */
  disabled?: boolean
  /** Whether to apply high-contrast styling. */
  highContrast?: boolean
  /** Whether the checkbox is required. */
  required?: boolean
  /** The name attribute for form submission. */
  name?: string
  /** The value attribute for form submission. */
  value?: string
  /** Additional class names. */
  className?: string
  /** The id attribute. */
  id?: string
  /** Additional inline styles. */
  style?: React.CSSProperties
}

export interface CheckboxWithLabelProps extends CheckboxProps {
  /** The label text. */
  label: string
  /** Optional description text. */
  description?: string
}

const checkboxSharedPropDefs = {
  size: { type: 'enum', values: checkboxSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: checkboxVariants, default: 'solid' },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  size: PropDef<(typeof checkboxSizes)[number]>
  variant: PropDef<(typeof checkboxVariants)[number]>
}

const checkboxPropDefs = {
  ...checkboxSharedPropDefs,
  checked: { type: 'boolean' },
  defaultChecked: { type: 'boolean' },
  onCheckedChange: { type: 'callback', typeFullName: '(checked: boolean) => void' },
  indeterminate: { type: 'boolean', default: false },
  disabled: { type: 'boolean', default: false },
  required: { type: 'boolean' },
  name: { type: 'string' },
  value: { type: 'string' },
} satisfies {
  checked: PropDef<boolean>
  defaultChecked: PropDef<boolean>
  onCheckedChange: PropDef<(checked: boolean) => void>
  indeterminate: PropDef<boolean>
  disabled: PropDef<boolean>
  required: PropDef<boolean>
  name: PropDef<string>
  value: PropDef<string>
}

export { checkboxPropDefs, checkboxSharedPropDefs, checkboxSizes, checkboxVariants }
