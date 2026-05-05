import type {
  AutoFormNormalizedArrayNode,
  AutoFormNormalizedFieldNode,
  AutoFormNormalizedModel,
  AutoFormNormalizedObjectGroupNode,
  AutoFormNormalizedSection,
} from '@incmix/core'
import { describe, expect, it } from 'vitest'
import { adaptAutoFormModelToDialogWrapper } from './dialog-wrapper-adapter'
import { dialogWrapperAdapterWidgets } from './dialog-wrapper-adapter.props'

function createField(overrides: Partial<AutoFormNormalizedFieldNode> = {}): AutoFormNormalizedFieldNode {
  return {
    kind: 'field',
    key: 'email',
    path: 'email',
    required: true,
    fieldType: 'string',
    label: 'Email address',
    title: 'Email address',
    description: 'Used for notifications.',
    help: 'We will only use this for account updates.',
    placeholder: 'ada@example.com',
    ui: {},
    hints: {},
    conditions: [],
    ...overrides,
  }
}

function createSection(
  nodes: Array<AutoFormNormalizedFieldNode | AutoFormNormalizedArrayNode | AutoFormNormalizedObjectGroupNode>,
): AutoFormNormalizedSection {
  return {
    kind: 'section',
    id: 'account',
    title: 'Account',
    nodes,
  }
}

function createModel(
  nodes: AutoFormNormalizedModel['nodes'],
  overrides: Partial<AutoFormNormalizedModel> = {},
): AutoFormNormalizedModel {
  return {
    kind: 'form-model',
    title: 'Create account',
    description: 'Wrapper parity test model.',
    wrapper: 'dialog',
    conditions: [],
    dynamicBranches: [],
    nodes,
    ...overrides,
  }
}

