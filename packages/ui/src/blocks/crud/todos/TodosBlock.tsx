'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { Avatar } from '@/elements/avatar/Avatar'
import { AvatarGroup } from '@/elements/avatar/AvatarGroup'
import { IconButton } from '@/elements/button/IconButton'
import { DropdownMenu } from '@/elements/menu/DropdownMenu'
import { Popover } from '@/elements/popover/Popover'
import { PriorityIcon, type PriorityIconPriority, priorityToneByValue } from '@/elements/priority-icon/PriorityIcon'
import { type AvatarItem, AvatarPicker } from '@/form/AvatarPicker'
import { Checkbox } from '@/form/Checkbox'
import { DateNextCalendarPanel } from '@/form/date'
import { TextField } from '@/form/TextField'
import { cn } from '@/lib/utils'
import { Text } from '@/typography/text/Text'
import {
  todosBlockAssigneeGroup,
  todosBlockComposer,
  todosBlockComposerInput,
  todosBlockDueDate,
  todosBlockDueDateText,
  todosBlockDueDateTrigger,
  todosBlockEmpty,
  todosBlockItem,
  todosBlockItemActions,
  todosBlockItemMain,
  todosBlockItemNode,
  todosBlockItemText,
  todosBlockItemTextCompleted,
  todosBlockList,
  todosBlockMenuLabel,
  todosBlockMenuPicker,
  todosBlockMenuSubContent,
  todosBlockPriorityText,
  todosBlockRoot,
  todosBlockSubtasks,
} from './TodosBlock.css'

export interface TodoItem {
  id: string
  text: string
  completed?: boolean
  dueDate?: Date
  priority?: PriorityIconPriority
  assigneeIds?: string[]
  subtasks?: TodoItem[]
}

export interface TodoAssignee {
  id: string
  name: string
  avatar?: string
}

type ControlledTodosBlockProps = {
  items: TodoItem[]
  onItemsChange: (items: TodoItem[]) => void
  defaultItems?: never
}

type UncontrolledTodosBlockProps = {
  defaultItems?: TodoItem[]
  items?: never
  onItemsChange?: (items: TodoItem[]) => void
}

type TodosBlockBaseProps = {
  assignees?: TodoAssignee[]
  composerPlaceholder?: string
  emptyMessage?: string
}

export type TodosBlockProps = TodosBlockBaseProps &
  (ControlledTodosBlockProps | UncontrolledTodosBlockProps) &
  Omit<React.ComponentProps<'div'>, 'onChange'>

type TodoPath = number[]
type TodoSeed = Omit<TodoItem, 'id' | 'subtasks'> & { subtasks?: TodoSeed[] }

const DEFAULT_ASSIGNEES: TodoAssignee[] = [
  { id: 'don-smith', name: 'Don Smith' },
  { id: 'nadia-chasey', name: 'Nadia Chasey' },
  { id: 'mike-young', name: 'Mike Young' },
  { id: 'elvira-webb', name: 'Elvira Webb' },
]

function createTodoId() {
  return `todo-${Math.random().toString(36).slice(2, 10)}`
}

function cloneTodoWithoutIds(seed: Partial<TodoItem> | TodoSeed | undefined): TodoSeed {
  return {
    text: seed?.text ?? '',
    completed: seed?.completed ?? false,
    dueDate: seed?.dueDate ? new Date(seed.dueDate) : undefined,
    priority: seed?.priority,
    assigneeIds: seed?.assigneeIds ? [...seed.assigneeIds] : undefined,
    subtasks: seed?.subtasks?.map(child => cloneTodoWithoutIds(child)),
  }
}

function materializeTodo(seed?: Partial<TodoItem> | TodoSeed): TodoItem {
  const cloned = cloneTodoWithoutIds(seed)
  return {
    id: createTodoId(),
    text: cloned.text,
    completed: cloned.completed,
    dueDate: cloned.dueDate,
    priority: cloned.priority,
    assigneeIds: cloned.assigneeIds,
    subtasks: cloned.subtasks?.map(child => materializeTodo(child)),
  }
}

function findTodoPath(items: TodoItem[], id: string, parentPath: TodoPath = []): TodoPath | null {
  for (const [index, item] of items.entries()) {
    const path = [...parentPath, index]
    if (item.id === id) return path
    if (item.subtasks?.length) {
      const childPath = findTodoPath(item.subtasks, id, path)
      if (childPath) return childPath
    }
  }
  return null
}

