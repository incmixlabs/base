export type DeclarativeBackgroundSyncReason = 'local-change' | 'online' | 'visibility'

type EventTargetLike = {
  addEventListener(type: string, listener: () => void): void
  removeEventListener(type: string, listener: () => void): void
}

type WindowLike = EventTargetLike
type DocumentLike = EventTargetLike & {
  visibilityState: string
}
type NavigatorLike = {
  onLine: boolean
}

export type CreateDeclarativeBackgroundSyncSchedulerOptions = {
  runSync: (reason: DeclarativeBackgroundSyncReason) => Promise<void>
  subscribeToLocalChanges?: (listener: () => void) => Promise<() => void> | (() => void)
  debounceMs?: number
  canSync?: () => boolean
  onError?: (error: unknown) => void
  window?: WindowLike
  document?: DocumentLike
  navigator?: NavigatorLike
}

export type DeclarativeBackgroundSyncScheduler = {
  start(): Promise<void>
  destroy(): void
  notifyLocalChange(): void
}

const DEFAULT_BACKGROUND_SYNC_DEBOUNCE_MS = 1_500

export function createDeclarativeBackgroundSyncScheduler(
  options: CreateDeclarativeBackgroundSyncSchedulerOptions,
): DeclarativeBackgroundSyncScheduler {
  const browserWindow = options.window ?? (typeof window === 'undefined' ? undefined : window)
  const browserDocument = options.document ?? (typeof document === 'undefined' ? undefined : document)
  const browserNavigator = options.navigator ?? (typeof navigator === 'undefined' ? undefined : navigator)
  const debounceMs = options.debounceMs ?? DEFAULT_BACKGROUND_SYNC_DEBOUNCE_MS

  let destroyed = false
  let started = false
  let syncInFlight: Promise<void> | null = null
  let rerunReason: DeclarativeBackgroundSyncReason | null = null
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null
  let unsubscribeLocalChanges = () => {}

  function clearDebounceTimer() {
    if (debounceTimeout != null) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }
  }

  function canAttemptSync(): boolean {
    if (destroyed) {
      return false
    }

    if (browserNavigator?.onLine === false) {
      return false
    }

    if (browserDocument != null && browserDocument.visibilityState !== 'visible') {
      return false
    }

    return options.canSync?.() ?? true
  }

  function runOrQueue(reason: DeclarativeBackgroundSyncReason) {
    if (!canAttemptSync()) {
      return
    }

    if (syncInFlight != null) {
      rerunReason = reason
      return
    }

    syncInFlight = (async () => {
      try {
        await options.runSync(reason)
      } catch (error) {
        options.onError?.(error)
      } finally {
        syncInFlight = null
        const nextReason = rerunReason
        rerunReason = null
        if (nextReason != null) {
          runOrQueue(nextReason)
        }
      }
    })()
  }

  function scheduleLocalChange() {
    if (destroyed) {
      return
    }

    clearDebounceTimer()
    debounceTimeout = setTimeout(() => {
      debounceTimeout = null
      runOrQueue('local-change')
    }, debounceMs)
  }

  function handleVisibilityChange() {
    if (browserDocument?.visibilityState === 'visible') {
      runOrQueue('visibility')
    }
  }

  function handleOnline() {
    runOrQueue('online')
  }

  return {
    async start() {
      if (started || destroyed) {
        return
      }

      started = true
      browserWindow?.addEventListener('online', handleOnline)
      browserDocument?.addEventListener('visibilitychange', handleVisibilityChange)
      let unsubscribe: () => void
      try {
        unsubscribe = (await options.subscribeToLocalChanges?.(scheduleLocalChange)) ?? (() => {})
      } catch (error) {
        started = false
        browserWindow?.removeEventListener('online', handleOnline)
        browserDocument?.removeEventListener('visibilitychange', handleVisibilityChange)
        throw error
      }
      if (destroyed) {
        unsubscribe()
        return
      }
      unsubscribeLocalChanges = unsubscribe
    },
    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      started = false
      clearDebounceTimer()
      browserWindow?.removeEventListener('online', handleOnline)
      browserDocument?.removeEventListener('visibilitychange', handleVisibilityChange)
      unsubscribeLocalChanges()
    },
    notifyLocalChange() {
      scheduleLocalChange()
    },
  }
}
