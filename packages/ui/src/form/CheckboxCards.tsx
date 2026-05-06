'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import { Check } from 'lucide-react'
import * as React from 'react'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.css'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Size } from '@/theme/tokens'
import { checkboxColorVariants, checkboxHighContrastByVariant } from './checkbox.css'
import { type CheckboxCardSize, checkboxCardSizeVariants } from './checkbox-cards.css'
import { checkboxCardsRootPropDefs } from './checkbox-cards.props'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'

export type { CheckboxCardSize }

// Variant styles for cards
type CardVariant = 'surface' | 'outline'

// Context for sharing props across checkbox cards
interface CheckboxCardsContextValue {
  size: Size
  variant: CardVariant
  color: Color
  highContrast: boolean
  disabled?: boolean
}

const CheckboxCardsContext = React.createContext<CheckboxCardsContextValue>({
  size: 'sm',
  variant: 'surface',
  color: SemanticColor.neutral,
  highContrast: false,
})

// Column options for responsive grid
type Columns = '1' | '2' | '3' | '4' | 'auto'

const columnStyles: Record<Columns, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
}

// Gap options
type Gap = '1' | '2' | '3' | '4' | '5' | '6'

const gapStyles: Record<Gap, string> = {
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
}

export interface CheckboxCardsRootProps extends MarginProps {
  /** The size of all cards */
  size?: CheckboxCardSize
  /** The visual variant */
  variant?: CardVariant
  /** The accent color */
  color?: Color
  /** Number of columns (responsive) */
  columns?: Columns
  /** Gap between cards */
  gap?: Gap
  /** The controlled value */
  value?: string[]
  /** The default value */
  defaultValue?: string[]
  /** Callback when values change */
  onValueChange?: (value: string[]) => void
  /** Whether all cards are disabled */
  disabled?: boolean
  /** Whether to apply high-contrast styles */
  highContrast?: boolean
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Children elements */
  children: React.ReactNode
}

const CheckboxCardsRoot = React.forwardRef<HTMLDivElement, CheckboxCardsRootProps>(
  (
    {
      size: sizeProp,
      variant = 'surface',
      color = SemanticColor.neutral,
      columns = 'auto',
      gap = '4',
      value,
      defaultValue,
      onValueChange,
      disabled,
      highContrast = false,
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
    const size = sizeProp ?? fieldGroup.size
    const safeVariant =
      normalizeEnumPropValue(checkboxCardsRootPropDefs.variant, variant) ?? checkboxCardsRootPropDefs.variant.default
    const safeColor = normalizeEnumPropValue(checkboxCardsRootPropDefs.color, color) ?? SemanticColor.neutral
    const safeColumns =
      normalizeEnumPropValue(checkboxCardsRootPropDefs.columns, columns) ?? checkboxCardsRootPropDefs.columns.default
    const safeGap = normalizeEnumPropValue(checkboxCardsRootPropDefs.gap, gap) ?? checkboxCardsRootPropDefs.gap.default
    const safeHighContrast = normalizeBooleanPropValue(checkboxCardsRootPropDefs.highContrast, highContrast) ?? false
    const safeDisabled = typeof disabled === 'boolean' ? disabled : false
    const effectiveDisabled = safeDisabled || fieldGroup.disabled
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })

    return (
      <CheckboxCardsContext.Provider
        value={{
          size,
          variant: safeVariant,
          color: safeColor,
          highContrast: safeHighContrast,
          disabled: effectiveDisabled,
        }}
      >
        <CheckboxGroupPrimitive
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={effectiveDisabled}
          className={cn('grid', columnStyles[safeColumns], gapStyles[safeGap], marginProps.className, className)}
          style={{ ...marginProps.style, ...style }}
          {...props}
        >
          {children}
        </CheckboxGroupPrimitive>
      </CheckboxCardsContext.Provider>
    )
  },
)

CheckboxCardsRoot.displayName = 'CheckboxCards.Root'

export interface CheckboxCardsItemProps {
  /** Unique value for this card */
  value: string
  /** Whether this card is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Card content */
  children: React.ReactNode
}

const CheckboxCardsItem = React.forwardRef<HTMLLabelElement, CheckboxCardsItemProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    const context = React.useContext(CheckboxCardsContext)
    const id = React.useId()
    const resolvedSize = resolveFormSize(context.size)
    const isDisabled = disabled || context.disabled

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn(
          'group relative flex cursor-pointer select-none rounded-xl',
          checkboxCardSizeVariants[resolvedSize],
          'p-[var(--cbc-padding)] gap-[var(--cbc-gap)]',
          isDisabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        data-disabled={isDisabled || undefined}
        {...props}
      >
        <CheckboxPrimitive.Root
          id={id}
          name={value}
          value={value}
          disabled={isDisabled}
          className={cn(
            'peer relative z-10 inline-flex shrink-0 items-center justify-center rounded',
            'w-[var(--cbc-cb-size)] h-[var(--cbc-cb-size)]',
            'transition-all duration-150',
            // Keep checkbox token mapping stable for legibility; card `variant` styles the container span.
            checkboxColorVariants[context.color].solid,
            context.highContrast && 'af-high-contrast',
            context.highContrast && checkboxHighContrastByVariant.solid,
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-inherit w-[var(--cbc-icon-size)] h-[var(--cbc-icon-size)]">
            <Check className="h-full w-full stroke-current" strokeWidth={3} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {/* Background span - uses peer modifier to respond to checkbox state */}
        <span
          className={cn(
            'absolute inset-0 rounded-xl border transition-all duration-150 -z-0',
            surfaceColorVariants[context.color][context.variant === 'surface' ? 'surface' : 'outline'],
            !isDisabled && surfaceHoverEnabledClass,
            context.highContrast && 'af-high-contrast',
            context.highContrast && surfaceHighContrastByVariant[context.variant === 'surface' ? 'surface' : 'outline'],
            'peer-data-[checked]:ring-2 peer-data-[checked]:ring-ring/40',
          )}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-1 flex-col text-[var(--cbc-font-size)]">{children}</div>
      </label>
    )
  },
)

CheckboxCardsItem.displayName = 'CheckboxCards.Item'

// Export compound component
/** CheckboxCards export. */
export const CheckboxCards = {
  Root: CheckboxCardsRoot,
  Item: CheckboxCardsItem,
}

export type { CheckboxCardsRootProps as CheckboxCardsProps }
