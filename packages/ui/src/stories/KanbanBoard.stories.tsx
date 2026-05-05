import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanBoard, sampleKanbanColumns } from '@/blocks/kanban'

const meta = {
  title: 'Blocks/Kanban/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    defaultColumns: sampleKanbanColumns,
  },
  render: args => (
    <div className="h-screen p-4">
      <KanbanBoard {...args} />
    </div>
  ),
} satisfies Meta<typeof KanbanBoard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = {
  args: {
    density: 'compact',
    tone: 'workbench',
  },
}

export const Readonly: Story = {
  args: {
    readonly: true,
  },
}
