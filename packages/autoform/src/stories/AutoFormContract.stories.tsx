import { normalizeJsonSchemaWithUiSchema } from '@incmix/core'
import { AutoFormModelRenderer, DialogWrapper, adaptAutoFormModelToDialogWrapper } from '@incmix/autoform'
import { Button } from '@incmix/ui/elements'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { type JsonValue, JsonViewEditor } from '../json-editor'
import {
  autoformLayoutGridJsonSchema,
  autoformLayoutGridUiSchema,
  autoformUiSchemaJsonSchema,
  autoformUiSchemaOrderedJsonSchema,
  autoformUiSchemaOrderedUiSchema,
  autoformUiSchemaUiSchema,
  autoformWrapperSupportedWidgetsJsonSchema,
  autoformWrapperSupportedWidgetsUiSchema,
} from './autoform-ui-schema-contract.example'

const meta: Meta = {
  title: 'AutoForm/Contract/Schema Contract',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

function JsonCard({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      <pre className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

function ModelInspectorPreview() {
  const normalizedIntent = normalizeJsonSchemaWithUiSchema(autoformUiSchemaJsonSchema, autoformUiSchemaUiSchema)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-border bg-muted/40 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
            Wrapper
          </span>
          <span className="text-sm text-muted-foreground">{normalizedIntent.wrapper ?? 'none'}</span>
        </div>
      </div>

      {normalizedIntent.nodes.map(node => {
        if (node.kind !== 'section') {
          return (
            <div key={node.path} className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="text-sm font-semibold text-foreground">{node.label ?? node.key}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-1">{node.kind}</span>
                {'fieldType' in node ? <span className="rounded-full bg-muted px-2 py-1">{node.fieldType}</span> : null}
                {node.widget ? <span className="rounded-full bg-muted px-2 py-1">{node.widget}</span> : null}
              </div>
            </div>
          )
        }

        return (
          <section key={node.id} className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{node.title ?? node.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {node.columns ? `${node.columns} columns` : 'Auto layout'} · {node.nodes.length} fields
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                section
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {node.nodes.map(field => (
                <div
                  key={field.path}
                  className={
                    field.colSpan === 2
                      ? 'rounded-2xl border border-border bg-muted/30 p-4 md:col-span-2'
                      : 'rounded-2xl border border-border bg-muted/30 p-4'
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{field.label ?? field.key}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{field.path}</div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="rounded-full bg-background px-2 py-1 text-xs text-foreground">
                        {'fieldType' in field ? field.fieldType : field.kind}
                      </span>
                      {field.widget ? (
                        <span className="rounded-full bg-background px-2 py-1 text-xs text-foreground">
                          {field.widget}
                        </span>
                      ) : null}
                      {field.required ? (
                        <span className="rounded-full bg-background px-2 py-1 text-xs text-foreground">required</span>
                      ) : null}
                    </div>
                  </div>

                  {field.help ? <p className="mt-3 text-sm text-muted-foreground">{field.help}</p> : null}
                  {field.placeholder ? (
                    <p className="mt-2 text-xs text-muted-foreground">Placeholder: {field.placeholder}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export const Overview: Story = {
  render: () => {
    const normalizedIntent = normalizeJsonSchemaWithUiSchema(autoformUiSchemaJsonSchema, autoformUiSchemaUiSchema)

    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">JSON Schema + UI schema</h2>
          <p className="text-sm text-muted-foreground">
            This story captures the contract direction for AutoForm: keep data and validation in JSON Schema, keep
            presentation and widget intent in UI schema, then normalize both into the internal runtime model.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <JsonCard title="JSON Schema" value={autoformUiSchemaJsonSchema} />
          <JsonCard title="UI Schema" value={autoformUiSchemaUiSchema} />
          <JsonCard title="Normalized AutoForm intent" value={normalizedIntent} />
        </div>
      </div>
    )
  },
}

export const NormalizedModelInspector: Story = {
  render: () => <ModelInspectorPreview />,
}

export const UnsectionedOrder: Story = {
  render: () => {
    const normalized = normalizeJsonSchemaWithUiSchema(
      autoformUiSchemaOrderedJsonSchema,
      autoformUiSchemaOrderedUiSchema,
    )

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Unsectioned field ordering</h2>
          <p className="text-sm text-muted-foreground">
            When fields are not grouped into explicit sections, <code>uiSchema.fields[*].order</code> controls their
            normalized order.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {normalized.nodes.map((node, index) => (
            <div
              key={node.kind === 'section' ? node.id : node.path}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-foreground">
                  position {index + 1}
                </span>
                {'order' in node && node.order !== undefined ? (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">order {node.order}</span>
                ) : null}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {node.kind === 'section' ? (node.title ?? node.id) : (node.label ?? node.key)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {node.kind === 'section' ? `section:${node.id}` : node.path}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {'fieldType' in node ? (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">{node.fieldType}</span>
                ) : null}
                {'widget' in node && node.widget ? (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">{node.widget}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const LayoutGridFieldPreview: Story = {
  render: () => {
    const normalized = normalizeJsonSchemaWithUiSchema(autoformLayoutGridJsonSchema, autoformLayoutGridUiSchema)

    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">AutoForm LayoutGridField</h2>
          <p className="text-sm text-muted-foreground">
            AutoForm&apos;s native layout-grid contract is expressed through <code>sections</code>, section{' '}
            <code>columns</code>, and per-field <code>colSpan</code> in UI schema. This is the AutoForm equivalent of a
            layout grid field.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <JsonCard title="JSON Schema" value={autoformLayoutGridJsonSchema} />
          <JsonCard title="UI Schema" value={autoformLayoutGridUiSchema} />
          <JsonCard title="Normalized AutoForm intent" value={normalized} />
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-4 space-y-1">
            <div className="text-sm font-semibold text-foreground">Rendered layout preview</div>
            <p className="text-sm text-muted-foreground">
              The runtime renderer consumes the normalized layout metadata and realizes it through our `Grid` surface.
            </p>
          </div>
          <AutoFormModelRenderer model={normalized} validationSchema={autoformLayoutGridJsonSchema} surface="inline" />
        </div>
      </div>
    )
  },
}

export const DialogSurfacePreview: Story = {
  render: () => {
    const normalized = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformUiSchemaJsonSchema, autoformUiSchemaUiSchema),
      [],
    )
    const adapter = React.useMemo(() => adaptAutoFormModelToDialogWrapper(normalized), [normalized])

    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Dialog compatibility adapter</h2>
          <p className="text-sm text-muted-foreground">
            This uses the shared normalized-model adapter for <code>DialogWrapper</code>. It preserves the common field
            metadata that wrappers can render today and reports the normalized features that are still dropped.
          </p>
        </div>

        {adapter.issues.length > 0 ? (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-foreground">Current adapter gaps</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {adapter.issues.map((issue, index) => (
                <li key={`${issue.code}-${issue.path ?? ''}-${issue.message}-${index}`}>{issue.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <DialogWrapper
          defaultOpen
          closeOnSubmit={false}
          submitLabel="Create trip"
          cancelLabel="Cancel"
          trigger={<Button>Open trip dialog</Button>}
          schema={adapter.schema}
          renderField={(field, defaultRender) => {
            const fieldNode = normalized.nodes
              .flatMap(node => (node.kind === 'section' ? node.nodes : [node]))
              .find(node => node.kind === 'field' && node.key === field.name)

            return (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {fieldNode?.widget ? (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">{fieldNode.widget}</span>
                  ) : null}
                  {fieldNode?.kind === 'field' ? (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                      {fieldNode.fieldType}
                    </span>
                  ) : null}
                </div>
                {defaultRender}
              </div>
            )
          }}
          onSubmit={values => {
            console.log(values)
          }}
        />
      </div>
    )
  },
}

export const WrapperSupportedWidgets: Story = {
  render: () => {
    const normalized = React.useMemo(
      () =>
        normalizeJsonSchemaWithUiSchema(
          autoformWrapperSupportedWidgetsJsonSchema,
          autoformWrapperSupportedWidgetsUiSchema,
        ),
      [],
    )
    const adapter = React.useMemo(() => adaptAutoFormModelToDialogWrapper(normalized), [normalized])
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Wrapper supported widgets</h2>
          <p className="text-sm text-muted-foreground">
            This is the wrapper-path validation surface. It uses the same normalized-model adapter, but only for the
            widget subset the wrapper preserves today: email, password, url, and textarea.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <DialogWrapper
            defaultOpen
            closeOnSubmit={false}
            submitLabel="Save wrapper fields"
            schema={adapter.schema}
            onSubmit={values => {
              setSubmitted(values)
            }}
          />

          <div className="space-y-4">
            <JsonCard title="Adapter issues" value={adapter.issues} />
            <JsonCard title="Submitted values" value={submitted} />
          </div>
        </div>
      </div>
    )
  },
}

export const EditableSchemaPlayground: Story = {
  render: () => {
    const [jsonSchema, setJsonSchema] = React.useState(autoformUiSchemaJsonSchema)
    const [uiSchema, setUiSchema] = React.useState(autoformUiSchemaUiSchema)
    const [submittedValues, setSubmittedValues] = React.useState<Record<string, unknown> | null>(null)

    const normalizationResult = React.useMemo(() => {
      try {
        return {
          normalized: normalizeJsonSchemaWithUiSchema(jsonSchema, uiSchema),
          error: null as string | null,
        }
      } catch (error) {
        return {
          normalized: null,
          error: error instanceof Error ? error.message : 'Failed to normalize schema input.',
        }
      }
    }, [jsonSchema, uiSchema])

    return (
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-4">
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">JSON Schema</h2>
            <p className="text-sm text-muted-foreground">Edit the source schema as structured JSON.</p>
          </div>
          <JsonViewEditor
            name="schema"
            value={jsonSchema as JsonValue}
            onChange={value => setJsonSchema(value as typeof jsonSchema)}
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">UI schema</h2>
            <p className="text-sm text-muted-foreground">Edit presentation hints without leaving the playground.</p>
          </div>
          <JsonViewEditor
            name="uiSchema"
            value={uiSchema as JsonValue}
            onChange={value => setUiSchema(value as typeof uiSchema)}
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Normalized model</h2>
            <p className="text-sm text-muted-foreground">
              Live preview of the runtime contract produced from both editor inputs.
            </p>
          </div>
          {normalizationResult.error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {normalizationResult.error}
            </div>
          ) : (
            <pre className="max-h-[720px] overflow-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-6 text-foreground">
              {JSON.stringify(normalizationResult.normalized, null, 2)}
            </pre>
          )}
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Rendered form</h2>
            <p className="text-sm text-muted-foreground">
              Preview how the normalized model renders as a real AutoForm.
            </p>
          </div>
          {normalizationResult.normalized ? (
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <AutoFormModelRenderer
                model={normalizationResult.normalized}
                validationSchema={jsonSchema}
                surface="inline"
                submitLabel="Run preview"
                onSubmit={async values => {
                  setSubmittedValues(values as Record<string, unknown>)
                }}
              />
              {submittedValues ? (
                <pre className="mt-4 overflow-auto rounded-xl bg-muted/30 p-3 text-xs leading-6 text-foreground">
                  {JSON.stringify(submittedValues, null, 2)}
                </pre>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Fix normalization errors to render the form preview.
            </div>
          )}
        </section>
      </div>
    )
  },
}
