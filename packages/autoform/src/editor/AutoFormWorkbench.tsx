'use client'

import {
  type AutoFormUiSchema,
  type JsonSchemaNode,
  normalizeJsonSchemaWithUiSchema,
  resolveJsonSchemaRefs,
  type SchemaRefResolutionOptions,
} from '@incmix/core'
import { Badge, Button, Callout, IconButton, SegmentedControl } from '@incmix/ui/elements'
import { useClipboard } from '@incmix/ui/hooks'
import { Flex } from '@incmix/ui/layouts'
import { cn } from '@incmix/ui/lib/utils'
import type { Color } from '@incmix/ui/theme'
import { Text } from '@incmix/ui/typography'
import { Check, Copy, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import * as React from 'react'
import { AutoFormModelRenderer } from '../AutoFormModelRenderer'
import { type JsonValue, JsonViewEditor } from '../json-editor'
import {
  contentStack,
  headerBlur,
  mainColumn,
  previewBody,
  previewHeader,
  rootBody,
  secondaryColumn,
  secondaryPanel,
  sectionBody,
  sectionHeader,
  sectionTitle,
  titleWrap,
  viewportHeight,
  viewportShell,
  viewportSurface,
  workbenchRoot,
} from './AutoFormWorkbench.css'

export type AutoFormWorkbenchViewport = 'desktop' | 'tablet' | 'phone'
export type AutoFormWorkbenchInspectorTab = 'schema' | 'uiSchema' | 'normalized'
type OneOfControl = {
  key: string
  path: string[]
  label: string
  branches: JsonValue[]
}

type JsonEditorIssueMap = Record<string, string[]>

const viewportWidths: Record<AutoFormWorkbenchViewport, number> = {
  desktop: 1200,
  tablet: 900,
  phone: 375,
}

const viewportIcons = {
  position: 'only',
  icons: [
    { value: 'desktop', icon: 'monitor' },
    { value: 'tablet', icon: 'tablet' },
    { value: 'phone', icon: 'smartphone' },
  ],
} satisfies { position: 'only'; icons: Array<{ value: string; icon: string }> }

function isJsonObject(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isJsonArray(value: JsonValue | undefined): value is JsonValue[] {
  return Array.isArray(value)
}

function mergeJsonSchemaForPreview(base: JsonValue, override: JsonValue): JsonValue {
  if (!isJsonObject(base) || !isJsonObject(override)) {
    return override
  }

  const merged: Record<string, JsonValue> = { ...base, ...override }

  if (isJsonObject(base.properties) || isJsonObject(override.properties)) {
    merged.properties = {
      ...(isJsonObject(base.properties) ? base.properties : {}),
      ...(isJsonObject(override.properties) ? override.properties : {}),
    }
  }

  if (isJsonObject(base.$defs) || isJsonObject(override.$defs)) {
    merged.$defs = {
      ...(isJsonObject(base.$defs) ? base.$defs : {}),
      ...(isJsonObject(override.$defs) ? override.$defs : {}),
    }
  }

  if (isJsonObject(base.definitions) || isJsonObject(override.definitions)) {
    merged.definitions = {
      ...(isJsonObject(base.definitions) ? base.definitions : {}),
      ...(isJsonObject(override.definitions) ? override.definitions : {}),
    }
  }

  if (isJsonObject(base.dependentSchemas) || isJsonObject(override.dependentSchemas)) {
    merged.dependentSchemas = {
      ...(isJsonObject(base.dependentSchemas) ? base.dependentSchemas : {}),
      ...(isJsonObject(override.dependentSchemas) ? override.dependentSchemas : {}),
    }
  }

  if (isJsonArray(base.required) || isJsonArray(override.required)) {
    merged.required = [
      ...new Set([
        ...(isJsonArray(base.required) ? base.required : []),
        ...(isJsonArray(override.required) ? override.required : []),
      ]),
    ]
  }

  delete merged.oneOf
  return merged
}

function getSchemaPathKey(path: string[]) {
  return path.length === 0 ? 'root' : JSON.stringify(path)
}

function getOneOfControlLabel(schema: JsonValue, path: string[]): string {
  if (isJsonObject(schema) && typeof schema.title === 'string' && schema.title.trim().length > 0) {
    return schema.title
  }

  return path[path.length - 1] ?? 'root'
}

function collectControlsFromSchemaMap(schemaMap: JsonValue | undefined, path: string[]): OneOfControl[] {
  if (!isJsonObject(schemaMap)) return []

  return Object.entries(schemaMap).flatMap(([key, value]) => collectOneOfControls(value, [...path, key]))
}

function collectControlsFromCombinatorBranches(
  branches: JsonValue | undefined,
  path: string[],
  combinator: 'anyOf' | 'oneOf' | 'allOf',
): OneOfControl[] {
  if (!isJsonArray(branches)) return []

  return branches.flatMap((branch, index) => collectOneOfControls(branch, [...path, combinator, String(index)]))
}

function collectOneOfControls(schema: JsonValue, path: string[] = []): OneOfControl[] {
  if (!isJsonObject(schema)) return []

  const controls: OneOfControl[] = []
  if (isJsonArray(schema.oneOf)) {
    controls.push({
      key: getSchemaPathKey(path),
      path,
      label: getOneOfControlLabel(schema, path),
      branches: schema.oneOf,
    })
  }

  if (isJsonObject(schema.properties)) {
    for (const [key, value] of Object.entries(schema.properties)) {
      controls.push(...collectOneOfControls(value, [...path, key]))
    }
  }

  if (isJsonObject(schema.items)) {
    controls.push(...collectOneOfControls(schema.items, [...path, 'items']))
  }

  controls.push(...collectControlsFromSchemaMap(schema.patternProperties, [...path, 'patternProperties']))
  controls.push(...collectControlsFromSchemaMap(schema.dependentSchemas, [...path, 'dependentSchemas']))

  if (isJsonObject(schema.additionalProperties)) {
    controls.push(...collectOneOfControls(schema.additionalProperties, [...path, 'additionalProperties']))
  }

  controls.push(...collectControlsFromCombinatorBranches(schema.anyOf, path, 'anyOf'))
  controls.push(...collectControlsFromCombinatorBranches(schema.allOf, path, 'allOf'))

  return controls
}

function applySelectionsToSchemaMap(
  schemaMap: JsonValue | undefined,
  selections: Record<string, number>,
  path: string[],
): JsonValue | undefined {
  if (!isJsonObject(schemaMap)) return schemaMap

  const next: Record<string, JsonValue> = Object.fromEntries(
    Object.entries(schemaMap).map(([key, value]) => [key, applyOneOfSelections(value, selections, [...path, key])]),
  )
  return next
}

function applySelectionsToCombinatorBranches(
  branches: JsonValue | undefined,
  selections: Record<string, number>,
  path: string[],
  combinator: 'anyOf' | 'oneOf' | 'allOf',
): JsonValue | undefined {
  if (!isJsonArray(branches)) return branches

  return branches.map((branch, index) => applyOneOfSelections(branch, selections, [...path, combinator, String(index)]))
}

function applyOneOfSelections(schema: JsonValue, selections: Record<string, number>, path: string[] = []): JsonValue {
  if (!isJsonObject(schema)) return schema

  let current: JsonValue = schema
  if (isJsonArray(schema.oneOf) && schema.oneOf.length > 0) {
    const selectedIndex = selections[getSchemaPathKey(path)] ?? 0
    const selectedBranch = schema.oneOf[selectedIndex] ?? schema.oneOf[0]
    if (selectedBranch !== undefined) {
      current = mergeJsonSchemaForPreview(schema, selectedBranch)
    }
  }

  if (!isJsonObject(current)) {
    return current
  }

  const next: Record<string, JsonValue> = { ...current }

  if (isJsonObject(current.properties)) {
    next.properties = Object.fromEntries(
      Object.entries(current.properties).map(([key, value]) => [
        key,
        applyOneOfSelections(value, selections, [...path, key]),
      ]),
    )
  }

  if (isJsonObject(current.items)) {
    next.items = applyOneOfSelections(current.items, selections, [...path, 'items'])
  }

  if (isJsonObject(current.patternProperties)) {
    const patternProperties = applySelectionsToSchemaMap(current.patternProperties, selections, [
      ...path,
      'patternProperties',
    ])
    if (patternProperties !== undefined) {
      next.patternProperties = patternProperties
    }
  }

  if (isJsonObject(current.additionalProperties)) {
    next.additionalProperties = applyOneOfSelections(current.additionalProperties, selections, [
      ...path,
      'additionalProperties',
    ])
  }

  if (isJsonObject(current.dependentSchemas)) {
    const dependentSchemas = applySelectionsToSchemaMap(current.dependentSchemas, selections, [
      ...path,
      'dependentSchemas',
    ])
    if (dependentSchemas !== undefined) {
      next.dependentSchemas = dependentSchemas
    }
  }

  if (isJsonArray(current.anyOf)) {
    const anyOf = applySelectionsToCombinatorBranches(current.anyOf, selections, path, 'anyOf')
    if (anyOf !== undefined) {
      next.anyOf = anyOf
    }
  }

  if (isJsonArray(current.allOf)) {
    const allOf = applySelectionsToCombinatorBranches(current.allOf, selections, path, 'allOf')
    if (allOf !== undefined) {
      next.allOf = allOf
    }
  }

  return next
}

function getOneOfBranchLabel(branch: JsonValue, index: number): string {
  if (isJsonObject(branch) && typeof branch.title === 'string' && branch.title.trim().length > 0) {
    return branch.title
  }

  if (isJsonObject(branch) && isJsonObject(branch.properties)) {
    for (const value of Object.values(branch.properties)) {
      if (isJsonObject(value) && typeof value.const === 'string' && value.const.trim().length > 0) {
        return value.const
      }
    }
  }

  return `Option ${index + 1}`
}

function parseSchemaIssuePath(message: string): string | null {
  if (message.includes('schema must be an object')) return '$root'

  const pathMatch = message.match(/ at (\$[^\s(]+)/)
  if (!pathMatch) return null

  const rawPath = pathMatch[1]
  if (!rawPath) return null

  const normalizedPath = rawPath.replace(/#resolved\([^)]+\)/g, '')
  if (normalizedPath === '$') return '$root'

  const source = normalizedPath.replace(/^\$/, '')
  const tokenRegex = /(?:^|\.)([^.[\]]+)|\[(\d+)\]|\[['"]((?:\\.|[^\\'"])*)['"]\]/g
  const segments: string[] = []
  let match = tokenRegex.exec(source)
  while (match !== null) {
    const token = match[1] ?? match[2] ?? match[3]
    if (token) segments.push(token.replace(/\\(['"])/g, '$1'))
    match = tokenRegex.exec(source)
  }

  return segments.length > 0 ? segments.join('.') : '$root'
}

function getSchemaEditorIssues(messages: string[]): JsonEditorIssueMap {
  return messages.reduce<JsonEditorIssueMap>((issues, message) => {
    const path = parseSchemaIssuePath(message)
    if (!path) return issues

    issues[path] = [...(issues[path] ?? []), message]
    return issues
  }, {})
}

function isViewport(value: string): value is AutoFormWorkbenchViewport {
  return value === 'desktop' || value === 'tablet' || value === 'phone'
}

function isInspectorTab(value: string): value is AutoFormWorkbenchInspectorTab {
  return value === 'schema' || value === 'uiSchema' || value === 'normalized'
}

function toFormattedJson(value: JsonValue): string {
  return JSON.stringify(value, null, 2)
}

function WorkbenchViewportShell({ children }: { children: React.ReactNode }) {
  return <div className={viewportShell}>{children}</div>
}

function WorkbenchViewportSurface({
  viewport,
  children,
}: {
  viewport: AutoFormWorkbenchViewport
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(viewportSurface, viewport === 'phone' ? viewportHeight.phone : viewportHeight.default)}
      style={{ width: `${viewportWidths[viewport]}px`, maxWidth: '100%' }}
    >
      {children}
    </div>
  )
}

export interface AutoFormWorkbenchProps {
  jsonSchema: JsonValue
  uiSchema: JsonValue
  externalSchemas?: SchemaRefResolutionOptions['externalSchemas']
  onJsonSchemaChange?: (value: JsonValue) => void
  onUiSchemaChange?: (value: JsonValue) => void
  defaultViewport?: AutoFormWorkbenchViewport
  defaultInspectorTab?: AutoFormWorkbenchInspectorTab
  color?: Color
  className?: string
}

export function AutoFormWorkbench({
  jsonSchema,
  uiSchema,
  externalSchemas,
  onJsonSchemaChange,
  onUiSchemaChange,
  defaultViewport = 'desktop',
  defaultInspectorTab = 'schema',
  color = 'neutral',
  className,
}: AutoFormWorkbenchProps) {
  const clipboard = useClipboard({ timeout: 1500 })
  const [viewport, setViewport] = React.useState<AutoFormWorkbenchViewport>(defaultViewport)
  const [activeTab, setActiveTab] = React.useState<AutoFormWorkbenchInspectorTab>(defaultInspectorTab)
  const [secondaryOpen, setSecondaryOpen] = React.useState(true)
  const [copiedTab, setCopiedTab] = React.useState<AutoFormWorkbenchInspectorTab | null>(null)
  const oneOfControls = React.useMemo(() => collectOneOfControls(jsonSchema), [jsonSchema])
  const [oneOfSelections, setOneOfSelections] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(oneOfControls.map(control => [control.key, 0])),
  )

  React.useEffect(() => {
    setOneOfSelections(current =>
      Object.fromEntries(
        oneOfControls.map(control => {
          const nextIndex = current[control.key] ?? 0
          return [control.key, nextIndex < control.branches.length ? nextIndex : 0]
        }),
      ),
    )
  }, [oneOfControls])

  const effectiveJsonSchema = React.useMemo(() => {
    return applyOneOfSelections(jsonSchema, oneOfSelections)
  }, [jsonSchema, oneOfSelections])
  const resolvedJsonSchema = React.useMemo(() => {
    try {
      return {
        schema: resolveJsonSchemaRefs(effectiveJsonSchema as JsonSchemaNode, { externalSchemas }),
        resolutionError: null as string | null,
      }
    } catch (error) {
      return {
        schema: effectiveJsonSchema as JsonSchemaNode,
        resolutionError: error instanceof Error ? error.message : 'Failed to resolve schema references.',
      }
    }
  }, [effectiveJsonSchema, externalSchemas])

  const result = React.useMemo(() => {
    const errors = resolvedJsonSchema.resolutionError ? [resolvedJsonSchema.resolutionError] : []

    try {
      const model = normalizeJsonSchemaWithUiSchema(resolvedJsonSchema.schema, uiSchema as AutoFormUiSchema)
      return { model, errors }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to normalize schema and UI schema.'
      return { model: null, errors: errors.includes(message) ? errors : [...errors, message] }
    }
  }, [resolvedJsonSchema, uiSchema])
  const schemaIssues = React.useMemo(() => getSchemaEditorIssues(result.errors), [result.errors])
  const previewModelKey = React.useMemo(() => {
    if (!result.model) return 'preview-empty'
    return JSON.stringify(result.model)
  }, [result.model])

  const secondaryTitle =
    activeTab === 'schema' ? 'JSON Schema' : activeTab === 'uiSchema' ? 'UI Schema' : 'Normalized Model'
  const secondaryDescription =
    activeTab === 'schema'
      ? 'Edit the source JSON Schema.'
      : activeTab === 'uiSchema'
        ? 'Edit the source UI schema.'
        : 'Review the derived normalized model used by the renderer.'
  const copyValue = activeTab === 'schema' ? jsonSchema : activeTab === 'uiSchema' ? uiSchema : null

  const handleCopy = React.useCallback(async () => {
    if (!copyValue) return

    await clipboard.copy(toFormattedJson(copyValue))
    setCopiedTab(activeTab)
  }, [activeTab, clipboard, copyValue])

  React.useEffect(() => {
    if (!clipboard.copied || copiedTab !== activeTab) {
      setCopiedTab(null)
    }
  }, [activeTab, clipboard.copied, copiedTab])

  return (
    <div className={cn(workbenchRoot, className)}>
      <div className={rootBody} data-color={color}>
        {secondaryOpen ? (
          <aside className={secondaryColumn}>
            <div className={secondaryPanel}>
              <div className={sectionHeader}>
                <Flex align="center" justify="between" gap="3">
                  <Flex direction="column" gap="1">
                    <Text size="sm" className={sectionTitle}>
                      Secondary Sidebar
                    </Text>
                    <Text size="xs" className="text-muted-foreground">
                      {secondaryDescription}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <Badge size="sm" variant="surface" color="neutral">
                      {secondaryTitle}
                    </Badge>
                    {copyValue ? (
                      <IconButton
                        size="xs"
                        variant="ghost"
                        title={
                          clipboard.copied && copiedTab === activeTab
                            ? `Copied ${activeTab === 'schema' ? 'schema' : 'UI schema'} JSON`
                            : `Copy ${activeTab === 'schema' ? 'schema' : 'UI schema'} JSON`
                        }
                        aria-label={`Copy ${activeTab === 'schema' ? 'schema' : 'UI schema'} JSON`}
                        onClick={() => {
                          void handleCopy()
                        }}
                      >
                        {clipboard.copied && copiedTab === activeTab ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </IconButton>
                    ) : null}
                  </Flex>
                </Flex>
                <div className="mt-3">
                  <SegmentedControl.Root
                    size="sm"
                    value={activeTab}
                    onValueChange={value => {
                      if (isInspectorTab(value)) setActiveTab(value)
                    }}
                  >
                    <SegmentedControl.Item value="schema">Schema</SegmentedControl.Item>
                    <SegmentedControl.Item value="uiSchema">UI Schema</SegmentedControl.Item>
                    <SegmentedControl.Item value="normalized">Normalized</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </div>
              </div>

              <div className={sectionBody}>
                {activeTab === 'schema' ? (
                  <JsonViewEditor
                    name="schema"
                    value={jsonSchema}
                    onChange={onJsonSchemaChange}
                    issues={schemaIssues}
                    mode="schema"
                    editable
                    searchable
                    externalSchemas={externalSchemas as Record<string, JsonValue> | undefined}
                  />
                ) : activeTab === 'uiSchema' ? (
                  <JsonViewEditor name="uiSchema" value={uiSchema} onChange={onUiSchemaChange} editable searchable />
                ) : (
                  <JsonViewEditor
                    name="normalizedModel"
                    value={(result.model ?? { errors: result.errors }) as JsonValue}
                    editable={false}
                    searchable
                  />
                )}
              </div>
            </div>
          </aside>
        ) : null}

        <div className={mainColumn}>
          <div className={headerBlur}>
            <Flex align="center" justify="between" gap="3" className="h-14 px-4 md:px-6">
              <Flex align="center" gap="3" className={titleWrap}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Toggle secondary panel"
                  onClick={() => setSecondaryOpen(current => !current)}
                >
                  {secondaryOpen ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
                </Button>
                <Flex direction="column" gap="1">
                  <Text size="sm" className={sectionTitle}>
                    AutoForm Workbench
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    Collapse the surrounding navigation to give the workspace more room.
                  </Text>
                </Flex>
              </Flex>
              <SegmentedControl.Root
                size="sm"
                value={viewport}
                icons={viewportIcons}
                onValueChange={value => {
                  if (isViewport(value)) setViewport(value)
                }}
              >
                <SegmentedControl.Item value="desktop">Desktop</SegmentedControl.Item>
                <SegmentedControl.Item value="tablet">Tablet</SegmentedControl.Item>
                <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Flex>
          </div>

          <div className={contentStack}>
            <Flex align="center" justify="between" gap="3" className="flex-wrap">
              <Flex direction="column" gap="1">
                <Text size="sm" className={sectionTitle}>
                  Responsive Form Preview
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  Main content owns footprint validation while the secondary panel owns JSON authoring.
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                {oneOfControls.length > 0 ? (
                  <Badge size="sm" variant="soft" color="primary">
                    oneOf: {oneOfControls.length}
                  </Badge>
                ) : null}
                <Badge size="sm" variant="surface" color={result.errors.length > 0 ? 'error' : 'success'}>
                  {result.errors.length > 0 ? 'Normalization error' : 'Normalized'}
                </Badge>
                <Badge size="sm" variant="soft" color="neutral">
                  {viewportWidths[viewport]}px
                </Badge>
              </Flex>
            </Flex>

            {result.errors.length > 0 ? (
              <Callout.Root variant="surface" color="error">
                <Callout.Text>{result.errors.join(' ')}</Callout.Text>
              </Callout.Root>
            ) : null}

            <WorkbenchViewportShell>
              <WorkbenchViewportSurface viewport={viewport}>
                <div className={previewHeader}>
                  <Flex direction="column" gap="3">
                    <Flex direction="column" gap="1">
                      <Text size="sm" className={sectionTitle}>
                        Rendered AutoForm
                      </Text>
                      <Text size="xs" className="text-muted-foreground">
                        Preview the renderer across different viewport footprints.
                      </Text>
                    </Flex>
                    {oneOfControls.length > 0 ? (
                      <Flex direction="column" gap="3">
                        {oneOfControls.map(control => (
                          <Flex key={control.key} direction="column" gap="2">
                            <Text size="xs" className="text-muted-foreground">
                              oneOf branch: {control.label}
                            </Text>
                            <SegmentedControl.Root
                              aria-label={`oneOf branch: ${control.label}`}
                              size="sm"
                              value={String(oneOfSelections[control.key] ?? 0)}
                              onValueChange={value => {
                                const nextIndex = Number(value)
                                if (
                                  Number.isInteger(nextIndex) &&
                                  nextIndex >= 0 &&
                                  nextIndex < control.branches.length
                                ) {
                                  setOneOfSelections(current => ({ ...current, [control.key]: nextIndex }))
                                }
                              }}
                            >
                              {control.branches.map((branch, index) => (
                                <SegmentedControl.Item key={index} value={String(index)}>
                                  {getOneOfBranchLabel(branch, index)}
                                </SegmentedControl.Item>
                              ))}
                            </SegmentedControl.Root>
                          </Flex>
                        ))}
                      </Flex>
                    ) : null}
                  </Flex>
                </div>
                <div className={previewBody}>
                  {result.model ? (
                    <AutoFormModelRenderer
                      key={previewModelKey}
                      model={result.model}
                      validationSchema={resolvedJsonSchema}
                      surface="inline"
                      submitLabel="Save workspace"
                      closeOnSubmit={false}
                    />
                  ) : null}
                </div>
              </WorkbenchViewportSurface>
            </WorkbenchViewportShell>
          </div>
        </div>
      </div>
    </div>
  )
}
