import type { Meta, StoryObj } from '@storybook/react-vite'
import { cn } from '@/lib/utils'
import { Timeline, type TimelineRootProps } from './Timeline'
import { TimelineWrapper, type TimelineWrapperProps } from './TimelineWrapper'

// ─── Compound component stories ──────────────────────────────────────────────

function CompoundDemo(args: TimelineRootProps) {
  return (
    <Timeline.Root {...args} className={cn('w-full max-w-lg', args.className)}>
      <Timeline.Item step={1}>
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Order placed</Timeline.Title>
          <Timeline.Date>Jan 12, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Your order has been confirmed and is being processed.</Timeline.Content>
      </Timeline.Item>

      <Timeline.Item step={2}>
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Payment confirmed</Timeline.Title>
          <Timeline.Date>Jan 12, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Payment of $49.99 was successfully processed.</Timeline.Content>
      </Timeline.Item>

      <Timeline.Item step={3}>
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Shipped</Timeline.Title>
          <Timeline.Date>Jan 14, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Package has been handed to the carrier.</Timeline.Content>
      </Timeline.Item>

      <Timeline.Item step={4}>
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Delivered</Timeline.Title>
          <Timeline.Date>Jan 16, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Package delivered to your doorstep.</Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  )
}

const meta: Meta<typeof Timeline.Root> = {
  title: 'Elements/Timeline',
  component: Timeline.Root,
  args: {
    orientation: 'vertical',
    size: 'md',
    value: 2,
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Timeline.Root>

export const Default: Story = {
  render: args => <CompoundDemo {...args} />,
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: args => <CompoundDemo {...args} className="max-w-3xl" />,
}

export const NoActiveStep: Story = {
  args: {
    value: undefined,
    defaultValue: undefined,
  },
  render: args => <CompoundDemo {...args} />,
}

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-8">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <div className="mb-2 text-xs font-medium text-muted-foreground">size=&quot;{size}&quot;</div>
          <CompoundDemo size={size} value={2} />
        </div>
      ))}
    </div>
  ),
}

// ─── Wrapper stories ─────────────────────────────────────────────────────────

const wrapperData = [
  { step: 1, title: 'Account created', date: 'Mar 1, 2026', content: 'Welcome to the platform!' },
  { step: 2, title: 'Profile completed', date: 'Mar 3, 2026', content: 'All required fields filled.' },
  { step: 3, title: 'First project', date: 'Mar 5, 2026', content: 'Created "My First Project".' },
  { step: 4, title: 'Team invited', date: 'Mar 8, 2026', content: 'Invited 3 team members.' },
]

function WrapperDemo(args: TimelineWrapperProps) {
  return <TimelineWrapper {...args} className={cn('w-full max-w-lg', args.className)} />
}

export const Wrapper: Story = {
  render: () => <WrapperDemo data={wrapperData} value={2} />,
}

export const WrapperHorizontal: Story = {
  render: () => <WrapperDemo data={wrapperData} value={2} orientation="horizontal" className="max-w-3xl" />,
}
