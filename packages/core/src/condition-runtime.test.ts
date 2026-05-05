import { describe, expect, it } from 'vitest'
import { evaluateAutoFormConditionState } from './condition-runtime'
import type { JsonSchemaNode } from './schema-ast'
import type { AutoFormUiSchema } from './ui-schema-normalization'
import { normalizeJsonSchemaWithUiSchema } from './ui-schema-normalization'

describe('condition-runtime', () => {
  it('derives hidden, required, and readOnly overrides from active conditional branches', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
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
        taxId: {
          type: 'string',
        },
      },
      if: {
        properties: {
          accountType: { const: 'business' },
        },
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
          taxId: {
            readOnly: true,
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
        },
      },
    }

    const uiSchema: AutoFormUiSchema = {
      fields: {
        accountType: { label: 'Account type' },
        companyName: { label: 'Company name' },
        nickname: { label: 'Nickname' },
        taxId: { label: 'Tax ID' },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(schema, uiSchema)

    const businessState = evaluateAutoFormConditionState(model, {
      accountType: 'business',
    })

    expect(businessState.required.companyName).toBe(true)
    expect(businessState.hidden.companyName).toBe(false)
    expect(businessState.hidden.nickname).toBe(true)
    expect(businessState.readOnly.taxId).toBe(true)

    const individualState = evaluateAutoFormConditionState(model, {
      accountType: 'individual',
    })

    expect(individualState.required.nickname).toBe(true)
    expect(individualState.hidden.companyName).toBe(true)
    expect(individualState.hidden.nickname).toBe(false)
  })

  it('applies dependent schema overrides when the dependency path has a value', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        billingEmail: {
          type: 'string',
          format: 'email',
        },
        taxId: {
          type: 'string',
        },
        purchaseOrder: {
          type: 'string',
        },
      },
      dependentSchemas: {
        billingEmail: {
          required: ['taxId'],
          properties: {
            purchaseOrder: {
              'ui:disabled': true,
            },
          },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(schema, {})

    const inactiveState = evaluateAutoFormConditionState(model, {})
    expect(inactiveState.required.taxId).toBeUndefined()
    expect(inactiveState.disabled.purchaseOrder).toBeUndefined()

    const activeState = evaluateAutoFormConditionState(model, {
      billingEmail: 'finance@example.com',
    })

    expect(activeState.required.taxId).toBe(true)
    expect(activeState.disabled.purchaseOrder).toBe(true)
  })

  it('returns active dynamic branches for branch-only then/else nodes', () => {
    const schema: JsonSchemaNode = {
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

    const model = normalizeJsonSchemaWithUiSchema(schema, {})

    const businessState = evaluateAutoFormConditionState(model, {
      accountType: 'business',
    })
    expect(businessState.activeBranchIds).toContain('form:condition:then')
    expect(businessState.activeBranches).toEqual([
      expect.objectContaining({
        id: 'form:condition:then',
        nodes: [expect.objectContaining({ path: 'vatId' })],
      }),
    ])

    const individualState = evaluateAutoFormConditionState(model, {
      accountType: 'individual',
    })
    expect(individualState.activeBranchIds).toContain('form:condition:else')
    expect(individualState.activeBranches).toEqual([
      expect.objectContaining({
        id: 'form:condition:else',
        nodes: [expect.objectContaining({ path: 'nickname' })],
      }),
    ])
  })

  it('evaluates nested object conditions against the object scope', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
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
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(schema, {})
    const state = evaluateAutoFormConditionState(model, {
      company: {
        companyType: 'international',
      },
    })

    expect(state.activeBranchIds).toContain('company:condition:then')
    expect(state.activeBranches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'company:condition:then',
          basePath: 'company',
          nodes: [expect.objectContaining({ path: 'company.vatId' })],
        }),
      ]),
    )
  })

  it('evaluates array item conditions against concrete repeater item scopes', () => {
    const schema: JsonSchemaNode = {
      type: 'object',
      properties: {
        dependents: {
          type: 'array',
          items: {
            type: 'object',
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
                  'ui:hidden': false,
                },
              },
            },
          },
        },
      },
    }

    const model = normalizeJsonSchemaWithUiSchema(schema, {})
    const state = evaluateAutoFormConditionState(model, {
      dependents: [
        {
          relationship: 'business',
        },
      ],
    })

    expect(state.activeBranchIds).toContain('dependents[*]:condition:then')
    expect(state.hidden['dependents.0.vatId']).toBe(false)
    expect(state.activeBranches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dependents[*]:condition:then',
          basePath: 'dependents[*]',
          nodes: [expect.objectContaining({ path: 'dependents[*].vatId' })],
        }),
      ]),
    )
  })
})
