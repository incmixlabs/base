'use client'

import * as m from 'motion/react-m'
import * as React from 'react'
import { Card } from '@/elements'
import { cn } from '@/lib/utils'
import { DEFAULT_THEME_BREAKPOINTS } from '@/theme/theme-breakpoints'
import { DEFAULT_THEME_DASHBOARD_COLUMNS, normalizeThemeDashboardGap } from '@/theme/theme-dashboard'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { Grid } from '../grid/Grid'
import { Masonry } from '../masonry/Masonry'
import {
  dashboardItemFallback,
  modeButton,
  modeButtonSelected,
  modeControl,
  presetButton,
  presetButtonSelected,
  presetName,
  presetPicker,
  presetPreview,
  presetPreviewCell,
} from './dashboard-layout.css'

export type DashboardLayoutMode = 'grid' | 'masonry'
export type DashboardLayoutBreakpoint = 'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type DashboardResizeHandle = 'n' | 'e' | 's' | 'w' | 'se'
export type DashboardLayoutPacking = 'none' | 'vertical' | 'horizontal' | 'dense'
export type DashboardResolvedResizeHandle = DashboardResizeHandle | 'sw'

export type DashboardColumnConfig = number | Partial<Record<DashboardLayoutBreakpoint, number>>
export type DashboardBreakpointConfig = Partial<Record<Exclude<DashboardLayoutBreakpoint, 'initial'>, number>>
export type DashboardResponsiveLayoutItems = Partial<Record<DashboardLayoutBreakpoint, DashboardLayoutItem[]>>

export interface DashboardResponsiveLayoutOptions {
  breakpoints?: DashboardBreakpointConfig
  columns?: DashboardColumnConfig
  packing?: DashboardLayoutPacking
}

export interface DashboardPresetLayoutOptions {
  breakpoints?: DashboardBreakpointConfig
  columns?: DashboardColumnConfig
  items?: readonly DashboardLayoutItem[]
}

export interface DashboardPresetFromItemsOptions {
  id?: string
  name: string
  description?: string
  mode?: DashboardLayoutMode
  columns: number
  items: readonly DashboardLayoutItem[]
}

export interface DashboardLayoutItem {
  id: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
  title?: string
  componentName?: string
  groupId?: string
  items?: DashboardLayoutItem[]
  meta?: Record<string, unknown>
}

export interface DashboardLayoutPreset {
  id: string
  name: string
  description?: string
  mode?: DashboardLayoutMode
  columns: number
  rows?: number
  items: DashboardLayoutItem[]
}

export interface DashboardLayoutChangeDetails {
  reason: 'move' | 'resize'
  itemId: string
  item: DashboardLayoutItem
  breakpoint: DashboardLayoutBreakpoint
  columns: number
}

export interface DashboardLayoutRenderState {
  breakpoint: DashboardLayoutBreakpoint
  editable: boolean
  dragging: boolean
  selected: boolean
  mode: DashboardLayoutMode
  columns: number
}

export interface DashboardLayoutProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  items?: DashboardLayoutItem[]
  layouts?: DashboardResponsiveLayoutItems
  mode?: DashboardLayoutMode
  animateLayout?: boolean
  columns?: DashboardColumnConfig
  rowHeight?: number
  gap?: number
  breakpoints?: DashboardBreakpointConfig
  masonryColumnWidth?: number
  masonryMaxColumnCount?: number
  itemClassName?: string | ((item: DashboardLayoutItem, state: DashboardLayoutRenderState) => string | undefined)
  itemStyle?:
    | React.CSSProperties
    | ((item: DashboardLayoutItem, state: DashboardLayoutRenderState) => React.CSSProperties | undefined)
  packing?: DashboardLayoutPacking
  renderItem?: (item: DashboardLayoutItem, state: DashboardLayoutRenderState) => React.ReactNode
}

export interface DashboardPresetPickerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  presets?: readonly DashboardLayoutPreset[]
  value?: string
  onValueChange?: (preset: DashboardLayoutPreset) => void
  previewHeight?: number
}

