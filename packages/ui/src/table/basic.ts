'use client'

export { Table, type TableComponentProps, type TableSize } from './basic/Table'
export { TablePagination, type TablePaginationProps } from './basic/TablePagination'
export { type TableRenderCell, TableWrapper } from './basic/TableWrapper'
export type {
  TableWrapperRowAction,
  TableWrapperRowActionLabels,
  TableWrapperRowActions,
} from './basic/table-wrapper.props'
export {
  StackedSummaryBar,
  type StackedSummaryBarProps,
  type StackedSummaryBarSegment,
} from './shared/StackedSummaryBar'
export {
  type DetailEntry,
  objectToDetailEntries,
  TableDetailDrawer,
  type TableDetailDrawerProps,
} from './shared/TableDetailDrawer'
export { TableEditableCellContent, type TableEditableCellContentProps } from './shared/TableEditableCellContent'
export { TableFooter, type TableFooterCell, type TableFooterProps } from './shared/TableFooter'
export { TableHeader, type TableHeaderAppliedFilter, type TableHeaderProps } from './shared/TableHeader'
export { TableLabel, type TableLabelProps } from './shared/TableLabel'
export { type TableRowActionConfig, TableRowActions, type TableRowActionsProps } from './shared/TableRowActions'
export { TableShell, type TableShellProps } from './shared/TableShell'
export type {
  TableCellModeState,
  TableCellModeToggleProps,
  TableCellModeToolbarActionsProps,
  UseTableCellModeOptions,
} from './shared/table-cell-mode'
export {
  EDIT_TABLE_CELL_MODE,
  isTableCellMode,
  normalizeAllowedTableCellModes,
  READ_TABLE_CELL_MODE,
  resolveTableCellMode,
  TABLE_CELL_MODE_LABELS,
  TableCellModeToggle,
  TableCellModeToolbarActions,
  useTableCellMode,
} from './shared/table-cell-mode'
export { TableColumnHeaderContent, TableSortableHeaderContent } from './shared/table-column'
export type { SharedTableColumnJustify, SharedTableColumnMeta } from './shared/table-column.shared'
export {
  compareSharedTableCellValues,
  getSharedTableCellDisplayText,
  getSharedTableColumnJustify,
} from './shared/table-column.shared'
export type {
  FlatTableColumnDef,
  TableCellFormat,
  TableColumnAlign,
  TableColumnDef,
  TableColumnEditContext,
  TableColumnRuntimeMeta,
  TableColumnVerticalAlign,
  TanStackTableColumnDef,
} from './shared/table-column-def'
export {
  getTableColumnEditability,
  getTableColumnRuntimeMeta,
  mapTableColumnAlignToJustify,
  toFlatTableColumnDef,
  toFlatTableColumnDefs,
  toTanStackTableColumnDef,
  toTanStackTableColumnDefs,
} from './shared/table-column-def'
export type {
  TableCellMode,
  TableCellModeChangeHandler,
  TableCellModeProps,
  TableEditableCellNavigation,
  TableEditableCellNavigationOptions,
  TableEditableCellProps,
} from './shared/table-editable-cell.props'
export type {
  TableCellEditability,
  TableCellEditContext,
  TableCellEditor,
  TableCellEditorOption,
  TableCellEditValidator,
  TableEditableColumnMeta,
} from './shared/table-editing'
export {
  getDefaultTableCellEditor,
  isTableCellEditable,
  resolveTableCellEditor,
  validateTableCellEdit,
} from './shared/table-editing'
export type { ResolveTableEngineOptions, TableEngine } from './shared/table-engine'
export { BASIC_TABLE_ENGINE, resolveTableEngine, VIRTUAL_TABLE_ENGINE } from './shared/table-engine'
export type {
  GroupTableRowsOptions,
  TableGroupPathEntry,
  TableGroupRowFactoryContext,
  TableGroupRowMetadata,
  TableRowSubRowsClearer,
  TableRowSubRowsGetter,
  TableShape,
} from './shared/table-grouping'
export {
  flattenTableRows,
  getTableGroupRowId,
  getTableGroupValueKey,
  getTableGroupValueLabel,
  groupTableRows,
  hasNestedTableRows,
} from './shared/table-grouping'
export { type TableSizeToken, tableSizeTokens } from './table.tokens'
