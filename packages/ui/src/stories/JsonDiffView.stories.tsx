import type { Meta, StoryObj } from '@storybook/react-vite'
import { JsonDiffView, type JsonValue } from '@/editor/autoform'

const beforeSchema: JsonValue = {
  type: 'object',
  title: 'Customer profile',
  properties: {
    firstName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    preferences: {
      type: 'object',
      properties: {
        locale: {
          type: 'string',
          default: 'en-US',
        },
      },
    },
  },
  required: ['firstName'],
}

const afterSchema: JsonValue = {
  type: 'object',
  title: 'Customer account profile',
  properties: {
    firstName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
      default: 'ada@example.com',
    },
    phone: {
      type: 'string',
    },
    preferences: {
      type: 'object',
      properties: {
        locale: {
          type: 'string',
          default: 'en-GB',
        },
        marketingOptIn: {
          type: 'boolean',
          default: true,
        },
      },
    },
  },
  required: ['firstName', 'email'],
}

const arrayBefore: JsonValue = {
  enum: ['draft', 'published', 'archived'],
}

const arrayAfter: JsonValue = {
  enum: ['draft', 'review', 'published'],
}

const meta = {
  title: 'AutoForm/JsonDiffView',
  component: JsonDiffView,
  parameters: {
    layout: 'padded',
  },
  args: {
    before: beforeSchema,
    after: afterSchema,
  },
} satisfies Meta<typeof JsonDiffView>

export default meta

type Story = StoryObj<typeof meta>

export const SchemaReview: Story = {}

export const HideUnchanged: Story = {
  args: {
    before: beforeSchema,
    after: afterSchema,
    hideUnchanged: true,
  },
}

export const ArrayChanges: Story = {
  args: {
    before: arrayBefore,
    after: arrayAfter,
    hideUnchanged: false,
  },
}