export interface DashboardPresetPreviewProps extends React.ComponentPropsWithoutRef<'div'> {
  preset: DashboardLayoutPreset
}

export interface DashboardLayoutModeControlProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value: DashboardLayoutMode
  onValueChange?: (mode: DashboardLayoutMode) => void
}

const DEFAULT_COLUMNS: Record<DashboardLayoutBreakpoint, number> = {
  ...DEFAULT_THEME_DASHBOARD_COLUMNS,
}

const DEFAULT_BREAKPOINTS: Required<DashboardBreakpointConfig> = {
  ...DEFAULT_THEME_BREAKPOINTS,
}

const DEFAULT_PACKING: DashboardLayoutPacking = 'none'

type DashboardCollisionAxis = 'vertical' | 'horizontal'

export const DASHBOARD_LAYOUT_TRANSITION = {
  layout: {
    type: 'spring',
    stiffness: 380,
    damping: 38,
    mass: 0.75,
  },
} as const

const BREAKPOINT_KEYS: Array<Exclude<DashboardLayoutBreakpoint, 'initial'>> = ['xs', 'sm', 'md', 'lg', 'xl']
const DASHBOARD_LAYOUT_BREAKPOINTS_ASC: readonly DashboardLayoutBreakpoint[] = ['initial', ...BREAKPOINT_KEYS]
export const dashboardLayoutBreakpoints: readonly DashboardLayoutBreakpoint[] = Object.freeze([
  ...DASHBOARD_LAYOUT_BREAKPOINTS_ASC,
])

function getDashboardBreakpointMinWidth(
  breakpoint: Exclude<DashboardLayoutBreakpoint, 'initial'>,
  breakpoints: DashboardBreakpointConfig,
) {
  const value = breakpoints[breakpoint]
  return typeof value === 'number' && Number.isFinite(value) ? value : DEFAULT_BREAKPOINTS[breakpoint]
}

function getOrderedDashboardBreakpointEntries(breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS) {
  return BREAKPOINT_KEYS.map((key, index) => ({
    key,
    index,
    minWidth: getDashboardBreakpointMinWidth(key, breakpoints),
  })).sort((a, b) => a.minWidth - b.minWidth || a.index - b.index)
}

function getOrderedDashboardLayoutBreakpoints(
  breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS,
): DashboardLayoutBreakpoint[] {
  return ['initial', ...getOrderedDashboardBreakpointEntries(breakpoints).map(entry => entry.key)]
}

function matrixItems(prefix: string, columns: number, rows: number): DashboardLayoutItem[] {
  return Array.from({ length: columns * rows }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    x: index % columns,
    y: Math.floor(index / columns),
    w: 1,
    h: 1,
  }))
}

