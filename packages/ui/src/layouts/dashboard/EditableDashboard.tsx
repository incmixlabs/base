'use client'

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { GripVertical } from 'lucide-react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { Button, Card, Icon, IconButton, Tabs, ToggleGroup } from '@/elements'
import { NumberInput } from '@/form/NumberInput'
import { cn } from '@/lib/utils'
import { DEFAULT_THEME_BREAKPOINTS } from '@/theme/theme-breakpoints'
import { DEFAULT_THEME_DASHBOARD_COLUMNS, normalizeThemeDashboardGap } from '@/theme/theme-dashboard'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { Text } from '@/typography'
import { Row } from '../flex/Flex'
import { Grid } from '../grid/Grid'
import { Masonry } from '../masonry/Masonry'
import {
  areLayoutItemsEqual,
  clamp,
  createDashboardPresetFromItems,
  DASHBOARD_LAYOUT_TRANSITION,
  type DashboardBreakpointConfig,
  type DashboardColumnConfig,
  type DashboardLayoutBreakpoint,
  type DashboardLayoutChangeDetails,
  type DashboardLayoutItem,
  type DashboardLayoutMode,
  type DashboardLayoutPacking,
  type DashboardLayoutPreset,
  type DashboardLayoutProps,
  type DashboardLayoutRenderState,
  DashboardPresetPicker,
  type DashboardResizeHandle,
  type DashboardResolvedResizeHandle,
  getDashboardBreakpointForWidth,
  getDashboardColumnsForWidth,
  getDashboardLayoutBreakpoint,
  getGridHeight,
  getItemLabel,
  normalizeDashboardLayoutItem,
  packDashboardLayoutItems,
  packDashboardLayoutItemsWithPinned,
  useElementWidth,
} from './DashboardLayout'
import {
  dashboardItemDragging,
  dashboardItemEditable,
  dashboardItemFallback,
  editableDashboardLayoutPanel,
  editableDashboardLayoutPanelSection,
  editableDashboardPanelToggleGroup,
  editableDashboardPresetPicker,
  editableDashboardSecondaryPanel,
  editableDashboardSecondaryTabContent,
  editableDashboardTemplateInput,
  moveHandle,
  resizeHandle,
  resizeHandleByDirection,
  resizeHandleCornerGrip,
  resizeHandleCornerGripByDirection,
} from './dashboard-layout.css'

export interface EditableDashboardProps extends DashboardLayoutProps {
  resizeHandles?: readonly DashboardResizeHandle[]
  onLayoutChange?: (items: DashboardLayoutItem[], details: DashboardLayoutChangeDetails) => void
}

export interface EditableDashboardGapOption {
  id: string
  label: string
  value: number
}

export interface EditableDashboardViewportOption {
  id: string
  label: string
  icon: string
}

export interface EditableDashboardLayoutPanelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  activeBreakpoint?: DashboardLayoutBreakpoint
  canEditGrid?: boolean
  gap: number
  gapOptions?: readonly EditableDashboardGapOption[]
  packing: Exclude<DashboardLayoutPacking, 'none'>
  presets?: readonly DashboardLayoutPreset[]
  presetId?: string
  templateColumns?: number
  templateDirty?: boolean
  templateItems?: readonly DashboardLayoutItem[]
  viewportOptions?: readonly EditableDashboardViewportOption[]
  viewportValue?: string
  onCleanup?: () => void
  onGapChange?: (gap: number) => void
  onPackingChange?: (packing: Exclude<DashboardLayoutPacking, 'none'>) => void
  onPresetChange?: (preset: DashboardLayoutPreset) => void
  onSaveTemplate?: (template: DashboardLayoutPreset) => void
  onViewportChange?: (value: string) => void
}

export interface EditableDashboardSecondaryTab {
  value: string
  label: React.ReactNode
  children: React.ReactNode
}

export interface EditableDashboardSecondaryPanelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'color' | 'onChange'> {
  defaultValue?: string
  layout: React.ReactNode
  layoutLabel?: React.ReactNode
  layoutTabPlacement?: 'start' | 'end'
  onValueChange?: (value: string) => void
  tabs?: readonly EditableDashboardSecondaryTab[]
  value?: string
}

const DASHBOARD_DRAG_SCOPE = 'incmix.dashboard-layout'
const DASHBOARD_DRAG_KIND_MOVE = 'move'
const DASHBOARD_DRAG_KIND_RESIZE = 'resize'

const DEFAULT_COLUMNS: Record<DashboardLayoutBreakpoint, number> = {
  ...DEFAULT_THEME_DASHBOARD_COLUMNS,
}

const DEFAULT_BREAKPOINTS: Required<DashboardBreakpointConfig> = {
  ...DEFAULT_THEME_BREAKPOINTS,
}

