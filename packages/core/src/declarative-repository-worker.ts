import { v7 as uuidv7 } from 'uuid'
import type {
  DeclarativeDocumentNotification,
  DeclarativeDocumentNotificationChannel,
  DeclarativeRepository,
  DeclarativeRepositoryErrorCode,
  DeclarativeRepositoryMutation,
  DeclarativeRepositoryMutationResult,
  DeclarativeRepositoryQuery,
  DeclarativeRepositoryQueryResult,
  DeclarativeRepositoryWorkerRequest,
  DeclarativeRepositoryWorkerResponse,
} from './worker-repository-boundary'
import {
  DECLARATIVE_REPOSITORY_MUTATION_KIND,
  DECLARATIVE_REPOSITORY_QUERY_KIND,
  validateDeclarativeRepositoryWorkerRequest,
  validateDeclarativeRepositoryWorkerResponse,
} from './worker-repository-boundary'

export type MessageEventLike = {
  data: unknown
}

export type DeclarativeRepositoryWorkerEndpoint = {
  postMessage(message: unknown): void
  addEventListener(type: 'message', listener: (event: MessageEventLike) => void): void
  removeEventListener(type: 'message', listener: (event: MessageEventLike) => void): void
}

export class DeclarativeRepositoryWorkerClientError extends Error {
  code: DeclarativeRepositoryErrorCode
  retryable?: boolean

  constructor(code: DeclarativeRepositoryErrorCode, message: string, retryable?: boolean) {
    super(message)
    this.name = 'DeclarativeRepositoryWorkerClientError'
    this.code = code
    this.retryable = retryable
  }
}

export type CreateDeclarativeRepositoryWorkerHostOptions = {
  endpoint: DeclarativeRepositoryWorkerEndpoint
  repository: DeclarativeRepository
  notificationChannel?: DeclarativeDocumentNotificationChannel
}

export type DeclarativeRepositoryWorkerHost = {
  destroy(): void
}

export type CreateWorkerBackedDeclarativeRepositoryOptions = {
  endpoint: DeclarativeRepositoryWorkerEndpoint
  generateRequestId?: () => string
}

export type WorkerBackedDeclarativeRepository = DeclarativeRepository & {
  destroy(): void
  getNotificationChannel(): DeclarativeDocumentNotificationChannel
}

type PendingRequest =
  | {
      type: 'query'
      resolve: (result: DeclarativeRepositoryQueryResult) => void
      reject: (error: unknown) => void
    }
  | {
      type: 'mutation'
      resolve: (result: DeclarativeRepositoryMutationResult) => void
      reject: (error: unknown) => void
    }

function cloneResponse(response: DeclarativeRepositoryWorkerResponse): DeclarativeRepositoryWorkerResponse {
  return structuredClone(response)
}

