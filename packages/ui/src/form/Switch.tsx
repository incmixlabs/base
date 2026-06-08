'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'
import { Flex } from '@/layouts'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusStyleVariants } from '@/theme/radius.css'
import { Text, type TextProps } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { resolveFormSize } from './form-size'
import { Label } from './Label'
import {
  switchSegmentedCheckedLabel,
  switchSegmentedLabelBase,
  switchSegmentedUncheckedLabel,
  switchSizeVariants,
} from './switch.css'
import type { SwitchProps, SwitchSegmentedProps, SwitchSize, SwitchWithLabelProps } from './switch.props'
import { switchPropDefs } from './switch.props'

export type { SwitchProps, SwitchSegmentedProps, SwitchWithLabelProps } from './switch.props'
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
    const effectiveDisabled = safeDisabled || fieldGroup.disabled

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
    const effectiveDisabled = props.disabled || fieldGroup.disabled

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

const segmentedSizeClasses: Record<SwitchSize, string> = {
  xs: 'h-6 min-w-20',
  sm: 'h-7 min-w-24',
  md: 'h-8 min-w-28',
  lg: 'h-9 min-w-32',
}

const segmentedLabelSize: Record<SwitchSize, TextProps['size']> = {
  xs: 'xs',
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
}

const SwitchSegmented = React.forwardRef<HTMLButtonElement, SwitchSegmentedProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      uncheckedLabel,
      checkedLabel,
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.primary,
      radius: radiusProp,
      disabled,
      highContrast = false,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const radius = radiusProp ?? fieldGroup.radius ?? 'md'
    const safeVariant = normalizeEnumPropValue(switchPropDefs.variant, variant) ?? switchPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(switchPropDefs.color, color) ?? SemanticColor.primary
    const safeRadius = normalizeEnumPropValue(switchPropDefs.radius, radius) ?? 'md'
    const safeHighContrast = normalizeBooleanPropValue(switchPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = normalizeBooleanPropValue(switchPropDefs.disabled, disabled) ?? false
    const effectiveDisabled = safeDisabled || fieldGroup.disabled
    const uncheckedLabelId = React.useId()
    const checkedLabelId = React.useId()
    const resolvedAriaLabelledBy =
      ariaLabelledBy ?? (ariaLabel == null ? `${uncheckedLabelId} ${checkedLabelId}` : undefined)

    return (
      <div
        className={cn(
          'relative inline-grid grid-cols-[1fr_1fr] items-center font-medium',
          segmentedSizeClasses[size],
          className,
        )}
      >
        <SwitchPrimitive.Root
          ref={ref as React.Ref<HTMLElement>}
          aria-label={ariaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={effectiveDisabled}
          style={formColorVars[safeColor] as React.CSSProperties}
          className={cn(
            'peer group/switch absolute inset-0 h-[inherit] w-auto cursor-pointer overflow-hidden border transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            radiusStyleVariants[safeRadius],
            checkedColorCls,
            safeVariant === 'surface' && 'border-border bg-input',
            safeVariant === 'classic' && 'border-border bg-input',
            safeVariant === 'soft' && 'border-transparent bg-secondary/50',
            safeHighContrast && 'data-[checked]:shadow-md',
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              'pointer-events-none block h-full w-1/2 bg-background shadow-sm ring-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'data-[checked]:translate-x-full data-[checked]:rtl:-translate-x-full',
              radiusStyleVariants[safeRadius],
            )}
          />
        </SwitchPrimitive.Root>
        <Flex asChild align="center" justify="center">
          <Text
            as="span"
            id={uncheckedLabelId}
            color="neutral"
            size={segmentedLabelSize[size]}
            variant="solid"
            className={cn(switchSegmentedLabelBase, switchSegmentedUncheckedLabel)}
          >
            {uncheckedLabel}
          </Text>
        </Flex>
        <Flex asChild align="center" justify="center">
          <Text
            as="span"
            id={checkedLabelId}
            color="neutral"
            size={segmentedLabelSize[size]}
            variant="muted"
            className={cn(switchSegmentedLabelBase, switchSegmentedCheckedLabel)}
          >
            {checkedLabel}
          </Text>
        </Flex>
      </div>
    )
  },
)

SwitchSegmented.displayName = 'SwitchSegmented'

export { Switch, SwitchSegmented, SwitchWithLabel }
