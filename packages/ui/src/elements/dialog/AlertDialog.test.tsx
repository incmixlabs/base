import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { AlertDialog } from './AlertDialog'

const expectedAlertDialogContentClasses = [
  'fixed',
  'z-50',
  'box-border',
  'rounded-[var(--element-border-radius)]',
  'border',
  'border-solid',
  'border-neutral',
  'bg-neutral-surface',
  'text-neutral',
  '[box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]',
  'focus:outline-none',
  'data-[state=open]:animate-in',
  'data-[state=open]:fade-in-0',
  'data-[state=open]:zoom-in-95',
  'data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0',
  'data-[state=closed]:zoom-out-95',
  'inset-x-4',
  'mx-auto',
  'max-h-[calc(100dvh-2rem)]',
  'w-auto',
  'overflow-y-auto',
  'p-6',
  'max-w-[28rem]',
  'top-1/2',
] as const

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  for (const token of tokens) {
    expect(className).toContain(token)
  }
}

afterEach(() => {
  cleanup()
})

describe('AlertDialog', () => {
  it('renders the semantic surface and action utility classes', () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>Alert title</AlertDialog.Title>
          <AlertDialog.Description>Alert description</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Confirm</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    )

    const dialog = screen.getByRole('alertdialog')
    const title = screen.getByText('Alert title')
    const description = screen.getByText('Alert description')
    const cancel = screen.getByText('Cancel')
    const action = screen.getByText('Confirm')
    const footer = cancel.parentElement

    expectClassTokens(dialog.className, expectedAlertDialogContentClasses)

    expect(dialog.className).not.toContain('af-dialog')
    expectClassTokens(title.className, ['text-base', 'leading-6', 'm-0', 'font-semibold', 'text-neutral'])
    expectClassTokens(description.className, ['text-base', 'leading-6', 'mt-2', 'text-slate'])
    expectClassTokens(footer?.className, ['gap-2'])
    expectClassTokens(action.className, ['border-primary', 'bg-primary-solid', 'text-primary-contrast'])
    expectClassTokens(cancel.className, ['border-neutral', 'bg-transparent', 'text-neutral'])
  })

  it('defaults content radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Content>
            <AlertDialog.Title>Alert title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Theme>,
    )

    expect(screen.getByRole('alertdialog')).toHaveStyle({
      '--element-border-radius': designTokens.radius.lg,
    })
  })
})
