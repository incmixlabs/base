import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { heightResponsiveClasses, heightResponsiveVars } from '@/theme/helpers/height-responsive.css'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Dialog } from './Dialog'

afterEach(() => {
  cleanup()
})

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

describe('Dialog', () => {
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
