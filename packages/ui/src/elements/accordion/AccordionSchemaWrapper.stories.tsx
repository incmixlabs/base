import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/elements'
import { selectArgType } from '@/theme/props/storybook'
import { AccordionSchemaWrapper } from './AccordionSchemaWrapper'
import { accordionRootPropDefs } from './accordion.props'

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
  argTypes: {
    size: selectArgType(accordionRootPropDefs.size),
    border: { control: 'boolean' },
    triggerPadding: { control: 'boolean' },
    contentPadding: { control: 'boolean' },
    multiple: { control: 'boolean' },
    triggerIconPosition: selectArgType(accordionRootPropDefs.triggerIconPosition),
  },
} satisfies Meta<typeof AccordionSchemaWrapper>

export default meta
type Story = StoryObj<typeof AccordionSchemaWrapper>

export const Default: Story = {
  args: {
    schema,
    className: 'w-[640px]',
    size: accordionRootPropDefs.size.default,
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    multiple: accordionRootPropDefs.multiple.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
  },
}

export const RenderOverride: Story = {
  args: {
    schema,
    className: 'w-[640px]',
    size: accordionRootPropDefs.size.default,
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    multiple: accordionRootPropDefs.multiple.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
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
