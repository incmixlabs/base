import type { JsonSchemaNode } from '@incmix/core'
import { schemaToAst } from '@incmix/core'
import type { Meta, StoryObj } from '@storybook/react'
import { AJV_FIELD_CONFIG_SYMBOL, withFieldConfig } from '../src/field-config'
import { AjvProvider } from '../src/provider'

type DynamicVariant = 'individual' | 'business'

type DynamicSchemaStoryProps = {
  variant: DynamicVariant
}

function createDynamicSchema(variant: DynamicVariant): JsonSchemaNode {
  const schema: JsonSchemaNode = {
    $id: `schema:story:${variant}`,
    title: `${capitalize(variant)} Signup`,
    type: 'object',
    required: ['accountType', 'profile'],
    $defs: {
      profile: {
        type: 'object',
        title: 'Profile',
        required: ['email'],
        properties: {
          email: withFieldConfig(
            {
              type: 'string',
              format: 'email',
              description: 'Primary contact email',
            },
            {
              label: 'Email',
            },
          ) as JsonSchemaNode,
          locale: withFieldConfig(
            {
              type: 'string',
              default: 'en-US',
              enum: ['en-US', 'fr-CA'],
            },
            {
              label: 'Locale',
            },
          ) as JsonSchemaNode,
        },
      },
    },
    properties: {
      accountType: withFieldConfig(
        {
          type: 'string',
          const: variant,
          default: variant,
          description: 'Generated from the selected tenant mode',
        },
        {
          label: 'Account type',
          order: 1,
        },
      ) as JsonSchemaNode,
      profile: {
        $ref: '#/$defs/profile',
      },
      ...(variant === 'business'
        ? {
            companyName: withFieldConfig(
              {
                type: 'string',
                minLength: 2,
                description: 'Legal business name',
              },
              {
                label: 'Company name',
                order: 3,
              },
            ) as JsonSchemaNode,
          }
        : {
            nickname: withFieldConfig(
              {
                type: 'string',
                description: 'Optional display alias',
              },
              {
                label: 'Nickname',
                order: 3,
              },
            ) as JsonSchemaNode,
          }),
    },
    if: {
      properties: {
        accountType: { const: 'business' },
      },
    },
    // biome-ignore lint/suspicious/noThenProperty: JSON Schema uses `then` for conditional branches.
    then: {
      required: ['companyName'],
    },
  }

  return schema
}

function createSampleValues(variant: DynamicVariant) {
  if (variant === 'business') {
    return {
      valid: {
        accountType: 'business',
        companyName: 'Boardwalk Labs',
        profile: {
          email: 'ops@boardwalk.test',
          locale: 'en-US',
        },
      },
      invalid: {
        accountType: 'business',
        profile: {
          email: 'broken-email',
        },
      },
    }
  }

  return {
    valid: {
      accountType: 'individual',
      nickname: 'Uma',
      profile: {
        email: 'uma@example.com',
        locale: 'fr-CA',
      },
    },
    invalid: {
      accountType: 'individual',
      profile: {
        email: 'broken-email',
      },
    },
  }
}

const DynamicSchemaDemo = ({ variant }: DynamicSchemaStoryProps) => {
  const schema = createDynamicSchema(variant)
  const provider = new AjvProvider<Record<string, unknown>>(schema, { strict: false })
  const parsedSchema = provider.parseSchema()
  const defaultValues = provider.getDefaultValues()
  const ast = schemaToAst(schema)
  const samples = createSampleValues(variant)
  const validResult = provider.validateSchema(samples.valid)
  const invalidResult = provider.validateSchema(samples.invalid)

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold">Dynamic Schema Runtime Demo</h2>
        <p className="mt-2 text-sm text-slate-600">
          The schema is generated at runtime for the <code>{variant}</code> variant, then used for defaults, parsing,
          validation, and AST extraction.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Runtime Schema" value={schema} />
        <Panel title="Parsed Fields" value={parsedSchema} />
        <Panel title="Default Values" value={defaultValues} />
        <Panel title="AST Output" value={ast} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ValidationPanel label="Valid Sample" sample={samples.valid} success={validResult.success} />
        <ValidationPanel
          label="Invalid Sample"
          sample={samples.invalid}
          success={invalidResult.success}
          errors={invalidResult.success ? undefined : invalidResult.errors}
        />
      </div>
    </div>
  )
}

const Panel = ({ title, value }: { title: string; value: unknown }) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <pre className="mt-3 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
        {stringifyForStory(value)}
      </pre>
    </section>
  )
}

const ValidationPanel = ({
  label,
  sample,
  success,
  errors,
}: {
  label: string
  sample: unknown
  success: boolean
  errors?: unknown
}) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</h3>
      <div
        className={`mt-3 rounded-lg p-3 text-sm ${success ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}
      >
        {success ? 'Validation passed' : 'Validation failed'}
      </div>
      <pre className="mt-3 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
        {stringifyForStory(sample)}
      </pre>
      {!success && errors ? (
        <pre className="mt-3 overflow-auto rounded-lg bg-rose-950 p-3 text-xs text-rose-100">
          {stringifyForStory(errors)}
        </pre>
      ) : null}
    </section>
  )
}

function stringifyForStory(value: unknown) {
  return JSON.stringify(serializeForStory(value), null, 2)
}

function serializeForStory(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(serializeForStory)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>
  const serialized: Record<string, unknown> = {}

  for (const [key, entry] of Object.entries(record)) {
    serialized[key] = serializeForStory(entry)
  }

  const fieldConfig = (value as { [AJV_FIELD_CONFIG_SYMBOL]?: unknown })[AJV_FIELD_CONFIG_SYMBOL]
  if (fieldConfig !== undefined) {
    serialized['$autoform:fieldConfig'] = serializeForStory(fieldConfig)
  }

  return serialized
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const meta: Meta<typeof DynamicSchemaDemo> = {
  title: 'AJV/Dynamic Schema',
  component: DynamicSchemaDemo,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    variant: 'business',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['individual', 'business'],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const RuntimeGenerated: Story = {}