function createNotificationFanout(): DeclarativeDocumentNotificationChannel {
  const listeners = new Set<(event: DeclarativeDocumentNotification) => void>()

  return {
    publish(event) {
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

function toWorkerErrorResponse(
  requestId: string,
  error: unknown,
): Extract<DeclarativeRepositoryWorkerResponse, { kind: 'repository.error' }> {
  if (error instanceof Error && 'code' in error) {
    const code: DeclarativeRepositoryErrorCode =
      error.code === 'conflict' || error.code === 'invalid-request' || error.code === 'not-found'
        ? error.code
        : 'unknown'
    const retryable = 'retryable' in error && typeof error.retryable === 'boolean' ? error.retryable : undefined
    return {
      requestId,
      kind: 'repository.error',
      error: {
        code,
        message: error.message,
        retryable,
      },
    }
  }

  return {
    requestId,
    kind: 'repository.error',
    error: {
      code: 'unknown',
      message: error instanceof Error ? error.message : 'unknown repository worker error',
    },
  }
}

function readRequestId(value: unknown): string | undefined {
  if (
    value != null &&
    typeof value === 'object' &&
    'requestId' in value &&
    typeof value.requestId === 'string' &&
    value.requestId.trim().length > 0
  ) {
    return value.requestId
  }

  return undefined
}

export function createDeclarativeRepositoryWorkerHost(
  options: CreateDeclarativeRepositoryWorkerHostOptions,
): DeclarativeRepositoryWorkerHost {
  let destroyed = false

  const unsubscribeNotifications = options.notificationChannel?.subscribe(notification => {
    if (destroyed) {
      return
    }

    const response: DeclarativeRepositoryWorkerResponse = {
      kind: 'repository.notification',
      notification,
    }
    options.endpoint.postMessage(cloneResponse(response))
  })

  const onMessage = (event: MessageEventLike) => {
    void handleRequest(event.data).catch(error => {
      const requestId = readRequestId(event.data)
      if (requestId == null) {
        return
      }

      options.endpoint.postMessage(cloneResponse(toWorkerErrorResponse(requestId, error)))
    })
  }

  async function handleRequest(message: unknown): Promise<void> {
    const validation = validateDeclarativeRepositoryWorkerRequest(message)
    if (validation.request == null) {
      const requestId = readRequestId(message) ?? 'invalid-request'

      const response: DeclarativeRepositoryWorkerResponse = {
        requestId,
        kind: 'repository.error',
        error: {
          code: 'invalid-request',
          message: validation.errors.join('; '),
        },
      }
      options.endpoint.postMessage(cloneResponse(response))
      return
    }

    const request = validation.request

    try {
      if (request.kind === DECLARATIVE_REPOSITORY_QUERY_KIND) {
        const result = await options.repository.query(request.query)
        const response: DeclarativeRepositoryWorkerResponse = {
          requestId: request.requestId,
          kind: 'repository.query.result',
          result,
        }
        options.endpoint.postMessage(cloneResponse(response))
        return
      }

      const result = await options.repository.mutate(request.mutation)
      const response: DeclarativeRepositoryWorkerResponse = {
        requestId: request.requestId,
        kind: 'repository.mutation.result',
        result,
      }
      options.endpoint.postMessage(cloneResponse(response))
    } catch (error) {
      options.endpoint.postMessage(cloneResponse(toWorkerErrorResponse(request.requestId, error)))
    }
  }

  options.endpoint.addEventListener('message', onMessage)

  return {
    destroy() {
      destroyed = true
      options.endpoint.removeEventListener('message', onMessage)
      unsubscribeNotifications?.()
    },
  }
}

export function createWorkerBackedDeclarativeRepository(
  options: CreateWorkerBackedDeclarativeRepositoryOptions,
): WorkerBackedDeclarativeRepository {
  const pending = new Map<string, PendingRequest>()
  const notifications = createNotificationFanout()
  const generateRequestId = options.generateRequestId ?? uuidv7

  const onMessage = (event: MessageEventLike) => {
    const validation = validateDeclarativeRepositoryWorkerResponse(event.data)
    if (validation.response == null) {
      return
    }

    const response = validation.response
    if (response.kind === 'repository.notification') {
      void notifications.publish(structuredClone(response.notification))
      return
    }

    const pendingRequest = pending.get(response.requestId)
    if (pendingRequest == null) {
      return
    }

    pending.delete(response.requestId)

    if (response.kind === 'repository.query.result' && pendingRequest.type === 'query') {
      pendingRequest.resolve(response.result)
      return
    }

    if (response.kind === 'repository.mutation.result' && pendingRequest.type === 'mutation') {
      pendingRequest.resolve(response.result)
      return
    }

    if (response.kind === 'repository.error') {
      pendingRequest.reject(
        new DeclarativeRepositoryWorkerClientError(
          response.error.code,
          response.error.message,
          response.error.retryable,
        ),
      )
      return
    }

    pendingRequest.reject(new Error(`Unexpected worker response kind "${response.kind}"`))
  }

  options.endpoint.addEventListener('message', onMessage)

  function sendRequest(request: DeclarativeRepositoryWorkerRequest): void {
    options.endpoint.postMessage(structuredClone(request))
  }

  return {
    query(query: DeclarativeRepositoryQuery): Promise<DeclarativeRepositoryQueryResult> {
      const requestId = generateRequestId()
      return new Promise((resolve, reject) => {
        pending.set(requestId, {
          type: 'query',
          resolve,
          reject,
        })
        sendRequest({
          requestId,
          kind: DECLARATIVE_REPOSITORY_QUERY_KIND,
          query,
        })
      })
    },
    mutate(mutation: DeclarativeRepositoryMutation): Promise<DeclarativeRepositoryMutationResult> {
      const requestId = generateRequestId()
      return new Promise((resolve, reject) => {
        pending.set(requestId, {
          type: 'mutation',
          resolve,
          reject,
        })
        sendRequest({
          requestId,
          kind: DECLARATIVE_REPOSITORY_MUTATION_KIND,
          mutation,
        })
      })
    },
    destroy() {
      options.endpoint.removeEventListener('message', onMessage)

      for (const [requestId, pendingRequest] of pending.entries()) {
        pendingRequest.reject(new Error(`Worker-backed repository destroyed while request "${requestId}" was pending`))
      }
      pending.clear()
    },
    getNotificationChannel() {
      return notifications
    },
  }
}
