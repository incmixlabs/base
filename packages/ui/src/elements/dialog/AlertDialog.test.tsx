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
  'shadow-[var(--shadow-4)]',
  'duration-200',
  'ease-in-out',
  'focus:outline-none',
  'data-[starting-style]:animate-in',
  'data-[starting-style]:fade-in-0',
  'data-[starting-style]:zoom-in-95',
  'data-[ending-style]:animate-out',
  'data-[ending-style]:fade-out-0',
  'data-[ending-style]:zoom-out-95',
  'inset-x-4',
  'mx-auto',
  'max-h-[calc(100dvh-2rem)]',
  'w-auto',
  'overflow-y-auto',
  'p-6',
  'max-w-md',
  'top-1/2',
  '[translate:0_-50%]',
] as const

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))

  for (const token of tokens) {
    expect(classTokens).toContain(token)
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
    expect(dialog.className).not.toContain('component-dialog')
    expectClassTokens(title.className, ['text-base', 'm-0', 'font-semibold', 'text-neutral'])
    expectClassTokens(description.className, ['text-sm', 'mt-2', 'text-slate'])
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
