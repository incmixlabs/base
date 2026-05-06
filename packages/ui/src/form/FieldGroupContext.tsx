'use client'

import * as React from 'react'
import type { FieldGroupLayout, Radius, Size, TextFieldVariant } from '@/theme/tokens'

// Props for FieldGroupProvider (optional values)
export interface FieldGroupContextValue {
  size?: Size
  radius?: Radius
  variant?: TextFieldVariant
  layout?: FieldGroupLayout
  disabled?: boolean
}

// Resolved values with defaults (always defined)
export interface FieldGroupResolvedValue {
  size: Size
  radius?: Radius
  variant: TextFieldVariant
  layout: FieldGroupLayout
  disabled: boolean
}

const FieldGroupContext = React.createContext<FieldGroupContextValue | null>(null)

/** FieldGroupProvider export. */
export function FieldGroupProvider({ children, value }: { children: React.ReactNode; value: FieldGroupContextValue }) {
  const parent = React.useContext(FieldGroupContext)

  const mergedValue = React.useMemo<FieldGroupContextValue>(
    () => ({
      size: value.size ?? parent?.size,
      radius: value.radius ?? parent?.radius,
      variant: value.variant ?? parent?.variant,
      layout: value.layout ?? parent?.layout,
      disabled: value.disabled === true || parent?.disabled === true ? true : undefined,
    }),
    [
      parent?.layout,
      parent?.radius,
      parent?.disabled,
      parent?.size,
      parent?.variant,
      value.layout,
      value.radius,
      value.disabled,
      value.size,
      value.variant,
    ],
  )

  return <FieldGroupContext.Provider value={mergedValue}>{children}</FieldGroupContext.Provider>
}

const defaultFieldGroupValue: FieldGroupResolvedValue = {
  size: 'md',
  variant: 'outline',
  layout: 'stacked',
  disabled: false,
}

function resolveFieldGroupValue(context: FieldGroupContextValue): FieldGroupResolvedValue {
  return {
    size: context.size ?? defaultFieldGroupValue.size,
    radius: context.radius ?? defaultFieldGroupValue.radius,
    variant: context.variant ?? defaultFieldGroupValue.variant,
    layout: context.layout ?? defaultFieldGroupValue.layout,
    disabled: context.disabled === true,
  }
}

/** useFieldGroupOptional export. */
export function useFieldGroupOptional(): FieldGroupResolvedValue | null {
  const context = React.useContext(FieldGroupContext)
  return context ? resolveFieldGroupValue(context) : null
}

/** useFieldGroup export. */
export function useFieldGroup(): FieldGroupResolvedValue {
  return useFieldGroupOptional() ?? defaultFieldGroupValue
}
