import { addDays, addWeeks, subDays, subWeeks } from 'date-fns'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'

/** Arrow key → date movement mapping for calendar day grids. */
export const calendarArrowKeyMoves = {
  [KEYBOARD_KEYS.arrowRight]: (date: Date) => addDays(date, 1),
  [KEYBOARD_KEYS.arrowLeft]: (date: Date) => subDays(date, 1),
  [KEYBOARD_KEYS.arrowDown]: (date: Date) => addWeeks(date, 1),
  [KEYBOARD_KEYS.arrowUp]: (date: Date) => subWeeks(date, 1),
} as const

export type CalendarArrowKey = keyof typeof calendarArrowKeyMoves

export const isCalendarArrowKey = (key: string): key is CalendarArrowKey => key in calendarArrowKeyMoves
