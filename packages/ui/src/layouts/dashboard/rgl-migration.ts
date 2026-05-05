import type {
  DashboardBreakpointConfig,
  DashboardColumnConfig,
  DashboardLayoutBreakpoint,
  DashboardLayoutItem,
  DashboardResizeHandle,
  DashboardResponsiveLayoutItems,
} from './DashboardLayout'
import { normalizeDashboardLayoutItems } from './DashboardLayout'

export type DashboardRglBreakpoint = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
export type DashboardRglResizeHandle = DashboardResizeHandle | 'ne' | 'nw' | 'sw'
export type { DashboardResponsiveLayoutItems } from './DashboardLayout'

export type DashboardRglLayouts = Partial<Record<DashboardRglBreakpoint, DashboardRglLayoutItem[]>>
export type DashboardRglCols = Partial<Record<DashboardRglBreakpoint, number>>
export type DashboardRglBreakpoints = Partial<Record<DashboardRglBreakpoint, number>>

export interface DashboardRglLayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  moved?: boolean
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
  resizeHandles?: readonly DashboardRglResizeHandle[]
  componentName?: string
  title?: string
  groupId?: string
  compactType?: 'horizontal' | 'vertical' | null
  layouts?: DashboardRglLayoutItem[]
  [key: string]: unknown
}

export interface DashboardRglMigrationOptions {
  columns?: number
  nestedColumns?: number
}

export const dashboardRglDefaultCols: Required<DashboardRglCols> = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
}

export const dashboardRglDefaultBreakpoints: Required<DashboardRglBreakpoints> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
}

const RGL_BREAKPOINTS_ASC: readonly DashboardRglBreakpoint[] = ['xxs', 'xs', 'sm', 'md', 'lg']

const RGL_TO_DASHBOARD_BREAKPOINT: Record<DashboardRglBreakpoint, DashboardLayoutBreakpoint> = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xs: 'xs',
  xxs: 'initial',
}

export function getDashboardBreakpointFromRglBreakpoint(breakpoint: DashboardRglBreakpoint): DashboardLayoutBreakpoint {
  return RGL_TO_DASHBOARD_BREAKPOINT[breakpoint]
}

export function getDashboardRglBreakpointForWidth(
  width: number,
  breakpoints: DashboardRglBreakpoints = dashboardRglDefaultBreakpoints,
): DashboardRglBreakpoint {
  const entries = (
    Object.entries({ ...dashboardRglDefaultBreakpoints, ...breakpoints }) as Array<[DashboardRglBreakpoint, number]>
  ).sort((a, b) => b[1] - a[1])

  return entries.find(([, minWidth]) => width >= minWidth)?.[0] ?? 'xxs'
}

export function dashboardColumnsFromRglCols(cols: DashboardRglCols = dashboardRglDefaultCols): DashboardColumnConfig {
  return {
    initial: cols.xxs ?? cols.xs ?? dashboardRglDefaultCols.xxs,
    xs: cols.xs ?? cols.xxs ?? dashboardRglDefaultCols.xs,
    sm: cols.sm ?? cols.xs ?? dashboardRglDefaultCols.sm,
    md: cols.md ?? cols.sm ?? dashboardRglDefaultCols.md,
    lg: cols.lg ?? cols.md ?? dashboardRglDefaultCols.lg,
    xl: cols.lg ?? cols.md ?? dashboardRglDefaultCols.lg,
  }
}

export function dashboardBreakpointsFromRglBreakpoints(
  breakpoints: DashboardRglBreakpoints = dashboardRglDefaultBreakpoints,
): DashboardBreakpointConfig {
  return {
    xs: breakpoints.xs ?? dashboardRglDefaultBreakpoints.xs,
    sm: breakpoints.sm ?? dashboardRglDefaultBreakpoints.sm,
    md: breakpoints.md ?? dashboardRglDefaultBreakpoints.md,
    lg: breakpoints.lg ?? dashboardRglDefaultBreakpoints.lg,
    xl: breakpoints.lg ?? dashboardRglDefaultBreakpoints.lg,
  }
}

export function dashboardLayoutItemsFromRglLayout(
  layout: readonly DashboardRglLayoutItem[],
  options: DashboardRglMigrationOptions = {},
): DashboardLayoutItem[] {
  const columns = options.columns ?? dashboardRglDefaultCols.lg

  return normalizeDashboardLayoutItems(
    layout.map(item => dashboardLayoutItemFromRglItem(item, options)),
    columns,
  )
}

