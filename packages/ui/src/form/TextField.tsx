'use client'

import { clsx } from 'clsx'
import * as React from 'react'
import { Icon, type IconProps } from '@/elements/button/Icon'
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

type TextFieldIconSize = NonNullable<IconProps['size']>

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
    const iconSize = textFieldIconSize(size)
    const variant = variantProp ?? fieldGroup.variant ?? 'outline'
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly === true || fieldGroup.readOnly

    const floatingStyle = getFloatingStyle(variant)
    const rawRadius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const radius = rawRadius === 'full' && floatingStyle === 'filled' ? 'lg' : rawRadius
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
      const leftSlotStyle = {
        ...floatingIconStyle,
        left: 'calc(var(--tf-padding-x) + var(--tf-gap))',
      } as React.CSSProperties
      const rightSlotStyle = {
        ...floatingIconStyle,
        right: 'calc(var(--tf-padding-x) + var(--tf-gap))',
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
            <Flex
              align="center"
              justify="center"
              className={clsx(
                cn(textFieldIconContainerCls, 'pointer-events-none'),
                textFieldLeftIconContainerCls,
                textFieldIconCls,
                'text-muted-foreground',
              )}
              style={leftSlotStyle}
            >
              <Icon aria-hidden color="neutral" icon={leftIcon} size={iconSize} />
            </Flex>
          )}

          {leftElement && (
            <Flex
              align="center"
              justify="center"
              className={clsx(cn(textFieldIconContainerCls), textFieldLeftIconContainerCls)}
              style={leftSlotStyle}
            >
              {leftElement}
            </Flex>
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
            <Flex
              align="center"
              justify="center"
              className={clsx(
                cn(textFieldIconContainerCls, 'pointer-events-none'),
                textFieldRightIconContainerCls,
                textFieldIconCls,
                'text-muted-foreground',
              )}
              style={rightSlotStyle}
            >
              <Icon aria-hidden color="neutral" icon={rightIcon} size={iconSize} />
            </Flex>
          )}

          {rightElement && (
            <Flex
              align="center"
              justify="center"
              className={clsx(cn(textFieldIconContainerCls), textFieldRightIconContainerCls)}
              style={rightSlotStyle}
            >
              {rightElement}
            </Flex>
          )}
        </div>
      )
    }

    // Regular (non-floating) text field
    const surfaceVariant = resolveSurfaceVariant(variant)

    const control = (
      <div className={clsx(cn(textFieldRootCls), textFieldSizeVariants[size])} style={regularStyles}>
        {leftIcon && (
          <Flex
            align="center"
            justify="center"
            className={clsx(
              cn(textFieldIconContainerCls, 'pointer-events-none'),
              textFieldLeftIconContainerCls,
              textFieldIconCls,
              'text-muted-foreground',
            )}
          >
            <Icon aria-hidden color="neutral" icon={leftIcon} size={iconSize} />
          </Flex>
        )}

        {leftElement && (
          <Flex
            align="center"
            justify="center"
            className={clsx(cn(textFieldIconContainerCls), textFieldLeftIconContainerCls)}
          >
            {leftElement}
          </Flex>
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
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          {...inputProps}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
        />

        {rightIcon && (
          <Flex
            align="center"
            justify="center"
            className={clsx(
              cn(textFieldIconContainerCls, 'pointer-events-none'),
              textFieldRightIconContainerCls,
              textFieldIconCls,
              'text-muted-foreground',
            )}
          >
            <Icon aria-hidden color="neutral" icon={rightIcon} size={iconSize} />
          </Flex>
        )}

        {rightElement && (
          <Flex
            align="center"
            justify="center"
            className={clsx(cn(textFieldIconContainerCls), textFieldRightIconContainerCls)}
          >
            {rightElement}
          </Flex>
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

function textFieldIconSize(size: ExtendedFormSize): TextFieldIconSize {
  return size === '2x' ? 'xl' : size
}
