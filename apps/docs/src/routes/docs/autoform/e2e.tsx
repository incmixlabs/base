import { AutoFormModelRenderer } from '@incmix/autoform'
import {
  autoformArrayRepeaterJsonSchema,
  autoformArrayRepeaterUiSchema,
  autoformConditionalJsonSchema,
  autoformConditionalUiSchema,
  autoformConstrainedRepeaterJsonSchema,
  autoformConstrainedRepeaterUiSchema,
  autoformDynamicBranchJsonSchema,
  autoformDynamicBranchUiSchema,
  autoformRendererJsonSchema,
  autoformRendererUiSchema,
  autoformRepeaterBranchJsonSchema,
  autoformRepeaterBranchUiSchema,
  autoformStepperJsonSchema,
  autoformStepperUiSchema,
} from '@incmix/autoform/stories/autoform-ui-schema-contract.example'
import { normalizeJsonSchemaWithUiSchema } from '@incmix/core'
import { Heading, Text } from '@incmix/ui/typography'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/docs/autoform/e2e')({
  component: AutoFormE2EPage,
})

function FixtureSection({
  title,
  description,
  testId,
  children,
}: {
  title: string
  description: string
  testId: string
  children: React.ReactNode
}) {
  return (
    <section data-testid={testId} className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="space-y-1">
        <Heading as="h2" size="lg">
          {title}
        </Heading>
        <Text size="sm" className="text-muted-foreground">
          {description}
        </Text>
      </div>
      {children}
    </section>
  )
}

function ValidationFixture() {
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="validation-fixture"
      title="Validation"
      description="Starts invalid so submit-time AJV errors render back onto field surfaces."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformRendererJsonSchema}
        submitLabel="Validate trip"
        defaultValues={{ traveler: { fullName: '', email: 'not-an-email' }, country: '', startAt: '', travelClass: '' }}
      />
    </FixtureSection>
  )
}

function ConditionsFixture() {
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformConditionalJsonSchema, autoformConditionalUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="conditions-fixture"
      title="Conditions"
      description="Toggles fields between hidden, read-only, and required states."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformConditionalJsonSchema}
        submitLabel="Save account"
      />
    </FixtureSection>
  )
}

function RepeaterFixture() {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformArrayRepeaterJsonSchema, autoformArrayRepeaterUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="repeater-fixture"
      title="Repeaters"
      description="Covers primitive arrays, object arrays, and indexed submit payloads."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformArrayRepeaterJsonSchema}
        submitLabel="Save roster"
        defaultValues={{ tags: [], dependents: [] }}
        onSubmit={values => setSubmitted(values)}
      />
      <pre
        data-testid="repeater-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function BranchMaterializationFixture() {
  const [values, setValues] = React.useState<Record<string, unknown>>({ accountType: 'individual' })
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformDynamicBranchJsonSchema, autoformDynamicBranchUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="branch-materialization-fixture"
      title="Branch Materialization"
      description="Branch-only fields render when active and are pruned from submit payloads when inactive."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformDynamicBranchJsonSchema}
        values={values}
        onValuesChange={setValues}
        submitLabel="Save account"
        onSubmit={values => setSubmitted(values)}
      />
      <pre
        data-testid="branch-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function RepeaterBranchFixture() {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformRepeaterBranchJsonSchema, autoformRepeaterBranchUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="repeater-branch-fixture"
      title="Repeater Branch Materialization"
      description="Each repeater item evaluates conditional branches independently and prunes stale row-only values."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformRepeaterBranchJsonSchema}
        defaultValues={{ dependents: [] }}
        submitLabel="Save dependents"
        onSubmit={values => setSubmitted(values)}
      />
      <pre
        data-testid="repeater-branch-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function ConstrainedRepeaterFixture() {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformConstrainedRepeaterJsonSchema, autoformConstrainedRepeaterUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="constrained-repeater-fixture"
      title="Constrained Repeaters"
      description="Exercises min/max repeater limits together with row reordering before submit."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformConstrainedRepeaterJsonSchema}
        submitLabel="Save household"
        onSubmit={values => setSubmitted(values)}
      />
      <pre
        data-testid="constrained-repeater-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function StepperFixture() {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformStepperJsonSchema, autoformStepperUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="stepper-fixture"
      title="Stepper"
      description="Maps UI-schema sections into steps and blocks forward navigation until the current step validates."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformStepperJsonSchema}
        submitLabel="Create onboarding"
        defaultValues={{ firstName: '', email: 'invalid-email', country: 'US', reviewAt: '2026-03-20T10:00:00.000Z' }}
        onSubmit={values => setSubmitted(values)}
      />
      <pre
        data-testid="stepper-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function AsyncSubmitFixture() {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="async-submit-fixture"
      title="Async Submit"
      description="Shows the pending submit state and final submitted payload."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformRendererJsonSchema}
        submitLabel="Create trip"
        defaultValues={{
          traveler: { fullName: 'Ada Lovelace', email: 'ada@example.com' },
          country: 'US',
          startAt: '2026-03-20T10:00:00.000Z',
          travelClass: 'economy',
        }}
        onSubmit={async values => {
          await new Promise(resolve => window.setTimeout(resolve, 1000))
          setSubmitted(values)
        }}
      />
      <pre
        data-testid="async-submit-output"
        className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground"
      >
        {JSON.stringify(submitted, null, 2)}
      </pre>
    </FixtureSection>
  )
}

function ServerErrorsFixture() {
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
    [],
  )
  return (
    <FixtureSection
      testId="server-errors-fixture"
      title="Server Errors"
      description="Simulates a valid submit that comes back with field-level and form-level server validation errors."
    >
      <AutoFormModelRenderer
        model={model}
        surface="inline"
        validationSchema={autoformRendererJsonSchema}
        submitLabel="Create trip"
        defaultValues={{
          traveler: { fullName: 'Ada Lovelace', email: 'ada@example.com' },
          country: 'US',
          startAt: '2026-03-20T10:00:00.000Z',
          travelClass: 'economy',
        }}
        onSubmit={async (_values, helpers) => {
          helpers.setServerErrors({ 'traveler.email': ['Email already exists'] }, ['Unable to create trip'])
        }}
      />
    </FixtureSection>
  )
}

function AutoFormE2EPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading as="h1" size="2x">
          AutoForm E2E Fixtures
        </Heading>
        <Text size="sm" className="text-muted-foreground">
          Stable browser test fixtures for the current AutoForm lifecycle slice.
        </Text>
      </div>
      <ValidationFixture />
      <ConditionsFixture />
      <BranchMaterializationFixture />
      <RepeaterFixture />
      <RepeaterBranchFixture />
      <ConstrainedRepeaterFixture />
      <StepperFixture />
      <AsyncSubmitFixture />
      <ServerErrorsFixture />
    </div>
  )
}
