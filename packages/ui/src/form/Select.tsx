'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { clsx } from 'clsx'
import { CheckIcon, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { ExtendedFormSize } from './form-size'
import { Label } from './Label'
import type { SelectItemProps, SelectProps } from './select.props'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  floatingLabelStyleVariants,
  textFieldColorVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldSizeVariants,
} from './text-field.css'
import { getFloatingStyle, isFloatingVariant, resolveSurfaceVariant } from './text-field-variant'

export type { SelectItemProps, SelectProps } from './select.props'

/** Select export. */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      label,
      size: sizeProp,
      variant: variantProp,
      color,
      radius: radiusProp,
      error = false,
      placeholder = 'Select...',
      value,
      defaultValue,
      defaultOpen,
      onOpenChange,
      onValueChange,
      'aria-invalid': ariaInvalid,
      portalContainer: portalContainerProp,
      disabled,
      readOnly,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const fieldGroup = useFieldGroup()
    const size = (sizeProp ?? fieldGroup.size) as ExtendedFormSize
    const variant = variantProp ?? fieldGroup.variant
    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const radiusStyles = getRadiusStyles(radius)
    const effectiveReadOnly = readOnly === true || fieldGroup.readOnly
    const effectiveDisabled = disabled || effectiveReadOnly || fieldGroup.disabled
    const themePortalContainer = useThemePortalContainer()
    const portalContainer = portalContainerProp ?? themePortalContainer

    const effectiveColor: Color = error ? 'error' : (color ?? 'slate')

    const combinedStyles: React.CSSProperties = {
      ...radiusStyles,
    }

    const handleValueChange = onValueChange
      ? (newValue: string | null) => {
          if (newValue !== null) {
            onValueChange(newValue)
          }
        }
      : undefined

    const floatingStyle = getFloatingStyle(variant)

    // For floating variants, use placeholder as label if no label provided
    const effectiveLabel = label || (isFloatingVariant(variant) ? placeholder : undefined)
    const effectiveId = id ?? (effectiveLabel ? generatedId : undefined)

    // Shared popup portal (used by both regular and floating paths)
    const popupPortal = (
      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Positioner sideOffset={4} className="z-50">
          <SelectPrimitive.Popup
            className={cn(
              'isolate relative min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
              'data-open:animate-in data-closed:animate-out',
              'data-closed:fade-out-0 data-open:fade-in-0',
              'data-closed:zoom-out-95 data-open:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            )}
          >
            <SelectPrimitive.List className="p-1">{children}</SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    )

    // Floating variant render path
    if (isFloatingVariant(variant)) {
      return (
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          onValueChange={handleValueChange}
          disabled={effectiveDisabled}
        >
          <div
            className={cn(
              'relative w-full',
              textFieldSizeVariants[size],
              textFieldFloatingWrapperColorVariants[effectiveColor],
            )}
            style={combinedStyles}
          >
            <SelectPrimitive.Trigger
              id={effectiveId}
              ref={ref}
              aria-invalid={ariaInvalid ?? (error || undefined)}
              className={clsx(
                cn(
                  'peer inline-flex items-center justify-between w-full outline-none transition-all duration-150 ease-in-out',
                  'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)]',
                  floatingInputBaseCls,
                  className,
                ),
                // VE classes must be joined outside tailwind-merge or one generated class can be dropped.
                floatingStyle && floatingInputStyleVariants[floatingStyle],
                floatingStyle && textFieldFloatingColorVariants[effectiveColor]?.[floatingStyle],
              )}
              {...props}
            >
              <SelectPrimitive.Value>
                {(selectedValue: string | null) => selectedValue || <span className="opacity-0">{placeholder}</span>}
              </SelectPrimitive.Value>
              <SelectPrimitive.Icon render={<ChevronDown className="h-4 w-4 opacity-50 ml-2" />} />
            </SelectPrimitive.Trigger>

            {effectiveLabel && (
              <label
                htmlFor={effectiveId}
                className={cn(
                  'absolute duration-300 origin-[0]',
                  'pointer-events-none select-none',
                  floatingStyle && floatingLabelStyleVariants[floatingStyle],
                )}
              >
                {effectiveLabel}
              </label>
            )}
          </div>

          {popupPortal}
        </SelectPrimitive.Root>
      )
    }

    // Regular (non-floating) render path
    const surfaceVariant = resolveSurfaceVariant(variant, { allowLegacy: true })

    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onValueChange={handleValueChange}
        disabled={effectiveDisabled}
      >
        <div className={cn('grid gap-1.5', textFieldSizeVariants[size])} style={combinedStyles}>
          {label ? (
            <Label htmlFor={effectiveId} color={error ? SemanticColor.error : undefined} disabled={effectiveDisabled}>
              {label}
            </Label>
          ) : null}
          <SelectPrimitive.Trigger
            id={effectiveId}
            ref={ref}
            aria-invalid={ariaInvalid ?? (error || undefined)}
            className={cn(
              'inline-flex items-center justify-between w-full outline-none transition-all duration-150 ease-in-out',
              'border',
              'h-[var(--tf-height)]',
              'px-[var(--tf-padding-x)] py-[var(--tf-padding-y)]',
              'text-[length:var(--tf-font-size)] leading-[var(--tf-line-height)]',
              'rounded-[var(--element-border-radius)]',
              textFieldColorVariants[effectiveColor]?.[surfaceVariant],
              effectiveDisabled && 'opacity-50 cursor-not-allowed',
              className,
            )}
            {...props}
          >
            <SelectPrimitive.Value>
              {(selectedValue: string | null) =>
                selectedValue || <span className="text-muted-foreground">{placeholder}</span>
              }
            </SelectPrimitive.Value>
            <SelectPrimitive.Icon render={<ChevronDown className="h-4 w-4 opacity-50 ml-2" />} />
          </SelectPrimitive.Trigger>
        </div>

        {popupPortal}
      </SelectPrimitive.Root>
    )
  },
)

Select.displayName = 'Select'

/** SelectItem export. */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

SelectItem.displayName = 'SelectItem'
