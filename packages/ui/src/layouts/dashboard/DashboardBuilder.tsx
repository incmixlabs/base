'use client'

import * as React from 'react'
import { Button, Icon } from '@/elements'
import { Grid, Row } from '@/layouts'
import { cn } from '@/lib/utils'
import { DEFAULT_THEME_BREAKPOINTS } from '@/theme/theme-breakpoints'
import { DEFAULT_THEME_DASHBOARD, DEFAULT_THEME_DASHBOARD_COLUMNS } from '@/theme/theme-dashboard'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { Text } from '@/typography'
import {
  createDashboardLayoutsFromPreset,
  type DashboardBreakpointConfig,
  type DashboardColumnConfig,
  DashboardLayout,
  type DashboardLayoutBreakpoint,
  type DashboardLayoutChangeDetails,
  type DashboardLayoutItem,
  type DashboardLayoutMode,
  type DashboardLayoutPacking,
  type DashboardLayoutPreset,
  type DashboardLayoutProps,
  type DashboardResizeHandle,
  type DashboardResponsiveLayoutItems,
  dashboardLayoutBreakpoints,
  dashboardLayoutPresets,
  getDashboardBreakpointForWidth,
  getDashboardColumnsForBreakpoint,
  getDashboardLayoutBreakpoint,
  isDashboardLayoutPresetDirty,
  normalizeDashboardResponsiveLayouts,
  packDashboardLayoutItems,
  updateDashboardLayoutsWithItems,
} from './DashboardLayout'
import {
  builderBody,
  builderCanvas,
  builderError,
  builderJsonTextarea,
  builderLayout,
  builderPanel,
  builderRoot,
} from './dashboard-builder.css'
import { EditableDashboard, EditableDashboardLayoutPanel } from './EditableDashboard'

export interface DashboardBuilderGapOption {
  id: string
  label: string
  value: number
}

export interface DashboardBuilderLayoutChangeDetails {
  reason: DashboardLayoutChangeDetails['reason'] | 'cleanup' | 'json' | 'preset'
  breakpoint: DashboardLayoutBreakpoint
  layouts: DashboardResponsiveLayoutItems
  presetId?: string
  itemId?: string
  item?: DashboardLayoutItem
}

export interface DashboardBuilderProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  items?: readonly DashboardLayoutItem[]
  layouts?: DashboardResponsiveLayoutItems
  defaultLayouts?: DashboardResponsiveLayoutItems
  onLayoutsChange?: (layouts: DashboardResponsiveLayoutItems, details: DashboardBuilderLayoutChangeDetails) => void
  mode?: DashboardLayoutMode
  defaultMode?: DashboardLayoutMode
  onModeChange?: (mode: DashboardLayoutMode) => void
  editable?: boolean
  defaultEditable?: boolean
  onEditableChange?: (editable: boolean) => void
  packing?: Exclude<DashboardLayoutPacking, 'none'>
  defaultPacking?: Exclude<DashboardLayoutPacking, 'none'>
  onPackingChange?: (packing: Exclude<DashboardLayoutPacking, 'none'>) => void
  gap?: number
  defaultGap?: number
  gapOptions?: readonly DashboardBuilderGapOption[]
  onGapChange?: (gap: number) => void
  presets?: readonly DashboardLayoutPreset[]
  templates?: readonly DashboardLayoutPreset[]
  defaultTemplates?: readonly DashboardLayoutPreset[]
  onTemplatesChange?: (templates: DashboardLayoutPreset[]) => void
  presetId?: string
  defaultPresetId?: string
  onPresetIdChange?: (presetId: string) => void
  columns?: DashboardColumnConfig
  breakpoints?: DashboardBreakpointConfig
  rowHeight?: number
  masonryColumnWidth?: number
  masonryMaxColumnCount?: number
  resizeHandles?: readonly DashboardResizeHandle[]
  showJsonPanel?: boolean
  renderItem?: DashboardLayoutProps['renderItem']
  itemClassName?: DashboardLayoutProps['itemClassName']
  itemStyle?: DashboardLayoutProps['itemStyle']
  layoutClassName?: string
  layoutStyle?: React.CSSProperties
}

