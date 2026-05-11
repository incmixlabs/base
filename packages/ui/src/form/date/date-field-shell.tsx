import type * as React from 'react'
import { Label } from '@/form/Label'
import {
  floatingInputBaseCls,
  floatingInputStyleVariants,
  type TextFieldSize,
  textFieldColorVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
  textFieldSizeVariants,
} from '@/form/text-field.css'
import type { FloatingStyle } from '@/form/text-field-variant'
import { resolveSurfaceVariant } from '@/form/text-field-variant'
import { cn } from '@/lib/utils'
import type { Color, TextFieldVariant } from '@/theme/tokens'
import { datePickerTriggerGroupRadiusStyles } from './DatePicker.css'

export const dateSegmentInputClassName = cn(
  'flex h-full min-w-0 flex-1 items-center gap-0 bg-transparent px-[var(--tf-padding-x)]',
  'pr-[calc(var(--tf-padding-x)*2+var(--tf-icon-size))]',
  'text-foreground outline-none text-[var(--tf-font-size)] leading-[var(--tf-line-height)]',
)

export const dateSegmentClassName = cn(
  'rounded-sm px-0.5 outline-none transition-colors',
  'data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground',
  'data-[placeholder]:text-muted-foreground data-[placeholder]:opacity-90',
  'focus:bg-transparent focus:text-foreground focus-visible:outline-none',
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
    isPlaceholder && showsCaretCue && 'text-foreground opacity-100',
    showsCaretCue &&
      'relative before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-px before:bg-foreground before:content-[""]',
  )
}

export const dateIconSlotClassName = cn(
  'absolute inset-y-0 right-[2px] inline-flex items-center justify-center',
  'border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:text-foreground',
)

export const dateRangeInputSurfaceClassName = cn(
  'flex min-w-0 flex-1 items-center gap-[var(--element-gap)] bg-transparent px-[var(--tf-padding-x)]',
  'pr-[calc(var(--tf-padding-x)*2+var(--tf-icon-size))]',
)

export const dateGhostIconButtonClassName = cn(
  'border-0 bg-transparent shadow-none text-muted-foreground transition-colors hover:text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
)

export function getDateFieldSurfaceClassName({
  color,
  radius,
  variant,
  floatingStyle,
  textFieldSize,
}: {
  color: Color
  radius: string
  variant?: TextFieldVariant
  floatingStyle: FloatingStyle | null
  textFieldSize: TextFieldSize
}) {
  const surfaceVariant = resolveSurfaceVariant(variant ?? 'outline', { allowLegacy: true })
  return cn(
    'relative box-border flex w-full min-w-0 items-center overflow-hidden text-foreground transition-all duration-150 ease-in-out',
    textFieldSizeVariants[textFieldSize],
    datePickerTriggerGroupRadiusStyles[radius],
    floatingStyle
      ? [
          'peer bg-background',
          floatingInputBaseCls,
          floatingInputStyleVariants[floatingStyle],
          textFieldFloatingColorVariants[color]?.[floatingStyle],
        ]
      : ['h-[var(--tf-height)] border', textFieldColorVariants[color]?.[surfaceVariant]],
  )
}

export function getDateFloatingLabelClassName(floatingStyle: FloatingStyle | null, isFloatingActive: boolean) {
  return cn(
    'pointer-events-none absolute origin-[0] select-none text-[length:var(--tf-font-size)] text-[color:var(--tf-color-text)] duration-300',
    floatingStyle === 'filled' && [
      'left-[var(--tf-padding-x)] top-[0.875rem] z-10',
      isFloatingActive ? '-translate-y-4 scale-75' : 'translate-y-0 scale-100',
    ],
    floatingStyle === 'outlined' && [
      'left-[var(--tf-padding-x)] top-[0.375rem] z-10',
      isFloatingActive ? '-translate-y-4 scale-75 bg-background px-1' : 'translate-y-3 scale-100 bg-transparent px-0',
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
  children,
}: {
  label?: React.ReactNode
  disabled?: boolean
  floatingStyle: FloatingStyle | null
  color: Color
  textFieldSize: TextFieldSize
  labelId?: string
  className?: string
  children: React.ReactNode
}) {
  if (floatingStyle) {
    return (
      <div
        className={cn(
          'relative w-full',
          textFieldSizeVariants[textFieldSize],
          textFieldFloatingWrapperColorVariants[color],
          className,
        )}
      >
        <div className="w-full min-w-0">{children}</div>
        {label ? (
          <label id={labelId} className={getDateFloatingLabelClassName(floatingStyle, true)}>
            {label}
          </label>
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
