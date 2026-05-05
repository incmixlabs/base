import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDeclarativeBackgroundSyncScheduler } from './declarative-sync-scheduler'

type ListenerMap = Map<string, Set<() => void>>

function createEventTargetHarness() {
  const listeners: ListenerMap = new Map()

  return {
    target: {
      addEventListener(type: string, listener: () => void) {
        const bucket = listeners.get(type) ?? new Set()
        bucket.add(listener)
        listeners.set(type, bucket)
      },
      removeEventListener(type: string, listener: () => void) {
        listeners.get(type)?.delete(listener)
      },
    },
    dispatch(type: string) {
      for (const listener of listeners.get(type) ?? []) {
        listener()
      }
    },
  }
}

describe('createDeclarativeBackgroundSyncScheduler', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces local changes into one background sync run', async () => {
    vi.useFakeTimers()

    const runSync = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
    const scheduler = createDeclarativeBackgroundSyncScheduler({
      runSync,
      debounceMs: 200,
    })

    scheduler.notifyLocalChange()
    scheduler.notifyLocalChange()
    scheduler.notifyLocalChange()

    await vi.advanceTimersByTimeAsync(199)
    expect(runSync).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(runSync).toHaveBeenCalledTimes(1)
    expect(runSync).toHaveBeenCalledWith('local-change')

    scheduler.destroy()
  })

  it('runs when the page becomes visible and the browser is online', async () => {
    const hiddenWindowHarness = createEventTargetHarness()
    const hiddenDocumentHarness = createEventTargetHarness()
    const runSync = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
    const hiddenScheduler = createDeclarativeBackgroundSyncScheduler({
      runSync,
      window: hiddenWindowHarness.target,
      document: {
        ...hiddenDocumentHarness.target,
        visibilityState: 'hidden',
      },
      navigator: {
        onLine: true,
      },
    })

    await hiddenScheduler.start()
    hiddenDocumentHarness.dispatch('visibilitychange')
    expect(runSync).not.toHaveBeenCalled()

    const visibleWindowHarness = createEventTargetHarness()
    const visibleDocumentHarness = createEventTargetHarness()
    const visibleDocument = {
      ...visibleDocumentHarness.target,
      visibilityState: 'visible' as const,
    }
    const visibleScheduler = createDeclarativeBackgroundSyncScheduler({
      runSync,
      window: visibleWindowHarness.target,
      document: visibleDocument,
      navigator: {
        onLine: true,
      },
    })

    await visibleScheduler.start()
    visibleDocumentHarness.dispatch('visibilitychange')
    await Promise.resolve()

    expect(runSync).toHaveBeenCalledWith('visibility')

    hiddenScheduler.destroy()
    visibleScheduler.destroy()
  })

  it('queues one rerun when a trigger lands during an in-flight sync', async () => {
    let releaseFirstSync = () => {}
    const firstSync = new Promise<void>(resolve => {
      releaseFirstSync = resolve
    })
    const runSync = vi
      .fn<(reason: 'local-change' | 'online' | 'visibility') => Promise<void>>()
      .mockImplementationOnce(async () => firstSync)
      .mockResolvedValueOnce(undefined)
    const windowHarness = createEventTargetHarness()
    const scheduler = createDeclarativeBackgroundSyncScheduler({
      runSync,
      window: windowHarness.target,
      navigator: {
        onLine: true,
      },
    })

    await scheduler.start()
    windowHarness.dispatch('online')
    expect(runSync).toHaveBeenCalledTimes(1)
    expect(runSync).toHaveBeenNthCalledWith(1, 'online')

    windowHarness.dispatch('online')
    expect(runSync).toHaveBeenCalledTimes(1)

    releaseFirstSync()
    // Flush the settled sync promise and the queued rerun before asserting the second call.
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(runSync).toHaveBeenCalledTimes(2)
    expect(runSync).toHaveBeenNthCalledWith(2, 'online')

    scheduler.destroy()
  })
})