export const dashboardLayoutPresets: readonly DashboardLayoutPreset[] = [
  {
    id: 'three-by-three',
    name: '3x3',
    description: 'Nine equal dashboard slots.',
    columns: 3,
    rows: 3,
    items: matrixItems('three-by-three', 3, 3),
  },
  {
    id: 'four-by-four',
    name: '4x4',
    description: 'Sixteen equal dashboard slots.',
    columns: 4,
    rows: 4,
    items: matrixItems('four-by-four', 4, 4),
  },
  {
    id: 'feature-with-rails',
    name: 'Feature',
    description: 'Large center widget with supporting side and lower slots.',
    columns: 4,
    rows: 4,
    items: [
      { id: 'feature-left-top', x: 0, y: 0, w: 1, h: 1 },
      { id: 'feature-main', x: 1, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { id: 'feature-right-top', x: 3, y: 0, w: 1, h: 1 },
      { id: 'feature-left-mid', x: 0, y: 1, w: 1, h: 1 },
      { id: 'feature-right-mid', x: 3, y: 1, w: 1, h: 1 },
      { id: 'feature-bottom-left', x: 0, y: 2, w: 1, h: 1 },
      { id: 'feature-bottom-wide', x: 1, y: 2, w: 2, h: 1 },
      { id: 'feature-bottom-right', x: 3, y: 2, w: 1, h: 1 },
      { id: 'feature-footer-left', x: 0, y: 3, w: 1, h: 1 },
      { id: 'feature-footer-wide', x: 1, y: 3, w: 2, h: 1 },
      { id: 'feature-footer-right', x: 3, y: 3, w: 1, h: 1 },
    ],
  },
  {
    id: 'two-up-with-footer',
    name: '2 + wide',
    description: 'Two tall widgets over one full-width row.',
    columns: 2,
    rows: 3,
    items: [
      { id: 'two-up-left', x: 0, y: 0, w: 1, h: 2, minH: 2 },
      { id: 'two-up-right', x: 1, y: 0, w: 1, h: 2, minH: 2 },
      { id: 'two-up-footer', x: 0, y: 2, w: 2, h: 1, minW: 2 },
    ],
  },
]

function cloneDashboardLayoutItem(item: DashboardLayoutItem, id = item.id): DashboardLayoutItem {
  return {
    ...item,
    id,
    meta: item.meta ? cloneMetaRecord(item.meta) : undefined,
    items: item.items?.map(child => cloneDashboardLayoutItem(child)),
  }
}

function cloneMetaRecord(value: Record<string, unknown>): Record<string, unknown> {
  return cloneMetaValue(value) as Record<string, unknown>
}

function cloneMetaValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneMetaValue)

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, cloneMetaValue(child)]),
    )
  }

  return value
}

export function createDashboardItemsFromPreset(
  preset: DashboardLayoutPreset,
  widgetIds?: readonly string[],
): DashboardLayoutItem[] {
  return preset.items.map((item, index) => cloneDashboardLayoutItem(item, widgetIds?.[index] ?? item.id))
}

export function createDashboardLayoutsFromPreset(
  preset: DashboardLayoutPreset | undefined,
  { breakpoints = DEFAULT_BREAKPOINTS, columns = DEFAULT_COLUMNS, items = [] }: DashboardPresetLayoutOptions = {},
): DashboardResponsiveLayoutItems {
  if (!preset) return {}

  return dashboardLayoutBreakpoints.reduce<DashboardResponsiveLayoutItems>((layouts, breakpoint) => {
    layouts[breakpoint] = createDashboardItemsFromPresetForColumns(
      preset,
      getDashboardColumnsForBreakpoint(breakpoint, columns, breakpoints),
      items,
    )
    return layouts
  }, {})
}

export function createDashboardItemsFromPresetForColumns(
  preset: DashboardLayoutPreset,
  columns: number,
  sourceItems: readonly DashboardLayoutItem[] = [],
) {
  const scale = columns / Math.max(1, preset.columns)
  const presetItems = normalizeDashboardLayoutItems(
    createDashboardItemsFromPreset(preset).map(item => scaleDashboardPresetItemGeometry(item, scale)),
    columns,
  )
  const sourceItemCount = sourceItems.length
  const itemCount = Math.max(sourceItemCount, presetItems.length)
  const patternRows = getDashboardPresetPatternRows(presetItems)

  return normalizeDashboardLayoutItems(
    Array.from({ length: itemCount }, (_, index) => {
      const presetItem = getDashboardPresetPatternItem(index, presetItems, patternRows, columns)
      const sourceItem = sourceItems[index]

      if (!sourceItem) return presetItem

      return {
        ...sourceItem,
        x: presetItem.x,
        y: presetItem.y,
        w: presetItem.w,
        h: presetItem.h,
        minW: presetItem.minW,
        maxW: presetItem.maxW,
        minH: presetItem.minH,
        maxH: presetItem.maxH,
      }
    }),
    columns,
  )
}

function getDashboardPresetPatternRows(items: readonly DashboardLayoutItem[]) {
  return Math.max(1, ...items.map(item => item.y + item.h))
}

