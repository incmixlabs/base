'use client'

/**
 * SwitchGroup - A component for managing multiple switches with shared state.
 *
 * Similar to CheckboxGroup but using switch toggles instead of checkboxes.
 * Manages an array of selected values and provides consistent styling across all switches.
 *
 * @example
 * ```tsx
 * <SwitchGroup.Root defaultValue={['notifications']} onValueChange={setSettings}>
 *   <SwitchGroup.Item name="notifications" label="Push notifications" />
 *   <SwitchGroup.Item name="emails" label="Email updates" description="Weekly digest" />
 *   <SwitchGroup.Item name="sms" label="SMS alerts" />
 * </SwitchGroup.Root>
 * ```
 *
 * @module SwitchGroup
 */

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { radiusClassByToken } from '@/theme/helpers'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color, Radius } from '@/theme/tokens'
import { Text } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { Label } from './Label'
import {
  switchColorVariants,
  switchGroupRootOrientation,
  switchRootBase,
  switchRootSize,
  switchSizeVariants,
  switchThumbBase,
} from './switch.class'
import type { SwitchVariant } from './switch.props'
import type { SwitchGroupItemProps, SwitchGroupRootProps, SwitchGroupSize } from './switch-group.props'

export type { SwitchGroupItemProps, SwitchGroupRootProps, SwitchGroupSize } from './switch-group.props'

// Context for sharing props across switch group
interface SwitchGroupContextValue {
  size: SwitchGroupSize
  variant: SwitchVariant
  color: Color
  radius: Radius
  disabled?: boolean
  values: string[]
  onValueChange: (name: string, checked: boolean) => void
}

const SwitchGroupContext = React.createContext<SwitchGroupContextValue | null>(null)

// ============================================================================
// Root
// ============================================================================

/**
 * Container component for SwitchGroup that manages the array of selected values.
 * Supports both controlled and uncontrolled usage patterns.
 * Inherits size from FieldGroupContext if not explicitly provided.
 */
const SwitchGroupRoot = React.forwardRef<HTMLDivElement, SwitchGroupRootProps>(
  (
    {
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.primary,
      radius: radiusProp,
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      disabled,
      orientation = 'vertical',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const radius = radiusProp ?? fieldGroup.radius ?? 'full'
    const effectiveDisabled = disabled || fieldGroup.disabled

    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
    const isControlled = controlledValue !== undefined
    const values = isControlled ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (name: string, checked: boolean) => {
        const newValues = checked ? [...values, name] : values.filter(v => v !== name)

        if (!isControlled) {
          setInternalValue(newValues)
        }
        onValueChange?.(newValues)
      },
      [values, isControlled, onValueChange],
    )

    return (
      <SwitchGroupContext.Provider
        value={{ size, variant, color, radius, disabled: effectiveDisabled, values, onValueChange: handleValueChange }}
      >
        <div
          ref={ref}
          role="group"
          className={cn('flex', switchGroupRootOrientation[orientation], className)}
          {...props}
        >
          {children}
        </div>
      </SwitchGroupContext.Provider>
    )
  },
)

SwitchGroupRoot.displayName = 'SwitchGroup.Root'

// ============================================================================
// Item
// ============================================================================

/**
 * Individual switch within a SwitchGroup.
 * Must be used within a SwitchGroup.Root component.
 * Displays a switch toggle with optional label and description.
 */
const SwitchGroupItem = React.forwardRef<HTMLSpanElement, SwitchGroupItemProps>(
  ({ name, label, description, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(SwitchGroupContext)

    if (!context) {
      throw new Error('SwitchGroup.Item must be used within SwitchGroup.Root')
    }

    const id = React.useId()
    const labelId = `${id}-label`
    const isDisabled = disabled || context.disabled
    const isChecked = context.values.includes(name)
    const displayLabel = label || children

    return (
      <div className={cn('flex items-start gap-[var(--sw-gap)]', switchSizeVariants[context.size], className)}>
        <SwitchPrimitive.Root
          ref={ref}
          id={id}
          aria-labelledby={displayLabel ? labelId : undefined}
          checked={isChecked}
          onCheckedChange={checked => context.onValueChange(name, checked)}
          disabled={isDisabled}
          className={cn(
            switchRootBase,
            switchRootSize,
            radiusClassByToken[context.radius],
            switchColorVariants[context.color][context.variant],
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb className={switchThumbBase} />
        </SwitchPrimitive.Root>

        {displayLabel && (
          <div className="flex flex-col">
            <Label id={labelId} size={context.size} disabled={isDisabled}>
              {displayLabel}
            </Label>
            {description && (
              <Text size="xs" className="mt-0.5 text-neutral opacity-70">
                {description}
              </Text>
            )}
          </div>
        )}
      </div>
    )
  },
)

SwitchGroupItem.displayName = 'SwitchGroup.Item'

// ============================================================================
// Export compound component
// ============================================================================

/** SwitchGroup export. */
export const SwitchGroup = {
  Root: SwitchGroupRoot,
  Item: SwitchGroupItem,
}

export type { SwitchGroupRootProps as SwitchGroupProps }
