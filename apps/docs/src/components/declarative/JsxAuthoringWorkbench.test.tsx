import type {
  DeclarativeRepositoryDeleteDocumentResult,
  DeclarativeRepositoryDocumentRecord,
  DeclarativeRepositoryDocumentSummary,
  DeclarativeRepositoryGetDocumentResult,
  DeclarativeRepositoryListDocumentsResult,
  DeclarativeRepositoryWatchEvent,
  DeclarativeSyncConflict,
  JsxAuthoringWorkbenchRepository,
  PageDocument,
} from '@incmix/core'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createBackgroundSchedulerMock, initializeRepositoryMock } = vi.hoisted(() => ({
  createBackgroundSchedulerMock: vi.fn(),
  initializeRepositoryMock: vi.fn<() => Promise<JsxAuthoringWorkbenchRepository>>(),
}))

vi.mock('@uiw/react-codemirror', () => ({
  default: function MockCodeMirror({ value, onChange }: { value?: string; onChange?: (nextValue: string) => void }) {
    return (
      <textarea
        aria-label="Authoring code"
        value={value ?? ''}
        onChange={event => {
          onChange?.(event.currentTarget.value)
        }}
      />
    )
  },
}))

vi.mock('@incmix/core', async () => {
  const actual = await vi.importActual<typeof import('@incmix/core')>('@incmix/core')

  return {
    ...actual,
    createDeclarativeBackgroundSyncScheduler: createBackgroundSchedulerMock.mockImplementation(() => ({
      start: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      notifyLocalChange: vi.fn(),
    })),
    initializeJsxAuthoringWorkbenchRepository: initializeRepositoryMock,
  }
})

import { JsxAuthoringWorkbench } from './JsxAuthoringWorkbench'

const alphaDocument: PageDocument = {
  id: 'page.alpha',
  title: 'Alpha',
  kind: 'page',
  root: {
    type: 'Layout',
    props: {
      direction: 'vertical',
      gap: 12,
    },
    children: [
      {
        type: 'Button',
        props: {
          label: 'Alpha button',
          variant: 'outline',
        },
      },
    ],
  },
}

const betaDocument: PageDocument = {
  id: 'page.beta',
  title: 'Beta',
  kind: 'page',
  root: {
    type: 'Layout',
    props: {
      direction: 'vertical',
      gap: 16,
    },
    children: [
      {
        type: 'Button',
        props: {
          label: 'Beta button',
          variant: 'solid',
        },
      },
    ],
  },
}

function createRecord(document: PageDocument, revision: string): DeclarativeRepositoryDocumentRecord {
  return {
    documentKind: 'page',
    id: document.id,
    revision,
    updatedAt: '2026-04-11T12:00:00.000Z',
    document,
  }
}

function createSummary(document: PageDocument, revision: string): DeclarativeRepositoryDocumentSummary {
  return {
    documentKind: 'page',
    id: document.id,
    title: document.title,
    revision,
    updatedAt: '2026-04-11T12:00:00.000Z',
    tags: [],
  }
}

function createConflict(
  id: string,
  localRevision = 'rev_local',
  serverRevision = 'rev_remote',
): DeclarativeSyncConflict {
  return {
    reason: 'revision-mismatch',
    document: {
      documentKind: 'page',
      id,
      revision: localRevision,
    },
    serverRecord: {
      documentKind: 'page',
      id,
      revision: serverRevision,
      updatedAt: '2026-04-11T12:30:00.000Z',
      document: id === alphaDocument.id ? alphaDocument : betaDocument,
    },
    message: `Remote page "${id}" has advanced.`,
  }
}

