import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Button } from '@/elements/button/Button'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { DropdownMenu } from './DropdownMenu'

afterEach(() => {
  cleanup()
})

function renderMenu(arrow: 'down' | 'updown' = 'down') {
  render(
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showTriggerIcon arrow={arrow}>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Profile</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>,
  )
}

describe('DropdownMenu', () => {
  it('renders the default down arrow icon when showTriggerIcon is enabled', () => {
    renderMenu('down')

    const trigger = screen.getByRole('button', { name: 'Open Menu' })
    const icon = trigger.querySelector('svg')
    expect(icon).toBeTruthy()
    expect(icon?.querySelectorAll('path')).toHaveLength(1)
  })

  it('renders the up/down arrow icon when arrow is set to updown', () => {
    renderMenu('updown')

    const trigger = screen.getByRole('button', { name: 'Open Menu' })
    const icon = trigger.querySelector('svg')
    expect(icon).toBeTruthy()
    expect(icon?.querySelectorAll('path')).toHaveLength(2)
  })

  it('opens on ArrowDown keyboard interaction', async () => {
    const user = userEvent.setup()
    renderMenu('updown')

    const trigger = screen.getByRole('button', { name: 'Open Menu' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    expect(await screen.findByText('Profile')).toBeTruthy()
  })

  it('opens on ArrowUp keyboard interaction', async () => {
    const user = userEvent.setup()
    renderMenu('updown')

    const trigger = screen.getByRole('button', { name: 'Open Menu' })
    trigger.focus()
    await user.keyboard('{ArrowUp}')

    expect(await screen.findByText('Profile')).toBeTruthy()
  })

  it('defaults content radius to the ThemeProvider radius', async () => {
    const user = userEvent.setup()

    render(
      <Theme radius="lg">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Theme>,
    )

    await user.click(screen.getByRole('button', { name: 'Open Menu' }))

    const popup = await screen.findByRole('menu')
    expect(popup).toHaveStyle({
      '--element-border-radius': designTokens.radius.lg,
    })
  })
})
