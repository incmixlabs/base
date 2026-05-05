export type DeclarativeRepositoryPersistenceMode = 'local-first' | 'memory-local' | 'remote-only'

export type DeclarativeRepositoryPersistencePolicy = {
  mode?: DeclarativeRepositoryPersistenceMode
}

export type DeclarativeRepositoryStorageMode = 'opfs' | 'memory' | 'remote-only'

export function parseDeclarativeRepositoryPersistenceMode(
  value: unknown,
): DeclarativeRepositoryPersistenceMode | undefined {
  return value === 'local-first' || value === 'memory-local' || value === 'remote-only' ? value : undefined
}

export function resolveDeclarativeRepositoryPersistenceMode(
  policy?: DeclarativeRepositoryPersistencePolicy,
  fallbackMode?: unknown,
): DeclarativeRepositoryPersistenceMode {
  return policy?.mode ?? parseDeclarativeRepositoryPersistenceMode(fallbackMode) ?? 'local-first'
}
