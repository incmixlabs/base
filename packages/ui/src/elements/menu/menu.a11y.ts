import type { ReactNode } from 'react'

export function getShortcutAccessibleLabel(children: ReactNode, shortcut?: string) {
  if (!shortcut || (typeof children !== 'string' && typeof children !== 'number')) return undefined
  return `${children} ${shortcut}`
}
