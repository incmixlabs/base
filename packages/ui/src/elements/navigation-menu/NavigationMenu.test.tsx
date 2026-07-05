import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { controlSizeTokens } from '@/theme/token-maps'
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

function classValue(value: string) {
  return value.replace(/\s+/g, '_')
}

function arbitraryValueClass(prefix: string, value: string) {
  return `${prefix}-[${classValue(value)}]`
}

function cssDeclaration(property: string, value: string) {
  return `[${property}:${classValue(value)}]`
}

function controlSizeClassTokens(size: keyof typeof controlSizeTokens) {
  const token = controlSizeTokens[size]
  return {
    fontSize: cssDeclaration('font-size', token.fontSize),
    gap: arbitraryValueClass('gap', token.gap),
    iconHeight: arbitraryValueClass('h', token.iconSize),
    iconWidth: arbitraryValueClass('w', token.iconSize),
    leading: arbitraryValueClass('leading', token.lineHeight),
    minHeight: arbitraryValueClass('min-h', token.height),
    padding: arbitraryValueClass('p', token.paddingX),
    paddingX: arbitraryValueClass('px', token.paddingX),
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
      .find(element => element.getAttribute('data-orientation') === 'horizontal')
    expect(root).toBeTruthy()
    expectClassTokens(root?.className, ['relative', 'z-10', 'flex', 'text-neutral'])
    expect(root?.className).not.toContain('NavigationMenu')

    const trigger = screen.getByRole('button', { name: 'Platform' })
    const mdSize = controlSizeClassTokens('md')
    expectClassTokens(trigger.className, [
      'group',
      mdSize.minHeight,
      mdSize.gap,
      mdSize.paddingX,
      mdSize.fontSize,
      mdSize.leading,
      '[background-color:var(--color-primary-surface)]',
      '[color:var(--color-primary-text)]',
      'hover:[background-color:var(--color-primary-surface-hover)]',
      'hover:[color:var(--color-primary-text)]',
      'data-[popup-open]:[background-color:var(--color-primary-surface)]',
      'data-[popup-open]:[color:var(--color-primary-text)]',
      '[&[data-popup-open].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-primary-solid)]',
    ])
    const triggerIcon = trigger.querySelector('span')
    expectClassTokens(triggerIcon?.className, [mdSize.iconHeight, mdSize.iconWidth])
    expect(trigger.className).not.toContain('navigation-menu-accent')
    expect(trigger.className).not.toContain('color-primary-soft')

    const popup = document.querySelector('[class*="box-shadow:0_18px_48px"]') as HTMLElement | null
    expect(popup).toBeTruthy()
    expectClassTokens(popup?.className, [
      '[background-color:var(--color-primary-background)]',
      '[color:var(--color-primary-text)]',
      '[border-color:var(--color-primary-border)]',
      '[--af-floating-surface-arrow-fill:var(--color-primary-background)]',
      '[--af-floating-surface-arrow-edge:var(--color-primary-border)]',
      '[box-shadow:0_18px_48px_color-mix(in_oklch,black_16%,transparent),0_4px_16px_color-mix(in_oklch,black_10%,transparent)]',
    ])
    expect(popup?.className).not.toContain('text-neutral')
    expect(popup?.className).not.toContain('[fill:')

    const arrow = popup?.querySelector('svg[viewBox="0 0 20 10"]')?.parentElement
    expect(arrow).toBeTruthy()
    expectClassTokens(arrow?.className, [
      'flex',
      '[fill:var(--af-floating-surface-arrow-fill,currentColor)]',
      '[color:var(--af-floating-surface-arrow-edge,currentColor)]',
    ])

    const structuredLink = screen.getByRole('link', { name: /Platform/ })
    expectClassTokens(structuredLink.className, [
      mdSize.padding,
      mdSize.fontSize,
      mdSize.leading,
      '[background-color:var(--color-primary-surface)]',
      '[color:var(--color-primary-text)]',
      'hover:[background-color:var(--color-primary-surface-hover)]',
      'hover:[color:var(--color-primary-text)]',
      'data-[active]:[background-color:var(--color-primary-surface)]',
      'data-[active]:[color:var(--color-primary-text)]',
      '[&[data-active].af-high-contrast]:[box-shadow:inset_0_0_0_1px_var(--color-primary-solid)]',
    ])
    expect(structuredLink.className).not.toContain('navigation-menu-accent')
    expect(structuredLink.className).not.toContain('color-primary-soft')

    const iconSlot = structuredLink.querySelector('span')
    expectClassTokens(iconSlot?.className, ['[&_svg]:h-[1.25rem]', '[&_svg]:w-[1.25rem]'])
    expectClassTokens(screen.getByText('Team workflows and reporting.').className, [
      '[color:color-mix(in_oklch,currentColor_72%,transparent)]',
    ])

    const simpleLink = screen.getByRole('link', { name: 'Pricing' })
    expectClassTokens(simpleLink.className, [
      'inline-flex',
      mdSize.minHeight,
      mdSize.gap,
      mdSize.paddingX,
      mdSize.fontSize,
      mdSize.leading,
      'no-underline',
      '[background-color:var(--color-primary-surface)]',
      '[color:var(--color-primary-text)]',
      'data-[active]:[background-color:var(--color-primary-surface)]',
      'data-[active]:[color:var(--color-primary-text)]',
    ])
    expect(simpleLink.className).not.toContain('navigation-menu-accent')
    expect(simpleLink.className).not.toContain('color-primary-soft')
    expect(simpleLink.className).not.toContain('p-3')
  })

  it('pairs inverse surface and text on resting navigation items', () => {
    render(
      <NavigationMenu.Root defaultValue="product" color="inverse" variant="soft">
        <NavigationMenu.List>
          <NavigationMenu.Item value="product">
            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/platform" title="Platform" description="Team workflows." />
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

    const trigger = screen.getByRole('button', { name: 'Product' })
    expectClassTokens(trigger.className, [
      '[background-color:var(--color-inverse-surface)]',
      '[color:var(--color-inverse-text)]',
      'hover:[background-color:var(--color-inverse-surface-hover)]',
      'hover:[color:var(--color-inverse-text)]',
    ])
    expect(trigger.className).not.toContain('text-neutral')

    const simpleLink = screen.getByRole('link', { name: 'Pricing' })
    expectClassTokens(simpleLink.className, [
      '[background-color:var(--color-inverse-surface)]',
      '[color:var(--color-inverse-text)]',
    ])
    expect(simpleLink.className).not.toContain('text-neutral')

    const popup = document.querySelector('[class*="backdrop-saturate"]') as HTMLElement | null
    expect(popup).toBeTruthy()
    expectClassTokens(popup?.className, [
      '[background-color:var(--color-inverse-surface)]',
      '[color:var(--color-inverse-text)]',
      '[border-color:var(--color-inverse-border-subtle)]',
      '[--af-floating-surface-arrow-fill:var(--color-inverse-surface)]',
      '[--af-floating-surface-arrow-edge:var(--color-inverse-border-subtle)]',
    ])
    expect(popup?.className).not.toContain('text-neutral')
  })
})
