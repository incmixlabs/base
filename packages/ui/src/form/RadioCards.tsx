'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as React from 'react'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.class'
import { getSpacingClasses } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import {
  type RadioCardSize,
  radioCardContentBase,
  radioCardGapVariants,
  radioCardIndicatorBase,
  radioCardIndicatorColorVariants,
  radioCardIndicatorInner,
  radioCardIndicatorInnerSizeVariants,
  radioCardIndicatorSizeVariants,
  radioCardPaddingVariants,
  radioCardRootBase,
  radioCardRootColorVariants,
  radioCheckboxCardTextVariants,
} from './radio-cards.class'
import { type RadioCardsGap, radioCardsGapValues, radioCardsRootPropDefs } from './radio-cards.props'
import { radioHighContrastByVariant } from './radio-group.class'

export type { RadioCardSize }

// Variant styles
type RadioCardsVariant = 'surface' | 'classic'

// Context for sharing props
interface RadioCardsContextValue {
  size: RadioCardSize
  variant: RadioCardsVariant
  color: Color
  highContrast: boolean
  disabled?: boolean
}

const RadioCardsContext = React.createContext<RadioCardsContextValue>({
  size: 'sm',
  variant: 'surface',
  color: SemanticColor.neutral,
  highContrast: false,
})

// ============================================================================
// Root
// ============================================================================

export interface RadioCardsRootProps extends MarginProps {
  /** Size of the radio cards */
  size?: RadioCardSize
  /** Visual variant */
  variant?: RadioCardsVariant
  /** Color theme */
  color?: Color
  /** Current value */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Whether all cards are disabled */
  disabled?: boolean
  /** Whether to apply high-contrast styles */
  highContrast?: boolean
  /** Grid columns - can be a number or CSS grid template */
  columns?: number | string
  /** Gap between cards */
  gap?: RadioCardsGap
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Children */
  children: React.ReactNode
}

const gapSizes = Object.fromEntries(radioCardsGapValues.map(gap => [gap, getSpacingClasses(gap, 'gap')])) as Record<
  RadioCardsGap,
  string
>

const RadioCardsRoot = React.forwardRef<HTMLDivElement, RadioCardsRootProps>(
  (
    {
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.neutral,
      value,
      defaultValue,
      onValueChange,
      disabled,
      highContrast = false,
      columns = 'repeat(auto-fit, minmax(160px, 1fr))',
      gap = '4',
      className,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      children,
      ...props
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const safeVariant =
      normalizeEnumPropValue(radioCardsRootPropDefs.variant, variant) ?? radioCardsRootPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(radioCardsRootPropDefs.color, color) ?? SemanticColor.neutral
    const safeGap = normalizeEnumPropValue(radioCardsRootPropDefs.gap, gap) ?? radioCardsRootPropDefs.gap.default
    const safeHighContrast = normalizeBooleanPropValue(radioCardsRootPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = normalizeBooleanPropValue(radioCardsRootPropDefs.disabled, disabled) ?? false
    const tokenColumns =
      typeof columns === 'string' ? normalizeEnumPropValue(radioCardsRootPropDefs.columns, columns) : undefined
    const effectiveDisabled = safeDisabled || fieldGroup.disabled
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    const handleValueChange = React.useCallback(
      (newValue: unknown) => {
        if (onValueChange && typeof newValue === 'string') {
          onValueChange(newValue)
        }
      },
      [onValueChange],
    )

    const gridStyle: React.CSSProperties = {
      ...marginProps.style,
      gridTemplateColumns:
        typeof columns === 'number'
          ? `repeat(${columns}, 1fr)`
          : tokenColumns
            ? tokenColumns === 'none'
              ? 'none'
              : `repeat(${tokenColumns}, minmax(0, 1fr))`
            : typeof columns === 'string'
              ? columns.trim()
              : radioCardsRootPropDefs.columns.default,
      ...style,
    }

    return (
      <RadioCardsContext.Provider
        value={{
          size,
          variant: safeVariant,
          color: safeColor,
          highContrast: safeHighContrast,
          disabled: effectiveDisabled,
        }}
      >
        <RadioGroupPrimitive
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={effectiveDisabled}
          className={cn('grid', gapSizes[safeGap], marginProps.className, className)}
          style={gridStyle}
          {...props}
        >
          {children}
        </RadioGroupPrimitive>
      </RadioCardsContext.Provider>
    )
  },
)

RadioCardsRoot.displayName = 'RadioCards.Root'

// ============================================================================
// Item
// ============================================================================

export interface RadioCardsItemProps {
  /** Value of this radio card */
  value: string
  /** Whether this card is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Children content */
  children: React.ReactNode
}

const RadioCardsItem = React.forwardRef<HTMLButtonElement, RadioCardsItemProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(RadioCardsContext)
    const safeDisabled = normalizeBooleanPropValue(radioCardsRootPropDefs.disabled, disabled) ?? false
    const isDisabled = safeDisabled || context.disabled

    return (
      <RadioPrimitive.Root
        ref={ref}
        value={value}
        disabled={isDisabled}
        className={cn(
          radioCardRootBase,
          radioCardPaddingVariants[context.size],
          surfaceColorVariants[context.color][context.variant === 'surface' ? 'surface' : 'classic'],
          !isDisabled && surfaceHoverEnabledClass,
          context.highContrast && 'af-high-contrast',
          context.highContrast && surfaceHighContrastByVariant[context.variant === 'surface' ? 'surface' : 'classic'],
          radioCardRootColorVariants[context.color],
          // Disabled state
          isDisabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        <div className={cn('flex w-full items-start', radioCardGapVariants[context.size])}>
          {/* Radio indicator */}
          <span
            className={cn(
              radioCardIndicatorBase,
              radioCardIndicatorSizeVariants[context.size],
              radioCardIndicatorColorVariants[context.color],
              context.highContrast && 'af-high-contrast',
              context.highContrast && radioHighContrastByVariant.surface,
            )}
          >
            <RadioPrimitive.Indicator
              className={cn(radioCardIndicatorInner, radioCardIndicatorInnerSizeVariants[context.size])}
            />
          </span>
          {/* Content */}
          <div className={cn(radioCardContentBase, radioCheckboxCardTextVariants[context.size])}>{children}</div>
        </div>
      </RadioPrimitive.Root>
    )
  },
)

RadioCardsItem.displayName = 'RadioCards.Item'

// ============================================================================
// Export compound component
// ============================================================================

/** RadioCards export. */
export const RadioCards = {
  Root: RadioCardsRoot,
  Item: RadioCardsItem,
}
