'use client'

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { CalendarDays, CheckCircle2, Clock3, GripVertical, MessageSquareText, Paperclip, Search } from 'lucide-react'
import * as React from 'react'
import { Avatar } from '@/elements/avatar/Avatar'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { Dialog } from '@/elements/dialog/Dialog'
import { DropdownMenu } from '@/elements/menu/DropdownMenu'
import { Progress } from '@/elements/progress/Progress'
import { Textarea } from '@/form/Textarea'
import { TextField } from '@/form/TextField'
import { cn } from '@/lib/utils'
import { Heading } from '@/typography/heading/Heading'
import { Text } from '@/typography/text/Text'
import {
  getColumnDragData,
  getColumnDropTargetData,
  getTaskDragData,
  getTaskDropTargetData,
  isColumnDragData,
  isColumnDropTargetData,
  isKanbanDragData,
  isTaskDragData,
  isTaskDropTargetData,
} from './drag-data'
import {
  kanbanCard,
  kanbanColumn,
  kanbanColumnAccent,
  kanbanColumnAccentVar,
  kanbanDropIndicator,
  kanbanPriority,
  kanbanRoot,
} from './KanbanBoard.css'
import {
  addKanbanTask,
  createKanbanColumnId,
  createKanbanTaskId,
  deleteKanbanColumn,
  deleteKanbanTask,
  findKanbanTask,
  moveKanbanColumn,
  moveKanbanTask,
  updateKanbanColumn,
  updateKanbanTask,
} from './operations'
import { sampleKanbanColumns } from './sample-data'
import {
  applyKanbanScheduleChange,
  coerceKanbanDate,
  formatDuration,
  formatScheduleDate,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from './schedule'
import type {
  KanbanBoardProps,
  KanbanChangeDetails,
  KanbanColumn as KanbanColumnData,
  KanbanDurationUnit,
  KanbanTask,
} from './types'

type TaskCardState = 'idle' | 'dragging' | 'preview'
type ColumnState = 'idle' | 'overCard' | 'overColumn' | 'dragging'

const DEFAULT_COLUMN_COLOR = '#64748b'
const nativeControlClass =
  'h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

function columnsSignature(columns: KanbanColumnData[]) {
  return columns
    .map(
      column =>
        `${column.id}:${column.tasks.map(task => `${task.id}:${task.columnId ?? ''}:${task.statusId ?? ''}`).join(',')}`,
    )
    .join('|')
}

function getColumnTaskStats(column: KanbanColumnData) {
  const completed = column.tasks.filter(task => task.completed).length
  const total = column.tasks.length
  return {
    completed,
    total,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

function getColumnTitle(column: KanbanColumnData) {
  return column.title ?? 'Untitled column'
}

function getTaskTitle(task: KanbanTask) {
  return task.title ?? 'Untitled task'
}

function getTaskSubtaskStats(task: KanbanTask) {
  const total = task.subtasks?.length ?? 0
  const completed = task.subtasks?.filter(subtask => subtask.completed).length ?? 0
  return {
    completed,
    total,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

function getTaskScheduleLabel(task: KanbanTask) {
  const start = formatScheduleDate(task.schedule?.start)
  const end = formatScheduleDate(task.schedule?.end)
  if (start && end) return `${start} - ${end}`
  return end || start
}

function getTaskDueTone(task: KanbanTask) {
  const end = coerceKanbanDate(task.schedule?.end)
  if (!end || task.completed) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(end)
  due.setHours(0, 0, 0, 0)
  if (due.getTime() < today.getTime()) return 'text-red-600'
  if (due.getTime() === today.getTime()) return 'text-amber-700'
  return 'text-muted-foreground'
}

function makeTaskFromTitle(title: string, description?: string): KanbanTask {
  return {
    id: createKanbanTaskId(),
    title,
    description,
    priority: 'none',
    completed: false,
    labels: [],
    assignees: [],
    subtasks: [],
  }
}

function makeColumnFromTitle(title: string): KanbanColumnData {
  return {
    id: createKanbanColumnId(),
    title,
    color: DEFAULT_COLUMN_COLOR,
    tasks: [],
  }
}

function TaskDropIndicator() {
  return <div className={cn(kanbanDropIndicator, 'my-1')} />
}

function PriorityBadge({ priority = 'none' }: { priority?: KanbanTask['priority'] }) {
  if (!priority || priority === 'none') return null
  return (
    <Badge size="xs" variant="soft" radius="sm" className={cn(kanbanPriority({ priority }), 'capitalize')}>
      {priority}
    </Badge>
  )
}

function TaskMeta({ task }: { task: KanbanTask }) {
  const scheduleLabel = getTaskScheduleLabel(task)
  const subtaskStats = getTaskSubtaskStats(task)

  if (!scheduleLabel && !task.attachmentsCount && !task.commentsCount && subtaskStats.total === 0) return null

  return (
    <div className="flex items-center justify-between gap-2 pt-1 text-muted-foreground text-xs">
      <div className="flex min-w-0 items-center gap-3">
        {scheduleLabel ? (
          <span className={cn('inline-flex min-w-0 items-center gap-1', getTaskDueTone(task))}>
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{scheduleLabel}</span>
          </span>
        ) : null}
        {subtaskStats.total > 0 ? (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {subtaskStats.completed}/{subtaskStats.total}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {task.attachmentsCount ? (
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" aria-hidden />
            {task.attachmentsCount}
          </span>
        ) : null}
        {task.commentsCount ? (
          <span className="inline-flex items-center gap-1">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
            {task.commentsCount}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function TaskAssignees({ task }: { task: KanbanTask }) {
  const assignees = task.assignees ?? []
  if (assignees.length === 0) return null

  return (
    <div className="-space-x-2 flex items-center">
      {assignees.slice(0, 3).map(assignee => (
        <Avatar
          key={assignee.id}
          id={assignee.id}
          name={assignee.name}
          src={assignee.avatar}
          email={assignee.email}
          size="xs"
          className="ring-2 ring-background"
        />
      ))}
      {assignees.length > 3 ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground ring-2 ring-background">
          +{assignees.length - 3}
        </span>
      ) : null}
    </div>
  )
}

interface TaskCardProps {
  task: KanbanTask
  column: KanbanColumnData
  readonly: boolean
  onOpen: (task: KanbanTask, column: KanbanColumnData) => void
  onUpdate: (taskId: string, updates: Partial<KanbanTask>) => Promise<void>
  onDelete: (taskId: string) => Promise<unknown>
}

function TaskCard({ task, column, readonly, onOpen, onUpdate, onDelete }: TaskCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const [state, setState] = React.useState<TaskCardState>('idle')
  const [closestEdge, setClosestEdge] = React.useState<'top' | 'bottom' | null>(null)

  React.useEffect(() => {
    const element = cardRef.current
    if (!element || readonly) return undefined
    const taskId = task.id

    return combine(
      draggable({
        element,
        getInitialData: () => getTaskDragData(taskId, column.id),
        onDragStart: () => setState('dragging'),
        onDrop: () => {
          setState('idle')
          setClosestEdge(null)
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => isTaskDragData(source.data) && source.data.taskId !== taskId,
        getData: ({ input }) =>
          attachClosestEdge(getTaskDropTargetData(taskId, column.id), {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          }),
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data)
          setClosestEdge(edge === 'top' || edge === 'bottom' ? edge : null)
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    )
  }, [column.id, readonly, task.id])

  const subtaskStats = getTaskSubtaskStats(task)

  return (
    <div className="group">
      {closestEdge === 'top' ? <TaskDropIndicator /> : null}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        className={cn(
          kanbanCard({ state, completed: Boolean(task.completed) }),
          'rounded-md p-3 outline-none',
          readonly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
          'focus-visible:ring-2 focus-visible:ring-ring',
        )}
        onClick={() => onOpen(task, column)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(task, column)
          }
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            {task.completed ? (
              <Badge size="xs" color="success" variant="soft" radius="sm">
                Done
              </Badge>
            ) : null}
          </div>
          {!readonly ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton
                  icon="ellipsis-vertical"
                  size="xs"
                  variant="ghost"
                  title="Task actions"
                  onClick={event => event.stopPropagation()}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="sm" align="end">
                <DropdownMenu.Item
                  onClick={() => {
                    void onUpdate(task.id, { completed: !task.completed })
                  }}
                >
                  {task.completed ? 'Mark incomplete' : 'Mark complete'}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  color="error"
                  onClick={() => {
                    void onDelete(task.id)
                  }}
                >
                  Delete task
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : null}
        </div>

        <Heading
          as="h4"
          size="md"
          weight="medium"
          className={cn('mt-2 line-clamp-2 leading-snug', task.completed && 'line-through text-muted-foreground')}
        >
          {getTaskTitle(task)}
        </Heading>

        {task.description ? (
          <Text className="mt-1 line-clamp-2 text-muted-foreground" size="sm">
            {task.description}
          </Text>
        ) : null}

        {task.labels && task.labels.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {task.labels.slice(0, 4).map((label, index) => (
              <Badge
                key={`${label.label}-${index}`}
                size="xs"
                variant="soft"
                radius="sm"
                style={label.color ? { color: label.color } : undefined}
              >
                {label.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {subtaskStats.total > 0 ? (
          <div className="mt-3 grid gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Subtasks</span>
              <span>{subtaskStats.progress}%</span>
            </div>
            <Progress value={subtaskStats.progress} size="xs" />
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          <TaskMeta task={task} />
          <TaskAssignees task={task} />
        </div>
      </div>
      {closestEdge === 'bottom' ? <TaskDropIndicator /> : null}
    </div>
  )
}

interface QuickTaskFormProps {
  columnId: string
  onCreate: (columnId: string, task: KanbanTask) => Promise<void>
  onCancel: () => void
}

function QuickTaskForm({ columnId, onCreate, onCancel }: QuickTaskFormProps) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setIsSubmitting(true)
    try {
      await onCreate(columnId, makeTaskFromTitle(trimmedTitle, description.trim() || undefined))
      setTitle('')
      setDescription('')
      onCancel()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-2 rounded-md border border-border bg-background p-2 shadow-sm" onSubmit={handleSubmit}>
      <TextField
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="Task title"
        autoFocus
        disabled={isSubmitting}
        onKeyDown={event => {
          if (event.key === 'Escape') onCancel()
        }}
      />
      <Textarea
        value={description}
        onChange={event => setDescription(event.target.value)}
        placeholder="Description"
        minRows={2}
        resize="none"
        disabled={isSubmitting}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" className="flex-1" loading={isSubmitting}>
          Add task
        </Button>
        <IconButton icon="x" title="Cancel" variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting} />
      </div>
    </form>
  )
}

interface ColumnViewProps {
  column: KanbanColumnData
  readonly: boolean
  enableTaskCreate: boolean
  enableColumnReorder: boolean
  canDeleteColumn: boolean
  onTaskOpen: (task: KanbanTask, column: KanbanColumnData) => void
  onTaskCreate: (columnId: string, task: KanbanTask) => Promise<void>
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<unknown>
  onColumnUpdate: (columnId: string, updates: Partial<KanbanColumnData>) => Promise<void>
  onColumnDelete: (columnId: string) => Promise<void>
}

function ColumnView({
  column,
  readonly,
  enableTaskCreate,
  enableColumnReorder,
  canDeleteColumn,
  onTaskOpen,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onColumnUpdate,
  onColumnDelete,
}: ColumnViewProps) {
  const outerRef = React.useRef<HTMLDivElement | null>(null)
  const headerRef = React.useRef<HTMLDivElement | null>(null)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const [state, setState] = React.useState<ColumnState>('idle')
  const [isAddingTask, setIsAddingTask] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [title, setTitle] = React.useState(getColumnTitle(column))

  React.useEffect(() => setTitle(getColumnTitle(column)), [column])

  React.useEffect(() => {
    const outer = outerRef.current
    const header = headerRef.current
    const scrollable = scrollRef.current
    if (!outer || !scrollable) return undefined

    const cleanups = [
      dropTargetForElements({
        element: outer,
        canDrop: ({ source }) => {
          if (isTaskDragData(source.data)) return true
          return isColumnDragData(source.data) && source.data.columnId !== column.id
        },
        getData: ({ input }) =>
          attachClosestEdge(getColumnDropTargetData(column), {
            element: outer,
            input,
            allowedEdges: ['left', 'right'],
          }),
        onDragEnter: ({ source }) => {
          if (isTaskDragData(source.data)) setState('overCard')
          if (isColumnDragData(source.data) && source.data.columnId !== column.id) setState('overColumn')
        },
        onDragLeave: () => setState('idle'),
        onDrop: () => setState('idle'),
      }),
      autoScrollForElements({
        element: scrollable,
        canScroll: ({ source }) => isTaskDragData(source.data),
      }),
    ]

    if (header && enableColumnReorder && !readonly) {
      cleanups.push(
        draggable({
          element: header,
          getInitialData: () => getColumnDragData(column),
          onDragStart: () => setState('dragging'),
          onDrop: () => setState('idle'),
        }),
      )
    }

    return combine(...cleanups)
  }, [column, enableColumnReorder, readonly])

  const stats = getColumnTaskStats(column)
  const accent = column.color ?? DEFAULT_COLUMN_COLOR
  const accentStyle = assignInlineVars({
    [kanbanColumnAccentVar]: accent,
    '--kanban-column-accent': accent,
  })

  async function commitTitleEdit() {
    const nextTitle = title.trim()
    if (!nextTitle || nextTitle === getColumnTitle(column)) {
      setTitle(getColumnTitle(column))
      setIsEditing(false)
      return
    }
    await onColumnUpdate(column.id, { title: nextTitle })
    setIsEditing(false)
  }

  return (
    <section
      ref={outerRef}
      className={cn(kanbanColumn({ state }), 'flex h-full shrink-0 flex-col overflow-hidden rounded-lg')}
      style={accentStyle}
      aria-label={getColumnTitle(column)}
    >
      <div className={cn(kanbanColumnAccent, 'h-1 w-full')} />
      <div
        ref={headerRef}
        className={cn('grid gap-3 border-b border-border p-3', !readonly && 'cursor-grab active:cursor-grabbing')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {enableColumnReorder && !readonly ? (
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            ) : null}
            {isEditing ? (
              <TextField
                value={title}
                onChange={event => setTitle(event.target.value)}
                onBlur={() => {
                  void commitTitleEdit()
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') void commitTitleEdit()
                  if (event.key === 'Escape') {
                    setTitle(getColumnTitle(column))
                    setIsEditing(false)
                  }
                }}
                autoFocus
              />
            ) : (
              <Heading as="h3" size="md" weight="medium" truncate>
                {getColumnTitle(column)}
              </Heading>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Badge size="xs" variant="soft" radius="sm">
              {stats.total}
            </Badge>
            {!readonly ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton icon="ellipsis-vertical" title="Column actions" size="xs" variant="ghost" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size="sm" align="end">
                  <DropdownMenu.Item onClick={() => setIsEditing(true)}>Rename column</DropdownMenu.Item>
                  <DropdownMenu.Item
                    color="error"
                    disabled={!canDeleteColumn}
                    onClick={() => {
                      void onColumnDelete(column.id)
                    }}
                  >
                    Delete empty column
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : null}
          </div>
        </div>
        {stats.total > 0 ? (
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>{stats.completed} complete</span>
              <span>{stats.progress}%</span>
            </div>
            <Progress value={stats.progress} size="xs" />
          </div>
        ) : null}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
        <div className="grid gap-[var(--kanban-card-gap)]">
          {column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              column={column}
              readonly={readonly}
              onOpen={onTaskOpen}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
          {column.tasks.length === 0 ? (
            <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-muted-foreground text-sm">
              No tasks
            </div>
          ) : null}
          {enableTaskCreate && !readonly ? (
            isAddingTask ? (
              <QuickTaskForm columnId={column.id} onCreate={onTaskCreate} onCancel={() => setIsAddingTask(false)} />
            ) : (
              <Button variant="ghost" color="neutral" size="sm" iconStart="plus" onClick={() => setIsAddingTask(true)}>
                Add task
              </Button>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
}

interface TaskEditorDialogProps {
  task: KanbanTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (taskId: string, updates: Partial<KanbanTask>) => Promise<void>
  onDelete: (taskId: string) => Promise<boolean>
}

function TaskEditorDialog({ task, open, onOpenChange, onSave, onDelete }: TaskEditorDialogProps) {
  const [draft, setDraft] = React.useState<KanbanTask | null>(task)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    if (open) setDraft(task)
  }, [open, task])

  if (!draft) return null

  const schedule = draft.schedule ?? {}

  function updateDraft(updates: Partial<KanbanTask>) {
    setDraft(current => (current ? { ...current, ...updates } : current))
  }

  async function handleSave() {
    if (!draft) return
    setIsSaving(true)
    try {
      await onSave(draft.id, {
        title: draft.title,
        description: draft.description,
        completed: draft.completed,
        priority: draft.priority,
        schedule: draft.schedule,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!draft) return
    setIsDeleting(true)
    try {
      const deleted = await onDelete(draft.id)
      if (deleted) onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="lg" align="center" maxWidth="42rem">
        <Dialog.Header>
          <Dialog.Title>Edit task</Dialog.Title>
          <Dialog.Description>Update task details, status, and schedule.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-title">
                Title
              </Text>
              <TextField
                id="kanban-task-title"
                value={getTaskTitle(draft)}
                onChange={event =>
                  updateDraft({
                    title: event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-description">
                Description
              </Text>
              <Textarea
                id="kanban-task-description"
                value={draft.description ?? ''}
                onChange={event => updateDraft({ description: event.target.value })}
                minRows={4}
              />
            </div>

            <div className="grid gap-3 rounded-md border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text weight="medium">Schedule</Text>
                  <Text as="p" size="sm" className="text-muted-foreground">
                    Start, end, and duration are linked fields.
                  </Text>
                </div>
                {schedule.lastChanged ? (
                  <Badge size="xs" variant="soft" radius="sm">
                    Last changed: {schedule.lastChanged}
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="grid gap-2">
                  <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-start">
                    Start
                  </Text>
                  <TextField
                    id="kanban-task-start"
                    type="datetime-local"
                    value={toDateTimeLocalValue(schedule.start)}
                    onChange={event =>
                      updateDraft({
                        schedule: applyKanbanScheduleChange(schedule, {
                          field: 'start',
                          value: fromDateTimeLocalValue(event.target.value),
                        }),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-end">
                    End
                  </Text>
                  <TextField
                    id="kanban-task-end"
                    type="datetime-local"
                    value={toDateTimeLocalValue(schedule.end)}
                    onChange={event =>
                      updateDraft({
                        schedule: applyKanbanScheduleChange(schedule, {
                          field: 'end',
                          value: fromDateTimeLocalValue(event.target.value),
                        }),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-duration">
                    Duration
                  </Text>
                  <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
                    <TextField
                      id="kanban-task-duration"
                      type="number"
                      min={0}
                      step={1}
                      value={schedule.duration?.value ?? ''}
                      onChange={event => {
                        if (event.target.value === '') {
                          updateDraft({
                            schedule: applyKanbanScheduleChange(schedule, {
                              field: 'duration',
                              value: null,
                            }),
                          })
                          return
                        }
                        const value = Number(event.target.value)
                        updateDraft({
                          schedule: applyKanbanScheduleChange(schedule, {
                            field: 'duration',
                            value: Number.isFinite(value)
                              ? {
                                  value,
                                  unit: schedule.duration?.unit ?? 'day',
                                }
                              : null,
                          }),
                        })
                      }}
                    />
                    <select
                      className={nativeControlClass}
                      value={schedule.duration?.unit ?? 'day'}
                      onChange={event =>
                        updateDraft({
                          schedule: applyKanbanScheduleChange(schedule, {
                            field: 'duration',
                            value: {
                              value: schedule.duration?.value ?? 1,
                              unit: event.target.value as KanbanDurationUnit,
                            },
                          }),
                        })
                      }
                    >
                      <option value="minute">Minutes</option>
                      <option value="hour">Hours</option>
                      <option value="day">Days</option>
                      <option value="week">Weeks</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                <Clock3 className="h-4 w-4" aria-hidden />
                <span>{formatDuration(schedule.duration) || 'No duration set'}</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(draft.completed)}
                  onChange={event => updateDraft({ completed: event.target.checked })}
                />
                Mark complete
              </label>
              <div className="grid gap-2">
                <Text as="label" size="sm" weight="medium" htmlFor="kanban-task-priority">
                  Priority
                </Text>
                <select
                  id="kanban-task-priority"
                  className={nativeControlClass}
                  value={draft.priority ?? 'none'}
                  onChange={event => updateDraft({ priority: event.target.value as KanbanTask['priority'] })}
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="ghost" color="error" iconStart="trash-2" loading={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function AddColumnCard({ onCreate }: { onCreate: (column: KanbanColumnData) => Promise<void> }) {
  const [isCreating, setIsCreating] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return
    setIsSubmitting(true)
    try {
      await onCreate(makeColumnFromTitle(nextTitle))
      setTitle('')
      setIsCreating(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full w-[var(--kanban-column-width)] shrink-0 flex-col rounded-lg border border-dashed border-border bg-muted/30 p-3">
      {isCreating ? (
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <TextField
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Column name"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="flex-1" loading={isSubmitting}>
              Create
            </Button>
            <IconButton icon="x" title="Cancel" size="sm" variant="ghost" onClick={() => setIsCreating(false)} />
          </div>
        </form>
      ) : (
        <Button variant="ghost" color="neutral" iconStart="plus" onClick={() => setIsCreating(true)}>
          Add column
        </Button>
      )}
    </div>
  )
}

export function KanbanBoard({
  columns: columnsProp,
  defaultColumns = sampleKanbanColumns,
  onColumnsChange,
  onTaskMove,
  onColumnMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onColumnCreate,
  onColumnUpdate,
  onColumnDelete,
  onTaskOpen,
  onError,
  title = 'Kanban',
  density = 'comfortable',
  tone = 'neutral',
  readonly = false,
  searchable = true,
  enableTaskCreate = true,
  enableColumnCreate = true,
  enableColumnReorder = true,
  emptyMessage = 'No columns yet',
  className,
  ...props
}: KanbanBoardProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const isControlled = columnsProp !== undefined
  const [internalColumns, setInternalColumns] = React.useState(() => defaultColumns)
  const [optimisticColumns, setOptimisticColumns] = React.useState<KanbanColumnData[] | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false)
  const optimisticBaseSignature = React.useRef<string | null>(null)
  const currentColumnsRef = React.useRef<KanbanColumnData[]>(columnsProp ?? internalColumns)
  const mutationQueueRef = React.useRef<Promise<unknown>>(Promise.resolve())
  const pendingMutationCountRef = React.useRef(0)
  const [pendingMutationCount, setPendingMutationCount] = React.useState(0)
  const sourceColumns = columnsProp ?? internalColumns
  const sourceSignature = columnsSignature(sourceColumns)
  const sourceSignatureRef = React.useRef(sourceSignature)
  const visibleColumns = optimisticColumns ?? sourceColumns

  React.useEffect(() => {
    sourceSignatureRef.current = sourceSignature
  }, [sourceSignature])

  React.useEffect(() => {
    currentColumnsRef.current = visibleColumns
  }, [visibleColumns])

  React.useEffect(() => {
    if (!optimisticColumns) return
    const optimisticSignature = columnsSignature(optimisticColumns)
    const baseSignature = optimisticBaseSignature.current
    if (sourceSignature === optimisticSignature) {
      setOptimisticColumns(null)
      optimisticBaseSignature.current = null
      currentColumnsRef.current = sourceColumns
      return
    }

    if (baseSignature && sourceSignature !== baseSignature) {
      if (pendingMutationCount > 0) {
        // Controlled consumers should serialize or merge external source pushes
        // while board mutations are pending; this block only protects local optimistic writes.
        optimisticBaseSignature.current = sourceSignature
        return
      }

      setOptimisticColumns(null)
      optimisticBaseSignature.current = null
      currentColumnsRef.current = sourceColumns
    }
  }, [optimisticColumns, pendingMutationCount, sourceColumns, sourceSignature])

  const filteredColumns = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return visibleColumns
    return visibleColumns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        const labels = task.labels?.map(label => label.label).join(' ') ?? ''
        return `${getTaskTitle(task)} ${task.description ?? ''} ${labels}`.toLowerCase().includes(query)
      }),
    }))
  }, [searchQuery, visibleColumns])

  const selectedTaskLocation = selectedTaskId ? findKanbanTask(visibleColumns, selectedTaskId) : null
  const columnTaskCountById = React.useMemo(
    () => new Map(visibleColumns.map(column => [column.id, column.tasks.length])),
    [visibleColumns],
  )
  const totalTasks = visibleColumns.reduce((total, column) => total + column.tasks.length, 0)
  const completedTasks = visibleColumns.reduce(
    (total, column) => total + column.tasks.filter(task => task.completed).length,
    0,
  )

  const applyColumns = React.useCallback(
    (nextColumns: KanbanColumnData[], reason: KanbanChangeDetails) => {
      currentColumnsRef.current = nextColumns
      if (isControlled) {
        optimisticBaseSignature.current = sourceSignatureRef.current
        setOptimisticColumns(nextColumns)
      } else {
        setInternalColumns(nextColumns)
      }
      onColumnsChange?.(nextColumns, reason)
    },
    [isControlled, onColumnsChange],
  )

  const beginMutation = React.useCallback(() => {
    pendingMutationCountRef.current += 1
    setPendingMutationCount(pendingMutationCountRef.current)
  }, [])

  const endMutation = React.useCallback(() => {
    pendingMutationCountRef.current = Math.max(0, pendingMutationCountRef.current - 1)
    setPendingMutationCount(pendingMutationCountRef.current)
  }, [])

  const rollback = React.useCallback(
    (previousColumns: KanbanColumnData[], reason: KanbanChangeDetails, error: unknown) => {
      currentColumnsRef.current = previousColumns
      if (!isControlled) {
        setInternalColumns(previousColumns)
      } else if (columnsSignature(previousColumns) === sourceSignatureRef.current) {
        setOptimisticColumns(null)
        optimisticBaseSignature.current = null
      } else {
        optimisticBaseSignature.current = sourceSignatureRef.current
        setOptimisticColumns(previousColumns)
      }
      onError?.(error, reason)
    },
    [isControlled, onError],
  )

  const runSerializedMutation = React.useCallback(<T,>(mutation: (columns: KanbanColumnData[]) => Promise<T>) => {
    const run = mutationQueueRef.current.catch(() => undefined).then(() => mutation(currentColumnsRef.current))
    mutationQueueRef.current = run.catch(() => undefined)
    return run
  }, [])

  const commitMutation = React.useCallback(
    async (
      previousColumns: KanbanColumnData[],
      nextColumns: KanbanColumnData[],
      reason: KanbanChangeDetails,
      persist: () => Promise<void>,
    ) => {
      beginMutation()
      try {
        applyColumns(nextColumns, reason)
        await persist()
        return true
      } catch (error) {
        rollback(previousColumns, reason, error)
        return false
      } finally {
        endMutation()
      }
    },
    [applyColumns, beginMutation, endMutation, rollback],
  )

  const commitTaskMove = React.useCallback(
    async (input: Parameters<typeof moveKanbanTask>[1]) => {
      return runSerializedMutation(async previousColumns => {
        const result = moveKanbanTask(previousColumns, input)
        if (!result || !result.changed) return

        const details = {
          taskId: result.task.id,
          task: result.task,
          sourceColumnId: result.sourceColumnId,
          targetColumnId: result.targetColumnId,
          sourceIndex: result.sourceIndex,
          targetIndex: result.targetIndex,
        }

        await commitMutation(previousColumns, result.columns, { reason: 'task-move' }, async () => {
          await onTaskMove?.(details, result.columns)
        })
      })
    },
    [commitMutation, onTaskMove, runSerializedMutation],
  )

  const commitColumnMove = React.useCallback(
    async (input: Parameters<typeof moveKanbanColumn>[1]) => {
      return runSerializedMutation(async previousColumns => {
        const result = moveKanbanColumn(previousColumns, input)
        if (!result || !result.changed) return

        const details = {
          columnId: result.columnId,
          sourceIndex: result.sourceIndex,
          targetIndex: result.targetIndex,
        }

        await commitMutation(previousColumns, result.columns, { reason: 'column-move' }, async () => {
          await onColumnMove?.(details, result.columns)
        })
      })
    },
    [commitMutation, onColumnMove, runSerializedMutation],
  )

  React.useEffect(() => {
    const scrollable = scrollRef.current
    if (!scrollable || readonly) return undefined

    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isKanbanDragData(source.data),
        onDrop: ({ source, location }) => {
          const destination = location.current.dropTargets[0]
          if (!destination) return

          if (isTaskDragData(source.data)) {
            if (isTaskDropTargetData(destination.data)) {
              const edge = extractClosestEdge(destination.data)
              void commitTaskMove({
                taskId: source.data.taskId,
                sourceColumnId: source.data.sourceColumnId,
                targetColumnId: destination.data.columnId,
                targetTaskId: destination.data.taskId,
                edge: edge === 'top' || edge === 'bottom' ? edge : null,
              })
              return
            }

            if (isColumnDropTargetData(destination.data)) {
              void commitTaskMove({
                taskId: source.data.taskId,
                sourceColumnId: source.data.sourceColumnId,
                targetColumnId: destination.data.columnId,
              })
            }
            return
          }

          if (isColumnDragData(source.data) && isColumnDropTargetData(destination.data)) {
            const edge = extractClosestEdge(destination.data)
            void commitColumnMove({
              columnId: source.data.columnId,
              targetColumnId: destination.data.columnId,
              edge: edge === 'left' || edge === 'right' ? edge : null,
            })
          }
        },
      }),
      autoScrollForElements({
        element: scrollable,
        canScroll: ({ source }) => isKanbanDragData(source.data),
      }),
    )
  }, [commitColumnMove, commitTaskMove, readonly])

  async function commitTaskCreate(columnId: string, task: KanbanTask) {
    await runSerializedMutation(async previousColumns => {
      const result = addKanbanTask(previousColumns, columnId, task)
      if (!result) return

      await commitMutation(previousColumns, result.columns, { reason: 'task-create' }, async () => {
        await onTaskCreate?.({ columnId, task: result.task }, result.columns)
      })
    })
  }

  async function commitTaskUpdate(taskId: string, updates: Partial<KanbanTask>) {
    await runSerializedMutation(async previousColumns => {
      const result = updateKanbanTask(previousColumns, taskId, task => ({ ...task, ...updates }))
      if (!result) return

      await commitMutation(previousColumns, result.columns, { reason: 'task-update' }, async () => {
        await onTaskUpdate?.({ taskId, task: result.task, updates }, result.columns)
      })
    })
  }

  async function commitTaskDelete(taskId: string) {
    return runSerializedMutation(async previousColumns => {
      const result = deleteKanbanTask(previousColumns, taskId)
      if (!result) return false

      return commitMutation(previousColumns, result.columns, { reason: 'task-delete' }, async () => {
        await onTaskDelete?.({ taskId, task: result.task, columnId: result.columnId }, result.columns)
      })
    })
  }

  async function commitColumnCreate(column: KanbanColumnData) {
    await runSerializedMutation(async previousColumns => {
      const nextColumns = [...previousColumns, column]

      await commitMutation(previousColumns, nextColumns, { reason: 'column-create' }, async () => {
        await onColumnCreate?.({ column }, nextColumns)
      })
    })
  }

  async function commitColumnUpdate(columnId: string, updates: Partial<KanbanColumnData>) {
    await runSerializedMutation(async previousColumns => {
      const result = updateKanbanColumn(previousColumns, columnId, column => ({ ...column, ...updates }))
      if (!result) return

      await commitMutation(previousColumns, result.columns, { reason: 'column-update' }, async () => {
        await onColumnUpdate?.({ columnId, column: result.column, updates }, result.columns)
      })
    })
  }

  async function commitColumnDelete(columnId: string) {
    await runSerializedMutation(async previousColumns => {
      const result = deleteKanbanColumn(previousColumns, columnId)
      if (!result || result.column.tasks.length > 0) return

      await commitMutation(previousColumns, result.columns, { reason: 'column-delete' }, async () => {
        await onColumnDelete?.({ columnId, column: result.column }, result.columns)
      })
    })
  }

  function openTask(task: KanbanTask, column: KanbanColumnData) {
    if (onTaskOpen) {
      onTaskOpen(task, column)
      return
    }
    setSelectedTaskId(task.id)
    setIsTaskDialogOpen(true)
  }

  return (
    <div
      className={cn(
        kanbanRoot({ density, tone }),
        'flex h-full min-h-[32rem] w-full flex-col overflow-hidden rounded-lg',
        className,
      )}
      {...props}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Heading as="h2" size="lg" weight="medium" truncate>
            {title}
          </Heading>
          <Badge size="sm" variant="soft" radius="sm">
            {completedTasks}/{totalTasks} complete
          </Badge>
        </div>
        {searchable ? (
          <div className="w-full max-w-xs">
            <TextField
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search tasks"
              leftIcon={<Search className="h-4 w-4" aria-hidden />}
            />
          </div>
        ) : null}
      </div>

      {visibleColumns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
          <div className="grid gap-3">
            <Text>{emptyMessage}</Text>
            {enableColumnCreate && !readonly ? <AddColumnCard onCreate={commitColumnCreate} /> : null}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full w-max gap-[var(--kanban-board-gap)] p-[var(--kanban-board-padding)]">
            {filteredColumns.map(column => (
              <ColumnView
                key={column.id}
                column={column}
                readonly={readonly}
                enableTaskCreate={enableTaskCreate}
                enableColumnReorder={enableColumnReorder}
                canDeleteColumn={columnTaskCountById.get(column.id) === 0}
                onTaskOpen={openTask}
                onTaskCreate={commitTaskCreate}
                onTaskUpdate={commitTaskUpdate}
                onTaskDelete={commitTaskDelete}
                onColumnUpdate={commitColumnUpdate}
                onColumnDelete={commitColumnDelete}
              />
            ))}
            {enableColumnCreate && !readonly ? <AddColumnCard onCreate={commitColumnCreate} /> : null}
          </div>
        </div>
      )}

      <TaskEditorDialog
        task={selectedTaskLocation?.task ?? null}
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSave={commitTaskUpdate}
        onDelete={commitTaskDelete}
      />
    </div>
  )
}
