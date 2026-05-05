import { describe, expect, it } from 'vitest'
import { declarativeUiGrammarPressureApp, declarativeUiTabbedSupportPage } from './declarative-ui.examples'
import {
  createFixtureDeclarativeSyncAdapter,
  DeclarativeSyncAdapterError,
  type DeclarativeSyncAppRecord,
  type DeclarativeSyncPageRecord,
} from './index'

function createPageRecord(id: string, revision: string): DeclarativeSyncPageRecord {
  return {
    documentKind: 'page',
    id,
    revision,
    title: declarativeUiTabbedSupportPage.title,
    updatedAt: '2026-04-11T09:00:00.000Z',
    document: {
      ...structuredClone(declarativeUiTabbedSupportPage),
      id,
      title: declarativeUiTabbedSupportPage.title,
    },
  }
}

function createAppRecord(id: string, revision: string): DeclarativeSyncAppRecord {
  return {
    documentKind: 'app',
    id,
    revision,
    title: declarativeUiGrammarPressureApp.title,
    updatedAt: '2026-04-11T09:00:00.000Z',
    document: {
      ...structuredClone(declarativeUiGrammarPressureApp),
      id,
      title: declarativeUiGrammarPressureApp.title,
    },
  }
}

describe('declarative sync adapter', () => {
  it('keeps the terminal cursor stable when no additional remote changes exist', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter({
      bootstrapChanges: [
        {
          operation: 'upsert',
          record: createPageRecord('support.dashboard', 'rev_remote_1'),
        },
      ],
    })

    const firstPull = await adapter.pullChanges({
      documentKind: 'page',
    })
    const secondPull = await adapter.pullChanges({
      documentKind: 'page',
      sinceCursor: firstPull.nextCursor,
    })

    expect(firstPull.changes).toHaveLength(1)
    expect(firstPull.hasMore).toBe(false)
    expect(secondPull.changes).toEqual([])
    expect(secondPull.hasMore).toBe(false)
    expect(secondPull.nextCursor).toBe(firstPull.nextCursor)
  })

  it('rejects invalid cursors with a typed sync adapter error', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter()

    await expect(
      adapter.pullChanges({
        documentKind: 'page',
        sinceCursor: 'cursor:oops',
      }),
    ).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'invalid-cursor',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('rejects invalid pull limits with a typed sync adapter error', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter()

    await expect(
      adapter.pullChanges({
        documentKind: 'page',
        limit: -1,
      }),
    ).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'invalid-request',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('does not replay an accepted push when the next pull resumes from the accepted cursor', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter()
    const pushResult = await adapter.pushChanges({
      changes: [
        {
          operation: 'upsert',
          record: createPageRecord('support.dashboard', 'rev_local_1'),
          source: 'same-tab',
        },
      ],
    })

    const pullResult = await adapter.pullChanges({
      documentKind: 'page',
      sinceCursor: pushResult.acceptedCursor,
    })

    expect(pushResult.applied).toHaveLength(1)
    expect(pushResult.acceptedCursor).toBeDefined()
    expect(pullResult.changes).toEqual([])
    expect(pullResult.hasMore).toBe(false)
  })

  it('supports app document sync changes without affecting page support', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter()
    const pushResult = await adapter.pushChanges({
      changes: [
        {
          operation: 'upsert',
          record: createAppRecord('support.app', 'rev_local_app_1'),
          source: 'same-tab',
        },
      ],
    })

    const pullResult = await adapter.pullChanges({
      documentKind: 'app',
    })

    expect(pushResult.applied).toEqual([
      expect.objectContaining({
        documentKind: 'app',
        id: 'support.app',
      }),
    ])
    expect(pullResult.changes).toEqual([
      expect.objectContaining({
        operation: 'upsert',
        record: expect.objectContaining({
          documentKind: 'app',
          id: 'support.app',
        }),
      }),
    ])
  })

  it('reports deleted-remotely when deleting from an already deleted remote page', async () => {
    const adapter = createFixtureDeclarativeSyncAdapter({
      bootstrapChanges: [
        {
          operation: 'upsert',
          record: createPageRecord('support.dashboard', 'rev_remote_1'),
        },
      ],
    })

    const initialPull = await adapter.pullChanges({
      documentKind: 'page',
    })
    const initialRecord = initialPull.changes[0]
    if (initialRecord?.operation !== 'upsert') {
      throw new Error('expected bootstrap upsert record')
    }

    await adapter.pushChanges({
      changes: [
        {
          operation: 'delete',
          document: {
            documentKind: 'page',
            id: 'support.dashboard',
            revision: initialRecord.record.revision,
          },
          baseRevision: initialRecord.record.revision,
          source: 'same-tab',
        },
      ],
    })

    const secondDelete = await adapter.pushChanges({
      changes: [
        {
          operation: 'delete',
          document: {
            documentKind: 'page',
            id: 'support.dashboard',
            revision: initialRecord.record.revision,
          },
          baseRevision: initialRecord.record.revision,
          source: 'same-tab',
        },
      ],
    })

    expect(secondDelete.applied).toEqual([])
    expect(secondDelete.conflicts).toEqual([
      expect.objectContaining({
        reason: 'deleted-remotely',
        document: {
          documentKind: 'page',
          id: 'support.dashboard',
          revision: initialRecord.record.revision,
        },
      }),
    ])
  })
})
