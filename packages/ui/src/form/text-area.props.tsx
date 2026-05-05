import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesSmToLg } from '@/theme/props/scales'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { textFieldTokens } from '@/theme/tokens'

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, MarginProps {
  /** The size of the textarea */
  size?: Size
  /** The visual variant (includes floating-filled, floating-standard, floating-outlined) */
  variant?: TextFieldVariant
  /** The accent color */
  color?: Color
  /** The border radius */
  radius?: Radius
  /** Whether the field has an error */
  error?: boolean
  /** Resize behavior */
  resize?: TextareaResize
  /** Label text (required for floating-* variants) */
  label?: string
  /** Enable auto-sizing based on content */
  autoSize?: boolean
  /** Minimum number of rows when autoSize is enabled */
  minRows?: number
  /** Maximum number of rows when autoSize is enabled */
  maxRows?: number
}

const sizes = sizesSmToLg
const variants = textFieldTokens.variant
const resizeValues = ['none', 'vertical', 'horizontal', 'both'] as const
type TextareaResize = (typeof resizeValues)[number]

// prettier-ignore
const textAreaPropDefs = {
  size: { type: 'enum', values: sizes, default: 'md', responsive: true },
  variant: { type: 'enum', values: variants, default: 'surface' },
  resize: { type: 'enum', values: resizeValues, responsive: true },
  label: { type: 'string' },
  error: { type: 'boolean', default: false },
  disabled: { type: 'boolean', default: false },
  autoSize: { type: 'boolean', default: false },
  minRows: { type: 'number' },
  maxRows: { type: 'number' },
  ...colorPropDef,
  ...radiusPropDef,
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  resize: PropDef<(typeof resizeValues)[number]>
  label: PropDef<string>
  error: PropDef<boolean>
  disabled: PropDef<boolean>
  autoSize: PropDef<boolean>
  minRows: PropDef<number>
  maxRows: PropDef<number>
}

export { sizes as textAreaSizes, variants as textAreaVariants, resizeValues as textAreaResizeValues, textAreaPropDefs }
