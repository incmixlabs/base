import { clsx } from 'clsx'
import * as React from 'react'
import { Label } from '@/form/Label'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  type TextFieldSize,
  textFieldEnhancementVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldSizeVariants,
  textFieldSurfaceColorVariants,
} from '@/form/text-field.class'
import type { FloatingStyle } from '@/form/text-field-variant'
import { resolveSurfaceVariant } from '@/form/text-field-variant'
import { cn } from '@/lib/utils'
import type { Color, Radius, TextFieldVariant } from '@/theme/tokens'
import { datePickerTriggerGroupRadiusStyles } from './DatePicker.class'
import { dateSurfaceFocusOutline, dateSurfaceIconText, dateSurfaceText } from './date-surface.shared.class'

export const dateSegmentInputClassName = cn(
  'flex h-full min-w-0 flex-1 items-center gap-0 bg-transparent px-[var(--af-text-field-padding-x)]',
  'pr-[calc(var(--af-text-field-padding-x)*2+var(--af-text-field-icon-size))]',
  dateSurfaceText,
  'outline-none text-[var(--af-text-field-font-size)] leading-[var(--af-text-field-line-height)]',
)

export const dateSegmentClassName = cn(
  'rounded-sm px-0.5 outline-none transition-colors',
  'data-[type=literal]:px-0 data-[type=literal]:text-muted',
  'data-[placeholder]:text-muted data-[placeholder]:opacity-90',
  'focus:bg-transparent focus:text-neutral focus-visible:outline-none',
)

export function getDateSegmentClassName({
  type,
  isPlaceholder,
  isFocused,
  isFocusVisible,
}: {
  type: string
  isPlaceholder: boolean
  isFocused: boolean
  isFocusVisible: boolean
}) {
  const showsCaretCue = type !== 'literal' && (isFocused || isFocusVisible)
  return cn(
    dateSegmentClassName,
    isPlaceholder && showsCaretCue && [dateSurfaceText, 'opacity-100'],
    showsCaretCue &&
      'relative before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-px before:[background-color:var(--color-neutral-text)] before:content-[""]',
  )
}

export const dateIconSlotClassName = cn(
  'absolute inset-y-0 right-[2px] inline-flex items-center justify-center',
  'border-0 bg-transparent shadow-none',
  dateSurfaceIconText,
)

export const dateRangeInputSurfaceClassName = cn(
  'flex min-w-0 flex-1 items-center gap-[var(--element-gap)] bg-transparent px-[var(--af-text-field-padding-x)]',
  'pr-[calc(var(--af-text-field-padding-x)*2+var(--af-text-field-icon-size))]',
)

export const dateGhostIconButtonClassName = cn(
  'border-0 bg-transparent shadow-none',
  dateSurfaceIconText,
  dateSurfaceFocusOutline,
)

export function getDateFieldSurfaceClassName({
  color,
  radius,
  variant,
  floatingStyle,
  textFieldSize,
}: {
  color: Color
  radius: Radius
  variant?: TextFieldVariant
  floatingStyle: FloatingStyle | null
  textFieldSize: TextFieldSize
}) {
  const surfaceVariant = resolveSurfaceVariant(variant ?? 'outline')
  return clsx(
    cn(
      'relative box-border flex w-full min-w-0 items-center overflow-hidden transition-all duration-150 ease-in-out',
      dateSurfaceText,
      textFieldSizeVariants[textFieldSize],
      datePickerTriggerGroupRadiusStyles[radius],
      floatingStyle
        ? ['peer bg-neutral-background', floatingInputBaseCls]
        : ['h-[var(--af-text-field-height)] border', textFieldSurfaceColorVariants[color]?.[surfaceVariant]],
    ),
    floatingStyle && floatingInputStyleVariants[floatingStyle],
    floatingStyle && textFieldFloatingColorVariants[color]?.[floatingStyle],
    !floatingStyle && textFieldEnhancementVariants[color]?.[surfaceVariant],
  )
}

export function getDateFloatingLabelClassName(floatingStyle: FloatingStyle | null, isFloatingActive: boolean) {
  return cn(
    'pointer-events-none absolute origin-[0] select-none [font-size:var(--af-text-field-font-size)] text-[color:var(--af-text-field-color-text)] duration-300',
    floatingStyle === 'filled' && [
      'left-[var(--af-text-field-padding-x)] top-[0.875rem] z-10',
      isFloatingActive ? '-translate-y-4 scale-75' : 'translate-y-0 scale-100',
    ],
    floatingStyle === 'outlined' && [
      'left-[var(--af-text-field-padding-x)] top-[0.375rem] z-10',
      isFloatingActive
        ? '-translate-y-4 scale-75 bg-neutral-background px-1'
        : 'translate-y-3 scale-100 bg-transparent px-0',
    ],
    floatingStyle === 'standard' && [
      'left-0 top-[0.625rem] z-10',
      isFloatingActive ? '-translate-y-6 scale-75' : 'translate-y-0 scale-100',
    ],
  )
}

export function DateFieldWrapper({
  label,
  disabled,
  floatingStyle,
  color,
  textFieldSize,
  labelId,
  className,
  floatingActive,
  children,
}: {
  label?: React.ReactNode
  disabled?: boolean
  floatingStyle: FloatingStyle | null
  color: Color
  textFieldSize: TextFieldSize
  labelId?: string
  className?: string
  floatingActive?: boolean
  children: React.ReactNode
}) {
  const [hasFocusWithin, setHasFocusWithin] = React.useState(false)
  const isFloatingActive = Boolean(floatingActive || hasFocusWithin)

  if (floatingStyle) {
    return (
      <div
        onFocusCapture={() => setHasFocusWithin(true)}
        onBlurCapture={event => {
          const nextTarget = event.relatedTarget
          if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
          setHasFocusWithin(false)
        }}
        className={cn(
          'relative w-full',
          textFieldSizeVariants[textFieldSize],
          textFieldFloatingWrapperColorVariants[color],
          className,
        )}
      >
        <div className="w-full min-w-0">{children}</div>
        {label ? (
          <Label
            id={labelId}
            size={textFieldSize}
            disabled={disabled}
            className={getDateFloatingLabelClassName(floatingStyle, isFloatingActive)}
          >
            {label}
          </Label>
        ) : null}
      </div>
    )
  }

  if (label) {
    return (
      <div className={cn('grid gap-1.5', className)}>
        <Label id={labelId} size={textFieldSize} disabled={disabled}>
          {label}
        </Label>
        {children}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}
