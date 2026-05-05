import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TodosBlock } from './TodosBlock'

const TEST_TIMEOUT_MS = 60_000
const TODO_SUBTASK_MENU_TEST_TIMEOUT_MS = 60_000

beforeAll(() => {
  vi.stubGlobal('PointerEvent', MouseEvent)
})

afterEach(() => {
  cleanup()
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('TodosBlock', () => {
  it('adds items from the inline composer', () => {
    render(<TodosBlock />)

    const input = screen.getByRole('textbox', { name: 'Enter a description' })
    fireEvent.change(input, { target: { value: 'Ship JSON diff' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(screen.getByText('Ship JSON diff')).toBeInTheDocument()
  })

  it(
    'toggles and removes items',
    () => {
      const onItemsChange = vi.fn()

      render(
        <TodosBlock
          defaultItems={[
            { id: 'todo-1', text: 'First task' },
            { id: 'todo-2', text: 'Second task', completed: true },
          ]}
          onItemsChange={onItemsChange}
        />,
      )

      fireEvent.click(screen.getByRole('checkbox', { name: 'Mark First task as complete' }))
      expect(onItemsChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: 'todo-1', completed: true })]),
      )

      fireEvent.click(screen.getByRole('button', { name: 'Actions for Second task' }))
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete task' }))
      expect(screen.queryByText('Second task')).not.toBeInTheDocument()
    },
    TODO_SUBTASK_MENU_TEST_TIMEOUT_MS,
  )

  it('renders per-item action menus and hides empty due dates by default', () => {
    render(<TodosBlock defaultItems={[{ id: 'todo-1', text: 'Schedule review' }]} />)

    expect(screen.getByRole('button', { name: 'Actions for Schedule review' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Due date for Schedule review' })).not.toBeInTheDocument()
  })

  it(
    'shows the expanded task action menu',
    async () => {
      const user = userEvent.setup()
      render(<TodosBlock defaultItems={[{ id: 'todo-1', text: 'Schedule review' }]} />)

      await user.click(screen.getByRole('button', { name: 'Actions for Schedule review' }))

      expect(screen.getByRole('menuitem', { name: 'Add task below' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Add subtask' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Indent' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Unindent' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Set due date' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Priority' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Assign to' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Move to' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Duplicate Cmd/Ctrl + D' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Copy Cmd/Ctrl + C' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Paste Cmd/Ctrl + V' })).toBeInTheDocument()

      await user.hover(screen.getByRole('menuitem', { name: 'Assign to' }))

      expect(await screen.findByText('Assign task owners')).toBeInTheDocument()
    },
    TODO_SUBTASK_MENU_TEST_TIMEOUT_MS,
  )

  it(
    'supports subtasks, indent, and unindent',
    async () => {
      const onItemsChange = vi.fn()

      render(
        <TodosBlock
          defaultItems={[
            { id: 'todo-1', text: 'Parent task' },
            { id: 'todo-2', text: 'Sibling task' },
          ]}
          onItemsChange={onItemsChange}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: 'Actions for Parent task' }))
      fireEvent.click(screen.getByRole('menuitem', { name: 'Add subtask' }))

      const activeEditor = await screen.findByRole('textbox', { name: /^Edit\b/i })
      if (!(activeEditor instanceof HTMLInputElement)) {
        throw new Error('Expected subtask editor to receive focus')
      }
      fireEvent.change(activeEditor, { target: { value: 'Nested task' } })
      fireEvent.keyDown(activeEditor, { key: 'Enter', code: 'Enter' })

      expect(screen.getByText('Nested task')).toBeInTheDocument()
      expect(onItemsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          id: 'todo-1',
          subtasks: [expect.objectContaining({ text: 'Nested task' })],
        }),
        expect.objectContaining({ id: 'todo-2', text: 'Sibling task' }),
      ])

      fireEvent.click(screen.getByRole('button', { name: 'Actions for Sibling task' }))
      fireEvent.click(screen.getByRole('menuitem', { name: 'Indent' }))

      expect(onItemsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          id: 'todo-1',
          subtasks: expect.arrayContaining([expect.objectContaining({ id: 'todo-2', text: 'Sibling task' })]),
        }),
      ])

      fireEvent.click(screen.getByRole('button', { name: 'Actions for Sibling task' }))
      fireEvent.click(screen.getByRole('menuitem', { name: 'Unindent' }))

      expect(onItemsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ id: 'todo-1' }),
        expect.objectContaining({ id: 'todo-2', text: 'Sibling task' }),
      ])
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'supports move up and move down with sibling-aware availability',
    async () => {
      const user = userEvent.setup()
      const onItemsChange = vi.fn()

      render(
        <TodosBlock
          defaultItems={[
            {
              id: 'todo-1',
              text: 'First task',
              subtasks: [
                { id: 'todo-1a', text: 'First subtask' },
                { id: 'todo-1b', text: 'Second subtask' },
              ],
            },
            { id: 'todo-2', text: 'Second task' },
          ]}
          onItemsChange={onItemsChange}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Actions for First task' }))
      expect(screen.getByRole('menuitem', { name: 'Move up' })).toHaveAttribute('aria-disabled', 'true')
      expect(screen.getByRole('menuitem', { name: 'Move down' })).not.toHaveAttribute('aria-disabled', 'true')

      await user.click(screen.getByRole('button', { name: 'Actions for Second task' }))
      expect(screen.getByRole('menuitem', { name: 'Move down' })).toHaveAttribute('aria-disabled', 'true')

      await user.click(screen.getByRole('button', { name: 'Actions for Second subtask' }))
      expect(screen.getByRole('menuitem', { name: 'Move down' })).toHaveAttribute('aria-disabled', 'true')
      await user.click(screen.getByRole('menuitem', { name: 'Move up' }))

      expect(onItemsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          id: 'todo-1',
          subtasks: [
            expect.objectContaining({ id: 'todo-1b', text: 'Second subtask' }),
            expect.objectContaining({ id: 'todo-1a', text: 'First subtask' }),
          ],
        }),
        expect.objectContaining({ id: 'todo-2', text: 'Second task' }),
      ])
    },
    TEST_TIMEOUT_MS,
  )

  it(
    'supports duplicate, copy, and paste keyboard shortcuts for the active task row',
    () => {
      const onItemsChange = vi.fn()

      const { container } = render(
        <TodosBlock
          defaultItems={[
            { id: 'todo-1', text: 'First task' },
            { id: 'todo-2', text: 'Second task' },
          ]}
          onItemsChange={onItemsChange}
        />,
      )

      const root = container.firstElementChild
      if (!(root instanceof HTMLDivElement)) {
        throw new Error('Expected TodosBlock root element')
      }

      const secondTaskActions = screen.getByRole('button', { name: 'Actions for Second task' })
      fireEvent.focusIn(secondTaskActions)

      fireEvent.keyDown(root, { key: 'd', ctrlKey: true })
      const duplicatedItems = onItemsChange.mock.lastCall?.[0]
      expect(duplicatedItems).toEqual([
        expect.objectContaining({ id: 'todo-1', text: 'First task' }),
        expect.objectContaining({ id: 'todo-2', text: 'Second task' }),
        expect.objectContaining({ text: 'Second task' }),
      ])

      fireEvent.keyDown(root, { key: 'c', ctrlKey: true })
      fireEvent.click(screen.getByRole('button', { name: 'Actions for First task' }))
      expect(screen.getByRole('menuitem', { name: 'Paste Cmd/Ctrl + V' })).not.toHaveAttribute('aria-disabled', 'true')
      fireEvent.keyDown(root, { key: 'Escape', code: 'Escape' })

      fireEvent.keyDown(root, { key: 'v', ctrlKey: true })
      const pastedItems = onItemsChange.mock.lastCall?.[0]
      expect(pastedItems).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'todo-1', text: 'First task' })]),
      )
      expect(pastedItems).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'todo-2', text: 'Second task' })]),
      )
      expect(pastedItems).toHaveLength(4)
      expect(pastedItems?.filter((item: { text: string }) => item.text === 'Second task')).toHaveLength(3)
    },
    TEST_TIMEOUT_MS,
  )
})
