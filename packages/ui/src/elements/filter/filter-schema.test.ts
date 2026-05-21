import { describe, expect, it } from 'vitest'
import { getFilterFieldsFromSchema } from './filter-schema'
import type { FilterJsonSchema } from './filter.props'

describe('getFilterFieldsFromSchema', () => {
  it('maps JSON Schema properties to opinionated filter fields', () => {
    const schema: FilterJsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        status: {
          type: 'string',
          enum: ['active', 'draft'],
          enumNames: ['Active', 'Draft'],
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['design', 'ops'],
          },
        },
        amount: {
          type: 'number',
          minimum: 0,
          maximum: 100,
        },
        updatedAt: {
          type: 'string',
          format: 'date',
        },
      },
    }

    const fields = getFilterFieldsFromSchema(schema)

    expect(fields.map(field => [field.id, field.type])).toEqual([
      ['name', 'input'],
      ['status', 'select'],
      ['tags', 'checkbox'],
      ['amount', 'number'],
      ['updatedAt', 'calendar'],
    ])
    expect(fields.find(field => field.id === 'name')?.operators).toEqual(['contains', 'equals', 'startsWith'])
    expect(fields.find(field => field.id === 'status')).toMatchObject({
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
      ],
    })
    expect(fields.find(field => field.id === 'amount')?.operators).toEqual([
      'between',
      'greaterThan',
      'lessThan',
      'equals',
    ])
    expect(fields.find(field => field.id === 'updatedAt')).toMatchObject({
      defaultOperator: 'between',
      display: 'full',
      mode: 'range',
    })
  })

  it('supports include, exclude, order, and field overrides', () => {
    const schema: FilterJsonSchema = {
      type: 'object',
      properties: {
        hidden: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string', enum: ['active'] },
      },
    }

    const fields = getFilterFieldsFromSchema(schema, {
      exclude: ['hidden'],
      fields: {
        status: { order: 1, label: 'Lifecycle' },
        amount: { order: 2, operators: ['greaterThan'], defaultOperator: 'greaterThan' },
      },
    })

    expect(fields.map(field => field.id)).toEqual(['status', 'amount'])
    expect(fields[0]).toMatchObject({ label: 'Lifecycle', type: 'select' })
    expect(fields[1]).toMatchObject({ operators: ['greaterThan'], defaultOperator: 'greaterThan' })
  })

  it('falls back when the requested default operator is not available', () => {
    const schema: FilterJsonSchema = {
      type: 'object',
      properties: {
        amount: { type: 'number' },
      },
    }

    const fields = getFilterFieldsFromSchema(schema, {
      fields: {
        amount: { operators: ['greaterThan'], defaultOperator: 'between' },
      },
    })

    expect(fields[0]).toMatchObject({ operators: ['greaterThan'], defaultOperator: 'greaterThan' })
  })

  it('requires avatar-list items when schema overrides emit an avatar-list field', () => {
    const schema: FilterJsonSchema = {
      type: 'object',
      properties: {
        ownerId: { type: 'string' },
        reviewerId: { type: 'string' },
      },
    }

    const fields = getFilterFieldsFromSchema(schema, {
      fields: {
        ownerId: { type: 'avatar-list' },
        reviewerId: {
          type: 'avatar-list',
          field: {
            items: [{ id: 'annie', name: 'Annie Case' }],
          },
        },
      },
    })

    expect(fields.map(field => field.id)).toEqual(['reviewerId'])
    expect(fields[0]).toMatchObject({
      type: 'avatar-list',
      items: [{ id: 'annie', name: 'Annie Case' }],
    })
  })
})
