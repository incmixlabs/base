import { Button } from '@/elements'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'

// For now, let's create a simplified version that demonstrates the concept
// without complex cross-package imports
const MockAutoForm = ({ onSubmit }: any) => {
  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-sm text-gray-500 mb-4">📋 This would be the AutoForm component with AJV provider</p>
      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">AutoForm Placeholder</h3>
        <p className="text-yellow-700 text-sm">
          The actual AutoForm would render here with:
          <br />• Dynamic fields based on JSON Schema
          <br />• Real-time validation
          <br />• Complex nested objects and arrays
        </p>
        <Button type="button" className="mt-4" onClick={() => onSubmit?.({ mockData: 'This would be real form data' })}>
          Simulate Submit
        </Button>
      </div>
    </div>
  )
}

// Complex form data types
interface UserProfile {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    birthDate: string
  }
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    newsletter: boolean
    notifications: boolean
    theme: 'light' | 'dark' | 'auto'
    language: string
  }
  skills: string[]
  experience: {
    yearsOfExperience: number
    currentRole: string
    company?: string
    salary?: number
  }
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    completed: boolean
  }>
}

// Complex JSON Schema
const userProfileSchema = {
  type: 'object',
  properties: {
    personalInfo: {
      type: 'object',
      title: 'Personal Information',
      description: 'Basic information about yourself',
      properties: {
        firstName: {
          type: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Your first name',
          title: 'First Name',
        },
        lastName: {
          type: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Your last name',
          title: 'Last Name',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Your email address',
          title: 'Email Address',
        },
        phone: {
          type: 'string',
          pattern: '^[\\+]?[1-9][\\d]{0,15}$',
          description: 'Your phone number (optional)',
          title: 'Phone Number',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          description: 'Your date of birth',
          title: 'Date of Birth',
        },
      },
      required: ['firstName', 'lastName', 'email', 'birthDate'],
    },
    address: {
      type: 'object',
      title: 'Address',
      description: 'Your current address',
      properties: {
        street: {
          type: 'string',
          minLength: 5,
          description: 'Street address',
          title: 'Street Address',
        },
        city: {
          type: 'string',
          minLength: 2,
          description: 'City name',
          title: 'City',
        },
        state: {
          type: 'string',
          minLength: 2,
          description: 'State or province',
          title: 'State/Province',
        },
        zipCode: {
          type: 'string',
          pattern: '^[\\d]{5}(-[\\d]{4})?$',
          description: 'ZIP or postal code',
          title: 'ZIP Code',
        },
        country: {
          type: 'string',
          enum: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP'],
          default: 'US',
          description: 'Country',
          title: 'Country',
        },
      },
      required: ['street', 'city', 'state', 'zipCode', 'country'],
    },
    preferences: {
      type: 'object',
      title: 'Preferences',
      description: 'Your app preferences',
      properties: {
        newsletter: {
          type: 'boolean',
          default: false,
          description: 'Subscribe to newsletter',
          title: 'Newsletter Subscription',
        },
        notifications: {
          type: 'boolean',
          default: true,
          description: 'Enable notifications',
          title: 'Enable Notifications',
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'auto'],
          default: 'auto',
          description: 'UI theme preference',
          title: 'Theme',
        },
        language: {
          type: 'string',
          enum: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
          default: 'en',
          description: 'Preferred language',
          title: 'Language',
        },
      },
      required: ['newsletter', 'notifications', 'theme', 'language'],
    },
    skills: {
      type: 'array',
      title: 'Skills',
      description: 'List your technical skills',
      items: {
        type: 'string',
        minLength: 2,
      },
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,
      default: [],
    },
    experience: {
      type: 'object',
      title: 'Professional Experience',
      description: 'Your work experience',
      properties: {
        yearsOfExperience: {
          type: 'number',
          minimum: 0,
          maximum: 50,
          default: 0,
          description: 'Years of professional experience',
          title: 'Years of Experience',
        },
        currentRole: {
          type: 'string',
          minLength: 2,
          description: 'Your current job title',
          title: 'Current Role',
        },
        company: {
          type: 'string',
          description: 'Current company (optional)',
          title: 'Company',
        },
        salary: {
          type: 'number',
          minimum: 0,
          maximum: 1000000,
          description: 'Annual salary (optional)',
          title: 'Salary',
        },
      },
      required: ['yearsOfExperience', 'currentRole'],
    },
    projects: {
      type: 'array',
      title: 'Projects',
      description: "Notable projects you've worked on",
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            description: 'Project name',
            title: 'Project Name',
          },
          description: {
            type: 'string',
            minLength: 10,
            description: 'Project description',
            title: 'Description',
          },
          technologies: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1,
            description: 'Technologies used',
            title: 'Technologies',
          },
          completed: {
            type: 'boolean',
            default: false,
            description: 'Is the project completed?',
            title: 'Completed',
          },
        },
        required: ['name', 'description', 'technologies', 'completed'],
      },
      default: [],
    },
  },
  required: ['personalInfo', 'address', 'preferences', 'skills', 'experience'],
} as const

