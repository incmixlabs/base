import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { AppShell } from '@/layouts/app-shell/AppShell'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { EditableDashboard, EditableDashboardLayoutPanel, EditableDashboardSecondaryPanel } from './EditableDashboard'
import {
  createDashboardItemsFromPreset,
  createDashboardLayoutsFromPreset,
  dashboardLayoutBreakpoints,
  DashboardLayout,
  getDashboardBreakpointForWidth,
  getDashboardColumnsForBreakpoint,
  getDashboardLayoutBreakpoint,
  isDashboardLayoutPresetDirty,
  type DashboardLayoutBreakpoint,
  type DashboardLayoutItem,
  type DashboardLayoutMode,
  type DashboardLayoutPacking,
  type DashboardLayoutPreset,
  DashboardLayoutModeControl,
  DashboardPresetPicker,
  type DashboardResponsiveLayoutItems,
  dashboardLayoutPresets,
  normalizeDashboardResponsiveLayouts,
  packDashboardLayoutItems,
  updateDashboardLayoutsWithItems,
} from './DashboardLayout'
import {
  dashboardBreakpointsFromRglBreakpoints,
  dashboardColumnsFromRglCols,
  dashboardLayoutItemsFromRglLayouts,
  dashboardResponsiveLayoutItemsFromRglLayouts,
  dashboardRglDefaultCols,
  getDashboardRglBreakpointForWidth,
  type DashboardRglLayouts,
  updateRglLayoutsWithDashboardItems,
} from './rgl-migration'

