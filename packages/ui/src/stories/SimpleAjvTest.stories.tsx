import { AjvProvider } from '@incmix/ajv'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { getErrorMessage } from './utils/error-helpers'

const meta: Meta = {
  title: 'Test/Simple AJV Test',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DirectMethodTest: Story = {
  render: () => {
    const [result, setResult] = React.useState<string>('Testing...')

    React.useEffect(() => {
      try {
        console.log('=== Direct Method Test ===')

        // Create a simple schema
        const schema = {
          type: 'object' as const,
          properties: {
            name: { type: 'string' as const, title: 'Name' },
          },
          required: ['name'],
        }

        console.log('Creating AjvProvider...')
        const provider = new AjvProvider(schema)

        console.log('Provider created:', provider)
        console.log('Provider constructor:', provider.constructor.name)
        console.log('Provider prototype:', Object.getPrototypeOf(provider))

        // Check what methods are available
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(provider))
        console.log('Available methods:', methodNames)

        // Check method types
        console.log('parseSchema type:', typeof provider.parseSchema)
        console.log('parseSchema function:', provider.parseSchema)

        // Try to call parseSchema directly
        console.log('Calling parseSchema...')
        const parsed = provider.parseSchema()
        console.log('parseSchema result:', parsed)

        setResult(`✅ Success! parseSchema returned ${JSON.stringify(parsed, null, 2)}`)
      } catch (error) {
        console.error('Error in test:', error)
        setResult(`❌ Error: ${getErrorMessage(error)}`)
      }
    }, [])

    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Simple AJV Provider Test</h3>
        <div className="p-4 bg-gray-100 rounded">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
        <div className="mt-4 text-sm text-gray-600">Check the browser console for detailed logging.</div>
      </div>
    )
  },
}

export const CoreParseSchemaTest: Story = {
  render: () => {
    const [result, setResult] = React.useState<string>('Testing...')

    React.useEffect(() => {
      async function testCoreParseSchema() {
        try {
          console.log('=== Core parseSchema Test ===')

          // Import the core parseSchema function
          const { parseSchema: coreParseSchema } = await import('@incmix/core')
          console.log('Core parseSchema imported:', coreParseSchema)

          // Create AjvProvider
          const schema = {
            type: 'object' as const,
            properties: {
              name: { type: 'string' as const, title: 'Name' },
            },
            required: ['name'],
          }

          const provider = new AjvProvider(schema)
          console.log('Provider created:', provider)

          // Test what the core function receives
          console.log('Calling core parseSchema with provider...')
          console.log('Provider before call:', provider)
          console.log('Provider.parseSchema before call:', provider.parseSchema)
          console.log('typeof provider.parseSchema:', typeof provider.parseSchema)

          // This should be the same call that AutoForm makes
          const result = coreParseSchema(provider)
          console.log('Core parseSchema result:', result)

          setResult(`✅ Core parseSchema works! Result: ${JSON.stringify(result, null, 2)}`)
        } catch (error) {
          console.error('Error in core parseSchema test:', error)
          setResult(`❌ Core parseSchema error: ${getErrorMessage(error)}`)
        }
      }

      testCoreParseSchema()
    }, [])

    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Core parseSchema Function Test</h3>
        <div className="p-4 bg-gray-100 rounded">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
        <div className="mt-4 text-sm text-gray-600">This tests the exact same call that AutoForm makes internally.</div>
      </div>
    )
  },
}
