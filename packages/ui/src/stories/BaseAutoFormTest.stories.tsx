import { AjvProvider } from '@incmix/ajv'
import { Label } from '@/form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { getErrorMessage } from './utils/error-helpers'

const meta: Meta = {
  title: 'Debug/Base AutoForm Test',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DirectBaseAutoFormTest: Story = {
  render: () => {
    const [status, setStatus] = React.useState<string>('Initializing...')
    const [provider, setProvider] = React.useState<AjvProvider | null>(null)

    React.useEffect(() => {
      async function initializeProvider() {
        try {
          console.log('=== Base AutoForm Test ===')

          // Create provider
          const schema = {
            type: 'object' as const,
            properties: {
              name: { type: 'string' as const, title: 'Name' },
              email: {
                type: 'string' as const,
                format: 'email',
                title: 'Email',
              },
            },
            required: ['name'],
          }

          console.log('Creating AjvProvider...')
          const ajvProvider = new AjvProvider(schema)

          console.log('Provider created:', ajvProvider)
          console.log('Provider methods:', {
            parseSchema: typeof ajvProvider.parseSchema,
            validateSchema: typeof ajvProvider.validateSchema,
            getDefaultValues: typeof ajvProvider.getDefaultValues,
          })

          // Test provider methods work
          console.log('Testing provider methods...')
          const parsed = ajvProvider.parseSchema()
          const validated = ajvProvider.validateSchema({ name: 'test' })
          const defaults = ajvProvider.getDefaultValues()

          console.log('Method results:', { parsed, validated, defaults })

          setProvider(ajvProvider)
          setStatus('Provider ready - testing with BaseAutoForm...')
        } catch (error) {
          console.error('Provider initialization error:', error)
          setStatus(`Provider error: ${getErrorMessage(error)}`)
        }
      }

      initializeProvider()
    }, [])

    if (!provider) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Base AutoForm Test</h3>
          <div className="p-4 bg-gray-100 rounded">
            <pre className="text-sm">{status}</pre>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium mb-4">Base AutoForm Test</h3>

        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">✅ Provider initialized successfully</p>
        </div>

        <div className="border p-4 rounded">
          <h4 className="font-medium mb-2">Testing BaseAutoForm directly:</h4>
          <DirectBaseAutoForm provider={provider} />
        </div>
      </div>
    )
  },
}

const DirectBaseAutoForm: React.FC<{ provider: AjvProvider }> = ({ provider }) => {
  const [BaseAutoForm, setBaseAutoForm] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    console.log('=== DirectBaseAutoForm Render ===')
    console.log('Received provider:', provider)
    console.log('Provider type:', typeof provider)
    console.log('Provider constructor:', provider?.constructor?.name)
    console.log('Provider parseSchema:', provider?.parseSchema)
    console.log('Provider parseSchema type:', typeof provider?.parseSchema)
  }, [provider])

  React.useEffect(() => {
    async function loadBaseAutoForm() {
      try {
        console.log('Loading BaseAutoForm from @incmix/react...')
        const { AutoForm: BaseAutoFormComponent } = await import('@incmix/react')
        console.log('BaseAutoForm loaded:', BaseAutoFormComponent)
        setBaseAutoForm(() => BaseAutoFormComponent)
      } catch (error) {
        console.error('Error loading BaseAutoForm:', error)
        setError(`Failed to load BaseAutoForm: ${getErrorMessage(error)}`)
      }
    }
    loadBaseAutoForm()
  }, [])

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 text-sm">Error: {error}</p>
      </div>
    )
  }

  if (!BaseAutoForm) {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700 text-sm">Loading BaseAutoForm...</p>
      </div>
    )
  }

  // Mock UI components for testing
  const mockUIComponents = {
    Form: (props: any) => <form {...props} className="space-y-4" />,
    FieldWrapper: ({ label, children, error, id }: any) => (
      <div className="space-y-1">
        {label && <Label htmlFor={id}>{label}</Label>}
        {children}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    ),
    ErrorMessage: ({ error }: any) => <p className="text-red-600 text-sm">{error}</p>,
    SubmitButton: ({ children }: any) => (
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {children}
      </button>
    ),
    ObjectWrapper: ({ label, children }: any) => (
      <div className="space-y-2">
        {label && <h4 className="font-medium">{label}</h4>}
        <div className="ml-4 space-y-2">{children}</div>
      </div>
    ),
    ArrayWrapper: ({ label, children, onAddItem }: any) => (
      <div className="space-y-2">
        {label && <h4 className="font-medium">{label}</h4>}
        <div className="space-y-2">{children}</div>
        <button type="button" onClick={onAddItem} className="text-sm text-blue-600">
          Add Item
        </button>
      </div>
    ),
    ArrayElementWrapper: ({ children, onRemove }: any) => (
      <div className="flex items-center space-x-2">
        <div className="flex-1">{children}</div>
        <button type="button" onClick={onRemove} className="text-sm text-red-600">
          Remove
        </button>
      </div>
    ),
  }

  const mockFormComponents = {
    string: (props: any) => <input type="text" className="w-full border rounded px-2 py-1" {...props.inputProps} />,
    email: (props: any) => <input type="email" className="w-full border rounded px-2 py-1" {...props.inputProps} />,
  }

  console.log('Attempting to render BaseAutoForm with provider:', provider)

  return (
    <BaseAutoForm
      schema={provider}
      uiComponents={mockUIComponents}
      formComponents={mockFormComponents}
      onSubmit={(data: any) => {
        console.log('Form submitted:', data)
        alert('Form submitted! Check console for data.')
      }}
      withSubmit={true}
    />
  )
}
