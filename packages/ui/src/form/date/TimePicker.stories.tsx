import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Label } from '@/form'
import { TimePicker, type TimeValue } from './TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: 'Form/Date/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>()
    return (
      <div className="w-[200px]">
        <TimePicker value={time} onChange={setTime} placeholder="Select time" />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 14, minutes: 30 })
    return (
      <div className="w-[200px]">
        <TimePicker value={time} onChange={setTime} />
      </div>
    )
  },
}

export const WithSeconds: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 9, minutes: 15, seconds: 45 })
    return (
      <div className="w-[200px]">
        <TimePicker value={time} onChange={setTime} showSeconds />
      </div>
    )
  },
}

export const TwelveHourFormat: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 14, minutes: 30 })
    return (
      <div className="w-[200px]">
        <TimePicker value={time} onChange={setTime} use12HourFormat placeholder="Select time (12h)" />
      </div>
    )
  },
}

export const TwelveHourWithSeconds: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 9, minutes: 15, seconds: 30 })
    return (
      <div className="w-[240px]">
        <TimePicker value={time} onChange={setTime} use12HourFormat showSeconds />
      </div>
    )
  },
}

export const WithMinuteStep: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>()
    return (
      <div className="w-[200px]">
        <TimePicker value={time} onChange={setTime} minuteStep={15} placeholder="15-minute intervals" />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-[200px]">
        <TimePicker value={{ hours: 10, minutes: 0 }} isDisabled />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 14, minutes: 30 })
    return (
      <div className="flex flex-col gap-4 w-[240px]">
        {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(s => (
          <div key={s}>
            <Label className="mb-1 block">Size {s}</Label>
            <TimePicker value={time} onChange={setTime} size={s} />
          </div>
        ))}
      </div>
    )
  },
}

export const Colors: Story = {
  render: () => {
    const [time, setTime] = React.useState<TimeValue | undefined>({ hours: 9, minutes: 0 })
    return (
      <div className="flex flex-col gap-4 w-[200px]">
        {(['slate', 'primary', 'success', 'warning', 'error', 'info'] as const).map(c => (
          <div key={c}>
            <Label className="mb-1 block capitalize">{c}</Label>
            <TimePicker value={time} onChange={setTime} color={c} />
          </div>
        ))}
      </div>
    )
  },
}