const DEFAULT_EDITABLE_DASHBOARD_GAP_OPTIONS: readonly EditableDashboardGapOption[] = [
  { id: 'compact', label: 'Compact', value: 8 },
  { id: 'default', label: 'Default', value: 12 },
  { id: 'comfortable', label: 'Comfortable', value: 20 },
]
const DEFAULT_RESIZE_HANDLES: readonly DashboardResizeHandle[] = ['se']
const DEFAULT_PACKING: DashboardLayoutPacking = 'none'
const EDITABLE_DASHBOARD_PACKING_OPTIONS: readonly Exclude<DashboardLayoutPacking, 'none'>[] = [
  'vertical',
  'horizontal',
  'dense',
]

const DASHBOARD_ARROW_KEYS = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'] as const
type DashboardArrowKey = (typeof DASHBOARD_ARROW_KEYS)[number]

type DashboardMoveDragData = {
  scope: typeof DASHBOARD_DRAG_SCOPE
  kind: typeof DASHBOARD_DRAG_KIND_MOVE
  itemId: string
  offsetX: number
  offsetY: number
}

type DashboardResizeDragData = {
  scope: typeof DASHBOARD_DRAG_SCOPE
  kind: typeof DASHBOARD_DRAG_KIND_RESIZE
  itemId: string
  direction: DashboardResolvedResizeHandle
  startClientX: number
  startClientY: number
  initialX: number
  initialY: number
  initialW: number
  initialH: number
}

type DashboardDragData = DashboardMoveDragData | DashboardResizeDragData

