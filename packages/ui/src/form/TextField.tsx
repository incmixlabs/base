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
  floatingInputWithLeftElementSizeVariants,
  floatingInputWithLeftIconSizeVariants,
  floatingInputWithRightElementSizeVariants,
  floatingInputWithRightIconSizeVariants,
  floatingLabelFocusedPlaceholderVariants,
  floatingLabelSizeVariants,
  floatingLabelStyleVariants,
  floatingLabelWithLeftElementSizeVariants,
  floatingLabelWithLeftIconSizeVariants,
  textFieldControlContentSizeVariants,
  textFieldElementSlotOffsetSizeVariants,
  textFieldEnhancementVariants,
  textFieldFloatingBaseSizeVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingInputContentSizeVariants,
  textFieldFloatingLabelColorVariants,
  textFieldIconContainerCls,
  textFieldIconSizeVariants,
  textFieldInputBaseCls,
  textFieldInputLeftPaddingSizeVariants,
  textFieldInputRightPaddingSizeVariants,
  textFieldInputWithLeftElementSizeVariants,
  textFieldInputWithLeftIconSizeVariants,
  textFieldInputWithRightElementSizeVariants,
  textFieldInputWithRightIconSizeVariants,
  textFieldLabelEndPaddingSizeVariants,
  textFieldLeftIconContainerSizeVariants,
  textFieldRightIconContainerSizeVariants,
  textFieldRootCls,
  textFieldSurfaceColorVariants,
} from './text-field.class'
import type { TextFieldProps } from './text-field.props'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'
import { useFloatingFieldState } from './use-floating-field-state'

export type { TextFieldVariant } from '@/theme/tokens'
export type { TextFieldProps } from './text-field.props'

type TextFieldIconSize = NonNullable<IconProps['size']>
const textFieldIconSlotBase = 'box-border flex min-w-0 items-center justify-center'
const textFieldElementSlotBase = 'absolute inset-y-0 z-10 box-border flex min-w-0 items-center'