const meta: Meta<typeof DashboardLayout> = {
  title: 'Layouts/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const packingModes: readonly Exclude<DashboardLayoutPacking, 'none'>[] = ['vertical', 'horizontal', 'dense']
const dashboardGapOptions = [
  { id: 'compact', label: 'Compact', gap: 8 },
  { id: 'default', label: 'Default', gap: 12 },
  { id: 'comfortable', label: 'Comfortable', gap: 20 },
] as const
const DEFAULT_STORY_DASHBOARD_GAP_OPTIONS = dashboardGapOptions.map(option => ({
  id: option.id,
  label: option.label,
  value: option.gap,
}))
const dashboardViewportOptions = [
  { id: 'desktop', label: 'Desktop', icon: 'monitor', maxWidth: '100%' },
  { id: 'tablet', label: 'Tablet', icon: 'tablet', maxWidth: '820px' },
  { id: 'mobile', label: 'Mobile', icon: 'smartphone', maxWidth: '390px' },
] as const
type DashboardViewportId = (typeof dashboardViewportOptions)[number]['id']

const widgetNames = [
  'Revenue',
  'Pipeline',
  'Conversion',
  'Churn',
  'Forecast',
  'Incidents',
  'Usage',
  'NPS',
  'Customers',
  'Tasks',
  'Calendar',
  'Activity',
  'Spend',
  'Regions',
  'Health',
  'Notes',
]

const responsiveJsonLayouts: DashboardRglLayouts = {
  lg: [
    { i: 'revenue', x: 0, y: 0, w: 3, h: 5, componentName: 'revenue-card', title: 'Revenue' },
    { i: 'pipeline', x: 3, y: 0, w: 3, h: 5, componentName: 'pipeline-card', title: 'Pipeline' },
    { i: 'conversion', x: 6, y: 0, w: 3, h: 5, componentName: 'conversion-card', title: 'Conversion' },
    { i: 'activity', x: 9, y: 0, w: 3, h: 10, componentName: 'activity-card', title: 'Activity' },
    { i: 'usage', x: 0, y: 7, w: 6, h: 5, componentName: 'usage-card', title: 'Usage' },
    { i: 'forecast', x: 6, y: 7, w: 3, h: 5, componentName: 'forecast-card', title: 'Forecast' },
  ],
  md: [
    { i: 'revenue', x: 0, y: 0, w: 5, h: 5, componentName: 'revenue-card', title: 'Revenue' },
    { i: 'pipeline', x: 5, y: 0, w: 5, h: 5, componentName: 'pipeline-card', title: 'Pipeline' },
    { i: 'conversion', x: 0, y: 7, w: 5, h: 5, componentName: 'conversion-card', title: 'Conversion' },
    { i: 'activity', x: 5, y: 7, w: 5, h: 10, componentName: 'activity-card', title: 'Activity' },
    { i: 'usage', x: 0, y: 14, w: 5, h: 5, componentName: 'usage-card', title: 'Usage' },
    { i: 'forecast', x: 5, y: 19, w: 5, h: 5, componentName: 'forecast-card', title: 'Forecast' },
  ],
  sm: [
    { i: 'revenue', x: 0, y: 0, w: 3, h: 5, componentName: 'revenue-card', title: 'Revenue' },
    { i: 'pipeline', x: 3, y: 0, w: 3, h: 5, componentName: 'pipeline-card', title: 'Pipeline' },
    { i: 'conversion', x: 0, y: 7, w: 3, h: 5, componentName: 'conversion-card', title: 'Conversion' },
    { i: 'activity', x: 3, y: 7, w: 3, h: 10, componentName: 'activity-card', title: 'Activity' },
    { i: 'usage', x: 0, y: 14, w: 3, h: 5, componentName: 'usage-card', title: 'Usage' },
    { i: 'forecast', x: 3, y: 19, w: 3, h: 5, componentName: 'forecast-card', title: 'Forecast' },
  ],
  xs: [
    { i: 'revenue', x: 0, y: 0, w: 4, h: 5, componentName: 'revenue-card', title: 'Revenue' },
    { i: 'pipeline', x: 0, y: 6, w: 4, h: 5, componentName: 'pipeline-card', title: 'Pipeline' },
    { i: 'conversion', x: 0, y: 12, w: 4, h: 5, componentName: 'conversion-card', title: 'Conversion' },
    { i: 'activity', x: 0, y: 18, w: 4, h: 8, componentName: 'activity-card', title: 'Activity' },
    { i: 'usage', x: 0, y: 27, w: 4, h: 5, componentName: 'usage-card', title: 'Usage' },
    { i: 'forecast', x: 0, y: 33, w: 4, h: 5, componentName: 'forecast-card', title: 'Forecast' },
  ],
  xxs: [
    { i: 'revenue', x: 0, y: 0, w: 2, h: 5, componentName: 'revenue-card', title: 'Revenue' },
    { i: 'pipeline', x: 0, y: 6, w: 2, h: 5, componentName: 'pipeline-card', title: 'Pipeline' },
    { i: 'conversion', x: 0, y: 12, w: 2, h: 5, componentName: 'conversion-card', title: 'Conversion' },
    { i: 'activity', x: 0, y: 18, w: 2, h: 8, componentName: 'activity-card', title: 'Activity' },
    { i: 'usage', x: 0, y: 27, w: 2, h: 5, componentName: 'usage-card', title: 'Usage' },
    { i: 'forecast', x: 0, y: 33, w: 2, h: 5, componentName: 'forecast-card', title: 'Forecast' },
  ],
}

const directDashboardJsonColumns = { initial: 1, xs: 2, sm: 4, md: 8, lg: 12, xl: 12 }
const directDashboardJsonBreakpoints = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280 }
const directDashboardJsonLayouts: DashboardResponsiveLayoutItems = {
  initial: [
    { id: 'revenue', title: 'Revenue', componentName: 'revenue-card', x: 0, y: 0, w: 1, h: 3 },
    { id: 'pipeline', title: 'Pipeline', componentName: 'pipeline-card', x: 0, y: 3, w: 1, h: 3 },
    { id: 'conversion', title: 'Conversion', componentName: 'conversion-card', x: 0, y: 6, w: 1, h: 3 },
    { id: 'activity', title: 'Activity', componentName: 'activity-card', x: 0, y: 9, w: 1, h: 4 },
  ],
  sm: [
    { id: 'revenue', title: 'Revenue', componentName: 'revenue-card', x: 0, y: 0, w: 2, h: 3 },
    { id: 'pipeline', title: 'Pipeline', componentName: 'pipeline-card', x: 2, y: 0, w: 2, h: 3 },
    { id: 'conversion', title: 'Conversion', componentName: 'conversion-card', x: 0, y: 3, w: 2, h: 3 },
    { id: 'activity', title: 'Activity', componentName: 'activity-card', x: 2, y: 3, w: 2, h: 4 },
  ],
  md: [
    { id: 'revenue', title: 'Revenue', componentName: 'revenue-card', x: 0, y: 0, w: 3, h: 3 },
    { id: 'pipeline', title: 'Pipeline', componentName: 'pipeline-card', x: 3, y: 0, w: 3, h: 3 },
    { id: 'conversion', title: 'Conversion', componentName: 'conversion-card', x: 6, y: 0, w: 2, h: 3 },
    { id: 'activity', title: 'Activity', componentName: 'activity-card', x: 0, y: 3, w: 8, h: 4 },
  ],
  lg: [
    { id: 'revenue', title: 'Revenue', componentName: 'revenue-card', x: 0, y: 0, w: 3, h: 4 },
    { id: 'pipeline', title: 'Pipeline', componentName: 'pipeline-card', x: 3, y: 0, w: 3, h: 4 },
    { id: 'conversion', title: 'Conversion', componentName: 'conversion-card', x: 6, y: 0, w: 3, h: 4 },
    { id: 'activity', title: 'Activity', componentName: 'activity-card', x: 9, y: 0, w: 3, h: 8 },
  ],
}

