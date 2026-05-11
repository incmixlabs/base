import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Text } from '@/typography'
import { dateColorValues, dateMiniCalendarSizeValues, dateNavButtonVariantValues, dateRadiusValues } from './date.props'
import { MiniCalendar } from './MiniCalendar'

const meta: Meta<typeof MiniCalendar> = {
  title: 'Form/Date/MiniCalendar',
  component: MiniCalendar,
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
    color: { control: 'select', options: dateColorValues },
    radius: { control: 'select', options: dateRadiusValues },
    size: { control: { type: 'radio' }, options: dateMiniCalendarSizeValues },
    navButtonVariant: { control: 'select', options: dateNavButtonVariantValues },
    weekStartsOn: { control: { type: 'select' }, options: [0, 1, 6] },
  },
}

export default meta
type Story = StoryObj<typeof MiniCalendar>

export const Default: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date>(new Date(2026, 0, 15))
    return (
      <div className="w-[420px] space-y-2">
        <MiniCalendar {...args} value={value} onChange={setValue} />
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
        <MiniCalendar {...args} value={value} onChange={setValue} minDate={minDate} maxDate={maxDate} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Bounds: {minDate.toLocaleDateString()} to {maxDate.toLocaleDateString()}
        </Text>
      </div>
    )
  },
}

export const Playground: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date>(args.value instanceof Date ? args.value : new Date(2026, 0, 15))
    React.useEffect(() => {
      if (args.value instanceof Date) {
        setValue(args.value)
      }
    }, [args.value])

    return <MiniCalendar {...args} value={value} onChange={setValue} />
  },
  args: {
    value: new Date(2026, 0, 15),
  },
}
