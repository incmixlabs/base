import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditorGrid } from './EditorGrid'

const meta: Meta<typeof EditorGrid> = {
  title: 'Editor/EditorGrid',
  component: EditorGrid,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    minorCellSize: 24,
    majorEvery: 5,
    showMinorGrid: true,
  },
}

export default meta
type Story = StoryObj<typeof EditorGrid>

export const Default: Story = {
  name: 'Ruler Canvas',
  render: args => <EditorGrid {...args} className="h-screen w-full" />,
}

export const MajorOnly: Story = {
  args: {
    showMinorGrid: false,
  },
  render: args => <EditorGrid {...args} className="h-screen w-full" />,
}
