import { describe, expect, it } from 'vitest'
import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  createTinyBaseDeclarativeRepository,
  type DeclarativeDocumentNotification,
  type DeclarativeDocumentNotificationChannel,
  normalizePageDocument,
  watchDeclarativeRepositoryDocument,
  watchDeclarativeRepositoryListDocuments,
} from './index'
import { declarativeUiReadonlyAuditPage, declarativeUiTabbedSupportPage } from './declarative-ui.examples'
import type { WatchableDeclarativeRepository } from './worker-repository-boundary'

function createRegistryEntry() {
  return {
    schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
    kind: COMPONENT_REGISTRY_ENTRY_KIND,
    id: 'ui.element.button',
    slug: 'button',
    title: 'Button',
    runtime: {
      kind: 'known-renderer' as const,
      rendererId: 'ui.element',
      componentName: 'Button',
    },
    discovery: {
      tags: ['button', 'action'],
      summary: 'Primary action control',
    },
    ownership: {
      scope: 'public' as const,
    },
    persistence: {
      source: 'registry' as const,
      mutable: true,
      scope: 'repository' as const,
    },
  }
}

function createFakePersister() {
  const calls = {
    load: 0,
    startAutoLoad: 0,
    startAutoSave: 0,
    destroy: 0,
  }

  return {
    calls,
    persister: {
      load: async () => {
        calls.load += 1
        return undefined as any
      },
      startAutoLoad: async () => {
        calls.startAutoLoad += 1
        return undefined as any
      },
      startAutoSave: async () => {
        calls.startAutoSave += 1
        return undefined as any
      },
      destroy: async () => {
        calls.destroy += 1
        return undefined as any
      },
    },
  }
}

