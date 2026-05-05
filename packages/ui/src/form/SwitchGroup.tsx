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
import { SemanticColor } from '@/theme/props/color.prop'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color, Radius } from '@/theme/tokens'
import { Text } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { resolveFormSize } from './form-size'
import { Label } from './Label'
import { switchGroupRootOrientation, switchSizeVariants } from './switch.css'
import type { SwitchVariant } from './switch.props'
import type { SwitchGroupItemProps, SwitchGroupRootProps, SwitchGroupSize } from './switch-group.props'

export type { SwitchGroupItemProps, SwitchGroupRootProps, SwitchGroupSize } from './switch-group.props'

// Static checked color class — references --fc-primary set via formColorVars
const checkedColorCls = 'data-[checked]:bg-[var(--fc-primary)]'

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
      radius = 'full',
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
        value={{ size, variant, color, radius, disabled, values, onValueChange: handleValueChange }}
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
          style={formColorVars[context.color] as React.CSSProperties}
          className={cn(
            'peer inline-flex shrink-0 cursor-pointer items-center border-2 border-transparent transition-colors',
            'h-[var(--sw-root-height)] w-[var(--sw-root-width)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            radiusStyleVariants[context.radius],
            checkedColorCls,
            context.variant === 'surface' && 'bg-input',
            context.variant === 'classic' && 'bg-input border-border',
            context.variant === 'soft' && 'bg-secondary/50',
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
              'h-[var(--sw-thumb-size)] w-[var(--sw-thumb-size)]',
              'translate-x-0 data-[checked]:translate-x-[var(--sw-thumb-translate)]',
            )}
          />
        </SwitchPrimitive.Root>

        {displayLabel && (
          <div className="flex flex-col">
            <Label id={labelId} size={context.size} disabled={isDisabled}>
              {displayLabel}
            </Label>
            {description && (
              <Text size="xs" className="text-muted-foreground mt-0.5">
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
