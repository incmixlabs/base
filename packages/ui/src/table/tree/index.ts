export type { TableTreeAggregateDefinition } from './tree-ops'
export {
  addHierarchicalChildRow,
  aggregateHierarchicalRows,
  duplicateHierarchicalRow,
  flattenHierarchicalRows,
  indentHierarchicalRow,
  insertHierarchicalSiblingRow,
  outdentHierarchicalRow,
  removeHierarchicalRow,
  updateHierarchicalRowValue,
} from './tree-ops'
export type {
  TableTreeOperationOptions,
  TableTreeRow,
  TableTreeRowLike,
  TableTreeRowValues,
  TableTreeValueCloner,
  TableTreeVisibleRow,
} from './types'
