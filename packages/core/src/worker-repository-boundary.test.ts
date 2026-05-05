import { describe, expect, it } from 'vitest'
import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  isDeclarativeDocumentNotification,
  isDeclarativeRepositoryWorkerRequest,
  isDeclarativeRepositoryWorkerResponse,
  validateDeclarativeDocumentNotification,
  validateDeclarativeRepositoryMutation,
  validateDeclarativeRepositoryQuery,
  validateDeclarativeRepositoryWorkerRequest,
  validateDeclarativeRepositoryWorkerResponse,
} from './index'

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
      tags: ['button'],
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

describe('worker repository boundary', () => {
  it('accepts a get-document repository query', () => {
    const result = validateDeclarativeRepositoryQuery({
      type: 'get-document',
      documentKind: 'page',
      id: 'pages.support.controls',
    })

    expect(result.errors).toEqual([])
    expect(result.query?.type).toBe('get-document')
  })

  it('rejects invalid list-document query metadata', () => {
    const result = validateDeclarativeRepositoryQuery({
      type: 'list-documents',
      documentKind: 'widget',
      scope: 'team',
      tags: ['forms', ''],
      limit: 0,
    })

    expect(result.errors.join(' ')).toContain('documentKind')
    expect(result.errors.join(' ')).toContain('scope')
    expect(result.errors.join(' ')).toContain('tags')
    expect(result.errors.join(' ')).toContain('limit')
  })

  it('accepts a put-document mutation with an explicit document payload', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'put-document',
      id: 'ui.element.button',
      documentKind: 'component-registry-entry',
      document: createRegistryEntry(),
      expectedRevision: 'rev-1',
    })

    expect(result.errors).toEqual([])
    expect(result.mutation?.type).toBe('put-document')
  })

  it('rejects invalid nested registry documents in put-document mutations', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'put-document',
      id: 'ui.element.button',
      documentKind: 'component-registry-entry',
      document: {
        id: 'ui.element.button',
      },
    })

    expect(result.errors.join(' ')).toContain('mutation.document.schemaVersion')
    expect(result.errors.join(' ')).toContain('mutation.document.kind')
    expect(result.errors.join(' ')).toContain('mutation.document.runtime')
  })

  it('rejects invalid nested page documents in put-document mutations', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'put-document',
      id: 'pages.invalid',
      documentKind: 'page',
      document: {
        schemaVersion: '0.2',
      },
    })

    expect(result.errors.join(' ')).toContain('mutation.document')
  })

  it('requires standalone page document identity in page mutations', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'put-document',
      id: 'pages.missing-identity',
      documentKind: 'page',
      document: {
        kind: 'page',
        root: {
          type: 'layout',
        },
      },
    })

    expect(result.errors.join(' ')).toContain('mutation.document.id')
  })

  it('requires app documents to declare kind: app in app mutations', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'put-document',
      id: 'apps.invalid',
      documentKind: 'app',
      document: {
        pages: {},
        routes: [],
      },
    })

    expect(result.errors.join(' ')).toContain('mutation.document.kind must equal app')
  })

  it('rejects invalid delete-document mutations', () => {
    const result = validateDeclarativeRepositoryMutation({
      type: 'delete-document',
      documentKind: 'widget',
      id: '',
      expectedRevision: '   ',
    })

    expect(result.errors.join(' ')).toContain('documentKind')
    expect(result.errors.join(' ')).toContain('id')
    expect(result.errors.join(' ')).toContain('expectedRevision')
  })

  it('accepts a valid worker query request', () => {
    const request = {
      requestId: 'req-1',
      kind: 'repository.query' as const,
      query: {
        type: 'list-documents' as const,
        documentKind: 'component-registry-entry' as const,
        scope: 'public' as const,
        tags: ['button'],
      },
    }

    const result = validateDeclarativeRepositoryWorkerRequest(request)

    expect(result.errors).toEqual([])
    expect(isDeclarativeRepositoryWorkerRequest(request)).toBe(true)
  })

  it('rejects invalid worker mutation requests', () => {
    const request = {
      requestId: '',
      kind: 'repository.mutation' as const,
      mutation: {
        type: 'put-document',
        id: 'page-1',
        documentKind: 'page',
        document: null,
      },
    }

    const result = validateDeclarativeRepositoryWorkerRequest(request)

    const joinedErrors = result.errors.join(' ')

    expect(joinedErrors).toContain('requestId')
    expect(joinedErrors).toContain('mutation.document')
    expect(joinedErrors).not.toContain('mutation.mutation.document')
    expect(isDeclarativeRepositoryWorkerRequest(request)).toBe(false)
  })

  it('accepts cross-tab notifications separately from repository transport', () => {
    const event = {
      type: 'document.changed' as const,
      documentKind: 'page' as const,
      id: 'pages.support.controls',
      revision: 'rev-2',
      source: 'external-tab' as const,
    }

    const result = validateDeclarativeDocumentNotification(event)

    expect(result.errors).toEqual([])
    expect(isDeclarativeDocumentNotification(event)).toBe(true)
  })

  it('accepts worker notification responses', () => {
    const response = {
      kind: 'repository.notification' as const,
      notification: {
        type: 'document.changed' as const,
        documentKind: 'page' as const,
        id: 'pages.support.controls',
        revision: 'rev-2',
        source: 'worker' as const,
      },
    }

    const result = validateDeclarativeRepositoryWorkerResponse(response)

    expect(result.errors).toEqual([])
    expect(isDeclarativeRepositoryWorkerResponse(response)).toBe(true)
  })

  it('rejects invalid worker notification responses', () => {
    const result = validateDeclarativeRepositoryWorkerResponse({
      kind: 'repository.notification',
      notification: {
        type: 'document.changed',
        source: 'worker',
      },
    })

    expect(result.errors.join(' ')).toContain('notification.documentKind')
    expect(result.errors.join(' ')).toContain('notification.id')
  })

  it('requires document identity for changed and deleted notifications', () => {
    const changed = validateDeclarativeDocumentNotification({
      type: 'document.changed',
      source: 'external-tab',
    })
    const deleted = validateDeclarativeDocumentNotification({
      type: 'document.deleted',
      source: 'worker',
    })

    expect(changed.errors.join(' ')).toContain('documentKind is required')
    expect(changed.errors.join(' ')).toContain('id is required')
    expect(deleted.errors.join(' ')).toContain('documentKind is required')
    expect(deleted.errors.join(' ')).toContain('id is required')
  })

  it('rejects invalid notifications', () => {
    const event = {
      type: 'document.refreshed',
      documentKind: 'widget',
      id: '',
      revision: '',
      source: 'broadcast',
    }

    const result = validateDeclarativeDocumentNotification(event)

    expect(result.errors.join(' ')).toContain('type')
    expect(result.errors.join(' ')).toContain('documentKind')
    expect(result.errors.join(' ')).toContain('id')
    expect(result.errors.join(' ')).toContain('revision')
    expect(result.errors.join(' ')).toContain('source')
    expect(isDeclarativeDocumentNotification(event)).toBe(false)
  })
})
