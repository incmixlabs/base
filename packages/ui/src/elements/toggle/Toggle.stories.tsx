import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlignCenter, Bold, Italic, List, Underline } from 'lucide-react'
import { Box } from '@/layouts/box/Box'
import { selectArgType } from '@/theme/props/storybook'
import { Toggle, ToggleGroup } from './Toggle'
import { togglePropDefs } from './toggle.props'

const meta: Meta<typeof Toggle> = {
  title: 'Elements/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: selectArgType(togglePropDefs.size),
    variant: selectArgType(togglePropDefs.variant),
    color: selectArgType(togglePropDefs.color),
    radius: selectArgType(togglePropDefs.radius),
    highContrast: { control: 'boolean' },
    disabled: { control: 'boolean' },
    pressed: { control: 'boolean' },
    defaultPressed: { control: false },
    onPressedChange: { control: false },
  },
  args: {
    size: 'md',
    variant: 'soft',
    color: 'slate',
    highContrast: false,
    disabled: false,
    pressed: false,
    'aria-label': 'Bold',
    children: <Bold className="h-4 w-4" />,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-3">
      <Toggle aria-label="Bold soft" variant="soft" pressed>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Italic solid" variant="solid" pressed>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Underline off" variant="soft">
        <Underline className="h-4 w-4" />
      </Toggle>
    </Box>
  ),
}

export const GroupSingle: Story = {
  render: () => {
    return (
      <ToggleGroup.Root defaultValue={['left']} multiple={false}>
        <ToggleGroup.Item value="left" aria-label="Align left">
          <AlignCenter className="h-4 w-4 rotate-180" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="list" aria-label="List">
          <List className="h-4 w-4" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    )
  },
}

export const GroupMultiple: Story = {
  render: () => {
    return (
      <ToggleGroup.Root multiple defaultValue={['bold']} variant="solid">
        <ToggleGroup.Item value="bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="underline" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    )
  },
}
