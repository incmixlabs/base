import type {
  ActionSpec,
  NormalizedPageDocument,
  NormalizedPageQueryDescriptor,
  NormalizedPageWorkflowTransitionDescriptor,
} from '@incmix/core'
import { type AnyActorRef, type AnyEventObject, assign, createActor, fromPromise, setup } from 'xstate'
import type { DirtyGuardController } from '@/hooks'

export type DeclarativePageRuntimeAction = Exclude<ActionSpec, { type: 'emitEvent' }>
export type DeclarativePageRuntimeWorkflowTransition = NormalizedPageWorkflowTransitionDescriptor

export interface DeclarativePageRuntimeDirtyGuardContext {
  action: DeclarativePageRuntimeAction
  confirm: NonNullable<DeclarativePageRuntimeAction['confirm']>
}

export type DeclarativePageRuntimeState = 'loading' | 'ready' | 'submitting' | 'error'

export type DeclarativePageRuntimeContext<TContext extends Record<string, unknown> = Record<string, never>> =
  TContext & {
    page: NormalizedPageDocument
    lastError: string | null
    pendingAction: DeclarativePageRuntimeAction | null
  }

export type DeclarativePageRuntimeEvent =
  | { type: 'declarative.reload' }
  | { type: 'declarative.retry' }
  | { type: 'declarative.action'; action: DeclarativePageRuntimeAction }
  | AnyEventObject

type DeclarativePageRuntimeReservedContext = {
  page?: never
  lastError?: never
  pendingAction?: never
}

export type DeclarativePageRuntimeLoader<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext,
> = () => Partial<TContext> | undefined | Promise<Partial<TContext> | undefined>

export type DeclarativePageRuntimeQueryService<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext,
> = (
  descriptor: NormalizedPageQueryDescriptor,
  page: NormalizedPageDocument,
) => Partial<TContext> | undefined | Promise<Partial<TContext> | undefined>

export type DeclarativePageRuntimeActionService<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext,
> = (
  action: DeclarativePageRuntimeAction,
  page: NormalizedPageDocument,
) => Partial<TContext> | undefined | Promise<Partial<TContext> | undefined>

export type DeclarativePageRuntimeStateOverride = {
  on?: Record<string, any>
}

export type DeclarativePageRuntimeOptions<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext = Record<string, never>,
> = {
  page: NormalizedPageDocument
  context?: TContext
  load?: DeclarativePageRuntimeLoader<TContext>
  services?: {
    loadQuery?: DeclarativePageRuntimeQueryService<TContext>
    action?: DeclarativePageRuntimeActionService<TContext>
  }
  states?: Partial<Record<DeclarativePageRuntimeState, DeclarativePageRuntimeStateOverride>>
}

export interface DeclarativePageActionHandlerOptions {
  dirtyGuard?: Pick<DirtyGuardController<DeclarativePageRuntimeDirtyGuardContext>, 'confirmOrRun'>
}

export interface DeclarativePageWorkflowRunnerOptions extends DeclarativePageActionHandlerOptions {
  getWorkflowState?: () => string | null | undefined
  onTransition?: (transition: DeclarativePageRuntimeWorkflowTransition) => void
}

export interface DeclarativePageWorkflowRunner {
  transitions: DeclarativePageRuntimeWorkflowTransition[]
  findTransition: (idOrEvent: string) => DeclarativePageRuntimeWorkflowTransition | undefined
  getAllowedTransitions: () => DeclarativePageRuntimeWorkflowTransition[]
  canRun: (transition: DeclarativePageRuntimeWorkflowTransition) => boolean
  run: (idOrEventOrTransition: string | DeclarativePageRuntimeWorkflowTransition) => boolean
}

const workflowActionSuccessHandlers = new WeakMap<DeclarativePageRuntimeAction, () => void>()

export function getDeclarativeSnapshotContextValue<T>(
  snapshot: unknown,
  key: string,
  validator: (value: unknown) => value is T,
  fallback: T,
): T {
  if (
    snapshot &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    snapshot.context &&
    typeof snapshot.context === 'object' &&
    key in snapshot.context
  ) {
    const value = (snapshot.context as Record<string, unknown>)[key]
    if (validator(value)) {
      return value
    }
  }

  return fallback
}

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown declarative page runtime error'
}

function createPendingActionAssignment<TContext extends Record<string, unknown>>() {
  return assign(({ event }) => {
    if (event.type !== 'declarative.action') {
      return {}
    }

    return {
      pendingAction: event.action,
      lastError: null,
    } as Partial<DeclarativePageRuntimeContext<TContext>>
  })
}

