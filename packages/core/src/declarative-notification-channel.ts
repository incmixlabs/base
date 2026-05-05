import type {
  DeclarativeDocumentNotification,
  DeclarativeDocumentNotificationChannel,
} from './worker-repository-boundary'
import { validateDeclarativeDocumentNotification } from './worker-repository-boundary'

type MessageEventLike = {
  data: unknown
}

export type DeclarativeBroadcastChannel = {
  postMessage(message: unknown): void
  addEventListener(type: 'message', listener: (event: MessageEventLike) => void): void
  removeEventListener(type: 'message', listener: (event: MessageEventLike) => void): void
  close(): void
}

export type DeclarativeBroadcastChannelFactory = (channelName: string) => DeclarativeBroadcastChannel

export type ManagedDeclarativeDocumentNotificationChannel = DeclarativeDocumentNotificationChannel & {
  destroy?(): Promise<void> | void
}

export type BroadcastChannelNotificationChannel = ManagedDeclarativeDocumentNotificationChannel

export type BroadcastChannelNotificationChannelOptions = {
  channelName: string
  broadcastChannelFactory?: DeclarativeBroadcastChannelFactory
}

export function createLocalNotificationChannel(): ManagedDeclarativeDocumentNotificationChannel {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()

  return {
    publish(event) {
      for (const listener of [...listeners]) {
        try {
          listener(structuredClone(event))
        } catch (error) {
          queueMicrotask(() => {
            throw error
          })
        }
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

function getDefaultBroadcastChannelFactory(): DeclarativeBroadcastChannelFactory {
  const BroadcastChannelCtor = globalThis.BroadcastChannel as
    | (new (
        name: string,
      ) => DeclarativeBroadcastChannel)
    | undefined

  if (BroadcastChannelCtor == null) {
    throw new Error('createBroadcastChannelNotificationChannel: BroadcastChannel is not available in this environment')
  }

  return (channelName: string) => new BroadcastChannelCtor(channelName)
}

function cloneNotification(
  event: DeclarativeDocumentNotification,
  source: DeclarativeDocumentNotification['source'],
): DeclarativeDocumentNotification {
  return {
    ...structuredClone(event),
    source,
  }
}

export function createBroadcastChannelNotificationChannel(
  options: BroadcastChannelNotificationChannelOptions,
): BroadcastChannelNotificationChannel {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()
  const channel = (options.broadcastChannelFactory ?? getDefaultBroadcastChannelFactory())(options.channelName)

  const onMessage = (event: MessageEventLike) => {
    const result = validateDeclarativeDocumentNotification(event.data)
    if (result.notification == null) {
      return
    }

    const externalEvent = cloneNotification(result.notification, 'external-tab')
    for (const listener of listeners) {
      listener(externalEvent)
    }
  }

  channel.addEventListener('message', onMessage)

  return {
    publish(event) {
      const localEvent = cloneNotification(event, event.source)
      for (const listener of listeners) {
        listener(localEvent)
      }
      channel.postMessage(localEvent)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    destroy() {
      channel.removeEventListener('message', onMessage)
      channel.close()
    },
  }
}

export function composeDeclarativeDocumentNotificationChannels(
  channels: ManagedDeclarativeDocumentNotificationChannel[],
): ManagedDeclarativeDocumentNotificationChannel {
  return {
    async publish(event) {
      for (const channel of channels) {
        await channel.publish(event)
      }
    },
    subscribe(listener) {
      const unsubscribes = channels.map(channel => channel.subscribe(listener))
      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe()
        }
      }
    },
    async destroy() {
      for (const channel of channels) {
        await channel.destroy?.()
      }
    },
  }
}