describe('adaptAutoFormModelToDialogWrapper', () => {
  it('preserves basic field metadata from the normalized model', () => {
    const emailField = createField({
      format: 'email',
      enumValues: ['ada@example.com', 'grace@example.com'],
      defaultValue: 'ada@example.com',
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([emailField])]))

    expect(result.schema.title).toBe('Create account')
    expect(result.schema.description).toBe('Wrapper parity test model.')
    expect(result.schema.required).toEqual(['email'])
    expect(result.schema.properties.email).toEqual({
      type: 'string',
      title: 'Email address',
      description: 'We will only use this for account updates.',
      default: 'ada@example.com',
      enum: ['ada@example.com', 'grace@example.com'],
      format: 'email',
      placeholder: 'ada@example.com',
    })
  })

  it('preserves normalized email and url field formats', () => {
    const emailField = createField({
      key: 'email',
      path: 'email',
      fieldType: 'email',
      format: 'email',
    })
    const websiteField = createField({
      key: 'website',
      path: 'website',
      fieldType: 'url',
      format: 'uri',
      label: 'Website',
      title: 'Website',
      required: false,
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([emailField, websiteField])]))

    expect(result.schema.properties.email?.format).toBe('email')
    expect(result.schema.properties.website?.format).toBe('url')
  })

  it('reports flattened sections, ignored steps, and unsupported node kinds', () => {
    const arrayNode: AutoFormNormalizedArrayNode = {
      kind: 'array',
      key: 'attachments',
      path: 'attachments',
      required: false,
      label: 'Attachments',
      title: 'Attachments',
      ui: {},
      hints: {},
      conditions: [],
      mode: 'repeater',
      itemNode: createField({ key: 'attachment', path: 'attachments.0', required: false }),
    }

    const objectGroupNode: AutoFormNormalizedObjectGroupNode = {
      kind: 'object-group',
      key: 'address',
      path: 'address',
      required: false,
      label: 'Address',
      title: 'Address',
      ui: {},
      hints: {},
      conditions: [],
      nodes: [createField({ key: 'city', path: 'address.city', required: false })],
    }

    const model = createModel([createSection([createField(), arrayNode, objectGroupNode])], {
      steps: [{ id: 'account-step', title: 'Account', sectionIds: ['account'] }],
      conditions: [
        {
          kind: 'condition',
          id: 'condition-1',
          key: 'condition-1',
          path: '',
          ui: {},
          hints: {},
          when: {},
          combinators: {},
        },
      ],
      dynamicBranches: [
        {
          id: 'branch-1',
          conditionId: 'condition-1',
          basePath: '',
          nodes: [createField({ key: 'nickname', path: 'nickname', required: false })],
        },
      ],
    })

    const result = adaptAutoFormModelToDialogWrapper(model)

    expect(result.issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining([
        'sections_flattened',
        'steps_ignored',
        'conditions_ignored',
        'dynamic_branches_ignored',
        'arrays_unsupported',
        'object_groups_unsupported',
      ]),
    )
  })

  it('reports ignored section and field layout metadata', () => {
    const layoutField = createField({
      key: 'notes',
      path: 'notes',
      label: undefined,
      title: 'Notes',
      colSpan: { md: 2 },
    })
    const layoutSection = createSection([layoutField])
    layoutSection.columns = { md: 2 }

    const result = adaptAutoFormModelToDialogWrapper(createModel([layoutSection]))

    expect(result.schema.properties.notes.title).toBe('Notes')
    expect(result.issues.map(issue => issue.code)).toEqual(expect.arrayContaining(['layout_ignored']))
    expect(result.issues.map(issue => issue.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('section layout metadata'),
        expect.stringContaining('field "notes"'),
      ]),
    )
  })

  it('marks rich widgets and date widgets as downgraded', () => {
    const richField = createField({
      key: 'comment',
      path: 'comment',
      widget: 'mention-textarea',
    })
    const dateField = createField({
      key: 'reviewAt',
      path: 'reviewAt',
      format: 'date-time',
      widget: 'date-time-picker',
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([richField, dateField])]))

    expect(result.schema.properties.comment.description).toContain('Preferred widget: mention-textarea')
    expect(result.issues.map(issue => issue.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('mention-textarea'),
        expect.stringContaining('date-specific widget behavior'),
      ]),
    )
  })

  it('maps native password widgets through schema format', () => {
    const passwordField = createField({
      key: 'password',
      path: 'password',
      widget: dialogWrapperAdapterWidgets.password,
      format: undefined,
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([passwordField])]))

    expect(result.schema.properties.password.format).toBe('password')
    expect(result.issues.map(issue => issue.code)).not.toContain('widget_downgraded')
  })

  it('preserves number-input widgets and their props for dialog wrapper rendering', () => {
    const numberInputField = createField({
      key: 'guests',
      path: 'guests',
      fieldType: 'integer',
      label: 'Guests',
      title: 'Guests',
      widget: 'number-input',
      props: {
        variant: 'button',
        min: 1,
        max: 6,
        step: 1,
        allowDecimal: false,
        iconButton: {
          variant: 'ghost',
          color: 'slate',
        },
      },
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([numberInputField])]))

    expect(result.schema.properties.guests.widget).toBe('number-input')
    expect(result.schema.properties.guests.widgetProps).toEqual(numberInputField.props)
    expect(result.issues.map(issue => issue.code)).not.toContain('widget_downgraded')
  })

  it('omits empty required arrays from the adapted schema', () => {
    const optionalField = createField({
      key: 'nickname',
      path: 'nickname',
      required: false,
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([optionalField])]))

    expect(result.schema.required).toBeUndefined()
  })

  it('reports non-string enum values as unsupported', () => {
    const priorityField = createField({
      key: 'priority',
      path: 'priority',
      fieldType: 'integer',
      enumValues: [1, 2, 3],
    })

    const result = adaptAutoFormModelToDialogWrapper(createModel([createSection([priorityField])]))

    expect(result.schema.properties.priority.type).toBe('integer')
    expect(result.schema.properties.priority.enum).toBeUndefined()
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'enum_type_unsupported',
          path: 'priority',
        }),
      ]),
    )
  })
})
