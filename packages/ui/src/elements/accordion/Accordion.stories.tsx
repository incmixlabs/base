import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from './Accordion'

const meta = {
  title: 'Elements/Accordion',
  component: Accordion.Root,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Accordion.Root>

export default meta

type Story = StoryObj<typeof Accordion.Root>

export const Default: Story = {
  render: () => (
    <Accordion.Root defaultValue={['item-1']} className="w-[560px]">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>What is Autoform UI?</Accordion.Trigger>
        <Accordion.Content>
          Autoform UI is a token-first component library focused on dense, workflow-heavy product interfaces.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Does it support theming?</Accordion.Trigger>
        <Accordion.Content>
          Yes. Theme tokens are runtime-editable and flow through all supported components.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Can multiple sections be open?</Accordion.Trigger>
        <Accordion.Content>
          Enable <code>multiple</code> on <code>Accordion.Root</code> to allow that behavior.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion.Root multiple defaultValue={['a', 'c']} size="sm" className="w-[560px]">
      <Accordion.Item value="a">
        <Accordion.Trigger>Performance</Accordion.Trigger>
        <Accordion.Content>Small, composable primitives with predictable render paths.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Accessibility</Accordion.Trigger>
        <Accordion.Content>Keyboard navigation and semantic structure come from Base UI primitives.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="c">
        <Accordion.Trigger>Customization</Accordion.Trigger>
        <Accordion.Content>Use size and radius props to match your product shell.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
}
