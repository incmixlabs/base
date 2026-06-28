import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { CommandSearchInput, type CommandSearchItem, CommandSearchProvider } from './CommandSearch'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('CommandSearch', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  afterEach(() => cleanup())

  function renderSubject(items: CommandSearchItem[]) {
    render(
      <CommandSearchProvider items={items}>
        <CommandSearchInput triggerLabel="Search docs..." />
      </CommandSearchProvider>,
    )
  }

  it('opens from the trigger and filters results', async () => {
    const user = userEvent.setup()

    renderSubject([
      { id: 'intro', label: 'Introduction', description: 'Project overview', keywords: ['docs'], onSelect: vi.fn() },
      { id: 'tokens', label: 'Tokens', description: 'Design token reference', keywords: ['theme'], onSelect: vi.fn() },
    ])

    await user.click(screen.getByRole('button', { name: /Search docs/i }))

    const input = screen.getByRole('combobox')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: 'Command search results' })).toBeInTheDocument()

    await user.type(input, 'token')

    expect(screen.getByRole('option', { name: /Tokens/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Introduction/i })).not.toBeInTheDocument()
  })

  it('renders the Uno command-search class contract without legacy global classes', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CommandSearchProvider
        items={[
          {
            id: 'intro',
            label: 'Introduction',
            description: 'Project overview',
            shortcut: ['⌘', 'K'],
            onSelect: vi.fn(),
          },
        ]}
      >
        <CommandSearchInput triggerLabel="Search docs..." />
      </CommandSearchProvider>,
    )

    const trigger = screen.getByRole('button', { name: /Search docs/i })
    expectClassTokens(trigger.className, ['bg-neutral-surface', 'hover:bg-neutral-soft', 'text-neutral'])
    expect(trigger.className).not.toContain('text-muted-foreground')

    await user.click(trigger)

    expectClassTokens(screen.getByRole('combobox').className, ['h-14', 'placeholder:text-neutral'])
    expectClassTokens(screen.getByRole('listbox', { name: 'Command search results' }).className, [
      'max-h-[50vh]',
      '[&_[cmdk-list-sizer]]:flex',
    ])
    expectClassTokens(screen.getByRole('option', { name: /Introduction/i }).className, [
      'data-[selected=true]:bg-slate-soft',
      'data-[selected=true]:before:bg-primary-solid',
    ])
    expect(container.querySelector('[class*="af-command"], [class*="af-shortcut"]')).not.toBeInTheDocument()
  })

  it('does not force neutral text when a semantic trigger color is provided', () => {
    render(
      <CommandSearchProvider items={[{ id: 'intro', label: 'Introduction', onSelect: vi.fn() }]}>
        <CommandSearchInput triggerLabel="Search docs..." color="primary" />
      </CommandSearchProvider>,
    )

    const trigger = screen.getByRole('button', { name: /Search docs/i })
    expectClassTokens(trigger.className, ['text-primary'])
    expect(trigger.className.split(/\s+/)).not.toContain('text-neutral')
  })

  it('supports keyboard navigation and executes the active item on enter', async () => {
    const user = userEvent.setup()
    const introSelect = vi.fn()
    const tokensSelect = vi.fn()

    renderSubject([
      { id: 'intro', label: 'Introduction', description: 'Project overview', onSelect: introSelect },
      { id: 'tokens', label: 'Tokens', description: 'Design token reference', onSelect: tokensSelect },
    ])

    await user.click(screen.getByRole('button', { name: /Search docs/i }))

    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(tokensSelect).toHaveBeenCalledTimes(1)
    expect(introSelect).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('toggles with the global command shortcut', () => {
    renderSubject([{ id: 'intro', label: 'Introduction', onSelect: vi.fn() }])

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not steal the shortcut while focus is inside editable controls', () => {
    render(
      <div>
        <input aria-label="External input" />
        <CommandSearchProvider items={[{ id: 'intro', label: 'Introduction', onSelect: vi.fn() }]}>
          <CommandSearchInput triggerLabel="Search docs..." />
        </CommandSearchProvider>
      </div>,
    )

    const input = screen.getByRole('textbox', { name: 'External input' })
    input.focus()

    fireEvent.keyDown(input, { key: 'k', metaKey: true })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses a single shortcut owner when multiple providers are mounted', () => {
    render(
      <>
        <CommandSearchProvider items={[{ id: 'first', label: 'First result', onSelect: vi.fn() }]}>
          <CommandSearchInput triggerLabel="First search..." />
        </CommandSearchProvider>
        <CommandSearchProvider items={[{ id: 'second', label: 'Second result', onSelect: vi.fn() }]}>
          <CommandSearchInput triggerLabel="Second search..." />
        </CommandSearchProvider>
      </>,
    )

    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('option', { name: /Second result/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /First result/i })).not.toBeInTheDocument()
  })

  it('maps routes and calls onSelectRoute for the active result', async () => {
    const user = userEvent.setup()
    const onSelectRoute = vi.fn()

    render(
      <CommandSearchProvider
        routes={[
          {
            label: 'Docs',
            pages: [
              { title: 'Introduction', slug: 'docs/introduction', description: 'Start here' },
              { title: 'Tokens', slug: 'docs/tokens', description: 'Theme tokens' },
            ],
          },
        ]}
        onSelectRoute={onSelectRoute}
      >
        <CommandSearchInput triggerLabel="Search docs..." />
      </CommandSearchProvider>,
    )

    await user.click(screen.getByRole('button', { name: /Search docs/i }))

    const input = screen.getByRole('combobox')
    await user.type(input, 'tokens')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSelectRoute).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'docs/tokens', title: 'Tokens' }),
      expect.objectContaining({ label: 'Docs' }),
    )
  })
})
