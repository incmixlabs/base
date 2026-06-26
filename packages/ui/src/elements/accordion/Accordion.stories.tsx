import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { Accordion } from './Accordion'
import { accordionRootPropDefs } from './accordion.props'

const accordionItems = [
  {
    value: 'item-1',
    trigger: 'What is Autoform UI?',
    content: 'Autoform UI is a token-first component library focused on dense, workflow-heavy product interfaces.',
  },
  {
    value: 'item-2',
    trigger: 'Does it support theming?',
    content: 'Yes. Theme tokens are runtime-editable and flow through all supported components.',
  },
  {
    value: 'item-3',
    trigger: 'Can multiple sections be open?',
    content: (
      <>
        Enable <code>multiple</code> on <code>Accordion.Root</code> to allow that behavior.
      </>
    ),
  },
] as const

function AccordionExample(args: ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root {...args} className="w-[560px]">
      {accordionItems.map(item => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger>{item.trigger}</Accordion.Trigger>
          <Accordion.Content>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const meta = {
  title: 'Elements/Accordion',
  component: Accordion.Root,
  parameters: { layout: 'centered' },
  argTypes: {
    size: selectArgType(accordionRootPropDefs.size),
    border: { control: 'boolean' },
    triggerPadding: { control: 'boolean' },
    contentPadding: { control: 'boolean' },
    multiple: { control: 'boolean' },
    triggerIconPosition: selectArgType(accordionRootPropDefs.triggerIconPosition),
  },
} satisfies Meta<typeof Accordion.Root>

export default meta

type Story = StoryObj<typeof Accordion.Root>

export const Default: Story = {
  args: {
    defaultValue: ['item-1'],
    size: accordionRootPropDefs.size.default,
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    multiple: accordionRootPropDefs.multiple.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
  },
  render: args => <AccordionExample {...args} />,
}

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['item-1', 'item-3'],
    size: accordionRootPropDefs.size.values[1],
    border: accordionRootPropDefs.border.default,
    triggerPadding: accordionRootPropDefs.triggerPadding.default,
    contentPadding: accordionRootPropDefs.contentPadding.default,
    triggerIconPosition: accordionRootPropDefs.triggerIconPosition.default,
  },
  render: args => <AccordionExample {...args} />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[720px] flex-col gap-4">
      {getPropDefValues(accordionRootPropDefs.size).map(size => (
        <Accordion.Root key={size} defaultValue={['item-1']} size={size}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Size {size}</Accordion.Trigger>
            <Accordion.Content>Accordion content follows the same size token.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </div>
  ),
}
