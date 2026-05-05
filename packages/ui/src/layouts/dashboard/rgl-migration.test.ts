import { describe, expect, it } from 'vitest'
import { getDashboardColumnsForWidth } from './DashboardLayout'
import {
  dashboardBreakpointsFromRglBreakpoints,
  dashboardColumnsFromRglCols,
  dashboardLayoutItemsFromRglLayout,
  dashboardLayoutItemsFromRglLayouts,
  dashboardResponsiveLayoutItemsFromRglLayouts,
  getDashboardRglBreakpointForWidth,
  getDashboardRglLayoutBreakpoint,
  rglLayoutFromDashboardItems,
  updateRglLayoutsWithDashboardItems,
  type DashboardRglLayouts,
} from './rgl-migration'

describe('dashboard RGL migration helpers', () => {
  it('maps RGL layout items to dashboard layout items', () => {
    const [item] = dashboardLayoutItemsFromRglLayout(
      [
        {
          i: 'sales',
          x: 0,
          y: 0,
          w: 4,
          h: 6,
          componentName: 'sales-chart',
          moved: false,
          isResizable: true,
          resizeHandles: ['sw'],
          meta: { owner: 'finance' },
        },
      ],
      { columns: 12 },
    )

    expect(item).toMatchObject({
      id: 'sales',
      x: 0,
      y: 0,
      w: 4,
      h: 6,
      componentName: 'sales-chart',
      meta: {
        owner: 'finance',
        rgl: {
          moved: false,
          isResizable: true,
          resizeHandles: ['sw'],
        },
      },
    })
  })

  it('normalizes breakpoint-clamped RGL items without overlapping', () => {
    const items = dashboardLayoutItemsFromRglLayout(
      [
        { i: 'first', x: 0, y: 0, w: 6, h: 2 },
        { i: 'second', x: 6, y: 0, w: 6, h: 2 },
      ],
      { columns: 1 },
    )

    expect(items.map(item => `${item.id}:${item.x}:${item.y}:${item.w}:${item.h}`)).toEqual([
      'first:0:0:1:2',
      'second:0:2:1:2',
    ])
  })

  it('preserves nested group layouts as recursive dashboard items', () => {
    const [group] = dashboardLayoutItemsFromRglLayout(
      [
        {
          i: 'grid-a',
          x: 0,
          y: 0,
          w: 8,
          h: 13,
          compactType: 'vertical',
          layouts: [
            { i: 'grid-a|0', x: 0, y: 0, w: 6, h: 12, componentName: 'new-tasks' },
            { i: 'grid-a|1', x: 6, y: 0, w: 6, h: 12, componentName: 'total-tasks' },
          ],
        },
      ],
      { columns: 12 },
    )

    expect(group).toMatchObject({
      id: 'grid-a',
      w: 8,
      h: 13,
      items: [
        { id: 'grid-a|0', componentName: 'new-tasks', x: 0, y: 0, w: 6, h: 12 },
        { id: 'grid-a|1', componentName: 'total-tasks', x: 6, y: 0, w: 6, h: 12 },
      ],
      meta: {
        rgl: {
          compactType: 'vertical',
        },
      },
    })
  })

  it('does not renormalize nested group layouts to the parent breakpoint columns', () => {
    const [group] = dashboardLayoutItemsFromRglLayout(
      [
        {
          i: 'grid-a',
          x: 0,
          y: 0,
          w: 2,
          h: 10,
          layouts: [
            { i: 'grid-a|0', x: 0, y: 0, w: 6, h: 5, componentName: 'nested-a' },
            { i: 'grid-a|1', x: 6, y: 0, w: 6, h: 5, componentName: 'nested-b' },
          ],
        },
      ],
      { columns: 2 },
    )

    expect(group).toMatchObject({
      id: 'grid-a',
      w: 2,
      items: [
        { id: 'grid-a|0', x: 0, y: 0, w: 6, h: 5 },
        { id: 'grid-a|1', x: 6, y: 0, w: 6, h: 5 },
      ],
    })
  })

  it('maps RGL responsive layouts and cols to dashboard breakpoints', () => {
    const layouts: DashboardRglLayouts = {
      xxs: [{ i: 'mobile', x: 0, y: 0, w: 2, h: 3 }],
      lg: [{ i: 'desktop', x: 0, y: 0, w: 6, h: 3 }],
    }

    expect(dashboardColumnsFromRglCols({ xxs: 2, xs: 4, sm: 8, md: 10, lg: 12 })).toEqual({
      initial: 2,
      xs: 4,
      sm: 8,
      md: 10,
      lg: 12,
      xl: 12,
    })
    expect(dashboardResponsiveLayoutItemsFromRglLayouts(layouts, { xxs: 2, lg: 12 })).toMatchObject({
      initial: [{ id: 'mobile', w: 2 }],
      lg: [{ id: 'desktop', w: 6 }],
    })
    expect(dashboardLayoutItemsFromRglLayouts(layouts, 'lg')).toMatchObject([{ id: 'desktop' }])
  })

  it('resolves active RGL breakpoints from width', () => {
    expect(getDashboardRglBreakpointForWidth(1280)).toBe('lg')
    expect(getDashboardRglBreakpointForWidth(1000)).toBe('md')
    expect(getDashboardRglBreakpointForWidth(800)).toBe('sm')
    expect(getDashboardRglBreakpointForWidth(500)).toBe('xs')
    expect(getDashboardRglBreakpointForWidth(320)).toBe('xxs')
  })

  it('maps RGL responsive defaults to dashboard columns and breakpoints', () => {
    const columns = dashboardColumnsFromRglCols()
    const breakpoints = dashboardBreakpointsFromRglBreakpoints()

    expect(columns).toEqual({
      initial: 2,
      xs: 4,
      sm: 6,
      md: 10,
      lg: 12,
      xl: 12,
    })
    expect(getDashboardColumnsForWidth(1100, columns, breakpoints)).toBe(10)
    expect(getDashboardColumnsForWidth(1200, columns, breakpoints)).toBe(12)
  })

  it('falls back to the closest persisted RGL layout for missing breakpoints', () => {
    const layouts: DashboardRglLayouts = {
      lg: [{ i: 'desktop', x: 0, y: 0, w: 6, h: 3 }],
      xxs: [{ i: 'mobile', x: 0, y: 0, w: 1, h: 3 }],
    }

    expect(getDashboardRglLayoutBreakpoint(layouts, 'md')).toBe('lg')
    expect(getDashboardRglLayoutBreakpoint(layouts, 'xs')).toBe('lg')
    expect(dashboardLayoutItemsFromRglLayouts(layouts, 'xs', { xs: 2 })).toMatchObject([
      { id: 'desktop', x: 0, y: 0, w: 2, h: 3 },
    ])
  })

  it('writes dashboard changes back to RGL layouts while preserving legacy fields', () => {
    const layouts: DashboardRglLayouts = {
      lg: [
        {
          i: 'sales',
          x: 0,
          y: 0,
          w: 4,
          h: 6,
          componentName: 'sales-chart',
          isDraggable: true,
        },
      ],
      xxs: [{ i: 'sales', x: 0, y: 0, w: 2, h: 6, componentName: 'sales-chart' }],
    }

    const next = updateRglLayoutsWithDashboardItems(layouts, 'lg', [
      {
        id: 'sales',
        x: 2,
        y: 3,
        w: 5,
        h: 7,
        componentName: 'sales-chart',
      },
    ])

    expect(next.lg).toEqual([
      expect.objectContaining({
        i: 'sales',
        x: 2,
        y: 3,
        w: 5,
        h: 7,
        componentName: 'sales-chart',
        isDraggable: true,
      }),
    ])
    expect(next.xxs).toBe(layouts.xxs)
  })

  it('round-trips nested dashboard items back to RGL layouts', () => {
    expect(
      rglLayoutFromDashboardItems([
        {
          id: 'grid-a',
          x: 0,
          y: 0,
          w: 8,
          h: 13,
          items: [{ id: 'grid-a|0', x: 0, y: 0, w: 6, h: 12, componentName: 'new-tasks' }],
          meta: {
            rgl: {
              compactType: 'vertical',
            },
          },
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        i: 'grid-a',
        compactType: 'vertical',
        layouts: [expect.objectContaining({ i: 'grid-a|0', componentName: 'new-tasks' })],
      }),
    ])
  })
})