const DEFAULT_BUILDER_GAP = DEFAULT_THEME_DASHBOARD.gap
const DEFAULT_BUILDER_COLUMNS: DashboardColumnConfig = {
  ...DEFAULT_THEME_DASHBOARD_COLUMNS,
}
const DEFAULT_BUILDER_BREAKPOINTS: DashboardBreakpointConfig = {
  ...DEFAULT_THEME_BREAKPOINTS,
}
const DEFAULT_BUILDER_GAP_OPTIONS: readonly DashboardBuilderGapOption[] = [
  { id: 'compact', label: 'Compact', value: 8 },
  { id: 'default', label: 'Default', value: 12 },
  { id: 'comfortable', label: 'Comfortable', value: 20 },
]
const DEFAULT_BUILDER_PACKING: Exclude<DashboardLayoutPacking, 'none'> = 'vertical'
const DASHBOARD_BUILDER_MASONRY_PRESET_ID = 'masonry'
const DASHBOARD_BUILDER_MASONRY_PRESET: DashboardLayoutPreset = {
  id: DASHBOARD_BUILDER_MASONRY_PRESET_ID,
  name: 'Masonry',
  description: 'Column flow ordered by widget sequence.',
  mode: 'masonry',
  columns: 3,
  rows: 4,
  items: [
    { id: 'masonry-a', x: 0, y: 0, w: 1, h: 2 },
    { id: 'masonry-b', x: 1, y: 0, w: 1, h: 1 },
    { id: 'masonry-c', x: 2, y: 0, w: 1, h: 3 },
    { id: 'masonry-d', x: 1, y: 1, w: 1, h: 2 },
    { id: 'masonry-e', x: 0, y: 2, w: 1, h: 1 },
  ],
}

