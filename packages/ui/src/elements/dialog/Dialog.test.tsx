import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { heightResponsiveClasses, heightResponsiveVars } from '@/theme/helpers/height-responsive.css'
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
  'max-w-[var(--component-dialog-size-md-max-width,_28rem)]',
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

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

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
    expectClassTokens(title.className, [
      'text-[length:var(--component-dialog-size-md-title-font-size,_var(--font-size-md))]',
      'leading-[var(--component-dialog-size-md-title-line-height,_var(--line-height-md))]',
      'm-0',
      'font-semibold',
      'text-neutral',
    ])
    expectClassTokens(description.className, [
      'text-[length:var(--component-dialog-size-md-description-font-size,_var(--font-size-sm))]',
      'leading-[var(--component-dialog-size-md-description-line-height,_var(--line-height-sm))]',
      'text-slate',
    ])
    expectClassTokens(header?.className, ['gap-1.5', 'p-[var(--component-dialog-size-md-padding,_1.5rem)]', 'pb-0'])
    expectClassTokens(body.className, ['p-[var(--component-dialog-size-md-padding,_1.5rem)]'])

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

    expect(dialog.className).toContain(heightResponsiveClasses.maxHeight)
    expect(dialog.getAttribute('style')).toContain(customPropertyName(heightResponsiveVars.maxHeight.initial))

    unmount()
    await Promise.resolve()
  })
})
