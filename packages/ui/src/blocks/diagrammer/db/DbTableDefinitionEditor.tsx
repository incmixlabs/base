'use client'

import * as React from 'react'
import { Accordion } from '@/elements/accordion/Accordion'
import { IconButton } from '@/elements/button/IconButton'
import { SearchInput } from '@/form/SearchInput'
import { Column, Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { TreeTable, type TreeTableColumnDef, type TreeTableRowActionLabels } from '@/table/tree-table'
import { Text } from '@/typography/text/Text'
import {
  dbTableDefinitionEditorAccordionClass,
  dbTableDefinitionEditorHeaderClass,
  dbTableDefinitionEditorRootClass,
  dbTableDefinitionEditorSectionClass,
  dbTableDefinitionEditorSectionHeaderClass,
  dbTableDefinitionEditorSectionTriggerClass,
  dbTableDefinitionEditorSectionTriggerWrapClass,
} from './DbTableDefinitionEditor.css'
import {
  addDbDomainDefinitionRow,
  addDbTableDefinitionChildRow,
  addDbTableDefinitionTable,
  addDbTypeDefinitionRow,
  createDbDomainDefinitionRows,
  createDbTableDefinitionRows,
  createDbTypeDefinitionRows,
  type DbTableDefinitionEditColumn,
  type DbTableDefinitionMoveDirection,
  type DbTableDefinitionRow,
  duplicateDbTableDefinitionRow,
  filterDbTableDefinitionRows,
  indentDbTableDefinitionRow,
  isDbDefinitionLengthEditable,
  isDbDefinitionNestedType,
  moveDbTableDefinitionRow,
  outdentDbTableDefinitionRow,
  removeDbTableDefinitionRow,
  scalarDbTypeOptions,
  updateDbTableDefinitionValue,
} from './table-definition-editor-model'
import type { DbDiagramDocument } from './types'

export interface DbTableDefinitionEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onChange'> {
  document: DbDiagramDocument
  readonly?: boolean
  onDocumentChange?: (document: DbDiagramDocument) => void
}

type DefinitionTableProps = {
  title: string
  rows: DbTableDefinitionRow[]
  columns: TreeTableColumnDef<DbTableDefinitionRow>[]
  addLabel: string
  readonly?: boolean
  onAdd: () => void
  onCellEdit?: (row: DbTableDefinitionRow, columnId: DbTableDefinitionEditColumn, value: unknown) => void
  onAddChild?: (row: DbTableDefinitionRow) => void
  onDuplicate?: (row: DbTableDefinitionRow) => void
  onIndent?: (row: DbTableDefinitionRow) => void
  onOutdent?: (row: DbTableDefinitionRow) => void
  onMoveUp?: (row: DbTableDefinitionRow) => void
  onMoveDown?: (row: DbTableDefinitionRow) => void
  onRemove?: (row: DbTableDefinitionRow) => void
  canIndent?: (row: DbTableDefinitionRow) => boolean
  canOutdent?: (row: DbTableDefinitionRow) => boolean
  canMoveUp?: (row: DbTableDefinitionRow) => boolean
  canMoveDown?: (row: DbTableDefinitionRow) => boolean
  rowActionLabels?: TreeTableRowActionLabels
  fillAvailable?: boolean
}

type DefinitionEditorOption = { value: string; label: string }

const DEFINITION_ROW_HEIGHT = 28
const DEFINITION_TABLE_MAX_BODY_HEIGHT = 196

function renderTextCell(value: unknown, muted = false) {
  const text = String(value ?? '')
  if (!text) {
    return (
      <Text size="xs" color="neutral">
        -
      </Text>
    )
  }
  return (
    <Text as="span" size="xs" truncate color={muted ? 'neutral' : undefined} title={text}>
      {text}
    </Text>
  )
}

function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

function flattenDefinitionRows(rows: readonly DbTableDefinitionRow[]) {
  const flattenedRows: DbTableDefinitionRow[] = []
  const visit = (items: readonly DbTableDefinitionRow[]) => {
    for (const item of items) {
      flattenedRows.push(item)
      if (item.subRows?.length) visit(item.subRows)
    }
  }
  visit(rows)
  return flattenedRows
}

function getDefinitionRowIds(rows: readonly DbTableDefinitionRow[]) {
  return new Set(flattenDefinitionRows(rows).map(row => row.id))
}

