import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { AlertDialog } from './AlertDialog'
import {
  alertDialogFooterBySize,
  dialogContentByAlign,
  dialogContentBySize,
  dialogContentPaddingBySize,
  dialogDescriptionBySize,
  dialogPopupBase,
  dialogPopupBaseCls,
  dialogTitleBySize,
} from './dialog.class'

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

    for (const className of [
      ...dialogPopupBaseCls.split(/\s+/),
      ...dialogPopupBase.split(/\s+/),
      dialogContentPaddingBySize.md,
      dialogContentBySize.md,
      ...dialogContentByAlign.center.split(/\s+/),
    ]) {
      expect(dialog.className).toContain(className)
    }

    expect(dialog.className).not.toContain('af-dialog')
    expect(title.className).toContain(dialogTitleBySize.md)
    expect(title.className).toContain('text-neutral')
    expect(description.className).toContain(dialogDescriptionBySize.md)
    expect(description.className).toContain('text-slate')
    expect(footer?.className).toContain(alertDialogFooterBySize.md)
    expect(action.className).toContain('bg-primary-solid')
    expect(action.className).toContain('text-primary-contrast')
    expect(cancel.className).toContain('border-neutral')
    expect(cancel.className).toContain('text-neutral')
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