export const EditableDashboard = React.forwardRef<HTMLDivElement, EditableDashboardProps>(
  (
    {
      items = [],
      layouts,
      mode = 'grid',
      animateLayout = true,
      columns,
      rowHeight = 96,
      gap,
      breakpoints,
      masonryColumnWidth = 240,
      masonryMaxColumnCount,
      resizeHandles = DEFAULT_RESIZE_HANDLES,
      itemClassName,
      itemStyle,
      packing = DEFAULT_PACKING,
      renderItem,
      onLayoutChange,
      className,
      style,
      ...rootProps
    },
    forwardedRef,
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const theme = useOptionalThemeProviderContext()
    const resolvedGap = normalizeThemeDashboardGap(gap ?? theme?.dashboard?.gap)
    const resolvedColumns: DashboardColumnConfig = columns ?? theme?.dashboard.columns ?? DEFAULT_COLUMNS
    const resolvedBreakpoints: DashboardBreakpointConfig = breakpoints ?? theme?.breakpoints ?? DEFAULT_BREAKPOINTS
    const setRootRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )
    const width = useElementWidth(rootRef)
    const activeColumns = getDashboardColumnsForWidth(width, resolvedColumns, resolvedBreakpoints)
    const activeBreakpoint = getDashboardBreakpointForWidth(width, resolvedBreakpoints)
    const activeLayoutBreakpoint = getDashboardLayoutBreakpoint(layouts, activeBreakpoint, resolvedBreakpoints)
    const activeItems = activeLayoutBreakpoint ? (layouts?.[activeLayoutBreakpoint] ?? []) : items
    const normalizedItems = React.useMemo(
      () => packDashboardLayoutItems(activeItems, activeColumns, packing),
      [activeColumns, activeItems, packing],
    )
    const canEditGrid = mode === 'grid'
    const [activeDragId, setActiveDragId] = React.useState<string | null>(null)
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null)
    const latestState = React.useRef({
      activeColumns,
      activeBreakpoint,
      gap: resolvedGap,
      items: normalizedItems,
      mode,
      onLayoutChange,
      packing,
      rowHeight,
    })

    latestState.current = {
      activeColumns,
      activeBreakpoint,
      gap: resolvedGap,
      items: normalizedItems,
      mode,
      onLayoutChange,
      packing,
      rowHeight,
    }

    const handleKeyboardMove = React.useCallback((itemId: string, deltaX: number, deltaY: number) => {
      commitDashboardItemUpdate(
        itemId,
        'move',
        item => ({
          ...item,
          x: item.x + deltaX,
          y: item.y + deltaY,
        }),
        latestState.current,
      )
    }, [])

    const handleKeyboardResize = React.useCallback(
      (itemId: string, direction: DashboardResolvedResizeHandle, key: DashboardArrowKey) => {
        commitDashboardItemUpdate(
          itemId,
          'resize',
          item => getKeyboardResizedItem(item, direction, key, latestState.current.activeColumns),
          latestState.current,
        )
      },
      [],
    )

    React.useEffect(() => {
      if (!canEditGrid) setSelectedItemId(null)
    }, [canEditGrid])

    React.useEffect(() => {
      const element = rootRef.current
      if (!element || !canEditGrid) return undefined

      let dragFrame: number | null = null
      let pendingDrag: {
        data: DashboardDragData
        clientX: number
        clientY: number
      } | null = null

      const requestFrame = (callback: FrameRequestCallback) =>
        typeof window.requestAnimationFrame === 'function'
          ? window.requestAnimationFrame(callback)
          : window.setTimeout(() => callback(Date.now()), 16)
      const cancelFrame = (frame: number) =>
        typeof window.cancelAnimationFrame === 'function'
          ? window.cancelAnimationFrame(frame)
          : window.clearTimeout(frame)
      const flushPendingDrag = () => {
        dragFrame = null
        const drag = pendingDrag
        pendingDrag = null
        if (!drag) return
        commitDashboardDrag(drag.data, drag.clientX, drag.clientY, rootRef.current, latestState.current)
      }
      const scheduleDashboardDrag = (data: DashboardDragData, clientX: number, clientY: number) => {
        pendingDrag = { data, clientX, clientY }
        dragFrame ??= requestFrame(flushPendingDrag)
      }
      const commitDashboardDragNow = (data: DashboardDragData, clientX: number, clientY: number) => {
        if (dragFrame != null) {
          cancelFrame(dragFrame)
          dragFrame = null
        }
        pendingDrag = null
        commitDashboardDrag(data, clientX, clientY, rootRef.current, latestState.current)
      }

      const cleanup = combine(
        dropTargetForElements({
          element,
          canDrop: ({ source }) => isDashboardDragData(source.data),
          getData: () => ({ scope: DASHBOARD_DRAG_SCOPE }),
        }),
        monitorForElements({
          canMonitor: ({ source }) => isDashboardDragData(source.data),
          onDragStart: ({ source }) => {
            const data = readDashboardDragData(source.data)
            setActiveDragId(data?.itemId ?? null)
            if (data) setSelectedItemId(data.itemId)
          },
          onDrag: ({ location, source }) => {
            const data = readDashboardDragData(source.data)
            if (!data) return
            scheduleDashboardDrag(data, location.current.input.clientX, location.current.input.clientY)
          },
          onDrop: ({ location, source }) => {
            const data = readDashboardDragData(source.data)
            setActiveDragId(null)
            if (!data) return
            commitDashboardDragNow(data, location.current.input.clientX, location.current.input.clientY)
          },
        }),
      )

      return () => {
        cleanup()
        if (dragFrame != null) cancelFrame(dragFrame)
      }
    }, [canEditGrid])

    const stateForItem = React.useCallback(
      (item: DashboardLayoutItem): DashboardLayoutRenderState => ({
        breakpoint: activeBreakpoint,
        editable: canEditGrid,
        dragging: activeDragId === item.id,
        selected: canEditGrid && selectedItemId === item.id,
        mode,
        columns: activeColumns,
      }),
      [activeBreakpoint, activeColumns, activeDragId, canEditGrid, mode, selectedItemId],
    )

    const minGridHeight = React.useMemo(
      () => getGridHeight(normalizedItems, rowHeight, resolvedGap),
      [normalizedItems, resolvedGap, rowHeight],
    )

    if (mode === 'masonry') {
      return (
        <Masonry.Root
          {...rootProps}
          ref={setRootRefs}
          className={cn('relative w-full', className)}
          columnWidth={masonryColumnWidth}
          maxColumnCount={masonryMaxColumnCount ?? activeColumns}
          gap={resolvedGap}
          defaultWidth={width || undefined}
          style={{
            minHeight: minGridHeight,
            height: 'auto',
            ...style,
          }}
        >
          {normalizedItems.map(item => {
            const state = stateForItem(item)
            return (
              <Masonry.Item key={item.id}>
                <EditableDashboardItemFrame
                  item={item}
                  state={state}
                  animateLayout={animateLayout}
                  itemClassName={itemClassName}
                  itemStyle={itemStyle}
                  renderItem={renderItem}
                  resizeHandles={resizeHandles}
                  onSelect={setSelectedItemId}
                  onKeyboardMove={handleKeyboardMove}
                  onKeyboardResize={handleKeyboardResize}
                />
              </Masonry.Item>
            )
          })}
        </Masonry.Root>
      )
    }

    return (
      <Grid
        {...rootProps}
        ref={setRootRefs}
        columns={`repeat(${activeColumns}, minmax(0, 1fr))`}
        align="stretch"
        className={cn('relative w-full', className)}
        style={{
          gridAutoRows: rowHeight,
          gap: resolvedGap,
          minHeight: minGridHeight,
          ...style,
        }}
      >
        {normalizedItems.map(item => {
          const state = stateForItem(item)
          return (
            <EditableDashboardItemFrame
              key={item.id}
              item={item}
              state={state}
              animateLayout={animateLayout}
              itemClassName={itemClassName}
              itemStyle={itemStyle}
              renderItem={renderItem}
              resizeHandles={resizeHandles}
              onSelect={setSelectedItemId}
              onKeyboardMove={handleKeyboardMove}
              onKeyboardResize={handleKeyboardResize}
              style={{
                gridColumn: `${item.x + 1} / span ${item.w}`,
                gridRow: `${item.y + 1} / span ${item.h}`,
              }}
            />
          )
        })}
      </Grid>
    )
  },
)

EditableDashboard.displayName = 'EditableDashboard'