// Demo component with form state management
const ComplexAutoFormDemo = () => {
  const [formData, setFormData] = React.useState<UserProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

  // const provider = new AjvProvider(userProfileSchema); // This would be the real provider

  const handleSubmit = async (values: UserProfile) => {
    setIsSubmitting(true)
    setErrors([])

    // Simulate validation (this would use the real AJV provider)
    // const validationResult = provider.validateSchema(values);
    // if (!validationResult.success) {
    //   setErrors(validationResult.errors.map(e => `${e.path.join('.')}: ${e.message}`));
    //   setIsSubmitting(false);
    //   return;
    // }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setFormData(values)
    setIsSubmitting(false)
    alert('Form submitted successfully!')
  }

  const defaultValues = {} // provider.getDefaultValues();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile Form</h1>
        <p className="text-gray-600 mb-6">
          Complete your profile with personal information, preferences, and experience.
        </p>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-red-900 mb-2">Validation Errors:</h3>
            <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <MockAutoForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          withSubmit={true}
          formProps={{
            className: 'space-y-8',
          }}
        />

        {isSubmitting && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 font-medium">🔄 Submitting form...</p>
          </div>
        )}

        {formData && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-900 mb-3">✅ Form Submitted Successfully!</h3>
            <pre className="text-sm text-green-800 overflow-auto max-h-64">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Form Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Nested object validation (personalInfo, address, experience)</li>
          <li>✅ Array validation with dynamic items (skills, projects)</li>
          <li>✅ Email and phone format validation</li>
          <li>✅ Date validation for birthDate</li>
          <li>✅ Enum validation for dropdowns (country, theme, language)</li>
          <li>✅ Number range validation (salary, experience years)</li>
          <li>✅ String length and pattern validation</li>
          <li>✅ Complex nested array objects (projects)</li>
          <li>✅ Boolean toggles with defaults</li>
          <li>✅ Required field validation</li>
        </ul>
      </div>
    </div>
  )
}

const meta: Meta<typeof ComplexAutoFormDemo> = {
  title: 'AJV/Complex AutoForm',
  component: ComplexAutoFormDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive example showing complex forms with nested objects, arrays, validation, and the AJV provider.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const FullUserProfile: Story = {
  render: () => <ComplexAutoFormDemo />,
}

// Simpler static version without state
export const SchemaDemo: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Schema Documentation</h1>
        <p className="text-gray-600 mb-6">
          This shows the complete JSON Schema structure for a complex user profile form.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Schema Structure</h3>
            <pre className="text-xs text-gray-600 overflow-auto max-h-64">
              {JSON.stringify(userProfileSchema, null, 2)}
            </pre>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Form Features</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✅ Nested objects (personalInfo, address)</li>
              <li>✅ Arrays with validation (skills)</li>
              <li>✅ Complex nested arrays (projects)</li>
              <li>✅ Email & phone format validation</li>
              <li>✅ Date validation</li>
              <li>✅ Enum dropdowns</li>
              <li>✅ Number range validation</li>
              <li>✅ String length validation</li>
              <li>✅ Boolean toggles</li>
              <li>✅ Required field validation</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">🎯 AutoForm Integration</h3>
          <p className="text-gray-600 text-sm">
            This schema would be used with:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">new AjvProvider(userProfileSchema)</code>
            <br />
            The AutoForm component would automatically generate form fields, validation, and UI based on this schema.
          </p>
        </div>
      </div>
    </div>
  ),
}

export const SimpleForm: Story = {
  render: () => {
    // const provider = new AjvProvider(simpleSchema);

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Simple Form Example</h2>
        <MockAutoForm
          onSubmit={(values: unknown) => {
            console.log('Simple form submitted:', values)
            alert('Form submitted! Check console.')
          }}
          withSubmit={true}
          formProps={{
            className: 'space-y-4',
          }}
        />
        <div className="mt-4 text-sm text-gray-600">
          <strong>Schema would include:</strong>
          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs">
            {`{
  name: string (min 2 chars)
  email: string (email format)  
  age: number (18-120)
  skills: string[] (default: ["JavaScript", "React"])
}`}
          </pre>
        </div>
      </div>
    )
  },
}
