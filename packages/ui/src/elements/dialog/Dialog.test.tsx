import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { heightResponsiveClasses, heightResponsiveVars } from '@/theme/helpers/height-responsive'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Dialog } from './Dialog'

const expectedDialogContentClasses = [
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

describe('Dialog', () => {
  it('renders the semantic surface and size utility classes', async () => {
    const { unmount } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog title</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>Dialog body</Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>,
    )

    const dialog = screen.getByRole('dialog')
    const title = screen.getByText('Dialog title')
    const description = screen.getByText('Dialog description')
    const body = screen.getByText('Dialog body')
    const header = title.parentElement

    expectClassTokens(dialog.className, expectedDialogContentClasses)

    expect(dialog.className).not.toContain('af-dialog')
    expect(dialog.className).not.toContain('component-dialog')
    expectClassTokens(title.className, ['text-base', 'm-0', 'font-semibold', 'text-neutral'])
    expectClassTokens(description.className, ['text-sm', 'text-slate'])
    expectClassTokens(header?.className, ['gap-1.5', 'p-6', 'pb-0'])
    expectClassTokens(body.className, ['p-6'])

    unmount()
    await Promise.resolve()
  })

  it('defaults content radius to the ThemeProvider radius', async () => {
    const { unmount } = render(
      <Theme radius="lg">
        <Dialog.Root defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Dialog title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      </Theme>,
    )

    expect(screen.getByRole('dialog')).toHaveStyle({
      '--element-border-radius': designTokens.radius.lg,
    })

    unmount()
    await Promise.resolve()
  })

  it('applies responsive height props on the dialog content', async () => {
    const { unmount } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content maxHeight={{ initial: '20rem', md: '30rem' }}>
          <Dialog.Title>Dialog title</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    )

    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveClass(heightResponsiveClasses.maxHeight.initial, heightResponsiveClasses.maxHeight.md)
    expect(dialog.style.getPropertyValue(heightResponsiveVars.maxHeight.initial)).toBe('20rem')
    expect(dialog.style.getPropertyValue(heightResponsiveVars.maxHeight.md)).toBe('30rem')

    unmount()
    await Promise.resolve()
  })
})