function getDashboardPresetPatternItem(
  index: number,
  items: readonly DashboardLayoutItem[],
  patternRows: number,
  columns: number,
) {
  const item = items[index % items.length]
  if (!item) return createDashboardPresetOverflowItem(index, columns, 0)

  const repeat = Math.floor(index / items.length)
  return {
    ...item,
    id: repeat === 0 ? item.id : `${item.id}-${repeat + 1}`,
    y: item.y + repeat * patternRows,
  }
}

export function createDashboardPresetFromItems({
  id,
  name,
  description,
  mode = 'grid',
  columns,
  items,
}: DashboardPresetFromItemsOptions): DashboardLayoutPreset {
  const resolvedColumns = Math.max(1, Math.round(columns))
  const normalizedItems = normalizeDashboardLayoutItems(items, resolvedColumns).map(item =>
    cloneDashboardLayoutItem(item),
  )
  const rows = normalizedItems.reduce((max, item) => Math.max(max, item.y + item.h), 1)

  return {
    id: id ?? createDashboardPresetId(name),
    name,
    description,
    mode,
    columns: resolvedColumns,
    rows,
    items: normalizedItems,
  }
}

export function isDashboardLayoutPresetDirty(
  preset: DashboardLayoutPreset | undefined,
  items: readonly DashboardLayoutItem[],
  columns: number,
) {
  if (!preset) return items.length > 0
  return !areLayoutItemsEqual(items, createDashboardItemsFromPresetForColumns(preset, columns, items))
}

function createDashboardPresetId(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'custom-layout'
}

function scaleDashboardPresetItemGeometry(item: DashboardLayoutItem, scale: number): DashboardLayoutItem {
  return {
    ...item,
    title: item.title ?? item.id,
    x: Math.round(item.x * scale),
    w: Math.max(1, Math.round(item.w * scale)),
    minW: item.minW == null ? undefined : Math.max(1, Math.round(item.minW * scale)),
    maxW: item.maxW == null ? undefined : Math.max(1, Math.round(item.maxW * scale)),
    items: item.items?.map(child => scaleDashboardPresetItemGeometry(child, scale)),
  }
}

function createDashboardPresetOverflowItem(index: number, columns: number, y: number): DashboardLayoutItem {
  return {
    id: `preset-overflow-${index + 1}`,
    x: index % columns,
    y: y + Math.floor(index / columns),
    w: 1,
    h: 1,
  }
}

export function getDashboardColumnsForWidth(
  width: number,
  columns: DashboardColumnConfig = DEFAULT_COLUMNS,
  breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS,
): number {
  if (typeof columns === 'number') return Math.max(1, Math.round(columns))

  let value = columns.initial ?? DEFAULT_COLUMNS.initial
  let resolvedMinWidth = Number.NEGATIVE_INFINITY
  const activeBreakpoints = getOrderedDashboardBreakpointEntries(breakpoints)

  for (const breakpoint of activeBreakpoints) {
    if (width >= breakpoint.minWidth && breakpoint.minWidth > resolvedMinWidth) {
      value = columns[breakpoint.key] ?? DEFAULT_COLUMNS[breakpoint.key] ?? value
      resolvedMinWidth = breakpoint.minWidth
    }
  }

  return Math.max(1, Math.round(value))
}

export function getDashboardColumnsForBreakpoint(
  breakpoint: DashboardLayoutBreakpoint,
  columns: DashboardColumnConfig = DEFAULT_COLUMNS,
  breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS,
): number {
  if (typeof columns === 'number') return Math.max(1, Math.round(columns))

  let value = columns.initial ?? DEFAULT_COLUMNS.initial
  const orderedBreakpoints = getOrderedDashboardLayoutBreakpoints(breakpoints)
  const index = orderedBreakpoints.indexOf(breakpoint)
  const activeBreakpoints = orderedBreakpoints.slice(1, Math.max(1, index + 1))

  for (const key of activeBreakpoints) {
    value = columns[key] ?? DEFAULT_COLUMNS[key] ?? value
  }

  return Math.max(1, Math.round(value))
}

