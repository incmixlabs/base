import type { KanbanDateValue, KanbanDuration, KanbanDurationUnit, KanbanSchedule, KanbanScheduleField } from './types'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const UNIT_MS: Record<KanbanDurationUnit, number> = {
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: WEEK,
}

export type KanbanScheduleChange =
  | { field: 'start'; value: KanbanDateValue | null | undefined }
  | { field: 'end'; value: KanbanDateValue | null | undefined }
  | { field: 'duration'; value: KanbanDuration | null | undefined }

export function coerceKanbanDate(value: KanbanDateValue | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function durationToMilliseconds(duration: KanbanDuration | null | undefined): number | null {
  if (!duration) return null
  const unitMs = UNIT_MS[duration.unit]
  if (!unitMs || !Number.isFinite(duration.value)) return null
  return Math.max(0, duration.value) * unitMs
}

export function millisecondsToDuration(milliseconds: number): KanbanDuration {
  const safeMilliseconds = Math.max(0, milliseconds)
  const units: KanbanDurationUnit[] = ['week', 'day', 'hour', 'minute']
  for (const unit of units) {
    const value = safeMilliseconds / UNIT_MS[unit]
    if (value >= 1 && Number.isInteger(value)) return { value, unit }
  }

  const minutes = safeMilliseconds / MINUTE
  return { value: Math.round(minutes * 100) / 100, unit: 'minute' }
}

export function addDuration(date: Date, duration: KanbanDuration): Date | null {
  const milliseconds = durationToMilliseconds(duration)
  if (milliseconds === null) return null
  return new Date(date.getTime() + milliseconds)
}

export function subtractDuration(date: Date, duration: KanbanDuration): Date | null {
  const milliseconds = durationToMilliseconds(duration)
  if (milliseconds === null) return null
  return new Date(date.getTime() - milliseconds)
}

export function getDurationBetween(start: Date, end: Date): KanbanDuration {
  return millisecondsToDuration(Math.max(0, end.getTime() - start.getTime()))
}

function normalizeDuration(duration: KanbanDuration | null | undefined): KanbanDuration | null {
  if (!duration) return null
  if (!Number.isFinite(duration.value)) return null
  return {
    value: Math.max(0, duration.value),
    unit: duration.unit,
  }
}

function inferExistingDuration(schedule: KanbanSchedule): KanbanDuration | null {
  const duration = normalizeDuration(schedule.duration)
  if (duration) return duration

  const start = coerceKanbanDate(schedule.start)
  const end = coerceKanbanDate(schedule.end)
  if (!start || !end) return null
  return getDurationBetween(start, end)
}

export function applyKanbanScheduleChange(schedule: KanbanSchedule | undefined, change: KanbanScheduleChange) {
  const current: KanbanSchedule = schedule ? { ...schedule } : {}
  const next: KanbanSchedule = { ...current, lastChanged: change.field }

  if (change.field === 'start') {
    next.start = change.value ?? null
    const start = coerceKanbanDate(change.value)
    const duration = inferExistingDuration(current)

    if (start && duration) {
      next.duration = duration
      next.end = addDuration(start, duration)
    } else if (start && current.end) {
      const end = coerceKanbanDate(current.end)
      if (end) next.duration = getDurationBetween(start, end)
    }

    return next
  }

  if (change.field === 'end') {
    next.end = change.value ?? null
    const start = coerceKanbanDate(current.start)
    const end = coerceKanbanDate(change.value)

    if (start && end) {
      next.duration = getDurationBetween(start, end)
    } else if (end && current.duration) {
      const startFromDuration = subtractDuration(end, current.duration)
      if (startFromDuration) next.start = startFromDuration
    }

    return next
  }

  const duration = normalizeDuration(change.value)
  next.duration = duration
  const start = coerceKanbanDate(current.start)
  const end = coerceKanbanDate(current.end)

  if (duration && start) {
    next.end = addDuration(start, duration)
  } else if (duration && end) {
    next.start = subtractDuration(end, duration)
  }

  return next
}

export function getKanbanScheduleField(schedule: KanbanSchedule | undefined): KanbanScheduleField | undefined {
  return schedule?.lastChanged
}

export function toDateTimeLocalValue(value: KanbanDateValue | null | undefined): string {
  const date = coerceKanbanDate(value)
  if (!date) return ''
  const timezoneOffset = date.getTimezoneOffset() * MINUTE
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function fromDateTimeLocalValue(value: string): Date | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function formatScheduleDate(value: KanbanDateValue | null | undefined): string {
  const date = coerceKanbanDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDuration(duration: KanbanDuration | null | undefined): string {
  const normalized = normalizeDuration(duration)
  if (!normalized) return ''
  const suffix = normalized.value === 1 ? normalized.unit : `${normalized.unit}s`
  return `${normalized.value} ${suffix}`
}
