export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/

function parseDateOnly(value: string) {
  const match = dateOnlyPattern.exec(value)
  if (!match) return undefined
  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText) - 1
  const day = Number(dayText)
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return undefined
  return date
}

function formatDateValue(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value: string | undefined): string {
  if (!value) return '-'
  const dateOnly = parseDateOnly(value)
  if (dateOnly) return formatDateValue(dateOnly)
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return value
  return formatDateValue(new Date(timestamp))
}

export function formatDurationMs(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value) || value < 0) return '-'
  const seconds = Math.round(value / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}
