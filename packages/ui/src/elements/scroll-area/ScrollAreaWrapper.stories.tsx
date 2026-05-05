import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, Clock3, ShieldCheck } from 'lucide-react'
import { ScrollArea } from './ScrollArea'
import { ScrollAreaWrapper } from './ScrollAreaWrapper'
import type { ScrollAreaWrapperData, ScrollAreaWrapperProps } from './scroll-area-wrapper.types'

const activityFeed: ScrollAreaWrapperData = [
  {
    id: 'deploy',
    title: 'Deployment completed',
    description: 'Production release finished successfully.',
    content: 'All background jobs drained cleanly and the health checks stayed green.',
    leading: <ShieldCheck className="h-4 w-4" />,
    trailing: '2m ago',
  },
  {
    id: 'billing',
    title: 'Invoice ready',
    description: 'March usage statement is available.',
    content: 'Review the invoice and confirm the cost center before export.',
    leading: <Bell className="h-4 w-4" />,
    trailing: '14m ago',
  },
  {
    id: 'incident',
    title: 'Latency spike resolved',
    description: 'Queue throughput returned to baseline.',
    content: 'The temporary worker pool bump has been removed after the backlog cleared.',
    leading: <Clock3 className="h-4 w-4" />,
    trailing: '31m ago',
  },
]

const meta = {
  title: 'Elements/ScrollAreaWrapper',
  component: ScrollAreaWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Typed data-driven wrapper over ScrollArea. Use ScrollAreaWrapper for config/CMS payloads and ScrollArea directly for bespoke content layouts.',
      },
    },
  },
  args: {
    data: activityFeed,
    type: 'always',
    scroll: 'vertical',
    size: 'xs',
    controls: true,
    className: 'h-80 w-[28rem] rounded-xl border',
  },
} satisfies Meta<ScrollAreaWrapperProps>

export default meta
type Story = StoryObj<ScrollAreaWrapperProps>

export const DataDriven: Story = {}

export const WrapperVsPrimitive: Story = {
  render: args => {
    const { data, contentClassName, itemClassName, renderItem: _renderItem, className, ...scrollAreaArgs } = args

    return (
      <div className="grid w-[58rem] grid-cols-2 gap-4">
        <ScrollAreaWrapper {...args} />
        <ScrollArea {...scrollAreaArgs} className={className}>
          <div className={contentClassName ?? 'px-4 py-4 pr-2'}>
            <div className="space-y-3">
              {(data ?? []).map(item => (
                <div key={item.id} className="rounded-lg border border-border/60 bg-background/60 p-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 text-muted-foreground">{item.leading}</div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{item.trailing}</div>
                  </div>
                  <div className="mt-3 text-sm">{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  },
}
