import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { getErrorMessage } from './utils/error-helpers'

const meta: Meta = {
  title: 'Debug/AJV Instance Debug',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AjvInstanceTest: Story = {
  render: () => {
    const [debugInfo, setDebugInfo] = React.useState<string>('Loading...')

    React.useEffect(() => {
      async function debugAjvProvider() {
        try {
          console.log('=== Starting AJV Provider Debug ===')

          // Step 1: Import the module
          console.log('1. Importing AJV module...')
          const ajvModule = await import('@incmix/ajv')
          console.log('   AJV Module:', ajvModule)

          // Step 2: Check if AjvProvider exists
          console.log('2. Checking AjvProvider class...')
          const { AjvProvider } = ajvModule
          if (!AjvProvider) {
            throw new Error('AjvProvider not found in module')
          }
          console.log('   AjvProvider class:', AjvProvider)
          console.log('   AjvProvider prototype:', AjvProvider.prototype)
          console.log('   AjvProvider prototype methods:', Object.getOwnPropertyNames(AjvProvider.prototype))

          // Step 3: Create schema
          console.log('3. Creating test schema...')
          const schema = {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Name' },
              email: { type: 'string', format: 'email', title: 'Email' },
            },
            required: ['name'],
          }
          console.log('   Schema:', schema)

          // Step 4: Create instance
          console.log('4. Creating AjvProvider instance...')
          const provider = new AjvProvider(schema)
          console.log('   Provider instance:', provider)
          console.log('   Provider constructor name:', provider.constructor.name)
          console.log('   Provider instanceof AjvProvider:', provider instanceof AjvProvider)

          // Step 5: Check methods exist
          console.log('5. Checking methods on instance...')
          console.log('   provider.parseSchema:', provider.parseSchema)
          console.log('   typeof provider.parseSchema:', typeof provider.parseSchema)
          console.log('   provider.validateSchema:', provider.validateSchema)
          console.log('   typeof provider.validateSchema:', typeof provider.validateSchema)
          console.log('   provider.getDefaultValues:', provider.getDefaultValues)
          console.log('   typeof provider.getDefaultValues:', typeof provider.getDefaultValues)

          // Step 6: Test method calls
          console.log('6. Testing method calls...')

          if (typeof provider.parseSchema === 'function') {
            console.log('   Calling parseSchema...')
            const parsed = provider.parseSchema()
            console.log('   parseSchema result:', parsed)
          } else {
            console.error('   parseSchema is not a function!')
          }

          if (typeof provider.validateSchema === 'function') {
            console.log('   Calling validateSchema...')
            const validated = provider.validateSchema({ name: 'test' })
            console.log('   validateSchema result:', validated)
          } else {
            console.error('   validateSchema is not a function!')
          }

          if (typeof provider.getDefaultValues === 'function') {
            console.log('   Calling getDefaultValues...')
            const defaults = provider.getDefaultValues()
            console.log('   getDefaultValues result:', defaults)
          } else {
            console.error('   getDefaultValues is not a function!')
          }

          console.log('=== AJV Provider Debug Complete ===')
          setDebugInfo('✅ Debug complete - check browser console for detailed logs')
        } catch (error) {
          console.error('=== AJV Provider Debug Error ===')
          console.error('Error:', error)
          if (error instanceof Error) {
            console.error('Stack:', error.stack)
          }
          setDebugInfo(`❌ Error: ${getErrorMessage(error)}`)
        }
      }

      debugAjvProvider()
    }, [])

    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">AJV Provider Instance Debug</h2>
        <p className="text-gray-600">
          This debug story checks the AjvProvider class instantiation and method availability.
          <strong> Check the browser console for detailed logging.</strong>
        </p>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Debug Status:</h3>
          <pre className="text-sm">{debugInfo}</pre>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">🔍 What this tests:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Module import from @incmix/ajv</li>
            <li>• AjvProvider class existence and structure</li>
            <li>• Instance creation with test schema</li>
            <li>• Method availability (parseSchema, validateSchema, getDefaultValues)</li>
            <li>• Method type checking and execution</li>
            <li>• Detailed console logging for debugging</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">📝 Instructions:</h3>
          <p className="text-sm text-yellow-700">
            1. Open browser developer tools (F12)
            <br />
            2. Go to Console tab
            <br />
            3. Look for detailed logs starting with "=== Starting AJV Provider Debug ==="
            <br />
            4. Check if any methods are missing or throwing errors
          </p>
        </div>
      </div>
    )
  },
}
