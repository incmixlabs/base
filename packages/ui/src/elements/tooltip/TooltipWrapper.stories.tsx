import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info } from 'lucide-react'
import { Button, IconButton } from '@/elements'
import { colorPropDef } from '@/theme/props/color.prop'
import { selectArgType } from '@/theme/props/storybook'
import { TooltipWrapper } from './TooltipWrapper'
import { tooltipContentPropDefs } from './tooltip.props'
import type { TooltipWrapperData, TooltipWrapperProps } from './tooltip-wrapper.types'

const data: TooltipWrapperData = {
  title: 'Field details',
  description: 'Structured content from typed data.',
  items: [
    { id: 'source', label: 'Source', value: 'CRM sync' },
    { id: 'updated', label: 'Updated', value: '2 minutes ago' },
    { id: 'status', label: 'Status', value: 'Healthy', description: 'No errors in last sync cycle.' },
  ],
}

const meta = {
  title: 'Elements/TooltipWrapper',
  component: TooltipWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      ...selectArgType(tooltipContentPropDefs.variant),
      description: 'Surface visual variant',
    },
    color: {
      ...selectArgType(colorPropDef.color),
      description: 'Semantic color lane',
    },
    size: {
      ...selectArgType(tooltipContentPropDefs.size),
      description: 'Content padding size',
    },
    maxWidth: {
      ...selectArgType(tooltipContentPropDefs.maxWidthToken),
      description: 'Maximum width token',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast treatment',
    },
    showArrow: {
      control: 'boolean',
      description: 'Show tooltip arrow',
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Placement side relative to trigger',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alignment along the side',
    },
    sideOffset: {
      control: { type: 'number' },
      description: 'Distance from trigger',
    },
    alignOffset: {
      control: { type: 'number' },
      description: 'Alignment offset',
    },
  },
  args: {
    variant: 'surface',
    color: 'slate',
    size: 'sm',
    maxWidth: 'md',
    highContrast: false,
    showArrow: true,
    side: 'top',
    align: 'center',
    sideOffset: 6,
    alignOffset: 0,
  },
} satisfies Meta<TooltipWrapperProps>

export default meta
type Story = StoryObj<TooltipWrapperProps>

export const DataDriven: Story = {
  render: args => <TooltipWrapper {...args} trigger={<Button variant="outline">Hover for info</Button>} data={data} />,
}

export const WrapperVsPrimitive: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium">TooltipWrapper</div>
        <TooltipWrapper
          trigger={
            <IconButton variant="ghost" size="sm" aria-label="Info">
              <Info className="h-4 w-4" />
            </IconButton>
          }
          data={data}
          variant="solid"
          color="inverse"
        />
      </div>
    </div>
  ),
}
