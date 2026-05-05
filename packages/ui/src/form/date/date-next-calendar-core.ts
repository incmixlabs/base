import { eachDayOfInterval, endOfMonth, endOfWeek, format as formatDate, startOfMonth, startOfWeek } from 'date-fns'
import type { WeekStartsOn } from './date-next.props'

export const normalizeDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const toDayKey = (date: Date) => formatDate(date, 'yyyy-MM-dd')

export const getWeekStartsOn = (locale: string): WeekStartsOn => {
  const LocaleCtor = (
    Intl as typeof Intl & {
      Locale?: new (tag: string) => unknown
    }
  ).Locale
  if (!LocaleCtor) return 0
  const localeInfo = new LocaleCtor(locale) as { weekInfo?: { firstDay?: number } }
  const firstDay = localeInfo.weekInfo?.firstDay
  if (typeof firstDay !== 'number') return 0
  if (firstDay === 7) return 0
  if (firstDay >= 1 && firstDay <= 6) return firstDay as 1 | 2 | 3 | 4 | 5 | 6
  return 0
}

export const getDaysForMonth = (monthDate: Date, weekStartsOn: WeekStartsOn) =>
  eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate), { weekStartsOn }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn }),
  })

export const getWeeksForMonth = (monthDate: Date, weekStartsOn: WeekStartsOn) => {
  const days = getDaysForMonth(monthDate, weekStartsOn)
  const weeks: Date[][] = []
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7))
  }
  return weeks
}