function makePresetItems(preset = dashboardLayoutPresets[2]): DashboardLayoutItem[] {
  return createDashboardItemsFromPreset(preset).map((item, index) => ({
    ...item,
    title: widgetNames[index] ?? item.id,
    componentName: `widget-${index + 1}`,
  }))
}

function renderWidget(item: DashboardLayoutItem, index: number) {
  const value = 28 + index * 7
  const title = item.title ?? widgetNames[index % widgetNames.length] ?? item.id
  const componentName = item.componentName ?? item.id
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">{title}</div>
          <div className="mt-1 text-muted-foreground text-xs">{componentName}</div>
        </div>
        <div className="rounded bg-muted px-2 py-1 font-medium text-xs">{value}%</div>
      </div>
      <div className="mt-auto grid gap-2">
        <div className="h-2 rounded bg-muted">
          <div className="h-full rounded bg-primary" style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="h-8 rounded bg-muted/70" />
          <span className="h-8 rounded bg-muted/70" />
          <span className="h-8 rounded bg-muted/70" />
        </div>
      </div>
    </div>
  )
}

function useStoryElementWidth(ref: React.RefObject<HTMLElement | null>, fallbackWidth: number) {
  const [width, setWidth] = React.useState(fallbackWidth)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const updateWidth = () => setWidth(Math.round(element.getBoundingClientRect().width || fallbackWidth))
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [fallbackWidth, ref])

  return width
}

