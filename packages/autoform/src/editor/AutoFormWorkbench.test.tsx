import '@testing-library/jest-dom/vitest'
import type { JsonSchemaNode } from '@incmix/core'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { JsonValue } from '../json-editor'
import { AutoFormWorkbench } from './AutoFormWorkbench'

const WORKBENCH_INTERACTION_TEST_TIMEOUT_MS = 30_000

const jsonSchema: JsonValue = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    notes: { type: 'string' },
  },
}

const uiSchema: JsonValue = {
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: ['firstName', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    firstName: { label: 'First name' },
    notes: { widget: 'textarea', label: 'Notes' },
  },
}

const oneOfJsonSchema: JsonValue = {
  type: 'object',
  title: 'Contact form',
  properties: {
    contactMethod: {
      type: 'string',
      enum: ['email', 'phone'],
      default: 'email',
    },
  },
  oneOf: [
    {
      title: 'Email',
      properties: {
        email: {
          type: 'string',
        },
      },
      required: ['email'],
    },
    {
      title: 'Phone',
      properties: {
        phone: {
          type: 'string',
        },
      },
      required: ['phone'],
    },
  ],
}

const oneOfUiSchema: JsonValue = {
  sections: [
    {
      id: 'contact',
      title: 'Contact',
      fields: ['contactMethod', 'email', 'phone'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    contactMethod: { label: 'Preferred contact' },
    email: { label: 'Email address' },
    phone: { label: 'Phone number' },
  },
}

const nestedOneOfJsonSchema: JsonValue = {
  type: 'object',
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
          },
          required: ['firstName'],
        },
        {
          title: 'Company',
          properties: {
            companyName: {
              type: 'string',
            },
          },
          required: ['companyName'],
        },
      ],
    },
  },
}

const nestedOneOfUiSchema: JsonValue = {
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: ['profile'],
      columns: 1,
    },
  ],
  fields: {
    profile: { label: 'Profile' },
    firstName: { label: 'First name' },
    companyName: { label: 'Company name' },
  },
}

const invalidRefJsonSchema: JsonValue = {
  type: 'object',
  properties: {
    account: {
      $ref: 'https://example.com/account.schema.json',
    },
  },
}

