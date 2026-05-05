import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DialogWrapper } from './DialogWrapper'
import type { DialogWrapperSchema } from './dialog-wrapper.props'

const TEST_TIMEOUT_MS = 20_000

const fullNameField = {
  type: 'string',
  title: 'Full name',
  placeholder: 'Ada Lovelace',
  minLength: 2,
} as const

const emailField = {
  type: 'string',
  title: 'Email',
  format: 'email',
  placeholder: 'ada@example.com',
} as const

const notesField = {
  type: 'string',
  title: 'Notes',
  format: 'textarea',
  minLength: 5,
} as const

const guestsField = {
  type: 'integer',
  title: 'Guests',
  widget: 'number-input',
  widgetProps: {
    variant: 'button',
    min: 1,
    max: 4,
    step: 1,
    allowDecimal: false,
    iconButton: {
      variant: 'ghost',
      color: 'slate',
    },
  },
} as const

const schema: DialogWrapperSchema = {
  type: 'object',
  title: 'Create account',
  description: 'Dialog wrapper runtime parity test.',
  required: ['fullName', 'email'],
  properties: {
    fullName: fullNameField,
    email: emailField,
    notes: notesField,
    guests: guestsField,
  },
}

const validationSchema = {
  type: 'object',
  required: ['fullName', 'email'],
  properties: {
    fullName: { type: fullNameField.type, minLength: fullNameField.minLength },
    email: { type: emailField.type, format: emailField.format },
    notes: { type: notesField.type, minLength: notesField.minLength },
    guests: { type: guestsField.type, minimum: guestsField.widgetProps.min },
  },
}

describe('DialogWrapper', () => {
  afterEach(() => cleanup())

  it(
    'blocks submit and shows validation errors when the schema is invalid',
    async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <DialogWrapper
          defaultOpen
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'not-an-email' }}
          onSubmit={onSubmit}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit).not.toHaveBeenCalled()
      expect(await screen.findByText(/must match format "email"/i)).toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'shows submitting state for async submit handlers',
    async () => {
      const user = userEvent.setup()
      let resolveSubmit: (() => void) | undefined

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit={false}
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com' }}
          onSubmit={() =>
            new Promise<void>(resolve => {
              resolveSubmit = resolve
            })
          }
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()

      resolveSubmit?.()

      await screen.findByRole('button', { name: 'Submit' })
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'does not close when submit ends with form errors even if closeOnSubmit is true',
    async () => {
      const user = userEvent.setup()

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com' }}
          onSubmit={async (_values, helpers) => {
            helpers.setFormErrors(['Account could not be created'])
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(await screen.findByText('Account could not be created')).toBeInTheDocument()
      await waitFor(() => {
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
      })
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'renders field-level server errors and wires them into aria-describedby',
    async () => {
      const user = userEvent.setup()

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit={false}
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com' }}
          onSubmit={async (_values, helpers) => {
            helpers.setServerErrors({ email: ['Email already exists'] })
          }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      const emailField = screen.getByLabelText('Email')
      const errorText = await screen.findByText('Email already exists')

      expect(emailField).toHaveAttribute('aria-invalid', 'true')
      expect(emailField).toHaveAttribute('aria-describedby', expect.stringContaining('dialog-field-email-error'))
      expect(errorText).toHaveAttribute('id', 'dialog-field-email-error')
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'treats blank optional fields as missing during validation and submit',
    async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit={false}
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com', notes: '' }}
          onSubmit={onSubmit}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Ada Lovelace',
          email: 'ada@example.com',
          notes: undefined,
        }),
        expect.any(Object),
        expect.any(Object),
      )
      expect(screen.queryByText(/must NOT have fewer than 5 characters/i)).not.toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'recovers from rejected submit handlers with a form error message',
    async () => {
      const user = userEvent.setup()
      const onSubmitError = vi.fn()

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com' }}
          onSubmit={async () => {
            throw new Error('boom')
          }}
          onSubmitError={onSubmitError}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
      expect(onSubmitError).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'renders number-input widgets from wrapper schema metadata',
    async () => {
      const user = userEvent.setup()

      render(
        <DialogWrapper
          defaultOpen
          closeOnSubmit={false}
          schema={schema}
          validationSchema={validationSchema}
          defaultValues={{ fullName: 'Ada Lovelace', email: 'ada@example.com', guests: 2 }}
        />,
      )

      await user.click(screen.getByRole('button', { name: /increase value/i }))

      expect(screen.getByDisplayValue('3')).toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )
})
