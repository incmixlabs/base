'use client'

import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  createDeclarativeBackgroundSyncScheduler,
  type DeclarativeBackgroundSyncReason,
  type DeclarativeRepositoryDocumentSummary,
  type DeclarativeRepositoryNotificationSource,
  DeclarativeRepositoryWorkerClientError,
  DeclarativeSyncAdapterError,
  initializeJsxAuthoringWorkbenchRepository,
  JsxAuthoringWorkbenchPageNotFoundError,
  type JsxAuthoringWorkbenchRepository,
  type JsxAuthoringWorkbenchSyncResult,
  normalizePageDocument,
  type PageDocument,
} from '@incmix/core'
import {
  compileDeclarativeJsxToPage,
  DeclarativeJsxAuthoringError,
  projectDeclarativePageToJsx,
} from '@incmix/ui/declarative/jsx-authoring'
import { DeclarativePageRenderer, type DeclarativeRendererRegistry } from '@incmix/ui/declarative/renderer'
import { createDeclarativePageActor } from '@incmix/ui/declarative/runtime'
import {
  codePaneEditorFrameClassName,
  codePaneFrameClassName,
  codePaneLabelClassName,
  codePaneShellClassName,
} from '@incmix/ui/editor'
import { type JsonValue, JsonViewEditor } from '@incmix/ui/editor/autoform'
import { type ViewportPreset, ViewportPreview, ViewportPreviewControls } from '@incmix/ui/editor/docs'
import { Badge, Button, Callout, Card } from '@incmix/ui/elements'
import { Slider } from '@incmix/ui/form'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import * as React from 'react'

const initialAuthoringCode = `<Layout direction="vertical" gap={12}>
  <Template template="Support Controls" />
  <Button label="Review Queue" variant="outline" />
  <Slider defaultValue={[20, 80]} />
</Layout>`

const authoringComponents: DeclarativeRendererRegistry = {
  Button: ({ node, enabled, triggerAction }) => {
    const { component: _component, label, ...rest } = (node.props ?? {}) as Record<string, unknown>

    return (
      <Button
        {...rest}
        disabled={!enabled || rest.disabled === true}
        onClick={event => {
          if (typeof rest.onClick === 'function') return
          triggerAction('click', event)
        }}
      >
        {typeof label === 'string' ? label : 'Button'}
      </Button>
    )
  },
  Slider: ({ node, enabled }) => {
    const { component: _component, ...rest } = (node.props ?? {}) as Record<string, unknown>
    return <Slider {...rest} disabled={!enabled || rest.disabled === true} />
  },
}

type CompileState = {
  pageDocument: PageDocument
  normalizedPage: ReturnType<typeof normalizePageDocument>
  projectedJsx: string
  jsonValue: JsonValue
}

type PendingRepositoryChange = {
  source: DeclarativeRepositoryNotificationSource
  revision: string | null
}

type RepositoryFeedback =
  | {
      kind: 'error'
      message: string
    }
  | {
      kind: 'conflict'
      message: string
    }

type SyncFeedback =
  | {
      kind: 'success'
      message: string
      timestamp: string
      pushed: number
      pulled: number
      hasMore: boolean
    }
  | {
      kind: 'conflict'
      message: string
      timestamp: string
      conflictCount: number
      firstConflictId: string
      activeConflictId?: string
      hasMore: boolean
    }
  | {
      kind: 'error'
      message: string
      timestamp: string
      code?: string
      retryable?: boolean
      retryAfterMs?: number
    }

type AuthoringViewMode = 'preview' | 'code' | 'projected'
type SyncRunContext = { kind: 'manual' } | { kind: 'background'; trigger: DeclarativeBackgroundSyncReason }
type BackgroundSyncFeedback =
  | {
      kind: 'syncing'
      timestamp: string
      trigger: DeclarativeBackgroundSyncReason
      message: string
    }
  | ({ trigger: DeclarativeBackgroundSyncReason } & SyncFeedback)

const CodeMirror = React.lazy(() => import('@uiw/react-codemirror'))

function formatAuthoringError(error: DeclarativeJsxAuthoringError | null): string | null {
  if (!error) return null
  if (error.location) {
    return `${error.message} (line ${error.location.line}, column ${error.location.column})`
  }

  return error.message
}

function normalizeSourceForComparison(value: string): string {
  return value
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

function buildCompileState(pageDocument: PageDocument): CompileState {
  return {
    pageDocument,
    normalizedPage: normalizePageDocument(pageDocument),
    projectedJsx: projectDeclarativePageToJsx(pageDocument),
    jsonValue: pageDocument as JsonValue,
  }
}

const initialCompileState = buildCompileState(compileDeclarativeJsxToPage(initialAuthoringCode).page)

function slugifyPageId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

function buildPageDraft(basePage: PageDocument, id: string, title: string): PageDocument {
  return {
    ...(structuredClone(basePage) as PageDocument),
    id,
    title,
  }
}

function confirmDiscardLocalEdits(message: string): boolean {
  return typeof window === 'undefined' || window.confirm(message)
}

function isMissingPageError(error: unknown, id: string): boolean {
  return error instanceof JsxAuthoringWorkbenchPageNotFoundError && error.id === id
}

function formatSyncTimestamp(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatRetryAfter(retryAfterMs: number): string {
  if (retryAfterMs < 1_000) {
    return `${retryAfterMs}ms`
  }

  const seconds = Math.ceil(retryAfterMs / 1_000)
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.ceil(seconds / 60)
  return `${minutes}m`
}

function formatBackgroundSyncTrigger(trigger: DeclarativeBackgroundSyncReason): string {
  switch (trigger) {
    case 'local-change':
      return 'local changes'
    case 'online':
      return 'network recovery'
    case 'visibility':
      return 'page visibility'
    default: {
      const exhaustive: never = trigger
      return exhaustive
    }
  }
}

function buildSyncErrorFeedback(error: unknown): Extract<SyncFeedback, { kind: 'error' }> {
  const timestamp = new Date().toISOString()

  if (error instanceof DeclarativeSyncAdapterError) {
    const retryableHint =
      error.retryAfterMs != null
        ? ` Retry after about ${formatRetryAfter(error.retryAfterMs)}.`
        : error.retryable
          ? ' Retry is safe.'
          : ''

    const message =
      error.code === 'auth'
        ? `Sync could not authenticate with the remote source.${retryableHint}`
        : error.code === 'rate-limited'
          ? `Sync was rate limited by the remote source.${retryableHint}`
          : error.code === 'transient'
            ? `Sync hit a transient remote failure.${retryableHint}`
            : error.code === 'fatal'
              ? `Sync failed with a non-retryable remote error: ${error.message}`
              : error.code === 'invalid-cursor'
                ? `Sync cursor is invalid. Resync may be required.${retryableHint}`
                : error.code === 'invalid-request'
                  ? `Sync request was rejected by the remote source.${retryableHint}`
                  : error.message

    return {
      kind: 'error',
      timestamp,
      message,
      code: error.code,
      retryable: error.retryable,
      retryAfterMs: error.retryAfterMs,
    }
  }

  return {
    kind: 'error',
    timestamp,
    message: error instanceof Error ? error.message : 'Failed to sync persisted pages',
  }
}

function AuthoringModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button size="sm" variant={active ? 'solid' : 'ghost'} aria-pressed={active} onClick={onClick}>
      {children}
    </Button>
  )
}

