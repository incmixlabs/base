import { describe, expect, it } from 'vitest'
import type { JsonSchemaNode } from './schema-ast'
import { type AutoFormUiSchema, normalizeJsonSchemaWithUiSchema } from './ui-schema-normalization'

describe('normalizeJsonSchemaWithUiSchema', () => {
  it('normalizes json schema and ui schema into a sectioned runtime model', () => {
    const jsonSchema: JsonSchemaNode = {
      $id: 'schema:trip',
      type: 'object',
      required: ['country', 'startAt'],
      properties: {
        country: {
          type: 'string',
          enum: ['US', 'CA', 'MX'],
        },
        startAt: {
          type: 'string',
          format: 'date-time',
        },
        notes: {
          type: 'string',
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      wrapper: 'dialog',
      sections: [
        {
          id: 'trip-details',
          title: 'Trip details',
          fields: ['country', 'startAt', 'notes'],
          columns: 2,
        },
      ],
      fields: {
        country: {
          widget: 'country-picker',
          label: 'Country',
          help: 'Use the native country picker.',
        },
        startAt: {
          widget: 'date-time-picker',
          label: 'Departure',
        },
        notes: {
          widget: 'textarea',
          colSpan: 2,
          placeholder: 'Optional trip notes',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.kind).toBe('form-model')
    expect(model.schemaId).toBe('schema:trip')
    expect(model.wrapper).toBe('dialog')
    expect(model.nodes).toHaveLength(1)

    const section = model.nodes[0]
    expect(section?.kind).toBe('section')
    if (!section || section.kind !== 'section') throw new Error('expected section')

    expect(section.id).toBe('trip-details')
    expect(section.title).toBe('Trip details')
    expect(section.columns).toBe(2)
    expect(section.nodes).toHaveLength(3)

    const [country, startAt, notes] = section.nodes
    expect(country?.kind).toBe('field')
    expect(startAt?.kind).toBe('field')
    expect(notes?.kind).toBe('field')

    if (!country || country.kind !== 'field') throw new Error('expected country field')
    if (!startAt || startAt.kind !== 'field') throw new Error('expected startAt field')
    if (!notes || notes.kind !== 'field') throw new Error('expected notes field')

    expect(country.widget).toBe('country-picker')
    expect(country.label).toBe('Country')
    expect(country.help).toBe('Use the native country picker.')
    expect(country.required).toBe(true)
    expect(country.enumValues).toEqual(['US', 'CA', 'MX'])
    expect(country.fieldType).toBe('select')

    expect(startAt.widget).toBe('date-time-picker')
    expect(startAt.label).toBe('Departure')
    expect(startAt.required).toBe(true)
    expect(startAt.format).toBe('date-time')
    expect(startAt.fieldType).toBe('datetime')

    expect(notes.widget).toBe('textarea')
    expect(notes.placeholder).toBe('Optional trip notes')
    expect(notes.colSpan).toBe(2)
    expect(notes.required).toBe(false)
    expect(notes.fieldType).toBe('string')
  })

  it('appends unsectioned nodes after ui-schema-defined sections', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        country: { type: 'string' },
        notes: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'ready'] },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'main',
          fields: ['country', 'notes'],
        },
      ],
      fields: {
        status: {
          widget: 'segmented-control',
          label: 'Status',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.nodes).toHaveLength(2)
    expect(model.nodes[0]?.kind).toBe('section')
    expect(model.nodes[1]?.kind).toBe('field')

    const status = model.nodes[1]
    if (!status || status.kind !== 'field') throw new Error('expected status field')

    expect(status.key).toBe('status')
    expect(status.widget).toBe('segmented-control')
    expect(status.label).toBe('Status')
  })

  it('preserves array minItems and maxItems in the normalized model', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        dependents: {
          type: 'array',
          minItems: 1,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        dependents: {
          label: 'Dependents',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const repeater = model.nodes[0]

    expect(repeater?.kind).toBe('array')
    if (!repeater || repeater.kind !== 'array') throw new Error('expected array node')

    expect(repeater.label).toBe('Dependents')
    expect(repeater.minItems).toBe(1)
    expect(repeater.maxItems).toBe(3)
  })

  it('preserves array widget props in the normalized model', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        reviewers: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        reviewers: {
          widget: 'multi-select',
          label: 'Reviewers',
          props: {
            options: [
              { value: 'ada', label: 'Ada Lovelace' },
              { value: 'grace', label: 'Grace Hopper' },
            ],
            searchable: false,
          },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const reviewers = model.nodes[0]

    expect(reviewers?.kind).toBe('array')
    if (!reviewers || reviewers.kind !== 'array') throw new Error('expected array node')

    expect(reviewers.widget).toBe('multi-select')
    expect(reviewers.props).toEqual({
      options: [
        { value: 'ada', label: 'Ada Lovelace' },
        { value: 'grace', label: 'Grace Hopper' },
      ],
      searchable: false,
    })
  })

  it('normalizes schemas that resolve external refs from an explicit registry', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json',
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        'account.accountId': {
          label: 'Account ID',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema, {
      externalSchemas: {
        'https://example.com/account.schema.json': {
          type: 'object',
          properties: {
            accountId: {
              type: 'string',
            },
          },
          required: ['accountId'],
        },
      },
    })

    const account = model.nodes[0]
    expect(account?.kind).toBe('object-group')
    if (!account || account.kind !== 'object-group') throw new Error('expected account object-group')

    const accountId = account.nodes[0]
    expect(accountId?.kind).toBe('field')
    if (!accountId || accountId.kind !== 'field') throw new Error('expected accountId field')

    expect(accountId.path).toBe('account.accountId')
    expect(accountId.required).toBe(true)
    expect(accountId.label).toBe('Account ID')
  })

  it('extracts first-class date rules from schema hints onto normalized fields', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        birthDate: {
          type: 'string',
          format: 'date',
          '$autoform:dateRules': {
            minAge: 18,
          },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema)
    const birthDate = model.nodes[0]

    expect(birthDate?.kind).toBe('field')
    if (!birthDate || birthDate.kind !== 'field') throw new Error('expected birthDate field')

    expect(birthDate.format).toBe('date')
    expect(birthDate.dateRules).toEqual({
      minAge: 18,
    })
  })

  it('prefers path-specific field config over key fallback', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        trip: {
          type: 'object',
          properties: {
            country: { type: 'string' },
          },
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        country: { label: 'Fallback label' },
        'trip.country': { label: 'Path label' },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const trip = model.nodes[0]
    if (!trip || trip.kind !== 'object-group') throw new Error('expected object-group')

    const country = trip.nodes[0]
    if (!country || country.kind !== 'field') throw new Error('expected field')

    expect(country.label).toBe('Path label')
  })

  it('sorts unsectioned nodes by ui schema order', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        country: { type: 'string' },
        startAt: { type: 'string', format: 'date-time' },
        notes: { type: 'string' },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        notes: { order: 1 },
        country: { order: 2 },
        startAt: { order: 3 },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.nodes).toHaveLength(3)
    expect(model.nodes.map(node => ('key' in node ? node.key : undefined))).toEqual(['notes', 'country', 'startAt'])
  })

  it('preserves explicit section field order over ui schema order values', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        country: { type: 'string' },
        startAt: { type: 'string', format: 'date-time' },
        notes: { type: 'string' },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'trip-details',
          fields: ['country', 'startAt', 'notes'],
        },
      ],
      fields: {
        notes: { order: 1 },
        country: { order: 2 },
        startAt: { order: 3 },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const section = model.nodes[0]
    if (!section || section.kind !== 'section') throw new Error('expected section')

    expect(section.nodes.map(node => node.key)).toEqual(['country', 'startAt', 'notes'])
  })

  it('normalizes responsive section columns and field colSpan values', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        country: { type: 'string' },
        startAt: { type: 'string', format: 'date-time' },
        notes: { type: 'string' },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'trip-details',
          fields: ['country', 'startAt', 'notes'],
          columns: { base: 1, md: 2 },
        },
      ],
      fields: {
        notes: {
          widget: 'textarea',
          colSpan: { base: 1, md: 2 },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const section = model.nodes[0]
    if (!section || section.kind !== 'section') throw new Error('expected section')

    expect(section.columns).toEqual({
      initial: 1,
      md: 2,
    })

    const notes = section.nodes.find(node => node.key === 'notes')
    if (!notes || notes.kind !== 'field') throw new Error('expected notes field')

    expect(notes.colSpan).toEqual({
      initial: 1,
      md: 2,
    })
  })

  it('normalizes section and field layout metadata', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        includeInsurance: { type: 'boolean' },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'profile',
          fields: ['firstName', 'includeInsurance'],
          layout: { base: 'stacked', lg: 'horizontal' },
          labelPlacement: { base: 'top', lg: 'start' },
        },
      ],
      fields: {
        includeInsurance: {
          layout: 'stacked',
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)
    const section = model.nodes[0]
    if (!section || section.kind !== 'section') throw new Error('expected section')

    expect(section.layout).toEqual({
      initial: 'stacked',
      lg: 'horizontal',
    })
    expect(section.labelPlacement).toEqual({
      initial: 'top',
      lg: 'start',
    })

    const includeInsurance = section.nodes.find(node => node.key === 'includeInsurance')
    if (!includeInsurance || includeInsurance.kind !== 'field') throw new Error('expected includeInsurance field')

    expect(includeInsurance.layout).toBe('stacked')
  })

  it('normalizes section-based step metadata', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        country: { type: 'string' },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'profile',
          fields: ['firstName', 'email'],
        },
        {
          id: 'travel',
          fields: ['country'],
        },
      ],
      steps: [
        {
          id: 'profile-step',
          title: 'Profile',
          description: 'Basic traveler details',
          sections: ['profile'],
        },
        {
          id: 'travel-step',
          sections: ['travel'],
        },
      ],
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.steps).toEqual([
      {
        id: 'profile-step',
        title: 'Profile',
        description: 'Basic traveler details',
        sectionIds: ['profile'],
      },
      {
        id: 'travel-step',
        title: 'travel-step',
        description: undefined,
        sectionIds: ['travel'],
      },
    ])
  })

  it('collects branch-only conditional nodes into a dynamic branch registry', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
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

    const uiSchema: AutoFormUiSchema = {
      sections: [
        {
          id: 'account',
          fields: ['accountType', 'vatId', 'nickname'],
        },
      ],
      fields: {
        accountType: { label: 'Account type' },
        vatId: { label: 'VAT ID' },
        nickname: { label: 'Nickname' },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.dynamicBranches).toHaveLength(2)
    expect(model.dynamicBranches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'form:condition:then',
          basePath: '',
          sectionId: 'account',
          nodes: [expect.objectContaining({ path: 'vatId', label: 'VAT ID' })],
        }),
        expect.objectContaining({
          id: 'form:condition:else',
          basePath: '',
          sectionId: 'account',
          nodes: [expect.objectContaining({ path: 'nickname', label: 'Nickname' })],
        }),
      ]),
    )
  })

  it('collects nested branch-local conditions into the dynamic branch registry', () => {
    const jsonSchema: JsonSchemaNode = {
      type: 'object',
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
        properties: {
          company: {
            type: 'object',
            properties: {
              companyType: {
                type: 'string',
                enum: ['domestic', 'international'],
              },
            },
            if: {
              properties: {
                companyType: { const: 'international' },
              },
              required: ['companyType'],
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
                stateTaxId: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        accountType: { label: 'Account type' },
        company: { label: 'Company' },
        'company.companyType': { label: 'Company type' },
        'company.vatId': { label: 'VAT ID' },
        'company.stateTaxId': { label: 'State tax ID' },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema)

    expect(model.dynamicBranches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'form:condition:then',
          basePath: '',
          nodes: [expect.objectContaining({ path: 'company' })],
        }),
        expect.objectContaining({
          id: 'company:condition:then',
          basePath: 'company',
          nodes: [expect.objectContaining({ path: 'company.vatId', label: 'VAT ID' })],
        }),
        expect.objectContaining({
          id: 'company:condition:else',
          basePath: 'company',
          nodes: [expect.objectContaining({ path: 'company.stateTaxId', label: 'State tax ID' })],
        }),
      ]),
    )
  })
})
