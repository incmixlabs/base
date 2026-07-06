import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { expectClassTokens } from '@/test/class-name-utils'
import { Button } from '@/elements/button/Button'
import { floatingSurfaceElevation } from '@/elements/surface/surface.class'
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

  it('renders the Uno menu surface and item state class contract', async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item color="primary">Profile</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Copy link</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.CheckboxItem checked>Show status bar</DropdownMenu.CheckboxItem>
          <DropdownMenu.RadioGroup value="compact">
            <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    )

    await user.click(screen.getByRole('button', { name: 'Open Menu' }))

    const popup = await screen.findByRole('menu')
    expectClassTokens(popup.className, [
      'border-neutral',
      'bg-neutral-surface',
      'text-neutral',
      'rounded-[var(--element-border-radius)]',
      floatingSurfaceElevation,
    ])
    expect(popup.className).not.toContain('--af-menu')
    expect(popup.className).not.toContain('af-PopperContent')
    expect(popup.className).not.toContain('menu_shared')

    expectClassTokens(popup.firstElementChild?.className, ['p-1'])

    const item = screen.getByRole('menuitem', { name: 'Profile' })
    expectClassTokens(item.className, [
      'h-[2rem]',
      'px-3',
      'text-base',
      'leading-6',
      'text-primary',
      '[&:hover:not([data-disabled])]:bg-primary-solid',
      '[&:hover:not([data-disabled])]:text-primary-contrast',
      'data-[highlighted]:bg-primary-solid',
      'data-[highlighted]:text-primary-contrast',
      'data-[state=open]:bg-primary-highlight',
      'data-[state=open]:text-primary-contrast',
    ])
    expect(item).toHaveAttribute('data-menu-color', 'primary')
    expect(item.className).not.toContain('--af-menu')

    const subTrigger = screen.getByRole('menuitem', { name: 'Share' })
    expectClassTokens(subTrigger.querySelector('svg')?.className.baseVal, ['h-[0.875rem]', 'w-[0.875rem]'])

    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Show status bar' })
    expectClassTokens(checkbox.className, ['pl-4'])
    expectClassTokens(checkbox.querySelector('span')?.className, ['inset-y-0', 'w-[1rem]'])
    expectClassTokens(checkbox.querySelector('svg')?.className.baseVal, ['h-[0.75rem]', 'w-[0.75rem]'])

    const radio = screen.getByRole('menuitemradio', { name: 'Compact' })
    expectClassTokens(radio.className, ['pl-4'])
    expectClassTokens(radio.querySelector('span')?.className, ['inset-y-0', 'w-[1rem]'])
    expectClassTokens(radio.querySelector('svg')?.className.baseVal, ['h-[0.625rem]', 'w-[0.625rem]'])
  })
})