export function dashboardLayoutItemFromRglItem(
  item: DashboardRglLayoutItem,
  options: DashboardRglMigrationOptions = {},
): DashboardLayoutItem {
  const nestedColumns = options.nestedColumns ?? dashboardRglDefaultCols.lg
  const {
    i,
    x,
    y,
    w,
    h,
    minW,
    maxW,
    minH,
    maxH,
    static: isStatic,
    componentName,
    title,
    groupId,
    layouts,
    meta: legacyMeta,
    ...legacy
  } = item
  const meta = mergeRglMeta(legacy, legacyMeta)

  return stripUndefined({
    id: i,
    x,
    y,
    w,
    h,
    minW,
    maxW,
    minH,
    maxH,
    static: isStatic,
    title,
    componentName,
    groupId,
    items: layouts ? dashboardLayoutItemsFromRglLayout(layouts, { ...options, columns: nestedColumns }) : undefined,
    meta,
  })
}

export function dashboardResponsiveLayoutItemsFromRglLayouts(
  layouts: DashboardRglLayouts,
  cols: DashboardRglCols = dashboardRglDefaultCols,
): DashboardResponsiveLayoutItems {
  return Object.entries(layouts).reduce<DashboardResponsiveLayoutItems>((resolved, [breakpoint, layout]) => {
    if (!layout) return resolved

    const rglBreakpoint = breakpoint as DashboardRglBreakpoint
    const dashboardBreakpoint = getDashboardBreakpointFromRglBreakpoint(rglBreakpoint)
    resolved[dashboardBreakpoint] = dashboardLayoutItemsFromRglLayout(layout, {
      columns: cols[rglBreakpoint] ?? dashboardRglDefaultCols[rglBreakpoint],
    })
    return resolved
  }, {})
}

export function dashboardLayoutItemsFromRglLayouts(
  layouts: DashboardRglLayouts,
  breakpoint: DashboardRglBreakpoint,
  cols: DashboardRglCols = dashboardRglDefaultCols,
): DashboardLayoutItem[] {
  const layoutBreakpoint = getDashboardRglLayoutBreakpoint(layouts, breakpoint)

  return dashboardLayoutItemsFromRglLayout(layoutBreakpoint ? (layouts[layoutBreakpoint] ?? []) : [], {
    columns: cols[breakpoint] ?? dashboardRglDefaultCols[breakpoint],
  })
}

export function getDashboardRglLayoutBreakpoint(
  layouts: DashboardRglLayouts,
  breakpoint: DashboardRglBreakpoint,
): DashboardRglBreakpoint | undefined {
  if (layouts[breakpoint]) return breakpoint

  const index = RGL_BREAKPOINTS_ASC.indexOf(breakpoint)
  const larger = RGL_BREAKPOINTS_ASC.slice(index + 1).find(candidate => layouts[candidate])
  if (larger) return larger

  return RGL_BREAKPOINTS_ASC.slice(0, index)
    .reverse()
    .find(candidate => layouts[candidate])
}

export function rglLayoutFromDashboardItems(
  items: readonly DashboardLayoutItem[],
  previousLayout: readonly DashboardRglLayoutItem[] = [],
): DashboardRglLayoutItem[] {
  const previousById = new Map(previousLayout.map(item => [item.i, item]))

  return items.map(item => rglLayoutItemFromDashboardItem(item, previousById.get(item.id)))
}

export function rglLayoutItemFromDashboardItem(
  item: DashboardLayoutItem,
  previousItem?: DashboardRglLayoutItem,
): DashboardRglLayoutItem {
  const rglMeta = readRglMeta(item.meta)
  const previousNested = previousItem?.layouts

  return stripUndefined({
    ...previousItem,
    ...rglMeta,
    i: item.id,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW ?? previousItem?.minW,
    maxW: item.maxW ?? previousItem?.maxW,
    minH: item.minH ?? previousItem?.minH,
    maxH: item.maxH ?? previousItem?.maxH,
    static: item.static ?? previousItem?.static,
    title: item.title ?? previousItem?.title,
    componentName: item.componentName ?? previousItem?.componentName,
    groupId: item.groupId ?? previousItem?.groupId,
    layouts: item.items ? rglLayoutFromDashboardItems(item.items, previousNested) : previousNested,
  })
}

export function updateRglLayoutsWithDashboardItems(
  layouts: DashboardRglLayouts,
  breakpoint: DashboardRglBreakpoint,
  items: readonly DashboardLayoutItem[],
): DashboardRglLayouts {
  return {
    ...layouts,
    [breakpoint]: rglLayoutFromDashboardItems(items, layouts[breakpoint]),
  }
}

function mergeRglMeta(legacy: Record<string, unknown>, existingMeta: unknown) {
  const meta = isRecord(existingMeta) ? existingMeta : undefined
  const rgl = stripUndefined(legacy)

  if (Object.keys(rgl).length === 0) return meta

  return {
    ...meta,
    rgl,
  }
}

function readRglMeta(meta: DashboardLayoutItem['meta']): Partial<DashboardRglLayoutItem> {
  if (!isRecord(meta?.rgl)) return {}
  return meta.rgl as Partial<DashboardRglLayoutItem>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)) as T
}
