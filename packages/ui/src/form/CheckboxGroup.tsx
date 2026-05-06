'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import { Check } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'
import {
  checkboxBase,
  checkboxBaseCls,
  checkboxColorVariants,
  checkboxHighContrastByVariant,
  checkboxIndicator,
  checkboxSizeVariants,
} from './checkbox.css'
import type { CheckboxSize, CheckboxVariant } from './checkbox.props'
import {
  checkboxGroupItemBase,
  checkboxGroupItemGap,
  checkboxGroupRootBase,
  checkboxGroupRootOrientation,
} from './checkbox-group.css'
import type { CheckboxGroupItemProps, CheckboxGroupRootProps } from './checkbox-group.props'
import { checkboxGroupRootPropDefs } from './checkbox-group.props'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { Label } from './Label'

interface CheckboxGroupContextValue {
  size: CheckboxSize
  variant: CheckboxVariant
  color: Color
  highContrast: boolean
  disabled?: boolean
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue>({
  size: 'sm',
  variant: 'solid',
  color: SemanticColor.slate,
  highContrast: false,
})

const CheckboxGroupRoot = React.forwardRef<HTMLDivElement, CheckboxGroupRootProps>(
  (
    {
      size: sizeProp,
      variant = 'solid',
      color = SemanticColor.slate,
      value,
      defaultValue,
      onValueChange,
      disabled,
      orientation = 'vertical',
      highContrast = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const safeVariant =
      normalizeEnumPropValue(checkboxGroupRootPropDefs.variant, variant) ?? checkboxGroupRootPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(checkboxGroupRootPropDefs.color, color) ?? SemanticColor.slate
    const safeHighContrast = normalizeBooleanPropValue(checkboxGroupRootPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = normalizeBooleanPropValue(checkboxGroupRootPropDefs.disabled, disabled)
    const safeOrientation =
      normalizeEnumPropValue(checkboxGroupRootPropDefs.orientation, orientation) ??
      checkboxGroupRootPropDefs.orientation.default
    const effectiveDisabled = safeDisabled || fieldGroup.readOnly

    return (
      <CheckboxGroupContext.Provider
        value={{
          size,
          variant: safeVariant,
          color: safeColor,
          highContrast: safeHighContrast,
          disabled: effectiveDisabled,
        }}
      >
        <CheckboxGroupPrimitive
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={effectiveDisabled}
          className={cn(checkboxGroupRootBase, checkboxGroupRootOrientation[safeOrientation], className)}
          {...props}
        >
          {children}
        </CheckboxGroupPrimitive>
      </CheckboxGroupContext.Provider>
    )
  },
)

CheckboxGroupRoot.displayName = 'CheckboxGroup.Root'

const CheckboxGroupItem = React.forwardRef<HTMLButtonElement, CheckboxGroupItemProps>(
  ({ value, label, description, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(CheckboxGroupContext)
    const id = React.useId()
    const safeDisabled = normalizeBooleanPropValue(checkboxGroupRootPropDefs.disabled, disabled) ?? false
    const isDisabled = safeDisabled || context.disabled
    const displayLabel = label || children

    return (
      <div className={cn(checkboxGroupItemBase, checkboxGroupItemGap[context.size], className)}>
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          name={value}
          value={value}
          disabled={isDisabled}
          className={cn(
            checkboxBase,
            checkboxBaseCls,
            checkboxSizeVariants[context.size],
            checkboxColorVariants[context.color][context.variant],
            context.highContrast && 'af-high-contrast',
            context.highContrast && checkboxHighContrastByVariant[context.variant],
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={checkboxIndicator}>
            <Check className="h-full w-full stroke-current" strokeWidth={3} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {displayLabel && (
          <div className="flex flex-col">
            <Label htmlFor={id} size={context.size} disabled={isDisabled}>
              {displayLabel}
            </Label>
            {description && (
              <Text size="xs" className="text-muted-foreground mt-1">
                {description}
              </Text>
            )}
          </div>
        )}
      </div>
    )
  },
)

CheckboxGroupItem.displayName = 'CheckboxGroup.Item'

export const CheckboxGroup = {
  Root: CheckboxGroupRoot,
  Item: CheckboxGroupItem,
}

export type { CheckboxGroupItemProps, CheckboxGroupRootProps } from './checkbox-group.props'
export type { CheckboxGroupRootProps as CheckboxGroupProps }