export function createDeclarativePageMachine<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext = Record<string, never>,
>({ page, context, load, services, states }: DeclarativePageRuntimeOptions<TContext>) {
  const loadingState = states?.loading
  const readyState = states?.ready
  const submittingState = states?.submitting
  const errorState = states?.error
  const pageLoader = load
  const runtimeLoadQuery = page.runtime?.loadQuery
  const loadQueryService = services?.loadQuery
  const actionService = services?.action
  const hasDescriptorLoader = Boolean(runtimeLoadQuery && loadQueryService)
  const hasLoader = hasDescriptorLoader || Boolean(pageLoader)
  const hasActionService = Boolean(actionService)
  const pendingActionAssignment = createPendingActionAssignment<TContext>()

  return setup({
    types: {} as {
      context: DeclarativePageRuntimeContext<TContext>
      events: DeclarativePageRuntimeEvent
    },
    actors: {
      declarativePageLoader: fromPromise(async () => {
        if (runtimeLoadQuery && loadQueryService) {
          return await loadQueryService(runtimeLoadQuery, page)
        }

        return await pageLoader?.()
      }),
      declarativePageActionRunner: fromPromise(async ({ input }: { input: DeclarativePageRuntimeAction | null }) => {
        if (!input || !actionService) {
          return
        }

        return await actionService(input, page)
      }),
    },
  }).createMachine({
    initial: (hasLoader ? 'loading' : 'ready') as DeclarativePageRuntimeState,
    context: {
      ...(context ?? {}),
      page,
      lastError: null,
      pendingAction: null,
    } as DeclarativePageRuntimeContext<TContext>,
    states: {
      loading: {
        ...(loadingState ?? {}),
        // When a loader is configured, the runtime-owned invoke stays authoritative.
        // Callers can extend loading transitions via `on`, but should not override loader wiring here.
        ...(hasLoader
          ? {
              invoke: {
                src: 'declarativePageLoader',
                onDone: {
                  target: 'ready',
                  actions: assign(({ context, event }) => {
                    return {
                      ...(event.output ?? {}),
                      page: context.page,
                      lastError: null,
                    } as Partial<DeclarativePageRuntimeContext<TContext>>
                  }),
                },
                onError: {
                  target: 'error',
                  actions: assign(({ event }) => {
                    return {
                      lastError: normalizeErrorMessage(event.error),
                    } as Partial<DeclarativePageRuntimeContext<TContext>>
                  }),
                },
              },
            }
          : {}),
        on: {
          ...(loadingState?.on ?? {}),
        },
      },
      ready: {
        ...(readyState ?? {}),
        on: {
          ...(hasActionService
            ? {
                'declarative.action': {
                  target: 'submitting',
                  actions: pendingActionAssignment,
                },
              }
            : {}),
          ...(hasLoader
            ? {
                'declarative.reload': {
                  target: 'loading',
                },
              }
            : {}),
          ...(readyState?.on ?? {}),
        },
      },
      submitting: {
        ...(submittingState ?? {}),
        ...(hasActionService
          ? {
              invoke: {
                src: 'declarativePageActionRunner',
                input: ({ context }: { context: any }) => context.pendingAction,
                onDone: {
                  target: 'ready',
                  actions: [
                    ({ context, self }: { context: any; self: AnyActorRef }) => {
                      // Follow-up events are emitted before pendingAction is cleared so
                      // downstream handlers can still inspect the completed action.
                      const successEvent = context.pendingAction?.successEvent
                      if (successEvent) {
                        self.send({ type: successEvent })
                      }

                      const workflowActionSuccessHandler = context.pendingAction
                        ? workflowActionSuccessHandlers.get(context.pendingAction)
                        : undefined
                      if (context.pendingAction) {
                        workflowActionSuccessHandlers.delete(context.pendingAction)
                      }
                      workflowActionSuccessHandler?.()
                    },
                    assign(({ context, event }) => {
                      return {
                        ...(event.output ?? {}),
                        page: context.page,
                        lastError: null,
                        pendingAction: null,
                      } as Partial<DeclarativePageRuntimeContext<TContext>>
                    }),
                  ],
                },
                onError: {
                  target: 'error',
                  actions: [
                    ({ context, self, event }: { context: any; self: AnyActorRef; event: any }) => {
                      // Failure follow-up events intentionally see the failed action
                      // before pendingAction is reset.
                      const failureEvent = context.pendingAction?.failureEvent
                      if (failureEvent) {
                        self.send({ type: failureEvent, error: event.error })
                      }

                      if (context.pendingAction) {
                        workflowActionSuccessHandlers.delete(context.pendingAction)
                      }
                    },
                    assign(({ event }) => {
                      return {
                        lastError: normalizeErrorMessage(event.error),
                        pendingAction: null,
                      } as Partial<DeclarativePageRuntimeContext<TContext>>
                    }),
                  ],
                },
              },
            }
          : {}),
        on: {
          ...(submittingState?.on ?? {}),
        },
      },
      error: {
        ...(errorState ?? {}),
        on: {
          ...(hasActionService
            ? {
                'declarative.action': {
                  target: 'submitting',
                  actions: pendingActionAssignment,
                },
              }
            : {}),
          ...(hasLoader
            ? {
                'declarative.retry': {
                  target: 'loading',
                },
              }
            : {}),
          ...(errorState?.on ?? {}),
        },
      },
    },
    // TypeScript cannot infer the machine config cleanly through the conditional spreads
    // and optional state overrides used here, so this cast is intentional for now.
  } as any)
}

