import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { AlertDialog } from './AlertDialog'

describe('AlertDialog', () => {
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
