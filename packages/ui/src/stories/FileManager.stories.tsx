import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileManager } from '@/blocks'

const meta = {
  title: 'Blocks/FileManager',
  component: FileManager,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FileManager>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div style={{ height: 'calc(100vh - 2rem)' }}>
      <FileManager {...args} />
    </div>
  ),
}