export function EditableDashboardLayoutPanel({
  activeBreakpoint,
  canEditGrid = true,
  gap,
  gapOptions = DEFAULT_EDITABLE_DASHBOARD_GAP_OPTIONS,
  packing,
  presets,
  presetId,
  templateColumns,
  templateDirty = true,
  templateItems = [],
  viewportOptions = [],
  viewportValue,
  onCleanup,
  onGapChange,
  onPackingChange,
  onPresetChange,
  onSaveTemplate,
  onViewportChange,
  className,
  ...props
}: EditableDashboardLayoutPanelProps) {
  const gapInputId = React.useId()
  const templateNameId = React.useId()
  const [templateName, setTemplateName] = React.useState('')
  const normalizedTemplateName = templateName.trim()
  const showTemplateSave = Boolean(canEditGrid && templateDirty && onSaveTemplate)
  const canSaveTemplate = Boolean(showTemplateSave && normalizedTemplateName && templateColumns && templateItems.length)

  React.useEffect(() => {
    if (!showTemplateSave) setTemplateName('')
  }, [showTemplateSave])

  const handleSaveTemplate = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!onSaveTemplate || !normalizedTemplateName || !templateColumns || templateItems.length === 0) return

      onSaveTemplate(
        createDashboardPresetFromItems({
          name: normalizedTemplateName,
          description: activeBreakpoint ? `Custom layout saved from ${activeBreakpoint}.` : 'Custom dashboard layout.',
          columns: templateColumns,
          items: templateItems,
        }),
      )
      setTemplateName('')
    },
    [activeBreakpoint, normalizedTemplateName, onSaveTemplate, templateColumns, templateItems],
  )

  return (
    <div {...props} className={cn(editableDashboardLayoutPanel, className)}>
      {viewportOptions.length > 0 ? (
        <Card.Root
          size="xs"
          variant="surface"
          color="neutral"
          layout="column"
          gap="3"
          className={editableDashboardLayoutPanelSection}
        >
          <Row align="center" justify="between" gap="3" minWidth="0">
            <Text size="sm" weight="medium" truncate>
              Preview
            </Text>
            <Icon icon="monitor" size="xs" color="slate" aria-hidden />
          </Row>
          <ToggleGroup.Root
            value={viewportValue ? [viewportValue] : []}
            onValueChange={values => {
              const nextValue = values.at(-1)
              if (nextValue) onViewportChange?.(nextValue)
            }}
            multiple={false}
            size="xs"
            variant="soft"
            color="slate"
            disabled={!onViewportChange}
          >
            {viewportOptions.map(option => (
              <ToggleGroup.Item key={option.id} value={option.id} aria-label={option.label}>
                <Icon icon={option.icon} size="xs" color="slate" aria-hidden />
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Card.Root>
      ) : null}

      <Card.Root
        size="xs"
        variant="surface"
        color="neutral"
        layout="column"
        gap="3"
        className={editableDashboardLayoutPanelSection}
      >
        <Row align="center" justify="between" gap="3" minWidth="0">
          <Text size="sm" weight="medium" truncate>
            Presets
          </Text>
          <Icon icon="layout-grid" size="xs" color="slate" aria-hidden />
        </Row>
        <DashboardPresetPicker
          className={editableDashboardPresetPicker}
          presets={presets}
          value={presetId}
          previewHeight={56}
          onValueChange={onPresetChange}
        />
      </Card.Root>

      <Card.Root
        size="xs"
        variant="surface"
        color="neutral"
        layout="column"
        gap="3"
        className={editableDashboardLayoutPanelSection}
      >
        <Row align="center" justify="between" gap="3" minWidth="0">
          <Text size="sm" weight="medium" truncate>
            Controls
          </Text>
          <Icon icon="settings" size="xs" color="slate" aria-hidden />
        </Row>
        <Grid gap="3" minWidth="0">
          <Grid gap="2" minWidth="0">
            <Text size="xs" weight="medium">
              Density
            </Text>
            <Grid gap="2" minWidth="0">
              <Row align="center" gap="1" wrap="wrap">
                <Text as="label" htmlFor={gapInputId} size="xs" weight="medium">
                  Gap
                </Text>
                <NumberInput
                  id={gapInputId}
                  size="xs"
                  variant="button"
                  inputVariant="outline"
                  color="slate"
                  radius="sm"
                  value={gap}
                  min={0}
                  max={64}
                  step={1}
                  allowDecimal={false}
                  aria-label="Gap"
                  disabled={!onGapChange}
                  iconButton={{ variant: 'soft', color: 'slate', radius: 'sm' }}
                  onValueChange={value => onGapChange?.(normalizeEditableDashboardPanelGap(value === '' ? 0 : value))}
                />
              </Row>
              <ToggleGroup.Root
                className={editableDashboardPanelToggleGroup}
                value={[String(gap)]}
                onValueChange={values => {
                  const nextValue = values.at(-1)
                  if (nextValue) onGapChange?.(normalizeEditableDashboardPanelGap(Number(nextValue)))
                }}
                multiple={false}
                size="xs"
                variant="soft"
                color="slate"
                disabled={!onGapChange}
                flush={false}
              >
                {gapOptions.map(option => (
                  <ToggleGroup.Item key={option.id} value={String(option.value)} aria-label={option.label}>
                    {option.label}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </Grid>
          </Grid>

          <Grid gap="2" minWidth="0">
            <Text size="xs" weight="medium">
              Cleanup
            </Text>
            <Grid gap="2" minWidth="0">
              <ToggleGroup.Root
                className={editableDashboardPanelToggleGroup}
                value={[packing]}
                onValueChange={values => {
                  const nextValue = values.at(-1)
                  if (isEditableDashboardPacking(nextValue)) onPackingChange?.(nextValue)
                }}
                multiple={false}
                size="xs"
                variant="soft"
                color="slate"
                disabled={!canEditGrid || !onPackingChange}
                flush={false}
              >
                {EDITABLE_DASHBOARD_PACKING_OPTIONS.map(option => (
                  <ToggleGroup.Item key={option} value={option} aria-label={option}>
                    {option}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
              <Button
                size="xs"
                variant="outline"
                color="slate"
                disabled={!canEditGrid || !onCleanup}
                onClick={onCleanup}
                iconStart="settings"
              >
                Clean Up
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card.Root>

      {showTemplateSave ? (
        <Card.Root
          asChild
          size="xs"
          variant="surface"
          color="neutral"
          layout="column"
          gap="3"
          className={editableDashboardLayoutPanelSection}
        >
          <form onSubmit={handleSaveTemplate}>
            <Row align="center" justify="between" gap="3" minWidth="0">
              <Text size="sm" weight="medium" truncate>
                Template
              </Text>
              <Icon icon="bookmark" size="xs" color="slate" aria-hidden />
            </Row>
            <Grid gap="2" minWidth="0">
              <Text as="label" htmlFor={templateNameId} size="xs" weight="medium">
                Save current layout
              </Text>
              <input
                id={templateNameId}
                className={editableDashboardTemplateInput}
                value={templateName}
                placeholder="Template name"
                onChange={event => setTemplateName(event.currentTarget.value)}
              />
              <Button
                type="submit"
                size="xs"
                variant="solid"
                color="primary"
                highContrast
                disabled={!canSaveTemplate}
                iconStart="bookmark"
              >
                Save Template
              </Button>
            </Grid>
          </form>
        </Card.Root>
      ) : null}
    </div>
  )
}

export function EditableDashboardSecondaryPanel({
  defaultValue,
  layout,
  layoutLabel = 'Layout',
  layoutTabPlacement = 'end',
  onValueChange,
  tabs = [],
  value,
  className,
  ...props
}: EditableDashboardSecondaryPanelProps) {
  const layoutTab: EditableDashboardSecondaryTab = {
    value: 'layout',
    label: layoutLabel,
    children: layout,
  }
  const resolvedTabs = layoutTabPlacement === 'start' ? [layoutTab, ...tabs] : [...tabs, layoutTab]
  const resolvedDefaultValue = defaultValue ?? resolvedTabs[0]?.value ?? 'layout'

  return (
    <Tabs.Root
      {...props}
      value={value}
      defaultValue={value === undefined ? resolvedDefaultValue : undefined}
      onValueChange={onValueChange}
      size="sm"
      variant="line"
      className={cn(editableDashboardSecondaryPanel, className)}
    >
      <Tabs.List>
        {resolvedTabs.map(tab => (
          <Tabs.Trigger key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {resolvedTabs.map(tab => (
        <Tabs.Content key={tab.value} value={tab.value} className={editableDashboardSecondaryTabContent}>
          {tab.children}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

function normalizeEditableDashboardPanelGap(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.round(value))
}

function isEditableDashboardPacking(value: unknown): value is Exclude<DashboardLayoutPacking, 'none'> {
  return (
    typeof value === 'string' &&
    EDITABLE_DASHBOARD_PACKING_OPTIONS.includes(value as Exclude<DashboardLayoutPacking, 'none'>)
  )
}

interface EditableDashboardItemFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  item: DashboardLayoutItem
  state: DashboardLayoutRenderState
  animateLayout: boolean
  itemClassName?: DashboardLayoutProps['itemClassName']
  itemStyle?: DashboardLayoutProps['itemStyle']
  renderItem?: DashboardLayoutProps['renderItem']
  resizeHandles: readonly DashboardResizeHandle[]
  onSelect: (itemId: string) => void
  onKeyboardMove: (itemId: string, deltaX: number, deltaY: number) => void
  onKeyboardResize: (itemId: string, direction: DashboardResolvedResizeHandle, key: DashboardArrowKey) => void
}

function EditableDashboardItemFrame({
  item,
  state,
  animateLayout,
  itemClassName,
  itemStyle,
  renderItem,
  resizeHandles,
  onSelect,
  onKeyboardMove,
  onKeyboardResize,
  className,
  style,
}: EditableDashboardItemFrameProps) {
  const itemRef = React.useRef<HTMLDivElement | null>(null)
  const lastPointerDownTarget = React.useRef<EventTarget | null>(null)
  const label = getItemLabel(item)
  const canEditGridItem = state.editable && state.mode === 'grid' && !item.static
  const resolvedResizeHandles = getResolvedResizeHandles(item, state.columns, resizeHandles)

  React.useEffect(() => {
    const element = itemRef.current
    if (!element || !canEditGridItem) return undefined

    return draggable({
      element,
      canDrag: () => !isDashboardMoveBlocked(lastPointerDownTarget.current),
      getInitialData: ({ input }) => {
        const rect = element.getBoundingClientRect()
        return {
          scope: DASHBOARD_DRAG_SCOPE,
          kind: DASHBOARD_DRAG_KIND_MOVE,
          itemId: item.id,
          offsetX: input.clientX - rect.left,
          offsetY: input.clientY - rect.top,
        } satisfies DashboardMoveDragData
      },
    })
  }, [canEditGridItem, item.id])

  const resolvedItemClassName = typeof itemClassName === 'function' ? itemClassName(item, state) : itemClassName
  const resolvedItemStyle = typeof itemStyle === 'function' ? itemStyle(item, state) : itemStyle

  function handleMoveKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const delta = getKeyboardMoveDelta(event.key)
    if (!delta) return

    event.preventDefault()
    onKeyboardMove(item.id, delta.x, delta.y)
  }

  const active = state.selected || state.dragging

  return (
    <Card.Root asChild size="xs" variant={active ? 'soft' : 'surface'} color={active ? 'primary' : 'neutral'}>
      <m.div
        layout={animateLayout}
        transition={DASHBOARD_LAYOUT_TRANSITION}
        ref={itemRef}
        data-slot="dashboard-layout-item"
        data-dashboard-item-id={item.id}
        className={cn(
          'relative isolate min-w-0 overflow-hidden transition-opacity duration-150',
          canEditGridItem && dashboardItemEditable,
          state.dragging && dashboardItemDragging,
          resolvedItemClassName,
          className,
        )}
        style={{
          ...resolvedItemStyle,
          ...style,
        }}
        role="group"
        aria-label={label}
        onFocusCapture={() => {
          if (canEditGridItem) onSelect(item.id)
        }}
        onPointerDownCapture={event => {
          lastPointerDownTarget.current = event.target
          if (canEditGridItem) onSelect(item.id)
        }}
      >
        <div data-slot="dashboard-layout-item-content" className="h-full min-h-0 min-w-0">
          {renderItem ? renderItem(item, state) : <div className={dashboardItemFallback}>{label}</div>}
        </div>
        {canEditGridItem ? (
          <>
            <IconButton
              data-dashboard-move-handle="true"
              size="xs"
              variant="outline"
              color="slate"
              aria-label={`Move ${label}. Use arrow keys to move by one grid cell.`}
              aria-keyshortcuts="ArrowUp ArrowRight ArrowDown ArrowLeft"
              className={moveHandle}
              onKeyDown={handleMoveKeyDown}
            >
              <GripVertical className="size-4" aria-hidden />
            </IconButton>
            {resolvedResizeHandles.map(handle => (
              <EditableDashboardResizeHandle
                key={handle}
                item={item}
                direction={handle}
                label={label}
                onKeyboardResize={onKeyboardResize}
              />
            ))}
          </>
        ) : null}
      </m.div>
    </Card.Root>
  )
}

interface EditableDashboardResizeHandleProps {
  item: DashboardLayoutItem
  direction: DashboardResolvedResizeHandle
  label: string
  onKeyboardResize: (itemId: string, direction: DashboardResolvedResizeHandle, key: DashboardArrowKey) => void
}

function EditableDashboardResizeHandle({
  item,
  direction,
  label,
  onKeyboardResize,
}: EditableDashboardResizeHandleProps) {
  const handleRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    const element = handleRef.current
    if (!element) return undefined

    return draggable({
      element,
      getInitialData: ({ input }) =>
        ({
          scope: DASHBOARD_DRAG_SCOPE,
          kind: DASHBOARD_DRAG_KIND_RESIZE,
          itemId: item.id,
          direction,
          startClientX: input.clientX,
          startClientY: input.clientY,
          initialX: item.x,
          initialY: item.y,
          initialW: item.w,
          initialH: item.h,
        }) satisfies DashboardResizeDragData,
    })
  }, [direction, item.h, item.id, item.w, item.x, item.y])

  function handleResizeKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!isDashboardArrowKey(event.key) || !canResizeDirectionWithKey(direction, event.key)) return

    event.preventDefault()
    onKeyboardResize(item.id, direction, event.key)
  }

  return (
    <button
      ref={handleRef}
      type="button"
      data-dashboard-resize-handle="true"
      aria-label={`Resize ${label} from ${getResizeHandleLabel(direction)}. Use arrow keys to resize by one grid cell.`}
      aria-keyshortcuts="ArrowUp ArrowRight ArrowDown ArrowLeft"
      className={cn(resizeHandle, resizeHandleByDirection[direction])}
      onKeyDown={handleResizeKeyDown}
    >
      {isCornerResizeHandle(direction) ? (
        <span className={cn(resizeHandleCornerGrip, resizeHandleCornerGripByDirection[direction])} aria-hidden />
      ) : null}
    </button>
  )
}

function commitDashboardItemUpdate(
  itemId: string,
  reason: DashboardLayoutChangeDetails['reason'],
  updateItem: (item: DashboardLayoutItem) => DashboardLayoutItem,
  state: {
    activeBreakpoint: DashboardLayoutBreakpoint
    activeColumns: number
    items: DashboardLayoutItem[]
    mode: DashboardLayoutMode
    onLayoutChange?: EditableDashboardProps['onLayoutChange']
    packing: DashboardLayoutPacking
  },
) {
  if (state.mode !== 'grid' || !state.onLayoutChange) return

  const current = state.items.find(item => item.id === itemId)
  if (!current || current.static) return

  const nextItem = normalizeDashboardLayoutItem(updateItem(current), state.activeColumns)
  const nextItems = packDashboardLayoutItemsWithPinned(
    state.items.map(item => (item.id === nextItem.id ? nextItem : item)),
    state.activeColumns,
    state.packing,
    new Set([nextItem.id]),
  )
  const committedItem = nextItems.find(item => item.id === nextItem.id) ?? nextItem

  if (areLayoutItemsEqual(state.items, nextItems)) return

  // Keep the mutable ref current so follow-up drag or keyboard updates use the latest layout before React re-renders.
  state.items = nextItems

  state.onLayoutChange(nextItems, {
    reason,
    itemId: committedItem.id,
    item: committedItem,
    breakpoint: state.activeBreakpoint,
    columns: state.activeColumns,
  })
}

function commitDashboardDrag(
  data: DashboardDragData,
  clientX: number,
  clientY: number,
  root: HTMLElement | null,
  state: {
    activeBreakpoint: DashboardLayoutBreakpoint
    activeColumns: number
    gap: number
    items: DashboardLayoutItem[]
    mode: DashboardLayoutMode
    onLayoutChange?: EditableDashboardProps['onLayoutChange']
    packing: DashboardLayoutPacking
    rowHeight: number
  },
) {
  if (!root || state.mode !== 'grid' || !state.onLayoutChange) return

  const metrics = getGridMetrics(root, state.activeColumns, state.rowHeight, state.gap)
  const current = state.items.find(item => item.id === data.itemId)
  if (!current || current.static) return

  const nextItem =
    data.kind === DASHBOARD_DRAG_KIND_MOVE
      ? getMovedItem(current, data, clientX, clientY, metrics)
      : getResizedItem(current, data, clientX, clientY, metrics)
  const normalizedNextItem = normalizeDashboardLayoutItem(nextItem, state.activeColumns)
  const nextItems = packDashboardLayoutItemsWithPinned(
    state.items.map(item => (item.id === normalizedNextItem.id ? normalizedNextItem : item)),
    state.activeColumns,
    state.packing,
    new Set([normalizedNextItem.id]),
  )
  const committedItem = nextItems.find(item => item.id === normalizedNextItem.id) ?? normalizedNextItem

  if (areLayoutItemsEqual(state.items, nextItems)) return

  // Keep the mutable ref current so follow-up drag or keyboard updates use the latest layout before React re-renders.
  state.items = nextItems

  state.onLayoutChange(nextItems, {
    reason: data.kind,
    itemId: committedItem.id,
    item: committedItem,
    breakpoint: state.activeBreakpoint,
    columns: state.activeColumns,
  })
}

function getGridMetrics(root: HTMLElement, columns: number, rowHeight: number, gap: number) {
  const rect = root.getBoundingClientRect()
  const cellWidth = Math.max(1, (rect.width - gap * Math.max(0, columns - 1)) / columns)

  return {
    rect,
    columns,
    rowHeight,
    gap,
    cellWidth,
    stepX: cellWidth + gap,
    stepY: rowHeight + gap,
  }
}

function getMovedItem(
  item: DashboardLayoutItem,
  data: DashboardMoveDragData,
  clientX: number,
  clientY: number,
  metrics: ReturnType<typeof getGridMetrics>,
) {
  const nextX = Math.round((clientX - metrics.rect.left - data.offsetX) / metrics.stepX)
  const nextY = Math.round((clientY - metrics.rect.top - data.offsetY) / metrics.stepY)

  return {
    ...item,
    x: clamp(nextX, 0, Math.max(0, metrics.columns - item.w)),
    y: Math.max(0, nextY),
  }
}

function getResizedItem(
  item: DashboardLayoutItem,
  data: DashboardResizeDragData,
  clientX: number,
  clientY: number,
  metrics: ReturnType<typeof getGridMetrics>,
) {
  const deltaColumns = Math.round((clientX - data.startClientX) / metrics.stepX)
  const deltaRows = Math.round((clientY - data.startClientY) / metrics.stepY)
  const minW = item.minW ?? 1
  const maxW = Math.min(item.maxW ?? metrics.columns, metrics.columns)
  const minH = item.minH ?? 1
  const maxH = item.maxH ?? Number.MAX_SAFE_INTEGER

  let x = data.initialX
  let y = data.initialY
  let w = data.initialW
  let h = data.initialH

  if (data.direction.includes('e')) {
    w = clamp(data.initialW + deltaColumns, minW, Math.min(maxW, metrics.columns - x))
  }

  if (data.direction.includes('w')) {
    w = clamp(data.initialW - deltaColumns, minW, Math.min(maxW, data.initialX + data.initialW))
    x = data.initialX + data.initialW - w
  }

  if (data.direction.includes('s')) {
    h = clamp(data.initialH + deltaRows, minH, maxH)
  }

  if (data.direction.includes('n')) {
    h = clamp(data.initialH - deltaRows, minH, Math.min(maxH, data.initialY + data.initialH))
    y = data.initialY + data.initialH - h
  }

  return {
    ...item,
    x,
    y,
    w,
    h,
  }
}

function getKeyboardMoveDelta(key: string) {
  switch (key) {
    case 'ArrowUp':
      return { x: 0, y: -1 }
    case 'ArrowRight':
      return { x: 1, y: 0 }
    case 'ArrowDown':
      return { x: 0, y: 1 }
    case 'ArrowLeft':
      return { x: -1, y: 0 }
    default:
      return null
  }
}

function getKeyboardResizedItem(
  item: DashboardLayoutItem,
  direction: DashboardResolvedResizeHandle,
  key: DashboardArrowKey,
  columns: number,
) {
  const minW = item.minW ?? 1
  const maxW = Math.min(item.maxW ?? columns, columns)
  const minH = item.minH ?? 1
  const maxH = item.maxH ?? Number.MAX_SAFE_INTEGER
  let x = item.x
  let y = item.y
  let w = item.w
  let h = item.h

  if (direction.includes('e')) {
    if (key === 'ArrowRight') w = clamp(w + 1, minW, Math.min(maxW, columns - x))
    if (key === 'ArrowLeft') w = clamp(w - 1, minW, maxW)
  }

  if (direction.includes('w')) {
    if (key === 'ArrowLeft') {
      const nextW = clamp(w + 1, minW, Math.min(maxW, x + w))
      x += w - nextW
      w = nextW
    }

    if (key === 'ArrowRight') {
      const nextW = clamp(w - 1, minW, maxW)
      x += w - nextW
      w = nextW
    }
  }

  if (direction.includes('s')) {
    if (key === 'ArrowDown') h = clamp(h + 1, minH, maxH)
    if (key === 'ArrowUp') h = clamp(h - 1, minH, maxH)
  }

  if (direction.includes('n')) {
    if (key === 'ArrowUp') {
      const nextH = clamp(h + 1, minH, Math.min(maxH, y + h))
      y += h - nextH
      h = nextH
    }

    if (key === 'ArrowDown') {
      const nextH = clamp(h - 1, minH, maxH)
      y += h - nextH
      h = nextH
    }
  }

  return {
    ...item,
    x,
    y,
    w,
    h,
  }
}

function getResolvedResizeHandles(
  item: DashboardLayoutItem,
  columns: number,
  resizeHandles: readonly DashboardResizeHandle[],
): DashboardResolvedResizeHandle[] {
  const touchesRightBoundary = item.x > 0 && item.x + item.w >= columns
  const handles: DashboardResolvedResizeHandle[] = []

  for (const handle of resizeHandles) {
    const resolvedHandle = touchesRightBoundary && handle === 'se' ? 'sw' : handle
    if (!handles.includes(resolvedHandle)) handles.push(resolvedHandle)
  }

  return handles
}

function readDashboardDragData(data: Record<string, unknown>): DashboardDragData | null {
  if (!isDashboardDragData(data)) return null
  if (data.kind === DASHBOARD_DRAG_KIND_MOVE) return data as DashboardMoveDragData
  return data as DashboardResizeDragData
}

function isDashboardDragData(data: Record<string, unknown>): data is DashboardDragData {
  return (
    data.scope === DASHBOARD_DRAG_SCOPE &&
    typeof data.itemId === 'string' &&
    (data.kind === DASHBOARD_DRAG_KIND_MOVE || data.kind === DASHBOARD_DRAG_KIND_RESIZE)
  )
}

function isDashboardArrowKey(key: string): key is DashboardArrowKey {
  return (DASHBOARD_ARROW_KEYS as readonly string[]).includes(key)
}

function isDashboardMoveBlocked(target: EventTarget | null) {
  if (!(target instanceof Element)) return false

  return (
    target.closest(
      'a, input, select, textarea, [contenteditable], [data-dashboard-resize-handle="true"], [data-dashboard-ignore-drag="true"], button:not([data-dashboard-move-handle="true"])',
    ) != null
  )
}

function canResizeDirectionWithKey(direction: DashboardResolvedResizeHandle, key: DashboardArrowKey) {
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight'
  const vertical = key === 'ArrowUp' || key === 'ArrowDown'

  return (
    (horizontal && (direction.includes('e') || direction.includes('w'))) ||
    (vertical && (direction.includes('n') || direction.includes('s')))
  )
}

function getResizeHandleLabel(direction: DashboardResolvedResizeHandle) {
  switch (direction) {
    case 'n':
      return 'top edge'
    case 'e':
      return 'right edge'
    case 'se':
      return 'bottom right corner'
    case 's':
      return 'bottom edge'
    case 'sw':
      return 'bottom left corner'
    case 'w':
      return 'left edge'
  }
}

function isCornerResizeHandle(direction: DashboardResolvedResizeHandle): direction is 'se' | 'sw' {
  return direction === 'se' || direction === 'sw'
}
