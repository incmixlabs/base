import type { SchemaProvider } from '@incmix/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { getErrorMessage } from './utils/error-helpers'

const meta: Meta = {
  title: 'Debug/AJV Interface Test',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SchemaProviderInterfaceTest: Story = {
  render: () => {
    const [result, setResult] = React.useState<string>('Testing...')

    React.useEffect(() => {
      async function testInterface() {
        try {
          console.log('=== Schema Provider Interface Test ===')

          // Import modules
          const { AjvProvider } = await import('@incmix/ajv')

          console.log('AjvProvider class:', AjvProvider)

          // Create schema
          const schema = {
            type: 'object' as const,
            properties: {
              name: { type: 'string' as const, title: 'Name' },
            },
            required: ['name'],
          }

          console.log('Creating AjvProvider instance...')
          const provider = new AjvProvider(schema)

          console.log('Provider instance:', provider)
          console.log('Provider constructor:', provider.constructor)
          console.log('Provider constructor name:', provider.constructor.name)
          const schemaProviderCheck: SchemaProvider = provider
          console.log('SchemaProvider compatibility:', !!schemaProviderCheck)

          // Check if it implements SchemaProvider interface
          const hasParseSchema = 'parseSchema' in provider
          const hasValidateSchema = 'validateSchema' in provider
          const hasGetDefaultValues = 'getDefaultValues' in provider

          console.log('Interface compliance check:')
          console.log('- hasParseSchema:', hasParseSchema)
          console.log('- hasValidateSchema:', hasValidateSchema)
          console.log('- hasGetDefaultValues:', hasGetDefaultValues)

          // Check method types
          const parseSchemaType = typeof provider.parseSchema
          const validateSchemaType = typeof provider.validateSchema
          const getDefaultValuesType = typeof provider.getDefaultValues

          console.log('Method types:')
          console.log('- parseSchema type:', parseSchemaType)
          console.log('- validateSchema type:', validateSchemaType)
          console.log('- getDefaultValues type:', getDefaultValuesType)

          // Get all enumerable properties
          const ownProps = Object.getOwnPropertyNames(provider)
          const prototypeProps = Object.getOwnPropertyNames(Object.getPrototypeOf(provider))

          console.log('Own properties:', ownProps)
          console.log('Prototype properties:', prototypeProps)

          // Test method calls individually
          const testResults: Record<string, any> = {}

          if (parseSchemaType === 'function') {
            try {
              console.log('Testing parseSchema...')
              const parseResult = provider.parseSchema()
              testResults.parseSchema = { success: true, result: parseResult }
              console.log('parseSchema result:', parseResult)
            } catch (error) {
              testResults.parseSchema = {
                success: false,
                error: getErrorMessage(error),
              }
              console.error('parseSchema error:', error)
            }
          } else {
            testResults.parseSchema = {
              success: false,
              error: `Not a function (type: ${parseSchemaType})`,
            }
          }

          if (validateSchemaType === 'function') {
            try {
              console.log('Testing validateSchema...')
              const validateResult = provider.validateSchema({ name: 'test' })
              testResults.validateSchema = {
                success: true,
                result: validateResult,
              }
              console.log('validateSchema result:', validateResult)
            } catch (error) {
              testResults.validateSchema = {
                success: false,
                error: getErrorMessage(error),
              }
              console.error('validateSchema error:', error)
            }
          } else {
            testResults.validateSchema = {
              success: false,
              error: `Not a function (type: ${validateSchemaType})`,
            }
          }

          if (getDefaultValuesType === 'function') {
            try {
              console.log('Testing getDefaultValues...')
              const defaultsResult = provider.getDefaultValues()
              testResults.getDefaultValues = {
                success: true,
                result: defaultsResult,
              }
              console.log('getDefaultValues result:', defaultsResult)
            } catch (error) {
              testResults.getDefaultValues = {
                success: false,
                error: getErrorMessage(error),
              }
              console.error('getDefaultValues error:', error)
            }
          } else {
            testResults.getDefaultValues = {
              success: false,
              error: `Not a function (type: ${getDefaultValuesType})`,
            }
          }

          console.log('=== Test Results Summary ===')
          console.log('Test results:', testResults)

          const summary = {
            interface: {
              hasParseSchema,
              hasValidateSchema,
              hasGetDefaultValues,
              allPresent: hasParseSchema && hasValidateSchema && hasGetDefaultValues,
            },
            types: {
              parseSchemaType,
              validateSchemaType,
              getDefaultValuesType,
              allFunctions:
                parseSchemaType === 'function' &&
                validateSchemaType === 'function' &&
                getDefaultValuesType === 'function',
            },
            testResults,
          }

          setResult(`✅ Interface test complete!\n\n${JSON.stringify(summary, null, 2)}`)
        } catch (error) {
          console.error('Error in interface test:', error)
          setResult(`❌ Interface test error: ${getErrorMessage(error)}`)
        }
      }

      testInterface()
    }, [])

    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">AJV Schema Provider Interface Test</h2>
        <p className="text-gray-600">
          This tests if the AjvProvider properly implements the SchemaProvider interface.
          <strong> Check the browser console for detailed logging.</strong>
        </p>

        <div className="p-4 bg-gray-100 rounded-lg max-h-96 overflow-auto">
          <h3 className="font-medium mb-2">Test Results:</h3>
          <pre className="text-xs whitespace-pre-wrap">{result}</pre>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">🔍 What this tests:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• SchemaProvider interface compliance</li>
            <li>• Method existence (parseSchema, validateSchema, getDefaultValues)</li>
            <li>• Method types (should all be functions)</li>
            <li>• Individual method execution</li>
            <li>• Property enumeration and inspection</li>
            <li>• Detailed error reporting for any failures</li>
          </ul>
        </div>
      </div>
    )
  },
}
