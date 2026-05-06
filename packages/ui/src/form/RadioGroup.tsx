'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import {
  radioBaseCls,
  radioColorVariants,
  radioGapVariants,
  radioGroupRootOrientation,
  radioHighContrastByVariant,
  radioSizeVariants,
} from './radio-group.css'
import type { RadioGroupItemProps, RadioGroupRootProps, RadioSize, RadioVariant } from './radio-group.props'
import { radioGroupRootPropDefs } from './radio-group.props'

export type { RadioGroupItemProps, RadioGroupRootProps } from './radio-group.props'
export type { RadioSize }

// Context for sharing props
interface RadioGroupContextValue {
  size: RadioSize
  variant: RadioVariant
  color: Color
  highContrast: boolean
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  size: 'sm',
  variant: 'surface',
  color: SemanticColor.slate,
  highContrast: false,
})

// ============================================================================
// Root
// ============================================================================

const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupRootProps>(
  (
    {
      size: sizeProp,
      color = SemanticColor.slate,
      variant = 'surface',
      highContrast = false,
      value,
      defaultValue,
      onValueChange,
      disabled,
      orientation = 'vertical',
      className,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      children,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const safeVariant =
      normalizeEnumPropValue(radioGroupRootPropDefs.variant, variant) ?? radioGroupRootPropDefs.variant.default
    const safeColor = (normalizeEnumPropValue(radioGroupRootPropDefs.color, color) ?? SemanticColor.slate) as Color
    const safeHighContrast = normalizeBooleanPropValue(radioGroupRootPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = normalizeBooleanPropValue(radioGroupRootPropDefs.disabled, disabled)
    const safeOrientation =
      normalizeEnumPropValue(radioGroupRootPropDefs.orientation, orientation) ??
      radioGroupRootPropDefs.orientation.default
    const effectiveDisabled = safeDisabled || fieldGroup.readOnly
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    const handleValueChange = React.useCallback(
      (newValue: unknown) => {
        if (onValueChange && typeof newValue === 'string') {
          onValueChange(newValue)
        }
      },
      [onValueChange],
    )

    return (
      <RadioGroupContext.Provider
        value={{ size, variant: safeVariant, color: safeColor, highContrast: safeHighContrast, disabled: effectiveDisabled }}
      >
        <RadioGroupPrimitive
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={effectiveDisabled}
          className={cn('flex', radioGroupRootOrientation[safeOrientation], marginProps.className, className)}
          style={{ ...marginProps.style, ...style }}
          {...props}
        >
          {children}
        </RadioGroupPrimitive>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroupRoot.displayName = 'RadioGroup.Root'

// ============================================================================
// Item
// ============================================================================

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, label, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const id = React.useId()
    const isDisabled = disabled || context.disabled

    return (
      <label
        htmlFor={id}
        className={cn(
          'flex items-center cursor-pointer',
          radioGapVariants[context.size],
          'gap-[var(--radio-gap)]',
          isDisabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <RadioPrimitive.Root
          ref={ref}
          id={id}
          value={value}
          disabled={isDisabled}
          className={cn(
            radioBaseCls,
            radioSizeVariants[context.size],
            radioColorVariants[context.color][context.variant],
            context.highContrast && 'af-high-contrast',
            context.highContrast && radioHighContrastByVariant[context.variant],
          )}
          {...props}
        >
          <RadioPrimitive.Indicator className="rounded-full bg-white w-[var(--radio-indicator-size)] h-[var(--radio-indicator-size)]" />
        </RadioPrimitive.Root>
        {(label || children) && (
          <Text size={context.size} weight="medium">
            {label || children}
          </Text>
        )}
      </label>
    )
  },
)

RadioGroupItem.displayName = 'RadioGroup.Item'

// ============================================================================
// Export compound component
// ============================================================================

/** RadioGroup export. */
export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
}
