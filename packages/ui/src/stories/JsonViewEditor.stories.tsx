import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { type JsonValue, JsonViewEditor, SchemaPreview } from '@/editor/autoform'
import { getTreeItemId, type JsonViewEditorCombinatorSelections } from '@/editor/autoform/JsonViewEditor'
import { autoformUiSchemaJsonSchema, autoformUiSchemaUiSchema } from './autoform-ui-schema-contract.example'

const combinatorValue: JsonValue = {
  type: 'object',
  properties: {
    contact: {
      oneOf: [
        {
          title: 'Email',
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
        {
          title: 'Phone',
          type: 'object',
          properties: {
            phone: {
              type: 'string',
            },
          },
        },
      ],
    },
    availability: {
      anyOf: [{ type: 'string' }, { type: 'null' }],
    },
    composedProfile: {
      allOf: [
        {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
          },
        },
        {
          type: 'object',
          properties: {
            lastName: { type: 'string' },
          },
        },
      ],
    },
  },
}

const schemaOneOfEditorValue: JsonValue = {
  type: 'object',
  properties: {
    variant: {
      oneOf: [
        {
          title: 'Email branch',
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
          },
        },
        {
          title: 'Phone branch',
          type: 'object',
          properties: {
            phone: {
              type: 'string',
            },
          },
        },
      ],
    },
  },
}

const schemaOneOfPreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'variant',
      title: 'Variant setup',
      fields: ['variant'],
      columns: 1,
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    variant: {
      label: 'Variant',
      help: 'Switch the oneOf branch in the schema editor and confirm the rendered fields update here.',
    },
    'variant.email': {
      label: 'Email',
    },
    'variant.phone': {
      label: 'Phone',
    },
  },
}

const getCombinatorSelectionKey = getTreeItemId

function applyStoryOneOfSelections(
  value: JsonValue,
  selections: JsonViewEditorCombinatorSelections,
  path: (string | number)[] = [],
): JsonValue {
  if (Array.isArray(value)) {
    return value.map((entry, index) => applyStoryOneOfSelections(entry, selections, [...path, index]))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const nextObject: Record<string, JsonValue> = {}

  for (const [key, childValue] of Object.entries(value)) {
    if (key === 'oneOf' && Array.isArray(childValue)) {
      const pathKey = getCombinatorSelectionKey([...path, key])
      const selectedIndex = selections[pathKey] ?? 0
      const normalizedBranches = childValue.map((branch, index) =>
        applyStoryOneOfSelections(branch, selections, [...path, key, index]),
      )
      const boundedIndex = selectedIndex >= 0 && selectedIndex < normalizedBranches.length ? selectedIndex : 0
      const selectedBranch = normalizedBranches[boundedIndex]
      const remainingBranches = normalizedBranches.filter((_, index) => index !== boundedIndex)
      nextObject[key] = [selectedBranch, ...remainingBranches]
      continue
    }

    nextObject[key] = applyStoryOneOfSelections(childValue, selections, [...path, key])
  }

  return nextObject
}

const combinatorPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Combinator preview',
  properties: {
    contactMethod: {
      type: 'string',
      enum: ['email', 'phone'],
      default: 'email',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    displayName: {
      type: 'string',
    },
  },
  required: ['contactMethod'],
  oneOf: [
    {
      title: 'email',
      properties: {
        contactMethod: { const: 'email' },
        email: {
          type: 'string',
          format: 'email',
        },
      },
      required: ['email'],
    },
    {
      title: 'phone',
      properties: {
        contactMethod: { const: 'phone' },
        phone: {
          type: 'string',
        },
      },
      required: ['phone'],
    },
  ],
  anyOf: [
    {
      properties: {
        displayName: {
          title: 'Display name',
        },
      },
    },
    {
      properties: {
        displayName: {
          'ui:help': 'Optional public label shown alongside the contact method.',
        },
      },
    },
  ],
  allOf: [
    {
      properties: {
        firstName: {
          title: 'First name',
        },
      },
    },
    {
      properties: {
        lastName: {
          title: 'Last name',
        },
      },
    },
  ],
}

const combinatorPreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'contact',
      title: 'Contact setup',
      fields: ['contactMethod', 'email', 'phone', 'firstName', 'lastName', 'displayName'],
      columns: { base: 1, md: 2 },
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    contactMethod: {
      label: 'Preferred contact',
      help: 'Switch the base field to exercise the combinator preview path.',
      colSpan: { base: 1, md: 2 },
    },
    email: {
      label: 'Email address',
      placeholder: 'ada@example.com',
    },
    phone: {
      label: 'Phone number',
      placeholder: '+1 555 123 4567',
    },
    firstName: {
      label: 'First name',
    },
    lastName: {
      label: 'Last name',
    },
    displayName: {
      label: 'Display name',
      colSpan: { base: 1, md: 2 },
    },
  },
}

const nestedOneOfPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Nested oneOf preview',
  properties: {
    profile: {
      type: 'object',
      title: 'Profile',
      oneOf: [
        {
          title: 'Person',
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
          },
          required: ['firstName'],
        },
        {
          title: 'Company',
          properties: {
            companyName: {
              type: 'string',
            },
            taxId: {
              type: 'string',
            },
          },
          required: ['companyName'],
        },
      ],
    },
  },
}

const nestedOneOfPreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'profile',
      title: 'Profile setup',
      fields: ['profile'],
      columns: 1,
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    profile: {
      label: 'Profile',
      help: 'Nested oneOf branch selection should drive which child fields render below.',
    },
    'profile.firstName': {
      label: 'First name',
    },
    'profile.lastName': {
      label: 'Last name',
    },
    'profile.companyName': {
      label: 'Company name',
    },
    'profile.taxId': {
      label: 'Tax ID',
    },
  },
}

const refNavigationPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Reference navigation preview',
  $defs: {
    account: {
      type: 'object',
      title: 'Account',
      properties: {
        accountId: {
          type: 'string',
        },
        displayName: {
          type: 'string',
        },
      },
      required: ['accountId'],
    },
  },
  properties: {
    account: {
      $ref: '#/$defs/account',
    },
  },
}

const refNavigationPreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'account',
      title: 'Account setup',
      fields: ['account'],
      columns: 1,
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    account: {
      label: 'Account',
      help: 'Use the Schema pane to invalidate the $ref and confirm the row-level error state.',
    },
    'account.accountId': {
      label: 'Account ID',
    },
    'account.displayName': {
      label: 'Display name',
    },
  },
}

const invalidRefNavigationPreviewSchema: JsonValue = {
  ...refNavigationPreviewSchema,
  properties: {
    account: {
      $ref: 'https://example.com/account.schema.json',
    },
  },
}

const externalRefSchemas = {
  'https://example.com/account.schema.json': {
    type: 'object',
    title: 'External account',
    properties: {
      accountId: {
        type: 'string',
      },
      displayName: {
        type: 'string',
      },
    },
    required: ['accountId'],
  },
}

const multipleIssuesValue: JsonValue = {
  properties: {
    account: {
      $ref: 'https://example.com/account.schema.json',
    },
  },
}

const schemaAwarePreviewSchema: JsonValue = {
  type: 'object',
  title: 'Schema-aware preview',
  properties: {
    contactEmail: {
      title: 'Contact email',
      description: 'Primary notification address used for outbound contact and account recovery.',
      type: 'string',
      format: 'email',
      enum: ['ada@example.com', 'grace@example.com'],
      default: 'ada@example.com',
    },
    profilePreferences: {
      type: 'object',
      description: 'Structured default values should summarize clearly in schema mode.',
      default: {
        locale: 'en-US',
        marketingOptIn: true,
      },
    },
  },
}

const schemaRowClarityPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Schema row clarity preview',
  properties: {
    contactEmail: {
      title: 'Contact email',
      description: 'Primary notification address used for outbound contact and account recovery.',
      type: 'string',
      format: 'email',
      enum: ['ada@example.com', 'grace@example.com'],
      default: 'ada@example.com',
    },
    default: {
      type: 'string',
      title: 'User-defined default property',
      description: 'A normal property named "default" should still render like a regular schema entry.',
    },
  },
}

const requiredPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Required editor preview',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
    },
    company: {
      type: 'string',
    },
  },
  required: ['email', 'company'],
}

const itemsPreviewSchema: JsonValue = {
  type: 'object',
  title: 'Items editor preview',
  properties: {
    tags: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
      },
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
        },
        required: ['city'],
      },
    },
    tupleExample: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
    },
  },
}

const schemaAwarePreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'contact',
      title: 'Contact schema',
      fields: ['contactEmail', 'profilePreferences'],
      columns: 1,
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    contactEmail: {
      label: 'Contact email',
      help: 'Schema pane should use schema-aware format, default, and description editing for this field.',
    },
    profilePreferences: {
      label: 'Profile preferences',
      help: 'Check the structured default summary on the schema side and expand it to edit nested default values.',
    },
  },
}