function createNotificationChannel(events: DeclarativeDocumentNotification[]): DeclarativeDocumentNotificationChannel {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()

  return {
    publish(event) {
      events.push(event)
      for (const listener of listeners) {
        listener(event)
      }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

function createTrackedNotificationChannel(events: DeclarativeDocumentNotification[]) {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()

  return {
    channel: {
      publish(event: DeclarativeDocumentNotification) {
        events.push(event)
        for (const listener of listeners) {
          listener(event)
        }
      },
      subscribe(listener: (event: DeclarativeDocumentNotification) => void) {
        listeners.add(listener)
        return () => {
          listeners.delete(listener)
        }
      },
    } satisfies DeclarativeDocumentNotificationChannel,
    getListenerCount() {
      return listeners.size
    },
  }
}

async function waitForMicrotasks(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

function expectResultType<TResult extends { type: string }, TType extends TResult['type']>(
  result: TResult,
  expectedType: TType,
): asserts result is Extract<TResult, { type: TType }> {
  expect(result.type).toBe(expectedType)
  if (result.type !== expectedType) {
    throw new Error(`expected ${expectedType} result`)
  }
}

function createWatchableRepository() {
  const publishedEvents: DeclarativeDocumentNotification[] = []
  const notificationChannel = createNotificationChannel(publishedEvents)
  const repository = createTinyBaseDeclarativeRepository({
    notificationChannel,
  })

  return {
    publishedEvents,
    notificationChannel,
    repository: {
      ...repository,
      getNotificationChannel: () => notificationChannel,
    },
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return {
    promise,
    resolve,
    reject,
  }
}

describe('declarative repository', () => {
  it('stores and retrieves revisioned page documents through the repository seam and normalizes the loaded page', async () => {
    const repository = createTinyBaseDeclarativeRepository({
      now: () => '2026-04-10T00:00:00.000Z',
      generateRevision: () => 'rev-1',
    })

    const putResult = await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    expectResultType(putResult, 'put-document')
    expect(putResult.record.id).toBe('support.audit')
    expect(putResult.record.document.kind).toBe('page')
    expect(putResult.record.document.id).toBe('support.audit')
    expect(putResult.record.revision).toBe('rev-1')

    const getResult = await repository.query({
      type: 'get-document',
      documentKind: 'page',
      id: 'support.audit',
    })

    expect(getResult).toEqual({
      type: 'get-document',
      found: true,
      record: putResult.record,
    })

    expectResultType(getResult, 'get-document')
    if (!getResult.found || getResult.record?.documentKind !== 'page') {
      throw new Error('expected a stored page document')
    }

    const normalized = normalizePageDocument(getResult.record.document)

    expect(normalized.kind).toBe('page')
    expect(normalized.id).toBe('support.audit')
    expect(normalized.root.type).toBeDefined()
  })

  it('lists summaries with document kind, scope, tag, and search filters', async () => {
    const repository = createTinyBaseDeclarativeRepository({
      now: () => '2026-04-10T00:00:00.000Z',
      generateRevision: ({ id }) => `rev:${id}`,
    })

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.dashboard',
      document: declarativeUiTabbedSupportPage,
    })
    await repository.mutate({
      type: 'put-document',
      documentKind: 'component-registry-entry',
      id: 'ui.element.button',
      document: createRegistryEntry(),
    })

    const pageList = await repository.query({
      type: 'list-documents',
      documentKind: 'page',
    })
    const registryList = await repository.query({
      type: 'list-documents',
      documentKind: 'component-registry-entry',
      scope: 'public',
      tags: ['button'],
      searchText: 'primary',
    })

    expectResultType(pageList, 'list-documents')
    expect(pageList.items).toHaveLength(1)
    expect(pageList.items[0]?.title).toBe('Support Dashboard')

    expectResultType(registryList, 'list-documents')
    expect(registryList.items).toHaveLength(1)
    expect(registryList.items[0]).toMatchObject({
      id: 'ui.element.button',
      scope: 'public',
      slug: 'button',
      tags: ['button', 'action'],
    })
  })

  it('supports cursor and limit pagination over summaries', async () => {
    const repository = createTinyBaseDeclarativeRepository({
      now: (() => {
        let call = 0
        return () => `2026-04-10T00:00:0${call++}.000Z`
      })(),
      generateRevision: ({ id }) => `rev:${id}`,
    })

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })
    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.dashboard',
      document: declarativeUiTabbedSupportPage,
    })

    const firstPage = await repository.query({
      type: 'list-documents',
      documentKind: 'page',
      limit: 1,
    })

    expectResultType(firstPage, 'list-documents')
    expect(firstPage.items).toHaveLength(1)
    expect(firstPage.nextCursor).toBeTruthy()

    const secondPage = await repository.query({
      type: 'list-documents',
      documentKind: 'page',
      cursor: firstPage.nextCursor,
      limit: 1,
    })

    expectResultType(secondPage, 'list-documents')
    expect(secondPage.items).toHaveLength(1)
    expect(secondPage.items[0]?.id).not.toBe(firstPage.items[0]?.id)
  })

  it('enforces optimistic revision checks on put and delete', async () => {
    const repository = createTinyBaseDeclarativeRepository({
      now: () => '2026-04-10T00:00:00.000Z',
      generateRevision: ({ previousRevision }) => (previousRevision == null ? 'rev-1' : 'rev-2'),
    })

    const created = await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    expectResultType(created, 'put-document')
    expect(created.record.revision).toBe('rev-1')

    await expect(
      repository.mutate({
        type: 'put-document',
        documentKind: 'page',
        id: 'support.audit',
        document: declarativeUiTabbedSupportPage,
        expectedRevision: 'wrong-revision',
      }),
    ).rejects.toMatchObject({
      code: 'conflict',
    })

    await expect(
      repository.mutate({
        type: 'delete-document',
        documentKind: 'page',
        id: 'support.audit',
        expectedRevision: 'wrong-revision',
      }),
    ).rejects.toMatchObject({
      code: 'conflict',
    })
  })

  it('publishes changed and deleted notifications when a channel is provided', async () => {
    const events: DeclarativeDocumentNotification[] = []
    const repository = createTinyBaseDeclarativeRepository({
      now: () => '2026-04-10T00:00:00.000Z',
      generateRevision: () => 'rev-1',
      notificationChannel: createNotificationChannel(events),
    })

    const putResult = await repository.mutate({
      type: 'put-document',
      documentKind: 'component-registry-entry',
      id: 'ui.element.button',
      document: createRegistryEntry(),
    })
    expectResultType(putResult, 'put-document')

    const deleteResult = await repository.mutate({
      type: 'delete-document',
      documentKind: 'component-registry-entry',
      id: 'ui.element.button',
      expectedRevision: putResult.record.revision,
    })
    expectResultType(deleteResult, 'delete-document')

    expect(deleteResult.deleted).toBe(true)
    expect(events).toEqual([
      {
        type: 'document.changed',
        documentKind: 'component-registry-entry',
        id: 'ui.element.button',
        revision: 'rev-1',
        source: 'same-tab',
      },
      {
        type: 'document.deleted',
        documentKind: 'component-registry-entry',
        id: 'ui.element.button',
        revision: 'rev-1',
        source: 'same-tab',
      },
    ])
  })

  it('initializes memory mode without creating a persister', async () => {
    const repository = await import('./index.js').then(({ initializeTinyBaseDeclarativeRepository }) =>
      initializeTinyBaseDeclarativeRepository({
        storage: {
          kind: 'memory',
        },
      }),
    )

    expect(repository.getStorage()).toEqual({ kind: 'memory' })
    expect(repository.getPersister()).toBeUndefined()

    const result = await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    expectResultType(result, 'put-document')
    expect(result.record.id).toBe('support.audit')
  })

  it('watches a document with initial, changed, and deleted refresh events', async () => {
    const { repository } = createWatchableRepository()

    const events: Array<{
      reason: string
      source: string
      found: boolean
      revision?: string
    }> = []

    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push({
          reason: event.reason,
          source: event.source,
          found: event.result.found,
          revision: event.result.record?.revision,
        })
      },
    )

    expect(events).toEqual([
      {
        reason: 'initial',
        source: 'unknown',
        found: false,
        revision: undefined,
      },
    ])

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })
    await waitForMicrotasks()

    await repository.mutate({
      type: 'delete-document',
      documentKind: 'page',
      id: 'support.audit',
    })
    await waitForMicrotasks()

    expect(events).toEqual([
      {
        reason: 'initial',
        source: 'unknown',
        found: false,
        revision: undefined,
      },
      {
        reason: 'changed',
        source: 'same-tab',
        found: true,
        revision: 'page-support.audit-1',
      },
      {
        reason: 'deleted',
        source: 'same-tab',
        found: false,
        revision: undefined,
      },
    ])

    unsubscribe()
  })

  it('ignores unrelated document watch notifications', async () => {
    const { repository } = createWatchableRepository()

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.dashboard',
      document: declarativeUiTabbedSupportPage,
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial'])

    unsubscribe()
  })

  it('does not refresh document watches on broad invalidation', async () => {
    const { notificationChannel, repository } = createWatchableRepository()

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    await notificationChannel.publish({
      type: 'document.invalidated',
      source: 'external-tab',
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial'])

    unsubscribe()
  })

  it('refreshes document watches on exact scoped invalidation', async () => {
    const { notificationChannel, repository } = createWatchableRepository()

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    await notificationChannel.publish({
      type: 'document.invalidated',
      documentKind: 'page',
      id: 'support.audit',
      source: 'external-tab',
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial', 'invalidated'])

    unsubscribe()
  })

  it('ignores document invalidation for a different document id', async () => {
    const { notificationChannel, repository } = createWatchableRepository()

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    await notificationChannel.publish({
      type: 'document.invalidated',
      documentKind: 'page',
      id: 'support.dashboard',
      source: 'external-tab',
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial'])

    unsubscribe()
  })

  it('recovers document watches after a refresh listener failure', async () => {
    const { repository } = createWatchableRepository()

    const events: string[] = []
    let failNextChangedRefresh = true

    const unsubscribe = await watchDeclarativeRepositoryDocument(
      repository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)

        if (event.reason === 'changed' && failNextChangedRefresh) {
          failNextChangedRefresh = false
          throw new Error('listener refresh failure')
        }
      },
    )

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })
    await waitForMicrotasks()

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiTabbedSupportPage,
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial', 'changed', 'changed'])

    unsubscribe()
  })

  it('does not miss a document change while the initial refresh is in flight', async () => {
    const { notificationChannel, repository } = createWatchableRepository()
    const initialQueryGate = createDeferred<void>()
    let initialQueryPending = true

    const delayedRepository: WatchableDeclarativeRepository = {
      ...repository,
      async query(query) {
        if (query.type === 'get-document' && initialQueryPending) {
          initialQueryPending = false
          await initialQueryGate.promise
        }

        return repository.query(query)
      },
    }

    const events: string[] = []
    const watchPromise = watchDeclarativeRepositoryDocument(
      delayedRepository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    await notificationChannel.publish({
      type: 'document.changed',
      documentKind: 'page',
      id: 'support.audit',
      revision: 'rev-pending',
      source: 'same-tab',
    })

    initialQueryGate.resolve()
    const unsubscribe = await watchPromise
    await waitForMicrotasks()

    expect(events).toEqual(['initial', 'changed'])

    unsubscribe()
  })

  it('refreshes list watches on same-tab changes and broad external invalidation', async () => {
    const { publishedEvents, notificationChannel, repository } = createWatchableRepository()

    const events: Array<{
      reason: string
      source: string
      ids: string[]
    }> = []

    const unsubscribe = await watchDeclarativeRepositoryListDocuments(
      repository,
      {
        type: 'list-documents',
        documentKind: 'page',
      },
      event => {
        events.push({
          reason: event.reason,
          source: event.source,
          ids: event.result.items.map(item => item.id),
        })
      },
    )

    expect(events).toEqual([
      {
        reason: 'initial',
        source: 'unknown',
        ids: [],
      },
    ])

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })
    await waitForMicrotasks()

    await notificationChannel.publish({
      type: 'document.invalidated',
      source: 'external-tab',
    })
    await waitForMicrotasks()

    expect(events).toEqual([
      {
        reason: 'initial',
        source: 'unknown',
        ids: [],
      },
      {
        reason: 'changed',
        source: 'same-tab',
        ids: ['support.audit'],
      },
      {
        reason: 'invalidated',
        source: 'external-tab',
        ids: ['support.audit'],
      },
    ])
    expect(publishedEvents).toContainEqual({
      type: 'document.invalidated',
      source: 'external-tab',
    })

    unsubscribe()
  })

  it('re-queries filtered list watches even when the changed document does not match the filter', async () => {
    const { repository } = createWatchableRepository()

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: {
        ...declarativeUiReadonlyAuditPage,
        title: 'Support Audit',
      },
    })

    const events: Array<{
      reason: string
      ids: string[]
    }> = []

    const unsubscribe = await watchDeclarativeRepositoryListDocuments(
      repository,
      {
        type: 'list-documents',
        documentKind: 'page',
        searchText: 'audit',
      },
      event => {
        events.push({
          reason: event.reason,
          ids: event.result.items.map(item => item.id),
        })
      },
    )

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.dashboard',
      document: declarativeUiTabbedSupportPage,
    })
    await waitForMicrotasks()

    expect(events).toEqual([
      {
        reason: 'initial',
        ids: ['support.audit'],
      },
      {
        reason: 'changed',
        ids: ['support.audit'],
      },
    ])

    unsubscribe()
  })

  it('does not emit after unsubscribe when a matching refresh is already in flight', async () => {
    const { notificationChannel, repository } = createWatchableRepository()
    const refreshGate = createDeferred<void>()
    let blockInvalidatedRefresh = false

    const delayedRepository: WatchableDeclarativeRepository = {
      ...repository,
      async query(query) {
        if (query.type === 'get-document' && blockInvalidatedRefresh) {
          await refreshGate.promise
        }

        return repository.query(query)
      },
    }

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryDocument(
      delayedRepository,
      {
        type: 'document',
        documentKind: 'page',
        id: 'support.audit',
      },
      event => {
        events.push(event.reason)
      },
    )

    blockInvalidatedRefresh = true
    await notificationChannel.publish({
      type: 'document.invalidated',
      documentKind: 'page',
      id: 'support.audit',
      source: 'external-tab',
    })

    unsubscribe()
    refreshGate.resolve()
    await waitForMicrotasks()

    expect(events).toEqual(['initial'])
  })

  it('unsubscribes the notification listener if the initial watch query fails', async () => {
    const tracked = createTrackedNotificationChannel([])
    const repository = createTinyBaseDeclarativeRepository({
      notificationChannel: tracked.channel,
    })

    const failingRepository: WatchableDeclarativeRepository = {
      ...repository,
      getNotificationChannel: () => tracked.channel,
      async query() {
        throw new Error('initial query failed')
      },
    }

    await expect(
      watchDeclarativeRepositoryDocument(
        failingRepository,
        {
          type: 'document',
          documentKind: 'page',
          id: 'support.audit',
        },
        () => {},
      ),
    ).rejects.toThrow('initial query failed')

    expect(tracked.getListenerCount()).toBe(0)
  })

  it('stops emitting watch events after unsubscribe', async () => {
    const { repository } = createWatchableRepository()

    const events: string[] = []
    const unsubscribe = await watchDeclarativeRepositoryListDocuments(
      repository,
      {
        type: 'list-documents',
        documentKind: 'page',
      },
      event => {
        events.push(event.reason)
      },
    )

    unsubscribe()

    await repository.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })
    await waitForMicrotasks()

    expect(events).toEqual(['initial'])
  })

  it('initializes opfs mode by loading persisted state and starting auto-save', async () => {
    const fake = createFakePersister()
    const repository = await import('./index.js').then(({ initializeTinyBaseDeclarativeRepository }) =>
      initializeTinyBaseDeclarativeRepository({
        storage: {
          kind: 'opfs',
          fileHandle: {} as FileSystemFileHandle,
        },
        persisterFactory: () => fake.persister as any,
      }),
    )

    expect(fake.calls.load).toBe(1)
    expect(fake.calls.startAutoSave).toBe(1)
    expect(fake.calls.startAutoLoad).toBe(0)
    expect(repository.getPersister()).toBe(fake.persister)
  })

  it('can start auto-load for opfs mode when requested', async () => {
    const fake = createFakePersister()

    await import('./index.js').then(({ initializeTinyBaseDeclarativeRepository }) =>
      initializeTinyBaseDeclarativeRepository({
        storage: {
          kind: 'opfs',
          fileHandle: {} as FileSystemFileHandle,
          autoLoad: true,
        },
        persisterFactory: () => fake.persister as any,
      }),
    )

    expect(fake.calls.startAutoLoad).toBe(1)
    expect(fake.calls.load).toBe(0)
    expect(fake.calls.startAutoSave).toBe(1)
  })

  it('destroys the persister for opfs mode', async () => {
    const fake = createFakePersister()
    const repository = await import('./index.js').then(({ initializeTinyBaseDeclarativeRepository }) =>
      initializeTinyBaseDeclarativeRepository({
        storage: {
          kind: 'opfs',
          fileHandle: {} as FileSystemFileHandle,
        },
        persisterFactory: () => fake.persister as any,
      }),
    )

    await repository.destroy()

    expect(fake.calls.destroy).toBe(1)
  })
})
