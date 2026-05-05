import { describe, expect, it } from 'vitest'
import { applyKanbanScheduleChange, coerceKanbanDate } from './schedule'

describe('kanban schedule composite fields', () => {
  it('moves end when duration is explicitly changed', () => {
    const start = new Date('2026-04-23T09:00:00.000Z')
    const next = applyKanbanScheduleChange(
      {
        start,
        end: new Date('2026-04-24T09:00:00.000Z'),
        duration: { value: 1, unit: 'day' },
      },
      { field: 'duration', value: { value: 3, unit: 'day' } },
    )

    expect(coerceKanbanDate(next.end)?.toISOString()).toBe('2026-04-26T09:00:00.000Z')
    expect(next.duration).toEqual({ value: 3, unit: 'day' })
    expect(next.lastChanged).toBe('duration')
  })

  it('updates duration when end is explicitly changed', () => {
    const next = applyKanbanScheduleChange(
      {
        start: new Date('2026-04-23T09:00:00.000Z'),
        end: new Date('2026-04-24T09:00:00.000Z'),
        duration: { value: 1, unit: 'day' },
      },
      { field: 'end', value: new Date('2026-04-25T09:00:00.000Z') },
    )

    expect(next.duration).toEqual({ value: 2, unit: 'day' })
    expect(next.lastChanged).toBe('end')
  })

  it('moves end when start is explicitly changed', () => {
    const next = applyKanbanScheduleChange(
      {
        start: new Date('2026-04-23T09:00:00.000Z'),
        end: new Date('2026-04-25T09:00:00.000Z'),
        duration: { value: 2, unit: 'day' },
      },
      { field: 'start', value: new Date('2026-04-24T09:00:00.000Z') },
    )

    expect(coerceKanbanDate(next.end)?.toISOString()).toBe('2026-04-26T09:00:00.000Z')
    expect(next.duration).toEqual({ value: 2, unit: 'day' })
    expect(next.lastChanged).toBe('start')
  })
})
