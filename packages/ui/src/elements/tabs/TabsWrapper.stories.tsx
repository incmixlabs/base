import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Tabs } from '@/elements'
import { TabsWrapper } from './TabsWrapper'
import type { TabsWrapperProps } from './tabs-wrapper.props'

const data: TabsWrapperProps['data'] = [
  {
    value: 'overview',
    label: 'Overview',
    content: 'Pipeline summary, owner, and status.',
    active: true,
  },
  {
    value: 'activity',
    label: 'Activity',
    content: 'Recent timeline events and comments.',
  },
  {
    value: 'settings',
    label: 'Settings',
    content: 'Integrations and automation rules.',
  },
]

const meta = {
  title: 'Elements/TabsWrapper',
  component: TabsWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TabsWrapper>

export default meta
type Story = StoryObj<typeof TabsWrapper>

export const DataDriven: Story = {
  args: {
    className: 'w-[520px]',
    data,
    variant: 'surface',
    size: 'md',
    color: 'primary',
  },
}

export const WrapperVsPrimitive: Story = {
  render: () => (
    <div className="grid w-[900px] grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium">TabsWrapper</div>
        <TabsWrapper
          data={data}
          variant="line"
          color="accent"
          renderItem={(item, defaults) => {
            if (item.value !== 'activity') return defaults
            return {
              ...defaults,
              trigger: (
                <Tabs.Trigger value={item.value}>
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    <Badge size="sm" color="warning">
                      3
                    </Badge>
                  </span>
                </Tabs.Trigger>
              ),
            }
          }}
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Tabs primitives</div>
        <Tabs.Root defaultValue="overview" variant="line" color="accent">
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">
              <span className="inline-flex items-center gap-2">
                Activity
                <Badge size="sm" color="warning">
                  3
                </Badge>
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">Pipeline summary, owner, and status.</Tabs.Content>
          <Tabs.Content value="activity">Recent timeline events and comments.</Tabs.Content>
          <Tabs.Content value="settings">Integrations and automation rules.</Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  ),
}
