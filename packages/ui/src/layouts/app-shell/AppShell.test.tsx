import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

let originalMatchMedia: typeof window.matchMedia

function renderShell({ secondary = false }: { secondary?: boolean } = {}) {
  return render(
    <AppShell.Root defaultOpen defaultSecondaryOpen secondaryLabel="Components">
      <AppShell.Body>
        <AppShell.Sidebar>
          <div>Primary nav</div>
        </AppShell.Sidebar>
        <AppShell.Main>
          <AppShell.Header>
            <AppShell.HeaderInner>
              <AppShell.HeaderStart>
                <AppShell.SidebarTrigger data-testid="app-shell-trigger" />
                <span>Page title</span>
              </AppShell.HeaderStart>
            </AppShell.HeaderInner>
          </AppShell.Header>
          <AppShell.Content>Page content</AppShell.Content>
        </AppShell.Main>
        {secondary ? (
          <AppShell.Secondary aria-label="Components">
            <div>Component list</div>
          </AppShell.Secondary>
        ) : null}
      </AppShell.Body>
    </AppShell.Root>,
  )
}

function renderSecondarySidebarShell() {
  return render(
    <AppShell.Root defaultOpen defaultSecondaryOpen secondaryLabel="Builder">
      <AppShell.Body>
        <AppShell.Main>
          <AppShell.Content>Page content</AppShell.Content>
        </AppShell.Main>
        <AppShell.SecondarySidebar
          aria-label="Builder"
          footer={<button type="button">Save</button>}
          scroll="auto"
          title="Path"
        >
          <div>Scrollable body</div>
        </AppShell.SecondarySidebar>
      </AppShell.Body>
    </AppShell.Root>,
  )
}

describe('AppShell', () => {
  beforeAll(() => {
    originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  beforeEach(() => {
    document.cookie = 'sidebar_state=; path=/; max-age=0'
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    })
  })

  it('uses the header trigger to toggle secondary while primary stays mini', async () => {
    const { container } = renderShell({ secondary: true })

    await waitFor(() => {
      expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle secondary panel')
    })
    expect(container.querySelector('[data-slot="app-shell-primary-expand"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-shell-sidebar-trigger"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-shell-secondary-trigger"]')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('app-shell-trigger'))

    await waitFor(() => {
      expect(screen.queryByText('Component list')).not.toBeInTheDocument()
    })

    expect(container.querySelector('[data-slot="app-shell-primary-expand"]')).toBeInTheDocument()
    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('app-shell-trigger'))

    await waitFor(() => {
      expect(screen.getByText('Component list')).toBeInTheDocument()
    })
  })

  it('uses the bottom primary action to go from expanded to mini mode', async () => {
    const { container } = renderShell({ secondary: true })

    await waitFor(() => {
      expect(container.querySelector('[data-slot="app-shell-primary-expand"]')).toBeInTheDocument()
    })

    fireEvent.click(container.querySelector('[data-slot="app-shell-primary-expand"]') as Element)

    await waitFor(() => {
      expect(screen.getByLabelText('Collapse navigation')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Collapse navigation'))

    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle secondary panel')
    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument()
  })

  it('restores both collapsed sidebars with primary in mini mode', async () => {
    const { container } = renderShell({ secondary: true })

    await waitFor(() => {
      expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle secondary panel')
    })

    fireEvent.click(screen.getByTestId('app-shell-trigger'))
    expect(screen.queryByText('Component list')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close navigation'))
    expect(screen.queryByLabelText('Expand navigation')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Open navigation and secondary panel'))

    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle secondary panel')
    expect(container.querySelector('[data-slot="app-shell-primary-expand"]')).toBeInTheDocument()
    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument()
    expect(screen.getByText('Component list')).toBeInTheDocument()
  })

  it('keeps primary-only shells on the primary expand, mini, and hidden contract', async () => {
    const { container } = renderShell()

    await waitFor(() => {
      expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle sidebar')
    })

    fireEvent.click(screen.getByTestId('app-shell-trigger'))

    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Expand navigation')
    expect(screen.getByLabelText('Close navigation')).toBeInTheDocument()

    const primaryExpand = container.querySelector('[data-slot="app-shell-primary-expand"]')
    expect(primaryExpand).toBeInTheDocument()
    fireEvent.click(primaryExpand as Element)

    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle sidebar')
    expect(screen.getByLabelText('Collapse navigation')).toBeInTheDocument()
  })

  it('keeps secondary sidebar header and footer fixed while only the body scrolls', () => {
    const { container } = renderSecondarySidebarShell()

    const secondary = container.querySelector('[data-slot="app-shell-secondary"]')
    const header = container.querySelector('[data-slot="app-shell-secondary-sidebar-header"]')
    const body = container.querySelector('[data-slot="app-shell-secondary-sidebar-body"]')
    const footer = container.querySelector('[data-slot="app-shell-secondary-sidebar-footer"]')

    expect(secondary).toHaveClass('overflow-y-hidden')
    expect(secondary).not.toHaveClass('overflow-y-auto')
    expect(header).toHaveTextContent('Path')
    expect(body).toHaveClass('overflow-y-auto')
    expect(body).toHaveTextContent('Scrollable body')
    expect(footer).toHaveTextContent('Save')
  })
})
