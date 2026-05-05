import type { KanbanColumn, KanbanTask } from './types'

export type KanbanTaskDropEdge = 'top' | 'bottom' | null | undefined
export type KanbanColumnDropEdge = 'left' | 'right' | null | undefined

export interface MoveKanbanTaskInput {
  taskId: string
  sourceColumnId: string
  targetColumnId: string
  targetTaskId?: string
  targetIndex?: number
  edge?: KanbanTaskDropEdge
}

export interface MoveKanbanTaskResult {
  columns: KanbanColumn[]
  task: KanbanTask
  sourceColumnId: string
  targetColumnId: string
  sourceIndex: number
  targetIndex: number
  changed: boolean
}

export interface MoveKanbanColumnInput {
  columnId: string
  targetColumnId: string
  edge?: KanbanColumnDropEdge
}

export interface MoveKanbanColumnResult {
  columns: KanbanColumn[]
  columnId: string
  sourceIndex: number
  targetIndex: number
  changed: boolean
}

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), length)
}

export function createKanbanTaskId() {
  return `task-${Math.random().toString(36).slice(2, 10)}`
}

export function createKanbanColumnId() {
  return `column-${Math.random().toString(36).slice(2, 10)}`
}

export function findKanbanTask(columns: KanbanColumn[], taskId: string) {
  for (const column of columns) {
    const taskIndex = column.tasks.findIndex(task => task.id === taskId)
    if (taskIndex >= 0) {
      return {
        column,
        task: column.tasks[taskIndex],
        taskIndex,
      }
    }
  }
  return null
}

export function moveKanbanTask(columns: KanbanColumn[], input: MoveKanbanTaskInput): MoveKanbanTaskResult | null {
  const sourceColumnIndex = columns.findIndex(column => column.id === input.sourceColumnId)
  const targetColumnIndex = columns.findIndex(column => column.id === input.targetColumnId)
  if (sourceColumnIndex < 0 || targetColumnIndex < 0) return null

  const sourceColumn = columns[sourceColumnIndex]
  const targetColumn = columns[targetColumnIndex]
  const sourceIndex = sourceColumn.tasks.findIndex(task => task.id === input.taskId)
  if (sourceIndex < 0) return null

  const task = sourceColumn.tasks[sourceIndex]
  let rawTargetIndex = input.targetIndex

  if (rawTargetIndex === undefined && input.targetTaskId) {
    const targetTaskIndex = targetColumn.tasks.findIndex(taskItem => taskItem.id === input.targetTaskId)
    if (targetTaskIndex < 0) return null
    rawTargetIndex = input.edge === 'bottom' ? targetTaskIndex + 1 : targetTaskIndex
  }

  if (rawTargetIndex === undefined) {
    rawTargetIndex = targetColumn.tasks.length
  }

  let targetIndex = rawTargetIndex
  if (sourceColumn.id === targetColumn.id && targetIndex > sourceIndex) {
    targetIndex -= 1
  }

  targetIndex = clampIndex(
    targetIndex,
    sourceColumn.id === targetColumn.id ? sourceColumn.tasks.length - 1 : targetColumn.tasks.length,
  )

  if (sourceColumn.id === targetColumn.id && targetIndex === sourceIndex) {
    return {
      columns,
      task,
      sourceColumnId: sourceColumn.id,
      targetColumnId: targetColumn.id,
      sourceIndex,
      targetIndex,
      changed: false,
    }
  }

  const nextColumns = columns.map(column => ({ ...column, tasks: [...column.tasks] }))
  const nextSourceColumn = nextColumns[sourceColumnIndex]
  const [movedTask] = nextSourceColumn.tasks.splice(sourceIndex, 1)
  if (!movedTask) return null

  const nextTargetColumn = nextColumns[targetColumnIndex]
  const movedTaskInTarget: KanbanTask = {
    ...movedTask,
    columnId: targetColumn.id,
    statusId: targetColumn.id,
  }
  nextTargetColumn.tasks.splice(targetIndex, 0, movedTaskInTarget)

  return {
    columns: nextColumns,
    task: movedTaskInTarget,
    sourceColumnId: sourceColumn.id,
    targetColumnId: targetColumn.id,
    sourceIndex,
    targetIndex,
    changed: true,
  }
}

export function moveKanbanColumn(columns: KanbanColumn[], input: MoveKanbanColumnInput): MoveKanbanColumnResult | null {
  const sourceIndex = columns.findIndex(column => column.id === input.columnId)
  const targetColumnIndex = columns.findIndex(column => column.id === input.targetColumnId)
  if (sourceIndex < 0 || targetColumnIndex < 0) return null
  if (sourceIndex === targetColumnIndex) {
    return {
      columns,
      columnId: input.columnId,
      sourceIndex,
      targetIndex: targetColumnIndex,
      changed: false,
    }
  }

  let targetIndex = input.edge === 'right' ? targetColumnIndex + 1 : targetColumnIndex
  if (targetIndex > sourceIndex) targetIndex -= 1
  targetIndex = clampIndex(targetIndex, columns.length - 1)

  if (sourceIndex === targetIndex) {
    return {
      columns,
      columnId: input.columnId,
      sourceIndex,
      targetIndex,
      changed: false,
    }
  }

  const nextColumns = [...columns]
  const [column] = nextColumns.splice(sourceIndex, 1)
  if (!column) return null
  nextColumns.splice(targetIndex, 0, column)

  return {
    columns: nextColumns,
    columnId: input.columnId,
    sourceIndex,
    targetIndex,
    changed: true,
  }
}

export function updateKanbanTask(columns: KanbanColumn[], taskId: string, updater: (task: KanbanTask) => KanbanTask) {
  let updatedTask: KanbanTask | null = null
  const nextColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.map(task => {
      if (task.id !== taskId) return task
      updatedTask = updater(task)
      return updatedTask
    }),
  }))

  return updatedTask ? { columns: nextColumns, task: updatedTask } : null
}

export function deleteKanbanTask(columns: KanbanColumn[], taskId: string) {
  const location = findKanbanTask(columns, taskId)
  if (!location) return null

  return {
    columns: columns.map(column =>
      column.id === location.column.id ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) } : column,
    ),
    task: location.task,
    columnId: location.column.id,
  }
}

export function addKanbanTask(columns: KanbanColumn[], columnId: string, task: KanbanTask) {
  const column = columns.find(columnItem => columnItem.id === columnId)
  if (!column) return null

  const nextTask = { ...task, columnId, statusId: columnId }
  return {
    columns: columns.map(columnItem =>
      columnItem.id === columnId ? { ...columnItem, tasks: [...columnItem.tasks, nextTask] } : columnItem,
    ),
    task: nextTask,
  }
}

export function updateKanbanColumn(
  columns: KanbanColumn[],
  columnId: string,
  updater: (column: KanbanColumn) => KanbanColumn,
) {
  let updatedColumn: KanbanColumn | null = null
  const nextColumns = columns.map(column => {
    if (column.id !== columnId) return column
    updatedColumn = updater(column)
    return updatedColumn
  })

  return updatedColumn ? { columns: nextColumns, column: updatedColumn } : null
}

export function deleteKanbanColumn(columns: KanbanColumn[], columnId: string) {
  const column = columns.find(columnItem => columnItem.id === columnId)
  if (!column) return null
  return {
    columns: columns.filter(columnItem => columnItem.id !== columnId),
    column,
  }
}
