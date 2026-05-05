import type { Meta, StoryObj } from '@storybook/react'
import { withFieldConfig } from '../src/field-config'
// Import AJV components locally to avoid path issues
import { AjvProvider } from '../src/provider'

// Simple demo component to show AJV Provider functionality
interface DemoData {
  name: string
  age: number
  isActive: boolean
}

const AjvProviderDemo = ({ provider }: { provider: AjvProvider }) => {
  const parsedSchema = provider.parseSchema()
  const defaultValues = provider.getDefaultValues()

  // Test validation with valid data
  const validData: DemoData = { name: 'John', age: 25, isActive: true }
  const validResult = provider.validateSchema(validData)

  // Test validation with invalid data
  const invalidData = { name: '', age: -1, isActive: 'yes' } as any
  const invalidResult = provider.validateSchema(invalidData)

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold">AJV Provider Demo</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Parsed Schema:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(parsedSchema, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Default Values:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(defaultValues, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Valid Data Validation:</h3>
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <div className="mb-2">
            <strong>Input:</strong> {JSON.stringify(validData)}
          </div>
          <div>
            <strong>Result:</strong> {validResult.success ? '✅ Valid' : '❌ Invalid'}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Invalid Data Validation:</h3>
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <div className="mb-2">
            <strong>Input:</strong> {JSON.stringify(invalidData)}
          </div>
          <div className="mb-2">
            <strong>Result:</strong> {invalidResult.success ? '✅ Valid' : '❌ Invalid'}
          </div>
          {!invalidResult.success && (
            <div>
              <strong>Errors:</strong>
              <ul className="list-disc list-inside mt-1">
                {invalidResult.errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error.path.join('.')}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Define the schema
const demoSchema = {
  type: 'object',
  properties: {
    name: withFieldConfig(
      {
        type: 'string',
        minLength: 1,
        description: "Person's name",
      },
      {
        label: 'Full Name',
        placeholder: 'Enter name',
      },
    ),
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150,
      default: 30,
      description: "Person's age",
    },
    isActive: {
      type: 'boolean',
      default: true,
      description: 'Whether the person is active',
    },
  },
  required: ['name', 'age', 'isActive'],
}

const meta: Meta<typeof AjvProviderDemo> = {
  title: 'AJV/Provider Demo',
  component: AjvProviderDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicProvider: Story = {
  args: {
    provider: new AjvProvider(demoSchema),
  },
}

export const WithCustomOptions: Story = {
  args: {
    provider: new AjvProvider(demoSchema, {
      allErrors: true,
      verbose: true,
      strict: false,
    }),
  },
}