export function DashboardBuilder({
  items,
  layouts,
  defaultLayouts,
  onLayoutsChange,
  mode,
  defaultMode = 'grid',
  onModeChange,
  editable,
  defaultEditable = true,
  onEditableChange,
  packing,
  defaultPacking = DEFAULT_BUILDER_PACKING,
  onPackingChange,
  gap,
  defaultGap,
  gapOptions = DEFAULT_BUILDER_GAP_OPTIONS,
  onGapChange,
  presets = dashboardLayoutPresets,
  templates,
  defaultTemplates = [],
  onTemplatesChange,
  presetId,
  defaultPresetId,
  onPresetIdChange,
  columns,
  breakpoints,
  rowHeight = 32,
  masonryColumnWidth = 240,
  masonryMaxColumnCount,
  resizeHandles,
  showJsonPanel = true,
  renderItem,
  itemClassName,
  itemStyle,
  layoutClassName,
  layoutStyle,
  className,
  ...rootProps
}: DashboardBuilderProps) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const theme = useOptionalThemeProviderContext()
  const resolvedColumns: DashboardColumnConfig = columns ?? theme?.dashboard.columns ?? DEFAULT_BUILDER_COLUMNS
  const resolvedBreakpoints: DashboardBreakpointConfig =
    breakpoints ?? theme?.breakpoints ?? DEFAULT_BUILDER_BREAKPOINTS
  const resolvedDefaultGap = defaultGap ?? theme?.dashboard.gap ?? DEFAULT_BUILDER_GAP
  const canvasWidth = useDashboardBuilderElementWidth(canvasRef, 1280)
  const isTemplatesControlled = templates !== undefined
  const [uncontrolledTemplates, setUncontrolledTemplates] = React.useState<DashboardLayoutPreset[]>(() => [
    ...defaultTemplates,
  ])
  const resolvedTemplates = templates ?? uncontrolledTemplates
  const setResolvedTemplates = React.useCallback(
    (nextTemplates: DashboardLayoutPreset[]) => {
      if (!isTemplatesControlled) setUncontrolledTemplates(nextTemplates)
      onTemplatesChange?.(nextTemplates)
    },
    [isTemplatesControlled, onTemplatesChange],
  )
  const canSaveTemplates = !isTemplatesControlled || Boolean(onTemplatesChange)
  const layoutPresets = React.useMemo(() => {
    const mergedPresets = mergeDashboardLayoutPresets(
      [...presets, ...resolvedTemplates].filter(preset => !isReservedDashboardBuilderPresetCollision(preset)),
    )
    return mergedPresets.some(preset => isDashboardBuilderMasonryPreset(preset))
      ? mergedPresets
      : [...mergedPresets, DASHBOARD_BUILDER_MASONRY_PRESET]
  }, [presets, resolvedTemplates])
  const resolvedDefaultPresetId =
    defaultPresetId && layoutPresets.some(preset => preset.id === defaultPresetId)
      ? defaultPresetId
      : layoutPresets[0]?.id
  const initialPreset = layoutPresets.find(preset => preset.id === resolvedDefaultPresetId) ?? layoutPresets[0]
  const isLayoutsControlled = layouts !== undefined
  const [uncontrolledLayouts, setUncontrolledLayouts] = React.useState<DashboardResponsiveLayoutItems>(() =>
    defaultLayouts
      ? normalizeDashboardResponsiveLayouts(defaultLayouts, {
          breakpoints: resolvedBreakpoints,
          columns: resolvedColumns,
        })
      : createDashboardLayoutsFromPreset(initialPreset, {
          breakpoints: resolvedBreakpoints,
          columns: resolvedColumns,
          items,
        }),
  )
  const resolvedLayouts = layouts ?? uncontrolledLayouts
  const latestLayouts = React.useRef(resolvedLayouts)
  latestLayouts.current = resolvedLayouts

  const [resolvedMode, setResolvedMode] = useDashboardBuilderState({
    value: mode,
    defaultValue: initialPreset && isDashboardBuilderMasonryPreset(initialPreset) ? 'masonry' : defaultMode,
    onChange: onModeChange,
  })
  const [resolvedEditable] = useDashboardBuilderState({
    value: editable,
    defaultValue: defaultEditable,
    onChange: onEditableChange,
  })
  const [resolvedPacking, setResolvedPacking] = useDashboardBuilderState({
    value: packing,
    defaultValue: defaultPacking,
    onChange: onPackingChange,
  })
  const [resolvedGap, setResolvedGap] = useDashboardBuilderState({
    value: gap,
    defaultValue: normalizeDashboardBuilderGap(resolvedDefaultGap),
    onChange: onGapChange,
  })
  const [resolvedPresetId, setResolvedPresetId] = useDashboardBuilderState<string>({
    value: presetId,
    defaultValue: resolvedDefaultPresetId ?? '',
    onChange: onPresetIdChange,
  })

  const activeBreakpoint = getDashboardBreakpointForWidth(canvasWidth, resolvedBreakpoints)
  const activeLayoutBreakpoint =
    getDashboardLayoutBreakpoint(resolvedLayouts, activeBreakpoint, resolvedBreakpoints) ?? activeBreakpoint
  const activeItems = resolvedLayouts[activeLayoutBreakpoint] ?? []
  const activeColumns = getDashboardColumnsForBreakpoint(activeLayoutBreakpoint, resolvedColumns, resolvedBreakpoints)
  const canEditGrid = resolvedMode === 'grid'
  const effectiveEditable = canEditGrid && resolvedEditable
  const selectedPreset = layoutPresets.find(preset => preset.id === resolvedPresetId)
  const templateDirty = isDashboardLayoutPresetDirty(selectedPreset, activeItems, activeColumns)
  const serializedLayouts = React.useMemo(() => JSON.stringify(resolvedLayouts, null, 2), [resolvedLayouts])
  const [jsonText, setJsonText] = React.useState(serializedLayouts)
  const [jsonDirty, setJsonDirty] = React.useState(false)
  const [jsonError, setJsonError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!jsonDirty) setJsonText(serializedLayouts)
  }, [jsonDirty, serializedLayouts])

  const commitLayouts = React.useCallback(
    (
      update:
        | DashboardResponsiveLayoutItems
        | ((current: DashboardResponsiveLayoutItems) => DashboardResponsiveLayoutItems),
      details: Omit<DashboardBuilderLayoutChangeDetails, 'layouts'>,
    ) => {
      const current = latestLayouts.current
      const next = typeof update === 'function' ? update(current) : update
      latestLayouts.current = next

      if (!isLayoutsControlled) setUncontrolledLayouts(next)
      onLayoutsChange?.(next, { ...details, layouts: next })
      setJsonText(JSON.stringify(next, null, 2))
      setJsonDirty(false)
      setJsonError(null)
    },
    [isLayoutsControlled, onLayoutsChange],
  )

  const handleApplyJson = React.useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText) as unknown
      if (!isDashboardResponsiveLayoutJson(parsed)) {
        setJsonError('Expected an object keyed by initial/xs/sm/md/lg/xl with dashboard item arrays.')
        return
      }

      const next = normalizeDashboardResponsiveLayouts(parsed, {
        breakpoints: resolvedBreakpoints,
        columns: resolvedColumns,
      })
      commitLayouts(next, { reason: 'json', breakpoint: activeBreakpoint })
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }, [activeBreakpoint, commitLayouts, jsonText, resolvedBreakpoints, resolvedColumns])

  const handleApplyPreset = React.useCallback(
    (preset: DashboardLayoutPreset) => {
      setResolvedPresetId(preset.id)
      if (isDashboardBuilderMasonryPreset(preset)) {
        setResolvedMode('masonry')
        return
      }

      setResolvedMode('grid')
      commitLayouts(
        current => {
          const layoutBreakpoint =
            getDashboardLayoutBreakpoint(current, activeBreakpoint, resolvedBreakpoints) ?? activeBreakpoint
          const sourceItems = items?.length ? items : (current[layoutBreakpoint] ?? [])
          return createDashboardLayoutsFromPreset(preset, {
            breakpoints: resolvedBreakpoints,
            columns: resolvedColumns,
            items: sourceItems,
          })
        },
        {
          reason: 'preset',
          breakpoint: activeBreakpoint,
          presetId: preset.id,
        },
      )
    },
    [
      activeBreakpoint,
      commitLayouts,
      items,
      resolvedBreakpoints,
      resolvedColumns,
      setResolvedMode,
      setResolvedPresetId,
    ],
  )

  const handleLayoutChange = React.useCallback(
    (nextItems: DashboardLayoutItem[], details: DashboardLayoutChangeDetails) => {
      commitLayouts(current => updateDashboardLayoutsWithItems(current, details.breakpoint, nextItems), {
        reason: details.reason,
        breakpoint: details.breakpoint,
        itemId: details.itemId,
        item: details.item,
      })
    },
    [commitLayouts],
  )

  const handleCleanupLayout = React.useCallback(() => {
    if (!effectiveEditable) return

    commitLayouts(
      current => {
        const layoutBreakpoint =
          getDashboardLayoutBreakpoint(current, activeBreakpoint, resolvedBreakpoints) ?? activeBreakpoint
        const currentItems = current[layoutBreakpoint] ?? []
        const nextItems = packDashboardLayoutItems(
          currentItems,
          getDashboardColumnsForBreakpoint(activeBreakpoint, resolvedColumns, resolvedBreakpoints),
          resolvedPacking,
        )

        return updateDashboardLayoutsWithItems(current, activeBreakpoint, nextItems)
      },
      {
        reason: 'cleanup',
        breakpoint: activeBreakpoint,
      },
    )
  }, [activeBreakpoint, commitLayouts, effectiveEditable, resolvedBreakpoints, resolvedColumns, resolvedPacking])

  const handleSaveTemplate = React.useCallback(
    (template: DashboardLayoutPreset) => {
      if (!canSaveTemplates) return

      const nextTemplate = {
        ...template,
        id: getUniqueDashboardPresetId(
          template.id,
          [...presets, ...resolvedTemplates, DASHBOARD_BUILDER_MASONRY_PRESET].map(preset => preset.id),
        ),
      }
      setResolvedTemplates([...resolvedTemplates, nextTemplate])
      setResolvedPresetId(nextTemplate.id)
    },
    [canSaveTemplates, presets, resolvedTemplates, setResolvedPresetId, setResolvedTemplates],
  )

  return (
    <div {...rootProps} className={cn(builderRoot, className)}>
      <div className={builderBody}>
        <div ref={canvasRef} className={builderCanvas}>
          {effectiveEditable ? (
            <EditableDashboard
              layouts={resolvedLayouts}
              mode={resolvedMode}
              columns={resolvedColumns}
              breakpoints={resolvedBreakpoints}
              rowHeight={rowHeight}
              gap={resolvedGap}
              masonryColumnWidth={masonryColumnWidth}
              masonryMaxColumnCount={masonryMaxColumnCount}
              resizeHandles={resizeHandles}
              packing="none"
              className={cn(builderLayout, layoutClassName)}
              style={layoutStyle}
              itemClassName={itemClassName}
              itemStyle={itemStyle}
              onLayoutChange={handleLayoutChange}
              renderItem={renderItem}
            />
          ) : (
            <DashboardLayout
              layouts={resolvedLayouts}
              mode={resolvedMode}
              columns={resolvedColumns}
              breakpoints={resolvedBreakpoints}
              rowHeight={rowHeight}
              gap={resolvedGap}
              masonryColumnWidth={masonryColumnWidth}
              masonryMaxColumnCount={masonryMaxColumnCount}
              packing="none"
              className={cn(builderLayout, layoutClassName)}
              style={layoutStyle}
              itemClassName={itemClassName}
              itemStyle={itemStyle}
              renderItem={renderItem}
            />
          )}
        </div>

        <Grid gap="3" minWidth="0">
          <EditableDashboardLayoutPanel
            activeBreakpoint={activeBreakpoint}
            canEditGrid={effectiveEditable}
            gap={resolvedGap}
            gapOptions={gapOptions}
            packing={resolvedPacking}
            presets={layoutPresets}
            presetId={resolvedPresetId}
            templateColumns={activeColumns}
            templateDirty={templateDirty}
            templateItems={activeItems}
            onCleanup={handleCleanupLayout}
            onGapChange={setResolvedGap}
            onPackingChange={setResolvedPacking}
            onPresetChange={handleApplyPreset}
            onSaveTemplate={canSaveTemplates ? handleSaveTemplate : undefined}
          />

          {showJsonPanel ? (
            <section className={builderPanel}>
              <Row align="center" justify="between" gap="3" minWidth="0">
                <Text size="sm" weight="medium" truncate>
                  Responsive JSON
                </Text>
                <Icon icon="file-text" size="xs" color="slate" aria-hidden />
              </Row>
              <Row wrap="wrap" align="center" gap="1" minWidth="0">
                <Button size="xs" variant="outline" color="slate" iconStart="check-circle" onClick={handleApplyJson}>
                  Apply JSON
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  color="slate"
                  iconStart="refresh-cw"
                  onClick={() => {
                    setJsonText(serializedLayouts)
                    setJsonDirty(false)
                    setJsonError(null)
                  }}
                >
                  Revert
                </Button>
              </Row>
              {jsonError ? <div className={builderError}>{jsonError}</div> : null}
              <textarea
                aria-label="Dashboard responsive layouts JSON"
                className={builderJsonTextarea}
                spellCheck={false}
                value={jsonText}
                onChange={event => {
                  setJsonText(event.currentTarget.value)
                  setJsonDirty(true)
                  setJsonError(null)
                }}
              />
            </section>
          ) : null}
        </Grid>
      </div>
    </div>
  )
}