export function getDashboardBreakpointForWidth(
  width: number,
  breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS,
): DashboardLayoutBreakpoint {
  let value: DashboardLayoutBreakpoint = 'initial'
  let resolvedMinWidth = Number.NEGATIVE_INFINITY
  const activeBreakpoints = getOrderedDashboardBreakpointEntries(breakpoints)

  for (const breakpoint of activeBreakpoints) {
    if (width >= breakpoint.minWidth && breakpoint.minWidth > resolvedMinWidth) {
      value = breakpoint.key
      resolvedMinWidth = breakpoint.minWidth
    }
  }

  return value
}

export function getDashboardLayoutBreakpoint(
  layouts: DashboardResponsiveLayoutItems | undefined,
  breakpoint: DashboardLayoutBreakpoint,
  breakpoints: DashboardBreakpointConfig = DEFAULT_BREAKPOINTS,
): DashboardLayoutBreakpoint | undefined {
  if (!layouts) return undefined
  if (layouts[breakpoint]) return breakpoint

  const orderedBreakpoints = getOrderedDashboardLayoutBreakpoints(breakpoints)
  const index = orderedBreakpoints.indexOf(breakpoint)
  const larger = orderedBreakpoints.slice(index + 1).find(candidate => layouts[candidate])
  if (larger) return larger

  return orderedBreakpoints
    .slice(0, index)
    .reverse()
    .find(candidate => layouts[candidate])
}

export function updateDashboardLayoutsWithItems(
  layouts: DashboardResponsiveLayoutItems,
  breakpoint: DashboardLayoutBreakpoint,
  items: readonly DashboardLayoutItem[],
): DashboardResponsiveLayoutItems {
  return {
    ...layouts,
    [breakpoint]: items.map(item => cloneDashboardLayoutItem(item)),
  }
}

export function normalizeDashboardResponsiveLayouts(
  layouts: DashboardResponsiveLayoutItems | undefined,
  options: DashboardResponsiveLayoutOptions = {},
): DashboardResponsiveLayoutItems {
  if (!layouts) return {}

  const columns = options.columns ?? DEFAULT_COLUMNS
  const breakpoints = options.breakpoints ?? DEFAULT_BREAKPOINTS
  const packing = options.packing ?? DEFAULT_PACKING
  const normalizedLayouts: DashboardResponsiveLayoutItems = {}

  for (const breakpoint of DASHBOARD_LAYOUT_BREAKPOINTS_ASC) {
    const items = layouts[breakpoint]
    if (!items) continue

    normalizedLayouts[breakpoint] = packDashboardLayoutItems(
      items,
      getDashboardColumnsForBreakpoint(breakpoint, columns, breakpoints),
      packing,
    )
  }

  return normalizedLayouts
}

export function normalizeDashboardLayoutItems(items: readonly DashboardLayoutItem[], columns: number) {
  return normalizeDashboardLayoutItemsForColumns(items, columns)
}

export function packDashboardLayoutItems(
  items: readonly DashboardLayoutItem[],
  columns: number,
  packing: DashboardLayoutPacking = DEFAULT_PACKING,
) {
  const normalizedItems =
    packing === 'horizontal'
      ? normalizeDashboardLayoutItemsWithPinned(items, columns, new Set(), 'horizontal')
      : normalizeDashboardLayoutItemsForColumns(items, columns)

  switch (packing) {
    case 'vertical':
      return compactDashboardLayoutItems(normalizedItems, 'vertical')
    case 'horizontal':
      return compactDashboardLayoutItems(normalizedItems, 'horizontal')
    case 'dense':
      return densePackDashboardLayoutItems(normalizedItems, columns)
    case 'none':
      return normalizedItems
  }
}

function normalizeDashboardLayoutItemsForColumns(items: readonly DashboardLayoutItem[], columns: number) {
  return normalizeDashboardLayoutItemsWithPinned(items, columns, new Set())
}

