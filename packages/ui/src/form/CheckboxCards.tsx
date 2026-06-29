'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import { Check } from 'lucide-react'
import * as React from 'react'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.class'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { getSpacingClasses } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius, Size } from '@/theme/tokens'
import { checkboxColorVariants, checkboxHighContrastByVariant } from './checkbox.class'
import {
  type CheckboxCardSize,
  checkboxCardControlSizeVariants,
  checkboxCardSelectionColorVariants,
  checkboxCardSizeVariants,
} from './checkbox-cards.class'
import {
  checkboxCardsColumnValues,
  type checkboxCardsGapValues,
  checkboxCardsRootPropDefs,
} from './checkbox-cards.props'
import { useFieldGroup } from './FieldGroupContext'
import { resolveFormSize } from './form-size'
import { radioCheckboxCardGapClass, radioCheckboxCardPaddingClass } from './radio-checkbox.shared.class'

export type { CheckboxCardSize }

// Variant styles for cards
type CardVariant = 'surface' | 'outline'

// Context for sharing props across checkbox cards
interface CheckboxCardsContextValue {
  size: Size
  variant: CardVariant
  color: Color
  radius?: Radius
  highContrast: boolean
  showCheckbox: boolean
  disabled?: boolean
}

const CheckboxCardsContext = React.createContext<CheckboxCardsContextValue>({
  size: 'sm',
  variant: 'surface',
  color: SemanticColor.neutral,
  highContrast: false,
  showCheckbox: true,
})

// Column options for responsive grid
type Columns = number | string
type TokenColumns = (typeof checkboxCardsColumnValues)[number]

// Gap options
type Gap = (typeof checkboxCardsGapValues)[number]

function resolveCheckboxCardsColumns(columns: Columns) {
  if (typeof columns === 'number') return `repeat(${columns}, minmax(0, 1fr))`

  const normalizedColumns = columns.trim()
  const tokenColumns = checkboxCardsColumnValues.includes(normalizedColumns as TokenColumns)
    ? (normalizedColumns as TokenColumns)
    : undefined
  if (tokenColumns === 'auto') return 'repeat(auto-fit, minmax(200px, 1fr))'
  if (tokenColumns) return `repeat(${tokenColumns}, minmax(0, 1fr))`

  return normalizedColumns
}

export interface CheckboxCardsRootProps extends MarginProps {
  /** The size of all cards */
  size?: CheckboxCardSize
  /** The visual variant */
  variant?: CardVariant
  /** The accent color */
  color?: Color
  /** Card corner radius */
  radius?: Radius
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
  /** Whether to show the checkbox indicator inside each card */
  showCheckbox?: boolean
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
      radius: radiusProp,
      columns = 'auto',
      gap = '4',
      value,
      defaultValue,
      onValueChange,
      disabled,
      highContrast = false,
      showCheckbox = true,
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
    const safeGap = normalizeEnumPropValue(checkboxCardsRootPropDefs.gap, gap) ?? checkboxCardsRootPropDefs.gap.default
    const safeRadius = normalizeEnumPropValue(checkboxCardsRootPropDefs.radius, radiusProp) as Radius | undefined
    const safeHighContrast = normalizeBooleanPropValue(checkboxCardsRootPropDefs.highContrast, highContrast) ?? false
    const safeShowCheckbox =
      normalizeBooleanPropValue(checkboxCardsRootPropDefs.showCheckbox, showCheckbox) ??
      checkboxCardsRootPropDefs.showCheckbox.default
    const safeDisabled = typeof disabled === 'boolean' ? disabled : false
    const effectiveDisabled = safeDisabled || fieldGroup.disabled
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const gridStyle: React.CSSProperties = {
      ...marginProps.style,
      ...style,
      gridTemplateColumns: resolveCheckboxCardsColumns(columns),
    }

    return (
      <CheckboxCardsContext.Provider
        value={{
          size,
          variant: safeVariant,
          color: safeColor,
          radius: safeRadius,
          highContrast: safeHighContrast,
          showCheckbox: safeShowCheckbox,
          disabled: effectiveDisabled,
        }}
      >
        <CheckboxGroupPrimitive
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={effectiveDisabled}
          className={cn('grid', getSpacingClasses(safeGap, 'gap'), marginProps.className, className)}
          style={gridStyle}
          {...props}
        >
          {children}
        </CheckboxGroupPrimitive>
      </CheckboxCardsContext.Provider>
    )
  },
)

CheckboxCardsRoot.displayName = 'CheckboxCards.Root'

export interface CheckboxCardsItemProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
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
  ({ value, disabled, className, children, onClick, onKeyDown, style, ...props }, ref) => {
    const context = React.useContext(CheckboxCardsContext)
    const id = React.useId()
    const checkboxRef = React.useRef<HTMLButtonElement>(null)
    const resolvedSize = resolveFormSize(context.size)
    const radius = useThemeRadius(context.radius)
    const isDisabled = disabled || context.disabled
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLLabelElement>) => {
        onClick?.(event)
        if (event.defaultPrevented || isDisabled) return

        const target = event.target as HTMLElement | null
        if (target?.closest('[data-checkbox-card-control]')) return

        event.preventDefault()
        checkboxRef.current?.click()
      },
      [isDisabled, onClick],
    )
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLLabelElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || isDisabled) return
        if (event.key !== 'Enter' && event.key !== ' ') return

        const target = event.target as HTMLElement | null
        if (target?.closest('[data-checkbox-card-control]')) return

        event.preventDefault()
        checkboxRef.current?.click()
      },
      [isDisabled, onKeyDown],
    )

    return (
      <label
        ref={ref}
        {...props}
        htmlFor={id}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex cursor-pointer select-none rounded-[var(--element-border-radius)]',
          checkboxCardSizeVariants[resolvedSize],
          checkboxCardControlSizeVariants[resolvedSize],
          radioCheckboxCardPaddingClass,
          radioCheckboxCardGapClass,
          isDisabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        style={{ ...getRadiusStyles(radius), ...style }}
        data-disabled={isDisabled || undefined}
      >
        <CheckboxPrimitive.Root
          ref={checkboxRef}
          id={id}
          name={value}
          value={value}
          disabled={isDisabled}
          data-checkbox-card-control=""
          className={cn(
            'peer',
            context.showCheckbox
              ? [
                  'relative z-10 inline-flex shrink-0 items-center justify-center rounded',
                  'w-[var(--af-checkbox-card-box-size)] h-[var(--af-checkbox-card-box-size)]',
                  'transition-all duration-150',
                  // Keep checkbox token mapping stable for legibility; card `variant` styles the container span.
                  checkboxColorVariants[context.color].solid,
                  context.highContrast && 'af-high-contrast',
                  context.highContrast && checkboxHighContrastByVariant.solid,
                  'disabled:cursor-not-allowed disabled:opacity-50',
                ]
              : 'sr-only',
          )}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-inherit w-[var(--af-checkbox-card-icon-size)] h-[var(--af-checkbox-card-icon-size)]">
            <Check className="h-full w-full stroke-current" strokeWidth={3} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {/* Background span - uses peer modifier to respond to checkbox state */}
        <span
          className={cn(
            'absolute inset-0 rounded-[var(--element-border-radius)] border transition-all duration-150 -z-0',
            surfaceColorVariants[context.color][context.variant === 'surface' ? 'surface' : 'outline'],
            !isDisabled && surfaceHoverEnabledClass,
            context.highContrast && 'af-high-contrast',
            context.highContrast && surfaceHighContrastByVariant[context.variant === 'surface' ? 'surface' : 'outline'],
            checkboxCardSelectionColorVariants[context.color],
          )}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
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