function createRepository(options?: { syncConflicts?: DeclarativeSyncConflict[] }): JsxAuthoringWorkbenchRepository {
  const records = new Map<string, DeclarativeRepositoryDocumentRecord>([
    [alphaDocument.id, createRecord(alphaDocument, 'rev_alpha_1')],
    [betaDocument.id, createRecord(betaDocument, 'rev_beta_1')],
  ])

  const pageSummaries = [createSummary(alphaDocument, 'rev_alpha_1'), createSummary(betaDocument, 'rev_beta_1')]

  return {
    storageMode: 'memory',
    schemaVersion: 1,
    initializationNotice: null,
    record: records.get(alphaDocument.id)!,
    async loadDocument(id) {
      const record = records.get(id)
      if (record == null) {
        throw new Error(`Missing page "${id}"`)
      }
      return record
    },
    async listDocuments() {
      return pageSummaries
    },
    async createDocument(page) {
      return createRecord(page, 'rev_created')
    },
    async saveDocument(id, page) {
      const record = createRecord(
        {
          ...page,
          id,
        },
        'rev_saved',
      )
      records.set(id, record)
      return record
    },
    async deleteDocument(id) {
      records.delete(id)
      return {
        type: 'delete-document',
        deleted: true,
        documentKind: 'page',
        id,
        revision: 'rev_deleted',
      } satisfies DeclarativeRepositoryDeleteDocumentResult
    },
    async syncPages() {
      return {
        pushed: 0,
        pulled: 0,
        conflicts: options?.syncConflicts ?? [],
        hasMore: false,
      }
    },
    async watchDocument(id, listener) {
      const record = records.get(id)
      listener({
        reason: 'initial',
        source: 'same-tab',
        result:
          record == null
            ? ({
                type: 'get-document',
                found: false,
              } satisfies DeclarativeRepositoryGetDocumentResult)
            : ({
                type: 'get-document',
                found: true,
                record,
              } satisfies DeclarativeRepositoryGetDocumentResult),
      } as DeclarativeRepositoryWatchEvent<DeclarativeRepositoryGetDocumentResult>)
      return () => {}
    },
    async watchPages(listener) {
      listener({
        reason: 'initial',
        source: 'same-tab',
        result: {
          type: 'list-documents',
          items: pageSummaries,
        } satisfies DeclarativeRepositoryListDocumentsResult,
      } as DeclarativeRepositoryWatchEvent<DeclarativeRepositoryListDocumentsResult>)
      return () => {}
    },
    async destroy() {},
  }
}

function hasTextContent(text: string) {
  return (_content: string, node: Element | null) => node?.textContent?.replace(/\s+/g, ' ').trim() === text
}

describe('JsxAuthoringWorkbench', () => {
  beforeEach(() => {
    createBackgroundSchedulerMock.mockReset()
    initializeRepositoryMock.mockReset()
    createBackgroundSchedulerMock.mockImplementation(() => ({
      start: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      notifyLocalChange: vi.fn(),
    }))
  })

  afterEach(() => {
    cleanup()
  })

  it('clears sync conflict feedback after reloading the active page', async () => {
    initializeRepositoryMock.mockResolvedValue(
      createRepository({
        syncConflicts: [createConflict(alphaDocument.id)],
      }),
    )

    const user = userEvent.setup()
    render(<JsxAuthoringWorkbench />)

    await screen.findByText(/Editing page/i)
    await user.click(screen.getByRole('button', { name: 'Sync now' }))

    await screen.findByText(/including the active page "page\.alpha"/i)
    expect(screen.getByText(/The active page is stale against the remote revision/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reload saved' }))

    await waitFor(() => {
      expect(screen.queryByText(/including the active page "page\.alpha"/i)).not.toBeInTheDocument()
    })
    expect(screen.queryByText(/The active page is stale against the remote revision/i)).not.toBeInTheDocument()
  })

  it('clears previous sync feedback when switching pages', async () => {
    initializeRepositoryMock.mockResolvedValue(
      createRepository({
        syncConflicts: [createConflict(alphaDocument.id)],
      }),
    )

    const user = userEvent.setup()
    render(<JsxAuthoringWorkbench />)

    await screen.findByText(/Editing page/i)
    await user.click(screen.getByRole('button', { name: 'Sync now' }))
    await screen.findByText(/including the active page "page\.alpha"/i)

    await user.click(screen.getByRole('button', { name: /Beta/i }))

    await screen.findByText(hasTextContent('Editing page page.beta.'))
    await waitFor(() => {
      expect(screen.queryByText(/including the active page "page\.alpha"/i)).not.toBeInTheDocument()
    })
  })

  it('shows passive background sync status without using the manual sync banner', async () => {
    let runSync: ((reason: 'local-change' | 'online' | 'visibility') => Promise<void>) | null = null
    createBackgroundSchedulerMock.mockImplementation(options => {
      runSync = options.runSync
      return {
        start: vi.fn().mockResolvedValue(undefined),
        destroy: vi.fn(),
        notifyLocalChange: vi.fn(),
      }
    })
    initializeRepositoryMock.mockResolvedValue(createRepository())

    render(<JsxAuthoringWorkbench />)

    await screen.findByText(/Editing page/i)
    expect(screen.getByText('Auto sync active')).toBeInTheDocument()
    expect(screen.queryByText(/Last sync /i)).not.toBeInTheDocument()

    expect(runSync).toBeTypeOf('function')
    await runSync!('visibility')

    await screen.findByText(/Auto sync after page visibility completed/i)
    expect(screen.getByText(/Auto sync is active and the local repository is caught up\./i)).toBeInTheDocument()
    expect(screen.queryByText(/Last sync /i)).not.toBeInTheDocument()
  })
})