export function packDashboardLayoutItemsWithPinned(
  items: readonly DashboardLayoutItem[],
  columns: number,
  packing: DashboardLayoutPacking,
  pinnedItemIds: ReadonlySet<string>,
) {
  const normalizedItems = normalizeDashboardLayoutItemsWithPinned(
    items,
    columns,
    pinnedItemIds,
    packing === 'horizontal' ? 'horizontal' : 'vertical',
  )

  switch (packing) {
    case 'vertical':
      return compactDashboardLayoutItems(normalizedItems, 'vertical', pinnedItemIds)
    case 'horizontal':
      return compactDashboardLayoutItems(normalizedItems, 'horizontal', pinnedItemIds)
    case 'dense':
      return densePackDashboardLayoutItems(normalizedItems, columns, pinnedItemIds)
    case 'none':
      return normalizedItems
  }
}

function normalizeDashboardLayoutItemsWithPinned(
  items: readonly DashboardLayoutItem[],
  columns: number,
  pinnedItemIds: ReadonlySet<string>,
  collisionAxis: DashboardCollisionAxis = 'vertical',
) {
  const entries = items.map((item, index) => ({
    item: normalizeDashboardLayoutItem(item, columns),
    index,
  }))
  const priorityEntries = [
    ...entries.filter(entry => entry.item.static),
    ...entries.filter(entry => !entry.item.static && pinnedItemIds.has(entry.item.id)),
    ...entries.filter(entry => !entry.item.static && !pinnedItemIds.has(entry.item.id)),
  ]
  const placed: DashboardLayoutItem[] = []
  const resolved = new Array<DashboardLayoutItem>(items.length)

  for (const entry of priorityEntries) {
    const item = entry.item.static ? entry.item : resolveItemCollision(entry.item, placed, columns, collisionAxis)
    placed.push(item)
    resolved[entry.index] = item
  }

  return resolved
}

function compactDashboardLayoutItems(
  items: readonly DashboardLayoutItem[],
  axis: 'vertical' | 'horizontal',
  pinnedItemIds: ReadonlySet<string> = new Set(),
) {
  const ordered = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.y - b.item.y || a.item.x - b.item.x || a.index - b.index)
  const placed: DashboardLayoutItem[] = items.filter(item => item.static || pinnedItemIds.has(item.id))
  const resolved = new Array<DashboardLayoutItem>(items.length)

  for (const entry of ordered) {
    if (entry.item.static || pinnedItemIds.has(entry.item.id)) {
      resolved[entry.index] = entry.item
      continue
    }

    let item = entry.item

    if (axis === 'vertical') {
      let searchItem = item
      while (searchItem.y > 0) {
        const candidate = { ...searchItem, y: searchItem.y - 1 }
        const collisions = placed.filter(other => rectanglesOverlap(candidate, other))
        if (collisions.length === 0) {
          item = candidate
          searchItem = candidate
          continue
        }
        if (canCompactThroughCollisions(collisions, pinnedItemIds)) {
          searchItem = candidate
          continue
        }
        break
      }
    } else {
      let searchItem = item
      while (searchItem.x > 0) {
        const candidate = { ...searchItem, x: searchItem.x - 1 }
        const collisions = placed.filter(other => rectanglesOverlap(candidate, other))
        if (collisions.length === 0) {
          item = candidate
          searchItem = candidate
          continue
        }
        if (canCompactThroughCollisions(collisions, pinnedItemIds)) {
          searchItem = candidate
          continue
        }
        break
      }
    }

    placed.push(item)
    resolved[entry.index] = item
  }

  return resolved
}

function canCompactThroughCollisions(collisions: readonly DashboardLayoutItem[], pinnedItemIds: ReadonlySet<string>) {
  return collisions.length > 0 && collisions.every(item => pinnedItemIds.has(item.id))
}

function densePackDashboardLayoutItems(
  items: readonly DashboardLayoutItem[],
  columns: number,
  pinnedItemIds: ReadonlySet<string> = new Set(),
) {
  const ordered = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.y - b.item.y || a.item.x - b.item.x || a.index - b.index)
  const placed: DashboardLayoutItem[] = items.filter(item => item.static || pinnedItemIds.has(item.id))
  const resolved = new Array<DashboardLayoutItem>(items.length)

  for (const entry of ordered) {
    if (entry.item.static || pinnedItemIds.has(entry.item.id)) {
      resolved[entry.index] = entry.item
      continue
    }

    const packed = findDensePackingPosition(entry.item, placed, columns)
    placed.push(packed)
    resolved[entry.index] = packed
  }

  return resolved
}

