import { describe, expect, it } from 'vitest'
import { DeclarativeRepositoryError } from './declarative-repository'
import { createRemoteDeclarativeRepository } from './declarative-remote-repository'
import type { DeclarativeSyncAdapter, DeclarativeSyncChangeEnvelope } from './declarative-sync-boundary'

const pageRecord = {
  documentKind: 'page' as const,
  id: 'stale.page',
  revision: 'rev_remote_1',
  title: 'Stale Page',
  updatedAt: '2026-04-11T12:00:00.000Z',
  document: {
    kind: 'page' as const,
    id: 'stale.page',
    title: 'Stale Page',
    root: {
      type: 'layout' as const,
      props: {},
      children: [],
    },
  },
}

describe('createRemoteDeclarativeRepository', () => {
  it('rejects non-positive pull limits', () => {
    const syncAdapter: DeclarativeSyncAdapter = {
      async pullChanges() {
        return {
          changes: [],
          nextCursor: 'cursor:sync:0',
          hasMore: false,
        }
      },
      async pushChanges() {
        return {
          applied: [],
          conflicts: [],
        }
      },
    }

    const assertInvalidPullLimit = (pullLimit: number) => {
      expect(() => createRemoteDeclarativeRepository({ syncAdapter, pullLimit })).toThrow(DeclarativeRepositoryError)
      try {
        createRemoteDeclarativeRepository({ syncAdapter, pullLimit })
      } catch (error) {
        expect(error).toMatchObject({ code: 'invalid-request' })
      }
    }

    assertInvalidPullLimit(0)
    assertInvalidPullLimit(-1)
    assertInvalidPullLimit(1.5)
  })

  it('rejects invalid list limits', async () => {
    const syncAdapter: DeclarativeSyncAdapter = {
      async pullChanges() {
        return {
          changes: [],
          nextCursor: 'cursor:sync:0',
          hasMore: false,
        }
      },
      async pushChanges() {
        return {
          applied: [],
          conflicts: [],
        }
      },
    }
    const repository = createRemoteDeclarativeRepository({ syncAdapter })

    try {
      await expect(
        repository.query({
          type: 'list-documents',
          documentKind: 'page',
          limit: -1,
        }),
      ).rejects.toMatchObject({
        code: 'invalid-request',
      })
      await expect(
        repository.query({
          type: 'list-documents',
          documentKind: 'page',
          limit: 1.5,
        }),
      ).rejects.toMatchObject({
        code: 'invalid-request',
      })
    } finally {
      await repository.destroy()
    }
  })

  it('rejects non-advancing pull pagination', async () => {
    let calls = 0
    const syncAdapter: DeclarativeSyncAdapter = {
      async pullChanges() {
        calls += 1
        return {
          changes: [],
          nextCursor: 'cursor:sync:0',
          hasMore: true,
        }
      },
      async pushChanges() {
        return {
          applied: [],
          conflicts: [],
        }
      },
    }
    const repository = createRemoteDeclarativeRepository({ syncAdapter })

    try {
      await expect(repository.refresh({ documentKind: 'page' })).rejects.toMatchObject({
        code: 'unknown',
        retryable: true,
      })
      expect(calls).toBe(2)
    } finally {
      await repository.destroy()
    }
  })

  it('fails a delete when the follow-up pull leaves the record cached', async () => {
    let initialPullPending = true
    const syncAdapter: DeclarativeSyncAdapter = {
      async pullChanges(request) {
        const changes: DeclarativeSyncChangeEnvelope[] =
          request.documentKind === 'page' && initialPullPending
            ? [
                {
                  operation: 'upsert',
                  record: pageRecord,
                  source: 'worker',
                },
              ]
            : []
        initialPullPending = false
        return {
          changes,
          nextCursor: 'cursor:sync:1',
          hasMore: false,
        }
      },
      async pushChanges() {
        return {
          applied: [
            {
              documentKind: 'page',
              id: pageRecord.id,
              revision: pageRecord.revision,
            },
          ],
          conflicts: [],
        }
      },
    }
    const repository = createRemoteDeclarativeRepository({ syncAdapter })

    try {
      await expect(
        repository.query({
          type: 'get-document',
          documentKind: 'page',
          id: pageRecord.id,
        }),
      ).resolves.toMatchObject({
        found: true,
      })

      await expect(
        repository.mutate({
          type: 'delete-document',
          documentKind: 'page',
          id: pageRecord.id,
          expectedRevision: pageRecord.revision,
        }),
      ).rejects.toMatchObject({
        code: 'unknown',
        retryable: true,
      })
    } finally {
      await repository.destroy()
    }
  })
})
