'use client'

import { Runner } from '@incmix/react-runner'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Column, Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { Text } from '@/typography/text/Text'
import {
  codePaneEditorFrameClassName,
  codePaneFrameClassName,
  codePaneLabelClassName,
  codePaneShellClassName,
} from '../code-pane-styles'
import type { LiveCodeBlockProps } from './LiveCodeBlock'
import { liveCodeBlockExtraTabPanel, liveCodeBlockRoot, liveCodeBlockToolbar } from './LiveCodeBlock.css'
import { loadCatalogRuntimeScopeForJsx } from './runtime-scope'
import { type ViewportPreset, ViewportPreview, ViewportPreviewControls } from './ViewportPreview'

const CodeMirror = React.lazy(() => import('@uiw/react-codemirror'))
const EMPTY_SCOPE: Record<string, unknown> = {}
const SCOPE_RESOLUTION_DEBOUNCE_MS = 300

type ViewMode = 'preview' | 'code' | string

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}

function normalizeSnippet(source: string): string {
  const lines = stripMarkdownCodeFence(source).replace(/\r\n/g, '\n').split('\n')

  while (lines.length > 0 && lines[0]?.trim() === '') lines.shift()
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === '') lines.pop()

  const nonEmpty = lines.filter(line => line.trim().length > 0)
  const minIndent =
    nonEmpty.length > 0
      ? Math.min(
          ...nonEmpty.map(line => {
            const match = line.match(/^ */)
            return match ? match[0].length : 0
          }),
        )
      : 0

  return lines.map(line => line.slice(minIndent)).join('\n')
}

function stripMarkdownCodeFence(source: string): string {
  const normalized = source.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const firstLine = lines[0]?.trim()
  let lastContentLineIndex = lines.length - 1
  while (lastContentLineIndex >= 0 && lines[lastContentLineIndex]?.trim() === '') {
    lastContentLineIndex -= 1
  }
  const lastLine = lines[lastContentLineIndex]?.trim()

  if (firstLine?.startsWith('```') && lastLine === '```') {
    return lines.slice(1, lastContentLineIndex).join('\n')
  }

  return normalized
}

function toRunnableCode(source: string): string {
  const normalized = normalizeSnippet(source)
  if (/\bexport\s+default\b/.test(normalized)) return normalized

  const body = normalized
    .split('\n')
    .map(line => (line.length > 0 ? `    ${line}` : line))
    .join('\n')

  return `export default function Example() {\n  return (\n${body}\n  )\n}`
}

function ViewModeButton({
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="border-t border-border/60 bg-background px-4 py-3" role="alert" aria-live="polite">
      <Text size="sm" color="error">
        {message}
      </Text>
    </div>
  )
}

