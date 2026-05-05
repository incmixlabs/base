import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { Card } from './Card'
import { CardWrapper } from './CardWrapper'
import type { CardWrapperData, CardWrapperProps } from './card-wrapper.types'

const accountCard: CardWrapperData = {
  title: 'Team Plan',
  description: 'Usage and billing summary',
  content: (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">Projects: 18 / 25</div>
      <div className="text-sm text-muted-foreground">Seats: 12 / 15</div>
      <div className="text-sm text-muted-foreground">Storage: 132 GB / 250 GB</div>
    </div>
  ),
  footer: (
    <Badge variant="surface" color="info">
      Renews in 9 days
    </Badge>
  ),
  actions: [
    { id: 'upgrade', label: 'Upgrade', variant: 'solid', color: 'primary' },
    { id: 'billing', label: 'Billing', variant: 'outline' },
  ],
}

const meta = {
  title: 'Elements/CardWrapper',
  component: CardWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Typed data-driven wrapper over Card primitives. Use CardWrapper for backend/CMS/config payloads, and Card primitives for fully custom layouts.',
      },
    },
  },
  args: {
    data: accountCard,
    variant: 'surface',
    color: 'neutral',
    size: 'sm',
  },
} satisfies Meta<CardWrapperProps>

export default meta
type Story = StoryObj<CardWrapperProps>

export const Basic: Story = {
  render: args => <CardWrapper {...args} className="w-[420px]" />,
}

export const RenderOverrides: Story = {
  render: args => (
    <CardWrapper
      {...args}
      className="w-[420px]"
      renderAction={(action, defaultRender) => {
        if (action.id !== 'upgrade') return defaultRender
        return (
          <Button size="xs" variant="solid" color="success">
            Switch to Annual
          </Button>
        )
      }}
      renderSlot={(slot, defaultRender) => {
        if (slot !== 'header') return defaultRender
        return <div className="rounded-md border border-border/60 bg-background/60 p-3">{defaultRender}</div>
      }}
    />
  ),
}

export const WrapperVsPrimitive: Story = {
  render: args => (
    <div className="grid w-[880px] grid-cols-2 gap-4">
      <CardWrapper {...args} className="w-full" />
      <Card.Root size="sm" variant="surface" color="neutral" className="w-full">
        <Card.Header>
          <Card.Title>Team Plan</Card.Title>
          <Card.Description>Usage and billing summary</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Projects: 18 / 25</div>
            <div className="text-sm text-muted-foreground">Seats: 12 / 15</div>
            <div className="text-sm text-muted-foreground">Storage: 132 GB / 250 GB</div>
          </div>
        </Card.Content>
        <Card.Footer className="justify-between gap-2">
          <Badge variant="surface" color="info">
            Renews in 9 days
          </Badge>
          <div className="flex items-center gap-2">
            <Button size="xs" variant="solid" color="primary">
              Upgrade
            </Button>
            <Button size="xs" variant="outline">
              Billing
            </Button>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  ),
}
