'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import * as m from 'motion/react-m'
import * as React from 'react'
import { Column, Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { Text } from '@/typography'
import {
  checkboxBase,
  checkboxBaseCls,
  checkboxCheckVariants,
  checkboxColorVariants,
  checkboxHighContrastByVariant,
  checkboxIndicator,
  checkboxSizeVariants,
} from './checkbox.css'
import type { CheckboxProps, CheckboxSize, CheckboxWithLabelProps } from './checkbox.props'
import { checkboxPropDefs } from './checkbox.props'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { Label } from './Label'

export type { CheckboxProps, CheckboxWithLabelProps } from './checkbox.props'
export type { CheckboxSize }

/** Checkbox export. */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      size: sizeProp,
      variant = 'solid',
      color = SemanticColor.slate,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      indeterminate = false,
      disabled = false,
      highContrast = false,
      required,
      name,
      value,
      className,
      id,
      style,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = sizeProp ?? fieldGroup.size
    const resolvedSize = resolveFormSize(size)
    const safeVariant = normalizeEnumPropValue(checkboxPropDefs.variant, variant) ?? checkboxPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(checkboxPropDefs.color, color) ?? SemanticColor.slate
    const safeHighContrast = normalizeBooleanPropValue(checkboxPropDefs.highContrast, highContrast) ?? false
    const effectiveDisabled = disabled || fieldGroup.readOnly

    const isControlled = checkedProp !== undefined
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false)
    const isChecked = isControlled ? checkedProp : uncontrolledChecked

    const handleCheckedChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledChecked(next)
        onCheckedChange?.(next)
      },
      [isControlled, onCheckedChange],
    )

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        {...(isControlled ? { checked: checkedProp } : { defaultChecked })}
        onCheckedChange={handleCheckedChange}
        indeterminate={indeterminate}
        disabled={effectiveDisabled}
        required={required}
        name={name}
        value={value}
        nativeButton
        render={<m.button type="button" whileTap={{ scale: 0.95 }} style={style} />}
        className={cn(
          checkboxBase,
          checkboxBaseCls,
          checkboxSizeVariants[resolvedSize],
          checkboxColorVariants[safeColor][safeVariant],
          safeHighContrast && 'af-high-contrast',
          safeHighContrast && checkboxHighContrastByVariant[safeVariant],
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          keepMounted
          render={
            <m.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              initial="unchecked"
              animate={isChecked || indeterminate ? 'checked' : 'unchecked'}
            />
          }
          className={checkboxIndicator}
        >
          {indeterminate ? (
            <m.line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, transition: { duration: 0.2 } }}
            />
          ) : (
            <m.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
              variants={checkboxCheckVariants}
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export {
  CheckboxGroup,
  type CheckboxGroupItemProps,
  type CheckboxGroupProps,
  type CheckboxGroupRootProps,
} from './CheckboxGroup'

/** CheckboxWithLabel export. */
export const CheckboxWithLabel = React.forwardRef<HTMLButtonElement, CheckboxWithLabelProps>(
  ({ label, description, id, size = 'sm', className, ...props }, ref) => {
    const fieldGroup = useFieldGroup()
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    const effectiveDisabled = props.disabled || fieldGroup.readOnly

    return (
      <Row align="start" gap="2" className={className}>
        <Checkbox ref={ref} id={checkboxId} size={size} {...props} />
        <Column>
          <Label htmlFor={checkboxId} size={size} disabled={effectiveDisabled}>
            {label}
          </Label>
          {description && (
            <Text size="xs" className="text-muted-foreground mt-1">
              {description}
            </Text>
          )}
        </Column>
      </Row>
    )
  },
)

CheckboxWithLabel.displayName = 'CheckboxWithLabel'
