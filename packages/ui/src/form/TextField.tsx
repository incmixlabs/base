'use client'

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
    const size = (sizeProp ?? fieldGroup.size) as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant

    const radius = useThemeRadius(radiusProp)
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
    const { placeholder, ...inputProps } = props
    const effectiveLabel = label || (isFloatingVariant(variant) ? placeholder : undefined)

    // If floating variant, render the floating version
    if (isFloatingVariant(variant)) {
      return (
        <div
          className={cn(
            textFieldRootCls,
            textFieldSizeVariants[size],
            textFieldFloatingWrapperColorVariants[effectiveColor],
            marginProps.className,
            className,
          )}
          style={{ ...marginProps.style, ...radiusStyles, ...style }}
        >
          {leftIcon && (
            <div
              className={cn(
                textFieldIconContainerCls,
                textFieldLeftIconContainerCls,
                textFieldIconCls,
                'left-0 pointer-events-none',
              )}
            >
              <Flex align="center" justify="center" className="text-muted-foreground">
                {leftIcon}
              </Flex>
            </div>
          )}

          {leftElement && (
            <div className={cn(textFieldIconContainerCls, textFieldLeftIconContainerCls, 'left-0')}>{leftElement}</div>
          )}

          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            disabled={disabled}
            className={cn(
              textFieldInputBaseCls,
              'peer',
              floatingInputBaseCls,

              // VE: color-dependent styles (text, border, bg, placeholder, focus)
              floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],

              // VE: layout per floating style (padding, border-width, border-radius)
              floatingStyle && floatingInputStyleVariants[floatingStyle],

              // VE: icon/element padding overrides
              (leftIcon || leftElement) && floatingInputWithLeftIconCls,
              (rightIcon || rightElement) && floatingInputWithRightIconCls,
            )}
            {...inputProps}
          />

          {effectiveLabel && (
            <label
              htmlFor={inputId}
              className={cn(
                // TW: static label styles
                'absolute duration-300 origin-[0]',
                'pointer-events-none select-none',

                // VE: floating style positioning (top, left, translate, scale, peer-* selectors)
                floatingStyle && floatingLabelStyleVariants[floatingStyle],

                // VE: left icon/element offset
                (leftIcon || leftElement) && floatingLabelWithLeftIconCls,
              )}
            >
              {effectiveLabel}
            </label>
          )}

          {rightIcon && (
            <div
              className={cn(
                textFieldIconContainerCls,
                textFieldRightIconContainerCls,
                textFieldIconCls,
                'right-0 pointer-events-none',
              )}
            >
              <Flex align="center" justify="center" className="text-muted-foreground">
                {rightIcon}
              </Flex>
            </div>
          )}

          {rightElement && (
            <div className={cn(textFieldIconContainerCls, textFieldRightIconContainerCls, 'right-0')}>
              {rightElement}
            </div>
          )}
        </div>
      )
    }

    // Regular (non-floating) text field
    const surfaceVariant = resolveSurfaceVariant(variant)

    const control = (
      <div className={cn(textFieldRootCls, textFieldSizeVariants[size])} style={regularStyles}>
        {leftIcon && (
          <div
            className={cn(
              textFieldIconContainerCls,
              textFieldLeftIconContainerCls,
              textFieldIconCls,
              'left-0 pointer-events-none',
            )}
          >
            <Flex align="center" justify="center" className="text-muted-foreground">
              {leftIcon}
            </Flex>
          </div>
        )}

        {leftElement && (
          <div className={cn(textFieldIconContainerCls, textFieldLeftIconContainerCls, 'left-0')}>{leftElement}</div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
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

            disabled && 'opacity-50 cursor-not-allowed',
          )}
          placeholder={placeholder}
          {...inputProps}
        />

        {rightIcon && (
          <div
            className={cn(
              textFieldIconContainerCls,
              textFieldRightIconContainerCls,
              textFieldIconCls,
              'right-0 pointer-events-none',
            )}
          >
            <Flex align="center" justify="center" className="text-muted-foreground">
              {rightIcon}
            </Flex>
          </div>
        )}

        {rightElement && (
          <div className={cn(textFieldIconContainerCls, textFieldRightIconContainerCls, 'right-0')}>{rightElement}</div>
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
        <Label htmlFor={inputId} disabled={disabled} color={error ? SemanticColor.error : undefined}>
          {label}
        </Label>
        {control}
      </div>
    )
  },
)

TextField.displayName = 'TextField'
