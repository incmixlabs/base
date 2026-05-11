import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Label } from '@/form'
import { DateTimePickerNext } from './DateTimePickerNext'
import { dateNextColorValues, dateNextRadiusValues, dateNextSizeValues, dateNextVariantValues } from './date-next.props'

const meta: Meta<typeof DateTimePickerNext> = {
  title: 'Form/Date Next/DateTimePickerNext (Spike)',
  component: DateTimePickerNext,
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
    variant: { control: 'select', options: dateNextVariantValues },
    color: { control: 'select', options: dateNextColorValues },
    size: { control: 'select', options: dateNextSizeValues },
    radius: { control: 'select', options: dateNextRadiusValues },
  },
}

export default meta
type Story = StoryObj<typeof DateTimePickerNext>

export const Default: Story = {
  render: args => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px]">
        <DateTimePickerNext {...args} value={dateTime} onChange={setDateTime} />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="w-[320px]">
        <DateTimePickerNext value={dateTime} onChange={setDateTime} />
      </div>
    )
  },
}

export const WithSeconds: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date())
    return (
      <div className="w-[320px]">
        <DateTimePickerNext value={dateTime} onChange={setDateTime} showSeconds />
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
        <DateTimePickerNext value={dateTime} onChange={setDateTime} minValue={today} maxValue={maxDate} />
      </div>
    )
  },
}

export const WithMinuteStep: Story = {
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px]">
        <DateTimePickerNext value={dateTime} onChange={setDateTime} minuteStep={15} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-[320px]">
        <DateTimePickerNext value={new Date()} isDisabled />
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
            <DateTimePickerNext value={dateTime} onChange={setDateTime} size={s} />
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
            <DateTimePickerNext value={dateTime} onChange={setDateTime} color={c} />
          </div>
        ))}
      </div>
    )
  },
}
