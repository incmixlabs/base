import type { Color, ThemeColorToken } from '@/theme/tokens'

export type StatusIconStatus = 'todo' | 'triage' | 'review' | 'in-progress' | 'on-hold' | 'rejected' | 'done'

export type StatusTone = {
  color: string
  background: string
  border: string
  text: string
}

const inProgressTone: StatusTone = {
  color: 'var(--blue-9)',
  background: 'var(--blue-4)',
  border: 'var(--blue-7)',
  text: 'var(--blue-11)',
}

export const statusToneByValue: Record<StatusIconStatus, StatusTone> = {
  todo: {
    color: 'var(--gray-9)',
    background: 'var(--gray-4)',
    border: 'var(--gray-7)',
    text: 'var(--gray-11)',
  },
  triage: {
    color: 'var(--orange-9)',
    background: 'var(--orange-4)',
    border: 'var(--orange-7)',
    text: 'var(--orange-11)',
  },
  review: inProgressTone,
  'in-progress': inProgressTone,
  'on-hold': {
    color: 'var(--orange-9)',
    background: 'var(--orange-4)',
    border: 'var(--orange-7)',
    text: 'var(--orange-11)',
  },
  rejected: {
    color: 'var(--red-9)',
    background: 'var(--red-4)',
    border: 'var(--red-7)',
    text: 'var(--red-11)',
  },
  done: {
    color: 'var(--green-9)',
    background: 'var(--green-4)',
    border: 'var(--green-7)',
    text: 'var(--green-11)',
  },
}

export const statusLabelByValue: Record<StatusIconStatus, string> = {
  todo: 'Todo',
  triage: 'Triage',
  review: 'Review',
  'in-progress': 'In Progress',
  'on-hold': 'On Hold',
  rejected: 'Rejected',
  done: 'Executed',
}

export const statusSemanticColorByValue: Record<StatusIconStatus, Color> = {
  todo: 'neutral',
  triage: 'warning',
  review: 'info',
  'in-progress': 'info',
  'on-hold': 'warning',
  rejected: 'error',
  done: 'success',
}

export const statusIconColorTokenByValue: Record<StatusIconStatus, ThemeColorToken> = {
  todo: 'gray-9',
  triage: 'orange-9',
  review: 'blue-9',
  'in-progress': 'blue-9',
  'on-hold': 'orange-9',
  rejected: 'red-9',
  done: 'green-9',
}

export const lucideStatusIcons: Record<StatusIconStatus, string> = {
  todo: 'circle',
  triage: 'circle-minus',
  review: 'eye',
  'in-progress': 'ellipsis',
  'on-hold': 'pause',
  rejected: 'circle-x',
  done: 'circle-check-big',
}

export function isKnownStatusValue(value: string): value is StatusIconStatus {
  return Object.hasOwn(statusToneByValue, value)
}