function buildTodoPathMap(items: TodoItem[], parentPath: TodoPath = [], pathMap = new Map<string, TodoPath>()) {
  for (const [index, item] of items.entries()) {
    const path = [...parentPath, index]
    pathMap.set(item.id, path)
    if (item.subtasks?.length) {
      buildTodoPathMap(item.subtasks, path, pathMap)
    }
  }
  return pathMap
}

function updateTodoAtPath(items: TodoItem[], path: TodoPath, updater: (item: TodoItem) => TodoItem): TodoItem[] {
  const [head, ...rest] = path
  if (head === undefined) return items
  return items.map((item, index) => {
    if (index !== head) return item
    if (rest.length === 0) return updater(item)
    return {
      ...item,
      subtasks: updateTodoAtPath(item.subtasks ?? [], rest, updater),
    }
  })
}

function removeTodoAtPath(items: TodoItem[], path: TodoPath): { items: TodoItem[]; removed: TodoItem | null } {
  const [head, ...rest] = path
  if (head === undefined) return { items, removed: null }
  if (rest.length === 0) {
    const removed = items[head] ?? null
    return { items: items.filter((_, index) => index !== head), removed }
  }
  const parent = items[head]
  if (!parent) return { items, removed: null }
  const result = removeTodoAtPath(parent.subtasks ?? [], rest)
  return {
    items: items.map((item, index) =>
      index === head
        ? {
            ...item,
            subtasks: result.items.length > 0 ? result.items : undefined,
          }
        : item,
    ),
    removed: result.removed,
  }
}

function insertTodoAtPath(
  items: TodoItem[],
  parentPath: TodoPath,
  insertIndex: number,
  nextItem: TodoItem,
): TodoItem[] {
  if (parentPath.length === 0) {
    const next = [...items]
    next.splice(insertIndex, 0, nextItem)
    return next
  }

  const [head, ...rest] = parentPath
  if (head === undefined) return items
  return items.map((item, index) => {
    if (index !== head) return item
    if (rest.length === 0) {
      const nextSubtasks = [...(item.subtasks ?? [])]
      nextSubtasks.splice(insertIndex, 0, nextItem)
      return { ...item, subtasks: nextSubtasks }
    }
    return {
      ...item,
      subtasks: insertTodoAtPath(item.subtasks ?? [], rest, insertIndex, nextItem),
    }
  })
}

function getSiblingsAtPath(items: TodoItem[], parentPath: TodoPath): TodoItem[] {
  if (parentPath.length === 0) return items
  const [head, ...rest] = parentPath
  if (head === undefined) return []
  const parent = items[head]
  if (!parent) return []
  return rest.length === 0 ? (parent.subtasks ?? []) : getSiblingsAtPath(parent.subtasks ?? [], rest)
}

function formatDueDate(date: Date | undefined) {
  if (!date) return ''
  return format(date, 'dd MMM yyyy')
}

function normalizeTodoPriority(priority: TodoItem['priority']): PriorityIconPriority {
  return priority ?? 'none'
}

function getTodoPriorityLabel(priority: TodoItem['priority']) {
  const normalized = normalizeTodoPriority(priority)
  switch (normalized) {
    case 'low':
      return 'Low priority'
    case 'med':
    case 'medium':
      return 'Medium priority'
    case 'high':
      return 'High priority'
    case 'critical':
      return 'Critical priority'
    case 'blocker':
      return 'Blocker'
    default:
      return 'None'
  }
}

function TodoDueDateField({
  value,
  onChange,
  ariaLabel,
}: {
  value?: Date
  onChange: (value: Date | undefined) => void
  ariaLabel: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <span className={todosBlockDueDate}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger render={<button type="button" className={todosBlockDueDateTrigger} aria-label={ariaLabel} />}>
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className={todosBlockDueDateText}>{value ? formatDueDate(value) : 'Set due date'}</span>
        </Popover.Trigger>
        <Popover.Content size="xs" maxWidth="xs" side="bottom" align="start" className="w-auto p-0">
          <Popover.Arrow />
          <DateNextCalendarPanel
            value={value}
            onChange={nextDate => {
              onChange(nextDate)
              setOpen(false)
            }}
            size="sm"
            color="error"
            highlightToday
          />
        </Popover.Content>
      </Popover.Root>
    </span>
  )
}

