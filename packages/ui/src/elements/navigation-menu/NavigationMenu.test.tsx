import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavigationMenu } from './NavigationMenu'

describe('NavigationMenu', () => {
  it('renders a navigation landmark and direct links', () => {
    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })

  it('renders structured link content', () => {
    render(
      <NavigationMenu.Root defaultValue="platform">
        <NavigationMenu.List>
          <NavigationMenu.Item value="platform">
            <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/platform" title="Platform" description="Team workflows and reporting." />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Portal>
          <NavigationMenu.Positioner>
            <NavigationMenu.Popup />
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>,
    )

    expect(screen.getByRole('button', { name: 'Platform' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Platform/ })).toHaveAttribute('href', '/platform')
  })
})
