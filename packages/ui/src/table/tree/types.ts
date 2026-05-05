export type TableTreeRowValues = Record<string, unknown>

export type TableTreeRowLike<TValues extends TableTreeRowValues, TRow> = {
  id: string
  values: TValues
  subRows?: TRow[]
}

export type TableTreeRowValueOf<TRow> = TRow extends TableTreeRowLike<infer TValues, unknown> ? TValues : never

export interface TableTreeRow<TValues extends TableTreeRowValues = TableTreeRowValues>
  extends TableTreeRowLike<TValues, TableTreeRow<TValues>> {}

export type TableTreeValueCloner = (value: unknown) => unknown

export type TableTreeOperationOptions = {
  cloneValue?: TableTreeValueCloner
}

export type TableTreeVisibleRow<
  TValues extends TableTreeRowValues = TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow> = TableTreeRow<TValues>,
> = {
  row: TRow
  depth: number
  parentId?: string
  hasChildren: boolean
}
