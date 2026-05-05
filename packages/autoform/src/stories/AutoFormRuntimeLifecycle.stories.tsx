import { normalizeJsonSchemaWithUiSchema } from '@incmix/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { AutoFormModelRenderer } from '@incmix/autoform'
import {
  autoformConditionalJsonSchema,
  autoformConditionalUiSchema,
  autoformRendererJsonSchema,
  autoformRendererUiSchema,
} from './autoform-ui-schema-contract.example'

type RuntimeStoryArgs = {
  fieldSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'
}

const meta: Meta<RuntimeStoryArgs> = {
  title: 'AutoForm/Renderer/Runtime Lifecycle',
  parameters: {
    layout: 'padded',
  },
  args: {
    fieldSize: 'md',
  },
  argTypes: {
    fieldSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2x'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const ValidationLifecycle: Story = {
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Runtime validation lifecycle</h2>
          <p className="text-sm text-muted-foreground">
            This renderer uses the native runtime hook with AJV validation. Submit the invalid defaults to verify that
            field-level errors render through the normalized-model path.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformRendererJsonSchema}
          defaultValues={{
            traveler: {
              fullName: '',
              email: 'not-an-email',
            },
            country: '',
            startAt: '',
            travelClass: '',
          }}
          submitLabel="Validate trip"
        />
      </div>
    )
  },
}

export const AsyncSubmitLifecycle: Story = {
  render: args => {
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const [submitLabel, setSubmitLabel] = React.useState('Create trip')
    const [submitPhase, setSubmitPhase] = React.useState<'idle' | 'submitting' | 'submitted'>('idle')
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Async submit lifecycle</h2>
          <p className="text-sm text-muted-foreground">
            Submit this form to verify the runtime pending state. The submit button should switch to{' '}
            <code>Submitting...</code> while the async handler resolves.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 text-sm shadow-sm">
          Current story submit phase: <strong>{submitPhase}</strong>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformRendererJsonSchema}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-03-20T10:00:00.000Z',
            travelClass: 'economy',
          }}
          submitLabel={submitLabel}
          onSubmit={async nextValues => {
            setSubmitPhase('submitting')
            setSubmitLabel('Submitting...')
            await new Promise(resolve => window.setTimeout(resolve, 1200))
            setSubmitted(nextValues)
            setSubmitPhase('submitted')
            setSubmitLabel('Submitted')
          }}
        />

        {submitted ? (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
            Submit completed successfully.
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-foreground">Submitted values</div>
          <pre className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

export const ConditionalRuntimeLifecycle: Story = {
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformConditionalJsonSchema, autoformConditionalUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Conditional runtime lifecycle</h2>
          <p className="text-sm text-muted-foreground">
            Switch the account type to verify that runtime conditions hide or reveal fields and can also mark fields
            read-only without rebuilding the normalized model.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformConditionalJsonSchema}
          submitLabel="Save account"
        />
      </div>
    )
  },
}
