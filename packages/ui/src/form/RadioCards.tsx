'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as React from 'react'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.css'
import { getSpacingClasses } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { type RadioCardSize, radioCardSizeVariants } from './radio-cards.css'
import { type RadioCardsGap, radioCardsGapValues, radioCardsRootPropDefs } from './radio-cards.props'
import { radioColorVariants, radioHighContrastByVariant } from './radio-group.css'

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
    const effectiveDisabled = safeDisabled || fieldGroup.readOnly
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
        value={{ size, variant: safeVariant, color: safeColor, highContrast: safeHighContrast, disabled: effectiveDisabled }}
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
          'group relative flex cursor-pointer rounded-lg border bg-card text-left transition-all',
          radioCardSizeVariants[context.size],
          'p-[var(--rc-padding)]',
          surfaceColorVariants[context.color][context.variant === 'surface' ? 'surface' : 'classic'],
          !isDisabled && surfaceHoverEnabledClass,
          context.highContrast && 'af-high-contrast',
          context.highContrast && surfaceHighContrastByVariant[context.variant === 'surface' ? 'surface' : 'classic'],
          // Selected styles
          'data-[checked]:ring-2',
          'data-[checked]:ring-ring/40',
          // Focus state
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Disabled state
          isDisabled && 'cursor-not-allowed opacity-50 hover:bg-card',
          className,
        )}
        {...props}
      >
        <div className="flex w-full items-start gap-[var(--rc-gap)]">
          {/* Radio indicator */}
          <span
            className={cn(
              'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full',
              'w-[var(--rc-indicator-size)] h-[var(--rc-indicator-size)]',
              'border-2',
              'transition-all duration-150',
              // Keep indicator styling stable for contrast; card `variant` is applied on the outer card surface.
              radioColorVariants[context.color].surface,
              context.highContrast && 'af-high-contrast',
              context.highContrast && radioHighContrastByVariant.surface,
            )}
          >
            <RadioPrimitive.Indicator className="rounded-full bg-white w-[var(--rc-indicator-inner)] h-[var(--rc-indicator-inner)]" />
          </span>
          {/* Content */}
          <div className="flex-1 text-[var(--rc-font-size)]">{children}</div>
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
