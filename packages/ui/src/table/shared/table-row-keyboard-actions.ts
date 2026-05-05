import type * as React from 'react'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'

export const TABLE_ROW_ID_ATTRIBUTE = 'data-table-row-id'

export type TableRowKeyboardAction = 'duplicate' | 'remove' | 'indent' | 'outdent' | 'move-up' | 'move-down'

const tableRowSelector = `[${TABLE_ROW_ID_ATTRIBUTE}]`
const ignoredInteractiveSelector = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="combobox"]',
  '[role="textbox"]',
  '[data-table-row-actions-slot]',
].join(',')

function isElementTarget(target: EventTarget | null): target is Element {
  return target instanceof Element
}

export function getTableRowIdFromKeyboardEvent(event: React.KeyboardEvent): string | undefined {
  if (!isElementTarget(event.target)) return undefined
  return event.target.closest<HTMLElement>(tableRowSelector)?.getAttribute(TABLE_ROW_ID_ATTRIBUTE) ?? undefined
}

export function getTableRowKeyboardAction(event: React.KeyboardEvent): TableRowKeyboardAction | null {
  if (event.defaultPrevented || event.repeat) return null
  if (isElementTarget(event.target) && event.target.closest(ignoredInteractiveSelector)) return null

  const key = event.key.toLowerCase()
  const hasCommandModifier = (event.metaKey || event.ctrlKey) && !event.altKey
  const hasOnlyAltModifier = event.altKey && !event.metaKey && !event.ctrlKey

  if (hasCommandModifier && key === 'd') return 'duplicate'
  if (hasCommandModifier && (event.key === ']' || event.code === 'BracketRight')) return 'indent'
  if (hasCommandModifier && (event.key === '[' || event.code === 'BracketLeft')) return 'outdent'
  if (hasOnlyAltModifier && event.key === KEYBOARD_KEYS.arrowUp) return 'move-up'
  if (hasOnlyAltModifier && event.key === KEYBOARD_KEYS.arrowDown) return 'move-down'
  if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === 'Delete') return 'remove'

  return null
}
