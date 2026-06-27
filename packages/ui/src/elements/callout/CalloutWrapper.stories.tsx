import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectArgType } from '@/theme/props/storybook'
import { Callout } from './Callout'
import { CalloutWrapper } from './CalloutWrapper'
import type { CalloutWrapperData, CalloutWrapperProps } from './callout-wrapper.types'
import { calloutRootPropDefs } from './callout.props'

const data: CalloutWrapperData = {
  title: 'Usage limit reached.',
  message: 'Upgrade your plan or archive inactive projects to continue creating automations.',
  variant: 'surface',
  color: 'warning',
  icon: 'alert-triangle',
  actions: [
    { id: 'upgrade', label: 'Upgrade', variant: 'solid', color: 'warning' },
    { id: 'archive', label: 'Archive inactive', variant: 'outline' },
  ],
}

const meta = {
  title: 'Elements/CalloutWrapper',
  component: CalloutWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: selectArgType(calloutRootPropDefs.size),
    variant: selectArgType(calloutRootPropDefs.variant),
    color: selectArgType(calloutRootPropDefs.color),
    radius: selectArgType(calloutRootPropDefs.radius),
    highContrast: { control: 'boolean' },
    inverse: { control: 'boolean' },
    hover: { control: 'boolean' },
  },
} satisfies Meta<CalloutWrapperProps>

export default meta

type Story = StoryObj<CalloutWrapperProps>

export const DataDriven: Story = {
  args: {
    data,
    radius: 'lg',
  },
}

export const WrapperVsPrimitive: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">CalloutWrapper</div>
        <CalloutWrapper data={data} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Primitives</div>
        <Callout.Root
          variant="surface"
          color="warning"
          icon="info"
          text="Manual composition with Callout primitives."
        />
      </div>
    </div>
  ),
}