export default function LiveCodeBlockImpl({
  initialCode,
  scope = EMPTY_SCOPE,
  scopeLoader,
  previewProps,
  previewAppearance = 'light',
  previewToolbarActions,
  showPreview = true,
  extraTabs = [],
  className,
  onCodeChange,
}: LiveCodeBlockProps) {
  const [code, setCode] = React.useState(() => normalizeSnippet(initialCode))
  const [viewMode, setViewMode] = React.useState<ViewMode>(showPreview ? 'preview' : 'code')
  const [viewportPreset, setViewportPreset] = React.useState<ViewportPreset>('desktop')
  const [error, setError] = React.useState<Error | null>(null)
  const [hasRenderedPreview, setHasRenderedPreview] = React.useState(false)
  const [previewRevision, setPreviewRevision] = React.useState(0)
  const runnableCode = React.useMemo(() => toRunnableCode(code), [code])
  const debouncedCode = useDebouncedValue(code, SCOPE_RESOLUTION_DEBOUNCE_MS)
  const [resolvedScope, setResolvedScope] = React.useState<Record<string, unknown>>(() => ({ ...scope }))
  const [scopeError, setScopeError] = React.useState<Error | null>(null)
  const [scopeLoading, setScopeLoading] = React.useState(true)
  const normalizedExtraTabs = React.useMemo(() => {
    const seen = new Set<string>()
    return extraTabs.filter(tab => {
      if (tab.value === 'preview' || tab.value === 'code' || seen.has(tab.value)) return false
      seen.add(tab.value)
      return true
    })
  }, [extraTabs])
  const extraTab = normalizedExtraTabs.find(tab => tab.value === viewMode)

  React.useEffect(() => {
    setCode(normalizeSnippet(initialCode))
    setError(null)
    setHasRenderedPreview(false)
    setPreviewRevision(current => current + 1)
  }, [initialCode])

  React.useEffect(() => {
    setViewMode(showPreview ? 'preview' : 'code')
  }, [showPreview])

  React.useEffect(() => {
    let cancelled = false

    setResolvedScope({ ...scope })
    setScopeError(null)
    setScopeLoading(true)

    void Promise.resolve()
      .then(async () => {
        const catalogScope = await loadCatalogRuntimeScopeForJsx(debouncedCode, scope)
        const loaderScope = scopeLoader ? await scopeLoader(debouncedCode) : {}
        return { ...catalogScope, ...loaderScope }
      })
      .then(nextScope => {
        if (cancelled) return
        setResolvedScope({ ...nextScope, ...scope })
        setScopeLoading(false)
      })
      .catch(nextError => {
        if (cancelled) return
        setScopeError(nextError instanceof Error ? nextError : new Error(String(nextError)))
        setScopeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedCode, scope, scopeLoader])

  return (
    <div className={cn(liveCodeBlockRoot, className)}>
      {showPreview ? (
        <Flex align="center" justify="between" className={liveCodeBlockToolbar}>
          {viewMode === 'preview' ? (
            <Flex align="center" gap="2">
              <ViewportPreviewControls preset={viewportPreset} onPresetChange={setViewportPreset} />
              {previewToolbarActions}
            </Flex>
          ) : (
            <span aria-hidden="true" />
          )}
          <Flex align="center" gap="2">
            <ViewModeButton active={viewMode === 'preview'} onClick={() => setViewMode('preview')}>
              Preview
            </ViewModeButton>
            <ViewModeButton active={viewMode === 'code'} onClick={() => setViewMode('code')}>
              Code
            </ViewModeButton>
            {normalizedExtraTabs.map(tab => (
              <ViewModeButton key={tab.value} active={viewMode === tab.value} onClick={() => setViewMode(tab.value)}>
                {tab.label}
              </ViewModeButton>
            ))}
          </Flex>
        </Flex>
      ) : null}

      {extraTab != null ? (
        <Column className={liveCodeBlockExtraTabPanel}>{extraTab.content}</Column>
      ) : viewMode === 'preview' ? (
        <ViewportPreview preset={viewportPreset}>
          <ThemeProvider appearance={previewAppearance} hasBackground radius="md" className="size-full">
            {scopeLoading ? <div className="text-sm text-muted-foreground">Loading preview bindings…</div> : null}
            {!scopeLoading && !scopeError ? (
              <Runner
                key={previewRevision}
                code={runnableCode}
                scope={resolvedScope}
                componentProps={previewProps}
                onRendered={(nextError: Error | null) => {
                  setError(nextError)
                  setHasRenderedPreview(nextError == null)
                }}
              />
            ) : null}
            {!scopeLoading && !scopeError && !error && !hasRenderedPreview ? (
              <div className="text-sm text-muted-foreground">Preview did not render. Check the code view below.</div>
            ) : null}
          </ThemeProvider>
        </ViewportPreview>
      ) : (
        <div className={codePaneShellClassName}>
          <div className={codePaneLabelClassName}>Code pane</div>
          <React.Suspense
            fallback={
              <pre className={codePaneFrameClassName}>
                <code>{code}</code>
              </pre>
            }
          >
            <div className={codePaneEditorFrameClassName}>
              <CodeMirror
                value={code}
                theme={oneDark}
                extensions={[javascript({ jsx: true, typescript: false })]}
                onChange={(value: string) => {
                  const nextCode = stripMarkdownCodeFence(value)
                  setCode(nextCode)
                  onCodeChange?.(nextCode)
                  setError(null)
                  setHasRenderedPreview(false)
                  setPreviewRevision(current => current + 1)
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
                className="text-sm [&_.cm-editor]:h-auto [&_.cm-editor]:max-h-[420px] [&_.cm-editor]:overflow-hidden [&_.cm-scroller]:max-h-[420px] [&_.cm-scroller]:overflow-auto"
              />
            </div>
          </React.Suspense>
        </div>
      )}

      {scopeError ? <ErrorMessage message={scopeError.message} /> : null}

      {error ? <ErrorMessage message={error.message} /> : null}
    </div>
  )
}
