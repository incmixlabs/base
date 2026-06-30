import '@ncdai/react-wheel-picker/style.css'

import * as WheelPickerPrimitive from '@ncdai/react-wheel-picker'

import { cn } from '@/lib/utils'
import {
  wheelPickerHighlightItem,
  wheelPickerHighlightWrapper,
  wheelPickerOptionItem,
  wheelPickerWrapper,
} from './wheel-picker.class'

type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue

type WheelPickerOption<T extends WheelPickerValue = string> = WheelPickerPrimitive.WheelPickerOption<T>

type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames

/**
 * Wraps WheelPickerPrimitive.WheelPickerWrapper and applies a composed className for consistent styling.
 *
 * Merges a set of base styles (including responsive and dark-mode variants) with any `className` provided and renders the underlying WheelPickerWrapper with all received props.
 *
 * @param className - Optional additional class names to merge with the component's base styles.
 * @returns A React element rendering WheelPickerPrimitive.WheelPickerWrapper with merged class names and forwarded props.
 */
function WheelPickerWrapper({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper> & { style?: React.CSSProperties }) {
  return <WheelPickerPrimitive.WheelPickerWrapper className={cn(wheelPickerWrapper, className)} {...props} />
}

/**
 * Render a themed WheelPicker that merges built-in styling with any user-provided classNames.
 *
 * @param classNames - Optional partial classNames to customize `optionItem`, `highlightWrapper`, and `highlightItem` styles; provided values are merged with the component's defaults.
 * @returns The WheelPicker element with merged, theme-aware classNames applied
 */
function WheelPicker<T extends WheelPickerValue = string>({
  classNames,
  ...props
}: WheelPickerPrimitive.WheelPickerProps<T>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn(wheelPickerOptionItem, classNames?.optionItem),
        highlightWrapper: cn(wheelPickerHighlightWrapper, classNames?.highlightWrapper),
        highlightItem: cn(wheelPickerHighlightItem, classNames?.highlightItem),
      }}
      {...props}
    />
  )
}

export type { WheelPickerClassNames, WheelPickerOption, WheelPickerValue }
export { WheelPicker, WheelPickerWrapper }
