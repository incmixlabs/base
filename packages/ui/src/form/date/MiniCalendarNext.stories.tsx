import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Text } from '@/typography'
import {
  dateNextColorValues,
  dateNextMiniCalendarSizeValues,
  dateNextNavButtonVariantValues,
  dateNextRadiusValues,
} from './date-next.props'
import { MiniCalendarNext } from './MiniCalendarNext'

const meta: Meta<typeof MiniCalendarNext> = {
  title: 'Form/Date Next/MiniCalendarNext (Spike)',
  component: MiniCalendarNext,
  parameters: {
    layout: 'centered',
  },
  args: {
    color: 'slate',
    radius: 'md',
    size: 'md',
    navButtonBordered: false,
    navButtonVariant: 'soft',
    disabled: false,
  },
  argTypes: {
    color: { control: 'select', options: dateNextColorValues },
    radius: { control: 'select', options: dateNextRadiusValues },
    size: { control: { type: 'radio' }, options: dateNextMiniCalendarSizeValues },
    navButtonVariant: { control: 'select', options: dateNextNavButtonVariantValues },
    weekStartsOn: { control: { type: 'select' }, options: [0, 1, 6] },
  },
}

export default meta
type Story = StoryObj<typeof MiniCalendarNext>

export const Default: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date>(new Date(2026, 0, 15))
    return (
      <div className="w-[420px] space-y-2">
        <MiniCalendarNext {...args} value={value} onChange={setValue} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Selected: {value.toLocaleDateString()}
        </Text>
      </div>
    )
  },
}

export const Bounds: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date>(new Date(2026, 0, 15))
    const minDate = new Date(2026, 0, 12)
    const maxDate = new Date(2026, 0, 18)

    return (
      <div className="w-[420px] space-y-2">
        <MiniCalendarNext {...args} value={value} onChange={setValue} minDate={minDate} maxDate={maxDate} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Bounds: {minDate.toLocaleDateString()} to {maxDate.toLocaleDateString()}
        </Text>
      </div>
    )
  },
}

export const Playground: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date>((args.value as Date) ?? new Date(2026, 0, 15))
    return <MiniCalendarNext {...args} value={value} onChange={setValue} />
  },
  args: {
    value: new Date(2026, 0, 15),
  },
}
