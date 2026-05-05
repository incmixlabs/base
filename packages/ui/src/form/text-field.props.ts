import type * as React from 'react'
import { flexPropDefs } from '@/layouts/flex/flex.props'
import { colorPropDef } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { paddingPropDefs } from '@/theme/props/padding.props'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { textFieldTokens } from '@/theme/tokens'
import { extendedFormSizes } from './form-size'

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, MarginProps {
  /** The size of the text field */
  size?: Size
  /** The visual variant */
  variant?: TextFieldVariant
  /** The accent color */
  color?: Color
  /** The border radius */
  radius?: Radius
  /** Whether the field has an error */
  error?: boolean
  /** Icon to display on the left (decorative, non-interactive) */
  leftIcon?: React.ReactNode
  /** Icon to display on the right (decorative, non-interactive) */
  rightIcon?: React.ReactNode
  /** Interactive element on the left (e.g., button) */
  leftElement?: React.ReactNode
  /** Interactive element on the right (e.g., toggle button) */
  rightElement?: React.ReactNode
  /** Label text (required for floating-* variants) */
  label?: string
}

const textFieldSizes = extendedFormSizes
const textFieldVariants = textFieldTokens.baseVariant
const textFieldAllVariants = textFieldTokens.variant

const textFieldRootPropDefs = {
  size: { type: 'enum', values: textFieldSizes, default: 'md', responsive: true },
  variant: { type: 'enum', values: textFieldAllVariants, default: 'outline' },
  label: { type: 'string' },
  error: { type: 'boolean', default: false },
  disabled: { type: 'boolean', default: false },
  leftIcon: { type: 'ReactNode' },
  rightIcon: { type: 'ReactNode' },
  leftElement: { type: 'ReactNode' },
  rightElement: { type: 'ReactNode' },
  ...colorPropDef,
  ...radiusPropDef,
} satisfies {
  size: PropDef<(typeof textFieldSizes)[number]>
  variant: PropDef<(typeof textFieldAllVariants)[number]>
  label: PropDef<string>
  error: PropDef<boolean>
  disabled: PropDef<boolean>
  leftIcon: PropDef<React.ReactNode>
  rightIcon: PropDef<React.ReactNode>
  leftElement: PropDef<React.ReactNode>
  rightElement: PropDef<React.ReactNode>
}

const sides = ['left', 'right'] as const

const textFieldSlotPropDefs = {
  side: { type: 'enum', values: sides },
  ...colorPropDef,
  gap: flexPropDefs.gap,
  px: paddingPropDefs.px,
  pl: paddingPropDefs.pl,
  pr: paddingPropDefs.pr,
} satisfies {
  side: PropDef<(typeof sides)[number]>
  gap: typeof flexPropDefs.gap
  px: typeof paddingPropDefs.px
  pl: typeof paddingPropDefs.pl
  pr: typeof paddingPropDefs.pr
}

export { textFieldAllVariants, textFieldRootPropDefs, textFieldSizes, textFieldSlotPropDefs, textFieldVariants }
