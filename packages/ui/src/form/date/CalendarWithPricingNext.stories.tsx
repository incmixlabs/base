'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { eachDayOfInterval, endOfMonth, getDay, startOfMonth } from 'date-fns'
import * as React from 'react'
import { CalendarWithPricingNext, type DayPriceNext } from './CalendarWithPricingNext'
import { dateNextColorValues, dateNextRadiusValues, dateNextSizeValues } from './date-next.props'

const meta: Meta<typeof CalendarWithPricingNext> = {
  title: 'Form/Date Next/CalendarWithPricingNext (Spike)',
  component: CalendarWithPricingNext,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'select', options: dateNextSizeValues },
    color: { control: 'select', options: dateNextColorValues },
    radius: { control: 'select', options: dateNextRadiusValues },
    isDisabled: { control: 'boolean' },
    currency: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof CalendarWithPricingNext>

/* ── Fixed reference date for deterministic visual output ── */
const STORY_REFERENCE_DATE = new Date(2026, 0, 15)

/* ── Deterministic pseudo-random for visual test stability ── */
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/** Build a month of price data by mapping each day through a pricing rule. */
const buildMonthPrices = (
  referenceDate: Date,
  toPrice: (date: Date, index: number) => DayPriceNext,
): DayPriceNext[] => {
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)
  return eachDayOfInterval({ start: monthStart, end: monthEnd }).map(toPrice)
}

const generatePrices = (basePrice = 100, seed = 42, referenceDate = STORY_REFERENCE_DATE): DayPriceNext[] =>
  buildMonthPrices(referenceDate, (date, index) => {
    const dayOfWeek = getDay(date)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekendMultiplier = isWeekend ? 1.3 : 1
    const variation = Math.floor(seededRandom(seed + index) * 40) - 20
    const price = Math.round((basePrice + variation) * weekendMultiplier)

    return { date, price, isHighlighted: price < basePrice - 10, available: true }
  })

export const Default: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()
    const prices = React.useMemo(() => generatePrices(150), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} />
        {date && (
          <p className="text-sm text-muted-foreground mt-4 text-center">Selected: {date.toLocaleDateString()}</p>
        )}
      </div>
    )
  },
}

export const FlightPricing: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()

    const prices = React.useMemo(
      () =>
        buildMonthPrices(STORY_REFERENCE_DATE, (d, index) => {
          const dayOfWeek = getDay(d)
          let basePrice = 250
          if (dayOfWeek === 2 || dayOfWeek === 3) basePrice = 180
          else if (dayOfWeek === 5 || dayOfWeek === 0) basePrice = 350

          const variation = Math.floor(seededRandom(43 + index) * 50)
          const price = basePrice + variation

          return { date: d, price, isHighlighted: price < 220, available: true }
        }),
      [],
    )

    return (
      <div className="w-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Select departure date</h3>
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} />
        <p className="text-xs text-muted-foreground mt-2 text-center">Green prices indicate best deals</p>
      </div>
    )
  },
}

export const HotelPricing: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()

    const prices = React.useMemo(
      () =>
        buildMonthPrices(STORY_REFERENCE_DATE, (d, index) => {
          const dayOfWeek = getDay(d)
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
          const basePrice = isWeekend ? 189 : 129
          const variation = Math.floor(seededRandom(44 + index) * 30)
          return { date: d, price: basePrice + variation, isHighlighted: basePrice + variation < 140, available: true }
        }),
      [],
    )

    return (
      <div className="w-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Select check-in date</h3>
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} currency="$" />
        <p className="text-xs text-muted-foreground mt-2 text-center">Per night rates shown</p>
      </div>
    )
  },
}

export const WithUnavailableDates: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()

    const prices = React.useMemo(
      () =>
        buildMonthPrices(STORY_REFERENCE_DATE, (d, index) => ({
          date: d,
          price: 100 + Math.floor(seededRandom(45 + index) * 80),
          isHighlighted: seededRandom(145 + index) > 0.8,
          available: index % 5 !== 0,
        })),
      [],
    )

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} />
        <p className="text-xs text-muted-foreground mt-2 text-center">Some dates are sold out</p>
      </div>
    )
  },
}

export const EuroCurrency: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()
    const prices = React.useMemo(() => generatePrices(80), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} currency="€" />
      </div>
    )
  },
}

export const CustomPriceFormat: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()
    const prices = React.useMemo(() => generatePrices(1500), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext
          {...args}
          value={date}
          onChange={setDate}
          prices={prices}
          formatPrice={price => `$${(price / 100).toFixed(2)}`}
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">Prices in dollars (formatted from cents)</p>
      </div>
    )
  },
}

export const WithMinMaxDate: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()
    const prices = React.useMemo(() => generatePrices(200), [])

    const minDate = new Date(STORY_REFERENCE_DATE)
    minDate.setDate(STORY_REFERENCE_DATE.getDate() + 1)
    const maxDate = new Date(STORY_REFERENCE_DATE)
    maxDate.setDate(STORY_REFERENCE_DATE.getDate() + 14)

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext
          {...args}
          value={date}
          onChange={setDate}
          prices={prices}
          minValue={minDate}
          maxValue={maxDate}
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">Only next 14 days are selectable</p>
      </div>
    )
  },
}

export const WeekStartsMonday: Story = {
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>()
    const prices = React.useMemo(() => generatePrices(120), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} weekStartsOn={1} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: args => {
    const prices = React.useMemo(() => generatePrices(100), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={STORY_REFERENCE_DATE} prices={prices} isDisabled />
      </div>
    )
  },
}

export const WithPreselectedDate: Story = {
  render: args => {
    const preselected = new Date(STORY_REFERENCE_DATE)
    preselected.setDate(STORY_REFERENCE_DATE.getDate() + 5)

    const [date, setDate] = React.useState<Date | undefined>(preselected)
    const prices = React.useMemo(() => generatePrices(150), [])

    return (
      <div className="w-[400px]">
        <CalendarWithPricingNext {...args} value={date} onChange={setDate} prices={prices} />
        {date && (
          <p className="text-sm text-muted-foreground mt-4 text-center">Selected: {date.toLocaleDateString()}</p>
        )}
      </div>
    )
  },
}
