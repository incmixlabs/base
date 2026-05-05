import { describe, expect, it } from 'vitest'
import { type JsonSchemaNode, schemaToAst } from './schema-ast'

describe('schemaToAst', () => {
  it('normalizes object schema into form nodes and groups sections', () => {
    const schema: JsonSchemaNode = {
      $id: 'schema:user-profile',
      title: 'User Profile',
      type: 'object',
      required: ['name', 'emails'],
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          'ui:section': 'Identity',
          'ui:widget': 'text',
          'x-hint': 'primary-name',
        },
        emails: {
          type: 'array',
          title: 'Emails',
          items: { type: 'string', format: 'email' },
        },
        preferences: {
          type: 'object',
          title: 'Preferences',
          properties: {
            theme: {
              type: 'string',
              enum: ['light', 'dark'],
              default: 'light',
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)

    expect(ast.kind).toBe('form')
    expect(ast.schemaId).toBe('schema:user-profile')
    expect(ast.nodes).toHaveLength(3)
    expect(ast.nodes[0]?.kind).toBe('section')

    const identitySection = ast.nodes[0]
    expect(identitySection?.kind).toBe('section')
    if (!identitySection || identitySection.kind !== 'section') {
      throw new Error('Expected section')
    }

    expect(identitySection.title).toBe('Identity')
    expect(identitySection.nodes).toHaveLength(1)
    expect(identitySection.nodes[0]?.kind).toBe('field')

    const nameField = identitySection.nodes[0]
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected field')
    }
    expect(nameField.path).toBe('name')
    expect(nameField.required).toBe(true)
    expect(nameField.ui['ui:widget']).toBe('text')
    expect(nameField.hints['x-hint']).toBe('primary-name')
  })

  it('captures conditional metadata and preserves custom extension keys', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        plan: {
          type: 'string',
          enum: ['free', 'pro'],
          anyOf: [{ const: 'free' }, { const: 'pro' }],
          dependentSchemas: {
            billingEmail: {
              type: 'string',
              format: 'email',
            },
          },
          'ui:section': 'Billing',
          '$autoform:hint': 'subscription-plan',
        },
      },
    }

    const ast = schemaToAst(schema)
    const section = ast.nodes[0]
    expect(section?.kind).toBe('section')
    if (!section || section.kind !== 'section') {
      throw new Error('Expected section')
    }

    const planField = section.nodes[0]
    expect(planField?.kind).toBe('field')
    if (!planField || planField.kind !== 'field') {
      throw new Error('Expected field')
    }

    expect(planField.conditions).toHaveLength(1)
    expect(planField.conditions[0]?.combinators.anyOf).toHaveLength(2)
    expect(planField.conditions[0]?.when.dependentSchemas?.billingEmail).toBeTruthy()
    expect(planField.ui['ui:section']).toBe('Billing')
    expect(planField.hints['$autoform:hint']).toBe('subscription-plan')
  })

  it('keeps string formats as distinct field types', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        startDate: { type: 'string', format: 'date' },
        startsAt: { type: 'string', format: 'date-time' },
        startsAtTime: { type: 'string', format: 'time' },
        email: { type: 'string', format: 'email' },
        website: { type: 'string', format: 'uri' },
        identifier: { type: 'string', format: 'uuid' },
      },
    }

    const ast = schemaToAst(schema)
    const dateField = ast.nodes.find(node => node.kind === 'field' && node.key === 'startDate')
    const datetimeField = ast.nodes.find(node => node.kind === 'field' && node.key === 'startsAt')
    const timeField = ast.nodes.find(node => node.kind === 'field' && node.key === 'startsAtTime')
    const emailField = ast.nodes.find(node => node.kind === 'field' && node.key === 'email')
    const urlField = ast.nodes.find(node => node.kind === 'field' && node.key === 'website')
    const uuidField = ast.nodes.find(node => node.kind === 'field' && node.key === 'identifier')

    expect(dateField?.kind).toBe('field')
    expect(datetimeField?.kind).toBe('field')
    expect(timeField?.kind).toBe('field')
    expect(emailField?.kind).toBe('field')
    expect(urlField?.kind).toBe('field')
    expect(uuidField?.kind).toBe('field')
    if (!dateField || dateField.kind !== 'field') throw new Error('Expected date field')
    if (!datetimeField || datetimeField.kind !== 'field') throw new Error('Expected datetime field')
    if (!timeField || timeField.kind !== 'field') throw new Error('Expected time field')
    if (!emailField || emailField.kind !== 'field') throw new Error('Expected email field')
    if (!urlField || urlField.kind !== 'field') throw new Error('Expected url field')
    if (!uuidField || uuidField.kind !== 'field') throw new Error('Expected uuid field')

    expect(dateField.fieldType).toBe('date')
    expect(datetimeField.fieldType).toBe('datetime')
    expect(timeField.fieldType).toBe('time')
    expect(emailField.fieldType).toBe('email')
    expect(urlField.fieldType).toBe('url')
    expect(uuidField.fieldType).toBe('uuid')
  })

  it('keeps number and integer schema types distinct', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        guests: { type: 'integer' },
      },
    }

    const ast = schemaToAst(schema)
    const amountField = ast.nodes.find(node => node.kind === 'field' && node.key === 'amount')
    const guestsField = ast.nodes.find(node => node.kind === 'field' && node.key === 'guests')

    expect(amountField?.kind).toBe('field')
    expect(guestsField?.kind).toBe('field')
    if (!amountField || amountField.kind !== 'field') throw new Error('Expected amount field')
    if (!guestsField || guestsField.kind !== 'field') throw new Error('Expected guests field')

    expect(amountField.fieldType).toBe('number')
    expect(guestsField.fieldType).toBe('integer')
  })

  it('throws on unresolved $ref entries', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          $ref: '#/$defs/profile',
        },
      },
    }

    expect(() => schemaToAst(schema)).toThrow(/unresolved \$ref/i)
  })

  it('throws on empty $ref entries', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          $ref: '   ',
        },
      },
    }

    expect(() => schemaToAst(schema)).toThrow(/empty \$ref/i)
  })

  it('throws when $ref is present but not a string', () => {
    const schema = {
      type: 'object',
      properties: {
        profile: {
          $ref: 123,
        },
      },
    } as unknown as JsonSchemaNode

    expect(() => schemaToAst(schema)).toThrow(/\$ref must be a string/i)
  })

  it('throws on unsupported external $ref entries', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          $ref: 'https://example.com/profile.schema.json#/$defs/profile',
        },
      },
    }

    expect(() => schemaToAst(schema)).toThrow(/unresolved external \$ref/i)
  })

  it('resolves external $ref entries from an explicit schema registry', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          $ref: 'https://example.com/profile.schema.json#/$defs/profile',
        },
      },
    }

    const ast = schemaToAst(schema, {
      externalSchemas: {
        'https://example.com/profile.schema.json': {
          $defs: {
            profile: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                },
              },
            },
          },
        },
      },
    })

    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')
    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const emailField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'email')
    expect(emailField?.kind).toBe('field')
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(emailField.format).toBe('email')
    expect(emailField.required).toBe(true)
  })

  it('resolves external $ref entries from exact-ref registry keys without dereferencing twice', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          $ref: 'https://example.com/profile.schema.json#/$defs/profile',
        },
      },
    }

    const ast = schemaToAst(schema, {
      externalSchemas: {
        'https://example.com/profile.schema.json#/$defs/profile': {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
      },
    })

    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')
    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const emailField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'email')
    expect(emailField?.kind).toBe('field')
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(emailField.format).toBe('email')
    expect(emailField.required).toBe(true)
  })

  it('resolves legacy definitions refs', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      definitions: {
        profile: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
      },
      properties: {
        profile: {
          $ref: '#/definitions/profile',
        },
      },
    }

    const ast = schemaToAst(schema)
    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')

    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const emailField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'email')
    expect(emailField?.kind).toBe('field')
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(emailField.format).toBe('email')
    expect(emailField.required).toBe(true)
  })

  it('merges sibling object keywords with referenced schemas', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        baseProfile: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
      properties: {
        profile: {
          $ref: '#/$defs/baseProfile',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')

    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const nameField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'name')
    const emailField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'email')

    expect(nameField?.kind).toBe('field')
    expect(emailField?.kind).toBe('field')
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected name field')
    }
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(nameField.required).toBe(true)
    expect(emailField.required).toBe(true)
    expect(emailField.format).toBe('email')
  })

  it('deep-merges colliding property schemas from $ref targets and inline overrides', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        baseProfile: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
            },
          },
        },
      },
      properties: {
        profile: {
          $ref: '#/$defs/baseProfile',
          properties: {
            name: {
              title: 'Display name',
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')

    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const nameField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'name')
    expect(nameField?.kind).toBe('field')
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected name field')
    }

    expect(nameField.fieldType).toBe('string')
    expect(nameField.title).toBe('Display name')
  })

  it('deep-merges object array item schemas from $ref targets and inline overrides', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        baseDependents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 2,
              },
            },
          },
        },
      },
      properties: {
        dependents: {
          $ref: '#/$defs/baseDependents',
          items: {
            type: 'object',
            properties: {
              name: {
                title: 'Dependent name',
              },
              relationship: {
                type: 'string',
                enum: ['child', 'spouse'],
              },
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const dependentsNode = ast.nodes.find(node => node.kind === 'array' && node.key === 'dependents')

    expect(dependentsNode?.kind).toBe('array')
    if (!dependentsNode || dependentsNode.kind !== 'array') {
      throw new Error('Expected dependents array')
    }

    expect(dependentsNode.itemNode.kind).toBe('object-group')
    if (dependentsNode.itemNode.kind !== 'object-group') {
      throw new Error('Expected object-group array item')
    }

    const nameField = dependentsNode.itemNode.nodes.find(node => node.kind === 'field' && node.key === 'name')
    const relationshipField = dependentsNode.itemNode.nodes.find(
      node => node.kind === 'field' && node.key === 'relationship',
    )

    expect(nameField?.kind).toBe('field')
    expect(relationshipField?.kind).toBe('field')
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected name field')
    }
    if (!relationshipField || relationshipField.kind !== 'field') {
      throw new Error('Expected relationship field')
    }

    expect(nameField.fieldType).toBe('string')
    expect(nameField.title).toBe('Dependent name')
    expect(relationshipField.fieldType).toBe('select')
  })

  it('throws when both $ref target and inline overrides contribute conditional keywords', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        conditionalProfile: {
          type: 'object',
          if: {
            properties: {
              accountType: { const: 'business' },
            },
          },
          // biome-ignore lint/suspicious/noThenProperty: JSON Schema uses `then` for conditional branches.
          then: {
            required: ['companyName'],
          },
        },
      },
      properties: {
        profile: {
          $ref: '#/$defs/conditionalProfile',
          else: {
            properties: {
              nickname: { type: 'string' },
            },
          },
        },
      },
    }

    expect(() => schemaToAst(schema)).toThrow(/combining conditional keywords across \$ref merges is not supported/i)
  })

  it('resolves percent-encoded local refs', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        contact: {
          $ref: '#/$defs/first%20contact',
        },
      },
      $defs: {
        'first contact': {
          type: 'object',
          required: ['full name'],
          properties: {
            'full name': {
              type: 'string',
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const contactGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'contact')

    expect(contactGroup?.kind).toBe('object-group')
    if (!contactGroup || contactGroup.kind !== 'object-group') {
      throw new Error('Expected contact object group')
    }

    const fullNameField = contactGroup.nodes.find(node => node.kind === 'field' && node.key === 'full name')
    expect(fullNameField?.kind).toBe('field')
    if (!fullNameField || fullNameField.kind !== 'field') {
      throw new Error('Expected full name field')
    }

    expect(fullNameField.path).toBe('contact.full name')
    expect(fullNameField.required).toBe(true)
  })

  it('ignores unused recursive defs when no reachable branch references them', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
      $defs: {
        recursiveHelper: {
          type: 'object',
          properties: {
            child: {
              $ref: '#/$defs/recursiveHelper',
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const profileGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'profile')

    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    const nameField = profileGroup.nodes.find(node => node.kind === 'field' && node.key === 'name')
    expect(nameField?.kind).toBe('field')
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected name field')
    }

    expect(nameField.required).toBe(true)
  })

  it('throws on cyclic local $ref entries', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        node: {
          type: 'object',
          properties: {
            child: {
              $ref: '#/$defs/node',
            },
          },
        },
      },
      properties: {
        root: {
          $ref: '#/$defs/node',
        },
      },
    }

    expect(() => schemaToAst(schema)).toThrow(/cyclic \$ref/i)
  })

  it('resolves multi-hop local refs before parsing nested object nodes', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      $defs: {
        person: {
          $ref: '#/$defs/profile',
        },
        profile: {
          type: 'object',
          required: ['contact'],
          properties: {
            contact: {
              $ref: '#/$defs/contact',
            },
          },
        },
        contact: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              title: 'Email',
            },
          },
        },
      },
      properties: {
        applicant: {
          $ref: '#/$defs/person',
        },
      },
    }

    const ast = schemaToAst(schema)
    const applicantGroup = ast.nodes.find(node => node.kind === 'object-group' && node.key === 'applicant')

    expect(applicantGroup?.kind).toBe('object-group')
    if (!applicantGroup || applicantGroup.kind !== 'object-group') {
      throw new Error('Expected applicant object group')
    }

    const contactGroup = applicantGroup.nodes.find(node => node.kind === 'object-group' && node.key === 'contact')
    expect(contactGroup?.kind).toBe('object-group')
    if (!contactGroup || contactGroup.kind !== 'object-group') {
      throw new Error('Expected contact object group')
    }

    const emailField = contactGroup.nodes.find(node => node.kind === 'field' && node.key === 'email')
    expect(emailField?.kind).toBe('field')
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(emailField.path).toBe('applicant.contact.email')
    expect(emailField.required).toBe(true)
    expect(emailField.format).toBe('email')
  })

  it('resolves local refs used by array item schemas', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        dependents: {
          type: 'array',
          items: {
            $ref: '#/$defs/dependent',
          },
        },
      },
      $defs: {
        dependent: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
            },
            relationship: {
              type: 'string',
              enum: ['child', 'spouse'],
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const dependentsNode = ast.nodes.find(node => node.kind === 'array' && node.key === 'dependents')

    expect(dependentsNode?.kind).toBe('array')
    if (!dependentsNode || dependentsNode.kind !== 'array') {
      throw new Error('Expected dependents array')
    }

    expect(dependentsNode.itemNode.kind).toBe('object-group')
    if (dependentsNode.itemNode.kind !== 'object-group') {
      throw new Error('Expected dependent object item node')
    }

    const nameField = dependentsNode.itemNode.nodes.find(node => node.kind === 'field' && node.key === 'name')
    expect(nameField?.kind).toBe('field')
    if (!nameField || nameField.kind !== 'field') {
      throw new Error('Expected dependent name field')
    }

    expect(nameField.path).toBe('dependents[*].name')
    expect(nameField.required).toBe(true)

    const relationshipField = dependentsNode.itemNode.nodes.find(
      node => node.kind === 'field' && node.key === 'relationship',
    )
    expect(relationshipField?.kind).toBe('field')
    if (!relationshipField || relationshipField.kind !== 'field') {
      throw new Error('Expected relationship field')
    }

    expect(relationshipField.fieldType).toBe('select')
    expect(relationshipField.enumValues).toEqual(['child', 'spouse'])
  })

  it('resolves dynamic schemas that compose reusable defs and conditional branches', () => {
    const schema: JsonSchemaNode = {
      $id: 'schema:dynamic-signup',
      title: 'Dynamic Signup',
      type: 'object',
      required: ['accountType', 'profile'],
      $defs: {
        profile: {
          type: 'object',
          title: 'Profile',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              title: 'Email',
            },
            locale: {
              type: 'string',
              default: 'en-US',
              'ui:widget': 'select',
            },
          },
        },
      },
      properties: {
        accountType: {
          type: 'string',
          enum: ['individual', 'business'],
          title: 'Account type',
          'ui:section': 'Enrollment',
        },
        profile: {
          $ref: '#/$defs/profile',
          'ui:section': 'Enrollment',
        },
      },
      if: {
        properties: {
          accountType: { const: 'business' },
        },
      },
      // biome-ignore lint/suspicious/noThenProperty: JSON Schema uses `then` for conditional branches.
      then: {
        required: ['companyName'],
        properties: {
          companyName: {
            type: 'string',
            title: 'Company name',
          },
        },
      },
      else: {
        properties: {
          nickname: {
            type: 'string',
            title: 'Nickname',
          },
        },
      },
    }

    const ast = schemaToAst(schema)

    expect(ast.schemaId).toBe('schema:dynamic-signup')
    expect(ast.conditions).toHaveLength(1)
    expect(ast.conditions[0]?.when.if?.properties?.accountType?.const).toBe('business')
    expect(ast.conditions[0]?.thenSchema?.properties?.companyName).toBeTruthy()
    expect(ast.conditions[0]?.elseSchema?.properties?.nickname).toBeTruthy()

    const enrollmentSection = ast.nodes[0]
    expect(enrollmentSection?.kind).toBe('section')
    if (!enrollmentSection || enrollmentSection.kind !== 'section') {
      throw new Error('Expected enrollment section')
    }

    expect(enrollmentSection.title).toBe('Enrollment')
    expect(enrollmentSection.nodes).toHaveLength(2)

    const profileGroup = enrollmentSection.nodes.find(node => node.key === 'profile')
    expect(profileGroup?.kind).toBe('object-group')
    if (!profileGroup || profileGroup.kind !== 'object-group') {
      throw new Error('Expected profile object group')
    }

    expect(profileGroup.required).toBe(true)
    const emailField = profileGroup.nodes.find(node => node.key === 'email')
    expect(emailField?.kind).toBe('field')
    if (!emailField || emailField.kind !== 'field') {
      throw new Error('Expected email field')
    }

    expect(emailField.format).toBe('email')
    expect(emailField.required).toBe(true)

    const localeField = profileGroup.nodes.find(node => node.key === 'locale')
    expect(localeField?.kind).toBe('field')
    if (!localeField || localeField.kind !== 'field') {
      throw new Error('Expected locale field')
    }

    expect(localeField.defaultValue).toBe('en-US')
    expect(localeField.ui['ui:widget']).toBe('select')
  })

  it('extracts branch-only descendants under shared object properties', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        accountType: {
          type: 'string',
          enum: ['individual', 'business'],
        },
        company: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
      if: {
        properties: {
          accountType: { const: 'business' },
        },
      },
      // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
      then: {
        properties: {
          company: {
            type: 'object',
            required: ['vatId'],
            properties: {
              vatId: {
                type: 'string',
              },
            },
          },
        },
      },
    }

    const ast = schemaToAst(schema)
    const thenNodes = ast.conditions[0]?.branchNodes?.thenNodes

    expect(thenNodes).toHaveLength(1)
    expect(thenNodes?.[0]?.kind).toBe('object-group')
    if (!thenNodes?.[0] || thenNodes[0].kind !== 'object-group') {
      throw new Error('Expected company object group in then branch')
    }

    expect(thenNodes[0].path).toBe('company')
    const vatIdField = thenNodes[0].nodes.find(node => node.kind === 'field' && node.key === 'vatId')
    expect(vatIdField?.kind).toBe('field')
    if (!vatIdField || vatIdField.kind !== 'field') {
      throw new Error('Expected vatId field in then branch')
    }

    expect(vatIdField.path).toBe('company.vatId')
    expect(vatIdField.required).toBe(true)
  })
})
