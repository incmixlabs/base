import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { JsonViewEditor } from './JsonViewEditor'
import { jsonViewEditorRowStacked } from './JsonViewEditor.css'
import type { JsonValue } from './json-value.types'

const INTERACTION_TEST_TIMEOUT_MS = 45_000

describe('JsonViewEditor', { timeout: 15_000 }, () => {
  beforeAll(() => {
    vi.stubGlobal('PointerEvent', MouseEvent)
  })

  afterEach(() => {
    cleanup()
  })

  function StatefulEditor({
    value,
    onChange,
    mode,
  }: {
    value: JsonValue
    onChange?: (value: JsonValue) => void
    mode?: 'generic' | 'schema'
  }) {
    const [current, setCurrent] = React.useState(value)

    return (
      <JsonViewEditor
        value={current}
        mode={mode}
        onChange={next => {
          setCurrent(next)
          onChange?.(next)
        }}
      />
    )
  }

  async function chooseAddType(
    user: ReturnType<typeof userEvent.setup>,
    container: HTMLElement,
    targetName: string,
    typeLabel: string,
  ) {
    const view = within(container)
    const addButtons = view.getAllByRole('button', { name: `Add child to ${targetName}` })
    const addButton = addButtons[addButtons.length - 1]
    expect(addButton).toBeDefined()
    await user.click(addButton as HTMLElement)
    fireEvent.click(await screen.findByRole('menuitem', { name: typeLabel }))
  }

  function getTreeItemById(id: string): HTMLElement {
    const item = Array.from(document.querySelectorAll<HTMLElement>('[data-tree-item-id]')).find(
      node => node.getAttribute('data-tree-item-id') === id,
    )
    if (!item) throw new Error(`Expected tree item "${id}" to be present.`)
    if (item.getAttribute('role') !== 'treeitem') {
      throw new Error(`Expected "${id}" to have role="treeitem".`)
    }
    return item
  }

  it('updates nested string values inline', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      profile: {
        fullName: 'Ada Lovelace',
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    const input = screen.getByRole('textbox', { name: 'fullName value' })
    await user.clear(input)
    await user.type(input, 'Grace Hopper')

    expect(handleChange).toHaveBeenLastCalledWith({
      profile: {
        fullName: 'Grace Hopper',
      },
    })
  })

  it('updates boolean values inline without toggling tree state', () => {
    const handleChange = vi.fn()
    const value: JsonValue = {
      settings: {
        enabled: false,
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    fireEvent.click(screen.getByRole('checkbox'))

    expect(handleChange).toHaveBeenCalledWith({
      settings: {
        enabled: true,
      },
    })
    expect(screen.getByText('enabled')).toBeInTheDocument()
  })

  it('reverts blank numeric edits instead of coercing to zero', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      settings: {
        retries: 3,
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    const input = screen.getByRole('textbox', { name: 'retries value' })
    await user.clear(input)
    fireEvent.blur(input)

    expect(handleChange).not.toHaveBeenCalled()
    expect(input).toHaveValue('3')
  })

  it('keeps empty root containers editable', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    const { container } = render(<StatefulEditor value={{}} onChange={handleChange} />)
    await chooseAddType(user, container, 'root', 'String')

    expect(handleChange).toHaveBeenCalledWith({
      newKey: '',
    })
  })

  it(
    'adds typed children to objects and arrays',
    async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const value: JsonValue = {
        settings: {
          enabled: false,
        },
        items: ['a'],
      }

      const { container } = render(<StatefulEditor value={value} onChange={handleChange} />)

      await chooseAddType(user, container, 'settings', 'Boolean')
      expect(handleChange).toHaveBeenLastCalledWith({
        settings: {
          enabled: false,
          newKey: false,
        },
        items: ['a'],
      })

      await chooseAddType(user, container, 'items', 'Object')
      expect(handleChange).toHaveBeenLastCalledWith({
        settings: {
          enabled: false,
          newKey: false,
        },
        items: ['a', {}],
      })
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'renames object keys and removes nodes',
    async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const value: JsonValue = {
        profile: {
          fullName: 'Ada Lovelace',
          enabled: true,
        },
      }

      render(<StatefulEditor value={value} onChange={handleChange} />)

      const renameButtons = screen.getAllByRole('button', { name: 'Rename fullName' })
      const renameButton = renameButtons[renameButtons.length - 1]
      expect(renameButton).toBeDefined()
      await user.click(renameButton as HTMLElement)
      const keyInput = screen.getByRole('textbox', { name: 'fullName key' })
      fireEvent.change(keyInput, { target: { value: 'displayName' } })
      fireEvent.keyDown(keyInput, { key: 'Enter' })

      expect(handleChange).toHaveBeenLastCalledWith({
        profile: {
          displayName: 'Ada Lovelace',
          enabled: true,
        },
      })

      const removeButtons = screen.getAllByRole('button', { name: 'Remove enabled' })
      const removeButton = removeButtons[removeButtons.length - 1]
      expect(removeButton).toBeDefined()
      await user.click(removeButton as HTMLElement)

      expect(handleChange).toHaveBeenLastCalledWith({
        profile: {
          displayName: 'Ada Lovelace',
        },
      })
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'clones object keys and array items',
    () => {
      const handleChange = vi.fn()
      const value: JsonValue = {
        profile: {
          fullName: 'Ada Lovelace',
        },
        items: ['a'],
      }

      render(<StatefulEditor value={value} onChange={handleChange} />)

      const cloneKeyButtons = screen.getAllByRole('button', { name: 'Clone fullName' })
      const cloneKeyButton = cloneKeyButtons[cloneKeyButtons.length - 1]
      expect(cloneKeyButton).toBeDefined()
      fireEvent.click(cloneKeyButton as HTMLElement)

      expect(handleChange).toHaveBeenLastCalledWith({
        profile: {
          fullName: 'Ada Lovelace',
          fullNameCopy: 'Ada Lovelace',
        },
        items: ['a'],
      })

      const clonedObjectRow = getTreeItemById('root/profile/fullNameCopy')
      expect(clonedObjectRow).toHaveAttribute('aria-selected', 'true')

      const renameButtons = screen.getAllByRole('button', { name: 'Rename fullName' })
      const renameButton = renameButtons[renameButtons.length - 1]
      expect(renameButton).toBeDefined()
      fireEvent.click(renameButton as HTMLElement)
      const keyInput = screen.getByRole('textbox', { name: 'fullName key' })
      fireEvent.change(keyInput, { target: { value: 'displayName' } })
      fireEvent.keyDown(keyInput, { key: 'Enter' })

      expect(handleChange).toHaveBeenLastCalledWith({
        profile: {
          displayName: 'Ada Lovelace',
          fullNameCopy: 'Ada Lovelace',
        },
        items: ['a'],
      })

      const cloneArrayButtons = screen.getAllByRole('button', { name: 'Clone [0]' })
      const cloneArrayButton = cloneArrayButtons[cloneArrayButtons.length - 1]
      expect(cloneArrayButton).toBeDefined()
      fireEvent.click(cloneArrayButton as HTMLElement)

      expect(handleChange).toHaveBeenLastCalledWith({
        profile: {
          displayName: 'Ada Lovelace',
          fullNameCopy: 'Ada Lovelace',
        },
        items: ['a', 'a'],
      })

      const clonedArrayRow = getTreeItemById('root/items/1')
      expect(clonedArrayRow).toHaveAttribute('aria-selected', 'true')
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it('preserves whitespace when renaming keys', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      profile: {
        fullName: 'Ada Lovelace',
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    const renameButtons = screen.getAllByRole('button', { name: 'Rename fullName' })
    const renameButton = renameButtons[renameButtons.length - 1]
    expect(renameButton).toBeDefined()
    await user.click(renameButton as HTMLElement)

    const keyInput = screen.getByRole('textbox', { name: 'fullName key' })
    await user.clear(keyInput)
    await user.type(keyInput, ' displayName ')
    fireEvent.keyDown(keyInput, { key: 'Enter' })

    expect(handleChange).toHaveBeenLastCalledWith({
      profile: {
        ' displayName ': 'Ada Lovelace',
      },
    })
  })

  it('rejects duplicate key renames without emitting changes', () => {
    const handleChange = vi.fn()
    const value: JsonValue = {
      profile: {
        fullName: 'Ada Lovelace',
        displayName: 'Ada',
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    const renameButtons = screen.getAllByRole('button', { name: 'Rename fullName' })
    const renameButton = renameButtons[renameButtons.length - 1]
    expect(renameButton).toBeDefined()
    fireEvent.click(renameButton as HTMLElement)

    const keyInput = screen.getByRole('textbox', { name: 'fullName key' })
    fireEvent.change(keyInput, { target: { value: 'displayName' } })
    fireEvent.keyDown(keyInput, { key: 'Enter' })

    expect(handleChange).not.toHaveBeenCalled()

    const reopenedRenameButtons = screen.getAllByRole('button', { name: 'Rename fullName' })
    const reopenedRenameButton = reopenedRenameButtons[reopenedRenameButtons.length - 1]
    expect(reopenedRenameButton).toBeDefined()
    fireEvent.click(reopenedRenameButton as HTMLElement)

    expect(screen.getByRole('textbox', { name: 'fullName key' })).toHaveValue('fullName')
  })

  it('renders read-only when editable is false', () => {
    const value: JsonValue = {
      profile: {
        fullName: 'Ada Lovelace',
        enabled: true,
      },
    }

    const { container } = render(<JsonViewEditor value={value} editable={false} />)
    const view = within(container)

    expect(view.queryByRole('textbox', { name: 'fullName value' })).not.toBeInTheDocument()
    expect(view.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(view.queryByRole('button', { name: 'Rename fullName' })).not.toBeInTheDocument()
    expect(view.getByText('"Ada Lovelace"')).toBeInTheDocument()
    expect(view.getByText('true')).toBeInTheDocument()
  })

  it('renders read-only when editable is true but onChange is absent', () => {
    const value: JsonValue = {
      profile: {
        fullName: 'Ada Lovelace',
      },
    }

    const { container } = render(<JsonViewEditor value={value} editable />)
    const view = within(container)

    expect(view.queryByRole('textbox', { name: 'fullName value' })).not.toBeInTheDocument()
    expect(view.queryByRole('button', { name: 'Rename fullName' })).not.toBeInTheDocument()
    expect(view.getByText('"Ada Lovelace"')).toBeInTheDocument()
  })

  it('does not submit an enclosing form when Enter commits an inline edit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn(event => event.preventDefault())

    function FormWrappedEditor() {
      const [value, setValue] = React.useState<JsonValue>({
        settings: {
          retries: 3,
        },
      })

      return (
        <form onSubmit={handleSubmit}>
          <JsonViewEditor value={value} onChange={setValue} />
          <button type="submit">Submit</button>
        </form>
      )
    }

    const { container } = render(<FormWrappedEditor />)
    const view = within(container)

    const input = view.getByRole('textbox', { name: 'retries value' })
    await user.clear(input)
    await user.type(input, '5')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(handleSubmit).not.toHaveBeenCalled()
    expect(input).toHaveValue('5')
  })

  it('reorders sibling items when dragged within the same parent', () => {
    const handleChange = vi.fn()
    const value: JsonValue = {
      items: ['a', 'b'],
      profile: {
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    }

    render(<StatefulEditor value={value} onChange={handleChange} />)

    const dataTransfer = {
      getData: vi.fn((type: string) => (type === 'text/plain' ? 'root/items/0' : '')),
      setData: vi.fn(),
    }

    const arrayTarget = screen.getByRole('treeitem', { name: /\[1\]/i })
    fireEvent.dragOver(arrayTarget, { dataTransfer })
    fireEvent.drop(arrayTarget, { dataTransfer })

    expect(handleChange).toHaveBeenLastCalledWith({
      items: ['a', 'b'],
      profile: {
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    })

    const objectTransfer = {
      getData: vi.fn((type: string) => (type === 'text/plain' ? 'root/profile/firstName' : '')),
      setData: vi.fn(),
    }

    const objectTarget = screen.getByRole('treeitem', { name: /lastName/i })
    fireEvent.dragOver(objectTarget, { dataTransfer: objectTransfer })
    fireEvent.drop(objectTarget, { dataTransfer: objectTransfer })

    expect(handleChange).toHaveBeenLastCalledWith({
      items: ['a', 'b'],
      profile: {
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    })
  })

  it('filters visible nodes when search is enabled', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: '#/$defs/account',
        },
        profile: {
          title: 'Profile',
        },
      },
    }

    render(<JsonViewEditor value={value} searchable editable={false} />)

    await user.type(screen.getByRole('textbox', { name: 'root search' }), '$ref')

    expect(await screen.findByText('$ref')).toBeInTheDocument()
    expect(await screen.findByText('"#/$defs/account"')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('title')).not.toBeInTheDocument())
  })

  it('matches full JSON paths when search is enabled', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: '#/$defs/account',
        },
        profile: {
          title: 'Profile',
        },
      },
    }

    render(<JsonViewEditor value={value} searchable editable={false} />)

    await user.type(screen.getByRole('textbox', { name: 'root search' }), 'properties.account.$ref')

    expect(await screen.findByText('$ref')).toBeInTheDocument()
    expect(await screen.findByText('"#/$defs/account"')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('profile')).not.toBeInTheDocument())
  })

  it('resolves local $ref values and jumps to the target node', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      $defs: {
        account: {
          title: 'Account',
        },
      },
      properties: {
        account: {
          $ref: '#/$defs/account',
        },
      },
    }

    render(<JsonViewEditor value={value} searchable editable={false} />)

    expect(screen.getAllByText('$defs.account').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const target = getTreeItemById('root/%24defs/account')

    expect(target).toHaveAttribute('aria-selected', 'true')
  })

  it('resolves external $ref values and jumps to the external schema subtree', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json#/$defs/account',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        externalSchemas={{
          'https://example.com/account.schema.json': {
            title: 'Account schema',
            $defs: {
              account: {
                title: 'External account',
                type: 'object',
              },
            },
          },
        }}
      />,
    )

    expect(screen.getAllByText('https://example.com/account.schema.json#$defs.account').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const target = getTreeItemById('external/https%3A%2F%2Fexample.com%2Faccount.schema.json/%24defs/account')

    expect(screen.getByText('External schemas')).toBeInTheDocument()
    expect(target).toHaveAttribute('aria-selected', 'true')
  })

  it('resolves external $ref values from exact-ref registry keys and jumps to the external schema subtree', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json#/$defs/account',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        externalSchemas={{
          'https://example.com/account.schema.json#/$defs/account': {
            title: 'External account',
            type: 'object',
          },
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const target = getTreeItemById('external/https%3A%2F%2Fexample.com%2Faccount.schema.json%23%2F%24defs%2Faccount')

    expect(screen.getByText('External schemas')).toBeInTheDocument()
    expect(target).toHaveAttribute('aria-selected', 'true')
  })

  it('resolves percent-encoded external $ref fragments against the external document', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json#/$defs/first%20account',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        externalSchemas={{
          'https://example.com/account.schema.json': {
            title: 'Account schema',
            $defs: {
              'first account': {
                title: 'First account',
                type: 'object',
              },
            },
          },
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const target = getTreeItemById('external/https%3A%2F%2Fexample.com%2Faccount.schema.json/%24defs/first%20account')

    expect(target).toHaveAttribute('aria-selected', 'true')
  })

  it('prefers document-root external schemas over exact-ref registry keys for jump targets', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json#/$defs/account',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        externalSchemas={{
          'https://example.com/account.schema.json': {
            title: 'Account schema',
            $defs: {
              account: {
                title: 'Document account',
                type: 'object',
              },
            },
          },
          'https://example.com/account.schema.json#/$defs/account': {
            title: 'Exact registry account',
            type: 'object',
          },
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const documentTarget = getTreeItemById('external/https%3A%2F%2Fexample.com%2Faccount.schema.json/%24defs/account')
    const exactTarget = getTreeItemById(
      'external/https%3A%2F%2Fexample.com%2Faccount.schema.json%23%2F%24defs%2Faccount',
    )

    expect(documentTarget).toHaveAttribute('aria-selected', 'true')
    expect(exactTarget).not.toHaveAttribute('aria-selected', 'true')
  })

  it('resolves local refs inside synthetic external schema trees against the external document', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        externalSchemas={{
          'https://example.com/account.schema.json': {
            type: 'object',
            properties: {
              profile: {
                $ref: '#/$defs/profile',
              },
            },
            $defs: {
              profile: {
                title: 'External profile',
                type: 'object',
              },
            },
          },
        }}
      />,
    )

    const mainRefRow = getTreeItemById('root/properties/account/%24ref')

    await user.click(within(mainRefRow).getByRole('button', { name: 'Jump to $ref target' }))

    const externalRefRow = getTreeItemById(
      'external/https%3A%2F%2Fexample.com%2Faccount.schema.json/properties/profile/%24ref',
    )

    await user.click(within(externalRefRow).getByRole('button', { name: 'Jump to $ref target' }))

    const target = getTreeItemById('external/https%3A%2F%2Fexample.com%2Faccount.schema.json/%24defs/profile')

    expect(target).toHaveAttribute('aria-selected', 'true')
  })

  it('renders $ref containers as read-only while keeping jump navigation', () => {
    const value: JsonValue = {
      $defs: {
        account: {
          title: 'Account',
          type: 'object',
        },
      },
      properties: {
        account: {
          $ref: '#/$defs/account',
        },
      },
    }

    render(<JsonViewEditor value={value} editable onChange={vi.fn()} />)

    expect(screen.getByText('reference')).toBeInTheDocument()
    expect(screen.getByText('#/$defs/account')).toBeInTheDocument()

    const referenceContainer = getTreeItemById('root/properties/account')

    const referenceView = within(referenceContainer)
    expect(referenceContainer).not.toHaveAttribute('draggable', 'true')
    expect(referenceView.queryByRole('textbox', { name: '$ref value' })).not.toBeInTheDocument()
    expect(referenceView.queryByRole('button', { name: 'Rename account' })).not.toBeInTheDocument()
    expect(referenceView.queryByRole('button', { name: 'Add child to account' })).not.toBeInTheDocument()
    expect(referenceView.queryByRole('button', { name: 'Clone account' })).not.toBeInTheDocument()
    expect(referenceView.queryByRole('button', { name: 'Remove account' })).not.toBeInTheDocument()
    expect(referenceView.queryByRole('button', { name: 'Jump to account target' })).not.toBeInTheDocument()

    const refRow = getTreeItemById('root/properties/account/%24ref')

    expect(within(refRow).getByRole('button', { name: 'Jump to $ref target' })).toBeInTheDocument()
  })

  it.each([
    'oneOf',
    'anyOf',
    'allOf',
  ] as const)('surfaces %s nodes with explicit labels and option counts', combinator => {
    const value: JsonValue = {
      properties: {
        contact: {
          [combinator]: [
            { type: 'string', title: 'Email' },
            { type: 'string', title: 'Phone' },
          ],
        },
      },
    }

    render(<JsonViewEditor value={value} editable={false} />)

    const combinatorRow = screen
      .getAllByRole('treeitem', { name: new RegExp(combinator, 'i') })
      .find(node => node.getAttribute('data-tree-item-id') === `root/properties/contact/${combinator}`)

    expect(combinatorRow).toBeDefined()
    expect(within(combinatorRow as HTMLElement).getAllByText(combinator).length).toBeGreaterThan(0)
    expect(within(combinatorRow as HTMLElement).getByText('2 options')).toBeInTheDocument()
  })

  it(
    'uses a schema-mode branch selector for oneOf rows',
    async () => {
      const user = userEvent.setup()
      const value: JsonValue = {
        type: 'object',
        properties: {
          variant: {
            oneOf: [
              {
                title: 'Email branch',
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                  },
                },
              },
              {
                title: 'Phone branch',
                type: 'object',
                properties: {
                  phone: {
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      }

      render(<StatefulEditor value={value} mode="schema" />)

      const oneOfRow = screen
        .getAllByRole('treeitem', { name: /oneOf/i })
        .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/variant/oneOf')
      expect(oneOfRow).toBeDefined()
      expect(within(oneOfRow as HTMLElement).getByRole('combobox', { name: 'oneOf branch' })).toBeInTheDocument()
      expect(within(oneOfRow as HTMLElement).queryByRole('button', { name: 'Rename oneOf' })).not.toBeInTheDocument()
      expect(
        within(oneOfRow as HTMLElement).queryByRole('button', { name: 'Add child to oneOf' }),
      ).not.toBeInTheDocument()

      const selectedBranchRow = screen
        .getAllByRole('treeitem', { name: /Selected branch/i })
        .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/variant/oneOf/selected-branch')
      expect(selectedBranchRow).toBeDefined()
      expect(within(selectedBranchRow as HTMLElement).getByText('Email branch')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Rename email' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Rename phone' })).not.toBeInTheDocument()
      expect(
        screen.queryByRole('treeitem', {
          name: /\[0\]/i,
        }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('treeitem', {
          name: /\[1\]/i,
        }),
      ).not.toBeInTheDocument()

      const branchSelector = within(oneOfRow as HTMLElement).getByRole('combobox', { name: 'oneOf branch' })
      branchSelector.focus()
      await user.keyboard('{ArrowDown}')
      await user.click(await screen.findByRole('option', { name: 'Phone branch' }))

      const updatedSelectedBranchRow = screen
        .getAllByRole('treeitem', { name: /Selected branch/i })
        .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/variant/oneOf/selected-branch')
      expect(updatedSelectedBranchRow).toBeDefined()
      expect(within(updatedSelectedBranchRow as HTMLElement).getByText('Phone branch')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Rename email' })).not.toBeInTheDocument()
      expect(await screen.findByRole('button', { name: 'Rename phone' })).toBeInTheDocument()
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'keeps oneOf branch selection stable when labels collide with deduped formats',
    async () => {
      const user = userEvent.setup()
      const value: JsonValue = {
        type: 'object',
        properties: {
          variant: {
            oneOf: [
              {
                title: 'Option (2)',
                type: 'object',
                properties: {
                  first: {
                    type: 'string',
                  },
                },
              },
              {
                title: 'Option',
                type: 'object',
                properties: {
                  second: {
                    type: 'string',
                  },
                },
              },
              {
                title: 'Option',
                type: 'object',
                properties: {
                  third: {
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      }

      render(<StatefulEditor value={value} mode="schema" />)

      const oneOfRow = screen
        .getAllByRole('treeitem', { name: /oneOf/i })
        .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/variant/oneOf')
      expect(oneOfRow).toBeDefined()

      const branchSelector = within(oneOfRow as HTMLElement).getByRole('combobox', { name: 'oneOf branch' })
      expect(branchSelector).toHaveTextContent('Option (2)')

      branchSelector.focus()
      await user.keyboard('{ArrowDown}')

      const optionRows = screen.getAllByRole('option')
      expect(optionRows).toHaveLength(3)
      expect(optionRows[0]).toHaveTextContent('Option (2)')
      expect(optionRows[1]).toHaveTextContent('Option')
      expect(optionRows[2]).toHaveTextContent('Option')

      await user.click(optionRows[1])

      expect(screen.getByRole('button', { name: 'Rename second' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Rename first' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Rename third' })).not.toBeInTheDocument()
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it('renders all inline issues against matching JSON paths', () => {
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        editable={false}
        issues={{
          'properties.account.$ref': [
            'schemaToAst: external $ref is not supported at $.properties.account.$ref',
            'reference target could not be normalized',
          ],
        }}
      />,
    )

    const refRow = getTreeItemById('root/properties/account/%24ref')

    expect(refRow.querySelector('[data-has-issues="true"]')).toBeInTheDocument()
    expect(within(refRow).getByText(/external \$ref is not supported/i)).toBeInTheDocument()
    expect(within(refRow).getByText(/reference target could not be normalized/i)).toBeInTheDocument()
  })

  it('does not apply main-schema issues to synthetic external schema rows', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        account: {
          $ref: 'https://example.com/account.schema.json',
        },
      },
    }

    render(
      <JsonViewEditor
        value={value}
        searchable
        editable={false}
        issues={{
          $root: ['root-level schema issue'],
        }}
        externalSchemas={{
          'https://example.com/account.schema.json': {
            title: 'External account',
            type: 'object',
          },
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Jump to $ref target' }))

    const externalRoot = getTreeItemById('external-schemas')

    expect(externalRoot.querySelector('[data-has-issues="true"]')).not.toBeInTheDocument()
    expect(within(externalRoot).queryByText(/root-level schema issue/i)).not.toBeInTheDocument()
  })

  it('uses a select for schema format values', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
      },
    }

    render(<StatefulEditor value={value} mode="schema" onChange={handleChange} />)

    const formatRow = screen
      .getAllByRole('treeitem', { name: /format/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/email/format')
    expect(formatRow).toBeDefined()

    const formatSelector = within(formatRow as HTMLElement).getByRole('combobox', { name: 'format value' })
    formatSelector.focus()
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('option', { name: 'uuid' }))

    expect(handleChange).toHaveBeenLastCalledWith({
      properties: {
        email: {
          type: 'string',
          format: 'uuid',
        },
      },
    })
  })

  it('surfaces schema-intent hints and suppresses raw type chips on managed schema rows', () => {
    const value: JsonValue = {
      properties: {
        email: {
          title: 'Email address',
          description: 'Primary contact',
          type: 'string',
          format: 'email',
          default: 'ada@example.com',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    const typeRow = screen
      .getAllByRole('treeitem', { name: /type/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/email/type')
    expect(typeRow).toBeDefined()
    expect(within(typeRow as HTMLElement).getByText('Edit schema type')).toBeInTheDocument()
    expect(within(typeRow as HTMLElement).queryByText(/^string$/)).not.toBeInTheDocument()

    const defaultRow = screen
      .getAllByRole('treeitem', { name: /default/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/email/default')
    expect(defaultRow).toBeDefined()
    expect(within(defaultRow as HTMLElement).getByText('Edit default preview value')).toBeInTheDocument()
  })

  it('keeps read-only schema-managed rows on the normal summary path', () => {
    const value: JsonValue = {
      properties: {
        email: {
          type: 'string',
          title: 'Email address',
        },
      },
    }

    render(<JsonViewEditor value={value} editable={false} mode="schema" />)

    const typeRow = screen
      .getAllByRole('treeitem', { name: /type/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/email/type')
    expect(typeRow).toBeDefined()
    expect(within(typeRow as HTMLElement).queryByText('Edit schema type')).not.toBeInTheDocument()
    expect(within(typeRow as HTMLElement).getByText('string')).toBeInTheDocument()
  })

  it('preserves custom schema format values in the select list', async () => {
    const user = userEvent.setup()
    const value: JsonValue = {
      properties: {
        accountId: {
          type: 'string',
          format: 'iban',
        },
      },
    }

    render(<StatefulEditor value={value} mode="schema" />)

    const formatRow = screen
      .getAllByRole('treeitem', { name: /format/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/accountId/format')
    expect(formatRow).toBeDefined()

    await user.click(within(formatRow as HTMLElement).getByRole('combobox', { name: 'format value' }))

    expect(await screen.findByRole('option', { name: 'iban' })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'uuid' })).toBeInTheDocument()
  })

  it(
    'uses a select for schema default values constrained by enum',
    async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const value: JsonValue = {
        properties: {
          contactMethod: {
            type: 'string',
            enum: ['email', 'phone'],
            default: 'email',
          },
        },
      }

      render(<StatefulEditor value={value} mode="schema" onChange={handleChange} />)

      const defaultRow = screen
        .getAllByRole('treeitem', { name: /default/i })
        .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/contactMethod/default')
      expect(defaultRow).toBeDefined()

      const defaultSelector = within(defaultRow as HTMLElement).getByRole('combobox', { name: 'default value' })
      await user.click(defaultSelector)
      await user.click(await screen.findByRole('option', { name: 'phone' }))

      expect(handleChange).toHaveBeenLastCalledWith({
        properties: {
          contactMethod: {
            type: 'string',
            enum: ['email', 'phone'],
            default: 'phone',
          },
        },
      })
    },
    INTERACTION_TEST_TIMEOUT_MS,
  )

  it('uses a select for schema default values constrained by const', async () => {
    const value: JsonValue = {
      properties: {
        contactMethod: {
          type: 'string',
          const: 'email',
          default: 'email',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    const defaultRow = screen
      .getAllByRole('treeitem', { name: /default/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/contactMethod/default')
    expect(defaultRow).toBeDefined()
    expect(within(defaultRow as HTMLElement).getByRole('combobox', { name: 'default value' })).toBeInTheDocument()
  })

  it('uses a textarea for schema description values', () => {
    const value: JsonValue = {
      properties: {
        profile: {
          type: 'object',
          description: 'Public profile fields shown to end users.',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    const descriptionRow = screen
      .getAllByRole('treeitem', { name: /description/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/profile/description')
    expect(descriptionRow).toBeDefined()

    const descriptionField = within(descriptionRow as HTMLElement).getByRole('textbox', { name: 'description value' })
    expect(descriptionField.tagName).toBe('TEXTAREA')
  })

  it('suppresses generic rename and clone actions for schema metadata keywords', () => {
    const value: JsonValue = {
      properties: {
        profile: {
          title: 'Profile',
          description: 'Public profile fields',
          default: 'guest',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    for (const itemId of [
      'root/properties/profile/title',
      'root/properties/profile/description',
      'root/properties/profile/default',
    ]) {
      const row = getTreeItemById(itemId)
      expect(within(row).queryByRole('button', { name: /rename/i })).not.toBeInTheDocument()
      expect(within(row).queryByRole('button', { name: /clone/i })).not.toBeInTheDocument()
    }
  })

  it('suppresses generic rename and clone actions for schema keyword rows while preserving them for property entries', () => {
    const value: JsonValue = {
      properties: {
        profile: {
          type: 'object',
          format: 'email',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    const propertyRow = getTreeItemById('root/properties/profile')
    expect(within(propertyRow).getByRole('button', { name: 'Rename profile' })).not.toHaveAttribute('title')
    expect(within(propertyRow).getByRole('button', { name: 'Clone profile' })).not.toHaveAttribute('title')
    expect(within(propertyRow).getByRole('button', { name: 'Add child to profile' })).not.toHaveAttribute('title')

    const typeRow = getTreeItemById('root/properties/profile/type')
    expect(within(typeRow).queryByRole('button', { name: /rename/i })).not.toBeInTheDocument()
    expect(within(typeRow).queryByRole('button', { name: /clone/i })).not.toBeInTheDocument()
  })

  it('does not treat user-defined schema property names as managed editor rows', () => {
    const value: JsonValue = {
      properties: {
        profile: {
          type: 'object',
          properties: {
            default: {
              type: 'string',
            },
          },
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" onChange={vi.fn()} />)

    const propertyRow = getTreeItemById('root/properties/profile/properties/default')
    expect(propertyRow).not.toHaveClass(jsonViewEditorRowStacked)
  })

  it('surfaces schema-aware summaries for structured default rows', () => {
    const value: JsonValue = {
      properties: {
        profile: {
          type: 'object',
          default: {
            locale: 'en-US',
            marketingOptIn: true,
          },
        },
        tags: {
          type: 'array',
          default: ['a', 'b'],
        },
      },
    }

    render(<JsonViewEditor value={value} editable={false} mode="schema" />)

    const objectDefaultRow = screen
      .getAllByRole('treeitem', { name: /default/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/profile/default')
    expect(objectDefaultRow).toBeDefined()
    expect(within(objectDefaultRow as HTMLElement).getByText('default object (2 keys)')).toBeInTheDocument()

    const arrayDefaultRow = screen
      .getAllByRole('treeitem', { name: /default/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/tags/default')
    expect(arrayDefaultRow).toBeDefined()
    expect(within(arrayDefaultRow as HTMLElement).getByText('default array (2 items)')).toBeInTheDocument()
  })

  it('uses a select for schema items object types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      properties: {
        tags: {
          type: 'array',
          items: {},
        },
      },
    }

    render(<StatefulEditor value={value} mode="schema" onChange={handleChange} />)

    const itemsRow = screen
      .getAllByRole('treeitem', { name: /items/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/tags/items')
    expect(itemsRow).toBeDefined()

    const itemsTypeSelector = within(itemsRow as HTMLElement).getByRole('combobox', { name: 'items type' })
    itemsTypeSelector.focus()
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('option', { name: 'string' }))

    expect(handleChange).toHaveBeenLastCalledWith({
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    })
  })

  it('surfaces schema-aware summaries for items rows', () => {
    const value: JsonValue = {
      properties: {
        emailList: {
          type: 'array',
          items: {
            type: 'string',
            format: 'email',
          },
        },
        tupleValue: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
        },
      },
    }

    render(<JsonViewEditor value={value} editable={false} mode="schema" />)

    const emailItemsRow = screen
      .getAllByRole('treeitem', { name: /items/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/emailList/items')
    expect(emailItemsRow).toBeDefined()
    expect(within(emailItemsRow as HTMLElement).getByText('string item schema (email)')).toBeInTheDocument()

    const tupleItemsRow = screen
      .getAllByRole('treeitem', { name: /items/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/tupleValue/items')
    expect(tupleItemsRow).toBeDefined()
    expect(within(tupleItemsRow as HTMLElement).getByText('tuple item schema (2 entries)')).toBeInTheDocument()
  })

  it('does not apply schema items affordances to a property literally named items', () => {
    const value: JsonValue = {
      properties: {
        items: {
          type: 'string',
        },
      },
    }

    render(<JsonViewEditor value={value} editable mode="schema" />)

    const propertyItemsRow = getTreeItemById('root/properties/items')
    expect(within(propertyItemsRow).queryByRole('combobox', { name: 'items type' })).not.toBeInTheDocument()
    expect(within(propertyItemsRow).queryByText(/item schema/i)).not.toBeInTheDocument()
  })

  it('limits schema enum arrays to primitive add options and surfaces value summaries', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'published'],
        },
      },
    }

    render(<StatefulEditor value={value} mode="schema" onChange={handleChange} />)

    const enumRow = screen
      .getAllByRole('treeitem', { name: /enum/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/status/enum')
    expect(enumRow).toBeDefined()
    expect(within(enumRow as HTMLElement).getByText(/"draft", "published"/i)).toBeInTheDocument()

    const addButton = within(enumRow as HTMLElement).getByRole('button', { name: 'Add child to enum' })
    await user.click(addButton)

    expect(await screen.findByText('Enum string')).toBeInTheDocument()
    expect(screen.getByText('Enum number')).toBeInTheDocument()
    expect(screen.getByText('Enum boolean')).toBeInTheDocument()
    expect(screen.getByText('Enum null')).toBeInTheDocument()
    expect(screen.queryByText(/^Object$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Array$/)).not.toBeInTheDocument()
  })

  it('uses sibling property toggles for schema required arrays', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const value: JsonValue = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
      },
      required: ['email'],
    }

    render(<StatefulEditor value={value} mode="schema" onChange={handleChange} />)

    const requiredRow = screen
      .getAllByRole('treeitem', { name: /required/i })
      .find(node => node.getAttribute('data-tree-item-id') === 'root/required')
    expect(requiredRow).toBeDefined()

    expect(within(requiredRow as HTMLElement).getByText('email')).toBeInTheDocument()
    expect(within(requiredRow as HTMLElement).getByText('phone')).toBeInTheDocument()
    const checkboxes = within(requiredRow as HTMLElement).getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(
      within(requiredRow as HTMLElement).queryByRole('button', { name: 'Add child to required' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('treeitem', { name: /\[0\]/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('treeitem', { name: /\[1\]/i })).not.toBeInTheDocument()

    await user.click(checkboxes[1])

    expect(handleChange).toHaveBeenLastCalledWith({
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
      },
      required: ['email', 'phone'],
    })
  })
})
