import { describe, expect, it } from 'vitest'
import { declarativeUiReadonlyAuditPage } from './declarative-ui.examples'
import {
  createBroadcastChannelNotificationChannel,
  type DeclarativeBroadcastChannel,
  initializeTinyBaseDeclarativeRepository,
} from './index'

function createFakeBroadcastChannelFactory() {
  const rooms = new Map<
    string,
    Set<{
      id: number
      listener?: (event: { data: unknown }) => void
    }>
  >()
  let nextId = 1

  return (channelName: string): DeclarativeBroadcastChannel => {
    const room = rooms.get(channelName) ?? new Set()
    rooms.set(channelName, room)

    const participant = {
      id: nextId++,
      listener: undefined as ((event: { data: unknown }) => void) | undefined,
    }
    room.add(participant)

    return {
      postMessage(message) {
        room.forEach(entry => {
          if (entry.id !== participant.id) {
            entry.listener?.({ data: structuredClone(message) })
          }
        })
      },
      addEventListener(_type, listener) {
        participant.listener = listener
      },
      removeEventListener(_type, listener) {
        if (participant.listener === listener) {
          participant.listener = undefined
        }
      },
      close() {
        room.delete(participant)
      },
    }
  }
}

describe('declarative notification channel', () => {
  it('propagates same-tab events locally and external-tab events across channels', async () => {
    const factory = createFakeBroadcastChannelFactory()
    const first = createBroadcastChannelNotificationChannel({
      channelName: 'declarative-docs',
      broadcastChannelFactory: factory,
    })
    const second = createBroadcastChannelNotificationChannel({
      channelName: 'declarative-docs',
      broadcastChannelFactory: factory,
    })

    const firstEvents: string[] = []
    const secondEvents: string[] = []

    first.subscribe(event => {
      firstEvents.push(`${event.type}:${event.source}`)
    })
    second.subscribe(event => {
      secondEvents.push(`${event.type}:${event.source}`)
    })

    await first.publish({
      type: 'document.changed',
      documentKind: 'page',
      id: 'support.audit',
      revision: 'rev-1',
      source: 'same-tab',
    })

    expect(firstEvents).toEqual(['document.changed:same-tab'])
    expect(secondEvents).toEqual(['document.changed:external-tab'])
  })

  it('wires repository mutations through the cross-tab channel between instances', async () => {
    const factory = createFakeBroadcastChannelFactory()
    const first = await initializeTinyBaseDeclarativeRepository({
      storage: {
        kind: 'memory',
      },
      crossTab: {
        kind: 'broadcast-channel',
        channelName: 'repo-cross-tab',
        broadcastChannelFactory: factory,
      },
    })
    const second = await initializeTinyBaseDeclarativeRepository({
      storage: {
        kind: 'memory',
      },
      crossTab: {
        kind: 'broadcast-channel',
        channelName: 'repo-cross-tab',
        broadcastChannelFactory: factory,
      },
    })

    const received: string[] = []
    const notificationChannel = second.getNotificationChannel()
    expect(notificationChannel).toBeDefined()
    const unsubscribe = notificationChannel!.subscribe(event => {
      received.push(`${event.type}:${event.source}:${event.id ?? 'unknown'}`)
    })

    await first.mutate({
      type: 'put-document',
      documentKind: 'page',
      id: 'support.audit',
      document: declarativeUiReadonlyAuditPage,
    })

    expect(received).toContain('document.changed:external-tab:support.audit')

    unsubscribe()
    await first.destroy()
    await second.destroy()
  })
})