function findDensePackingPosition(item: DashboardLayoutItem, placed: readonly DashboardLayoutItem[], columns: number) {
  let y = 0
  const maxY = placed.reduce((sum, placedItem) => sum + placedItem.h, 0) + item.h

  while (y <= maxY) {
    for (let x = 0; x <= Math.max(0, columns - item.w); x += 1) {
      const candidate = { ...item, x, y }
      if (!placed.some(other => rectanglesOverlap(candidate, other))) return candidate
    }

    y += 1
  }

  return { ...item, x: 0, y }
}

export function normalizeDashboardLayoutItem(item: DashboardLayoutItem, columns: number): DashboardLayoutItem {
  const minW = clamp(Math.round(item.minW ?? 1), 1, columns)
  const maxW = clamp(Math.round(item.maxW ?? columns), minW, columns)
  const w = clamp(Math.round(item.w || minW), minW, maxW)
  const x = clamp(Math.round(item.x || 0), 0, Math.max(0, columns - w))
  const minH = Math.max(1, Math.round(item.minH ?? 1))
  const maxH = Math.max(minH, Math.round(item.maxH ?? Number.MAX_SAFE_INTEGER))
  const h = clamp(Math.round(item.h || minH), minH, maxH)
  const y = Math.max(0, Math.round(item.y || 0))

  return {
    ...item,
    x,
    y,
    w,
    h,
    minW,
    maxW,
    minH,
    maxH: item.maxH == null ? undefined : maxH,
  }
}