const externalRefSchemas: Record<string, JsonSchemaNode> = {
  'https://example.com/account.schema.json': {
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
}

const externalRefUiSchema: JsonValue = {
  sections: [
    {
      id: 'account',
      title: 'Account',
      fields: ['account'],
      columns: 1,
    },
  ],
  fields: {
    account: { label: 'Account' },
    'account.accountId': { label: 'Account ID' },
    'account.displayName': { label: 'Display name' },
  },
}

const branchTraversalJsonSchema: JsonValue = {
  type: 'object',
  title: 'Traversal root',
  patternProperties: {
    '^contact_': {
      title: 'Pattern contact',
      oneOf: [
        {
          title: 'Pattern email',
          properties: {
            email: { type: 'string', title: 'Pattern email field' },
          },
        },
        {
          title: 'Pattern phone',
          properties: {
            phone: { type: 'string', title: 'Pattern phone field' },
          },
        },
      ],
    },
  },
  additionalProperties: {
    title: 'Additional property',
    oneOf: [
      {
        title: 'Additional text',
        properties: {
          text: { type: 'string', title: 'Additional text field' },
        },
      },
      {
        title: 'Additional flag',
        properties: {
          enabled: { type: 'boolean', title: 'Additional enabled field' },
        },
      },
    ],
  },
  dependentSchemas: {
    accountType: {
      title: 'Dependent account type',
      oneOf: [
        {
          title: 'Business account',
          properties: {
            taxId: { type: 'string', title: 'Tax ID field' },
          },
        },
        {
          title: 'Personal account',
          properties: {
            ssn: { type: 'string', title: 'SSN field' },
          },
        },
      ],
    },
  },
  anyOf: [
    {
      title: 'AnyOf branch',
      oneOf: [
        {
          title: 'AnyOf email',
          properties: {
            anyOfEmail: { type: 'string', title: 'AnyOf email field' },
          },
        },
        {
          title: 'AnyOf phone',
          properties: {
            anyOfPhone: { type: 'string', title: 'AnyOf phone field' },
          },
        },
      ],
    },
  ],
  allOf: [
    {
      title: 'AllOf branch',
      oneOf: [
        {
          title: 'Nested Alpha',
          properties: {
            alpha: { type: 'string', title: 'Alpha field' },
          },
        },
        {
          title: 'Nested Beta',
          properties: {
            beta: { type: 'string', title: 'Beta field' },
          },
        },
      ],
    },
  ],
}

const schemaPathCollisionJsonSchema: JsonValue = {
  type: 'object',
  dependentSchemas: {
    'user.name': {
      title: 'Dotted dependency',
      oneOf: [
        { title: 'Dotted string', type: 'string' },
        { title: 'Dotted number', type: 'number' },
      ],
    },
    user: {
      properties: {
        name: {
          title: 'Nested dependency',
          oneOf: [
            { title: 'Nested string', type: 'string' },
            { title: 'Nested boolean', type: 'boolean' },
          ],
        },
      },
    },
  },
}

let originalMatchMedia: typeof window.matchMedia

describe('AutoFormWorkbench', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  beforeAll(() => {
    originalMatchMedia = window.matchMedia
    vi.stubGlobal('PointerEvent', MouseEvent)
    vi.stubGlobal(
      'ResizeObserver',
      class ResizeObserver {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    )
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  })

  it(
    'switches viewport presets and updates width badge',
    async () => {
      const user = userEvent.setup()
      render(<AutoFormWorkbench jsonSchema={jsonSchema} uiSchema={uiSchema} />)

      expect(screen.getByText('1200px')).toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'Tablet' }))
      expect(screen.getByText('900px')).toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'Phone' }))
      expect(screen.getByText('375px')).toBeInTheDocument()
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'toggles the secondary sidebar from the header trigger',
    async () => {
      const user = userEvent.setup()
      render(<AutoFormWorkbench jsonSchema={jsonSchema} uiSchema={uiSchema} />)

      expect(screen.getAllByText('Secondary Sidebar').length).toBeGreaterThan(0)

      const toggleButtons = screen.getAllByRole('button', { name: 'Toggle secondary panel' })
      const toggleButton = toggleButtons[toggleButtons.length - 1]
      expect(toggleButton).toBeDefined()

      await user.click(toggleButton as HTMLElement)
      expect(screen.queryAllByText('Secondary Sidebar')).toHaveLength(0)

      const reopenButtons = screen.getAllByRole('button', { name: 'Toggle secondary panel' })
      const reopenButton = reopenButtons[reopenButtons.length - 1]
      expect(reopenButton).toBeDefined()

      await user.click(reopenButton as HTMLElement)
      expect(screen.getAllByText('Secondary Sidebar').length).toBeGreaterThan(0)
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('switches root oneOf preview branches', async () => {
    const user = userEvent.setup()
    render(<AutoFormWorkbench jsonSchema={oneOfJsonSchema} uiSchema={oneOfUiSchema} />)

    const branchPicker = screen.getByRole('radiogroup', { name: 'oneOf branch: Contact form' })
    expect(within(branchPicker).getByRole('radio', { name: 'Email' })).toBeInTheDocument()
    expect(within(branchPicker).getByRole('radio', { name: 'Phone' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.queryByLabelText('Phone number')).not.toBeInTheDocument()

    await user.click(within(branchPicker).getByRole('radio', { name: 'Phone' }))

    expect(screen.getByLabelText('Phone number')).toBeInTheDocument()
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument()
  })

  it('switches nested oneOf preview branches', async () => {
    const user = userEvent.setup()
    render(<AutoFormWorkbench jsonSchema={nestedOneOfJsonSchema} uiSchema={nestedOneOfUiSchema} />)

    const branchPicker = screen.getByRole('radiogroup', { name: 'oneOf branch: Profile' })
    expect(within(branchPicker).getByRole('radio', { name: 'Person' })).toBeInTheDocument()
    expect(within(branchPicker).getByRole('radio', { name: 'Company' })).toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.queryByLabelText('Company name')).not.toBeInTheDocument()

    await user.click(within(branchPicker).getByRole('radio', { name: 'Company' }))

    expect(screen.getByLabelText('Company name')).toBeInTheDocument()
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument()
  })

  it(
    'discovers nested oneOf controls across schema maps and combinator branches',
    async () => {
      const user = userEvent.setup()
      render(<AutoFormWorkbench jsonSchema={branchTraversalJsonSchema} uiSchema={{}} />)

      expect(screen.getByRole('radiogroup', { name: 'oneOf branch: Pattern contact' })).toBeInTheDocument()
      expect(screen.getByRole('radiogroup', { name: 'oneOf branch: Additional property' })).toBeInTheDocument()
      expect(screen.getByRole('radiogroup', { name: 'oneOf branch: Dependent account type' })).toBeInTheDocument()
      expect(screen.getByRole('radiogroup', { name: 'oneOf branch: AnyOf branch' })).toBeInTheDocument()
      expect(screen.getByRole('radiogroup', { name: 'oneOf branch: AllOf branch' })).toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'Normalized' }))

      expect(screen.getByText('alpha')).toBeInTheDocument()
      expect(screen.queryByText('beta')).not.toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'Nested Beta' }))

      expect(screen.getByText('beta')).toBeInTheDocument()
      expect(screen.queryByText('alpha')).not.toBeInTheDocument()
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'keeps dotted schema-map keys distinct from nested property paths',
    async () => {
      const user = userEvent.setup()
      render(<AutoFormWorkbench jsonSchema={schemaPathCollisionJsonSchema} uiSchema={{}} />)

      const dottedDependency = screen.getByRole('radiogroup', { name: 'oneOf branch: Dotted dependency' })
      const nestedDependency = screen.getByRole('radiogroup', { name: 'oneOf branch: Nested dependency' })

      expect(within(dottedDependency).getByRole('radio', { name: 'Dotted string' })).toBeChecked()
      expect(within(nestedDependency).getByRole('radio', { name: 'Nested string' })).toBeChecked()

      await user.click(within(nestedDependency).getByRole('radio', { name: 'Nested boolean' }))

      expect(within(dottedDependency).getByRole('radio', { name: 'Dotted string' })).toBeChecked()
      expect(within(nestedDependency).getByRole('radio', { name: 'Nested boolean' })).toBeChecked()
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('maps schema normalization errors onto matching schema rows', () => {
    const { container } = render(<AutoFormWorkbench jsonSchema={invalidRefJsonSchema} uiSchema={{}} />)

    expect(screen.getByText('Normalization error')).toBeInTheDocument()
    expect(screen.getAllByText(/unresolved external \$ref/i).length).toBeGreaterThan(1)

    expect(container.querySelector('[data-has-issues="true"]')).toBeInTheDocument()
  })

  it('preserves external ref resolution errors in the workbench callout', () => {
    render(<AutoFormWorkbench jsonSchema={invalidRefJsonSchema} uiSchema={{}} externalSchemas={{}} />)

    expect(screen.getAllByText(/missing from externalSchemas registry/i).length).toBeGreaterThan(0)
  })

  it(
    'copies schema and ui schema JSON from the secondary header',
    async () => {
      const user = userEvent.setup()
      const writeText = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        ...navigator,
        clipboard: {
          writeText,
        },
      })

      render(<AutoFormWorkbench jsonSchema={jsonSchema} uiSchema={uiSchema} />)

      expect(screen.getByRole('button', { name: 'Copy schema JSON' })).not.toHaveAttribute('title')
      await user.click(screen.getByRole('button', { name: 'Copy schema JSON' }))
      expect(writeText).toHaveBeenCalledWith(JSON.stringify(jsonSchema, null, 2))
      expect(screen.getByRole('button', { name: 'Copy schema JSON' })).not.toHaveAttribute('title')

      await user.click(screen.getByRole('radio', { name: 'UI Schema' }))
      expect(screen.getByRole('button', { name: 'Copy UI schema JSON' })).not.toHaveAttribute('title')
      await user.click(screen.getByRole('button', { name: 'Copy UI schema JSON' }))
      expect(writeText).toHaveBeenLastCalledWith(JSON.stringify(uiSchema, null, 2))
      expect(screen.getByRole('button', { name: 'Copy UI schema JSON' })).not.toHaveAttribute('title')
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'labels the derived tab as normalized output',
    async () => {
      const user = userEvent.setup()
      render(<AutoFormWorkbench jsonSchema={jsonSchema} uiSchema={uiSchema} />)

      await user.click(screen.getByRole('radio', { name: 'Normalized' }))

      expect(screen.getByText('Normalized Model')).toBeInTheDocument()
      expect(screen.getByText('Review the derived normalized model used by the renderer.')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument()
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('renders schemas that resolve external refs from an explicit registry', () => {
    render(
      <AutoFormWorkbench
        jsonSchema={invalidRefJsonSchema}
        uiSchema={externalRefUiSchema}
        externalSchemas={externalRefSchemas}
      />,
    )

    expect(screen.getByRole('radio', { name: 'Normalized' })).toBeInTheDocument()
    expect(screen.queryByText('Normalization error')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Account ID')).toBeInTheDocument()
    expect(screen.getByLabelText('Display name')).toBeInTheDocument()
  })

  it(
    'resets the preview renderer when schema defaults change',
    () => {
      const { rerender } = render(<AutoFormWorkbench jsonSchema={oneOfJsonSchema} uiSchema={oneOfUiSchema} />)

      expect(screen.getByRole('combobox', { name: 'Preferred contact' })).toHaveTextContent('email')

      rerender(
        <AutoFormWorkbench
          jsonSchema={{
            ...oneOfJsonSchema,
            properties: {
              ...((oneOfJsonSchema.properties ?? {}) as Record<string, JsonValue>),
              contactMethod: {
                ...(((oneOfJsonSchema.properties ?? {}) as Record<string, JsonValue>).contactMethod as Record<
                  string,
                  JsonValue
                >),
                default: 'phone',
              },
            },
          }}
          uiSchema={oneOfUiSchema}
        />,
      )

      expect(screen.getByRole('combobox', { name: 'Preferred contact' })).toHaveTextContent('phone')
    },
    WORKBENCH_INTERACTION_TEST_TIMEOUT_MS,
  )
})
