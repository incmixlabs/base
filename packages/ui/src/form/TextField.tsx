'use client'

import { clsx } from 'clsx'
import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  floatingInputWithLeftIconCls,
  floatingInputWithRightIconCls,
  floatingLabelStyleVariants,
  floatingLabelWithLeftIconCls,
  textFieldColorVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldIconCls,
  textFieldIconContainerCls,
  textFieldInputBaseCls,
  textFieldInputWithLeftElementCls,
  textFieldInputWithRightElementCls,
  textFieldLeftIconContainerCls,
  textFieldRightIconContainerCls,
  textFieldRootCls,
  textFieldSizeVariants,
} from './text-field.css'
import type { TextFieldProps } from './text-field.props'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'

export type { TextFieldVariant } from '@/theme/tokens'
export type { TextFieldProps } from './text-field.props'

/** TextField export. */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      size: sizeProp,
      variant: variantProp,
      color,
      radius: radiusProp,
      error = false,
      leftIcon,
      rightIcon,
      leftElement,
      rightElement,
      label,
      className,
      style,
      disabled,
      readOnly,
      id,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      ...props
    },
    ref,
  ) => {
    // Get context values from FieldGroup (if wrapped)
    const fieldGroup = useFieldGroup()
    const size = (sizeProp ?? fieldGroup.size ?? 'md') as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant ?? 'outline'
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly === true || fieldGroup.readOnly

    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const radiusStyles = getRadiusStyles(radius)
    const generatedId = React.useId()
    const inputId = id || generatedId

    // Determine effective color (error overrides)
    const effectiveColor: Color = error ? 'error' : (color ?? 'slate')

    const regularStyles = {
      ...radiusStyles,
      ...style,
    } as React.CSSProperties
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    const floatingStyle = getFloatingStyle(variant)

    // For floating variants, use placeholder as label if no label provided
    // Strip placeholder from props for floating variants to prevent text collision with label
    const { placeholder, defaultValue, onBlur, onChange, onFocus, value, ...inputProps } = props
    const effectiveLabel = label || (isFloatingVariant(variant) ? placeholder : undefined)
    const [floatingFocused, setFloatingFocused] = React.useState(false)
    const [floatingHasValue, setFloatingHasValue] = React.useState(() => hasInputValue(value ?? defaultValue))

    React.useEffect(() => {
      if (value !== undefined) {
        setFloatingHasValue(hasInputValue(value))
      }
    }, [value])

    // If floating variant, render the floating version
    if (isFloatingVariant(variant)) {
      const floatingIconStyle = {
        top:
          floatingStyle === 'standard'
            ? 'calc(0.75rem + (var(--tf-line-height) / 2))'
            : 'calc(1rem + (var(--tf-line-height) / 2))',
      } as React.CSSProperties

      return (
        <div
          className={clsx(
            cn(textFieldRootCls, marginProps.className, className),
            textFieldSizeVariants[size],
            textFieldFloatingWrapperColorVariants[effectiveColor],
          )}
          style={{ ...marginProps.style, ...radiusStyles, ...style }}
        >
          {leftIcon && (
            <div
              className={clsx(
                cn(textFieldIconContainerCls, 'left-0 pointer-events-none'),
                textFieldLeftIconContainerCls,
                textFieldIconCls,
              )}
              style={floatingIconStyle}
            >
              <Flex align="center" justify="center" className="text-muted-foreground">
                {leftIcon}
              </Flex>
            </div>
          )}

          {leftElement && (
            <div
              className={clsx(cn(textFieldIconContainerCls, 'left-0'), textFieldLeftIconContainerCls)}
              style={floatingIconStyle}
            >
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            disabled={effectiveDisabled}
            aria-invalid={error || undefined}
            readOnly={effectiveReadOnly}
            data-filled={floatingHasValue ? '' : undefined}
            data-focused={floatingFocused ? '' : undefined}
            className={clsx(
              cn(textFieldInputBaseCls, 'peer', floatingInputBaseCls),
              // VE classes must be joined outside tailwind-merge or one generated class can be dropped.
              floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],
              floatingStyle && floatingInputStyleVariants[floatingStyle],
              (leftIcon || leftElement) && floatingInputWithLeftIconCls,
              (rightIcon || rightElement) && floatingInputWithRightIconCls,
            )}
            {...inputProps}
            onBlur={event => {
              setFloatingFocused(false)
              onBlur?.(event)
            }}
            onChange={event => {
              setFloatingHasValue(hasInputValue(event.currentTarget.value))
              onChange?.(event)
            }}
            onFocus={event => {
              setFloatingFocused(true)
              onFocus?.(event)
            }}
          />

          {effectiveLabel && (
            <label
              htmlFor={inputId}
              className={clsx(
                cn(
                  // TW: static label styles
                  'absolute duration-300 origin-[0]',
                  'pointer-events-none select-none',
                ),
                // VE classes must be joined outside tailwind-merge or generated positioning can be dropped.
                floatingStyle && floatingLabelStyleVariants[floatingStyle],
                (leftIcon || leftElement) && floatingLabelWithLeftIconCls,
              )}
            >
              {effectiveLabel}
            </label>
          )}

          {rightIcon && (
            <div
              className={clsx(
                cn(textFieldIconContainerCls, 'right-0 pointer-events-none'),
                textFieldRightIconContainerCls,
                textFieldIconCls,
              )}
              style={floatingIconStyle}
            >
              <Flex align="center" justify="center" className="text-muted-foreground">
                {rightIcon}
              </Flex>
            </div>
          )}

          {rightElement && (
            <div
              className={clsx(cn(textFieldIconContainerCls, 'right-0'), textFieldRightIconContainerCls)}
              style={floatingIconStyle}
            >
              {rightElement}
            </div>
          )}
        </div>
      )
    }

    // Regular (non-floating) text field
    const surfaceVariant = resolveSurfaceVariant(variant)

    const control = (
      <div className={clsx(cn(textFieldRootCls), textFieldSizeVariants[size])} style={regularStyles}>
        {leftIcon && (
          <div
            className={clsx(
              cn(textFieldIconContainerCls, 'left-0 pointer-events-none'),
              textFieldLeftIconContainerCls,
              textFieldIconCls,
            )}
          >
            <Flex align="center" justify="center" className="text-muted-foreground">
              {leftIcon}
            </Flex>
          </div>
        )}

        {leftElement && (
          <div className={clsx(cn(textFieldIconContainerCls, 'left-0'), textFieldLeftIconContainerCls)}>
            {leftElement}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={effectiveDisabled}
          aria-invalid={error || undefined}
          readOnly={effectiveReadOnly}
          className={cn(
            textFieldInputBaseCls,
            'box-border h-[var(--tf-height)]',
            'px-[var(--tf-padding-x)] py-[var(--tf-padding-y)]',
            'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)]',
            'rounded-[var(--element-border-radius)]',

            'border',
            textFieldColorVariants[effectiveColor]?.[surfaceVariant],

            (leftIcon || leftElement) && textFieldInputWithLeftElementCls,
            (rightIcon || rightElement) && textFieldInputWithRightElementCls,

            effectiveDisabled && 'opacity-50 cursor-not-allowed',
          )}
          placeholder={placeholder}
          {...inputProps}
        />

        {rightIcon && (
          <div
            className={clsx(
              cn(textFieldIconContainerCls, 'right-0 pointer-events-none'),
              textFieldRightIconContainerCls,
              textFieldIconCls,
            )}
          >
            <Flex align="center" justify="center" className="text-muted-foreground">
              {rightIcon}
            </Flex>
          </div>
        )}

        {rightElement && (
          <div className={clsx(cn(textFieldIconContainerCls, 'right-0'), textFieldRightIconContainerCls)}>
            {rightElement}
          </div>
        )}
      </div>
    )

    if (!label) {
      return (
        <div className={cn(marginProps.className, className)} style={marginProps.style}>
          {control}
        </div>
      )
    }

    return (
      <div className={cn('grid gap-1.5', marginProps.className, className)} style={marginProps.style}>
        <Label htmlFor={inputId} disabled={effectiveDisabled} color={error ? SemanticColor.error : undefined}>
          {label}
        </Label>
        {control}
      </div>
    )
  },
)

TextField.displayName = 'TextField'

function hasInputValue(value: React.InputHTMLAttributes<HTMLInputElement>['value'] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0
  return value != null && String(value).length > 0
}