export function TodosBlock({
  items,
  defaultItems = [],
  onItemsChange,
  assignees = DEFAULT_ASSIGNEES,
  composerPlaceholder = 'Enter a description',
  emptyMessage = 'No tasks yet',
  className,
  ...props
}: TodosBlockProps) {
  const [uncontrolledItems, setUncontrolledItems] = React.useState<TodoItem[]>(defaultItems)
  const [draft, setDraft] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingDraft, setEditingDraft] = React.useState('')
  const [copiedTodoItem, setCopiedTodoItem] = React.useState<TodoSeed | null>(null)
  const [activeTodoId, setActiveTodoId] = React.useState<string | null>(null)
  const composerRef = React.useRef<HTMLInputElement | null>(null)

  const isControlled = items !== undefined
  const resolvedItems = isControlled ? items : uncontrolledItems
  const todoPathMap = React.useMemo(() => buildTodoPathMap(resolvedItems), [resolvedItems])
  const assigneeMap = React.useMemo(() => new Map(assignees.map(assignee => [assignee.id, assignee])), [assignees])
  const assigneeOptions = React.useMemo<AvatarItem[]>(
    () => assignees.map(assignee => ({ id: assignee.id, name: assignee.name, avatar: assignee.avatar })),
    [assignees],
  )
  const getTodoPath = React.useCallback((id: string) => todoPathMap.get(id) ?? null, [todoPathMap])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && isControlled && typeof onItemsChange !== 'function') {
      console.warn(
        'TodosBlock received `items` without `onItemsChange`. Provide both for controlled usage, or use `defaultItems` for uncontrolled usage.',
      )
    }
  }, [isControlled, onItemsChange])

  const updateItems = React.useCallback(
    (nextItems: TodoItem[]) => {
      if (!isControlled) {
        setUncontrolledItems(nextItems)
      }
      onItemsChange?.(nextItems)
    },
    [isControlled, onItemsChange],
  )

  const handleAdd = React.useCallback(
    (refocusComposer = true) => {
      const text = draft.trim()
      if (!text) return

      updateItems([
        ...resolvedItems,
        {
          id: createTodoId(),
          text,
          completed: false,
        },
      ])
      setDraft('')
      if (refocusComposer) {
        composerRef.current?.focus()
      }
    },
    [draft, resolvedItems, updateItems],
  )

  const handleToggle = React.useCallback(
    (id: string, completed: boolean) => {
      const path = getTodoPath(id)
      if (!path) return
      updateItems(updateTodoAtPath(resolvedItems, path, item => ({ ...item, completed })))
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleRemove = React.useCallback(
    (id: string) => {
      const path = getTodoPath(id)
      if (!path) return
      updateItems(removeTodoAtPath(resolvedItems, path).items)
      if (editingId === id) {
        setEditingId(null)
        setEditingDraft('')
      }
    },
    [editingId, getTodoPath, resolvedItems, updateItems],
  )

  const handleInsertBelow = React.useCallback(
    (id: string, seed?: Partial<TodoItem> | TodoSeed) => {
      const path = getTodoPath(id)
      if (!path) return
      const insertIndex = path[path.length - 1]
      if (insertIndex === undefined) return
      const parentPath = path.slice(0, -1)
      const nextItem = materializeTodo(seed)
      updateItems(insertTodoAtPath(resolvedItems, parentPath, insertIndex + 1, nextItem))
      setEditingId(nextItem.id)
      setEditingDraft(nextItem.text)
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleAddSubtask = React.useCallback(
    (id: string, seed?: Partial<TodoItem> | TodoSeed) => {
      const path = getTodoPath(id)
      if (!path) return
      const nextItem = materializeTodo(seed)
      updateItems(
        updateTodoAtPath(resolvedItems, path, item => ({
          ...item,
          subtasks: [...(item.subtasks ?? []), nextItem],
        })),
      )
      setEditingId(nextItem.id)
      setEditingDraft(nextItem.text)
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleIndent = React.useCallback(
    (id: string) => {
      const path = getTodoPath(id)
      if (!path) return
      const index = path[path.length - 1]
      if (index === undefined || index === 0) return
      const parentPath = path.slice(0, -1)
      const result = removeTodoAtPath(resolvedItems, path)
      if (!result.removed) return
      const previousSiblingPath = [...parentPath, index - 1]
      updateItems(
        updateTodoAtPath(result.items, previousSiblingPath, item => ({
          ...item,
          subtasks: [...(item.subtasks ?? []), result.removed as TodoItem],
        })),
      )
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleUnindent = React.useCallback(
    (id: string) => {
      const path = getTodoPath(id)
      if (!path || path.length < 2) return
      const parentPath = path.slice(0, -1)
      const grandParentPath = parentPath.slice(0, -1)
      const parentIndex = parentPath[parentPath.length - 1]
      if (parentIndex === undefined) return
      const result = removeTodoAtPath(resolvedItems, path)
      if (!result.removed) return
      updateItems(insertTodoAtPath(result.items, grandParentPath, parentIndex + 1, result.removed))
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleMoveUp = React.useCallback(
    (id: string) => {
      const path = getTodoPath(id)
      if (!path) return
      const index = path[path.length - 1]
      if (index === undefined) return
      if (index === 0) return
      const parentPath = path.slice(0, -1)
      const result = removeTodoAtPath(resolvedItems, path)
      if (!result.removed) return
      updateItems(insertTodoAtPath(result.items, parentPath, index - 1, result.removed))
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const handleMoveDown = React.useCallback(
    (id: string) => {
      const path = getTodoPath(id)
      if (!path) return
      const index = path[path.length - 1]
      if (index === undefined) return
      const parentPath = path.slice(0, -1)
      const siblings = getSiblingsAtPath(resolvedItems, parentPath)
      if (index >= siblings.length - 1) return
      const result = removeTodoAtPath(resolvedItems, path)
      if (!result.removed) return
      updateItems(insertTodoAtPath(result.items, parentPath, index + 1, result.removed))
    },
    [getTodoPath, resolvedItems, updateItems],
  )

  const startEditing = React.useCallback((item: TodoItem) => {
    setEditingId(item.id)
    setEditingDraft(item.text)
  }, [])

  const commitEditing = React.useCallback(() => {
    if (!editingId) return

    const text = editingDraft.trim()
    if (!text) {
      handleRemove(editingId)
      return
    }

    const path = getTodoPath(editingId)
    if (!path) return
    updateItems(updateTodoAtPath(resolvedItems, path, item => ({ ...item, text })))
    setEditingId(null)
    setEditingDraft('')
  }, [editingDraft, editingId, getTodoPath, handleRemove, resolvedItems, updateItems])

  const handleKeyboardShortcut = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }

      if (!activeTodoId) return

      const key = event.key.toLowerCase()
      if (key === 'd') {
        event.preventDefault()
        const itemPath = getTodoPath(activeTodoId)
        if (!itemPath) return
        const itemIndex = itemPath[itemPath.length - 1]
        if (itemIndex === undefined) return
        const item = getSiblingsAtPath(resolvedItems, itemPath.slice(0, -1))[itemIndex]
        if (!item) return
        handleInsertBelow(activeTodoId, cloneTodoWithoutIds(item))
        return
      }

      if (key === 'c') {
        event.preventDefault()
        const itemPath = getTodoPath(activeTodoId)
        if (!itemPath) return
        const itemIndex = itemPath[itemPath.length - 1]
        if (itemIndex === undefined) return
        const item = getSiblingsAtPath(resolvedItems, itemPath.slice(0, -1))[itemIndex]
        if (!item) return
        setCopiedTodoItem(cloneTodoWithoutIds(item))
        return
      }

      if (key === 'v' && copiedTodoItem) {
        event.preventDefault()
        handleInsertBelow(activeTodoId, copiedTodoItem)
      }
    },
    [activeTodoId, copiedTodoItem, getTodoPath, handleInsertBelow, resolvedItems],
  )

  const renderItems = (itemsToRender: TodoItem[]) =>
    itemsToRender.map(item => {
      const isEditing = editingId === item.id
      const assignedPeople = (item.assigneeIds ?? []).map(id => assigneeMap.get(id)).filter(Boolean) as TodoAssignee[]
      const path = getTodoPath(item.id)
      const siblings = path ? getSiblingsAtPath(resolvedItems, path.slice(0, -1)) : []
      const index = path?.[path.length - 1] ?? 0
      const canIndent = index > 0
      const canUnindent = Boolean(path && path.length > 1)
      const canMoveUp = index > 0
      const canMoveDown = index < siblings.length - 1

      return (
        <div key={item.id} className={todosBlockItemNode}>
          <div className={todosBlockItem} onFocusCapture={() => setActiveTodoId(item.id)}>
            <Checkbox
              size="sm"
              checked={Boolean(item.completed)}
              onCheckedChange={checked => handleToggle(item.id, checked)}
              aria-label={`Mark ${item.text} as ${item.completed ? 'incomplete' : 'complete'}`}
            />
            <div className={todosBlockItemMain}>
              {isEditing ? (
                <TextField
                  size="sm"
                  value={editingDraft}
                  onChange={event => setEditingDraft(event.target.value)}
                  onBlur={commitEditing}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      commitEditing()
                    } else if (event.key === 'Escape') {
                      setEditingId(null)
                      setEditingDraft('')
                    }
                  }}
                  autoFocus
                  aria-label={`Edit ${item.text}`}
                />
              ) : (
                <Text
                  size="sm"
                  className={cn(todosBlockItemText, item.completed && todosBlockItemTextCompleted)}
                  onDoubleClick={() => startEditing(item)}
                >
                  {item.text}
                </Text>
              )}
              {item.dueDate ? (
                <TodoDueDateField
                  value={item.dueDate}
                  onChange={nextDate => {
                    const itemPath = getTodoPath(item.id)
                    if (!itemPath) return
                    updateItems(updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, dueDate: nextDate })))
                  }}
                  ariaLabel={`Due date for ${item.text}`}
                />
              ) : null}
              {item.priority !== undefined ? (
                <Text size="xs" className={todosBlockPriorityText}>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      color: priorityToneByValue[normalizeTodoPriority(item.priority)].text,
                    }}
                  >
                    <PriorityIcon priority={normalizeTodoPriority(item.priority)} size="sm" className="shrink-0" />
                    <span>{getTodoPriorityLabel(item.priority)}</span>
                  </span>
                </Text>
              ) : null}
            </div>
            <span className={todosBlockItemActions}>
              {assignedPeople.length > 0 ? (
                <div className={todosBlockAssigneeGroup}>
                  <AvatarGroup size="sm" max={3} hoverCard={{ title: 'Assigned to' }} overflowHoverCard>
                    {assignedPeople.map(person => (
                      <Avatar
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        src={person.avatar}
                        size="sm"
                        hoverCard={{
                          title: person.name,
                        }}
                      />
                    ))}
                  </AvatarGroup>
                </div>
              ) : null}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton size="xs" variant="ghost" icon="ellipsis-vertical" title={`Actions for ${item.text}`} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size="sm" align="end" sideOffset={6}>
                  <DropdownMenu.Item onClick={() => handleInsertBelow(item.id)}>Add task below</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => handleAddSubtask(item.id)}>Add subtask</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Set due date</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent side="left" className={todosBlockMenuSubContent}>
                      <div className={todosBlockMenuLabel}>
                        <Text size="xs" color="secondary">
                          {item.dueDate ? 'Adjust due date' : 'Choose due date'}
                        </Text>
                      </div>
                      <DateNextCalendarPanel
                        value={item.dueDate}
                        onChange={nextDate => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, dueDate: nextDate })),
                          )
                        }}
                        size="sm"
                        color="error"
                        highlightToday
                      />
                      {item.dueDate ? (
                        <>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            onClick={() => {
                              const itemPath = getTodoPath(item.id)
                              if (!itemPath) return
                              updateItems(
                                updateTodoAtPath(resolvedItems, itemPath, entry => ({
                                  ...entry,
                                  dueDate: undefined,
                                })),
                              )
                            }}
                          >
                            Reset due date
                          </DropdownMenu.Item>
                        </>
                      ) : null}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Priority</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent side="left">
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'none' })),
                          )
                        }}
                      >
                        None
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'low' })),
                          )
                        }}
                      >
                        Low
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'medium' })),
                          )
                        }}
                      >
                        Medium
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = findTodoPath(resolvedItems, item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'high' })),
                          )
                        }}
                      >
                        High
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'critical' })),
                          )
                        }}
                      >
                        Critical
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({ ...entry, priority: 'blocker' })),
                          )
                        }}
                      >
                        Blocker
                      </DropdownMenu.Item>
                      {item.priority ? (
                        <>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            onClick={() => {
                              const itemPath = getTodoPath(item.id)
                              if (!itemPath) return
                              updateItems(
                                updateTodoAtPath(resolvedItems, itemPath, entry => ({
                                  ...entry,
                                  priority: undefined,
                                })),
                              )
                            }}
                          >
                            Clear
                          </DropdownMenu.Item>
                        </>
                      ) : null}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Assign to</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent
                      side="left"
                      overflowVisible
                      className={todosBlockMenuSubContent}
                      viewportClassName="overflow-visible"
                    >
                      <div className={todosBlockMenuLabel}>
                        <Text size="xs" color="secondary">
                          Assign task owners
                        </Text>
                      </div>
                      <AvatarPicker
                        multiple
                        inline
                        items={assigneeOptions}
                        value={item.assigneeIds ?? []}
                        onValueChange={value => {
                          const itemPath = getTodoPath(item.id)
                          if (!itemPath) return
                          updateItems(
                            updateTodoAtPath(resolvedItems, itemPath, entry => ({
                              ...entry,
                              assigneeIds:
                                Array.isArray(value) && value.length > 0
                                  ? value.filter((candidate): candidate is string => typeof candidate === 'string')
                                  : undefined,
                            })),
                          )
                        }}
                        searchable
                        searchPlaceholder="Search people"
                        placeholder="Assign people"
                        size="sm"
                        showHoverCard={false}
                        className={todosBlockMenuPicker}
                      />
                      {assignedPeople.length > 0 ? (
                        <>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            onClick={() => {
                              const itemPath = getTodoPath(item.id)
                              if (!itemPath) return
                              updateItems(
                                updateTodoAtPath(resolvedItems, itemPath, entry => ({
                                  ...entry,
                                  assigneeIds: undefined,
                                })),
                              )
                            }}
                          >
                            Clear assignees
                          </DropdownMenu.Item>
                        </>
                      ) : null}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item disabled={!canMoveUp} onClick={() => handleMoveUp(item.id)}>
                    Move up
                  </DropdownMenu.Item>
                  <DropdownMenu.Item disabled={!canMoveDown} onClick={() => handleMoveDown(item.id)}>
                    Move down
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item disabled={!canIndent} onClick={() => handleIndent(item.id)}>
                    Indent
                  </DropdownMenu.Item>
                  <DropdownMenu.Item disabled={!canUnindent} onClick={() => handleUnindent(item.id)}>
                    Unindent
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item onClick={() => startEditing(item)}>Edit task</DropdownMenu.Item>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger disabled>Move to</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                      <DropdownMenu.Item disabled>No lists yet</DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    shortcut="Cmd/Ctrl + D"
                    onClick={() => handleInsertBelow(item.id, cloneTodoWithoutIds(item))}
                  >
                    Duplicate
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    shortcut="Cmd/Ctrl + C"
                    onClick={() => {
                      setCopiedTodoItem(cloneTodoWithoutIds(item))
                    }}
                  >
                    Copy
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    shortcut="Cmd/Ctrl + V"
                    disabled={!copiedTodoItem}
                    onClick={() => {
                      if (!copiedTodoItem) return
                      handleInsertBelow(item.id, copiedTodoItem)
                    }}
                  >
                    Paste
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="error" onClick={() => handleRemove(item.id)}>
                    Delete task
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </span>
          </div>
          {item.subtasks?.length ? <div className={todosBlockSubtasks}>{renderItems(item.subtasks)}</div> : null}
        </div>
      )
    })

  return (
    <div className={cn(todosBlockRoot, className)} onKeyDownCapture={handleKeyboardShortcut} {...props}>
      <div className={todosBlockComposer}>
        <IconButton
          size="xs"
          variant="ghost"
          color="info"
          icon="square-pen"
          title="Task description"
          aria-hidden
          tabIndex={-1}
        />
        <TextField
          ref={composerRef}
          size="sm"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAdd(true)
            }
          }}
          onBlur={() => {
            if (draft.trim()) handleAdd(false)
          }}
          placeholder={composerPlaceholder}
          className={todosBlockComposerInput}
          aria-label={composerPlaceholder}
        />
      </div>

      <div className={todosBlockList}>
        {resolvedItems.length === 0 ? (
          <Text size="sm" className={todosBlockEmpty}>
            {emptyMessage}
          </Text>
        ) : null}

        {renderItems(resolvedItems)}
      </div>
    </div>
  )
}
