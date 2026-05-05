'use client'

import * as React from 'react'
import type { FieldGroupLayout, Size, TextFieldVariant } from '@/theme/tokens'

// Props for FieldGroupProvider (optional values)
export interface FieldGroupContextValue {
  size?: Size
  variant?: TextFieldVariant
  layout?: FieldGroupLayout
}

// Resolved values with defaults (always defined)
export interface FieldGroupResolvedValue {
  size: Size
  variant: TextFieldVariant
  layout: FieldGroupLayout
}

const FieldGroupContext = React.createContext<FieldGroupContextValue | null>(null)

/** FieldGroupProvider export. */
export function FieldGroupProvider({ children, value }: { children: React.ReactNode; value: FieldGroupContextValue }) {
  const parent = React.useContext(FieldGroupContext)

  const mergedValue = React.useMemo<FieldGroupContextValue>(
    () => ({
      size: value.size ?? parent?.size,
      variant: value.variant ?? parent?.variant,
      layout: value.layout ?? parent?.layout,
    }),
    [parent?.layout, parent?.size, parent?.variant, value.layout, value.size, value.variant],
  )

  return <FieldGroupContext.Provider value={mergedValue}>{children}</FieldGroupContext.Provider>
}

const defaultFieldGroupValue: FieldGroupResolvedValue = {
  size: 'md',
  variant: 'outline',
  layout: 'stacked',
}

function resolveFieldGroupValue(context: FieldGroupContextValue): FieldGroupResolvedValue {
  return {
    size: context.size ?? defaultFieldGroupValue.size,
    variant: context.variant ?? defaultFieldGroupValue.variant,
    layout: context.layout ?? defaultFieldGroupValue.layout,
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