export function createDeclarativePageActor<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext = Record<string, never>,
>(options: DeclarativePageRuntimeOptions<TContext>): AnyActorRef {
  return createActor(createDeclarativePageMachine(options))
}

export function createDeclarativePageActionHandler(
  actorRef: AnyActorRef,
  options: DeclarativePageActionHandlerOptions = {},
) {
  return (action: DeclarativePageRuntimeAction) => {
    const sendAction = () =>
      actorRef.send({
        type: 'declarative.action',
        action,
      })

    if (action.confirm?.guard === 'dirty' && options.dirtyGuard) {
      void options.dirtyGuard.confirmOrRun(sendAction, {
        action,
        confirm: action.confirm,
      })
      return
    }

    sendAction()
  }
}

function isWorkflowTransitionAllowed(
  transition: DeclarativePageRuntimeWorkflowTransition,
  currentState: string | null | undefined,
) {
  if (!transition.from) return true
  if (currentState == null) return false
  return Array.isArray(transition.from) ? transition.from.includes(currentState) : transition.from === currentState
}

function resolveWorkflowTransitionAction(transition: DeclarativePageRuntimeWorkflowTransition) {
  if (!transition.action) return undefined

  return {
    ...transition.action,
    confirm: transition.confirm ?? transition.action.confirm,
    successEvent: transition.successEvent ?? transition.action.successEvent,
    failureEvent: transition.failureEvent ?? transition.action.failureEvent,
  }
}

export function createDeclarativePageWorkflowRunner(
  page: NormalizedPageDocument,
  actorRef: AnyActorRef,
  options: DeclarativePageWorkflowRunnerOptions = {},
): DeclarativePageWorkflowRunner {
  const transitions = page.runtime?.workflow?.transitions ?? []

  const findTransition = (idOrEvent: string) =>
    transitions.find(transition => transition.id === idOrEvent || transition.event === idOrEvent)

  const canRun = (transition: DeclarativePageRuntimeWorkflowTransition) =>
    isWorkflowTransitionAllowed(transition, options.getWorkflowState?.())

  const runResolvedTransition = (transition: DeclarativePageRuntimeWorkflowTransition) => {
    if (!canRun(transition)) return false

    const action = resolveWorkflowTransitionAction(transition)
    const completeTransition = () => options.onTransition?.(transition)

    if (!action) {
      actorRef.send({ type: transition.event })
      completeTransition()
      return true
    }

    if (action.type === 'emitEvent') {
      actorRef.send({ type: action.event })
      completeTransition()
      return true
    }

    const sendAction = () => {
      workflowActionSuccessHandlers.set(action, completeTransition)
      actorRef.send({
        type: 'declarative.action',
        action,
      })
    }

    if (action.confirm?.guard === 'dirty' && options.dirtyGuard) {
      void options.dirtyGuard.confirmOrRun(sendAction, {
        action,
        confirm: action.confirm,
      })
      return true
    }

    sendAction()
    return true
  }

  return {
    transitions,
    findTransition,
    getAllowedTransitions: () => transitions.filter(canRun),
    canRun,
    run: idOrEventOrTransition => {
      const transition =
        typeof idOrEventOrTransition === 'string' ? findTransition(idOrEventOrTransition) : idOrEventOrTransition
      return transition ? runResolvedTransition(transition) : false
    },
  }
}

export function createDeclarativePageWorkflowTransitionHandler(
  actorRef: AnyActorRef,
  options: DeclarativePageWorkflowRunnerOptions = {},
) {
  return (transition: DeclarativePageRuntimeWorkflowTransition) => {
    const page: NormalizedPageDocument = {
      kind: 'page',
      id: 'ad-hoc-workflow-transition',
      root: { type: 'layout' },
      runtime: {
        actions: [],
        workflow: {
          transitions: [transition],
        },
      },
    }

    createDeclarativePageWorkflowRunner(page, actorRef, options).run(transition)
  }
}

export function assignDeclarativePageContext<
  TContext extends Record<string, unknown> & DeclarativePageRuntimeReservedContext,
>(updater: (context: DeclarativePageRuntimeContext<TContext>) => Partial<TContext>) {
  return assign(({ context }) => updater(context as DeclarativePageRuntimeContext<TContext>))
}
