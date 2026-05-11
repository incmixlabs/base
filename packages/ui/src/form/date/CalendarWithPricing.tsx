'use client'

import { forwardRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import {
  pricingDayCell,
  pricingDayCellRadiusStyles,
  pricingDayCellSizeStyles,
  pricingDayInteractive,
  pricingPriceLabel,
  pricingSelectedColorStyles,
} from './CalendarWithPricing.css'
import { DateCalendarPanel, type DayRenderState } from './DateCalendarPanel'
import type { WeekStartsOn } from './date.props'
import { type DateSize, isDateSize } from './date.props'
import { normalizeDay, toDayKey } from './date-calendar-core'

export interface DayPrice {
  /** The date */
  date: Date
  /** The price for this date */
  price: number
  /** Whether this is a highlighted/deal price */
  isHighlighted?: boolean
  /** Whether the date is available */
  available?: boolean
}

export interface CalendarWithPricingProps {
  /** Selected date */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void
  /** Price data for dates */
  prices: DayPrice[]
  /** Function to format price display */
  formatPrice?: (price: number) => string
  /** Currency symbol (default: "$") */
  currency?: string
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Minimum selectable date */
  minValue?: Date
  /** Maximum selectable date */
  maxValue?: Date
  /** Specific dates to disable */
  disabledDates?: Date[]
  /** Size variant */
  size?: DateSize
  /** Color variant */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Additional class names */
  className?: string
  /** First day of week override */
  weekStartsOn?: WeekStartsOn
  /** Show prices for days outside the current month */
  showOutsideDayPrices?: boolean
}

export const CalendarWithPricing = forwardRef<HTMLDivElement, CalendarWithPricingProps>(
  (
    {
      value,
      onChange,
      prices,
      formatPrice,
      currency = '$',
      isDisabled = false,
      minValue,
      maxValue,
      disabledDates,
      size: sizeProp = 'md',
      color = 'slate',
      radius = 'full',
      className,
      weekStartsOn: weekStartsOnProp,
      showOutsideDayPrices = false,
    },
    ref,
  ) => {
    const size: DateSize = isDateSize(sizeProp) ? sizeProp : 'md'

    /* ── Price lookup ── */
    const priceMap = useMemo(() => {
      const map = new Map<string, DayPrice>()
      for (const entry of prices) {
        map.set(toDayKey(normalizeDay(entry.date)), entry)
      }
      return map
    }, [prices])

    /* ── Merge unavailable-price dates into disabledDates ── */
    const mergedDisabledDates = useMemo(() => {
      const unavailablePriceDates = prices.filter(p => p.available === false).map(p => p.date)
      if (unavailablePriceDates.length === 0) return disabledDates
      return [...(disabledDates ?? []), ...unavailablePriceDates]
    }, [prices, disabledDates])

    const formatPriceDisplay = (price: number): string => {
      if (formatPrice) return formatPrice(price)
      return `${currency}${price}`
    }

    const handleRenderDay = (state: DayRenderState) => {
      const priceData = priceMap.get(state.dayKey)
      const showPrice = !state.outsideMonth || showOutsideDayPrices
      const highlighted = priceData?.isHighlighted ?? false
      const nonInteractive = state.outsideMonth || state.unavailable || isDisabled

      return (
        <button
          key={state.dayKey}
          type="button"
          aria-label={`${state.dayLabelFormatter.format(state.normalized)}${priceData && showPrice ? `, ${formatPriceDisplay(priceData.price)}` : ''}${state.selected ? ', selected' : ''}`}
          aria-disabled={nonInteractive ? 'true' : 'false'}
          aria-current={state.today ? 'date' : undefined}
          disabled={nonInteractive}
          data-unavailable={state.unavailable ? '' : undefined}
          data-outside-month={state.outsideMonth ? '' : undefined}
          data-selected={state.selected ? '' : undefined}
          data-today={state.today ? '' : undefined}
          data-highlighted={highlighted && showPrice ? '' : undefined}
          data-day-key={state.dayKey}
          tabIndex={state.isFocusTarget ? 0 : -1}
          className={cn(
            pricingDayCell,
            pricingDayCellSizeStyles[size],
            pricingDayCellRadiusStyles[radius],
            pricingDayInteractive,
            pricingSelectedColorStyles[color],
            'text-foreground',
            'data-[outside-month]:text-muted-foreground/60',
          )}
          onClick={() => {
            if (nonInteractive) return
            onChange?.(state.normalized)
          }}
        >
          <span>{state.dayNumberFormatter.format(state.normalized.getDate())}</span>
          {showPrice && priceData ? (
            <span className={pricingPriceLabel}>{formatPriceDisplay(priceData.price)}</span>
          ) : null}
        </button>
      )
    }

    return (
      <div ref={ref} className={cn('relative w-max', isDisabled && 'opacity-50 pointer-events-none')}>
        <DateCalendarPanel
          value={value}
          onChange={onChange}
          minValue={minValue}
          maxValue={maxValue}
          disabledDates={mergedDisabledDates}
          isDisabled={isDisabled}
          size={size}
          color={color}
          radius={radius}
          className={className}
          weekStartsOn={weekStartsOnProp}
          renderDay={handleRenderDay}
        />
      </div>
    )
  },
)

CalendarWithPricing.displayName = 'CalendarWithPricing'
