'use client'

import * as React from 'react'
import { ToggleGroup } from '@/elements/toggle/Toggle'
import type { TableCellMode, TableCellModeChangeHandler } from './table-editable-cell.props'

export const READ_TABLE_CELL_MODE: TableCellMode = 'read'
export const EDIT_TABLE_CELL_MODE: TableCellMode = 'edit'

export const TABLE_CELL_MODE_LABELS: Record<TableCellMode, string> = {
  read: 'Read',
  edit: 'Edit',
}

export type UseTableCellModeOptions = {
  editable: boolean
  defaultCellMode?: TableCellMode
  cellMode?: TableCellMode
  onCellModeChange?: TableCellModeChangeHandler
  allowedCellModes?: readonly TableCellMode[]
}

export type TableCellModeState = {
  cellMode: TableCellMode
  allowedCellModes: readonly TableCellMode[]
  showCellModeToggle: boolean
  setCellMode: TableCellModeChangeHandler
}

export type TableCellModeToggleProps = {
  cellMode: TableCellMode
  allowedCellModes: readonly TableCellMode[]
  onCellModeChange: TableCellModeChangeHandler
  className?: string
}

export type TableCellModeToolbarActionsProps = {
  toggle?: React.ReactNode
  children?: React.ReactNode
}

export function isTableCellMode(value: unknown): value is TableCellMode {
  return value === READ_TABLE_CELL_MODE || value === EDIT_TABLE_CELL_MODE
}

export function normalizeAllowedTableCellModes(
  modes: readonly TableCellMode[] | undefined,
  fallback: TableCellMode = READ_TABLE_CELL_MODE,
) {
  const normalized = Array.from(new Set(modes ?? [fallback])).filter(isTableCellMode)
  return normalized.length > 0 ? normalized : [fallback]
}

export function resolveTableCellMode({
  editable,
  requestedMode,
  allowedModes,
}: {
  editable: boolean
  requestedMode: TableCellMode
  allowedModes: readonly TableCellMode[]
}): TableCellMode {
  if (!editable) return READ_TABLE_CELL_MODE
  if (allowedModes.includes(requestedMode)) return requestedMode
  return allowedModes[0] ?? READ_TABLE_CELL_MODE
}

export function useTableCellMode({
  editable,
  defaultCellMode = READ_TABLE_CELL_MODE,
  cellMode,
  onCellModeChange,
  allowedCellModes,
}: UseTableCellModeOptions): TableCellModeState {
  const [uncontrolledCellMode, setUncontrolledCellMode] = React.useState<TableCellMode>(defaultCellMode)
  const normalizedAllowedCellModes = React.useMemo(
    () => normalizeAllowedTableCellModes(allowedCellModes, defaultCellMode),
    [allowedCellModes, defaultCellMode],
  )
  const resolvedCellMode = resolveTableCellMode({
    editable,
    requestedMode: cellMode ?? uncontrolledCellMode,
    allowedModes: normalizedAllowedCellModes,
  })
  const setCellMode = React.useCallback(
    (nextMode: TableCellMode) => {
      if (!normalizedAllowedCellModes.includes(nextMode)) return
      if (cellMode === undefined) setUncontrolledCellMode(nextMode)
      onCellModeChange?.(nextMode)
    },
    [cellMode, normalizedAllowedCellModes, onCellModeChange],
  )

  return {
    cellMode: resolvedCellMode,
    allowedCellModes: normalizedAllowedCellModes,
    showCellModeToggle: editable && normalizedAllowedCellModes.length > 1,
    setCellMode,
  }
}

export function TableCellModeToggle({
  cellMode,
  allowedCellModes,
  onCellModeChange,
  className,
}: TableCellModeToggleProps) {
  return (
    <ToggleGroup.Root
      aria-label="Cell mode"
      value={[cellMode]}
      onValueChange={values => {
        const nextMode = values.at(-1)
        if (isTableCellMode(nextMode)) onCellModeChange(nextMode)
      }}
      multiple={false}
      size="xs"
      variant="soft"
      color="slate"
      className={className}
    >
      {allowedCellModes.map(mode => (
        <ToggleGroup.Item key={mode} value={mode} aria-label={`${TABLE_CELL_MODE_LABELS[mode]} mode`}>
          {TABLE_CELL_MODE_LABELS[mode]}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}

export function TableCellModeToolbarActions({ toggle, children }: TableCellModeToolbarActionsProps) {
  if (!toggle && !children) return null

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      {toggle}
      {children}
    </span>
  )
}