function getUniqueStoryPresetId(id: string, existingIds: readonly string[]) {
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

function isDashboardViewportId(value: string): value is DashboardViewportId {
  return dashboardViewportOptions.some(option => option.id === value)
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

export const Presets: Story = {
  render: () => <DashboardPresetPicker className="max-w-5xl p-6" />,
}

export const GridPreset: Story = {
  render: () => {
    const preset = dashboardLayoutPresets[2]
    const items = makePresetItems(preset)

    return (
      <div className="p-6">
        <DashboardLayout
          items={items}
          columns={preset.columns}
          rowHeight={112}
          gap={12}
          className="max-w-5xl"
          renderItem={item =>
            renderWidget(
              item,
              items.findIndex(candidate => candidate.id === item.id),
            )
          }
          itemClassName={(_item, state) => (state.dragging ? 'ring-2 ring-ring' : undefined)}
        />
      </div>
    )
  },
}

export const EditableGrid: Story = {
  render: function EditableGridStory() {
    const preset = dashboardLayoutPresets[0]
    const [items, setItems] = React.useState<DashboardLayoutItem[]>(() => makePresetItems(preset))

    return (
      <div className="p-6">
        <EditableDashboard
          items={items}
          columns={preset.columns}
          rowHeight={104}
          gap={12}
          className="max-w-4xl"
          onLayoutChange={setItems}
          renderItem={item =>
            renderWidget(
              item,
              items.findIndex(candidate => candidate.id === item.id),
            )
          }
          itemClassName={(_item, state) => (state.dragging ? 'ring-2 ring-ring' : undefined)}
        />
      </div>
    )
  },
}

export const ThemeGapPreference: Story = {
  render: function ThemeGapPreferenceStory() {
    const preset = dashboardLayoutPresets[2]
    const items = React.useMemo(() => makePresetItems(preset), [preset])
    const [gapId, setGapId] = React.useState<(typeof dashboardGapOptions)[number]['id']>('default')
    const activeGap = dashboardGapOptions.find(option => option.id === gapId) ?? dashboardGapOptions[1]

    return (
      <ThemeProvider dashboard={{ gap: activeGap.gap }} className="min-h-[640px] p-6">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {dashboardGapOptions.map(option => (
              <button
                key={option.id}
                type="button"
                aria-pressed={option.id === gapId}
                className={`rounded border px-3 py-1.5 font-medium text-sm ${
                  option.id === gapId ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
                }`}
                onClick={() => setGapId(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <DashboardLayout
            items={items}
            columns={preset.columns}
            rowHeight={112}
            className="max-w-5xl"
            renderItem={item =>
              renderWidget(
                item,
                items.findIndex(candidate => candidate.id === item.id),
              )
            }
          />
        </div>
      </ThemeProvider>
    )
  },
}

export const PresetAndModePreference: Story = {
  render: function PresetAndModePreferenceStory() {
    const [mode, setMode] = React.useState<DashboardLayoutMode>('grid')
    const [preset, setPreset] = React.useState(dashboardLayoutPresets[3])
    const [items, setItems] = React.useState<DashboardLayoutItem[]>(() => makePresetItems(preset))

    return (
      <div className="grid gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DashboardLayoutModeControl value={mode} onValueChange={setMode} />
        </div>
        <DashboardPresetPicker
          value={preset.id}
          onValueChange={nextPreset => {
            setPreset(nextPreset)
            setItems(makePresetItems(nextPreset))
          }}
        />
        <EditableDashboard
          items={items}
          mode={mode}
          columns={preset.columns}
          rowHeight={128}
          gap={12}
          className="max-w-5xl"
          onLayoutChange={setItems}
          renderItem={item =>
            renderWidget(
              item,
              items.findIndex(candidate => candidate.id === item.id),
            )
          }
        />
      </div>
    )
  },
}

export const MasonryMode: Story = {
  render: () => {
    const items: DashboardLayoutItem[] = Array.from({ length: 18 }, (_, index) => ({
      id: `masonry-${index + 1}`,
      title: widgetNames[index % widgetNames.length],
      componentName: `masonry-widget-${index + 1}`,
      x: index % 4,
      y: Math.floor(index / 4),
      w: 1,
      h: 1,
      meta: {
        height: 120 + (index % 5) * 34,
      },
    }))

    return (
      <div className="min-h-[720px] p-6">
        <DashboardLayout
          items={items}
          mode="masonry"
          columns={{ initial: 1, sm: 2, md: 3, lg: 4 }}
          masonryColumnWidth={220}
          gap={12}
          className="max-w-6xl"
          renderItem={item => {
            const height = typeof item.meta?.height === 'number' ? item.meta.height : 160
            return (
              <div className="grid gap-3 p-4" style={{ minHeight: height }}>
                {renderWidget(
                  item,
                  items.findIndex(candidate => candidate.id === item.id),
                )}
              </div>
            )
          }}
        />
      </div>
    )
  },
}

export const ReactGridLayoutMigration: Story = {
  render: function ReactGridLayoutMigrationStory() {
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const viewportWidth = useStoryElementWidth(viewportRef, 1280)
    const activeBreakpoint = getDashboardRglBreakpointForWidth(viewportWidth)
    const [legacyLayouts, setLegacyLayouts] = React.useState<DashboardRglLayouts>({
      lg: [
        { i: 'revenue', x: 0, y: 0, w: 4, h: 5, componentName: 'revenue-card' },
        { i: 'pipeline', x: 4, y: 0, w: 4, h: 5, componentName: 'pipeline-card' },
        {
          i: 'grid-a',
          x: 8,
          y: 0,
          w: 4,
          h: 10,
          compactType: 'vertical',
          layouts: [
            { i: 'grid-a|0', x: 0, y: 0, w: 6, h: 5, componentName: 'nested-a' },
            { i: 'grid-a|1', x: 6, y: 0, w: 6, h: 5, componentName: 'nested-b' },
          ],
        },
        { i: 'usage', x: 0, y: 5, w: 8, h: 5, componentName: 'usage-card' },
      ],
      xxs: [
        { i: 'revenue', x: 0, y: 0, w: 2, h: 5, componentName: 'revenue-card' },
        { i: 'pipeline', x: 0, y: 5, w: 2, h: 5, componentName: 'pipeline-card' },
        { i: 'grid-a', x: 0, y: 10, w: 2, h: 10, componentName: 'grid-group' },
        { i: 'usage', x: 0, y: 20, w: 2, h: 5, componentName: 'usage-card' },
      ],
    })
    const items = React.useMemo(
      () => dashboardLayoutItemsFromRglLayouts(legacyLayouts, activeBreakpoint),
      [activeBreakpoint, legacyLayouts],
    )

    return (
      <div ref={viewportRef} className="p-6">
        <EditableDashboard
          items={items}
          columns={dashboardColumnsFromRglCols(dashboardRglDefaultCols)}
          breakpoints={dashboardBreakpointsFromRglBreakpoints()}
          rowHeight={28}
          gap={12}
          className="max-w-6xl"
          onLayoutChange={nextItems =>
            setLegacyLayouts(current => updateRglLayoutsWithDashboardItems(current, activeBreakpoint, nextItems))
          }
          renderItem={item => {
            const index = items.findIndex(candidate => candidate.id === item.id)
            return renderWidget(item, index)
          }}
        />
      </div>
    )
  },
}

export const ResponsiveDashboardJsonLayouts: Story = {
  render: function ResponsiveDashboardJsonLayoutsStory() {
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const viewportWidth = useStoryElementWidth(viewportRef, 1280)
    const activeBreakpoint = getDashboardBreakpointForWidth(viewportWidth, directDashboardJsonBreakpoints)
    const [editable, setEditable] = React.useState(true)
    const [layouts, setLayouts] = React.useState<DashboardResponsiveLayoutItems>(() =>
      normalizeDashboardResponsiveLayouts(directDashboardJsonLayouts, { columns: directDashboardJsonColumns }),
    )
    const [jsonText, setJsonText] = React.useState(() => JSON.stringify(layouts, null, 2))
    const [jsonError, setJsonError] = React.useState<string | null>(null)
    const activeLayoutBreakpoint = getDashboardLayoutBreakpoint(layouts, activeBreakpoint) ?? activeBreakpoint
    const activeItems = layouts[activeLayoutBreakpoint] ?? []

    const syncLayouts = React.useCallback((nextLayouts: DashboardResponsiveLayoutItems) => {
      setLayouts(nextLayouts)
      setJsonText(JSON.stringify(nextLayouts, null, 2))
      setJsonError(null)
    }, [])

    const applyJson = React.useCallback(() => {
      try {
        const parsed = JSON.parse(jsonText) as unknown
        if (!isDashboardResponsiveLayoutJson(parsed)) {
          setJsonError('Expected an object keyed by initial/xs/sm/md/lg/xl with dashboard item arrays.')
          return
        }

        syncLayouts(normalizeDashboardResponsiveLayouts(parsed, { columns: directDashboardJsonColumns }))
      } catch (error) {
        setJsonError(error instanceof Error ? error.message : 'Invalid JSON')
      }
    }, [jsonText, syncLayouts])

    return (
      <div ref={viewportRef} className="grid min-h-[760px] gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={editable}
              className={`rounded border px-3 py-1.5 font-medium text-sm ${
                editable ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
              }`}
              onClick={() => setEditable(value => !value)}
            >
              Editable
            </button>
            <button
              type="button"
              className="rounded border border-border bg-card px-3 py-1.5 font-medium text-sm"
              onClick={applyJson}
            >
              Apply JSON
            </button>
            <button
              type="button"
              className="rounded border border-border bg-card px-3 py-1.5 font-medium text-sm"
              onClick={() =>
                syncLayouts(
                  normalizeDashboardResponsiveLayouts(directDashboardJsonLayouts, {
                    columns: directDashboardJsonColumns,
                  }),
                )
              }
            >
              Reset
            </button>
          </div>
          <code className="rounded border bg-muted px-2 py-1 text-sm">
            {activeBreakpoint} / {activeLayoutBreakpoint}
          </code>
        </div>
        {jsonError ? (
          <div className="rounded border border-destructive p-2 text-destructive text-sm">{jsonError}</div>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_30rem]">
          {editable ? (
            <EditableDashboard
              layouts={layouts}
              columns={directDashboardJsonColumns}
              breakpoints={directDashboardJsonBreakpoints}
              rowHeight={32}
              gap={12}
              className="max-w-6xl"
              onLayoutChange={(nextItems, details) =>
                setLayouts(current => {
                  const next = updateDashboardLayoutsWithItems(current, details.breakpoint, nextItems)
                  setJsonText(JSON.stringify(next, null, 2))
                  setJsonError(null)
                  return next
                })
              }
              renderItem={(item, state) => {
                const layoutBreakpoint = getDashboardLayoutBreakpoint(layouts, state.breakpoint) ?? state.breakpoint
                const breakpointItems = layouts[layoutBreakpoint] ?? activeItems
                return renderWidget(
                  item,
                  breakpointItems.findIndex(candidate => candidate.id === item.id),
                )
              }}
            />
          ) : (
            <DashboardLayout
              layouts={layouts}
              columns={directDashboardJsonColumns}
              breakpoints={directDashboardJsonBreakpoints}
              rowHeight={32}
              gap={12}
              className="max-w-6xl"
              renderItem={(item, state) => {
                const layoutBreakpoint = getDashboardLayoutBreakpoint(layouts, state.breakpoint) ?? state.breakpoint
                const breakpointItems = layouts[layoutBreakpoint] ?? activeItems
                return renderWidget(
                  item,
                  breakpointItems.findIndex(candidate => candidate.id === item.id),
                )
              }}
            />
          )}
          <textarea
            aria-label="Dashboard responsive layouts JSON"
            className="min-h-[720px] resize-y rounded border bg-muted p-3 font-mono text-xs"
            spellCheck={false}
            value={jsonText}
            onChange={event => {
              setJsonText(event.currentTarget.value)
              setJsonError(null)
            }}
          />
        </div>
      </div>
    )
  },
}

export const BuilderShell: Story = {
  render: function BuilderShellStory() {
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const viewportWidth = useStoryElementWidth(viewportRef, 1280)
    const activeBreakpoint = getDashboardBreakpointForWidth(viewportWidth, directDashboardJsonBreakpoints)
    const dashboardSources = React.useMemo(
      () => ({
        executive: directDashboardJsonLayouts.lg ?? [],
        operations: (directDashboardJsonLayouts.lg ?? []).map((item, index) => ({
          ...item,
          id: `operations-${item.id}`,
          title: widgetNames[(index + 5) % widgetNames.length],
          componentName: `operations-${item.componentName ?? item.id}`,
        })),
      }),
      [],
    )
    const [activeDashboardId, setActiveDashboardId] = React.useState<keyof typeof dashboardSources>('executive')
    const [templates, setTemplates] = React.useState<DashboardLayoutPreset[]>([])
    const [layoutsByDashboard, setLayoutsByDashboard] = React.useState<
      Record<keyof typeof dashboardSources, DashboardResponsiveLayoutItems>
    >(() => ({
      executive: createDashboardLayoutsFromPreset(dashboardLayoutPresets[2], {
        columns: directDashboardJsonColumns,
        breakpoints: directDashboardJsonBreakpoints,
        items: dashboardSources.executive,
      }),
      operations: createDashboardLayoutsFromPreset(dashboardLayoutPresets[0], {
        columns: directDashboardJsonColumns,
        breakpoints: directDashboardJsonBreakpoints,
        items: dashboardSources.operations,
      }),
    }))
    const [presetIdsByDashboard, setPresetIdsByDashboard] = React.useState<
      Record<keyof typeof dashboardSources, string>
    >({
      executive: dashboardLayoutPresets[2]?.id ?? '',
      operations: dashboardLayoutPresets[0]?.id ?? '',
    })
    const [viewportId, setViewportId] = React.useState<DashboardViewportId>('desktop')
    const [packing, setPacking] = React.useState<Exclude<DashboardLayoutPacking, 'none'>>('vertical')
    const [gap, setGap] = React.useState(12)
    const activeLayouts = layoutsByDashboard[activeDashboardId]
    const activeLayoutBreakpoint =
      getDashboardLayoutBreakpoint(activeLayouts, activeBreakpoint, directDashboardJsonBreakpoints) ?? activeBreakpoint
    const activeItems = activeLayouts[activeLayoutBreakpoint] ?? []
    const activeColumns = getDashboardColumnsForBreakpoint(
      activeLayoutBreakpoint,
      directDashboardJsonColumns,
      directDashboardJsonBreakpoints,
    )
    const layoutPresets = React.useMemo(() => [...dashboardLayoutPresets, ...templates], [templates])
    const selectedPreset = layoutPresets.find(preset => preset.id === presetIdsByDashboard[activeDashboardId])
    const templateDirty = isDashboardLayoutPresetDirty(selectedPreset, activeItems, activeColumns)
    const viewport = dashboardViewportOptions.find(option => option.id === viewportId) ?? dashboardViewportOptions[0]

    const updateActiveLayouts = React.useCallback(
      (
        update:
          | DashboardResponsiveLayoutItems
          | ((current: DashboardResponsiveLayoutItems) => DashboardResponsiveLayoutItems),
      ) => {
        setLayoutsByDashboard(current => {
          const currentLayouts = current[activeDashboardId]
          return {
            ...current,
            [activeDashboardId]: typeof update === 'function' ? update(currentLayouts) : update,
          }
        })
      },
      [activeDashboardId],
    )

    const handleApplyPreset = React.useCallback(
      (preset: DashboardLayoutPreset) => {
        setPresetIdsByDashboard(current => ({ ...current, [activeDashboardId]: preset.id }))
        updateActiveLayouts(current => {
          const layoutBreakpoint =
            getDashboardLayoutBreakpoint(current, activeBreakpoint, directDashboardJsonBreakpoints) ?? activeBreakpoint
          return createDashboardLayoutsFromPreset(preset, {
            columns: directDashboardJsonColumns,
            breakpoints: directDashboardJsonBreakpoints,
            items: current[layoutBreakpoint] ?? dashboardSources[activeDashboardId],
          })
        })
      },
      [activeBreakpoint, activeDashboardId, dashboardSources, updateActiveLayouts],
    )

    const handleCleanupLayout = React.useCallback(() => {
      updateActiveLayouts(current =>
        updateDashboardLayoutsWithItems(
          current,
          activeBreakpoint,
          packDashboardLayoutItems(activeItems, activeColumns, packing),
        ),
      )
    }, [activeBreakpoint, activeColumns, activeItems, packing, updateActiveLayouts])

    const handleSaveTemplate = React.useCallback(
      (template: DashboardLayoutPreset) => {
        const nextTemplate = {
          ...template,
          id: getUniqueStoryPresetId(
            template.id,
            [...dashboardLayoutPresets, ...templates].map(preset => preset.id),
          ),
        }
        setTemplates(current => [...current, nextTemplate])
        setPresetIdsByDashboard(current => ({ ...current, [activeDashboardId]: nextTemplate.id }))
      },
      [activeDashboardId, templates],
    )

    const filterTab = (
      <div className="grid gap-4 text-sm">
        <div className="grid gap-2">
          <div className="font-medium text-muted-foreground text-xs">Dashboard</div>
          <div className="grid gap-2">
            {(['executive', 'operations'] as const).map(id => (
              <button
                key={id}
                type="button"
                aria-pressed={activeDashboardId === id}
                className={`rounded border px-3 py-2 text-left font-medium text-sm ${
                  activeDashboardId === id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card'
                }`}
                onClick={() => setActiveDashboardId(id)}
              >
                {id === 'executive' ? 'Executive' : 'Operations'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <div className="font-medium text-muted-foreground text-xs">Filters</div>
          {['North America', 'Enterprise', 'Open pipeline'].map((label, index) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={index !== 2} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    )

    return (
      <AppShell.Root defaultSecondaryOpen secondaryLabel="Tools" className="h-[860px]">
        <AppShell.Body>
          <AppShell.Main>
            <AppShell.Content padding="none" className="bg-background">
              <div className="h-full min-h-[860px] overflow-auto p-6">
                <div ref={viewportRef} className="mx-auto min-h-full w-full" style={{ maxWidth: viewport.maxWidth }}>
                  <EditableDashboard
                    layouts={activeLayouts}
                    columns={directDashboardJsonColumns}
                    breakpoints={directDashboardJsonBreakpoints}
                    rowHeight={104}
                    gap={gap}
                    packing="none"
                    className="min-h-full"
                    onLayoutChange={(nextItems, details) =>
                      updateActiveLayouts(current =>
                        updateDashboardLayoutsWithItems(current, details.breakpoint, nextItems),
                      )
                    }
                    renderItem={(item, state) => {
                      const layoutBreakpoint =
                        getDashboardLayoutBreakpoint(activeLayouts, state.breakpoint, directDashboardJsonBreakpoints) ??
                        state.breakpoint
                      const breakpointItems = activeLayouts[layoutBreakpoint] ?? activeItems
                      return renderWidget(
                        item,
                        breakpointItems.findIndex(candidate => candidate.id === item.id),
                      )
                    }}
                  />
                </div>
              </div>
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right" width="23rem" resize scroll="hidden">
            <AppShell.SecondaryContent gap="0" overflow="hidden">
              <EditableDashboardSecondaryPanel
                defaultValue="layout"
                tabs={[{ value: 'filters', label: 'Filters', children: filterTab }]}
                layout={
                  <EditableDashboardLayoutPanel
                    activeBreakpoint={activeBreakpoint}
                    canEditGrid
                    gap={gap}
                    gapOptions={DEFAULT_STORY_DASHBOARD_GAP_OPTIONS}
                    packing={packing}
                    presets={layoutPresets}
                    presetId={presetIdsByDashboard[activeDashboardId]}
                    templateColumns={activeColumns}
                    templateDirty={templateDirty}
                    templateItems={activeItems}
                    viewportOptions={dashboardViewportOptions}
                    viewportValue={viewportId}
                    onCleanup={handleCleanupLayout}
                    onGapChange={setGap}
                    onPackingChange={setPacking}
                    onPresetChange={handleApplyPreset}
                    onSaveTemplate={handleSaveTemplate}
                    onViewportChange={value => {
                      if (isDashboardViewportId(value)) setViewportId(value)
                    }}
                  />
                }
              />
            </AppShell.SecondaryContent>
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    )
  },
}

export const ResponsiveJsonPackingComparison: Story = {
  render: function ResponsiveJsonPackingComparisonStory() {
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const viewportWidth = useStoryElementWidth(viewportRef, 1280)
    const dashboardBreakpoints = dashboardBreakpointsFromRglBreakpoints()
    const activeBreakpoint = getDashboardBreakpointForWidth(viewportWidth, dashboardBreakpoints)
    const [editable, setEditable] = React.useState(true)
    const [autoPack, setAutoPack] = React.useState(false)
    const [packing, setPacking] = React.useState<Exclude<DashboardLayoutPacking, 'none'>>('vertical')
    const [layouts, setLayouts] = React.useState<DashboardResponsiveLayoutItems>(() =>
      dashboardResponsiveLayoutItemsFromRglLayouts(responsiveJsonLayouts, dashboardRglDefaultCols),
    )
    const activeLayoutBreakpoint = getDashboardLayoutBreakpoint(layouts, activeBreakpoint) ?? activeBreakpoint
    const activePacking: DashboardLayoutPacking = autoPack ? packing : 'none'
    const activeLayoutJson = JSON.stringify(layouts[activeLayoutBreakpoint] ?? [], null, 2)

    return (
      <div ref={viewportRef} className="grid min-h-[760px] gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={editable}
              className={`rounded border px-3 py-1.5 font-medium text-sm ${
                editable ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
              }`}
              onClick={() => setEditable(value => !value)}
            >
              Editable
            </button>
            <button
              type="button"
              aria-pressed={autoPack}
              className={`rounded border px-3 py-1.5 font-medium text-sm ${
                autoPack ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
              }`}
              onClick={() => setAutoPack(value => !value)}
            >
              Auto Pack
            </button>
            {packingModes.map(mode => (
              <button
                key={mode}
                type="button"
                aria-pressed={autoPack && packing === mode}
                disabled={!autoPack}
                className={`rounded border px-3 py-1.5 font-medium text-sm ${
                  autoPack && packing === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card disabled:opacity-50'
                }`}
                onClick={() => setPacking(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <code className="rounded border bg-muted px-2 py-1 text-sm">{activeBreakpoint}</code>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem]">
          {editable ? (
            <EditableDashboard
              layouts={layouts}
              columns={dashboardColumnsFromRglCols(dashboardRglDefaultCols)}
              breakpoints={dashboardBreakpoints}
              rowHeight={28}
              gap={12}
              packing={activePacking}
              className="max-w-6xl"
              itemStyle={(_item, state) =>
                state.selected
                  ? {
                      backgroundColor: 'color-mix(in oklch, var(--color-accent-soft) 42%, var(--card))',
                    }
                  : undefined
              }
              onLayoutChange={(nextItems, details) =>
                setLayouts(current => updateDashboardLayoutsWithItems(current, details.breakpoint, nextItems))
              }
              renderItem={(item, state) => {
                const layoutBreakpoint = getDashboardLayoutBreakpoint(layouts, state.breakpoint) ?? state.breakpoint
                const activeItems = layouts[layoutBreakpoint] ?? []
                const index = activeItems.findIndex(candidate => candidate.id === item.id)
                return renderWidget(item, index)
              }}
            />
          ) : (
            <DashboardLayout
              layouts={layouts}
              columns={dashboardColumnsFromRglCols(dashboardRglDefaultCols)}
              breakpoints={dashboardBreakpoints}
              rowHeight={28}
              gap={12}
              packing={activePacking}
              className="max-w-6xl"
              itemStyle={(_item, state) =>
                state.selected
                  ? {
                      backgroundColor: 'color-mix(in oklch, var(--color-accent-soft) 42%, var(--card))',
                    }
                  : undefined
              }
              renderItem={(item, state) => {
                const layoutBreakpoint = getDashboardLayoutBreakpoint(layouts, state.breakpoint) ?? state.breakpoint
                const activeItems = layouts[layoutBreakpoint] ?? []
                const index = activeItems.findIndex(candidate => candidate.id === item.id)
                return renderWidget(item, index)
              }}
            />
          )}
          <pre className="max-h-[720px] overflow-auto rounded border bg-muted p-3 text-xs">{activeLayoutJson}</pre>
        </div>
      </div>
    )
  },
}
