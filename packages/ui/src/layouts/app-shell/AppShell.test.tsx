import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
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

  it('uses the header trigger as the inline secondary toggle', async () => {
    const { container } = renderShell({ secondary: true })

    await waitFor(() => {
      expect(screen.getByTestId('app-shell-trigger')).toBeInTheDocument()
    })
    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle secondary panel')
    expect(screen.getByLabelText('Close secondary panel')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-shell-secondary-toggle"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-shell-sidebar-trigger"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-shell-secondary-trigger"]')).not.toBeInTheDocument()
  })

  it('uses the header trigger to collapse inline secondary pages', async () => {
    renderShell({ secondary: true })

    await waitFor(() => {
      expect(screen.getByTestId('app-shell-trigger')).toBeInTheDocument()
    })

    expect(screen.getByText('Component list')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('app-shell-trigger'))

    await waitFor(() => {
      expect(screen.queryByText('Component list')).not.toBeInTheDocument()
    })
  })

  it('toggles secondary content from the primary mini menu', () => {
    renderShell({ secondary: true })

    expect(screen.getByText('Component list')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close secondary panel'))

    expect(screen.queryByText('Component list')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Open secondary panel'))

    expect(screen.getByText('Component list')).toBeInTheDocument()
  })

  it('can collapse primary mini navigation and restore all collapsed panels', () => {
    renderShell({ secondary: true })

    fireEvent.click(screen.getByLabelText('Close secondary panel'))
    expect(screen.queryByText('Component list')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close navigation'))
    expect(screen.getByLabelText('Open secondary panel')).not.toBeVisible()

    fireEvent.click(screen.getByLabelText('Open navigation and secondary panel'))

    expect(screen.getByLabelText('Close secondary panel')).toBeInTheDocument()
    expect(screen.getByText('Component list')).toBeInTheDocument()
  })

  it('keeps primary-only shells on the sidebar toggle contract', () => {
    renderShell()

    expect(screen.getByTestId('app-shell-trigger')).toHaveAccessibleName('Toggle sidebar')
  })
})
