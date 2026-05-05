import type { JsonValue } from './schema-ast'

export const autoFormDateRuleModes = ['past', 'future'] as const
export type AutoFormDateRuleMode = (typeof autoFormDateRuleModes)[number]

export const autoFormDateRulesHintKey = '$autoform:dateRules' as const

export interface AutoFormDateRules {
  [key: string]: string | number | undefined
  mode?: AutoFormDateRuleMode
  minDate?: string
  maxDate?: string
  minAge?: number
  maxAge?: number
}

export interface AutoFormResolvedDateBounds {
  minValue?: Date
  maxValue?: Date
}

export function getAutoFormDateRules(value: unknown): AutoFormDateRules | undefined {
  if (!isRecord(value)) return undefined

  const mode = isAutoFormDateRuleMode(value.mode) ? value.mode : undefined
  const minDate = typeof value.minDate === 'string' && value.minDate.length > 0 ? value.minDate : undefined
  const maxDate = typeof value.maxDate === 'string' && value.maxDate.length > 0 ? value.maxDate : undefined
  const minAge = typeof value.minAge === 'number' && Number.isFinite(value.minAge) ? value.minAge : undefined
  const maxAge = typeof value.maxAge === 'number' && Number.isFinite(value.maxAge) ? value.maxAge : undefined

  if (!mode && !minDate && !maxDate && minAge === undefined && maxAge === undefined) {
    return undefined
  }

  return {
    mode,
    minDate,
    maxDate,
    minAge,
    maxAge,
  }
}

export function getAutoFormDateRulesFromHints(hints: Record<string, JsonValue>): AutoFormDateRules | undefined {
  return getAutoFormDateRules(hints[autoFormDateRulesHintKey])
}

export function resolveAutoFormDateBounds(
  format: string | undefined,
  rules: AutoFormDateRules | undefined,
  now: Date = new Date(),
): AutoFormResolvedDateBounds {
  if (!rules) return {}

  const minCandidates: Date[] = []
  const maxCandidates: Date[] = []

  if (rules.minDate) {
    const parsed = parseRuleDate(rules.minDate, format)
    if (parsed) minCandidates.push(parsed)
  }

  if (rules.maxDate) {
    const parsed = parseRuleDate(rules.maxDate, format)
    if (parsed) maxCandidates.push(parsed)
  }

  if (rules.mode === 'future') {
    minCandidates.push(format === 'date' ? addDays(startOfLocalDay(now), 1) : now)
  }

  if (rules.mode === 'past') {
    maxCandidates.push(format === 'date' ? addDays(startOfLocalDay(now), -1) : now)
  }

  if (rules.minAge !== undefined) {
    maxCandidates.push(addYears(startOfLocalDay(now), -rules.minAge))
  }

  if (rules.maxAge !== undefined) {
    minCandidates.push(addYears(startOfLocalDay(now), -rules.maxAge))
  }

  return {
    minValue: getLatestDate(minCandidates),
    maxValue: getEarliestDate(maxCandidates),
  }
}

export function validateAutoFormDateRules(
  value: unknown,
  format: string | undefined,
  rules: AutoFormDateRules | undefined,
  now: Date = new Date(),
): string[] {
  if (!rules) return []
  if (value === undefined || value === null || value === '') return []

  const parsed = parseFieldDateValue(value, format)
  if (!parsed) return []

  const messages: string[] = []

  if (rules.mode === 'past') {
    const threshold = format === 'date' ? addDays(startOfLocalDay(now), -1) : now
    if (parsed > threshold) {
      messages.push(format === 'date' ? 'Date must be in the past.' : 'Date and time must be in the past.')
    }
  }

  if (rules.mode === 'future') {
    const threshold = format === 'date' ? addDays(startOfLocalDay(now), 1) : now
    if (parsed < threshold) {
      messages.push(format === 'date' ? 'Date must be in the future.' : 'Date and time must be in the future.')
    }
  }

  if (rules.minDate) {
    const threshold = parseRuleDate(rules.minDate, format)
    if (threshold && parsed < threshold) {
      messages.push(`Date must be on or after ${rules.minDate}.`)
    }
  }

  if (rules.maxDate) {
    const threshold = parseRuleDate(rules.maxDate, format)
    if (threshold && parsed > threshold) {
      messages.push(`Date must be on or before ${rules.maxDate}.`)
    }
  }

  if (rules.minAge !== undefined) {
    const latestBirthDate = addYears(startOfLocalDay(now), -rules.minAge)
    if (parsed > latestBirthDate) {
      messages.push(`Must be at least ${rules.minAge} years old.`)
    }
  }

  if (rules.maxAge !== undefined) {
    const earliestBirthDate = addYears(startOfLocalDay(now), -rules.maxAge)
    if (parsed < earliestBirthDate) {
      messages.push(`Must be no more than ${rules.maxAge} years old.`)
    }
  }

  return messages
}

function isAutoFormDateRuleMode(value: unknown): value is AutoFormDateRuleMode {
  return autoFormDateRuleModes.some(mode => mode === value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseFieldDateValue(value: unknown, format: string | undefined): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value
  if (typeof value !== 'string' || value.length === 0) return undefined
  return parseRuleDate(value, format)
}

function parseRuleDate(value: string, format: string | undefined): Date | undefined {
  if (format === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    if (!year || !month || !day) return undefined
    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? undefined : startOfLocalDay(parsed)
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function addDays(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

function addYears(value: Date, amount: number) {
  const next = new Date(value)
  next.setFullYear(next.getFullYear() + amount)
  return next
}

function getLatestDate(values: Date[]) {
  if (values.length === 0) return undefined
  return values.reduce((latest, current) => (current > latest ? current : latest))
}

function getEarliestDate(values: Date[]) {
  if (values.length === 0) return undefined
  return values.reduce((earliest, current) => (current < earliest ? current : earliest))
}