function findEditableCellForRow(container: HTMLElement | null, rowId: string) {
  if (!container) return null
  const editableCells = container.querySelectorAll<HTMLElement>('[id*="-tree-editable-"]')
  return Array.from(editableCells).find(cell => cell.id.includes(`-tree-editable-${rowId}-`)) ?? null
}

function createEditorOptions(values: readonly string[]): DefinitionEditorOption[] {
  const seen = new Set<string>()
  return values.flatMap(value => {
    const normalizedValue = value.trim()
    if (!normalizedValue || seen.has(normalizedValue)) return []
    seen.add(normalizedValue)
    return [{ value: normalizedValue, label: normalizedValue }]
  })
}

function createTypeDefinitionOptions(document: DbDiagramDocument) {
  return createEditorOptions([...scalarDbTypeOptions, ...(document.domains ?? []).map(domain => domain.name)])
}

function createColumnTypeOptions(document: DbDiagramDocument) {
  return createEditorOptions([
    ...scalarDbTypeOptions,
    ...(document.domains ?? []).map(domain => domain.name),
    ...(document.types ?? []).filter(type => !isDbDefinitionNestedType(type)).map(type => type.name),
    ...(document.enums ?? []).map(dbEnum => dbEnum.name),
  ])
}

function createRowTypeOptions(document: DbDiagramDocument, row: DbTableDefinitionRow) {
  if (row.kind !== 'type-field') return createColumnTypeOptions(document)

  const currentType = row.values.type.trim()
  return createEditorOptions([
    ...scalarDbTypeOptions,
    ...(document.domains ?? []).map(domain => domain.name),
    ...(document.types ?? [])
      .filter(type => type.id !== row.typeId && (!isDbDefinitionNestedType(type) || type.name === currentType))
      .map(type => type.name),
    ...(document.enums ?? []).map(dbEnum => dbEnum.name),
  ])
}

function isFieldRow(row: DbTableDefinitionRow) {
  return row.kind === 'type-field' || row.kind === 'table-column'
}

function canAddDefinitionChild(row: DbTableDefinitionRow) {
  return row.kind === 'type' || row.kind === 'table'
}

function canDuplicateDefinitionRow(row: DbTableDefinitionRow) {
  return (
    row.kind === 'domain' ||
    row.kind === 'type' ||
    row.kind === 'type-field' ||
    row.kind === 'table' ||
    row.kind === 'table-column'
  )
}

function canRemoveDefinitionRow(row: DbTableDefinitionRow) {
  return canDuplicateDefinitionRow(row)
}

function canIndentTypeDefinitionRow(document: DbDiagramDocument, row: DbTableDefinitionRow) {
  if (row.kind === 'type' && row.typeId) {
    const typeIndex = document.types?.findIndex(type => type.id === row.typeId) ?? -1
    return typeIndex > 0
  }

  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    const type = document.types?.find(existingType => existingType.id === row.typeId)
    const fieldIndex = type?.fields?.findIndex(field => field.id === row.fieldId) ?? -1
    return fieldIndex > 0
  }

  return false
}

function canOutdentTypeDefinitionRow(row: DbTableDefinitionRow) {
  return row.kind === 'type-field'
}

function canMoveInCollection<T extends { id: string }>(
  items: T[] | undefined,
  id: string | undefined,
  direction: DbTableDefinitionMoveDirection,
) {
  if (!items || !id) return false
  const index = items.findIndex(item => item.id === id)
  if (index < 0) return false
  return direction === 'up' ? index > 0 : index < items.length - 1
}

function canMoveDefinitionRow(
  document: DbDiagramDocument,
  row: DbTableDefinitionRow,
  direction: DbTableDefinitionMoveDirection,
) {
  if (row.kind === 'domain') return canMoveInCollection(document.domains, row.domainId, direction)
  if (row.kind === 'type') return canMoveInCollection(document.types, row.typeId, direction)
  if (row.kind === 'type-field') {
    const type = document.types?.find(existingType => existingType.id === row.typeId)
    return canMoveInCollection(type?.fields, row.fieldId, direction)
  }
  if (row.kind === 'table') return canMoveInCollection(document.tables, row.tableId, direction)
  if (row.kind === 'table-column') {
    const table = document.tables.find(existingTable => existingTable.id === row.tableId)
    return canMoveInCollection(table?.columns, row.columnId, direction)
  }
  return false
}

