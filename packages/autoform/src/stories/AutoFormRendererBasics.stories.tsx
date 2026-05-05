import { normalizeJsonSchemaWithUiSchema } from '@incmix/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { AutoFormModelRenderer } from '@incmix/autoform'
import { Button } from '@incmix/ui/elements'
import {
  autoformArrayRepeaterJsonSchema,
  autoformArrayRepeaterUiSchema,
  autoformBooleanLayoutUiSchema,
  autoformConstrainedRepeaterJsonSchema,
  autoformConstrainedRepeaterUiSchema,
  autoformDateRulesJsonSchema,
  autoformDateRulesUiSchema,
  autoformDynamicBranchJsonSchema,
  autoformDynamicBranchUiSchema,
  autoformFileUploadJsonSchema,
  autoformFileUploadUiSchema,
  autoformRendererJsonSchema,
  autoformRendererUiSchema,
  autoformRepeaterBranchJsonSchema,
  autoformRepeaterBranchUiSchema,
  autoformResponsiveHorizontalUiSchema,
  autoformResponsiveRendererUiSchema,
  autoformResponsiveWorkspaceJsonSchema,
  autoformResponsiveWorkspaceUiSchema,
  autoformRichWidgetsJsonSchema,
  autoformRichWidgetsUiSchema,
  autoformSelectionAndScheduleJsonSchema,
  autoformSelectionAndScheduleUiSchema,
  autoformSimpleDateRulesJsonSchema,
  autoformSimpleDateRulesUiSchema,
  autoformStepperFileUploadJsonSchema,
  autoformStepperFileUploadUiSchema,
  autoformStepperJsonSchema,
  autoformStepperSelectionAndScheduleJsonSchema,
  autoformStepperSelectionAndScheduleUiSchema,
  autoformStepperUiSchema,
} from './autoform-ui-schema-contract.example'

type RendererDemoProps = {
  surface: 'inline' | 'auto'
  fieldSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'
}

const meta: Meta<RendererDemoProps> = {
  title: 'AutoForm/Renderer/Basics',
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

function RendererDemo({ surface, fieldSize }: RendererDemoProps) {
  const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
  const model = React.useMemo(
    () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
    [],
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Normalized model renderer</h2>
        <p className="text-sm text-muted-foreground">
          This story renders real <code>@incmix/ui</code> fields from the normalized AutoForm model. It is the first
          native renderer slice, not a full replacement for the legacy schema/provider renderer yet.
        </p>
      </div>

      <AutoFormModelRenderer
        model={model}
        surface={surface}
        fieldSize={fieldSize}
        defaultOpen={surface === 'auto'}
        trigger={<Button>Create trip</Button>}
        submitLabel="Create trip"
        onSubmit={nextValues => {
          setSubmitted(nextValues)
        }}
      />

      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-foreground">Submitted values</div>
        <pre className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const InlineForm: Story = {
  name: 'Inline Form',
  render: args => <RendererDemo {...args} surface="inline" />,
}

export const DialogForm: Story = {
  name: 'Dialog Form',
  render: args => <RendererDemo {...args} surface="auto" />,
}

export const DirtyGuardedCancel: Story = {
  name: 'Dirty Guarded Cancel',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformRendererUiSchema),
      [],
    )
    const [cancelCount, setCancelCount] = React.useState(0)

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Dirty guarded cancel</h2>
          <p className="text-sm text-muted-foreground">
            Edit a field, then cancel. AutoForm owns the dirty check and asks before discarding the pending edit.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          submitLabel="Save"
          cancelLabel="Cancel"
          onCancel={() => setCancelCount(count => count + 1)}
          dirtyGuard={{
            description: 'Discard this AutoForm draft?',
            confirmLabel: 'Discard draft',
          }}
          defaultValues={{
            traveler: {
              fullName: 'Ada Lovelace',
              email: 'ada@example.com',
            },
            country: 'US',
            startAt: '2026-04-20T10:00:00.000Z',
            travelClass: 'economy',
          }}
        />

        <p className="text-sm text-muted-foreground">Cancel confirmations: {cancelCount}</p>
      </div>
    )
  },
}

export const ResponsiveLayout: Story = {
  name: 'Responsive Layout',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformResponsiveRendererUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Responsive layout contract</h2>
          <p className="text-sm text-muted-foreground">
            This example uses breakpoint-aware section columns and field spans from the UI schema. Resize the viewport
            to verify that the form stacks on smaller screens and reflows into multiple columns on larger ones.
          </p>
        </div>

        <AutoFormModelRenderer model={model} surface="inline" fieldSize={args.fieldSize} submitLabel="Create trip" />
      </div>
    )
  },
}

export const ResponsiveMultiSectionLayout: Story = {
  name: 'Responsive Multi-Section Layout',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformResponsiveWorkspaceJsonSchema, autoformResponsiveWorkspaceUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Responsive multi-section layout</h2>
          <p className="text-sm text-muted-foreground">
            This example shows a richer responsive form with multiple sections, 1/2/3-column breakpoints, and a full
            width textarea that expands across the current grid.
          </p>
        </div>

        <AutoFormModelRenderer model={model} surface="inline" fieldSize={args.fieldSize} submitLabel="Save profile" />
      </div>
    )
  },
}

