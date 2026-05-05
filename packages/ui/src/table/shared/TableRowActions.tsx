'use client'

import * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { IconButton } from '@/elements/button/IconButton'
import { ToggleGroup } from '@/elements/toggle/Toggle'
import { cn } from '@/lib/utils'
import { rowActionsGroupClass, rowActionsSlotClass, rowActionsTriggerClass } from './table-rowactions.css'

const emptyRowActionValue: string[] = []

const defaultRowActionLabels: Partial<Record<string, string>> = {
  'add-child': 'Add child',
  'add-sibling': 'Add sibling',
  'move-up': 'Move up',
  'move-down': 'Move down',
  duplicate: 'Duplicate row',
  indent: 'Indent',
  outdent: 'Outdent',
  remove: 'Delete',
}

const defaultRowActionIcons: Partial<Record<string, string>> = {
  'add-child': 'folder-plus',
  'add-sibling': 'plus',
  'move-up': 'chevron-up',
  'move-down': 'chevron-down',
  duplicate: 'copy-check',
  indent: 'indent-increase',
  outdent: 'indent-decrease',
  remove: 'trash-2',
}

export type TableRowActionConfig<TValue extends string = string> = {
  value: TValue
  icon?: string
  label?: string
  onAction: () => void
}

export type TableRowActionsProps<TValue extends string = string> = {
  actions: readonly TableRowActionConfig<TValue>[]
  ariaLabel?: string
  className?: string
  groupClassName?: string
  getLabel?: (value: TValue) => string
}

function getDefaultRowActionLabel(value: string) {
  const defaultLabel = defaultRowActionLabels[value]
  if (defaultLabel) return defaultLabel

  const text = value.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getDefaultRowActionIcon(value: string) {
  return defaultRowActionIcons[value] ?? 'ellipsis'
}

function TableRowActionItem<TValue extends string>({
  value,
  icon: iconProp,
  label: labelProp,
  onAction,
  getLabel,
}: TableRowActionConfig<TValue> & {
  getLabel?: (value: TValue) => string
}) {
  const label = labelProp ?? getLabel?.(value) ?? getDefaultRowActionLabel(value)
  const icon = iconProp ?? getDefaultRowActionIcon(value)
  return (
    <ToggleGroup.Item
      value={value}
      aria-label={label}
      title={label}
      onClick={event => {
        event.stopPropagation()
        onAction()
      }}
    >
      <Icon aria-hidden="true" icon={icon} size="xs" />
    </ToggleGroup.Item>
  )
}

export function TableRowActions<TValue extends string = string>({
  actions,
  ariaLabel = 'Row actions',
  className,
  groupClassName,
  getLabel,
}: TableRowActionsProps<TValue>) {
  const [open, setOpen] = React.useState(false)
  if (actions.length === 0) return null

  return (
    <span
      data-table-row-actions-slot
      role="group"
      aria-label={ariaLabel}
      className={cn(rowActionsSlotClass, className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onClick={event => {
        event.stopPropagation()
      }}
      onKeyDown={event => {
        event.stopPropagation()
      }}
    >
      <IconButton
        size="xs"
        variant="ghost"
        color="neutral"
        icon="ellipsis-vertical"
        title={ariaLabel}
        aria-label={ariaLabel}
        className={cn(rowActionsTriggerClass, open && 'opacity-100')}
        data-table-row-actions-trigger
      />
      <ToggleGroup.Root
        aria-label={ariaLabel}
        size="xs"
        variant="soft"
        color="neutral"
        multiple
        value={emptyRowActionValue}
        onValueChange={() => undefined}
        className={cn(rowActionsGroupClass, open && 'pointer-events-auto opacity-100', groupClassName)}
        data-table-row-actions-group
      >
        {actions.map(action => (
          <TableRowActionItem key={action.value} {...action} getLabel={getLabel} />
        ))}
      </ToggleGroup.Root>
    </span>
  )
}