const tableKindOptions = [
  { value: 'dim', label: 'dim' },
  { value: 'stream', label: 'stream' },
  { value: 'txn', label: 'txn' },
  { value: 'lov', label: 'lov' },
]

function getDomainColumns(readonly: boolean): TreeTableColumnDef<DbTableDefinitionRow>[] {
  return [
    {
      id: 'name',
      accessorFn: row => row.values.name,
      header: 'Domain name',
      size: 220,
      minSize: 140,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
    {
      id: 'type',
      accessorFn: row => row.values.type,
      header: 'Value',
      size: 160,
      minSize: 110,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
    {
      id: 'defaultValue',
      accessorFn: row => row.values.defaultValue,
      header: 'Default value',
      size: 180,
      minSize: 120,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
    {
      id: 'length',
      accessorFn: row => row.values.length,
      header: 'Length',
      size: 96,
      minSize: 80,
      enableResizing: true,
      meta: {
        editable: context => !readonly && isDbDefinitionLengthEditable(context.row.values.type),
        editor: { type: 'text' },
      },
      cell: ({ row, getValue }) =>
        isDbDefinitionLengthEditable(row.original.values.type) ? renderTextCell(getValue()) : renderTextCell(''),
    },
    {
      id: 'nullable',
      accessorFn: row => row.values.nullable,
      header: 'Nullable',
      size: 96,
      minSize: 80,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'checkbox' },
      },
      cell: ({ getValue }) => {
        const value = getValue<boolean | null>()
        return (
          <Text as="span" size="xs">
            {value == null ? '-' : value ? 'true' : 'false'}
          </Text>
        )
      },
    },
    {
      id: 'check',
      accessorFn: row => row.values.check,
      header: 'Check',
      size: 260,
      minSize: 160,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
  ]
}

function getStructuredColumns({
  readonly,
  getTypeOptions,
  scalarTypeOptions,
  includeTableKinds = false,
  includeTypeValues = false,
}: {
  readonly: boolean
  getTypeOptions: (row: DbTableDefinitionRow) => DefinitionEditorOption[]
  scalarTypeOptions: DefinitionEditorOption[]
  includeTableKinds?: boolean
  includeTypeValues?: boolean
}): TreeTableColumnDef<DbTableDefinitionRow>[] {
  const columns: TreeTableColumnDef<DbTableDefinitionRow>[] = [
    {
      id: 'name',
      accessorFn: row => row.values.name,
      header: 'Name',
      size: 280,
      minSize: 160,
      enableResizing: true,
      meta: {
        editable: !readonly,
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
    {
      id: 'type',
      accessorFn: row => row.values.type,
      header: 'Type',
      size: 160,
      minSize: 110,
      enableResizing: true,
      meta: {
        editable: context =>
          !readonly &&
          (context.row.kind === 'type' ||
            isFieldRow(context.row) ||
            (includeTableKinds && context.row.kind === 'table')),
        editor: context =>
          context.row.kind === 'type'
            ? { type: 'select', options: scalarTypeOptions }
            : {
                type: 'select',
                options:
                  includeTableKinds && context.row.kind === 'table' ? tableKindOptions : getTypeOptions(context.row),
              },
      },
      cell: ({ row, getValue }) => renderTextCell(getValue(), row.original.kind === 'type'),
    },
    {
      id: 'length',
      accessorFn: row => row.values.length,
      header: 'Length',
      size: 96,
      minSize: 80,
      enableResizing: true,
      meta: {
        editable: context =>
          !readonly &&
          (context.row.kind === 'type' || isFieldRow(context.row)) &&
          isDbDefinitionLengthEditable(context.row.values.type),
        editor: { type: 'text' },
      },
      cell: ({ row, getValue }) =>
        (row.original.kind === 'type' || isFieldRow(row.original)) &&
        isDbDefinitionLengthEditable(row.original.values.type)
          ? renderTextCell(getValue())
          : renderTextCell(''),
    },
    ...(includeTypeValues
      ? [
          {
            id: 'options',
            accessorFn: row => row.values.options,
            header: 'Values',
            size: 200,
            minSize: 140,
            enableResizing: true,
            meta: {
              editable: context =>
                !readonly && context.row.kind === 'type' && context.row.values.type.trim().toLowerCase() === 'enum',
              editor: { type: 'text' },
            },
            cell: ({ row, getValue }) =>
              row.original.kind === 'type' && row.original.values.type.trim().toLowerCase() === 'enum'
                ? renderTextCell(getValue())
                : renderTextCell(''),
          } satisfies TreeTableColumnDef<DbTableDefinitionRow>,
        ]
      : []),
    {
      id: 'defaultValue',
      accessorFn: row => row.values.defaultValue,
      header: 'Default value',
      size: 180,
      minSize: 120,
      enableResizing: true,
      meta: {
        editable: context => !readonly && (context.row.kind === 'type' || isFieldRow(context.row)),
        editor: { type: 'text' },
      },
      cell: ({ getValue }) => renderTextCell(getValue()),
    },
    {
      id: 'nullable',
      accessorFn: row => row.values.nullable,
      header: 'Nullable',
      size: 96,
      minSize: 80,
      enableResizing: true,
      meta: {
        editable: context => !readonly && isFieldRow(context.row),
        editor: { type: 'checkbox' },
      },
      cell: ({ row, getValue }) => {
        if (!isFieldRow(row.original)) return renderTextCell('')
        const value = getValue<boolean | null>()
        return (
          <Text as="span" size="xs">
            {value == null ? '-' : value ? 'true' : 'false'}
          </Text>
        )
      },
    },
  ]

  return columns
}

function DefinitionTable({
  title,
  rows,
  columns,
  addLabel,
  readonly = false,
  onAdd,
  onCellEdit,
  onAddChild,
  onDuplicate,
  onIndent,
  onOutdent,
  onMoveUp,
  onMoveDown,
  onRemove,
  canIndent,
  canOutdent,
  canMoveUp,
  canMoveDown,
  rowActionLabels,
  fillAvailable = false,
}: DefinitionTableProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const pendingAddFocusRowIdsRef = React.useRef<Set<string> | null>(null)

  React.useLayoutEffect(() => {
    const previousRowIds = pendingAddFocusRowIdsRef.current
    if (!previousRowIds) return

    const addedRow = flattenDefinitionRows(rows).find(row => !previousRowIds.has(row.id))
    pendingAddFocusRowIdsRef.current = null
    if (!addedRow) return

    let cancelled = false
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return
        const target = findEditableCellForRow(sectionRef.current, addedRow.id)
        target?.focus()
        target?.click()
      })
    })

    return () => {
      cancelled = true
    }
  }, [rows])

  const handleAdd = React.useCallback(() => {
    pendingAddFocusRowIdsRef.current = getDefinitionRowIds(rows)
    onAdd()
  }, [onAdd, rows])

  return (
    <Accordion.Item
      value={title.toLowerCase()}
      className={fillAvailable ? 'flex h-full min-h-0 flex-col overflow-hidden' : undefined}
    >
      <div className={dbTableDefinitionEditorSectionHeaderClass}>
        <div className={dbTableDefinitionEditorSectionTriggerWrapClass}>
          <Accordion.Trigger className={dbTableDefinitionEditorSectionTriggerClass}>
            <Row align="center" justify="between" gap="2" className="min-w-0">
              <Text size="xs" weight="medium" truncate>
                {title}
              </Text>
              <Text size="xs" color="neutral">
                {rows.length}
              </Text>
            </Row>
          </Accordion.Trigger>
        </div>
        {readonly ? null : (
          <IconButton
            size="xs"
            variant="ghost"
            color="neutral"
            radius="full"
            icon="plus"
            title={addLabel}
            aria-label={addLabel}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              handleAdd()
            }}
          />
        )}
      </div>
      <Accordion.Content fill={fillAvailable}>
        <Column
          ref={sectionRef}
          className={cn(
            dbTableDefinitionEditorSectionClass,
            fillAvailable ? 'h-full min-h-0 flex-1' : 'max-h-[260px] shrink-0',
          )}
        >
          <TreeTable.Root<DbTableDefinitionRow>
            columns={columns}
            data={rows}
            getRowId={row => row.id}
            getSubRows={row => row.subRows}
            defaultExpanded
            size="xs"
            variant="ghost"
            color="neutral"
            onAddChild={!readonly && onAddChild ? onAddChild : undefined}
            canAddChild={canAddDefinitionChild}
            onDuplicate={!readonly && onDuplicate ? onDuplicate : undefined}
            canDuplicate={canDuplicateDefinitionRow}
            onIndent={!readonly && onIndent ? onIndent : undefined}
            canIndent={canIndent}
            onOutdent={!readonly && onOutdent ? onOutdent : undefined}
            canOutdent={canOutdent}
            onMoveUp={!readonly && onMoveUp ? onMoveUp : undefined}
            canMoveUp={canMoveUp}
            onMoveDown={!readonly && onMoveDown ? onMoveDown : undefined}
            canMoveDown={canMoveDown}
            onRemove={!readonly && onRemove ? onRemove : undefined}
            canRemove={canRemoveDefinitionRow}
            rowActionLabels={rowActionLabels}
            onCellEdit={
              onCellEdit
                ? ({ row, columnId, value }) => {
                    onCellEdit(row, columnId as DbTableDefinitionEditColumn, value)
                  }
                : undefined
            }
          >
            <TreeTable.Content
              estimateRowHeight={DEFINITION_ROW_HEIGHT}
              minBodyHeight={DEFINITION_ROW_HEIGHT}
              maxBodyHeight={fillAvailable ? undefined : DEFINITION_TABLE_MAX_BODY_HEIGHT}
            />
          </TreeTable.Root>
        </Column>
      </Accordion.Content>
    </Accordion.Item>
  )
}

