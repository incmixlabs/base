export type TableEngine = 'basic' | 'virtual'

export const BASIC_TABLE_ENGINE: TableEngine = 'basic'
export const VIRTUAL_TABLE_ENGINE: TableEngine = 'virtual'

export type ResolveTableEngineOptions = {
  engine?: TableEngine
  defaultEngine?: TableEngine
}

export function resolveTableEngine({
  engine,
  defaultEngine = BASIC_TABLE_ENGINE,
}: ResolveTableEngineOptions): TableEngine {
  return engine ?? defaultEngine
}
