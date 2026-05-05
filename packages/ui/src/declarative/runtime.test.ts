import type { NormalizedPageDocument } from '@incmix/core'
import { normalizePageDocument } from '@incmix/core'
import { describe, expect, it, vi } from 'vitest'
import { assign, waitFor } from 'xstate'
import {
  createDeclarativePageActionHandler,
  createDeclarativePageActor,
  createDeclarativePageMachine,
  createDeclarativePageWorkflowRunner,
  createDeclarativePageWorkflowTransitionHandler,
  getDeclarativeSnapshotContextValue,
} from './runtime'
import { declarativeUiTabbedSupportPageFixture } from './test-pages'

const page: NormalizedPageDocument = {
  kind: 'page',
  id: 'example.page',
  title: 'Example Page',
  root: {
    type: 'layout',
  },
  runtime: {
    actions: [],
  },
}

describe('createDeclarativePageMachine', () => {
  it('starts in ready state when no loader is configured', () => {
    const actor = createDeclarativePageActor({ page })
    actor.start()

    expect(actor.getSnapshot().matches('ready')).toBe(true)
    expect(actor.getSnapshot().context.page.id).toBe('example.page')
    expect(actor.getSnapshot().context.pendingAction).toBeNull()

    actor.stop()
  })

  it('loads runtime context before entering ready', async () => {
    const actor = createDeclarativePageActor({
      page: {
        ...page,
        runtime: {
          actions: page.runtime?.actions ?? [],
          loadQuery: {
            id: 'bootstrap',
            spec: {
              type: 'rest',
              method: 'GET',
              url: '/api/example-page',
            },
          },
        },
      },
      context: {
        clickCount: 0,
      },
      services: {
        loadQuery: async descriptor => {
          expect(descriptor.id).toBe('bootstrap')
          expect(descriptor.spec.url).toBe('/api/example-page')
          return {
            clickCount: 2,
          }
        },
      },
    })

    actor.start()

    await waitFor(actor, snapshot => snapshot.matches('ready'))

    expect(actor.getSnapshot().context.clickCount).toBe(2)
    expect(actor.getSnapshot().context.lastError).toBeNull()

    actor.stop()
  })

  it('loads broader page-grammar context for view variants before entering ready', async () => {
    const actor = createDeclarativePageActor({
      page: normalizePageDocument(declarativeUiTabbedSupportPageFixture),
      context: {
        activeView: 'summary' as 'summary' | 'detail',
        canEdit: true,
      },
      services: {
        loadQuery: async descriptor => {
          expect(descriptor.id).toBe('bootstrap')
          expect(descriptor.spec.url).toBe('/api/support/dashboard')
          return {
            activeView: 'detail' as const,
            canEdit: false,
          }
        },
      },
    })

    actor.start()

    await waitFor(actor, snapshot => snapshot.matches('ready'))

    expect(actor.getSnapshot().context.activeView).toBe('detail')
    expect(actor.getSnapshot().context.canEdit).toBe(false)

    actor.stop()
  })

  it('allows ready-state extensions to handle declarative events', async () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        clickCount: 0,
      },
      states: {
        ready: {
          on: {
            'demo.cta.clicked': {
              actions: assign({
                clickCount: ({ context }) => context.clickCount + 1,
              }),
            },
          },
        },
      },
    })

    actor.start()
    actor.send({ type: 'demo.cta.clicked' })

    expect(actor.getSnapshot().context.clickCount).toBe(1)

    actor.stop()
  })

  it('runs non-emit actions through the shared action service', async () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
        successCount: 0,
      },
      services: {
        action: async action => {
          expect(action.type).toBe('openModal')
          return {
            activeModal: 'help',
          }
        },
      },
      states: {
        ready: {
          on: {
            'modal.opened': {
              actions: assign({
                successCount: ({ context }) => context.successCount + 1,
              }),
            },
          },
        },
      },
    })

    actor.start()

    createDeclarativePageActionHandler(actor)({
      type: 'openModal',
      successEvent: 'modal.opened',
    })

    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'help')

    expect(actor.getSnapshot().context.successCount).toBe(1)
    expect(actor.getSnapshot().context.pendingAction).toBeNull()

    actor.stop()
  })

  it('routes dirty-guarded declarative actions through the dirty guard before submitting', async () => {
    const pendingActions: Array<() => void> = []
    const dirtyGuard = {
      confirmOrRun: vi.fn(async (action: () => void) => {
        pendingActions.push(action)
      }),
    }
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
      },
      services: {
        action: async action => {
          expect(action.type).toBe('openModal')
          return {
            activeModal: 'help',
          }
        },
      },
    })

    actor.start()

    createDeclarativePageActionHandler(actor, { dirtyGuard })({
      type: 'openModal',
      confirm: {
        guard: 'dirty',
        title: 'Abandon changes?',
        message: 'Discard changes and open Help?',
        cancelLabel: 'Keep editing',
        confirmLabel: 'Discard changes',
      },
    })

    expect(dirtyGuard.confirmOrRun).toHaveBeenCalledWith(expect.any(Function), {
      action: expect.objectContaining({ type: 'openModal' }),
      confirm: expect.objectContaining({
        guard: 'dirty',
        message: 'Discard changes and open Help?',
      }),
    })
    expect(actor.getSnapshot().context.pendingAction).toBeNull()

    const pendingAction = pendingActions[0]
    if (!pendingAction) throw new Error('Expected dirty guard to capture a pending action')
    pendingAction()
    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'help')

    actor.stop()
  })

  it('submits dirty-guarded declarative actions directly when no dirty guard is provided', async () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
      },
      services: {
        action: async () => ({
          activeModal: 'help',
        }),
      },
    })

    actor.start()

    createDeclarativePageActionHandler(actor)({
      type: 'openModal',
      confirm: {
        guard: 'dirty',
        title: 'Abandon changes?',
        message: 'Discard changes and open Help?',
      },
    })

    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'help')

    actor.stop()
  })

  it('runs workflow transition actions through the same dirty guard path', async () => {
    const pendingActions: Array<() => void> = []
    const dirtyGuard = {
      confirmOrRun: vi.fn(async (action: () => void) => {
        pendingActions.push(action)
      }),
    }
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
      },
      services: {
        action: async action => {
          expect(action.type).toBe('navigate')
          return {
            activeModal: 'next-record',
          }
        },
      },
    })

    actor.start()

    createDeclarativePageWorkflowTransitionHandler(actor, { dirtyGuard, getWorkflowState: () => 'editing' })({
      id: 'openNextRecord',
      event: 'record.openNext',
      from: 'editing',
      to: 'ready',
      action: {
        type: 'navigate',
        to: '/records/next',
      },
      confirm: {
        guard: 'dirty',
        title: 'Abandon changes?',
        message: 'Discard changes and open the next record?',
      },
    })

    expect(dirtyGuard.confirmOrRun).toHaveBeenCalledOnce()
    expect(actor.getSnapshot().context.pendingAction).toBeNull()

    const pendingAction = pendingActions[0]
    if (!pendingAction) throw new Error('Expected workflow transition to capture a pending action')
    pendingAction()

    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'next-record')

    actor.stop()
  })

  it('looks up workflow transitions and filters allowed transitions by current state', () => {
    const actor = createDeclarativePageActor({ page })
    actor.start()

    const workflowPage: NormalizedPageDocument = {
      ...page,
      runtime: {
        actions: [],
        workflow: {
          transitions: [
            {
              id: 'submit',
              event: 'quote.submit',
              from: 'draft',
              to: 'review',
            },
            {
              id: 'approve',
              event: 'quote.approve',
              from: ['review', 'rework'],
              to: 'approved',
            },
          ],
        },
      },
    }
    const runner = createDeclarativePageWorkflowRunner(workflowPage, actor, {
      getWorkflowState: () => 'draft',
    })

    expect(runner.findTransition('submit')?.event).toBe('quote.submit')
    expect(runner.findTransition('quote.approve')?.id).toBe('approve')
    expect(runner.getAllowedTransitions().map(transition => transition.id)).toEqual(['submit'])
    expect(runner.canRun(workflowPage.runtime?.workflow?.transitions[1]!)).toBe(false)

    actor.stop()
  })

  it('does not run a workflow transition when the from state does not match', () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        ran: false,
      },
      states: {
        ready: {
          on: {
            'quote.approve': {
              actions: assign({
                ran: () => true,
              }),
            },
          },
        },
      },
    })
    actor.start()

    const runner = createDeclarativePageWorkflowRunner(
      {
        ...page,
        runtime: {
          actions: [],
          workflow: {
            transitions: [
              {
                id: 'approve',
                event: 'quote.approve',
                from: 'review',
                to: 'approved',
              },
            ],
          },
        },
      },
      actor,
      {
        getWorkflowState: () => 'draft',
      },
    )

    expect(runner.run('approve')).toBe(false)
    expect(actor.getSnapshot().context.ran).toBe(false)

    actor.stop()
  })

  it('does not run a from-gated workflow transition when current state is unavailable', () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        ran: false,
      },
      states: {
        ready: {
          on: {
            'quote.approve': {
              actions: assign({
                ran: () => true,
              }),
            },
          },
        },
      },
    })
    actor.start()

    const transition = {
      id: 'approve',
      event: 'quote.approve',
      from: 'review',
      to: 'approved',
    }
    const runner = createDeclarativePageWorkflowRunner(
      {
        ...page,
        runtime: {
          actions: [],
          workflow: {
            transitions: [transition],
          },
        },
      },
      actor,
    )

    expect(runner.getAllowedTransitions()).toEqual([])
    expect(runner.run('approve')).toBe(false)
    expect(actor.getSnapshot().context.ran).toBe(false)

    actor.stop()
  })

  it('emits workflow transition events when no action is attached', () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        transitionCount: 0,
      },
      states: {
        ready: {
          on: {
            'quote.submit': {
              actions: assign({
                transitionCount: ({ context }) => context.transitionCount + 1,
              }),
            },
          },
        },
      },
    })
    actor.start()

    const onTransition = vi.fn()
    const runner = createDeclarativePageWorkflowRunner(
      {
        ...page,
        runtime: {
          actions: [],
          workflow: {
            transitions: [
              {
                id: 'submit',
                event: 'quote.submit',
                from: 'draft',
                to: 'review',
              },
            ],
          },
        },
      },
      actor,
      {
        getWorkflowState: () => 'draft',
        onTransition,
      },
    )

    expect(runner.run('submit')).toBe(true)
    expect(actor.getSnapshot().context.transitionCount).toBe(1)
    expect(onTransition).toHaveBeenCalledWith(expect.objectContaining({ id: 'submit' }))

    actor.stop()
  })

  it('pauses dirty workflow runner actions until confirmation', async () => {
    const pendingActions: Array<() => void> = []
    const dirtyGuard = {
      confirmOrRun: vi.fn(async (action: () => void) => {
        pendingActions.push(action)
      }),
    }
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
      },
      services: {
        action: async action => {
          expect(action.type).toBe('navigate')
          return {
            activeModal: 'next-record',
          }
        },
      },
    })
    actor.start()

    const onTransition = vi.fn()
    const runner = createDeclarativePageWorkflowRunner(
      {
        ...page,
        runtime: {
          actions: [],
          workflow: {
            transitions: [
              {
                id: 'openNextRecord',
                event: 'record.openNext',
                from: 'editing',
                action: {
                  type: 'navigate',
                  to: '/records/next',
                },
                confirm: {
                  guard: 'dirty',
                  title: 'Abandon changes?',
                  message: 'Discard changes and open the next record?',
                },
              },
            ],
          },
        },
      },
      actor,
      {
        dirtyGuard,
        getWorkflowState: () => 'editing',
        onTransition,
      },
    )

    expect(runner.run('openNextRecord')).toBe(true)
    expect(dirtyGuard.confirmOrRun).toHaveBeenCalledOnce()
    expect(actor.getSnapshot().context.pendingAction).toBeNull()
    expect(onTransition).not.toHaveBeenCalled()

    const pendingAction = pendingActions[0]
    if (!pendingAction) throw new Error('Expected workflow runner to capture a pending action')
    pendingAction()

    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'next-record')
    expect(onTransition).toHaveBeenCalledWith(expect.objectContaining({ id: 'openNextRecord' }))

    actor.stop()
  })

  it('does not complete action-backed workflow transitions when the action fails', async () => {
    const actor = createDeclarativePageActor({
      page,
      services: {
        action: async () => {
          throw new Error('action failed')
        },
      },
    })
    actor.start()

    const onTransition = vi.fn()
    const runner = createDeclarativePageWorkflowRunner(
      {
        ...page,
        runtime: {
          actions: [],
          workflow: {
            transitions: [
              {
                id: 'openNextRecord',
                event: 'record.openNext',
                from: 'editing',
                action: {
                  type: 'navigate',
                  to: '/records/next',
                },
              },
            ],
          },
        },
      },
      actor,
      {
        getWorkflowState: () => 'editing',
        onTransition,
      },
    )

    expect(runner.run('openNextRecord')).toBe(true)

    await waitFor(actor, snapshot => snapshot.matches('error'))
    expect(onTransition).not.toHaveBeenCalled()

    actor.stop()
  })

  it('captures loader failures and supports retry', async () => {
    let attempts = 0
    const pageWithLoadQuery: NormalizedPageDocument = {
      ...page,
      runtime: {
        actions: page.runtime?.actions ?? [],
        loadQuery: {
          id: 'bootstrap',
          spec: {
            type: 'rest',
            method: 'GET',
            url: '/api/example-page',
          },
        },
      },
    }
    const actor = createDeclarativePageActor({
      page: pageWithLoadQuery,
      context: {
        ctaEnabled: false,
      },
      services: {
        loadQuery: async () => {
          attempts += 1
          if (attempts === 1) {
            throw new Error('boom')
          }

          return {
            ctaEnabled: true,
          }
        },
      },
    })

    actor.start()

    await waitFor(actor, snapshot => snapshot.matches('error'))
    expect(actor.getSnapshot().context.lastError).toBe('boom')

    actor.send({ type: 'declarative.retry' })
    await waitFor(actor, snapshot => snapshot.matches('ready'))

    expect(actor.getSnapshot().context.ctaEnabled).toBe(true)
    expect(actor.getSnapshot().context.lastError).toBeNull()

    actor.stop()
  })

  it('captures action failures and supports retry', async () => {
    let attempts = 0
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
        failureCount: 0,
      },
      services: {
        action: async () => {
          attempts += 1
          if (attempts === 1) {
            throw new Error('action failed')
          }

          return {
            activeModal: 'help',
          }
        },
      },
      states: {
        error: {
          on: {
            'modal.failed': {
              actions: assign({
                failureCount: ({ context }) => context.failureCount + 1,
              }),
            },
          },
        },
      },
    })

    actor.start()
    createDeclarativePageActionHandler(actor)({
      type: 'openModal',
      failureEvent: 'modal.failed',
    })

    await waitFor(actor, snapshot => snapshot.matches('error'))
    expect(actor.getSnapshot().context.lastError).toBe('action failed')
    expect(actor.getSnapshot().context.failureCount).toBe(1)

    // Retry only re-enters loading when a page loader is configured.
    // This test exercises action-service failure without any loadQuery/load hook,
    // so declarative.retry should leave the actor in error.
    actor.send({ type: 'declarative.retry' })
    expect(actor.getSnapshot().matches('error')).toBe(true)

    actor.stop()
  })

  it('allows a new action submission from error state after an action failure', async () => {
    let attempts = 0
    const actor = createDeclarativePageActor({
      page,
      context: {
        activeModal: null as string | null,
      },
      services: {
        action: async () => {
          attempts += 1
          if (attempts === 1) {
            throw new Error('action failed')
          }

          return {
            activeModal: 'help',
          }
        },
      },
    })

    actor.start()

    createDeclarativePageActionHandler(actor)({
      type: 'openModal',
    })

    await waitFor(actor, snapshot => snapshot.matches('error'))

    createDeclarativePageActionHandler(actor)({
      type: 'openModal',
    })

    await waitFor(actor, snapshot => snapshot.matches('ready') && snapshot.context.activeModal === 'help')

    actor.stop()
  })

  it('creates a machine that can be used directly when needed', () => {
    const machine = createDeclarativePageMachine({
      page,
      context: {
        dirty: false,
      },
    })

    expect(machine).toBeDefined()
    expect(machine.config.initial).toBe('ready')
    expect(machine.config.context).toMatchObject({
      page: expect.objectContaining({ id: 'example.page' }),
      dirty: false,
      lastError: null,
      pendingAction: null,
    })
  })

  it('reads typed values from snapshot context through the shared helper', () => {
    const actor = createDeclarativePageActor({
      page,
      context: {
        clickCount: 4,
      },
    })

    actor.start()

    expect(
      getDeclarativeSnapshotContextValue(actor.getSnapshot(), 'clickCount', value => typeof value === 'number', 0),
    ).toBe(4)
    expect(
      getDeclarativeSnapshotContextValue(actor.getSnapshot(), 'missing', value => typeof value === 'number', 0),
    ).toBe(0)

    actor.stop()
  })
})
