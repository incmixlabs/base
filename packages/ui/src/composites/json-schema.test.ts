import { describe, expect, it } from 'vitest'
import { deriveCompositeJsonSchema } from './json-schema'

describe('deriveCompositeJsonSchema', () => {
  it('deduplicates array item object schemas regardless of sample key order', () => {
    const schema = deriveCompositeJsonSchema([
      { a: 1, b: 'first' },
      { b: 'second', a: 2 },
    ])

    expect(schema).toEqual({
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['a', 'b'],
        properties: {
          a: { type: 'integer' },
          b: { type: 'string' },
        },
      },
    })
  })

  it('omits undefined object keys from generated defaults', () => {
    const schema = deriveCompositeJsonSchema(
      {
        title: 'Example',
        hidden: undefined,
        nested: {
          visible: true,
          hidden: undefined,
        },
        items: [
          {
            label: 'Item',
            hidden: undefined,
          },
        ],
      },
      { includeDefaults: true },
    )

    expect(schema.default).toEqual({
      title: 'Example',
      nested: {
        visible: true,
      },
      items: [
        {
          label: 'Item',
        },
      ],
    })
  })
})
