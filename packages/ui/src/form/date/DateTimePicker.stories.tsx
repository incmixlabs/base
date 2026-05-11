import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Label } from '@/form'
import { DateTimePicker } from './DateTimePicker'
import { dateColorValues, dateRadiusValues, dateSizeValues, dateVariantValues } from './date.props'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Form/Date/DateTimePicker',
  component: DateTimePicker,
  parameters: { layout: 'centered' },
  args: {
    ariaLabel: 'Departure',
    label: 'Departure',
    variant: 'outline',
    color: 'slate',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: dateVariantValues },
    color: { control: 'select', options: dateColorValues },
    size: { control: 'select', options: dateSizeValues },
    radius: { control: 'select', options: dateRadiusValues },
  },
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {
  render: args => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px]">
        <DateTimePicker {...args} value={dateTime} onChange={setDateTime} />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="w-[320px]">
        <DateTimePicker value={dateTime} onChange={setDateTime} />
      </div>
    )
  },
}

export const WithSeconds: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="w-[320px]">
        <DateTimePicker value={dateTime} onChange={setDateTime} showSeconds />
      </div>
    )
  },
}

export const WithMinMaxDates: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>()
    const today = new Date()
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 7)

    return (
      <div className="w-[320px]">
        <DateTimePicker value={dateTime} onChange={setDateTime} minValue={today} maxValue={maxDate} />
      </div>
    )
  },
}

export const WithMinuteStep: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px]">
        <DateTimePicker value={dateTime} onChange={setDateTime} minuteStep={15} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-[320px]">
        <DateTimePicker value={new Date()} onChange={() => {}} isDisabled />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="flex flex-col gap-4 w-[400px]">
        {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(s => (
          <div key={s}>
            <Label className="mb-1 block">Size {s}</Label>
            <DateTimePicker value={dateTime} onChange={setDateTime} size={s} />
          </div>
        ))}
      </div>
    )
  },
}

export const Colors: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="flex flex-col gap-4 w-[320px]">
        {(['slate', 'primary', 'success', 'warning', 'error'] as const).map(c => (
          <div key={c}>
            <Label className="mb-1 block capitalize">{c}</Label>
            <DateTimePicker value={dateTime} onChange={setDateTime} color={c} />
          </div>
        ))}
      </div>
    )
  },
}
