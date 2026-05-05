import type { Meta, StoryObj } from '@storybook/react-vite'

// Very simple test to see if we can get AJV stories working
const AjvTestComponent = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-gray-900 mb-4">AJV Test Story</h1>
      <p className="text-gray-600 mb-4">This is a test story to verify AJV stories can be loaded in Storybook.</p>
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-semibold text-blue-900">Status:</h3>
        <p className="text-blue-800">✅ AJV Story Successfully Loaded!</p>
      </div>
    </div>
  )
}

const meta: Meta<typeof AjvTestComponent> = {
  title: 'AJV/Test Component',
  component: AjvTestComponent,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const WithTitle: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic test to verify AJV stories are working in Storybook.',
      },
    },
  },
}
