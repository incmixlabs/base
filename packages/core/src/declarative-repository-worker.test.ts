import { describe, expect, it } from 'vitest'
import { v7 as uuidv7 } from 'uuid'
import {
  createDeclarativeRepositoryWorkerHost,
  createWorkerBackedDeclarativeRepository,
  initializeTinyBaseDeclarativeRepository,
  type DeclarativeDocumentNotification,
  type DeclarativeDocumentNotificationChannel,
  type DeclarativeRepositoryWorkerEndpoint,
  type MessageEventLike,
} from './index'
import { declarativeUiReadonlyAuditPage } from './declarative-ui.examples'

function createNotificationChannel(): DeclarativeDocumentNotificationChannel {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()

  return {
    publish(event) {
      listeners.forEach(listener => {
        listener(event)
      })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

function createWorkerEndpointPair(): {
  mainThread: DeclarativeRepositoryWorkerEndpoint
  workerThread: DeclarativeRepositoryWorkerEndpoint
} {
  const mainListeners = new Set<(event: MessageEventLike) => void>()
  const workerListeners = new Set<(event: MessageEventLike) => void>()

  const mainThread: DeclarativeRepositoryWorkerEndpoint = {
    postMessage(message) {
      const event = { data: structuredClone(message) }
      workerListeners.forEach(listener => {
        listener(event)
      })
    },
    addEventListener(_type, listener) {
      mainListeners.add(listener)
    },
    removeEventListener(_type, listener) {
      mainListeners.delete(listener)
    },
  }

  const workerThread: DeclarativeRepositoryWorkerEndpoint = {
    postMessage(message) {
      const event = { data: structuredClone(message) }
      mainListeners.forEach(listener => {
        listener(event)
      })
    },
    addEventListener(_type, listener) {
      workerListeners.add(listener)
    },
    removeEventListener(_type, listener) {
      workerListeners.delete(listener)
    },
  }

  return {
    mainThread,
    workerThread,
  }
}

describe('declarative repository worker transport', () => {
  it('round-trips repository mutations and queries through the worker transport', async () => {
    const notifications = createNotificationChannel()
    const repository = await initializeTinyBaseDeclarativeRepository({
      storage: {
        kind: 'memory',
      },
      notificationChannel: notifications,
      generateRevision: () => 'rev-1',
      now: () => '2026-04-10T00:00:00.000Z',
    })
    const pair = createWorkerEndpointPair()
    const host = createDeclarativeRepositoryWorkerHost({
      endpoint: pair.workerThread,
      repository,
      notificationChannel: repository.getNotificationChannel(),
    })
    const client = createWorkerBackedDeclarativeRepository({
      endpoint: pair.mainThread,
      generateRequestId: () => 'req-1',
    })

    const received: string[] = []
    let resolveNotification!: () => void
    const notificationReceived = new Promise<void>(resolve => {
      resolveNotification = resolve
    })
    const unsubscribe = client.getNotificationChannel().subscribe(event => {
      const value = `${event.type}:${event.source}:${event.id ?? 'unknown'}`
      received.push(value)
      if (value === 'document.changed:same-tab:support.audit') {
        resolveNotification()
      }
    })

    const putResult = await client.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    expect(putResult.type).toBe('put-document')
    if (putResult.type !== 'put-document') {
      throw new Error('expected put-document result')
    }
    expect(putResult.record.revision).toBe('rev-1')
    await notificationReceived
    expect(received).toContain('document.changed:same-tab:support.audit')

    const getResult = await client.query({
      type: 'get-document',
      documentKind: 'page',
      id: 'support.audit',
    })

    expect(getResult).toEqual({
      type: 'get-document',
      found: true,
      record: putResult.record,
    })

    unsubscribe()
    client.destroy()
    host.destroy()
    await repository.destroy()
  })

  it('surfaces repository errors from the worker transport', async () => {
    const repository = await initializeTinyBaseDeclarativeRepository({
      storage: {
        kind: 'memory',
      },
      notificationChannel: createNotificationChannel(),
      generateRevision: ({ previousRevision }) => (previousRevision == null ? 'rev-1' : 'rev-2'),
      now: () => '2026-04-10T00:00:00.000Z',
    })
    const pair = createWorkerEndpointPair()
    const host = createDeclarativeRepositoryWorkerHost({
      endpoint: pair.workerThread,
      repository,
      notificationChannel: repository.getNotificationChannel(),
    })
    const client = createWorkerBackedDeclarativeRepository({
      endpoint: pair.mainThread,
      generateRequestId: uuidv7,
    })

    await client.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    await expect(
      client.mutate({
        type: 'put-document',
        documentKind: 'page',
        id: 'support.audit',
        expectedRevision: 'rev-stale',
        document: declarativeUiReadonlyAuditPage,
      }),
    ).rejects.toMatchObject({
      name: 'DeclarativeRepositoryWorkerClientError',
      code: 'conflict',
    })

    client.destroy()
    host.destroy()
    await repository.destroy()
  })
})
