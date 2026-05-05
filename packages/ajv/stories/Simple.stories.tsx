import type { Meta, StoryObj } from '@storybook/react'

// Very simple component to test if AJV stories work at all
const SimpleDemo = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">AJV Package Test</h1>
      <p>This is a simple test to see if AJV stories are loading.</p>
    </div>
  )
}

const meta: Meta<typeof SimpleDemo> = {
  title: 'AJV/Simple Test',
  component: SimpleDemo,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}
