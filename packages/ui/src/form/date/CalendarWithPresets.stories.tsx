'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { CalendarWithPresets, type DateRangePreset } from './CalendarWithPresets'
import { dateColorValues, dateRadiusValues, dateSizeValues } from './date.props'

const STORY_REFERENCE_DATE = new Date(2026, 0, 15)

const meta: Meta<typeof CalendarWithPresets> = {
  title: 'Form/Date/CalendarWithPresets',
  component: CalendarWithPresets,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'select', options: dateSizeValues },
    color: { control: 'select', options: dateColorValues },
    radius: { control: 'select', options: dateRadiusValues },
    isDisabled: { control: 'boolean' },
    visibleMonths: { control: 'select', options: [1, 2] },
    layout: { control: 'select', options: ['vertical', 'horizontal'] },
    showCalendar: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof CalendarWithPresets>

type DateRange = { from?: Date; to?: Date }

export const Default: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} />
        {range?.from && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Selected: {range.from.toLocaleDateString()}
            {range.to && ` - ${range.to.toLocaleDateString()}`}
          </p>
        )}
      </div>
    )
  },
}

export const HorizontalLayout: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    return (
      <div className="w-[600px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} layout="horizontal" />
      </div>
    )
  },
}

export const TwoMonths: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    return (
      <div className="w-[600px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} visibleMonths={2} />
      </div>
    )
  },
}

export const PresetsOnly: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} showCalendar={false} />
        {range?.from && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Selected: {range.from.toLocaleDateString()}
            {range.to && ` - ${range.to.toLocaleDateString()}`}
          </p>
        )}
      </div>
    )
  },
}

export const CustomPresets: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()

    const customPresets: DateRangePreset[] = [
      {
        label: 'This week',
        getValue: () => {
          const ref = new Date(STORY_REFERENCE_DATE)
          const start = new Date(ref)
          start.setDate(ref.getDate() - ref.getDay())
          const end = new Date(start)
          end.setDate(start.getDate() + 6)
          return { from: start, to: end }
        },
      },
      {
        label: 'This month',
        getValue: () => {
          const ref = new Date(STORY_REFERENCE_DATE)
          const start = new Date(ref.getFullYear(), ref.getMonth(), 1)
          const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0)
          return { from: start, to: end }
        },
      },
      {
        label: 'Q1',
        getValue: () => ({
          from: new Date(2026, 0, 1),
          to: new Date(2026, 2, 31),
        }),
      },
      {
        label: 'Q2',
        getValue: () => ({
          from: new Date(2026, 3, 1),
          to: new Date(2026, 5, 30),
        }),
      },
    ]

    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} presets={customPresets} />
      </div>
    )
  },
}

export const WithMinMaxDate: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    const minDate = new Date(STORY_REFERENCE_DATE)
    minDate.setDate(STORY_REFERENCE_DATE.getDate() - 30)
    const maxDate = new Date(STORY_REFERENCE_DATE)
    maxDate.setDate(STORY_REFERENCE_DATE.getDate() + 30)

    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} minValue={minDate} maxValue={maxDate} />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Only dates within 30 days of the reference date are selectable
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: args => {
    const endDate = new Date(STORY_REFERENCE_DATE)
    endDate.setDate(STORY_REFERENCE_DATE.getDate() + 7)

    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={{ from: STORY_REFERENCE_DATE, to: endDate }} isDisabled />
      </div>
    )
  },
}

export const WeekStartsMonday: Story = {
  render: args => {
    const [range, setRange] = React.useState<DateRange | undefined>()
    return (
      <div className="w-[360px]">
        <CalendarWithPresets {...args} value={range} onChange={setRange} weekStartsOn={1} />
      </div>
    )
  },
}
