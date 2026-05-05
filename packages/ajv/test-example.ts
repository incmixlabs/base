import type { JSONSchemaType } from './src/index'
import { AjvProvider, withFieldConfig } from './src/index'

// Define your data type
interface UserData {
  name: string
  email: string
  age: number
  isActive: boolean
  role: 'admin' | 'user' | 'guest'
  preferences?: {
    newsletter: boolean
    notifications: boolean
  }
}

// Create JSON Schema with AutoForm configurations
const schema: JSONSchemaType<UserData> = {
  type: 'object',
  properties: {
    name: withFieldConfig(
      {
        type: 'string',
        minLength: 2,
        description: 'Full name of the user',
      },
      {
        label: 'Full Name',
        placeholder: 'Enter your full name',
      },
    ),
    email: withFieldConfig(
      {
        type: 'string',
        format: 'email',
        description: 'Email address',
      },
      {
        label: 'Email Address',
        placeholder: 'user@example.com',
      },
    ),
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150,
      default: 25,
      description: 'Age in years',
    },
    isActive: {
      type: 'boolean',
      default: true,
      description: 'Whether the user account is active',
    },
    role: {
      type: 'string',
      enum: ['admin', 'user', 'guest'],
      default: 'user',
      description: 'User role in the system',
    },
    preferences: {
      type: 'object',
      properties: {
        newsletter: {
          type: 'boolean',
          default: false,
        },
        notifications: {
          type: 'boolean',
          default: true,
        },
      },
      required: ['newsletter', 'notifications'],
    },
  },
  required: ['name', 'email', 'age', 'isActive', 'role'],
}

// Create the AJV provider
const provider = new AjvProvider(schema)

// Test parsing the schema
console.log('=== Parsed Schema ===')
const parsedSchema = provider.parseSchema()
console.log(JSON.stringify(parsedSchema, null, 2))

// Test getting default values
console.log('\n=== Default Values ===')
const defaults = provider.getDefaultValues()
console.log(JSON.stringify(defaults, null, 2))

// Test validation with valid data
console.log('\n=== Valid Data Test ===')
const validData: UserData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  role: 'admin',
  preferences: {
    newsletter: true,
    notifications: false,
  },
}

const validResult = provider.validateSchema(validData)
console.log('Validation result:', validResult)

// Test validation with invalid data
console.log('\n=== Invalid Data Test ===')
const invalidData = {
  name: 'J', // Too short
  email: 'not-an-email', // Invalid format
  age: -5, // Below minimum
  isActive: 'yes', // Wrong type
  role: 'superuser', // Not in enum
} as any

const invalidResult = provider.validateSchema(invalidData)
console.log('Validation result:', invalidResult)

console.log('\n✅ AJV Provider is working successfully!')
