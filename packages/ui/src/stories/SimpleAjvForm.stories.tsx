import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { useState } from 'react'
import { Label } from '@/form'

// Let's first create a manual form to test the UI without complex imports
interface SimpleFormData {
  name: string
  email: string
  age: number
  skills: string[]
  isActive: boolean
}

const SimpleAjvFormDemo = () => {
  const [formData, setFormData] = useState<SimpleFormData>({
    name: '',
    email: '',
    age: 25,
    skills: ['JavaScript'],
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Age must be between 18 and 120'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      alert('Form submitted successfully!')
      console.log('Form data:', formData)
    }
  }

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, ''],
    }))
  }

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">User Profile Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label className="block mb-1">Full Name *</Label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <Label className="block mb-1">Email Address *</Label>
          <input
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Age Field */}
        <div>
          <Label className="block mb-1">Age *</Label>
          <input
            type="number"
            min="18"
            max="120"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.age}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                age: parseInt(e.target.value, 10) || 0,
              }))
            }
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Skills Array */}
        <div>
          <Label className="block mb-2">Skills</Label>
          <div className="space-y-2">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={skill}
                  onChange={e => updateSkill(index, e.target.value)}
                  placeholder="Enter a skill"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Skill
          </button>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.isActive}
            onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          />
          <Label htmlFor="isActive" className="ml-2 block">
            Active user account
          </Label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Submit Form
          </button>
        </div>
      </form>

      {/* Form Data Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-900 mb-2">Current Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">This Form Demonstrates:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Text input validation (name, email)</li>
          <li>✅ Number input with range validation (age)</li>
          <li>✅ Dynamic array management (skills)</li>
          <li>✅ Boolean checkbox (active status)</li>
          <li>✅ Real-time error display</li>
          <li>✅ Form submission handling</li>
        </ul>
      </div>
    </div>
  )
}

const meta: Meta<typeof SimpleAjvFormDemo> = {
  title: 'AJV/Manual Form Demo',
  component: SimpleAjvFormDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A manual form implementation showing the types of fields we want to generate with AJV AutoForm.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const ManualFormExample: Story = {}
