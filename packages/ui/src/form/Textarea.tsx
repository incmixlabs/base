'use client'

import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import type { TextareaProps } from './text-area.props'
import {
  floatingInputStyleVariants,
  floatingLabelStyleVariants,
  textFieldColorVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldInputBaseCls,
  textFieldRootCls,
  textFieldSizeVariants,
} from './text-field.css'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'

export type { TextareaProps } from './text-area.props'

/** Textarea export. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size: sizeProp,
      variant: variantProp,
      color,
      radius: radiusProp,
      error = false,
      resize = 'vertical',
      label,
      autoSize = false,
      minRows,
      maxRows,
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
    const size = (sizeProp ?? fieldGroup.size) as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly === true

    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const radiusStyles = getRadiusStyles(radius)
    const generatedId = React.useId()
    const textareaId = id || generatedId

    const combinedStyles = {
      ...radiusStyles,
      ...style,
    } as React.CSSProperties
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    // Determine effective color (error overrides)
    const effectiveColor: Color = error ? 'error' : (color ?? 'slate')

    const floatingStyle = getFloatingStyle(variant)

    // For floating variants, use placeholder as label if no label provided
    // Strip placeholder from props for floating variants to prevent text collision with label
    const { placeholder, ...textareaProps } = props
    const effectiveLabel = label || (isFloatingVariant(variant) ? placeholder : undefined)

    // Resize classes - disable resize when autoSize is enabled
    const effectiveResize = autoSize ? 'none' : resize
    const resizeClass =
      effectiveResize === 'none'
        ? 'resize-none'
        : effectiveResize === 'vertical'
          ? 'resize-y'
          : effectiveResize === 'horizontal'
            ? 'resize-x'
            : 'resize'

    // Common textarea element to use (native or autosize)
    const TextareaElement = autoSize ? TextareaAutosize : 'textarea'

    // AutoSize specific props
    const autoSizeProps = autoSize ? { minRows, maxRows } : {}

    // If floating variant, render the floating version
    if (isFloatingVariant(variant)) {
      return (
        <div
          className={cn(
            textFieldRootCls,
            textFieldSizeVariants[size],
            textFieldFloatingWrapperColorVariants[effectiveColor],
            marginProps.className,
          )}
          style={{ ...marginProps.style, ...radiusStyles }}
        >
          <TextareaElement
            ref={ref}
            id={textareaId}
            placeholder=" "
            disabled={effectiveDisabled}
            readOnly={effectiveReadOnly}
            aria-invalid={error || undefined}
            style={style as React.CSSProperties & { height?: number }}
            className={cn(
              textFieldInputBaseCls,
              'peer',
              'box-border h-auto min-h-[calc(var(--tf-height)*2)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              resizeClass,

              // VE: color styles for floating variants
              floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],

              // VE: floating layout (padding, borders, radius)
              floatingStyle && floatingInputStyleVariants[floatingStyle],
              className,
            )}
            {...autoSizeProps}
            {...textareaProps}
          />

          {effectiveLabel && (
            <label
              htmlFor={textareaId}
              className={cn(
                'duration-300 origin-[0]',
                'pointer-events-none select-none',

                // VE: floating label positioning by style
                floatingStyle && floatingLabelStyleVariants[floatingStyle],
              )}
            >
              {effectiveLabel}
            </label>
          )}
        </div>
      )
    }

    const surfaceVariant = resolveSurfaceVariant(variant)

    // Regular (non-floating) textarea
    const regularClasses = cn(
      textFieldInputBaseCls,
      'box-border',
      'min-h-[calc(var(--tf-height)*2)]',
      'px-[var(--tf-padding-x)] py-[var(--tf-padding-y)]',
      'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)]',
      'rounded-[var(--element-border-radius)]',
      'border',
      resizeClass,
      textFieldColorVariants[effectiveColor]?.[surfaceVariant],
      effectiveDisabled && 'opacity-50 cursor-not-allowed',
    )

    const control = autoSize ? (
      <TextareaAutosize
        ref={ref}
        id={textareaId}
        aria-invalid={error || undefined}
        className={cn(textFieldRootCls, textFieldSizeVariants[size], regularClasses)}
        style={combinedStyles as React.CSSProperties & { height?: number }}
        disabled={effectiveDisabled}
        readOnly={effectiveReadOnly}
        placeholder={placeholder}
        minRows={minRows}
        maxRows={maxRows}
        {...textareaProps}
      />
    ) : (
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error || undefined}
        className={cn(textFieldRootCls, textFieldSizeVariants[size], regularClasses)}
        style={combinedStyles}
        disabled={effectiveDisabled}
        readOnly={effectiveReadOnly}
        placeholder={placeholder}
        {...textareaProps}
      />
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
        <Label htmlFor={textareaId} disabled={effectiveDisabled} color={error ? SemanticColor.error : undefined}>
          {label}
        </Label>
        {control}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
