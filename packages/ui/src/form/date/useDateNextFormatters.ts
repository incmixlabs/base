import { useEffect, useMemo, useState } from 'react'
import type { WeekStartsOn } from './date-next.props'
import { getWeekStartsOn } from './date-next-calendar-core'

function resolveLocale(candidate?: string): string {
  if (!candidate) return 'en-US'
  try {
    return Intl.getCanonicalLocales(candidate)[0] ?? 'en-US'
  } catch {
    return 'en-US'
  }
}

export interface DateNextFormatters {
  locale: string
  weekStartsOn: WeekStartsOn
  monthHeadingFormatter: Intl.DateTimeFormat
  weekDayFormatter: Intl.DateTimeFormat
  dayNumberFormatter: Intl.NumberFormat
  dayLabelFormatter: Intl.DateTimeFormat
}

/** Shared locale-aware formatters for date-next calendar components. */
export function useDateNextFormatters(): DateNextFormatters {
  const [locale, setLocale] = useState('en-US')

  useEffect(() => {
    const detected = resolveLocale(document.documentElement.lang)
    setLocale(detected)
  }, [])

  const weekStartsOn = useMemo(() => getWeekStartsOn(locale), [locale])
  const monthHeadingFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale],
  )
  const weekDayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }), [locale])
  const dayNumberFormatter = useMemo(() => new Intl.NumberFormat(locale, { useGrouping: false }), [locale])
  const dayLabelFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    [locale],
  )

  return { locale, weekStartsOn, monthHeadingFormatter, weekDayFormatter, dayNumberFormatter, dayLabelFormatter }
}
