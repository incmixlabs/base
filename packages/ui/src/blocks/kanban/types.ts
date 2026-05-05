import type * as React from 'react'

export type KanbanDateValue = Date | string | number

export type KanbanDurationUnit = 'minute' | 'hour' | 'day' | 'week'

export interface KanbanDuration {
  value: number
  unit: KanbanDurationUnit
}

export type KanbanScheduleField = 'start' | 'end' | 'duration'

export interface KanbanSchedule {
  start?: KanbanDateValue | null
  end?: KanbanDateValue | null
  duration?: KanbanDuration | null
  /**
   * The field the user most recently changed directly. This is used to keep
   * start/end/duration from rubberbanding when one field derives another.
   */
  lastChanged?: KanbanScheduleField
}

export interface KanbanLabel {
  id?: string
  label: string
  color?: string
}

export interface KanbanAssignee {
  id: string
  name: string
  avatar?: string
  email?: string
}

export interface KanbanSubtask {
  id: string
  title: string
  completed?: boolean
}

export type KanbanPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent' | 'critical'

export interface KanbanTask {
  id: string
  title?: string
  description?: string
  completed?: boolean
  priority?: KanbanPriority
  labels?: KanbanLabel[]
  assignees?: KanbanAssignee[]
  subtasks?: KanbanSubtask[]
  attachmentsCount?: number
  commentsCount?: number
  schedule?: KanbanSchedule
  columnId?: string
  statusId?: string
  metadata?: Record<string, unknown>
}

export interface KanbanColumn {
  id: string
  title?: string
  description?: string
  color?: string
  tasks: KanbanTask[]
  wipLimit?: number
  metadata?: Record<string, unknown>
}

export type KanbanDensity = 'compact' | 'comfortable'

export type KanbanTone = 'neutral' | 'workbench'

export type KanbanChangeReason =
  | 'column-create'
  | 'column-delete'
  | 'column-move'
  | 'column-update'
  | 'task-create'
  | 'task-delete'
  | 'task-move'
  | 'task-update'

export interface KanbanChangeDetails {
  reason: KanbanChangeReason
}

export interface KanbanTaskMoveDetails {
  taskId: string
  task: KanbanTask
  sourceColumnId: string
  targetColumnId: string
  sourceIndex: number
  targetIndex: number
}

export interface KanbanColumnMoveDetails {
  columnId: string
  sourceIndex: number
  targetIndex: number
}

export type KanbanAsyncHandler<T> = (details: T, nextColumns: KanbanColumn[]) => void | Promise<void>

export interface KanbanBoardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'title'> {
  columns?: KanbanColumn[]
  defaultColumns?: KanbanColumn[]
  onColumnsChange?: (columns: KanbanColumn[], details: KanbanChangeDetails) => void
  onTaskMove?: KanbanAsyncHandler<KanbanTaskMoveDetails>
  onColumnMove?: KanbanAsyncHandler<KanbanColumnMoveDetails>
  onTaskCreate?: KanbanAsyncHandler<{ columnId: string; task: KanbanTask }>
  onTaskUpdate?: KanbanAsyncHandler<{ taskId: string; task: KanbanTask; updates: Partial<KanbanTask> }>
  onTaskDelete?: KanbanAsyncHandler<{ taskId: string; task: KanbanTask; columnId: string }>
  onColumnCreate?: KanbanAsyncHandler<{ column: KanbanColumn }>
  onColumnUpdate?: KanbanAsyncHandler<{ columnId: string; column: KanbanColumn; updates: Partial<KanbanColumn> }>
  onColumnDelete?: KanbanAsyncHandler<{ columnId: string; column: KanbanColumn }>
  onTaskOpen?: (task: KanbanTask, column: KanbanColumn) => void
  onError?: (error: unknown, details: KanbanChangeDetails) => void
  title?: React.ReactNode
  density?: KanbanDensity
  tone?: KanbanTone
  readonly?: boolean
  searchable?: boolean
  enableTaskCreate?: boolean
  enableColumnCreate?: boolean
  enableColumnReorder?: boolean
  emptyMessage?: React.ReactNode
}
