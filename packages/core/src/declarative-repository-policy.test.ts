import { describe, expect, it } from 'vitest'
import {
  parseDeclarativeRepositoryPersistenceMode,
  resolveDeclarativeRepositoryPersistenceMode,
} from './declarative-repository-policy'

describe('declarative repository persistence policy', () => {
  it('defaults to local-first', () => {
    expect(resolveDeclarativeRepositoryPersistenceMode()).toBe('local-first')
  })

  it('prefers explicit policy over environment fallback', () => {
    expect(resolveDeclarativeRepositoryPersistenceMode({ mode: 'memory-local' }, 'remote-only')).toBe('memory-local')
  })

  it('accepts supported environment persistence modes', () => {
    expect(parseDeclarativeRepositoryPersistenceMode('local-first')).toBe('local-first')
    expect(parseDeclarativeRepositoryPersistenceMode('memory-local')).toBe('memory-local')
    expect(parseDeclarativeRepositoryPersistenceMode('remote-only')).toBe('remote-only')
    expect(resolveDeclarativeRepositoryPersistenceMode(undefined, 'remote-only')).toBe('remote-only')
  })

  it('ignores unknown environment persistence modes', () => {
    expect(parseDeclarativeRepositoryPersistenceMode('local')).toBeUndefined()
    expect(resolveDeclarativeRepositoryPersistenceMode(undefined, 'local')).toBe('local-first')
  })
})