export function JsxAuthoringWorkbench() {
  const [code, setCode] = React.useState<string | null>(null)
  const [viewportPreset, setViewportPreset] = React.useState<ViewportPreset>('desktop')
  const [authoringViewMode, setAuthoringViewMode] = React.useState<AuthoringViewMode>('code')
  const [activePageId, setActivePageId] = React.useState<string | null>(null)
  const [repository, setRepository] = React.useState<JsxAuthoringWorkbenchRepository | null>(null)
  const [repositoryStatus, setRepositoryStatus] = React.useState<'loading' | 'ready' | 'error'>('loading')
  const [repositoryFeedback, setRepositoryFeedback] = React.useState<RepositoryFeedback | null>(null)
  const [storageMode, setStorageMode] = React.useState<'memory' | 'opfs' | 'remote-only' | null>(null)
  const [schemaVersion, setSchemaVersion] = React.useState<number | null>(null)
  const [initializationNotice, setInitializationNotice] =
    React.useState<JsxAuthoringWorkbenchRepository['initializationNotice']>(null)
  const [savedRevision, setSavedRevision] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isReloading, setIsReloading] = React.useState(false)
  const [syncRunContext, setSyncRunContext] = React.useState<SyncRunContext | null>(null)
  const [isMutatingPages, setIsMutatingPages] = React.useState(false)
  const [pendingRepositoryChange, setPendingRepositoryChange] = React.useState<PendingRepositoryChange | null>(null)
  const [syncFeedback, setSyncFeedback] = React.useState<SyncFeedback | null>(null)
  const [backgroundSyncFeedback, setBackgroundSyncFeedback] = React.useState<BackgroundSyncFeedback | null>(null)
  const [pageSummaries, setPageSummaries] = React.useState<DeclarativeRepositoryDocumentSummary[]>([])
  const [isLoadingPageSummaries, setIsLoadingPageSummaries] = React.useState(true)
  const compilation = React.useMemo(() => {
    if (code == null) {
      return {
        error: null,
        value: null,
      }
    }

    try {
      const result = compileDeclarativeJsxToPage(code)
      return {
        error: null,
        value: buildCompileState(result.page),
      }
    } catch (error) {
      return {
        error: error instanceof DeclarativeJsxAuthoringError ? error : new DeclarativeJsxAuthoringError(String(error)),
        value: null,
      }
    }
  }, [code])

  const [lastValid, setLastValid] = React.useState<CompileState | null>(null)
  const activePageIdRef = React.useRef<string | null>(null)
  const pageSummaryCountRef = React.useRef(0)
  const repositoryRef = React.useRef<JsxAuthoringWorkbenchRepository | null>(null)
  const savedRevisionRef = React.useRef<string | null>(null)
  const hasProjectionDiffRef = React.useRef(false)
  const isRepositoryBusyRef = React.useRef(false)
  const syncWithRemoteRef = React.useRef<(context?: SyncRunContext) => Promise<void>>(async () => {})

  React.useEffect(() => {
    let cancelled = false
    let activeRepository: JsxAuthoringWorkbenchRepository | null = null

    void (async () => {
      try {
        setRepositoryStatus('loading')
        setRepositoryFeedback(null)
        const syncEnvironment = (
          import.meta as ImportMeta & {
            env?: {
              VITE_DECLARATIVE_SYNC_BASE_URL?: string
              VITE_DECLARATIVE_SYNC_TENANT_ID?: string
              VITE_DECLARATIVE_SYNC_ACTOR_ID?: string
            }
          }
        ).env
        const nextRepository = await initializeJsxAuthoringWorkbenchRepository(initialCompileState.pageDocument, {
          syncEnvironment,
        })
        if (cancelled) {
          await nextRepository.destroy()
          return
        }

        activeRepository = nextRepository
        const loadedState = buildCompileState(nextRepository.record.document as PageDocument)
        setRepository(nextRepository)
        setStorageMode(nextRepository.storageMode)
        setSchemaVersion(nextRepository.schemaVersion)
        setInitializationNotice(nextRepository.initializationNotice)
        activePageIdRef.current = nextRepository.record.id
        setActivePageId(nextRepository.record.id)
        savedRevisionRef.current = nextRepository.record.revision
        setSavedRevision(nextRepository.record.revision)
        setCode(loadedState.projectedJsx)
        setLastValid(loadedState)
        setRepositoryStatus('ready')
      } catch (error) {
        if (cancelled) {
          return
        }

        setRepositoryStatus('error')
        setIsLoadingPageSummaries(false)
        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to initialize repository-backed authoring',
        })
      }
    })()

    return () => {
      cancelled = true
      setRepository(null)
      void activeRepository?.destroy()
    }
  }, [])

  React.useEffect(() => {
    activePageIdRef.current = activePageId
  }, [activePageId])

  React.useEffect(() => {
    repositoryRef.current = repository
  }, [repository])

  React.useEffect(() => {
    pageSummaryCountRef.current = pageSummaries.length
  }, [pageSummaries.length])

  React.useEffect(() => {
    savedRevisionRef.current = savedRevision
  }, [savedRevision])

  React.useEffect(() => {
    if (compilation.value) {
      setLastValid(compilation.value)
    }
  }, [compilation.value])

  const hasProjectionDiff = React.useMemo(
    () =>
      code != null &&
      lastValid != null &&
      normalizeSourceForComparison(code) !== normalizeSourceForComparison(lastValid.projectedJsx),
    [code, lastValid],
  )
  React.useEffect(() => {
    hasProjectionDiffRef.current = hasProjectionDiff
  }, [hasProjectionDiff])

  React.useEffect(() => {
    if (!hasProjectionDiff && authoringViewMode === 'projected') {
      setAuthoringViewMode('code')
    }
  }, [authoringViewMode, hasProjectionDiff])

  const actorRef = React.useMemo(() => {
    if (!lastValid) return null
    return createDeclarativePageActor({
      page: lastValid.normalizedPage,
      context: {},
    })
  }, [lastValid])

  React.useEffect(() => {
    if (!actorRef) return
    actorRef.start()
    return () => {
      actorRef.stop()
    }
  }, [actorRef])

  const isSyncing = syncRunContext != null
  const isRepositoryBusy = isSaving || isReloading || isSyncing || isMutatingPages
  React.useEffect(() => {
    isRepositoryBusyRef.current = isRepositoryBusy
  }, [isRepositoryBusy])

  const clearActivePageState = React.useCallback((feedback?: RepositoryFeedback | null) => {
    activePageIdRef.current = null
    savedRevisionRef.current = null
    setActivePageId(null)
    setSavedRevision(null)
    setCode(null)
    setLastValid(null)
    setPendingRepositoryChange(null)
    setSyncFeedback(null)
    setRepositoryFeedback(feedback ?? null)
  }, [])

  const applyLoadedPageRecord = React.useCallback((record: JsxAuthoringWorkbenchRepository['record']) => {
    const nextState = buildCompileState(record.document as PageDocument)
    activePageIdRef.current = record.id
    setActivePageId(record.id)
    savedRevisionRef.current = record.revision
    setSavedRevision(record.revision)
    setCode(nextState.projectedJsx)
    setLastValid(nextState)
  }, [])

  const recoverMissingActivePage = React.useCallback(
    async ({
      missingPageId,
      showReloading = false,
      clearPendingChange = true,
    }: {
      missingPageId: string
      showReloading?: boolean
      clearPendingChange?: boolean
    }) => {
      const activeRepository = repositoryRef.current
      if (activeRepository == null) {
        return
      }

      if (showReloading) {
        setIsReloading(true)
      }

      try {
        const summaries = await activeRepository.listDocuments()
        setPageSummaries(summaries)
        setIsLoadingPageSummaries(false)
        const fallbackPageId = summaries.find(summary => summary.id !== missingPageId)?.id ?? summaries[0]?.id ?? null

        if (fallbackPageId == null) {
          clearActivePageState({
            kind: 'error',
            message: `Page "${missingPageId}" is no longer available. Create a new persisted page to continue.`,
          })
          return
        }

        const fallbackRecord = await activeRepository.loadDocument(fallbackPageId)
        applyLoadedPageRecord(fallbackRecord)
        if (clearPendingChange) {
          setPendingRepositoryChange(null)
        }
        setSyncFeedback(null)
        setRepositoryFeedback({
          kind: 'error',
          message: `Page "${missingPageId}" is no longer available. Switched to "${fallbackPageId}".`,
        })
      } catch (error) {
        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to recover missing persisted page',
        })
      } finally {
        if (showReloading) {
          setIsReloading(false)
        }
      }
    },
    [applyLoadedPageRecord, clearActivePageState],
  )

  const syncFromRepository = React.useCallback(
    async ({
      showReloading = false,
      clearPendingChange = false,
      pageId = activePageIdRef.current,
    }: {
      showReloading?: boolean
      clearPendingChange?: boolean
      pageId?: string | null
    } = {}) => {
      const activeRepository = repositoryRef.current
      if (activeRepository == null || pageId == null) {
        return
      }

      if (showReloading) {
        setIsReloading(true)
      }
      setRepositoryFeedback(null)

      try {
        const record = await activeRepository.loadDocument(pageId)
        applyLoadedPageRecord(record)
        if (clearPendingChange) {
          setPendingRepositoryChange(null)
        }
      } catch (error) {
        if (pageId != null && isMissingPageError(error, pageId)) {
          await recoverMissingActivePage({
            missingPageId: pageId,
            showReloading,
            clearPendingChange,
          })
          return
        }

        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to reload persisted document',
        })
      } finally {
        if (showReloading) {
          setIsReloading(false)
        }
      }
    },
    [applyLoadedPageRecord, recoverMissingActivePage],
  )

  React.useEffect(() => {
    if (repository == null || activePageId == null) {
      return
    }

    let active = true
    let unsubscribe = () => {}

    void (async () => {
      try {
        const watchedPageId = activePageId
        const nextUnsubscribe = await repository.watchDocument(watchedPageId, event => {
          if (!active || activePageIdRef.current !== watchedPageId) {
            return
          }

          const nextRevision =
            event.result.type === 'get-document' && event.result.found ? (event.result.record?.revision ?? null) : null
          const currentSavedRevision = savedRevisionRef.current
          const shouldIgnoreInitialEvent =
            event.reason === 'initial' &&
            ((nextRevision != null && nextRevision === currentSavedRevision) ||
              (nextRevision == null && currentSavedRevision == null))

          if (shouldIgnoreInitialEvent) {
            return
          }

          if (nextRevision != null && nextRevision === savedRevisionRef.current) {
            return
          }

          if (event.reason === 'deleted') {
            if (isRepositoryBusyRef.current || hasProjectionDiffRef.current) {
              setPendingRepositoryChange({
                source: event.source,
                revision: nextRevision,
              })
              setRepositoryFeedback({
                kind: 'error',
                message: 'The active persisted page was deleted. Resolve or discard local edits to recover.',
              })
              return
            }

            void recoverMissingActivePage({
              missingPageId: watchedPageId,
              clearPendingChange: true,
            })
            return
          }

          if (isRepositoryBusyRef.current || hasProjectionDiffRef.current) {
            setPendingRepositoryChange({
              source: event.source,
              revision: nextRevision,
            })
            return
          }

          void syncFromRepository({
            clearPendingChange: true,
            pageId: watchedPageId,
          })
        })

        if (!active) {
          nextUnsubscribe()
          return
        }

        unsubscribe = nextUnsubscribe
      } catch (error) {
        if (!active) {
          return
        }

        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to watch persisted document updates',
        })
      }
    })()

    return () => {
      active = false
      unsubscribe()
    }
  }, [activePageId, recoverMissingActivePage, repository, syncFromRepository])

  React.useEffect(() => {
    if (repository == null) {
      return
    }

    let active = true
    let unsubscribe = () => {}
    setIsLoadingPageSummaries(true)

    void (async () => {
      try {
        const nextUnsubscribe = await repository.watchPages(event => {
          if (!active) {
            return
          }

          setPageSummaries(event.result.items)
          setIsLoadingPageSummaries(false)
        })

        if (!active) {
          nextUnsubscribe()
          return
        }

        unsubscribe = nextUnsubscribe
      } catch (error) {
        if (!active) {
          return
        }

        setIsLoadingPageSummaries(false)
        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to watch persisted page summaries',
        })
      }
    })()

    return () => {
      active = false
      unsubscribe()
    }
  }, [repository])

  React.useEffect(() => {
    if (pendingRepositoryChange == null || isRepositoryBusy || hasProjectionDiff) {
      return
    }

    void syncFromRepository({
      clearPendingChange: true,
    })
  }, [hasProjectionDiff, isRepositoryBusy, pendingRepositoryChange, syncFromRepository])

  React.useEffect(() => {
    if (repository == null || isLoadingPageSummaries) {
      return
    }

    if (activePageId == null) {
      if (pageSummaries.length === 0 || isRepositoryBusy || hasProjectionDiff) {
        return
      }

      void syncFromRepository({
        clearPendingChange: true,
        pageId: pageSummaries[0]?.id ?? null,
      })
      return
    }

    if (pageSummaries.some(summary => summary.id === activePageId)) {
      return
    }

    if (isRepositoryBusy || hasProjectionDiff) {
      setRepositoryFeedback({
        kind: 'error',
        message: `Page "${activePageId}" is no longer available. Resolve or discard local edits to recover.`,
      })
      return
    }

    void recoverMissingActivePage({
      missingPageId: activePageId,
      clearPendingChange: true,
    })
  }, [
    activePageId,
    hasProjectionDiff,
    isLoadingPageSummaries,
    isRepositoryBusy,
    pageSummaries,
    recoverMissingActivePage,
    repository,
    syncFromRepository,
  ])

  async function reloadFromRepository() {
    if (repository == null || activePageId == null || isRepositoryBusy) {
      return
    }
    setSyncFeedback(null)
    await syncFromRepository({
      showReloading: true,
      clearPendingChange: true,
      pageId: activePageId,
    })
  }

  async function switchActivePage(nextPageId: string) {
    if (repository == null || isRepositoryBusy || nextPageId === activePageId) {
      return
    }

    if (
      hasProjectionDiff &&
      typeof window !== 'undefined' &&
      !window.confirm('Discard local edits and switch to another persisted page?')
    ) {
      return
    }

    setSyncFeedback(null)
    await syncFromRepository({
      showReloading: true,
      clearPendingChange: true,
      pageId: nextPageId,
    })
  }

  async function saveToRepository() {
    if (repository == null || activePageId == null || compilation.value == null || isRepositoryBusy) {
      return
    }

    setIsSaving(true)
    setSyncFeedback(null)
    setRepositoryFeedback(null)

    try {
      const record = await repository.saveDocument(
        activePageId,
        compilation.value.pageDocument,
        savedRevision ?? undefined,
      )
      savedRevisionRef.current = record.revision
      setSavedRevision(record.revision)
      setLastValid(buildCompileState(record.document as PageDocument))
      setPendingRepositoryChange(null)
      backgroundSyncSchedulerRef.current?.notifyLocalChange()
    } catch (error) {
      if (error instanceof DeclarativeRepositoryWorkerClientError && error.code === 'conflict') {
        setRepositoryFeedback({
          kind: 'conflict',
          message:
            'This document changed in the repository before your save completed. Reload the latest revision, then re-apply or compare your edits.',
        })
      } else {
        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to save declarative page document',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  function formatSyncResultMessage(result: JsxAuthoringWorkbenchSyncResult): string {
    const parts = [`Pushed ${result.pushed} change${result.pushed === 1 ? '' : 's'}`]
    parts.push(`pulled ${result.pulled} change${result.pulled === 1 ? '' : 's'}`)
    if (result.hasMore) {
      parts.push('more remote changes remain')
    }
    return `${parts.join(', ')}.`
  }

  const syncWithRemote = React.useCallback(
    async (context: SyncRunContext = { kind: 'manual' }) => {
      if (repository == null || isRepositoryBusy) {
        return
      }

      if (hasProjectionDiff) {
        if (context.kind === 'manual') {
          setSyncFeedback({
            kind: 'error',
            timestamp: new Date().toISOString(),
            message: 'Save or discard local JSX edits before syncing the persisted repository state.',
          })
        }
        return
      }

      const timestamp = new Date().toISOString()
      setSyncRunContext(context)
      if (context.kind === 'manual') {
        setSyncFeedback(null)
        setPendingRepositoryChange(null)
      } else {
        setBackgroundSyncFeedback({
          kind: 'syncing',
          timestamp,
          trigger: context.trigger,
          message: `Background sync is running after ${formatBackgroundSyncTrigger(context.trigger)}.`,
        })
      }

      try {
        const result = await repository.syncPages()
        const syncTimestamp = new Date().toISOString()
        const activeConflictId = activePageIdRef.current
        const activeConflict =
          activeConflictId == null ? null : result.conflicts.find(conflict => conflict.document.id === activeConflictId)
        if (result.conflicts.length > 0) {
          const firstConflict = result.conflicts[0]
          if (!firstConflict) {
            throw new Error('Sync reported conflicts but no conflict entry payload was provided')
          }
          if (activeConflict != null) {
            setRepositoryFeedback({
              kind: 'conflict',
              message: `The active page "${activeConflict.document.id}" conflicted with the remote revision during sync. Reload the latest persisted revision before saving or syncing again.`,
            })
          } else {
            setRepositoryFeedback(null)
          }
          const conflictFeedback: Extract<SyncFeedback, { kind: 'conflict' }> = {
            kind: 'conflict',
            timestamp: syncTimestamp,
            conflictCount: result.conflicts.length,
            firstConflictId: firstConflict.document.id,
            activeConflictId: activeConflict?.document.id,
            hasMore: result.hasMore,
            message:
              activeConflict != null
                ? `Sync found ${result.conflicts.length} conflict${result.conflicts.length === 1 ? '' : 's'}, including the active page "${activeConflict.document.id}"${result.hasMore ? ', and more remote changes remain to be pulled' : ''}.`
                : `Sync found ${result.conflicts.length} conflict${result.conflicts.length === 1 ? '' : 's'} starting with "${firstConflict.document.id}"${result.hasMore ? ', and more remote changes remain to be pulled' : ''}.`,
          }
          if (context.kind === 'manual') {
            setSyncFeedback(conflictFeedback)
          } else {
            setBackgroundSyncFeedback({
              ...conflictFeedback,
              trigger: context.trigger,
            })
          }
        } else {
          setRepositoryFeedback(null)
          const successFeedback: Extract<SyncFeedback, { kind: 'success' }> = {
            kind: 'success',
            timestamp: syncTimestamp,
            pushed: result.pushed,
            pulled: result.pulled,
            hasMore: result.hasMore,
            message: formatSyncResultMessage(result),
          }
          if (context.kind === 'manual') {
            setSyncFeedback(successFeedback)
          } else {
            setBackgroundSyncFeedback({
              ...successFeedback,
              trigger: context.trigger,
            })
          }
        }
      } catch (error) {
        if (context.kind === 'manual') {
          setSyncFeedback(buildSyncErrorFeedback(error))
        } else {
          setBackgroundSyncFeedback({
            ...buildSyncErrorFeedback(error),
            trigger: context.trigger,
          })
        }
      } finally {
        setSyncRunContext(null)
      }
    },
    [hasProjectionDiff, isRepositoryBusy, repository],
  )

  React.useEffect(() => {
    syncWithRemoteRef.current = syncWithRemote
  }, [syncWithRemote])

  async function createPage() {
    if (repository == null || isRepositoryBusy) {
      return
    }

    if (hasProjectionDiff && !confirmDiscardLocalEdits('Discard local edits and create a new persisted page?')) {
      return
    }

    const suggestedId = `page.${pageSummaries.length + 1}`
    const nextIdInput =
      typeof window === 'undefined' ? null : (window.prompt('New persisted page id', suggestedId) ?? null)
    const nextId = nextIdInput == null ? null : slugifyPageId(nextIdInput)
    if (nextId == null || nextId.length === 0) {
      return
    }
    if (pageSummaries.some(summary => summary.id === nextId)) {
      setRepositoryFeedback({
        kind: 'error',
        message: `Page "${nextId}" already exists. Choose a different id.`,
      })
      return
    }

    const nextTitle =
      typeof window === 'undefined' ? null : (window.prompt('New persisted page title', 'Untitled Page') ?? null)
    if (nextTitle == null || nextTitle.trim().length === 0) {
      return
    }

    setIsMutatingPages(true)
    setSyncFeedback(null)
    setRepositoryFeedback(null)

    try {
      const record = await repository.createDocument(
        buildPageDraft(initialCompileState.pageDocument, nextId, nextTitle.trim()),
      )
      applyLoadedPageRecord(record)
      setPendingRepositoryChange(null)
      backgroundSyncSchedulerRef.current?.notifyLocalChange()
    } catch (error) {
      setRepositoryFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Failed to create persisted page',
      })
    } finally {
      setIsMutatingPages(false)
    }
  }

  async function duplicatePage() {
    if (repository == null || activePageId == null || lastValid == null || isRepositoryBusy) {
      return
    }

    if (
      hasProjectionDiff &&
      !confirmDiscardLocalEdits('Discard local edits and duplicate the current persisted page?')
    ) {
      return
    }

    const suggestedId = `${activePageId}.copy`
    const nextIdInput =
      typeof window === 'undefined' ? null : (window.prompt('Duplicate persisted page as id', suggestedId) ?? null)
    const nextId = nextIdInput == null ? null : slugifyPageId(nextIdInput)
    if (nextId == null || nextId.length === 0 || nextId === activePageId) {
      return
    }
    if (pageSummaries.some(summary => summary.id === nextId)) {
      setRepositoryFeedback({
        kind: 'error',
        message: `Page "${nextId}" already exists. Choose a different id.`,
      })
      return
    }

    const defaultTitle =
      lastValid.pageDocument.title != null ? `${lastValid.pageDocument.title} Copy` : 'Untitled Page Copy'
    const nextTitle =
      typeof window === 'undefined' ? null : (window.prompt('Duplicate persisted page title', defaultTitle) ?? null)
    if (nextTitle == null || nextTitle.trim().length === 0) {
      return
    }

    setIsMutatingPages(true)
    setSyncFeedback(null)
    setRepositoryFeedback(null)

    try {
      const record = await repository.createDocument(buildPageDraft(lastValid.pageDocument, nextId, nextTitle.trim()))
      applyLoadedPageRecord(record)
      setPendingRepositoryChange(null)
      backgroundSyncSchedulerRef.current?.notifyLocalChange()
    } catch (error) {
      setRepositoryFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Failed to duplicate persisted page',
      })
    } finally {
      setIsMutatingPages(false)
    }
  }

  async function deletePage() {
    if (repository == null || activePageId == null || isRepositoryBusy) {
      return
    }

    if (
      !confirmDiscardLocalEdits(
        `Delete persisted page "${activePageId}"? This removes the saved document and discards unsaved local edits.`,
      )
    ) {
      return
    }

    setIsMutatingPages(true)
    setSyncFeedback(null)
    setRepositoryFeedback(null)

    try {
      await repository.deleteDocument(activePageId, savedRevision ?? undefined)
      backgroundSyncSchedulerRef.current?.notifyLocalChange()
      const remainingPages = await repository.listDocuments()
      setPageSummaries(remainingPages)
      const fallbackPageId = remainingPages.find(summary => summary.id !== activePageId)?.id ?? null

      if (fallbackPageId == null) {
        clearActivePageState({
          kind: 'error',
          message: `Page "${activePageId}" was deleted. Create a new persisted page to continue.`,
        })
      } else {
        await syncFromRepository({
          showReloading: true,
          clearPendingChange: true,
          pageId: fallbackPageId,
        })
      }
    } catch (error) {
      if (error instanceof DeclarativeRepositoryWorkerClientError && error.code === 'conflict') {
        setRepositoryFeedback({
          kind: 'conflict',
          message:
            'This page changed in the repository before delete completed. Reload the latest revision before deleting it.',
        })
      } else {
        setRepositoryFeedback({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Failed to delete persisted page',
        })
      }
    } finally {
      setIsMutatingPages(false)
    }
  }

  const isInitialLoadPending =
    repositoryStatus === 'loading' && activePageId != null && (code == null || lastValid == null)
  const compileErrorMessage = formatAuthoringError(compilation.error)
  const isRepositoryStale = pendingRepositoryChange != null || repositoryFeedback?.kind === 'conflict'
  const isEmptyPageState = repositoryStatus === 'ready' && activePageId == null
  const canSyncNow =
    repositoryStatus === 'ready' &&
    !isRepositoryBusy &&
    !hasProjectionDiff &&
    (activePageId != null || pageSummaries.length > 0)
  const pendingRepositoryChangeMessage = React.useMemo(() => {
    if (pendingRepositoryChange == null) {
      return null
    }

    const sourceLabel =
      pendingRepositoryChange.source === 'external-tab'
        ? 'another tab'
        : pendingRepositoryChange.source === 'same-tab'
          ? 'this tab'
          : 'the repository'

    return hasProjectionDiff
      ? `A newer repository revision is available from ${sourceLabel}. Reload to discard local edits or save to resolve against the latest revision.`
      : `A repository update from ${sourceLabel} is pending. Reload to refresh this workbench.`
  }, [hasProjectionDiff, pendingRepositoryChange])
  const savedStateLabel = React.useMemo(() => {
    if (savedRevision == null) {
      return 'No saved revision'
    }

    if (isSaving) {
      return `Saving revision ${savedRevision}…`
    }

    if (isRepositoryStale) {
      return `Saved revision ${savedRevision}, newer repository change pending`
    }

    if (hasProjectionDiff) {
      return `Editing from revision ${savedRevision}`
    }

    return `Synced to revision ${savedRevision}`
  }, [hasProjectionDiff, isRepositoryStale, isSaving, savedRevision])
  const syncStatusSummary = React.useMemo(() => {
    if (syncFeedback == null) {
      return null
    }

    const syncedAt = formatSyncTimestamp(syncFeedback.timestamp)
    if (syncFeedback.kind === 'success') {
      return `Last sync ${syncedAt}: pushed ${syncFeedback.pushed}, pulled ${syncFeedback.pulled}${syncFeedback.hasMore ? ', more remote changes remain' : ''}.`
    }

    if (syncFeedback.kind === 'conflict') {
      return `Last sync ${syncedAt}: ${syncFeedback.conflictCount} conflict${syncFeedback.conflictCount === 1 ? '' : 's'} starting with "${syncFeedback.firstConflictId}"${syncFeedback.hasMore ? ', more remote changes remain' : ''}.`
    }

    return `Last sync ${syncedAt}: ${syncFeedback.message}`
  }, [syncFeedback])
  const syncStatusDetail = React.useMemo(() => {
    if (syncFeedback == null) {
      return null
    }

    if (syncFeedback.kind === 'success') {
      return syncFeedback.hasMore
        ? 'Run Sync now again to continue pulling the remaining remote backlog.'
        : 'Local persisted pages are fully caught up with the current remote cursor.'
    }

    if (syncFeedback.kind === 'conflict') {
      if (syncFeedback.activeConflictId === activePageId) {
        return `The active page is stale against the remote revision. Reload the latest persisted revision for "${activePageId}", then re-apply or compare your edits before syncing again.`
      }

      return `Review page "${syncFeedback.firstConflictId}", reload the latest persisted revision, then re-apply or compare your changes before syncing again.`
    }

    if (syncFeedback.code === 'auth') {
      return 'Authentication must be restored before sync can succeed.'
    }

    if (syncFeedback.code === 'rate-limited') {
      return syncFeedback.retryAfterMs != null
        ? `The remote source asked the client to wait about ${formatRetryAfter(syncFeedback.retryAfterMs)} before retrying.`
        : 'Wait briefly before retrying the next sync.'
    }

    if (syncFeedback.retryable) {
      return 'This failure is retryable. Fix the transient issue and run Sync now again.'
    }

    if (syncFeedback.code != null) {
      return `Sync failed with ${syncFeedback.code}.`
    }

    return null
  }, [syncFeedback])
  const backgroundSyncSummary = React.useMemo(() => {
    if (backgroundSyncFeedback == null) {
      return null
    }

    const triggerLabel = formatBackgroundSyncTrigger(backgroundSyncFeedback.trigger)
    if (backgroundSyncFeedback.kind === 'syncing') {
      return `Background sync is running after ${triggerLabel}.`
    }

    const syncedAt = formatSyncTimestamp(backgroundSyncFeedback.timestamp)
    if (backgroundSyncFeedback.kind === 'success') {
      return `Auto sync after ${triggerLabel} completed ${syncedAt}: pushed ${backgroundSyncFeedback.pushed}, pulled ${backgroundSyncFeedback.pulled}${backgroundSyncFeedback.hasMore ? ', more remote changes remain' : ''}.`
    }

    if (backgroundSyncFeedback.kind === 'conflict') {
      return `Auto sync after ${triggerLabel} completed ${syncedAt} with ${backgroundSyncFeedback.conflictCount} conflict${backgroundSyncFeedback.conflictCount === 1 ? '' : 's'} starting with "${backgroundSyncFeedback.firstConflictId}".`
    }

    return `Auto sync after ${triggerLabel} failed ${syncedAt}: ${backgroundSyncFeedback.message}`
  }, [backgroundSyncFeedback])
  const backgroundSyncDetail = React.useMemo(() => {
    if (backgroundSyncFeedback == null || backgroundSyncFeedback.kind === 'syncing') {
      return null
    }

    if (backgroundSyncFeedback.kind === 'success') {
      return backgroundSyncFeedback.hasMore
        ? 'Background sync paused with more remote changes still available. Manual sync can continue the backlog immediately.'
        : 'Auto sync is active and the local repository is caught up.'
    }

    if (backgroundSyncFeedback.kind === 'conflict') {
      return backgroundSyncFeedback.activeConflictId === activePageId
        ? 'The active page needs a reload before the next save or sync.'
        : 'A different page needs conflict resolution before a later sync can apply it cleanly.'
    }

    if (backgroundSyncFeedback.code === 'auth') {
      return 'Restore authentication before background sync can resume.'
    }

    if (backgroundSyncFeedback.code === 'rate-limited') {
      return backgroundSyncFeedback.retryAfterMs != null
        ? `The remote source asked the client to wait about ${formatRetryAfter(backgroundSyncFeedback.retryAfterMs)} before retrying.`
        : 'The remote source asked the client to slow down before retrying.'
    }

    if (backgroundSyncFeedback.retryable) {
      return 'This background sync failure is retryable. Auto sync will try again on the next trigger.'
    }

    return null
  }, [activePageId, backgroundSyncFeedback])

  const backgroundSyncSchedulerRef = React.useRef<ReturnType<typeof createDeclarativeBackgroundSyncScheduler> | null>(
    null,
  )

  React.useEffect(() => {
    if (repository == null) {
      return
    }

    const scheduler = createDeclarativeBackgroundSyncScheduler({
      canSync: () =>
        repositoryRef.current != null &&
        !isRepositoryBusyRef.current &&
        !hasProjectionDiffRef.current &&
        (activePageIdRef.current != null || pageSummaryCountRef.current > 0),
      onError(error) {
        console.error('Background sync scheduler failed', error)
      },
      runSync: async reason => {
        await syncWithRemoteRef.current({
          kind: 'background',
          trigger: reason,
        })
      },
    })
    backgroundSyncSchedulerRef.current = scheduler
    void scheduler.start()

    return () => {
      if (backgroundSyncSchedulerRef.current === scheduler) {
        backgroundSyncSchedulerRef.current = null
      }
      scheduler.destroy()
    }
  }, [repository])

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Heading as="h2" size="lg" id="jsx-authoring-bridge" data-heading>
          JSX Authoring Bridge
        </Heading>
        <Badge variant="soft" color="warning">
          PR 3.5
        </Badge>
      </div>
      <Text size="sm" className="text-muted-foreground">
        This proof keeps JSON as the runtime source of truth, lets authors work in constrained JSX, and now loads and
        saves the page through the repository-backed worker flow.
      </Text>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="soft" color={repositoryStatus === 'error' ? 'error' : 'info'}>
          Repository {repositoryStatus}
        </Badge>
        <Badge
          variant="soft"
          color={
            syncRunContext?.kind === 'background'
              ? 'info'
              : backgroundSyncFeedback?.kind === 'error'
                ? 'error'
                : backgroundSyncFeedback?.kind === 'conflict'
                  ? 'warning'
                  : 'success'
          }
        >
          {syncRunContext?.kind === 'background' ? 'Auto syncing…' : 'Auto sync active'}
        </Badge>
        {storageMode ? (
          <Badge variant="soft" color="success">
            {storageMode === 'opfs' ? 'OPFS' : storageMode === 'remote-only' ? 'Remote only' : 'Memory'}
          </Badge>
        ) : null}
        {schemaVersion != null ? <Badge variant="soft">Schema v{schemaVersion}</Badge> : null}
        {savedRevision ? <Badge variant="soft">{savedStateLabel}</Badge> : null}
        {pendingRepositoryChange ? (
          <Badge variant="soft" color="warning">
            Repository changed
          </Badge>
        ) : null}
      </div>

      {initializationNotice ? (
        <Callout.Root variant="surface" color="warning" className="rounded-2xl">
          <Callout.Text>{initializationNotice.message}</Callout.Text>
        </Callout.Root>
      ) : null}

      {syncFeedback ? (
        <Callout.Root
          role="status"
          aria-live="polite"
          variant="surface"
          color={syncFeedback.kind === 'success' ? 'success' : syncFeedback.kind === 'conflict' ? 'warning' : 'error'}
          className="rounded-2xl"
        >
          <div className="space-y-2">
            <Callout.Text>{syncFeedback.message}</Callout.Text>
            {syncStatusDetail ? (
              <Text size="sm" className="text-muted-foreground">
                {syncStatusDetail}
              </Text>
            ) : null}
          </div>
        </Callout.Root>
      ) : null}

      <div className="grid gap-3">
        <Card.Root className="border border-border/70 bg-background p-4 text-foreground">
          <div className="space-y-3">
            <div>
              <Text size="sm" className="font-medium text-foreground">
                Persisted Pages
              </Text>
              <Text size="sm" className="text-muted-foreground">
                This list is driven by repository `list-documents` summaries for persisted `page` records.
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                onClick={() => {
                  void createPage()
                }}
              >
                New page
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={repositoryStatus !== 'ready' || activePageId == null || lastValid == null || isRepositoryBusy}
                onClick={() => {
                  void duplicatePage()
                }}
              >
                Duplicate page
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!canSyncNow}
                onClick={() => {
                  void syncWithRemote()
                }}
              >
                {isSyncing ? 'Syncing…' : 'Sync now'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={repositoryStatus !== 'ready' || activePageId == null || isRepositoryBusy}
                onClick={() => {
                  void deletePage()
                }}
              >
                Delete page
              </Button>
            </div>
            {activePageId ? (
              <Text size="sm" className="text-muted-foreground">
                Editing page <span className="font-mono text-foreground">{activePageId}</span>.
              </Text>
            ) : null}
            {syncStatusSummary ? (
              <Callout.Root
                variant="surface"
                color={
                  syncFeedback?.kind === 'success' ? 'success' : syncFeedback?.kind === 'conflict' ? 'warning' : 'error'
                }
                className="rounded-2xl"
              >
                <Callout.Text>{syncStatusSummary}</Callout.Text>
              </Callout.Root>
            ) : null}
            {backgroundSyncSummary ? (
              <Callout.Root
                role="status"
                aria-live="polite"
                variant="surface"
                color={
                  backgroundSyncFeedback?.kind === 'syncing'
                    ? 'info'
                    : backgroundSyncFeedback?.kind === 'success'
                      ? 'success'
                      : backgroundSyncFeedback?.kind === 'conflict'
                        ? 'warning'
                        : 'error'
                }
                className="rounded-2xl"
              >
                <div className="space-y-2">
                  <Callout.Text>{backgroundSyncSummary}</Callout.Text>
                  {backgroundSyncDetail ? (
                    <Text size="sm" className="text-muted-foreground">
                      {backgroundSyncDetail}
                    </Text>
                  ) : null}
                </div>
              </Callout.Root>
            ) : null}
            <Text size="sm" className="text-muted-foreground">
              Sync policy in this proof: page-only envelopes, manual sync remains available, background sync triggers on
              visibility, online recovery, and settled local persisted changes, and there is still no merge UI.
            </Text>
            {isLoadingPageSummaries ? (
              <Text size="sm" className="text-muted-foreground">
                Loading persisted page summaries…
              </Text>
            ) : pageSummaries.length === 0 ? (
              <Text size="sm" className="text-muted-foreground">
                No persisted pages found. Create one locally before running sync again.
              </Text>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/70">
                <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-border/70 bg-muted/20 px-3 py-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <span>ID</span>
                  <span>Revision</span>
                  <span>Updated</span>
                </div>
                <div className="divide-y divide-border/60">
                  {pageSummaries.map(summary => (
                    <button
                      key={`${summary.documentKind}:${summary.id}`}
                      type="button"
                      className={`grid w-full grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 px-3 py-3 text-left text-sm transition ${
                        summary.id === activePageId ? 'bg-primary/5' : 'hover:bg-muted/30'
                      }`}
                      disabled={isRepositoryBusy}
                      onClick={() => {
                        void switchActivePage(summary.id)
                      }}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">
                          {summary.title ?? summary.id}
                          {summary.id === activePageId ? ' (active)' : ''}
                        </div>
                        {summary.title ? (
                          <div className="truncate text-xs text-muted-foreground">{summary.id}</div>
                        ) : null}
                      </div>
                      <div className="truncate text-muted-foreground">{summary.revision}</div>
                      <div className="truncate text-muted-foreground">{summary.updatedAt ?? 'n/a'}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card.Root>
      </div>

      <div className="grid gap-3">
        <Text size="sm" className="font-medium text-foreground">
          Authoring JSX
        </Text>
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-background text-foreground">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            {authoringViewMode === 'preview' ? (
              <ViewportPreviewControls preset={viewportPreset} onPresetChange={setViewportPreset} />
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={repositoryStatus !== 'ready' || activePageId == null || isRepositoryBusy}
                onClick={() => {
                  void reloadFromRepository()
                }}
              >
                {isReloading ? 'Reloading…' : pendingRepositoryChange ? 'Reload latest' : 'Reload saved'}
              </Button>
              <Button
                size="sm"
                variant="solid"
                disabled={repositoryStatus !== 'ready' || compilation.value == null || isRepositoryBusy}
                onClick={() => {
                  void saveToRepository()
                }}
              >
                {isSaving ? 'Saving…' : 'Save to repository'}
              </Button>
              {repositoryFeedback?.kind === 'conflict' && hasProjectionDiff ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                  onClick={() => {
                    setRepositoryFeedback(null)
                  }}
                >
                  Keep editing
                </Button>
              ) : null}
              <AuthoringModeButton
                active={authoringViewMode === 'preview'}
                onClick={() => setAuthoringViewMode('preview')}
              >
                Preview
              </AuthoringModeButton>
              <AuthoringModeButton active={authoringViewMode === 'code'} onClick={() => setAuthoringViewMode('code')}>
                Code
              </AuthoringModeButton>
              {hasProjectionDiff ? (
                <AuthoringModeButton
                  active={authoringViewMode === 'projected'}
                  onClick={() => setAuthoringViewMode('projected')}
                >
                  Projected
                </AuthoringModeButton>
              ) : null}
            </div>
          </div>

          {isInitialLoadPending ? (
            <Callout.Root variant="surface" color="info" radius="none" className="border-x-0 border-b-0" px="4" py="3">
              <Callout.Text>Loading repository-backed page document…</Callout.Text>
            </Callout.Root>
          ) : isEmptyPageState ? (
            <div className="px-4 py-8">
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
                <Heading as="h3" size="md">
                  No persisted page selected
                </Heading>
                <Text size="sm" className="mt-2 text-muted-foreground">
                  This workbench does not currently have a saved page loaded. Create a new persisted page to keep
                  editing.
                </Text>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="solid"
                    disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                    onClick={() => {
                      void createPage()
                    }}
                  >
                    New page
                  </Button>
                </div>
              </div>
            </div>
          ) : authoringViewMode === 'preview' && actorRef != null && lastValid != null ? (
            <ViewportPreview preset={viewportPreset}>
              <DeclarativePageRenderer
                page={lastValid.normalizedPage}
                actorRef={actorRef}
                components={authoringComponents}
              />
            </ViewportPreview>
          ) : authoringViewMode === 'projected' ? (
            <div className={codePaneShellClassName}>
              <div className={codePaneLabelClassName}>Projected JSX</div>
              <pre className={`${codePaneFrameClassName} min-h-[280px]`}>
                <code>{lastValid?.projectedJsx ?? ''}</code>
              </pre>
            </div>
          ) : (
            <div className={codePaneShellClassName}>
              <div className={codePaneLabelClassName}>Code pane</div>
              <React.Suspense
                fallback={
                  <pre className={codePaneFrameClassName}>
                    <code>{code ?? ''}</code>
                  </pre>
                }
              >
                <div className={codePaneEditorFrameClassName}>
                  <CodeMirror
                    value={code ?? ''}
                    theme={oneDark}
                    extensions={[javascript({ jsx: true, typescript: false })]}
                    onChange={(value: string) => {
                      setCode(value)
                    }}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: false,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: true,
                      syntaxHighlighting: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      rectangularSelection: false,
                      highlightSelectionMatches: false,
                      searchKeymap: false,
                      tabSize: 2,
                    }}
                    className="text-sm [&_.cm-editor]:h-auto [&_.cm-editor]:min-h-[280px] [&_.cm-editor]:overflow-hidden [&_.cm-scroller]:min-h-[280px] [&_.cm-scroller]:overflow-auto"
                  />
                </div>
              </React.Suspense>
            </div>
          )}

          {compileErrorMessage ? (
            <Callout.Root variant="surface" color="error" radius="none" className="border-x-0 border-b-0" px="4" py="3">
              <Callout.Text>{compileErrorMessage}</Callout.Text>
            </Callout.Root>
          ) : repositoryFeedback?.kind === 'conflict' ? (
            <Callout.Root
              variant="surface"
              color="warning"
              radius="none"
              className="border-x-0 border-b-0"
              px="4"
              py="3"
            >
              <Callout.Text>{repositoryFeedback.message}</Callout.Text>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                  onClick={() => {
                    void reloadFromRepository()
                  }}
                >
                  Reload latest
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                  onClick={() => {
                    setRepositoryFeedback(null)
                  }}
                >
                  Keep editing
                </Button>
              </div>
            </Callout.Root>
          ) : repositoryFeedback?.kind === 'error' ? (
            <Callout.Root variant="surface" color="error" radius="none" className="border-x-0 border-b-0" px="4" py="3">
              <Callout.Text>{repositoryFeedback.message}</Callout.Text>
            </Callout.Root>
          ) : pendingRepositoryChangeMessage ? (
            <Callout.Root
              variant="surface"
              color="warning"
              radius="none"
              className="border-x-0 border-b-0"
              px="4"
              py="3"
            >
              <Callout.Text>{pendingRepositoryChangeMessage}</Callout.Text>
              {hasProjectionDiff ? (
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                    onClick={() => {
                      void reloadFromRepository()
                    }}
                  >
                    Reload latest
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={repositoryStatus !== 'ready' || isRepositoryBusy}
                    onClick={() => {
                      setPendingRepositoryChange(null)
                    }}
                  >
                    Keep editing
                  </Button>
                </div>
              ) : null}
            </Callout.Root>
          ) : repositoryStatus === 'loading' && !isInitialLoadPending ? (
            <Callout.Root variant="surface" color="info" radius="none" className="border-x-0 border-b-0" px="4" py="3">
              <Callout.Text>Loading repository-backed page document…</Callout.Text>
            </Callout.Root>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3">
        <Card.Root className="border border-border/70 bg-background text-foreground p-4">
          <div className="space-y-2">
            <Text size="sm" className="font-medium text-foreground">
              Declarative JSON
            </Text>
            <div className="rounded-xl border border-border/70 bg-background p-2 text-foreground">
              {lastValid ? (
                <JsonViewEditor value={lastValid.jsonValue} editable={false} />
              ) : (
                <div className="px-3 py-6 text-sm text-muted-foreground">No persisted page is loaded.</div>
              )}
            </div>
          </div>
        </Card.Root>
      </div>
    </section>
  )
}
