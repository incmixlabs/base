import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { NavigationMenu } from './NavigationMenu'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

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
              <NavigationMenu.Link
                href="/platform"
                title="Platform"
                description="Team workflows and reporting."
                icon={<svg aria-hidden />}
              />
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

  it('renders the Uno navigation menu surface and state class contract', () => {
    render(
      <NavigationMenu.Root defaultValue="platform" color="primary">
        <NavigationMenu.List>
          <NavigationMenu.Item value="platform">
            <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link
                href="/platform"
                title="Platform"
                description="Team workflows and reporting."
                icon={<svg aria-hidden />}
              />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Portal>
          <NavigationMenu.Positioner>
            <NavigationMenu.Popup />
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>,
    )

    const root = screen
      .getAllByRole('navigation')
      .find(element => element.className.split(/\s+/).includes('max-w-full'))
    expect(root).toBeTruthy()
    expectClassTokens(root?.className, ['relative', 'z-10', 'flex', 'text-neutral'])
    expect(root?.className).not.toContain('NavigationMenu')

    const trigger = screen.getByRole('button', { name: 'Platform' })
    expectClassTokens(trigger.className, [
      'group',
      'min-h-[2rem]',
      'px-3',
      'text-base',
      'hover:[background-color:var(--af-navigation-menu-accent-soft-hover)]',
      'data-[popup-open]:[background-color:var(--af-navigation-menu-accent-soft)]',
      '[--af-navigation-menu-accent-soft:var(--color-primary-soft)]',
    ])

    const popup = document.querySelector('[class*="box-shadow:0_18px_48px"]') as HTMLElement | null
    expect(popup).toBeTruthy()
    expectClassTokens(popup?.className, [
      '[background-color:var(--color-neutral-background)]',
      '[border-color:var(--color-neutral-border)]',
      '[box-shadow:0_18px_48px_color-mix(in_oklch,black_16%,transparent),0_4px_16px_color-mix(in_oklch,black_10%,transparent)]',
    ])

    const structuredLink = screen.getByRole('link', { name: /Platform/ })
    expectClassTokens(structuredLink.className, [
      'p-3',
      'text-base',
      'hover:[background-color:var(--af-navigation-menu-accent-soft-hover)]',
      'data-[active]:[background-color:var(--af-navigation-menu-accent-soft)]',
    ])

    const iconSlot = structuredLink.querySelector('span')
    expectClassTokens(iconSlot?.className, ['[&_svg]:h-[1.25rem]', '[&_svg]:w-[1.25rem]'])

    const simpleLink = screen.getByRole('link', { name: 'Pricing' })
    expectClassTokens(simpleLink.className, [
      'inline-flex',
      'min-h-[2rem]',
      'px-3',
      'text-base',
      'no-underline',
      'data-[active]:[background-color:var(--af-navigation-menu-accent-soft)]',
    ])
    expect(simpleLink.className).not.toContain('p-3')
  })
})
