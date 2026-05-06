'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusStyleVariants } from '@/theme/radius.css'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { resolveFormSize } from './form-size'
import { Label } from './Label'
import { switchSizeVariants } from './switch.css'
import type { SwitchProps, SwitchSize, SwitchWithLabelProps } from './switch.props'
import { switchPropDefs } from './switch.props'

export type { SwitchProps, SwitchWithLabelProps } from './switch.props'
export type { SwitchSize }

// Static checked color class — references --fc-primary set via formColorVars
const checkedColorCls = 'data-[checked]:bg-[var(--fc-primary)]'

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.primary,
      radius: radiusProp,
      disabled,
      highContrast = false,
      className,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const radius = radiusProp ?? fieldGroup.radius ?? 'full'
    const safeVariant = normalizeEnumPropValue(switchPropDefs.variant, variant) ?? switchPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(switchPropDefs.color, color) ?? SemanticColor.primary
    const safeRadius = normalizeEnumPropValue(switchPropDefs.radius, radius) ?? 'full'
    const safeHighContrast = normalizeBooleanPropValue(switchPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = normalizeBooleanPropValue(switchPropDefs.disabled, disabled) ?? false
    const effectiveDisabled = safeDisabled || fieldGroup.readOnly

    return (
      <SwitchPrimitive.Root
        ref={ref as React.Ref<HTMLElement>}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={effectiveDisabled}
        style={formColorVars[safeColor] as React.CSSProperties}
        className={cn(
          switchSizeVariants[size],
          'peer inline-flex shrink-0 cursor-pointer items-center border-2 border-transparent transition-colors',
          'h-[var(--sw-root-height)] w-[var(--sw-root-width)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          radiusStyleVariants[safeRadius],
          checkedColorCls,

          // Variant styles for unchecked state
          safeVariant === 'surface' && 'bg-input',
          safeVariant === 'classic' && 'bg-input border-border',
          safeVariant === 'soft' && 'bg-secondary/50',

          // High contrast
          safeHighContrast && 'data-[checked]:shadow-md',

          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            'w-[var(--sw-thumb-size)] h-[var(--sw-thumb-size)]',
            'translate-x-0 data-[checked]:translate-x-[var(--sw-thumb-translate)]',
          )}
        />
      </SwitchPrimitive.Root>
    )
  },
)

Switch.displayName = 'Switch'

const SwitchWithLabel = React.forwardRef<HTMLButtonElement, SwitchWithLabelProps>(
  ({ label, labelPosition = 'right', size = 'sm', className, id: idProp, ...props }, ref) => {
    const fieldGroup = useFieldGroup()
    const generatedId = React.useId()
    const id = idProp ?? generatedId
    const effectiveDisabled = props.disabled || fieldGroup.readOnly

    return (
      <div className={cn('flex items-center gap-2', labelPosition === 'left' && 'flex-row-reverse', className)}>
        <Switch ref={ref} id={id} {...props} size={size} />
        <Label htmlFor={id} size={size} disabled={effectiveDisabled}>
          {label}
        </Label>
      </div>
    )
  },
)

SwitchWithLabel.displayName = 'SwitchWithLabel'

export { Switch, SwitchWithLabel }
