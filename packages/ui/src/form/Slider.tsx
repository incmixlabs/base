'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import * as React from 'react'
import { sliderPropDefs } from '@/elements/slider/slider.props'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor, type SemanticColorKey } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { type FormSize, resolveFormSize } from './form-size'
import {
  sliderControlBase,
  sliderIndicatorBase,
  sliderIndicatorColorStyles,
  sliderIndicatorHighContrast,
  sliderRadiusVariants,
  sliderRootBase,
  sliderSoftIndicatorColorStyles,
  sliderSolidTrackColorStyles,
  sliderThumbBase,
  sliderThumbColorStyles,
  sliderThumbSizeVariants,
  sliderTrackBase,
  sliderTrackHeightVariants,
  sliderTrackHighContrast,
  sliderTrackVariantStyles,
  sliderTrackWidthVariants,
} from './Slider.class'

export type SliderSize = FormSize

// Variant styles
type SliderVariant = (typeof sliderPropDefs.variant.values)[number]

export interface SliderProps extends MarginProps {
  /** Current value */
  value?: number[]
  /** Default value */
  defaultValue?: number[]
  /** Callback when value changes */
  onValueChange?: (value: number[]) => void
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Size of the slider */
  size?: SliderSize
  /** Visual variant */
  variant?: SliderVariant
  /** Color of the slider */
  color?: SemanticColorKey
  /** Border radius */
  radius?: Radius
  /** High contrast mode */
  highContrast?: boolean
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      defaultValue = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.primary,
      radius = 'full',
      highContrast = false,
      disabled = false,
      orientation = 'horizontal',
      className,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const effectiveDisabled = disabled || fieldGroup.disabled
    const safeVariant = (normalizeEnumPropValue(sliderPropDefs.variant, variant) ??
      sliderPropDefs.variant.default) as SliderVariant
    const safeColor = (normalizeEnumPropValue(sliderPropDefs.color, color) ?? SemanticColor.primary) as SemanticColorKey
    const safeRadius = (normalizeEnumPropValue(sliderPropDefs.radius, radius) ?? 'full') as Radius
    const safeHighContrast = normalizeBooleanPropValue(sliderPropDefs.highContrast, highContrast) ?? false
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={effectiveDisabled}
        orientation={orientation}
        data-slot="slider"
        style={{ ...marginProps.style, ...style }}
        className={cn(
          sliderRootBase,
          orientation === 'horizontal' && 'w-full',
          orientation === 'vertical' && 'h-full flex-col',
          effectiveDisabled && 'opacity-50 cursor-not-allowed',
          marginProps.className,
          className,
        )}
      >
        <SliderPrimitive.Control
          data-slot="slider-control"
          className={cn(
            sliderControlBase,
            orientation === 'horizontal' && 'w-full',
            orientation === 'vertical' && 'h-full',
          )}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(
              sliderTrackBase,
              sliderRadiusVariants[safeRadius],
              orientation === 'horizontal' && ['w-full', sliderTrackHeightVariants[size]],
              orientation === 'vertical' && ['h-full', sliderTrackWidthVariants[size]],
              sliderTrackVariantStyles[safeVariant],
              safeVariant === 'solid' && sliderSolidTrackColorStyles[safeColor],
              safeHighContrast && sliderTrackHighContrast,
            )}
          >
            <SliderPrimitive.Indicator
              data-slot="slider-indicator"
              className={cn(
                sliderIndicatorBase,
                sliderRadiusVariants[safeRadius],
                safeVariant === 'soft'
                  ? sliderSoftIndicatorColorStyles[safeColor]
                  : sliderIndicatorColorStyles[safeColor],
                orientation === 'horizontal' && 'h-full',
                orientation === 'vertical' && 'w-full bottom-0',
                safeHighContrast && sliderIndicatorHighContrast,
              )}
            />
          </SliderPrimitive.Track>
          {(value ?? defaultValue).map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              data-slot="slider-thumb"
              className={cn(
                sliderThumbBase,
                sliderRadiusVariants[safeRadius],
                sliderThumbSizeVariants[size],
                sliderThumbColorStyles[safeColor],
              )}
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    )
  },
)

Slider.displayName = 'Slider'

export { Slider }
