import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/elements'
import { AccordionSchemaWrapper } from './AccordionSchemaWrapper'

const schema = {
  id: 'onboarding-faq',
  title: 'Workspace onboarding',
  description: 'Schema-driven accordion with metadata cards and item actions.',
  items: [
    {
      value: 'provisioning',
      title: 'Provisioning status',
      description: 'Tenant resources and queues',
      content: 'Provisioning completed. You can now connect external systems.',
      open: true,
      meta: [
        { id: 'env', label: 'Environment', value: 'Production' },
        { id: 'region', label: 'Region', value: 'us-west-2' },
      ],
      actions: [
        { id: 'view-logs', label: 'View logs', variant: 'outline' as const, color: 'slate' as const },
        { id: 'retry', label: 'Retry', variant: 'soft' as const, color: 'warning' as const },
      ],
    },
    {
      value: 'connections',
      title: 'Connections',
      description: 'CRM and analytics links',
      content: 'Two connectors are pending verification.',
      meta: [
        { id: 'healthy', label: 'Healthy', value: '6/8' },
        { id: 'degraded', label: 'Degraded', value: '2/8' },
      ],
      actions: [{ id: 'open-connectors', label: 'Open connectors', variant: 'outline' as const }],
    },
  ],
}

const meta = {
  title: 'Elements/AccordionSchemaWrapper',
  component: AccordionSchemaWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AccordionSchemaWrapper>

export default meta
type Story = StoryObj<typeof AccordionSchemaWrapper>

export const Default: Story = {
  args: {
    schema,
    className: 'w-[640px]',
  },
}

export const RenderOverride: Story = {
  args: {
    schema,
    className: 'w-[640px]',
    renderItem: (item, defaults) => {
      if (item.value !== 'connections') return defaults
      return {
        ...defaults,
        content: (
          <>
            {defaults.content}
            <div className="mt-3">
              <Badge size="sm" color="warning">
                Action required
              </Badge>
            </div>
          </>
        ),
      }
    },
  },
}
