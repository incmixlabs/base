'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'
import { Flex } from '@/layouts'
import { cn } from '@/lib/utils'
import { radiusClassByToken } from '@/theme/helpers'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { Text, type TextProps } from '@/typography'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { Label } from './Label'
import {
  switchColorVariants,
  switchHighContrastByVariant,
  switchRootBase,
  switchRootSize,
  switchSegmentedControlBase,
  switchSegmentedLabelBase,
  switchSegmentedLabelColorVariants,
  switchSegmentedRootBase,
  switchSegmentedSizeClasses,
  switchSegmentedThumbBase,
  switchSizeVariants,
  switchThumbBase,
} from './switch.class'
import type { SwitchProps, SwitchSegmentedProps, SwitchSize, SwitchWithLabelProps } from './switch.props'
import { switchPropDefs } from './switch.props'

export type { SwitchProps, SwitchSegmentedProps, SwitchWithLabelProps } from './switch.props'
export type { SwitchSize }

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
        className={cn(
          switchSizeVariants[size],
          switchRootBase,
          switchRootSize,
          radiusClassByToken[safeRadius],
          switchColorVariants[safeColor][safeVariant],
          safeHighContrast && 'af-high-contrast',
          safeHighContrast && switchHighContrastByVariant[safeVariant],
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className={switchThumbBase} />
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
      <div className={cn(switchSegmentedRootBase, switchSegmentedSizeClasses[size], className)}>
        <SwitchPrimitive.Root
          ref={ref as React.Ref<HTMLElement>}
          aria-label={ariaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={effectiveDisabled}
          className={cn(
            switchSegmentedControlBase,
            radiusClassByToken[safeRadius],
            switchColorVariants[safeColor][safeVariant],
            safeHighContrast && 'af-high-contrast',
            safeHighContrast && switchHighContrastByVariant[safeVariant],
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb className={cn(switchSegmentedThumbBase, radiusClassByToken[safeRadius])} />
        </SwitchPrimitive.Root>
        <Flex asChild align="center" justify="center">
          <Text
            as="span"
            id={uncheckedLabelId}
            size={segmentedLabelSize[size]}
            className={cn(switchSegmentedLabelBase, switchSegmentedLabelColorVariants[safeColor].unchecked)}
          >
            {uncheckedLabel}
          </Text>
        </Flex>
        <Flex asChild align="center" justify="center">
          <Text
            as="span"
            id={checkedLabelId}
            size={segmentedLabelSize[size]}
            className={cn(switchSegmentedLabelBase, switchSegmentedLabelColorVariants[safeColor].checked)}
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