export const ResponsiveHorizontalLayout: Story = {
  name: 'Responsive Horizontal Layout',
  render: args => {
    const model = React.useMemo(
      () =>
        normalizeJsonSchemaWithUiSchema(autoformResponsiveWorkspaceJsonSchema, autoformResponsiveHorizontalUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Responsive horizontal layout</h2>
          <p className="text-sm text-muted-foreground">
            This example stays stacked on smaller screens and shifts to a side-label layout at <code>lg</code>.
          </p>
        </div>

        <AutoFormModelRenderer model={model} surface="inline" fieldSize={args.fieldSize} submitLabel="Save profile" />
      </div>
    )
  },
}

export const BooleanLayoutOverrides: Story = {
  name: 'Boolean Layout Overrides',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRendererJsonSchema, autoformBooleanLayoutUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Boolean layout overrides</h2>
          <p className="text-sm text-muted-foreground">
            Boolean fields render as checkbox rows by default, but a field can opt into a stacked layout when the form
            contract needs it.
          </p>
        </div>

        <AutoFormModelRenderer model={model} surface="inline" fieldSize={args.fieldSize} submitLabel="Save changes" />
      </div>
    )
  },
}

export const ArrayRepeaters: Story = {
  name: 'Array Repeaters',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformArrayRepeaterJsonSchema, autoformArrayRepeaterUiSchema),
      [],
    )
    const constrainedModel = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformConstrainedRepeaterJsonSchema, autoformConstrainedRepeaterUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Array repeaters</h2>
          <p className="text-sm text-muted-foreground">
            This example exercises native string-array tag input alongside object-array repeater rendering, min/max
            constraints, row duplication, and richer row summaries.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Primitive and object repeaters</h3>
              <p className="text-sm text-muted-foreground">
                Covers the base repeater slice with primitive lists, nested object rows, duplicate actions, and summary
                headings based on entered values.
              </p>
            </div>
            <AutoFormModelRenderer
              model={model}
              surface="inline"
              fieldSize={args.fieldSize}
              submitLabel="Save roster"
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Constrained repeater behavior</h3>
              <p className="text-sm text-muted-foreground">
                The repeater enforces min/max row counts while still allowing row summaries, duplication, and reordering
                within the limit.
              </p>
            </div>
            <AutoFormModelRenderer
              model={constrainedModel}
              surface="inline"
              fieldSize={args.fieldSize}
              submitLabel="Save household"
              defaultValues={{
                dependents: [{ name: 'Ada Lovelace', relationship: 'Spouse' }],
              }}
            />
          </div>
        </div>
      </div>
    )
  },
}

export const RichWidgets: Story = {
  name: 'Rich Widgets',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRichWidgetsJsonSchema, autoformRichWidgetsUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Rich widget props</h2>
          <p className="text-sm text-muted-foreground">
            This example shows the richer widget-props slice: mention textarea, autocomplete, single avatar selection,
            and array-backed multi-select.
          </p>
          <p className="text-sm text-muted-foreground">
            Mention insertions now store stable tokens like <code>@[Grace Hopper](user:grace)</code> and
            <code>#[Documentation](tag:docs)</code> instead of name-derived values.
          </p>
        </div>

        <AutoFormModelRenderer model={model} surface="inline" fieldSize={args.fieldSize} submitLabel="Save review" />
      </div>
    )
  },
}

export const AssignmentAndScheduleWidgets: Story = {
  name: 'Assignment And Schedule Widgets',
  render: args => {
    const model = React.useMemo(
      () =>
        normalizeJsonSchemaWithUiSchema(autoformSelectionAndScheduleJsonSchema, autoformSelectionAndScheduleUiSchema),
      [],
    )
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Assignment and schedule widgets</h2>
          <p className="text-sm text-muted-foreground">
            This is the actual AutoForm validation surface for avatar picker, country picker, date picker, and date-time
            picker through the native renderer path.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformSelectionAndScheduleJsonSchema}
          submitLabel="Save assignment"
          submitButtonProps={{ color: 'primary', size: 'sm' }}
          onSubmit={values => {
            setSubmitted(values)
          }}
        />

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

export const FileUploadWidget: Story = {
  name: 'File Upload Widget',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformFileUploadJsonSchema, autoformFileUploadUiSchema),
      [],
    )
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">AutoForm file upload</h2>
          <p className="text-sm text-muted-foreground">
            File upload now works as an array widget in AutoForm and submits the underlying <code>UploadedFile[]</code>
            value from the shared <code>FileUpload</code> component.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          submitLabel="Save assets"
          submitButtonProps={{ color: 'primary', size: 'sm' }}
          onSubmit={nextValues => {
            setSubmitted(nextValues)
          }}
        />

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

