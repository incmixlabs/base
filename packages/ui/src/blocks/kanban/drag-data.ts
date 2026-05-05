import type { KanbanColumn } from './types'

const dataTypeKey = 'incmix-kanban-data-type'

export type KanbanTaskDragData = Record<string | symbol, unknown> & {
  [dataTypeKey]: 'task'
  taskId: string
  sourceColumnId: string
}

export type KanbanTaskDropTargetData = Record<string | symbol, unknown> & {
  [dataTypeKey]: 'task-drop-target'
  taskId: string
  columnId: string
}

export type KanbanColumnDragData = Record<string | symbol, unknown> & {
  [dataTypeKey]: 'column'
  columnId: string
}

export type KanbanColumnDropTargetData = Record<string | symbol, unknown> & {
  [dataTypeKey]: 'column-drop-target'
  columnId: string
}

export function getTaskDragData(taskId: string, sourceColumnId: string): KanbanTaskDragData {
  return {
    [dataTypeKey]: 'task',
    taskId,
    sourceColumnId,
  }
}

export function getTaskDropTargetData(taskId: string, columnId: string): KanbanTaskDropTargetData {
  return {
    [dataTypeKey]: 'task-drop-target',
    taskId,
    columnId,
  }
}

export function getColumnDragData(column: KanbanColumn): KanbanColumnDragData {
  return {
    [dataTypeKey]: 'column',
    columnId: column.id,
  }
}

export function getColumnDropTargetData(column: KanbanColumn): KanbanColumnDropTargetData {
  return {
    [dataTypeKey]: 'column-drop-target',
    columnId: column.id,
  }
}

export function isTaskDragData(value: Record<string | symbol, unknown>): value is KanbanTaskDragData {
  return value[dataTypeKey] === 'task'
}

export function isTaskDropTargetData(value: Record<string | symbol, unknown>): value is KanbanTaskDropTargetData {
  return value[dataTypeKey] === 'task-drop-target'
}

export function isColumnDragData(value: Record<string | symbol, unknown>): value is KanbanColumnDragData {
  return value[dataTypeKey] === 'column'
}

export function isColumnDropTargetData(value: Record<string | symbol, unknown>): value is KanbanColumnDropTargetData {
  return value[dataTypeKey] === 'column-drop-target'
}

export function isKanbanDragData(value: Record<string | symbol, unknown>) {
  return isTaskDragData(value) || isColumnDragData(value)
}