export const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
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
      itemClassName,
      itemStyle,
      packing = DEFAULT_PACKING,
      renderItem,
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

    const stateForItem = React.useCallback(
      (_item: DashboardLayoutItem): DashboardLayoutRenderState => ({
        breakpoint: activeBreakpoint,
        editable: false,
        dragging: false,
        selected: false,
        mode,
        columns: activeColumns,
      }),
      [activeBreakpoint, activeColumns, mode],
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
                <DashboardItemFrame
                  item={item}
                  state={state}
                  animateLayout={animateLayout}
                  itemClassName={itemClassName}
                  itemStyle={itemStyle}
                  renderItem={renderItem}
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
            <DashboardItemFrame
              key={item.id}
              item={item}
              state={state}
              animateLayout={animateLayout}
              itemClassName={itemClassName}
              itemStyle={itemStyle}
              renderItem={renderItem}
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

DashboardLayout.displayName = 'DashboardLayout'

export function DashboardPresetPicker({
  presets = dashboardLayoutPresets,
  value,
  onValueChange,
  previewHeight = 96,
  className,
  ...props
}: DashboardPresetPickerProps) {
  return (
    <div {...props} role="radiogroup" className={cn(presetPicker, className)}>
      {presets.map(preset => {
        const selected = value === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(presetButton, selected && presetButtonSelected)}
            onClick={() => onValueChange?.(preset)}
          >
            <DashboardPresetPreview preset={preset} style={{ height: previewHeight }} />
            <span className={presetName}>{preset.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export function DashboardPresetPreview({ preset, className, style, ...props }: DashboardPresetPreviewProps) {
  const rows = preset.rows ?? Math.max(...preset.items.map(item => item.y + item.h), 1)

  return (
    <div
      {...props}
      aria-hidden
      className={cn(presetPreview, className)}
      style={{
        gridTemplateColumns: `repeat(${preset.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: 4,
        ...style,
      }}
    >
      {preset.items.map(item => (
        <span
          key={item.id}
          className={presetPreviewCell}
          style={{
            gridColumn: `${item.x + 1} / span ${item.w}`,
            gridRow: `${item.y + 1} / span ${item.h}`,
          }}
        />
      ))}
    </div>
  )
}

export function DashboardLayoutModeControl({
  value,
  onValueChange,
  className,
  ...props
}: DashboardLayoutModeControlProps) {
  return (
    <div {...props} className={cn(modeControl, className)}>
      {(['grid', 'masonry'] as const).map(mode => (
        <button
          key={mode}
          type="button"
          className={cn(modeButton, value === mode && modeButtonSelected)}
          aria-pressed={value === mode}
          onClick={() => onValueChange?.(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}

interface DashboardItemFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  item: DashboardLayoutItem
  state: DashboardLayoutRenderState
  animateLayout: boolean
  itemClassName?: DashboardLayoutProps['itemClassName']
  itemStyle?: DashboardLayoutProps['itemStyle']
  renderItem?: DashboardLayoutProps['renderItem']
}

function DashboardItemFrame({
  item,
  state,
  animateLayout,
  itemClassName,
  itemStyle,
  renderItem,
  className,
  style,
}: DashboardItemFrameProps) {
  const label = getItemLabel(item)
  const resolvedItemClassName = typeof itemClassName === 'function' ? itemClassName(item, state) : itemClassName
  const resolvedItemStyle = typeof itemStyle === 'function' ? itemStyle(item, state) : itemStyle

  const active = state.selected || state.dragging

  return (
    <Card.Root asChild size="xs" variant={active ? 'soft' : 'surface'} color={active ? 'primary' : 'neutral'}>
      <m.div
        layout={animateLayout}
        transition={DASHBOARD_LAYOUT_TRANSITION}
        data-slot="dashboard-layout-item"
        data-dashboard-item-id={item.id}
        className={cn(
          'relative isolate min-w-0 overflow-hidden transition-opacity duration-150',
          resolvedItemClassName,
          className,
        )}
        style={{
          ...resolvedItemStyle,
          ...style,
        }}
        role="group"
        aria-label={label}
      >
        <div data-slot="dashboard-layout-item-content" className="h-full min-h-0 min-w-0">
          {renderItem ? renderItem(item, state) : <div className={dashboardItemFallback}>{label}</div>}
        </div>
      </m.div>
    </Card.Root>
  )
}

export function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const updateWidth = () => setWidth(Math.round(element.getBoundingClientRect().width))
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return width
}

function resolveItemCollision(
  item: DashboardLayoutItem,
  items: readonly DashboardLayoutItem[],
  columns: number,
  axis: DashboardCollisionAxis,
) {
  let resolved = item

  while (true) {
    const overlaps = items.filter(other => other.id !== resolved.id && rectanglesOverlap(resolved, other))
    if (overlaps.length === 0) return resolved

    if (axis === 'horizontal') {
      const nextX = Math.max(...overlaps.map(other => other.x + other.w))
      if (nextX + resolved.w <= columns) {
        resolved = {
          ...resolved,
          x: nextX,
        }
        continue
      }
    }

    resolved = {
      ...resolved,
      x: axis === 'horizontal' ? 0 : resolved.x,
      y: Math.max(...overlaps.map(other => other.y + other.h)),
    }
  }
}

function rectanglesOverlap(a: DashboardLayoutItem, b: DashboardLayoutItem) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

export function getGridHeight(items: readonly DashboardLayoutItem[], rowHeight: number, gap: number) {
  const rows = Math.max(1, ...items.map(item => item.y + item.h))
  return rows * rowHeight + Math.max(0, rows - 1) * gap
}

export function getItemLabel(item: DashboardLayoutItem) {
  return item.title ?? item.componentName ?? item.id
}

function areItemsEqual(a: DashboardLayoutItem, b: DashboardLayoutItem) {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h
}

export function areLayoutItemsEqual(a: readonly DashboardLayoutItem[], b: readonly DashboardLayoutItem[]) {
  if (a.length !== b.length) return false

  return a.every((item, index) => {
    const other = b[index]
    return other?.id === item.id && areItemsEqual(item, other)
  })
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
