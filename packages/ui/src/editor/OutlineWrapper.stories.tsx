import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '@/elements'
import { DateTimePickerNext, MiniCalendarNext } from '@/form/date'
import { Grid } from '@/layouts'
import { EditorGrid } from './EditorGrid'
import { OutlineWrapper } from './OutlineWrapper'

const meta: Meta<typeof OutlineWrapper> = {
  title: 'Editor/OutlineWrapper',
  component: OutlineWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lineWidth: 1,
  },
}

export default meta
type Story = StoryObj<typeof OutlineWrapper>

export const Default: Story = {
  render: args => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date(2026, 2, 5, 10, 30))
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date(2026, 2, 5))

    return (
      <OutlineWrapper {...args} enabled className="min-h-screen w-full p-8">
        <Grid columns={{ initial: '1', md: '2' }} gap="6" className="mx-auto max-w-6xl">
          <div className="space-y-4 rounded-lg border bg-background p-4">
            <div className="flex gap-3">
              <Button>Primary action</Button>
              <Button variant="outline">Secondary</Button>
            </div>
            <DateTimePickerNext value={dateTime} onChange={setDateTime} />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <MiniCalendarNext value={selectedDate} onChange={setSelectedDate} />
          </div>
        </Grid>
      </OutlineWrapper>
    )
  },
}

export const GridAndOutline: Story = {
  globals: {
    outline: true,
  },
  render: () => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(new Date(2026, 2, 5, 10, 30))
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date(2026, 2, 5))

    return (
      <EditorGrid className="h-screen w-full p-8">
        <Grid columns={{ initial: '1', md: '2' }} gap="6" className="mx-auto max-w-6xl">
          <div className="space-y-4 rounded-lg border bg-background p-4">
            <div className="flex gap-3">
              <Button>Primary action</Button>
              <Button variant="outline">Secondary</Button>
            </div>
            <DateTimePickerNext value={dateTime} onChange={setDateTime} />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <MiniCalendarNext value={selectedDate} onChange={setSelectedDate} />
          </div>
        </Grid>
      </EditorGrid>
    )
  },
}
