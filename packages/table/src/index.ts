export interface ColumnDefinition<RowData = unknown> {
  id: string;
  header: string;
  accessor: (row: RowData) => unknown;
}

export interface TableDefinition<RowData = unknown> {
  id: string;
  columns: ColumnDefinition<RowData>[];
}

export function defineTable<RowData>(definition: TableDefinition<RowData>): TableDefinition<RowData> {
  return definition;
}
