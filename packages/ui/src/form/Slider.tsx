'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import * as React from 'react'
import { sliderPropDefs } from '@/elements/slider/slider.props'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color, Radius } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { formColorVars } from './form-color'
import { type FormSize, resolveFormSize } from './form-size'
import {
  sliderIndicatorHighContrast,
  sliderSizeVariants,
  sliderTrackHighContrast,
  sliderTrackVariantStyles,
} from './Slider.css'

export type SliderSize = FormSize

// Static color classes — reference --fc-primary set via formColorVars
const fillColorCls = 'bg-[var(--fc-primary)]'
const softFillColorCls = 'bg-[var(--fc-soft-bg-hover)]'
const borderColorCls = 'border-[var(--fc-primary)]'

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
  color?: Color
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
        style={{ ...marginProps.style, ...formColorVars[color], ...style }}
        className={cn(
          'relative flex touch-none select-none items-center',
          sliderSizeVariants[size],
          orientation === 'horizontal' && 'w-full',
          orientation === 'vertical' && 'h-full flex-col',
          effectiveDisabled && 'opacity-50 cursor-not-allowed',
          marginProps.className,
          className,
        )}
      >
        <SliderPrimitive.Control
          className={cn(
            'relative grow',
            orientation === 'horizontal' && 'w-full',
            orientation === 'vertical' && 'h-full',
          )}
        >
          <SliderPrimitive.Track
            className={cn(
              'relative overflow-hidden',
              radiusStyleVariants[radius],
              'h-[var(--slider-track-height)]',
              orientation === 'horizontal' && 'w-full',
              orientation === 'vertical' && 'h-full',
              sliderTrackVariantStyles[safeVariant],
              safeHighContrast && 'af-high-contrast',
              safeHighContrast && sliderTrackHighContrast,
            )}
          >
            <SliderPrimitive.Indicator
              className={cn(
                'absolute',
                radiusStyleVariants[radius],
                safeVariant === 'soft' ? softFillColorCls : fillColorCls,
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
              className={cn(
                'block border-2 bg-background shadow-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                radiusStyleVariants[radius],
                'h-[var(--slider-thumb-size)] w-[var(--slider-thumb-size)]',
                borderColorCls,
                safeHighContrast && 'af-high-contrast',
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