export const DateRules: Story = {
  name: 'Date Rules',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformDateRulesJsonSchema, autoformDateRulesUiSchema),
      [],
    )
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">First-class date rules</h2>
          <p className="text-sm text-muted-foreground">
            This example wires schema-native date rules into both runtime validation and picker bounds.
          </p>
          <p className="text-sm text-muted-foreground">
            The birth date uses <code>$autoform:dateRules.minAge</code>, the activation date uses
            <code>$autoform:dateRules.mode</code>, and the review date-time uses explicit min/max bounds.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformDateRulesJsonSchema}
          submitLabel="Save dates"
          onSubmit={values => {
            setSubmitted(values)
          }}
        />

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

export const SimpleDateRules: Story = {
  name: 'Simple Date Rules',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformSimpleDateRulesJsonSchema, autoformSimpleDateRulesUiSchema),
      [],
    )
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Simple date rules</h2>
          <p className="text-sm text-muted-foreground">
            This preserves the earlier compact example: minimum age for birth date plus a single future-only appointment
            field.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          submitLabel="Save appointment"
          validationSchema={autoformSimpleDateRulesJsonSchema}
          onSubmit={values => {
            setSubmitted(values)
          }}
        />

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

export const ConditionalBranches: Story = {
  name: 'Conditional Branches',
  render: args => {
    const [rootSubmitted, setRootSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const [repeaterSubmitted, setRepeaterSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const branchModel = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformDynamicBranchJsonSchema, autoformDynamicBranchUiSchema),
      [],
    )
    const repeaterModel = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformRepeaterBranchJsonSchema, autoformRepeaterBranchUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Conditional branch materialization</h2>
          <p className="text-sm text-muted-foreground">
            Branch-only fields are now materialized into the renderer, validated, and pruned from submission when they
            become inactive. The second example shows the same behavior inside repeater item scopes.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Root branch fields</h3>
              <p className="text-sm text-muted-foreground">
                Switching account type should add or remove branch-only controls like VAT ID and nickname.
              </p>
            </div>
            <AutoFormModelRenderer
              model={branchModel}
              surface="inline"
              fieldSize={args.fieldSize}
              validationSchema={autoformDynamicBranchJsonSchema}
              submitLabel="Save account"
              onSubmit={values => {
                setRootSubmitted(values)
              }}
            />
            <pre className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground">
              {JSON.stringify(rootSubmitted, null, 2)}
            </pre>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Repeater item branches</h3>
              <p className="text-sm text-muted-foreground">
                Each dependent row evaluates its own branch and prunes inactive row-only values on submit.
              </p>
            </div>
            <AutoFormModelRenderer
              model={repeaterModel}
              surface="inline"
              fieldSize={args.fieldSize}
              validationSchema={autoformRepeaterBranchJsonSchema}
              defaultValues={{ dependents: [] }}
              submitLabel="Save dependents"
              onSubmit={values => {
                setRepeaterSubmitted(values)
              }}
            />
            <pre className="overflow-auto rounded-xl bg-muted/60 p-3 text-xs leading-5 text-foreground">
              {JSON.stringify(repeaterSubmitted, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    )
  },
}

export const StepperRuntime: Story = {
  name: 'Stepper Runtime',
  render: args => {
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformStepperJsonSchema, autoformStepperUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Stepper runtime</h2>
          <p className="text-sm text-muted-foreground">
            This example maps UI-schema sections into AutoForm steps and gates forward navigation on the current step.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformStepperJsonSchema}
          submitLabel="Create onboarding"
        />
      </div>
    )
  },
}

export const StepperFileUpload: Story = {
  name: 'Stepper File Upload',
  render: args => {
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const model = React.useMemo(
      () => normalizeJsonSchemaWithUiSchema(autoformStepperFileUploadJsonSchema, autoformStepperFileUploadUiSchema),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Stepper file upload</h2>
          <p className="text-sm text-muted-foreground">
            This scenario combines section-driven steps with the AutoForm file-upload widget. The artifacts step
            requires at least one uploaded file before you can continue or submit.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformStepperFileUploadJsonSchema}
          submitLabel="Create release"
          submitButtonProps={{ color: 'primary', size: 'sm' }}
          onSubmit={values => {
            setSubmitted(values)
          }}
        />

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

export const StepperAssignmentAndSchedule: Story = {
  name: 'Stepper Assignment And Schedule',
  render: args => {
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const model = React.useMemo(
      () =>
        normalizeJsonSchemaWithUiSchema(
          autoformStepperSelectionAndScheduleJsonSchema,
          autoformStepperSelectionAndScheduleUiSchema,
        ),
      [],
    )

    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Stepper assignment and schedule</h2>
          <p className="text-sm text-muted-foreground">
            This proves the same AutoForm widget contract composes inside stepper flows without widget-specific
            treatment.
          </p>
        </div>

        <AutoFormModelRenderer
          model={model}
          surface="inline"
          fieldSize={args.fieldSize}
          validationSchema={autoformStepperSelectionAndScheduleJsonSchema}
          submitLabel="Create review plan"
          submitButtonProps={{ color: 'primary', size: 'sm' }}
          onSubmit={values => {
            setSubmitted(values)
          }}
        />

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
