import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { WheelPickerOption } from './wheel-picker'
import { WheelPicker, WheelPickerWrapper } from './wheel-picker'

function paddedRange(length: number, start = 1, step = 1): WheelPickerOption<number>[] {
  return Array.from({ length }, (_, index) => {
    const value = start + index * step
    return { value, label: String(value).padStart(2, '0') }
  })
}

const numberOptions = paddedRange(12)

const monthOptions = paddedRange(12)

const dayOptions = paddedRange(31)

const yearOptions: WheelPickerOption<number>[] = Array.from({ length: 9 }, (_, index) => {
  const value = 2022 + index
  return { value, label: String(value) }
})

const hourOptions = paddedRange(12)

const minuteOptions = paddedRange(12, 0, 5)

const periodOptions: WheelPickerOption<string>[] = [
  { value: 'am', label: 'AM' },
  { value: 'pm', label: 'PM' },
]

const meta = {
  title: 'Elements/WheelPicker',
  component: WheelPicker,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WheelPicker>

export default meta
type Story = StoryObj<typeof meta>

function WheelPickerStoryFrame({ children }: { children: ReactNode }) {
  return <div className="w-56">{children}</div>
}

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(6)

    return (
      <WheelPickerStoryFrame>
        <WheelPickerWrapper>
          <WheelPicker<number> options={numberOptions} value={value} onValueChange={setValue} />
        </WheelPickerWrapper>
      </WheelPickerStoryFrame>
    )
  },
}

export const DateColumns: Story = {
  render: () => {
    const [month, setMonth] = useState(6)
    const [day, setDay] = useState(30)
    const [year, setYear] = useState(2026)

    return (
      <WheelPickerStoryFrame>
        <WheelPickerWrapper>
          <WheelPicker<number> options={monthOptions} value={month} onValueChange={setMonth} />
          <WheelPicker<number> options={dayOptions} value={day} onValueChange={setDay} />
          <WheelPicker<number> options={yearOptions} value={year} onValueChange={setYear} />
        </WheelPickerWrapper>
      </WheelPickerStoryFrame>
    )
  },
}

export const TimeColumns: Story = {
  render: () => {
    const [hour, setHour] = useState(9)
    const [minute, setMinute] = useState(30)
    const [period, setPeriod] = useState('am')

    return (
      <WheelPickerStoryFrame>
        <WheelPickerWrapper>
          <WheelPicker<number> options={hourOptions} value={hour} onValueChange={setHour} />
          <WheelPicker<number> options={minuteOptions} value={minute} onValueChange={setMinute} />
          <WheelPicker options={periodOptions} value={period} onValueChange={setPeriod} />
        </WheelPickerWrapper>
      </WheelPickerStoryFrame>
    )
  },
}
