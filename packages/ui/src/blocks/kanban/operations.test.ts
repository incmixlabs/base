import { describe, expect, it } from 'vitest'
import { moveKanbanColumn, moveKanbanTask } from './operations'
import type { KanbanColumn } from './types'

function createColumns(): KanbanColumn[] {
  return [
    {
      id: 'todo',
      title: 'Todo',
      tasks: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      tasks: [{ id: 'c', title: 'C' }],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
    },
  ]
}

describe('kanban operations', () => {
  it('moves a task between columns using card edge placement', () => {
    const result = moveKanbanTask(createColumns(), {
      taskId: 'a',
      sourceColumnId: 'todo',
      targetColumnId: 'doing',
      targetTaskId: 'c',
      edge: 'bottom',
    })

    expect(result?.changed).toBe(true)
    expect(result?.task.columnId).toBe('doing')
    expect(result?.task.statusId).toBe('doing')
    expect(result?.columns[0]?.tasks.map(task => task.id)).toEqual(['b'])
    expect(result?.columns[1]?.tasks.map(task => task.id)).toEqual(['c', 'a'])
    expect(result?.columns[1]?.tasks[1]?.columnId).toBe('doing')
  })

  it('reorders a task within the same column without duplicating it', () => {
    const result = moveKanbanTask(createColumns(), {
      taskId: 'a',
      sourceColumnId: 'todo',
      targetColumnId: 'todo',
      targetTaskId: 'b',
      edge: 'bottom',
    })

    expect(result?.changed).toBe(true)
    expect(result?.columns[0]?.tasks.map(task => task.id)).toEqual(['b', 'a'])
  })

  it('reorders columns using horizontal edge placement', () => {
    const result = moveKanbanColumn(createColumns(), {
      columnId: 'todo',
      targetColumnId: 'done',
      edge: 'right',
    })

    expect(result?.changed).toBe(true)
    expect(result?.columns.map(column => column.id)).toEqual(['doing', 'done', 'todo'])
  })
})
