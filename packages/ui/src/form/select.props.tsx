import type { Select as SelectPrimitive } from '@base-ui/react/select'
import type * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { variantsSolidSoft } from '@/theme/props/scales'
import type { Color, Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { textFieldTokens } from '@/theme/tokens'
import { formSizes } from './form-size'

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'defaultValue' | 'onChange' | 'value'> {
  id?: string
  label?: React.ReactNode
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  size?: Size
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
  error?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  portalContainer?: HTMLElement | null
  disabled?: boolean
  readOnly?: boolean
  children: React.ReactNode
}

export type SelectItemProps = SelectPrimitive.Item.Props

const selectRootPropDefs = {
  size: { type: 'enum', values: formSizes, default: 'md', responsive: true },
  value: { type: 'string' },
  defaultValue: { type: 'string' },
  defaultOpen: { type: 'boolean', default: false },
  onOpenChange: { type: 'callback', typeFullName: '(open: boolean) => void' },
  onValueChange: { type: 'callback', typeFullName: '(value: string) => void' },
  disabled: { type: 'boolean', default: false },
  readOnly: { type: 'boolean', default: false },
} satisfies {
  size: PropDef<(typeof formSizes)[number]>
  value: PropDef<string>
  defaultValue: PropDef<string>
  defaultOpen: PropDef<boolean>
  onOpenChange: PropDef<(open: boolean) => void>
  onValueChange: PropDef<(value: string) => void>
  disabled: PropDef<boolean>
  readOnly: PropDef<boolean>
}

const triggerVariants = textFieldTokens.variant

const selectTriggerPropDefs = {
  variant: { type: 'enum', values: triggerVariants, default: 'outline' },
  ...colorPropDef,
  ...radiusPropDef,
  placeholder: { type: 'ReactNode' },
  label: { type: 'ReactNode' },
  error: { type: 'boolean', default: false },
} satisfies {
  variant: PropDef<(typeof triggerVariants)[number]>
  placeholder: PropDef<React.ReactNode>
  label: PropDef<React.ReactNode>
  error: PropDef<boolean>
}

const contentVariants = variantsSolidSoft

const selectContentPropDefs = {
  variant: { type: 'enum', values: contentVariants, default: 'solid' },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  variant: PropDef<(typeof contentVariants)[number]>
}

const selectPropDefs = {
  Root: selectRootPropDefs,
  Trigger: selectTriggerPropDefs,
  Content: selectContentPropDefs,
} as const

export { selectPropDefs }
