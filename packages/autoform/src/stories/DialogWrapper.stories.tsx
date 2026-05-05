import type { Meta, StoryObj } from '@storybook/react-vite'
import { DialogWrapper } from '@incmix/autoform'
import { Button, Callout } from '@incmix/ui/elements'
import * as React from 'react'
import type { DialogWrapperProps, DialogWrapperSchema } from '../dialog-wrapper.props'

const accountSchema: DialogWrapperSchema = {
  type: 'object',
  title: 'Create account',
  description: 'Create an account from a schema-driven dialog form.',
  required: ['fullName', 'email', 'plan', 'termsAccepted'],
  properties: {
    fullName: {
      type: 'string',
      title: 'Full name',
      placeholder: 'Alex Morgan',
      minLength: 2,
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      placeholder: 'alex@example.com',
    },
    plan: {
      type: 'string',
      title: 'Plan',
      enum: ['Starter', 'Pro', 'Enterprise'],
      default: 'Starter',
    },
    seats: {
      type: 'integer',
      title: 'Seats',
      default: 5,
      minimum: 1,
    },
    notes: {
      type: 'string',
      title: 'Notes',
      format: 'textarea',
      placeholder: 'Anything else we should know?',
    },
    termsAccepted: {
      type: 'boolean',
      title: 'I agree to the terms',
      default: false,
      const: true,
    },
  },
}

const meta = {
  title: 'AutoForm/DialogWrapper',
  component: DialogWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Data-driven wrapper over Dialog primitives. Accepts JSON-schema-compatible form definitions and supports field/footer render overrides.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<DialogWrapperProps>

export default meta

type Story = StoryObj<DialogWrapperProps>

export const DataDriven: Story = {
  args: {
    trigger: <Button>Create account</Button>,
    schema: accountSchema,
    submitLabel: 'Create',
    cancelLabel: 'Cancel',
    size: 'sm',
  },
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)
    const [lastRuntime, setLastRuntime] = React.useState<{
      isValid: boolean
      submitCount: number
      formErrors: string[]
    } | null>(null)

    return (
      <div className="space-y-4">
        <DialogWrapper
          open={open}
          onOpenChange={setOpen}
          trigger={<Button variant="soft">Open controlled dialog</Button>}
          schema={accountSchema}
          onSubmit={async (values, helpers, runtime) => {
            setLastRuntime({
              isValid: runtime.isValid,
              submitCount: runtime.submitCount,
              formErrors: runtime.formErrors,
            })

            if (values.email === 'alex@example.com') {
              helpers.setServerErrors({ email: ['Email already exists'] }, ['Choose a different email address.'])
              return
            }

            setSubmitted(values)
          }}
          submitLabel="Save"
          cancelLabel="Close"
        />

        {submitted ? (
          <Callout.Root variant="surface" size="sm" className="space-y-2">
            <Callout.Text className="font-medium">Submitted values</Callout.Text>
            <pre>{JSON.stringify(submitted, null, 2)}</pre>
            {lastRuntime ? (
              <Callout.Text className="text-xs text-muted-foreground">
                submitCount: {lastRuntime.submitCount}, isValid: {String(lastRuntime.isValid)}
              </Callout.Text>
            ) : null}
          </Callout.Root>
        ) : null}
      </div>
    )
  },
}

export const WithRenderOverrides: Story = {
  args: {
    trigger: <Button variant="outline">Open customized dialog</Button>,
    schema: accountSchema,
    renderField: (field, defaultRender) => {
      if (field.name === 'plan') {
        return (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Custom field wrapper</div>
            {defaultRender}
          </div>
        )
      }
      return defaultRender
    },
    renderFooter: (_ctx, defaultFooter) => <div className="w-full">{defaultFooter}</div>,
  },
}

export const RuntimeParity: Story = {
  render: () => {
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null)

    return (
      <div className="space-y-4">
        <DialogWrapper
          defaultOpen
          closeOnSubmit
          schema={accountSchema}
          defaultValues={{
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
            plan: 'Starter',
            seats: 5,
            notes: '',
            termsAccepted: true,
          }}
          onSubmit={async (values, helpers) => {
            if (values.email === 'ada@example.com') {
              helpers.setServerErrors({ email: ['Email already exists'] }, ['Account could not be created'])
              return
            }
            setSubmitted(values)
          }}
          submitLabel="Create account"
          trigger={<Button>Open runtime parity dialog</Button>}
        />

        {submitted ? (
          <Callout.Root variant="surface" size="sm" className="space-y-2">
            <Callout.Text className="font-medium">Submitted values</Callout.Text>
            <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </Callout.Root>
        ) : null}
      </div>
    )
  },
}