const schemaRowClarityPreviewUiSchema: JsonValue = {
  sections: [
    {
      id: 'contact',
      title: 'Schema row clarity',
      fields: ['contactEmail', 'default'],
      columns: 1,
      layout: { base: 'stacked' },
      labelPlacement: { base: 'top' },
    },
  ],
  fields: {
    contactEmail: {
      label: 'Contact email',
      help: 'Managed schema rows should explain what the inline control edits without showing a raw JSON type chip.',
    },
    default: {
      label: 'Fallback label',
      help: 'This user-defined property is named "default" but should still render like a regular schema entry row.',
    },
  },
}

const meta = {
  title: 'AutoForm/JsonViewEditor',
  component: JsonViewEditor,
  parameters: {
    layout: 'padded',
  },
  args: {
    value: {},
  },
} satisfies Meta<typeof JsonViewEditor>

export default meta

type Story = StoryObj<typeof meta>

export const SchemaAndUiSchema: Story = {
  render: () => (
    <SchemaPreview
      jsonSchema={autoformUiSchemaJsonSchema as JsonValue}
      uiSchema={autoformUiSchemaUiSchema as JsonValue}
    />
  ),
}

export const ReadOnly: Story = {
  args: {
    name: 'schema',
    editable: false,
    value: autoformUiSchemaJsonSchema as JsonValue,
  },
}

export const Combinators: Story = {
  args: {
    name: 'schema',
    editable: false,
    searchable: true,
    value: combinatorValue,
  },
}

export const CombinatorsWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={combinatorPreviewSchema} uiSchema={combinatorPreviewUiSchema} />,
}

export const NestedOneOfWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={nestedOneOfPreviewSchema} uiSchema={nestedOneOfPreviewUiSchema} />,
}

export const RefNavigationWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={refNavigationPreviewSchema} uiSchema={refNavigationPreviewUiSchema} />,
}

export const RefValidationErrorWorkbench: Story = {
  render: () => (
    <SchemaPreview jsonSchema={invalidRefNavigationPreviewSchema} uiSchema={refNavigationPreviewUiSchema} />
  ),
}

export const ExternalRefWorkbench: Story = {
  render: () => (
    <SchemaPreview
      jsonSchema={invalidRefNavigationPreviewSchema}
      uiSchema={refNavigationPreviewUiSchema}
      externalSchemas={externalRefSchemas}
    />
  ),
}

export const MultipleIssues: Story = {
  render: () => (
    <JsonViewEditor
      name="schema"
      editable={false}
      value={multipleIssuesValue}
      issues={{
        'properties.account.$ref': [
          'schemaToAst: external $ref is not supported at $.properties.account.$ref',
          'reference target could not be normalized',
        ],
      }}
    />
  ),
}

export const ExternalRefNavigationEditor: Story = {
  render: () => (
    <JsonViewEditor
      name="schema"
      editable={false}
      searchable
      mode="schema"
      value={invalidRefNavigationPreviewSchema}
      externalSchemas={externalRefSchemas}
    />
  ),
}

export const SchemaAwareEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState<JsonValue>(schemaAwarePreviewSchema)

    return <JsonViewEditor name="schema" editable searchable mode="schema" value={value} onChange={setValue} />
  },
}

export const SchemaOneOfEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState<JsonValue>(schemaOneOfEditorValue)
    const [combinatorSelections, setCombinatorSelections] = React.useState<JsonViewEditorCombinatorSelections>({})
    const previewSchema = React.useMemo(
      () => applyStoryOneOfSelections(value, combinatorSelections),
      [combinatorSelections, value],
    )

    return (
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))',
          alignItems: 'start',
        }}
      >
        <JsonViewEditor
          name="schema"
          editable
          searchable
          mode="schema"
          value={value}
          onChange={setValue}
          combinatorSelections={combinatorSelections}
          onCombinatorSelectionsChange={setCombinatorSelections}
        />
        <SchemaPreview jsonSchema={previewSchema} uiSchema={schemaOneOfPreviewUiSchema} />
      </div>
    )
  },
}

export const SchemaAwareWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={schemaAwarePreviewSchema} uiSchema={schemaAwarePreviewUiSchema} />,
}

export const SchemaMetadataWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={schemaAwarePreviewSchema} uiSchema={schemaAwarePreviewUiSchema} />,
}

export const SchemaRowClarityWorkbench: Story = {
  render: () => <SchemaPreview jsonSchema={schemaRowClarityPreviewSchema} uiSchema={schemaRowClarityPreviewUiSchema} />,
}

export const SchemaRequiredEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState<JsonValue>(requiredPreviewSchema)

    return <JsonViewEditor name="schema" editable searchable mode="schema" value={value} onChange={setValue} />
  },
}

export const SchemaItemsEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState<JsonValue>(itemsPreviewSchema)

    return <JsonViewEditor name="schema" editable searchable mode="schema" value={value} onChange={setValue} />
  },
}