function toCssLength(value: React.CSSProperties['width']) {
  return typeof value === 'number' ? `${value}px` : value
}

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
      leftElementWidth,
      rightElementWidth,
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

    const fallbackElementSlotWidth = textFieldElementSlotOffsetSizeVariants[size]
    const leftElementSlotWidth = leftElementWidth ?? fallbackElementSlotWidth
    const rightElementSlotWidth = rightElementWidth ?? fallbackElementSlotWidth
    const inputElementSlotStyles = {
      ...(leftElement ? { paddingLeft: leftElementSlotWidth } : undefined),
      ...(rightElement ? { paddingRight: rightElementSlotWidth } : undefined),
    } as React.CSSProperties
    const leftElementSlotStyles = { width: leftElementSlotWidth } as React.CSSProperties
    const rightElementSlotStyles = { width: rightElementSlotWidth } as React.CSSProperties
    const leftElementLabelSlotWidth = toCssLength(leftElementSlotWidth)
    const leftElementFloatingLabelStyles =
      leftElement && leftElementLabelSlotWidth
        ? ({
            left: leftElementLabelSlotWidth,
            maxWidth: `calc(100% - (${leftElementLabelSlotWidth} + ${textFieldLabelEndPaddingSizeVariants[size]}))`,
          } satisfies React.CSSProperties)
        : undefined

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
      const floatingLabelSizeClass =
        floatingStyle &&
        (leftIcon
          ? floatingLabelWithLeftIconSizeVariants[size]?.[floatingStyle]
          : leftElement
            ? floatingLabelWithLeftElementSizeVariants[size]?.[floatingStyle]
            : floatingLabelSizeVariants[size]?.[floatingStyle])

      return (
        <div
          className={cn(textFieldRootCls, marginProps.className, className)}
          style={{ ...marginProps.style, ...radiusStyles, ...style }}
        >
          {leftIcon && (
            <div
              className={clsx(
                textFieldIconSlotBase,
                textFieldIconContainerCls,
                'pointer-events-none',
                textFieldLeftIconContainerSizeVariants[size],
                textFieldIconSizeVariants[size],
                'text-muted',
              )}
            >
              <Icon aria-hidden color={effectiveColor} icon={leftIcon} size={iconSize} />
            </div>
          )}

          {leftElement && (
            <div className={clsx(textFieldElementSlotBase, 'left-0 justify-start')} style={leftElementSlotStyles}>
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
            style={inputElementSlotStyles}
            className={clsx(
              cn(textFieldInputBaseCls, 'peer', floatingInputBaseCls),
              // Keep prop-map classes outside tailwind-merge so arbitrary selectors remain intact.
              textFieldFloatingBaseSizeVariants[size],
              floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],
              floatingStyle && floatingInputStyleVariants[floatingStyle],
              floatingStyle && textFieldFloatingInputContentSizeVariants[size],
              leftIcon
                ? floatingInputWithLeftIconSizeVariants[size]
                : leftElement
                  ? floatingInputWithLeftElementSizeVariants[size]
                  : textFieldInputLeftPaddingSizeVariants[size],
              rightIcon
                ? floatingInputWithRightIconSizeVariants[size]
                : rightElement
                  ? floatingInputWithRightElementSizeVariants[size]
                  : textFieldInputRightPaddingSizeVariants[size],
            )}
            {...inputProps}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
          />

          {effectiveLabel && (
            <label
              htmlFor={inputId}
              style={leftElementFloatingLabelStyles}
              className={clsx(
                cn(
                  // TW: static label styles
                  'absolute duration-300 origin-[0]',
                  'pointer-events-none select-none',
                ),
                // Keep prop-map classes outside tailwind-merge so peer selector variants remain intact.
                floatingStyle && floatingLabelStyleVariants[floatingStyle],
                floatingLabelSizeClass,
                textFieldFloatingLabelColorVariants[effectiveColor],
                floatingStyle &&
                  floatingFocused &&
                  !floatingHasValue &&
                  floatingLabelFocusedPlaceholderVariants[floatingStyle],
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
                textFieldRightIconContainerSizeVariants[size],
                textFieldIconSizeVariants[size],
                'text-muted',
              )}
            >
              <Icon aria-hidden color={effectiveColor} icon={rightIcon} size={iconSize} />
            </div>
          )}

          {rightElement && (
            <div className={clsx(textFieldElementSlotBase, 'right-0 justify-end')} style={rightElementSlotStyles}>
              {rightElement}
            </div>
          )}
        </div>
      )
    }

    // Regular (non-floating) text field
    const surfaceVariant = resolveSurfaceVariant(variant)

    const control = (
      <div className={cn(textFieldRootCls)} style={regularStyles}>
        {leftIcon && (
          <div
            className={clsx(
              textFieldIconSlotBase,
              textFieldIconContainerCls,
              'pointer-events-none',
              textFieldLeftIconContainerSizeVariants[size],
              textFieldIconSizeVariants[size],
              'text-muted',
            )}
          >
            <Icon aria-hidden color={effectiveColor} icon={leftIcon} size={iconSize} />
          </div>
        )}

        {leftElement && (
          <div className={clsx(textFieldElementSlotBase, 'left-0 justify-start')} style={leftElementSlotStyles}>
            {leftElement}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={effectiveDisabled}
          aria-invalid={error || undefined}
          readOnly={effectiveReadOnly}
          style={inputElementSlotStyles}
          className={clsx(
            cn(
              textFieldInputBaseCls,
              'box-border',
              textFieldControlContentSizeVariants[size],
              formControlBorderFrame,
              textFieldSurfaceColorVariants[effectiveColor]?.[surfaceVariant],

              effectiveDisabled && 'opacity-50 cursor-not-allowed',
            ),
            // Keep prop-map classes outside tailwind-merge so semantic text utilities are not merged away.
            leftIcon
              ? textFieldInputWithLeftIconSizeVariants[size]
              : leftElement
                ? textFieldInputWithLeftElementSizeVariants[size]
                : textFieldInputLeftPaddingSizeVariants[size],
            rightIcon
              ? textFieldInputWithRightIconSizeVariants[size]
              : rightElement
                ? textFieldInputWithRightElementSizeVariants[size]
                : textFieldInputRightPaddingSizeVariants[size],
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
              textFieldRightIconContainerSizeVariants[size],
              textFieldIconSizeVariants[size],
              'text-muted',
            )}
          >
            <Icon aria-hidden color={effectiveColor} icon={rightIcon} size={iconSize} />
          </div>
        )}

        {rightElement && (
          <div className={clsx(textFieldElementSlotBase, 'right-0 justify-end')} style={rightElementSlotStyles}>
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
