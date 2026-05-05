import '@testing-library/jest-dom/vitest'
import {
  type AutoFormUiSchema,
  type FieldErrorMap,
  type JsonSchemaNode,
  normalizeJsonSchemaWithUiSchema,
} from '@incmix/core'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AutoFormModelRenderer } from './AutoFormModelRenderer'
import {
  autoFormBooleanInlineLabelClasses,
  autoFormBooleanTopLabelClasses,
  autoFormColumnSpanClasses,
  autoFormFieldWrapperLayoutClasses,
} from './AutoFormModelRenderer.css'

const TEST_TIMEOUT_MS = 30_000
const RICH_WIDGET_TEST_TIMEOUT_MS = 60_000

const jsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Create trip',
  required: ['country', 'startAt', 'travelClass'],
  properties: {
    traveler: {
      type: 'object',
      required: ['fullName', 'email'],
      properties: {
        fullName: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
      },
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    startAt: {
      type: 'string',
      format: 'date-time',
    },
    travelClass: {
      type: 'string',
      enum: ['economy', 'premium', 'business'],
      default: 'economy',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
    notes: {
      type: 'string',
    },
  },
}

const uiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'trip-details',
      title: 'Trip details',
      fields: ['traveler', 'country', 'startAt', 'travelClass', 'includeInsurance', 'notes'],
      columns: 2,
    },
  ],
  fields: {
    traveler: {
      label: 'Traveler information',
      colSpan: 2,
    },
    'traveler.fullName': {
      label: 'Full name',
      placeholder: 'Traveler full name',
    },
    'traveler.email': {
      label: 'Email address',
      placeholder: 'name@example.com',
    },
    country: {
      widget: 'country-picker',
      label: 'Destination country',
    },
    startAt: {
      widget: 'date-time-picker',
      label: 'Departure',
    },
    travelClass: {
      label: 'Travel class',
    },
    includeInsurance: {
      label: 'Include travel insurance',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      colSpan: 2,
    },
  },
}

const dateRulesJsonSchema: JsonSchemaNode = {
  type: 'object',
  required: ['birthDate', 'appointmentDate'],
  properties: {
    birthDate: {
      type: 'string',
      format: 'date',
      '$autoform:dateRules': {
        minAge: 18,
      },
    },
    appointmentDate: {
      type: 'string',
      format: 'date-time',
      '$autoform:dateRules': {
        mode: 'future',
      },
    },
  },
}

const dateRulesUiSchema: AutoFormUiSchema = {
  fields: {
    birthDate: {
      widget: 'date-picker',
      label: 'Birth date',
    },
    appointmentDate: {
      widget: 'date-time-picker',
      label: 'Appointment date',
    },
  },
}

const conditionalJsonSchema: JsonSchemaNode = {
  type: 'object',
  required: ['accountType'],
  properties: {
    accountType: {
      type: 'string',
      enum: ['individual', 'business'],
    },
    companyName: {
      type: 'string',
    },
    nickname: {
      type: 'string',
    },
    approvalCode: {
      type: 'string',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
  },
  if: {
    properties: {
      accountType: { const: 'business' },
    },
    required: ['accountType'],
  },
  // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
  then: {
    required: ['companyName'],
    properties: {
      companyName: {
        'ui:hidden': false,
      },
      nickname: {
        'ui:hidden': true,
      },
      approvalCode: {
        readOnly: true,
      },
      includeInsurance: {
        'ui:hidden': true,
      },
    },
  },
  else: {
    required: ['nickname'],
    properties: {
      companyName: {
        'ui:hidden': true,
      },
      nickname: {
        'ui:hidden': false,
      },
      approvalCode: {
        readOnly: false,
      },
      includeInsurance: {
        'ui:hidden': false,
      },
    },
  },
}

const conditionalUiSchema: AutoFormUiSchema = {
  fields: {
    accountType: {
      label: 'Account type',
    },
    companyName: {
      label: 'Company name',
    },
    nickname: {
      label: 'Nickname',
    },
    approvalCode: {
      label: 'Approval code',
    },
    includeInsurance: {
      label: 'Include insurance',
    },
  },
}

const dynamicConditionalJsonSchema: JsonSchemaNode = {
  type: 'object',
  required: ['accountType'],
  properties: {
    accountType: {
      type: 'string',
      enum: ['individual', 'business'],
    },
  },
  if: {
    properties: {
      accountType: { const: 'business' },
    },
    required: ['accountType'],
  },
  // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
  then: {
    required: ['vatId'],
    properties: {
      vatId: {
        type: 'string',
      },
    },
  },
  else: {
    properties: {
      nickname: {
        type: 'string',
      },
    },
  },
}

const dynamicConditionalUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'account',
      title: 'Account',
      fields: ['accountType', 'vatId', 'nickname'],
    },
  ],
  fields: {
    accountType: {
      label: 'Account type',
    },
    vatId: {
      label: 'VAT ID',
    },
    nickname: {
      label: 'Nickname',
    },
  },
}

const primitiveArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}

const primitiveArrayUiSchema: AutoFormUiSchema = {
  fields: {
    tags: {
      widget: 'repeater',
      label: 'Travel tags',
      help: 'Add lightweight labels for the itinerary.',
    },
  },
}

const constrainedArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      minItems: 1,
      maxItems: 2,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
}

const constrainedArrayUiSchema: AutoFormUiSchema = {
  fields: {
    dependents: {
      label: 'Dependents',
      help: 'Manage required household members.',
    },
    'dependents[*].name': {
      label: 'Name',
      placeholder: 'Dependent name',
    },
  },
}

const maxOnlyArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      maxItems: 2,
      items: {
        type: 'string',
      },
    },
  },
}

const maxOnlyArrayUiSchema: AutoFormUiSchema = {
  fields: {
    tags: {
      widget: 'repeater',
      label: 'Travel tags',
    },
  },
}

const paddedArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      minItems: 2,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
}

const paddedArrayUiSchema: AutoFormUiSchema = {
  fields: {
    dependents: {
      label: 'Dependents',
    },
    'dependents[*].name': {
      label: 'Name',
      placeholder: 'Dependent name',
    },
  },
}

const objectArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          relationship: {
            type: 'string',
          },
        },
      },
    },
  },
}

const objectArrayUiSchema: AutoFormUiSchema = {
  fields: {
    dependents: {
      label: 'Dependents',
      help: 'Repeat traveler details without hand-authoring each group.',
    },
    'dependents[*].name': {
      label: 'Name',
      placeholder: 'Dependent name',
    },
    'dependents[*].relationship': {
      label: 'Relationship',
      placeholder: 'Spouse, child, parent',
    },
  },
}

const nestedArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          pets: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}

const nestedArrayUiSchema: AutoFormUiSchema = {
  fields: {
    dependents: {
      label: 'Dependents',
    },
    'dependents[*].name': {
      label: 'Name',
    },
    'dependents[*].pets': {
      widget: 'repeater',
      label: 'Pets',
    },
  },
}

const dynamicObjectArrayJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        required: ['relationship'],
        properties: {
          relationship: {
            type: 'string',
            enum: ['individual', 'business'],
          },
        },
        if: {
          properties: {
            relationship: { const: 'business' },
          },
          required: ['relationship'],
        },
        // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
        then: {
          properties: {
            vatId: {
              type: 'string',
            },
          },
        },
        else: {
          properties: {
            nickname: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}

const dynamicObjectArrayUiSchema: AutoFormUiSchema = {
  fields: {
    dependents: {
      label: 'Dependents',
    },
    'dependents[*].relationship': {
      label: 'Relationship',
    },
    'dependents[*].vatId': {
      label: 'VAT ID',
    },
    'dependents[*].nickname': {
      label: 'Nickname',
    },
  },
}

const stepperJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Traveler onboarding',
  required: ['firstName', 'email', 'country', 'reviewAt'],
  properties: {
    firstName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    country: { type: 'string', enum: ['US', 'CA', 'MX'] },
    reviewAt: { type: 'string', format: 'date-time' },
  },
}

const stepperUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: ['firstName', 'email'],
    },
    {
      id: 'travel',
      title: 'Travel setup',
      fields: ['country', 'reviewAt'],
    },
  ],
  steps: [
    {
      id: 'profile-step',
      title: 'Profile',
      sections: ['profile'],
    },
    {
      id: 'travel-step',
      title: 'Travel setup',
      sections: ['travel'],
    },
  ],
  fields: {
    firstName: {
      label: 'First name',
    },
    email: {
      label: 'Email address',
    },
    country: {
      widget: 'country-picker',
      label: 'Destination country',
    },
    reviewAt: {
      widget: 'date-time-picker',
      label: 'Review date',
    },
  },
}

const richWidgetJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    comment: {
      type: 'string',
    },
    assignee: {
      type: 'string',
    },
    reviewers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}

const richWidgetUiSchema: AutoFormUiSchema = {
  fields: {
    comment: {
      widget: 'mention-textarea',
      label: 'Comment',
      placeholder: 'Type @ for people or # for tags',
      props: {
        triggers: [
          {
            trigger: '@',
            picker: 'avatar',
            avatarItems: [
              { id: 'ada', name: 'Ada Lovelace', description: 'ada@example.com' },
              { id: 'grace', name: 'Grace Hopper', description: 'grace@example.com' },
            ],
          },
          {
            trigger: '#',
            picker: 'multi-select',
            options: [
              { value: 'docs', label: 'Documentation' },
              { value: 'urgent', label: 'Urgent' },
            ],
            searchable: false,
          },
        ],
        toolbar: true,
        rows: 4,
      },
    },
    assignee: {
      widget: 'avatar-picker',
      label: 'Assignee',
      placeholder: 'Choose assignee',
      props: {
        items: [
          { id: 'ada', name: 'Ada Lovelace', description: 'ada@example.com' },
          { id: 'grace', name: 'Grace Hopper', description: 'grace@example.com' },
        ],
      },
    },
    reviewers: {
      widget: 'multi-select',
      label: 'Reviewers',
      placeholder: 'Select reviewers',
      props: {
        options: [
          { value: 'ada', label: 'Ada Lovelace' },
          { value: 'grace', label: 'Grace Hopper' },
          { value: 'lin', label: 'Linus Torvalds' },
        ],
        searchable: false,
      },
    },
  },
}

const treeLeafSelectJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    placement: {
      type: 'string',
    },
  },
}

const treeLeafSelectUiSchema: AutoFormUiSchema = {
  fields: {
    placement: {
      widget: 'tree-leaf-select',
      label: 'Catalog placement',
      props: {
        options: [
          {
            value: 'composites/local',
            label: 'Local',
            description: 'Reusable components owned by this app.',
          },
          {
            value: 'composites/forms',
            label: 'Forms',
            description: 'Input and submission-oriented components.',
          },
        ],
        pathSeparator: '/',
        expandAll: true,
      },
    },
  },
}

const fileUploadJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    attachments: {
      type: 'array',
      maxItems: 2,
      items: {
        type: 'string',
      },
    },
  },
}

const fileUploadUiSchema: AutoFormUiSchema = {
  fields: {
    attachments: {
      widget: 'file-upload',
      label: 'Attachments',
      help: 'Upload supporting images or PDFs.',
      props: {
        accept: {
          'image/*': ['.png', '.jpg'],
          'application/pdf': ['.pdf'],
        },
        variant: 'minimal',
        size: 'xs',
        radius: 'lg',
        showStatusSections: true,
      },
    },
  },
}

describe('AutoFormModelRenderer', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders sections and the supported native field slice', () => {
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByText('Trip details')).toBeInTheDocument()
    expect(screen.getByText('Traveler information')).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByText('Destination country')).toBeInTheDocument()
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('Departure')).toBeInTheDocument()
    expect(screen.getByText('Travel class')).toBeInTheDocument()
    expect(screen.getByLabelText('Include travel insurance')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
    expect(screen.getByText('economy')).toBeInTheDocument()
  })

  it(
    'renders richer widget controls and submits their value shapes',
    async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const model = normalizeJsonSchemaWithUiSchema(richWidgetJsonSchema, richWidgetUiSchema)

      render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

      const comment = screen.getByLabelText('Comment')
      await user.type(comment, '@')

      expect(await screen.findByText('AL')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add' })).toBeVisible()

      await user.click(screen.getByRole('option', { name: /Grace Hopper/i }))
      expect(screen.getByRole('button', { name: 'Add' })).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Add' }))
      expect(comment).toHaveValue('@Grace Hopper ')

      await user.type(comment, '#')
      await user.click(await screen.findByRole('option', { name: /Documentation/i }))
      await user.click(await screen.findByRole('button', { name: 'Add' }))
      expect(comment).toHaveValue('@Grace Hopper, #Documentation ')

      await user.click(screen.getByRole('tab', { name: 'Preview' }))
      const previewPanel = screen.getByRole('tabpanel')
      expect(screen.getByText('@Grace Hopper')).toBeInTheDocument()
      expect(screen.getByText('#Documentation')).toBeInTheDocument()
      expect(previewPanel.textContent).toContain(', ')
      expect(previewPanel).not.toHaveTextContent('user:grace')
      expect(previewPanel).not.toHaveTextContent('tag:docs')
      await user.hover(screen.getByText('GH'))
      expect(await screen.findByText('grace@example.com')).toBeInTheDocument()
      await user.click(screen.getByRole('tab', { name: 'Write' }))

      await user.click(screen.getByRole('button', { name: /Assignee/i }))
      await user.click(screen.getByRole('option', { name: /Grace Hopper/i }))

      await user.click(screen.getByRole('button', { name: /Reviewers/i }))
      await user.click(screen.getByRole('option', { name: /Ada Lovelace/i }))
      await user.click(screen.getByRole('option', { name: /Grace Hopper/i }))

      expect(screen.queryByRole('button', { name: 'Add Reviewers item' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0]?.[0]).toEqual({
        comment: '@[Grace Hopper](user:grace), #[Documentation](tag:docs) ',
        assignee: 'grace',
        reviewers: ['ada', 'grace'],
      })
    },
    RICH_WIDGET_TEST_TIMEOUT_MS,
  )

  it('keeps required semantics on mention textarea fields', () => {
    const model = normalizeJsonSchemaWithUiSchema(
      {
        ...richWidgetJsonSchema,
        required: ['comment'],
      },
      richWidgetUiSchema,
    )

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByLabelText('Comment')).toBeRequired()
  })

  it('renders tree leaf selector widgets and submits the selected leaf value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(treeLeafSelectJsonSchema, treeLeafSelectUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    expect(screen.getByText('Catalog placement')).toBeInTheDocument()
    expect(screen.getByText('Composites')).toBeInTheDocument()

    await user.click(screen.getByText('Forms'))
    expect(screen.getByText('Composites -> Forms')).toBeInTheDocument()
    expect(screen.getByText('Input and submission-oriented components.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      placement: 'composites/forms',
    })
  })

  it('does not pad multi-select arrays with hidden empty-string defaults', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        ...richWidgetJsonSchema,
        properties: {
          ...richWidgetJsonSchema.properties,
          reviewers: {
            type: 'array',
            minItems: 2,
            items: {
              type: 'string',
            },
          },
        },
      },
      richWidgetUiSchema,
    )

    render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    expect(screen.getByRole('button', { name: /Reviewers/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      reviewers: [],
    })
  })

  it('honors disabled inline action buttons', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        submitDisabled
        cancelDisabled
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    )

    const submit = screen.getByRole('button', { name: 'Submit' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    expect(submit).toBeDisabled()
    expect(cancel).toBeDisabled()

    submit.click()
    cancel.click()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls inline cancel when enabled', () => {
    const onCancel = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" onCancel={onCancel} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it(
    'guards inline cancel when the form is dirty',
    async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

      render(
        <AutoFormModelRenderer
          model={model}
          surface="inline"
          onCancel={onCancel}
          dirtyGuard={{
            description: 'Discard form changes?',
          }}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-04-20T10:00:00.000Z',
            travelClass: 'economy',
          }}
        />,
      )

      fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Grace Hopper' } })
      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('Discard form changes?')).toBeInTheDocument()
      expect(onCancel).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Keep editing' }))
      expect(onCancel).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Cancel' }))
      await user.click(screen.getByRole('button', { name: 'Abandon changes' }))

      expect(onCancel).toHaveBeenCalledTimes(1)
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'guards dialog close when the form is dirty',
    async () => {
      const user = userEvent.setup()
      const model = normalizeJsonSchemaWithUiSchema(
        {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: {
              type: 'string',
              title: 'Full name',
            },
          },
        },
        {
          wrapper: 'dialog',
          fields: {
            fullName: {
              label: 'Full name',
            },
          },
        },
      )

      render(
        <AutoFormModelRenderer
          model={model}
          surface="auto"
          trigger={<button type="button">Open trip form</button>}
          dirtyGuard={{
            description: context =>
              context?.action === 'close' ? 'Discard changes and close the form?' : 'Discard changes?',
          }}
          defaultValues={{
            fullName: 'Ada Lovelace',
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Open trip form' }))
      const fullNameInput = await screen.findByLabelText('Full name')
      await user.clear(fullNameInput)
      await user.type(fullNameInput, 'Grace Hopper')
      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('Discard changes and close the form?')).toBeInTheDocument()
      expect(screen.getByLabelText('Full name')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Keep editing' }))
      expect(screen.getByLabelText('Full name')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Close' }))
      await user.click(screen.getByRole('button', { name: 'Abandon changes' }))

      await waitFor(() => {
        expect(screen.queryByLabelText('Full name')).not.toBeInTheDocument()
      })
    },
    TEST_TIMEOUT_MS,
  )

  it('renders inline actions through the action slot', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{
          traveler: {
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
          },
          country: 'US',
          startAt: '2026-04-20T10:00:00.000Z',
          travelClass: 'economy',
        }}
        renderActions={actions => <div data-testid="autoform-action-slot">{actions}</div>}
      />,
    )

    const actionSlot = screen.getByTestId('autoform-action-slot')
    expect(actionSlot).toContainElement(screen.getByRole('button', { name: 'Submit' }))
    expect(actionSlot).toContainElement(screen.getByRole('button', { name: 'Cancel' }))

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('validates button-mode submits before calling submit handlers', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        submitMode="button"
        validationSchema={jsonSchema}
        onSubmit={onSubmit}
        defaultValues={{
          traveler: {
            fullName: '',
            email: 'not-an-email',
          },
          country: '',
          startAt: '',
          travelClass: '',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText(/must match format "email"/i)).toBeInTheDocument()
  })

  it('prevents rapid double submit in button mode', async () => {
    let resolveSubmit: (() => void) | undefined
    const onSubmit = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveSubmit = resolve
        }),
    )
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        submitMode="button"
        validationSchema={jsonSchema}
        onSubmit={onSubmit}
        defaultValues={{
          traveler: {
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
          },
          country: 'US',
          startAt: '2026-04-20T10:00:00.000Z',
          travelClass: 'economy',
        }}
      />,
    )

    const submit = screen.getByRole('button', { name: 'Submit' })

    fireEvent.click(submit)
    fireEvent.click(submit)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()

    resolveSubmit?.()
    await waitFor(() => expect(submit).not.toBeDisabled())
  })

  it('renders file-upload widgets for array fields and submits UploadedFile[] values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(fileUploadJsonSchema, fileUploadUiSchema)

    const { container } = render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    expect(screen.getByRole('button', { name: /Attachments/i })).toBeInTheDocument()
    expect(screen.getByText('Drag & drop files here, or click to select')).toHaveClass(
      'text-[length:var(--file-upload-title-font-size)]',
    )

    const dropzone = container.querySelector('[data-slot="file-upload-dropzone"]') as HTMLDivElement | null
    expect(dropzone).toBeTruthy()
    expect(dropzone?.style.getPropertyValue('--element-border-radius')).toBe('0.5rem')
    expect(dropzone?.style.getPropertyValue('--file-upload-title-font-size')).toBeTruthy()

    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null
    expect(input).toBeTruthy()
    if (!input) {
      throw new Error('Expected file input to be rendered')
    }

    const file = new File(['release-notes'], 'release-notes.pdf', { type: 'application/pdf' })
    await user.upload(input, file)

    expect(screen.getByText('Uploading (1)')).toBeInTheDocument()
    expect(screen.getByText('release-notes.pdf')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      attachments: [
        expect.objectContaining({
          id: expect.any(String),
          file,
          progress: 0,
          status: 'pending',
        }),
      ],
    })
  })

  it('submits normalized defaults and inline edits', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        defaultValues={{
          traveler: {
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
          },
          country: 'US',
          startAt: '2026-03-20T10:00:00.000Z',
        }}
      />,
    )

    await user.type(screen.getByLabelText('Notes'), 'Window seat if available')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        traveler: {
          fullName: 'Ada Lovelace',
          email: 'ada@example.com',
        },
        country: 'US',
        startAt: '2026-03-20T10:00:00.000Z',
        travelClass: 'economy',
        includeInsurance: false,
        notes: 'Window seat if available',
      }),
    )
  }, 10000)

  it('blocks submit and shows validation errors when the schema is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={jsonSchema}
        onSubmit={onSubmit}
        defaultValues={{
          traveler: {
            fullName: '',
            email: 'not-an-email',
          },
          country: '',
          startAt: '',
          travelClass: '',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText(/must match format "email"/i)).toBeInTheDocument()
  })

  it(
    'shows submitting state for async submit handlers',
    async () => {
      const user = userEvent.setup()
      let resolveSubmit: (() => void) | undefined
      const onSubmit = vi.fn(
        () =>
          new Promise<void>(resolve => {
            resolveSubmit = resolve
          }),
      )
      const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

      render(
        <AutoFormModelRenderer
          model={model}
          surface="inline"
          validationSchema={jsonSchema}
          onSubmit={onSubmit}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-03-20T10:00:00.000Z',
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()

      resolveSubmit?.()

      await screen.findByRole('button', { name: 'Submit' })
    },
    TEST_TIMEOUT_MS,
  )

  it('renders server field and form errors returned during submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(async (_values, helpers) => {
      helpers.setServerErrors(
        {
          'traveler.email': ['Email already exists'],
        },
        ['Unable to create trip'],
      )
    })
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={jsonSchema}
        onSubmit={onSubmit}
        defaultValues={{
          traveler: {
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
          },
          country: 'US',
          startAt: '2026-03-20T10:00:00.000Z',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Email already exists')).toBeInTheDocument()
    expect(screen.getByText('Unable to create trip')).toBeInTheDocument()
    expect(screen.getByText('Form errors')).toBeInTheDocument()
  })

  it('clears server field errors when the field value changes', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={jsonSchema}
        onSubmit={async (_values, helpers) => {
          helpers.setServerErrors({
            'traveler.email': ['Email already exists'],
          })
        }}
        defaultValues={{
          traveler: {
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
          },
          country: 'US',
          startAt: '2026-03-20T10:00:00.000Z',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Email already exists')).toBeInTheDocument()

    const emailField = screen.getByLabelText('Email address')
    await user.type(emailField, '.updated')

    expect(screen.queryByText('Email already exists')).not.toBeInTheDocument()
  })

  it(
    'does not promote unrelated server errors into validation state during field revalidation',
    async () => {
      const user = userEvent.setup()
      let submitCount = 0
      const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

      render(
        <AutoFormModelRenderer
          model={model}
          surface="inline"
          validationSchema={jsonSchema}
          onSubmit={async (_values, helpers) => {
            submitCount += 1
            if (submitCount === 1) {
              helpers.setServerErrors({
                notes: ['Notes are unavailable'],
                'traveler.email': ['Email already exists'],
              })
            }
          }}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-03-20T10:00:00.000Z',
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(await screen.findByText('Notes are unavailable')).toBeInTheDocument()
      expect(screen.getByText('Email already exists')).toBeInTheDocument()

      const notesField = screen.getByLabelText('Notes')
      await user.type(notesField, 'Updated notes')

      await waitFor(() => {
        expect(screen.queryByText('Notes are unavailable')).not.toBeInTheDocument()
      })
      expect(screen.getByText('Email already exists')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(screen.queryByText('Email already exists')).not.toBeInTheDocument()
      })
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'does not close dialog forms when submit ends with server errors',
    async () => {
      const user = userEvent.setup()
      const model = normalizeJsonSchemaWithUiSchema(jsonSchema, {
        ...uiSchema,
        wrapper: 'dialog',
      })

      render(
        <AutoFormModelRenderer
          model={model}
          surface="auto"
          trigger={<button type="button">Open trip form</button>}
          closeOnSubmit
          validationSchema={jsonSchema}
          onSubmit={async (_values, helpers) => {
            helpers.setFormErrors(['Trip could not be created'])
          }}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-03-20T10:00:00.000Z',
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Open trip form' }))
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(await screen.findByText('Trip could not be created')).toBeInTheDocument()
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )

  it('applies first-class date rules during submit validation', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(dateRulesJsonSchema, dateRulesUiSchema)
    const now = new Date()
    const underageYear = now.getFullYear() - 10
    const adultYear = now.getFullYear() - 30
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const underageBirthDate = `${underageYear}${today.slice(4)}`
    const adultBirthDate = `${adultYear}${today.slice(4)}`
    const pastDateTime = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
    const futureDateTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString()

    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dateRulesJsonSchema}
        onSubmit={onSubmit}
        values={{
          birthDate: underageBirthDate,
          appointmentDate: pastDateTime,
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText('Must be at least 18 years old.')).toBeInTheDocument()
    expect(screen.getByText('Date and time must be in the future.')).toBeInTheDocument()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dateRulesJsonSchema}
        onSubmit={onSubmit}
        values={{
          birthDate: adultBirthDate,
          appointmentDate: futureDateTime,
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      birthDate: adultBirthDate,
      appointmentDate: futureDateTime,
    })
  })

  it('clears controlled custom validation errors when the field value changes', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        type: 'object',
        required: ['jsxName'],
        properties: {
          jsxName: {
            type: 'string',
            title: 'JSX name',
          },
        },
      },
      {
        fields: {
          jsxName: {
            label: 'JSX name',
          },
        },
      },
    )

    function ControlledForm() {
      const [values, setValues] = React.useState({ jsxName: 'DuplicateName' })
      return (
        <AutoFormModelRenderer
          model={model}
          surface="inline"
          values={values}
          onValuesChange={nextValues => setValues(nextValues as { jsxName: string })}
          customValidate={(nextValues): FieldErrorMap =>
            nextValues.jsxName === 'DuplicateName'
              ? {
                  jsxName: ['A component with name DuplicateName already exists.'],
                }
              : {}
          }
        />
      )
    }

    render(<ControlledForm />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('A component with name DuplicateName already exists.')).toBeInTheDocument()

    await user.clear(screen.getByRole('textbox', { name: 'JSX name' }))
    await user.type(screen.getByRole('textbox', { name: 'JSX name' }), 'UniqueName')

    await waitFor(() => {
      expect(screen.queryByText('A component with name DuplicateName already exists.')).not.toBeInTheDocument()
    })
  })

  it('applies runtime visibility, readOnly, and disabled overrides from active conditions', () => {
    const model = normalizeJsonSchemaWithUiSchema(conditionalJsonSchema, conditionalUiSchema)
    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        values={{
          accountType: 'individual',
          companyName: '',
          nickname: 'Ada',
          approvalCode: 'A-100',
          includeInsurance: false,
        }}
      />,
    )

    expect(screen.getByLabelText('Account type')).toBeInTheDocument()
    expect(screen.queryByLabelText('Company name')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
    expect(screen.getByLabelText('Approval code')).not.toHaveAttribute('readonly')
    expect(screen.getByLabelText('Include insurance')).toBeEnabled()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        values={{
          accountType: 'business',
          companyName: 'Acme Inc.',
          nickname: '',
          approvalCode: 'B-200',
          includeInsurance: false,
        }}
      />,
    )

    expect(screen.getByLabelText('Company name')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nickname')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Approval code')).toHaveAttribute('readonly')
    expect(screen.queryByLabelText('Include insurance')).not.toBeInTheDocument()
  })

  it('materializes branch-only conditional fields into their configured section', () => {
    const model = normalizeJsonSchemaWithUiSchema(dynamicConditionalJsonSchema, dynamicConditionalUiSchema)
    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        values={{
          accountType: 'individual',
          nickname: 'Ada',
        }}
      />,
    )

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
    expect(screen.queryByLabelText('VAT ID')).not.toBeInTheDocument()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        values={{
          accountType: 'business',
          vatId: 'EU-1',
        }}
      />,
    )

    expect(screen.getByLabelText('VAT ID')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nickname')).not.toBeInTheDocument()
  })

  it('submits only active branch-only values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(dynamicConditionalJsonSchema, dynamicConditionalUiSchema)

    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        onSubmit={onSubmit}
        values={{
          accountType: 'business',
          vatId: 'EU-42',
          nickname: 'should-not-submit',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      accountType: 'business',
      vatId: 'EU-42',
    })

    onSubmit.mockClear()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        onSubmit={onSubmit}
        values={{
          accountType: 'individual',
          vatId: 'stale-business-value',
          nickname: 'Ada',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      accountType: 'individual',
      nickname: 'Ada',
    })
  })

  it('shows and clears validation errors as dynamic branches activate and deactivate', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(dynamicConditionalJsonSchema, dynamicConditionalUiSchema)
    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        values={{
          accountType: 'business',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText(/must have required property 'vatId'/i)).toBeInTheDocument()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={dynamicConditionalJsonSchema}
        values={{
          accountType: 'individual',
          nickname: 'Ada',
        }}
      />,
    )

    expect(screen.queryByText(/must have required property 'vatId'/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
  })

  it('applies responsive colSpan classes from the normalized model', () => {
    const responsiveUiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'trip-details',
          title: 'Trip details',
          fields: ['traveler', 'country', 'startAt', 'travelClass', 'includeInsurance', 'notes'],
          columns: { base: 1, md: 2 },
        },
      ],
      fields: {
        ...uiSchema.fields,
        notes: {
          widget: 'textarea',
          label: 'Notes',
          colSpan: { base: 1, md: 2 },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, responsiveUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    const notes = screen.getByLabelText('Notes')
    const wrapper = notes.closest(`.${autoFormColumnSpanClasses.md['2']}`)
    expect(wrapper).not.toBeNull()
  })

  it('applies responsive horizontal section layout classes from the normalized model', () => {
    const responsiveUiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'trip-details',
          title: 'Trip details',
          fields: ['country', 'startAt'],
          columns: { base: 1, md: 2 },
          layout: { base: 'stacked', lg: 'horizontal' },
          labelPlacement: { base: 'top', lg: 'start' },
        },
      ],
      fields: {
        country: {
          widget: 'country-picker',
          label: 'Destination country',
        },
        startAt: {
          widget: 'date-time-picker',
          label: 'Departure',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, responsiveUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    const departure = screen.getByText('Departure').closest(`.${autoFormFieldWrapperLayoutClasses.lg.horizontal}`)
    expect(departure).not.toBeNull()
  })

  it('allows boolean fields to opt into stacked layout', () => {
    const stackedBooleanUiSchema: AutoFormUiSchema = {
      fields: {
        includeInsurance: {
          label: 'Include travel insurance',
          layout: 'stacked',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, stackedBooleanUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    const checkbox = screen.getByRole('checkbox')
    const wrapper = checkbox.closest('.space-y-2')
    const topLabelSlot = wrapper?.querySelector(`.${autoFormBooleanTopLabelClasses.initial.stacked}`)
    const inlineLabel = wrapper?.querySelector(`.${autoFormBooleanInlineLabelClasses.initial.stacked}`)

    expect(wrapper).not.toBeNull()
    expect(topLabelSlot).not.toBeNull()
    expect(topLabelSlot).toHaveTextContent('Include travel insurance')
    expect(inlineLabel).toHaveTextContent('Include travel insurance')
  })

  it('renders primitive array repeaters with add and remove controls', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(primitiveArrayJsonSchema, primitiveArrayUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByText('No travel tag added yet.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Travel tag item' }))

    const firstTag = screen.getByLabelText('Travel tags 1')
    expect(firstTag).toBeInTheDocument()

    await user.type(firstTag, 'passport')
    expect(firstTag).toHaveValue('passport')

    await user.click(screen.getByRole('button', { name: 'Remove Travel tags 1' }))

    expect(screen.queryByLabelText('Travel tags 1')).not.toBeInTheDocument()
    expect(screen.getByText('No travel tag added yet.')).toBeInTheDocument()
  })

  it('renders plain string arrays as creatable tag inputs', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(primitiveArrayJsonSchema, {
      fields: {
        tags: {
          label: 'Travel tags',
          placeholder: 'Add tags',
        },
      },
    })

    render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    expect(screen.queryByRole('button', { name: 'Add Travel tag item' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Travel tags/i }))
    await user.type(screen.getByRole('searchbox', { name: 'Search...' }), 'passport')
    await user.click(screen.getByRole('button', { name: 'Create "passport"' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      tags: ['passport'],
    })
  })

  it('enforces repeater minItems and maxItems controls', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(constrainedArrayJsonSchema, constrainedArrayUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByText('Requires 1-2 items; currently 1.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: 'Add Dependent item' })
    const removeFirstButton = screen.getByRole('button', { name: 'Remove Dependents 1' })

    expect(addButton).toBeEnabled()
    expect(removeFirstButton).toBeDisabled()

    await user.click(addButton)

    expect(await screen.findByText('Requires 1-2 items; currently 2.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Dependent item' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove Dependents 1' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Remove Dependents 2' })).toBeEnabled()
  })

  it('shows a max-only repeater hint and disables add at the limit', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(maxOnlyArrayJsonSchema, maxOnlyArrayUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByText('Maximum 2 items; currently 0.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Travel tag item' }))
    expect(await screen.findByText('Maximum 2 items; currently 1.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Travel tag item' }))
    expect(await screen.findByText('Maximum 2 items; currently 2.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Travel tag item' })).toBeDisabled()
  })

  it('pads repeater rows up to minItems on initial render', () => {
    const model = normalizeJsonSchemaWithUiSchema(paddedArrayJsonSchema, paddedArrayUiSchema)

    render(<AutoFormModelRenderer model={model} surface="inline" />)

    expect(screen.getByRole('button', { name: 'Remove Dependents 1' })).toBeInTheDocument()
    expect(screen.getAllByLabelText('Name')).toHaveLength(2)
    expect(screen.queryByText('No dependent added yet.')).not.toBeInTheDocument()
  })

  it('preserves existing repeater rows while padding up to minItems', () => {
    const model = normalizeJsonSchemaWithUiSchema(paddedArrayJsonSchema, paddedArrayUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        defaultValues={{
          dependents: [{ name: 'Ada' }],
        }}
      />,
    )

    const nameInputs = screen.getAllByLabelText('Name')
    expect(nameInputs).toHaveLength(2)
    expect(nameInputs[0]).toHaveValue('Ada')
    expect(nameInputs[1]).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Remove Dependents 1' })).toBeDisabled()
  })

  it(
    'submits object array repeater values with indexed paths',
    async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const model = normalizeJsonSchemaWithUiSchema(objectArrayJsonSchema, objectArrayUiSchema)

      render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

      await user.click(screen.getByRole('button', { name: 'Add Dependent item' }))
      await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
      await user.type(screen.getByLabelText('Relationship'), 'Spouse')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit.mock.calls[0]?.[0]).toEqual({
        dependents: [
          {
            name: 'Ada Lovelace',
            relationship: 'Spouse',
          },
        ],
      })
    },
    TEST_TIMEOUT_MS,
  )

  it('reorders object array repeater values before submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(objectArrayJsonSchema, objectArrayUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        defaultValues={{
          dependents: [
            { name: 'Ada Lovelace', relationship: 'Spouse' },
            { name: 'Grace Hopper', relationship: 'Parent' },
          ],
        }}
      />,
    )

    const firstMoveDown = screen.getByRole('button', { name: 'Move Dependents 1 down' })
    const secondMoveUp = screen.getByRole('button', { name: 'Move Dependents 2 up' })

    expect(screen.getByRole('button', { name: 'Move Dependents 1 up' })).toBeDisabled()
    expect(firstMoveDown).toBeEnabled()
    expect(secondMoveUp).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Move Dependents 2 down' })).toBeDisabled()

    await user.click(firstMoveDown)
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      dependents: [
        {
          name: 'Grace Hopper',
          relationship: 'Parent',
        },
        {
          name: 'Ada Lovelace',
          relationship: 'Spouse',
        },
      ],
    })
  })

  it('duplicates repeater rows and preserves their values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(objectArrayJsonSchema, objectArrayUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        defaultValues={{
          dependents: [{ name: 'Ada Lovelace', relationship: 'Spouse' }],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Duplicate Dependents 1' }))
    const nameInputs = screen.getAllByLabelText('Name')
    await user.clear(nameInputs[1] as HTMLInputElement)
    await user.type(nameInputs[1] as HTMLInputElement, 'Grace Hopper')
    expect(nameInputs[0]).toHaveValue('Ada Lovelace')
    expect(nameInputs[1]).toHaveValue('Grace Hopper')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      dependents: [
        {
          name: 'Ada Lovelace',
          relationship: 'Spouse',
        },
        {
          name: 'Grace Hopper',
          relationship: 'Spouse',
        },
      ],
    })
  })

  it('shows item summaries in repeater row headings when values are present', () => {
    const model = normalizeJsonSchemaWithUiSchema(objectArrayJsonSchema, objectArrayUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        defaultValues={{
          dependents: [{ name: 'Ada Lovelace', relationship: 'Spouse' }],
        }}
      />,
    )

    expect(screen.getByText('Dependents 1 · Ada Lovelace')).toBeInTheDocument()
  })

  it(
    'preserves outer indices for nested array repeaters',
    async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const model = normalizeJsonSchemaWithUiSchema(nestedArrayJsonSchema, nestedArrayUiSchema)

      render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

      await user.click(screen.getByRole('button', { name: 'Add Dependent item' }))
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } })
      await user.click(screen.getByRole('button', { name: 'Add Pet item' }))
      fireEvent.change(screen.getByLabelText('Pets 1'), { target: { value: 'Poppy' } })
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit.mock.calls[0]?.[0]).toEqual({
        dependents: [
          {
            name: 'Ada',
            pets: ['Poppy'],
          },
        ],
      })
    },
    TEST_TIMEOUT_MS,
  )

  it('materializes active branch-only fields inside object array repeaters', () => {
    const model = normalizeJsonSchemaWithUiSchema(dynamicObjectArrayJsonSchema, dynamicObjectArrayUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        values={{
          dependents: [
            {
              relationship: 'business',
              vatId: 'EU-42',
            },
          ],
        }}
      />,
    )

    expect(screen.getByLabelText('Relationship')).toBeInTheDocument()
    expect(screen.getByLabelText('VAT ID')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nickname')).not.toBeInTheDocument()
  })

  it('submits only active branch-only values inside object array repeaters', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(dynamicObjectArrayJsonSchema, dynamicObjectArrayUiSchema)

    const { rerender } = render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        values={{
          dependents: [
            {
              relationship: 'business',
              vatId: 'EU-42',
              nickname: 'should-not-submit',
            },
          ],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      dependents: [
        {
          relationship: 'business',
          vatId: 'EU-42',
        },
      ],
    })

    onSubmit.mockClear()

    rerender(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        onSubmit={onSubmit}
        values={{
          dependents: [
            {
              relationship: 'individual',
              vatId: 'stale-business-value',
              nickname: 'Ada',
            },
          ],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      dependents: [
        {
          relationship: 'individual',
          nickname: 'Ada',
        },
      ],
    })
  })

  it('renders section-based steps and blocks next until the current step validates', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(stepperJsonSchema, stepperUiSchema)

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={stepperJsonSchema}
        defaultValues={{
          firstName: '',
          email: 'invalid-email',
          country: 'US',
          reviewAt: '2026-03-20T10:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByRole('tab', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.queryByText('Travel setup')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(await screen.findByText(/must match format "email"/i)).toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.queryByLabelText('Review date')).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Email address'))
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com')
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByLabelText('Review date')).toBeInTheDocument()
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument()
  })

  it('renders number-input controls by default for numeric fields', async () => {
    const user = userEvent.setup()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        type: 'object',
        properties: {
          guests: {
            type: 'integer',
          },
        },
      },
      {
        fields: {
          guests: {
            label: 'Guests',
            props: {
              variant: 'icon',
              min: 1,
              max: 4,
              step: 1,
              allowDecimal: false,
              iconButton: {
                variant: 'ghost',
                color: 'slate',
              },
            },
          },
        },
      },
    )

    render(<AutoFormModelRenderer model={model} surface="inline" defaultValues={{ guests: 2 }} />)

    await user.click(screen.getByRole('button', { name: /increase value/i }))

    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })

  it('renders time format fields with TimePickerNext', async () => {
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        type: 'object',
        properties: {
          startTime: {
            type: 'string',
            format: 'time',
          },
        },
      },
      {
        fields: {
          startTime: {
            label: 'Start time',
            props: {
              showSeconds: true,
            },
          },
        },
      },
    )

    render(
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        defaultValues={{ startTime: '09:30:15' }}
        onSubmit={onSubmit}
      />,
    )

    expect(screen.getByRole('button', { name: 'Start time' })).toHaveTextContent('09:30:15')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      startTime: '09:30:15',
    })
  })

  it('renders combobox widgets and submits the selected value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        type: 'object',
        properties: {
          reviewer: {
            type: 'string',
            enum: ['ada', 'grace'],
          },
        },
      },
      {
        fields: {
          reviewer: {
            widget: 'autocomplete',
            label: 'Reviewer',
            props: {
              options: [
                { value: 'ada', label: 'Ada Lovelace' },
                { value: 'grace', label: 'Grace Hopper' },
              ],
            },
          },
        },
      },
    )

    render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    await user.click(screen.getByRole('combobox', { name: 'Reviewer' }))
    await user.click(screen.getByRole('option', { name: 'Grace Hopper' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      reviewer: 'grace',
    })
  })

  it('supports keyboard navigation for combobox widgets', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const model = normalizeJsonSchemaWithUiSchema(
      {
        type: 'object',
        properties: {
          reviewer: {
            type: 'string',
            enum: ['ada', 'grace'],
          },
        },
      },
      {
        fields: {
          reviewer: {
            widget: 'autocomplete',
            label: 'Reviewer',
            props: {
              options: [
                { value: 'ada', label: 'Ada Lovelace' },
                { value: 'grace', label: 'Grace Hopper' },
              ],
            },
          },
        },
      },
    )

    render(<AutoFormModelRenderer model={model} surface="inline" onSubmit={onSubmit} />)

    const combobox = screen.getByRole('combobox', { name: 'Reviewer' })
    await user.click(combobox)
    await user.keyboard('{ArrowDown}')

    const activeDescendantId = combobox.getAttribute('aria-activedescendant')
    expect(activeDescendantId).toBeTruthy()
    expect(document.getElementById(activeDescendantId ?? '')).toHaveTextContent('Grace Hopper')

    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      reviewer: 'grace',
    })
  })
})