export function DbTableDefinitionEditor(props: DbTableDefinitionEditorProps) {
  const { document, readonly, className, onDocumentChange, ...rootProps } = props
  const effectiveReadonly = readonly ?? !onDocumentChange
  const isEditable = !effectiveReadonly

  const [query, setQuery] = React.useState('')
  const typeDefinitionOptions = React.useMemo(() => createTypeDefinitionOptions(document), [document])
  const getTypeOptions = React.useCallback(
    (row: DbTableDefinitionRow) => createRowTypeOptions(document, row),
    [document],
  )

  const applyDocument = React.useCallback(
    (nextDocument: DbDiagramDocument) => {
      onDocumentChange?.(nextDocument)
    },
    [onDocumentChange],
  )

  const handleCellEdit = React.useCallback(
    (row: DbTableDefinitionRow, columnId: DbTableDefinitionEditColumn, value: unknown) => {
      applyDocument(updateDbTableDefinitionValue(document, row, columnId, value))
    },
    [applyDocument, document],
  )

  const handleAddChild = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(addDbTableDefinitionChildRow(document, row))
    },
    [applyDocument, document],
  )

  const handleDuplicate = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(duplicateDbTableDefinitionRow(document, row))
    },
    [applyDocument, document],
  )

  const handleIndent = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(indentDbTableDefinitionRow(document, row))
    },
    [applyDocument, document],
  )

  const handleOutdent = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(outdentDbTableDefinitionRow(document, row))
    },
    [applyDocument, document],
  )

  const handleMoveUp = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(moveDbTableDefinitionRow(document, row, 'up'))
    },
    [applyDocument, document],
  )

  const handleMoveDown = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(moveDbTableDefinitionRow(document, row, 'down'))
    },
    [applyDocument, document],
  )

  const handleRemove = React.useCallback(
    (row: DbTableDefinitionRow) => {
      applyDocument(removeDbTableDefinitionRow(document, row))
    },
    [applyDocument, document],
  )

  const domainColumns = React.useMemo(() => getDomainColumns(!isEditable), [isEditable])
  const typeColumns = React.useMemo(
    () =>
      getStructuredColumns({
        readonly: !isEditable,
        getTypeOptions,
        scalarTypeOptions: typeDefinitionOptions,
        includeTypeValues: true,
      }),
    [getTypeOptions, isEditable, typeDefinitionOptions],
  )
  const tableColumns = React.useMemo(
    () =>
      getStructuredColumns({
        readonly: !isEditable,
        getTypeOptions,
        scalarTypeOptions: typeDefinitionOptions,
        includeTableKinds: true,
      }),
    [getTypeOptions, isEditable, typeDefinitionOptions],
  )

  const domainRows = React.useMemo(
    () => filterDbTableDefinitionRows(createDbDomainDefinitionRows(document), query),
    [document, query],
  )
  const typeRows = React.useMemo(
    () => filterDbTableDefinitionRows(createDbTypeDefinitionRows(document), query),
    [document, query],
  )
  const tableRows = React.useMemo(
    () => filterDbTableDefinitionRows(createDbTableDefinitionRows(document), query),
    [document, query],
  )

  return (
    <Column
      className={cn(
        'h-full min-h-0 overflow-hidden rounded-[var(--radius-lg)]',
        dbTableDefinitionEditorRootClass,
        className,
      )}
      {...rootProps}
    >
      <Column gap="2" p="2" className={cn('shrink-0', dbTableDefinitionEditorHeaderClass)}>
        <Row align="center" justify="between" gap="2">
          <Column gap="0" className="min-w-0">
            <Text size="sm" weight="bold" truncate>
              Schema definitions
            </Text>
            <Text size="xs" color="neutral" truncate>
              {formatCount((document.domains ?? []).length, 'domain')},{' '}
              {formatCount((document.types ?? []).length, 'type')}, {formatCount(document.tables.length, 'table')}
            </Text>
          </Column>
        </Row>
        <SearchInput
          size="xs"
          radius="sm"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search definitions"
        />
      </Column>

      <Accordion.Root
        multiple
        defaultValue={['domains', 'types', 'tables']}
        size="xs"
        border={false}
        contentPadding={false}
        className={cn(
          'grid min-h-0 flex-1 grid-rows-[auto_auto_minmax(0,1fr)] overflow-y-auto',
          dbTableDefinitionEditorAccordionClass,
        )}
      >
        <DefinitionTable
          title="Domains"
          rows={domainRows}
          columns={domainColumns}
          addLabel="Add domain"
          readonly={effectiveReadonly}
          onAdd={() => applyDocument(addDbDomainDefinitionRow(document))}
          onCellEdit={isEditable ? handleCellEdit : undefined}
          onDuplicate={isEditable ? handleDuplicate : undefined}
          onMoveUp={isEditable ? handleMoveUp : undefined}
          canMoveUp={row => canMoveDefinitionRow(document, row, 'up')}
          onMoveDown={isEditable ? handleMoveDown : undefined}
          canMoveDown={row => canMoveDefinitionRow(document, row, 'down')}
          onRemove={isEditable ? handleRemove : undefined}
        />
        <DefinitionTable
          title="Types"
          rows={typeRows}
          columns={typeColumns}
          addLabel="Add type"
          readonly={effectiveReadonly}
          onAdd={() => applyDocument(addDbTypeDefinitionRow(document))}
          onCellEdit={isEditable ? handleCellEdit : undefined}
          onAddChild={isEditable ? handleAddChild : undefined}
          rowActionLabels={{ 'add-child': 'Add field' }}
          onIndent={isEditable ? handleIndent : undefined}
          canIndent={row => canIndentTypeDefinitionRow(document, row)}
          onOutdent={isEditable ? handleOutdent : undefined}
          canOutdent={canOutdentTypeDefinitionRow}
          onDuplicate={isEditable ? handleDuplicate : undefined}
          onMoveUp={isEditable ? handleMoveUp : undefined}
          canMoveUp={row => canMoveDefinitionRow(document, row, 'up')}
          onMoveDown={isEditable ? handleMoveDown : undefined}
          canMoveDown={row => canMoveDefinitionRow(document, row, 'down')}
          onRemove={isEditable ? handleRemove : undefined}
        />
        <DefinitionTable
          title="Tables"
          rows={tableRows}
          columns={tableColumns}
          addLabel="Add table"
          fillAvailable
          readonly={effectiveReadonly}
          onAdd={() => applyDocument(addDbTableDefinitionTable(document))}
          onCellEdit={isEditable ? handleCellEdit : undefined}
          onAddChild={isEditable ? handleAddChild : undefined}
          rowActionLabels={{ 'add-child': 'Add column' }}
          onDuplicate={isEditable ? handleDuplicate : undefined}
          onMoveUp={isEditable ? handleMoveUp : undefined}
          canMoveUp={row => canMoveDefinitionRow(document, row, 'up')}
          onMoveDown={isEditable ? handleMoveDown : undefined}
          canMoveDown={row => canMoveDefinitionRow(document, row, 'down')}
          onRemove={isEditable ? handleRemove : undefined}
        />
      </Accordion.Root>
    </Column>
  )
}
