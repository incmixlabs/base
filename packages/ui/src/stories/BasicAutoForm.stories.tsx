import { Button } from '@/elements'
import { Label } from '@/form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

// Simple demo without complex imports first
const BasicFormDemo = () => {
  const [formData, setFormData] = useState('')

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Basic AutoForm Test</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="testInput">Test Input</Label>
          <input
            id="testInput"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData}
            onChange={e => setFormData(e.target.value)}
            placeholder="Enter some text"
          />
        </div>
        <Button type="button" className="w-full" onClick={() => alert(`Form data: ${formData}`)}>
          Submit
        </Button>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Current value: <strong>{formData || '(empty)'}</strong>
        </p>
      </div>
    </div>
  )
}

const meta: Meta<typeof BasicFormDemo> = {
  title: 'AJV/Basic Form Test',
  component: BasicFormDemo,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicInput: Story = {}