function useDashboardBuilderState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined
  defaultValue: T
  onChange?: (value: T) => void
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const resolvedValue = isControlled ? value : uncontrolledValue

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) setUncontrolledValue(nextValue)
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  return [resolvedValue, setValue] as const
}

function useDashboardBuilderElementWidth(ref: React.RefObject<HTMLElement | null>, fallbackWidth: number) {
  const [width, setWidth] = React.useState(fallbackWidth)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const updateWidth = () => setWidth(Math.round(element.getBoundingClientRect().width || fallbackWidth))
    updateWidth()

    if (typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [fallbackWidth, ref])

  return width
}

function mergeDashboardLayoutPresets(presets: readonly DashboardLayoutPreset[]) {
  const merged = new Map<string, DashboardLayoutPreset>()
  for (const preset of presets) {
    merged.set(preset.id, preset)
  }
  return Array.from(merged.values())
}

function getUniqueDashboardPresetId(id: string, existingIds: readonly string[]) {
  const existing = new Set(existingIds)
  if (!existing.has(id)) return id

  let index = 2
  let nextId = `${id}-${index}`
  while (existing.has(nextId)) {
    index += 1
    nextId = `${id}-${index}`
  }
  return nextId
}

function isDashboardBuilderMasonryPreset(preset: DashboardLayoutPreset) {
  return preset.mode === 'masonry' || preset.id === DASHBOARD_BUILDER_MASONRY_PRESET_ID
}

function isReservedDashboardBuilderPresetCollision(preset: DashboardLayoutPreset) {
  return preset.id === DASHBOARD_BUILDER_MASONRY_PRESET_ID && preset.mode !== 'masonry'
}

function isDashboardResponsiveLayoutJson(value: unknown): value is DashboardResponsiveLayoutItems {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  return Object.entries(value).every(
    ([breakpoint, items]) =>
      dashboardLayoutBreakpoints.includes(breakpoint as DashboardLayoutBreakpoint) &&
      Array.isArray(items) &&
      items.every(isDashboardLayoutJsonItem),
  )
}

function isDashboardLayoutJsonItem(value: unknown): value is DashboardLayoutItem {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const item = value as Partial<DashboardLayoutItem>
  return (
    typeof item.id === 'string' &&
    typeof item.x === 'number' &&
    typeof item.y === 'number' &&
    typeof item.w === 'number' &&
    typeof item.h === 'number'
  )
}

function normalizeDashboardBuilderGap(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_BUILDER_GAP
  return Math.max(0, Math.round(value))
}
