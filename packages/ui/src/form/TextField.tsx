'use client'

import { clsx } from 'clsx'
import * as React from 'react'
import { Icon, type IconProps } from '@/elements/button/Icon'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { formControlBorderFrame } from './form-control.class'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  floatingInputWithLeftIconCls,
  floatingInputWithRightIconCls,
  floatingLabelFocusedPlaceholderVariants,
  floatingLabelStyleVariants,
  floatingLabelWithLeftIconCls,
  textFieldEnhancementVariants,
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
  textFieldSurfaceColorVariants,
} from './text-field.class'
import type { TextFieldProps } from './text-field.props'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'
import { useFloatingFieldState } from './use-floating-field-state'

export type { TextFieldVariant } from '@/theme/tokens'
export type { TextFieldProps } from './text-field.props'

type TextFieldIconSize = NonNullable<IconProps['size']>
const textFieldIconSlotBase = 'box-border flex min-w-0 items-center justify-center'

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
    const { floatingFocused, floatingHasValue, handleBlur, handleChange, handleFocus } =
      useFloatingFieldState<HTMLInputElement>({
        defaultValue,
        onBlur,
        onChange,
        onFocus,
        value,
      })

    // If floating variant, render the floating version
    if (isFloatingVariant(variant)) {
      const floatingIconStyle = {
        top: '50%',
      } as React.CSSProperties
      const leftSlotStyle = {
        ...floatingIconStyle,
        left: 'calc(var(--af-text-field-padding-x) + var(--af-text-field-gap))',
      } as React.CSSProperties
      const rightSlotStyle = {
        ...floatingIconStyle,
        right: 'calc(var(--af-text-field-padding-x) + var(--af-text-field-gap))',
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
                textFieldIconSlotBase,
                textFieldIconContainerCls,
                'pointer-events-none',
                textFieldLeftIconContainerCls,
                textFieldIconCls,
                'text-muted',
              )}
              style={leftSlotStyle}
            >
              <Icon aria-hidden color={effectiveColor} icon={leftIcon} size={iconSize} />
            </div>
          )}

          {leftElement && (
            <div
              className={clsx(textFieldIconSlotBase, textFieldIconContainerCls, textFieldLeftIconContainerCls)}
              style={leftSlotStyle}
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
              // Keep prop-map classes outside tailwind-merge so arbitrary selectors remain intact.
              floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],
              floatingStyle && floatingInputStyleVariants[floatingStyle],
              (leftIcon || leftElement) && floatingInputWithLeftIconCls,
              (rightIcon || rightElement) && floatingInputWithRightIconCls,
            )}
            {...inputProps}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
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
                // Keep prop-map classes outside tailwind-merge so peer selector variants remain intact.
                floatingStyle && floatingLabelStyleVariants[floatingStyle],
                floatingStyle &&
                  floatingFocused &&
                  !floatingHasValue &&
                  floatingLabelFocusedPlaceholderVariants[floatingStyle],
                (leftIcon || leftElement) && floatingLabelWithLeftIconCls,
              )}
            >
              {effectiveLabel}
            </label>
          )}

          {rightIcon && (
            <div
              className={clsx(
                textFieldIconSlotBase,
                textFieldIconContainerCls,
                'pointer-events-none',
                textFieldRightIconContainerCls,
                textFieldIconCls,
                'text-muted',
              )}
              style={rightSlotStyle}
            >
              <Icon aria-hidden color={effectiveColor} icon={rightIcon} size={iconSize} />
            </div>
          )}

          {rightElement && (
            <div
              className={clsx(textFieldIconSlotBase, textFieldIconContainerCls, textFieldRightIconContainerCls)}
              style={rightSlotStyle}
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
              textFieldIconSlotBase,
              textFieldIconContainerCls,
              'pointer-events-none',
              textFieldLeftIconContainerCls,
              textFieldIconCls,
              'text-muted',
            )}
          >
            <Icon aria-hidden color={effectiveColor} icon={leftIcon} size={iconSize} />
          </div>
        )}

        {leftElement && (
          <div className={clsx(textFieldIconSlotBase, textFieldIconContainerCls, textFieldLeftIconContainerCls)}>
            {leftElement}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={effectiveDisabled}
          aria-invalid={error || undefined}
          readOnly={effectiveReadOnly}
          className={clsx(
            cn(
              textFieldInputBaseCls,
              'box-border h-[var(--af-text-field-height)]',
              'px-[var(--af-text-field-padding-x)] py-[var(--af-text-field-padding-y)]',
              '[font-size:var(--af-text-field-font-size)] leading-[var(--af-text-field-line-height)]',
              formControlBorderFrame,
              textFieldSurfaceColorVariants[effectiveColor]?.[surfaceVariant],

              effectiveDisabled && 'opacity-50 cursor-not-allowed',
            ),
            // Keep prop-map classes outside tailwind-merge so semantic text utilities are not merged away.
            (leftIcon || leftElement) && textFieldInputWithLeftElementCls,
            (rightIcon || rightElement) && textFieldInputWithRightElementCls,
            textFieldEnhancementVariants[effectiveColor]?.[surfaceVariant],
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
          <div
            className={clsx(
              textFieldIconSlotBase,
              textFieldIconContainerCls,
              'pointer-events-none',
              textFieldRightIconContainerCls,
              textFieldIconCls,
              'text-muted',
            )}
          >
            <Icon aria-hidden color={effectiveColor} icon={rightIcon} size={iconSize} />
          </div>
        )}

        {rightElement && (
          <div className={clsx(textFieldIconSlotBase, textFieldIconContainerCls, textFieldRightIconContainerCls)}>
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

function textFieldIconSize(size: ExtendedFormSize): TextFieldIconSize {
  return size === '2x' ? 'xl' : size
}
