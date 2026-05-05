import type * as React from 'react'
import { checkboxSharedPropDefs } from '@/form/checkbox.props'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import type { PropDef } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import type { CheckboxSize, CheckboxVariant } from './checkbox.props'

const checkboxGroupOrientations = ['horizontal', 'vertical'] as const

export type CheckboxGroupOrientation = (typeof checkboxGroupOrientations)[number]

export interface CheckboxGroupRootProps {
  size?: CheckboxSize
  variant?: CheckboxVariant
  color?: Color
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  highContrast?: boolean
  orientation?: CheckboxGroupOrientation
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export interface CheckboxGroupItemProps {
  value: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const checkboxGroupRootPropDefs = {
  ...asChildPropDef,
  ...checkboxSharedPropDefs,
  onValueChange: { type: 'callback', typeFullName: '(value: string[]) => void' },
  disabled: { type: 'boolean', default: false },
  orientation: { type: 'enum', values: checkboxGroupOrientations, default: 'vertical' },
} satisfies {
  onValueChange: PropDef<(value: string[]) => void>
  disabled: PropDef<boolean>
  orientation: PropDef<(typeof checkboxGroupOrientations)[number]>
}

export { checkboxGroupOrientations, checkboxGroupRootPropDefs }
