import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/theme/ThemeProvider'

vi.mock('../masonry/Masonry', async () => {
  const ReactModule = await import('react')

  const Root = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>(
    (
      {
        asChild: _asChild,
        children,
        columnCount: _columnCount,
        columnWidth: _columnWidth,
        defaultHeight: _defaultHeight,
        defaultWidth: _defaultWidth,
        fallback: _fallback,
        gap,
        itemHeight: _itemHeight,
        linear: _linear,
        maxColumnCount: _maxColumnCount,
        overscan: _overscan,
        scrollFps: _scrollFps,
        ...props
      },
      ref,
    ) =>
      ReactModule.createElement(
        'div',
        { ...props, ref, 'data-slot': 'masonry', 'data-gap': String(gap) },
        children as React.ReactNode,
      ),
  )
  const Item = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ asChild: _asChild, children, ...props }, ref) =>
      ReactModule.createElement('div', { ...props, ref, 'data-slot': 'masonry-item' }, children as React.ReactNode),
  )

  return {
    Masonry: {
      Root,
      Item,
    },
  }
})

import {
  createDashboardItemsFromPreset,
  createDashboardItemsFromPresetForColumns,
  dashboardLayoutPresets,
  DashboardLayout,
  type DashboardLayoutItem,
  type DashboardLayoutRenderState,
  type DashboardResponsiveLayoutItems,
  getDashboardBreakpointForWidth,
  getDashboardColumnsForBreakpoint,
  getDashboardColumnsForWidth,
  getDashboardLayoutBreakpoint,
  isDashboardLayoutPresetDirty,
  normalizeDashboardLayoutItems,
  normalizeDashboardResponsiveLayouts,
  packDashboardLayoutItems,
  updateDashboardLayoutsWithItems,
} from './DashboardLayout'
import { EditableDashboard } from './EditableDashboard'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function getDashboardGridRoot(container: HTMLElement) {
  const item = container.querySelector('[data-slot="dashboard-layout-item"]')
  const root = item?.parentElement
  if (!(root instanceof HTMLElement)) throw new Error('Expected dashboard grid root')
  return root
}

function getDashboardMasonryRoot(container: HTMLElement) {
  const root = container.querySelector('[data-slot="masonry"]')
  if (!(root instanceof HTMLElement)) throw new Error('Expected dashboard masonry root')
  return root
}

describe('dashboard layout helpers', () => {
  it('ships the starter presets from the dashboard references', () => {
    expect(dashboardLayoutPresets.map(preset => preset.id)).toEqual([
      'three-by-three',
      'four-by-four',
      'feature-with-rails',
      'two-up-with-footer',
    ])

    expect(dashboardLayoutPresets[0]?.items).toHaveLength(9)
    expect(dashboardLayoutPresets[1]?.items).toHaveLength(16)
    expect(dashboardLayoutPresets[2]?.items).toContainEqual(
      expect.objectContaining({ id: 'feature-main', x: 1, y: 0, w: 2, h: 2 }),
    )
    expect(dashboardLayoutPresets[3]?.items).toContainEqual(
      expect.objectContaining({ id: 'two-up-footer', x: 0, y: 2, w: 2, h: 1 }),
    )
  })

  it('materializes preset items with caller-owned widget ids', () => {
    const preset = dashboardLayoutPresets[3]
    expect(preset).toBeDefined()

    const items = createDashboardItemsFromPreset(preset, ['summary', 'activity', 'timeline'])

    expect(items.map(item => item.id)).toEqual(['summary', 'activity', 'timeline'])
    expect(items.map(item => `${item.x}:${item.y}:${item.w}:${item.h}`)).toEqual(['0:0:1:2', '1:0:1:2', '0:2:2:1'])
    expect(preset?.items.map(item => item.id)).toEqual(['two-up-left', 'two-up-right', 'two-up-footer'])
  })

  it('repeats preset geometry for content beyond the preset slot count', () => {
    const preset = dashboardLayoutPresets[3]
    expect(preset).toBeDefined()

    const sourceItems: DashboardLayoutItem[] = Array.from({ length: 5 }, (_, index) => ({
      id: `widget-${index + 1}`,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    }))

    const items = createDashboardItemsFromPresetForColumns(preset, preset?.columns ?? 1, sourceItems)

    expect(items.map(item => `${item.id}:${item.x}:${item.y}:${item.w}:${item.h}`)).toEqual([
      'widget-1:0:0:1:2',
      'widget-2:1:0:1:2',
      'widget-3:0:2:2:1',
      'widget-4:0:3:1:2',
      'widget-5:1:3:1:2',
    ])
  })

  it('detects real preset geometry changes for saved templates', () => {
    const preset = dashboardLayoutPresets[0]
    expect(preset).toBeDefined()

    const items = createDashboardItemsFromPreset(preset)
    const changedItems = items.map((item, index) => (index === 0 ? { ...item, x: item.x + 1 } : item))

    expect(isDashboardLayoutPresetDirty(preset, items, preset?.columns ?? 1)).toBe(false)
    expect(isDashboardLayoutPresetDirty(preset, changedItems, preset?.columns ?? 1)).toBe(true)
    expect(isDashboardLayoutPresetDirty(preset, items, preset?.columns ?? 1)).toBe(false)
  })

  it('deep-clones nested preset items and metadata', () => {
    const preset = {
      id: 'nested',
      name: 'Nested',
      columns: 12,
      items: [
        {
          id: 'group',
          x: 0,
          y: 0,
          w: 12,
          h: 6,
          meta: { rgl: { flags: { active: true }, resizeHandles: ['se'] }, tags: ['source'] },
          items: [{ id: 'child', x: 0, y: 0, w: 6, h: 3, meta: { config: { color: 'blue' } } }],
        },
      ],
    }

    const [group] = createDashboardItemsFromPreset(preset, ['custom-group'])
    const child = group?.items?.[0]
    const groupMeta = group?.meta as
      | { rgl?: { flags?: { active?: boolean }; resizeHandles?: string[] }; tags?: string[] }
      | undefined
    const childMeta = child?.meta as { config?: { color?: string } } | undefined
    if (!child) throw new Error('Expected nested preset child')
    if (!groupMeta?.rgl?.flags || !groupMeta.tags || !childMeta?.config) {
      throw new Error('Expected cloned preset metadata')
    }

    child.x = 4
    groupMeta.rgl.flags.active = false
    groupMeta.tags.push('mutated')
    childMeta.config.color = 'red'

    expect(group).toMatchObject({ id: 'custom-group' })
    expect(preset.items[0]?.items?.[0]?.x).toBe(0)
    expect(preset.items[0]?.meta).toMatchObject({
      rgl: { flags: { active: true }, resizeHandles: ['se'] },
      tags: ['source'],
    })
    expect(preset.items[0]?.items?.[0]?.meta).toMatchObject({ config: { color: 'blue' } })
    expect(createDashboardItemsFromPreset(preset)[0]?.items?.[0]?.x).toBe(0)
  })

  it('resolves responsive columns deterministically from fixed breakpoints', () => {
    const columns = { initial: 1, xs: 2, sm: 4, md: 8, lg: 12 }

    expect(getDashboardColumnsForWidth(320, columns)).toBe(1)
    expect(getDashboardColumnsForWidth(520, columns)).toBe(2)
    expect(getDashboardColumnsForWidth(768, columns)).toBe(4)
    expect(getDashboardColumnsForWidth(1024, columns)).toBe(8)
    expect(getDashboardColumnsForWidth(1280, columns)).toBe(12)
    expect(getDashboardColumnsForWidth(900, 7)).toBe(7)
    expect(getDashboardColumnsForWidth(1100, columns, { lg: 1200 })).toBe(8)
    expect(getDashboardColumnsForWidth(1200, columns, { lg: 1200 })).toBe(12)
    expect(getDashboardColumnsForWidth(1280, { initial: 1, lg: 10, xl: 12 }, { lg: 1200, xl: 1200 })).toBe(10)
  })

  it('resolves columns for explicit JSON layout breakpoints', () => {
    const columns = { initial: 1, sm: 4, md: 8, lg: 12 }

    expect(getDashboardColumnsForBreakpoint('initial', columns)).toBe(1)
    expect(getDashboardColumnsForBreakpoint('xs', columns)).toBe(2)
    expect(getDashboardColumnsForBreakpoint('sm', columns)).toBe(4)
    expect(getDashboardColumnsForBreakpoint('md', columns)).toBe(8)
    expect(getDashboardColumnsForBreakpoint('lg', columns)).toBe(12)
    expect(getDashboardColumnsForBreakpoint('xl', columns)).toBe(12)
    expect(getDashboardColumnsForBreakpoint('md', 6)).toBe(6)
  })

  it('resolves responsive layout breakpoints and updates one breakpoint at a time', () => {
    const initial = [{ id: 'phone', x: 0, y: 0, w: 1, h: 1 }]
    const lg = [{ id: 'desktop', x: 0, y: 0, w: 4, h: 1 }]
    const sm = [{ id: 'compact', x: 0, y: 0, w: 2, h: 1 }]
    const nonMonotonicBreakpoints = { sm: 900, md: 700, lg: 1200 }
    const nonMonotonicColumns = { initial: 1, sm: 6, md: 4, lg: 12 }

    expect(getDashboardBreakpointForWidth(320, { sm: 600, md: 800, lg: 1000 })).toBe('initial')
    expect(getDashboardBreakpointForWidth(720, { sm: 600, md: 800, lg: 1000 })).toBe('sm')
    expect(getDashboardBreakpointForWidth(1200, { sm: 600, md: 800, lg: 1000 })).toBe('lg')
    expect(getDashboardBreakpointForWidth(1280, { lg: 1200, xl: 1200 })).toBe('lg')
    expect(getDashboardBreakpointForWidth(800, nonMonotonicBreakpoints)).toBe('md')
    expect(getDashboardColumnsForWidth(950, nonMonotonicColumns, nonMonotonicBreakpoints)).toBe(6)
    expect(getDashboardColumnsForBreakpoint('sm', nonMonotonicColumns, nonMonotonicBreakpoints)).toBe(6)
    expect(getDashboardLayoutBreakpoint({ lg }, 'sm')).toBe('lg')
    expect(getDashboardLayoutBreakpoint({ initial }, 'md')).toBe('initial')
    expect(getDashboardLayoutBreakpoint({ sm }, 'md', nonMonotonicBreakpoints)).toBe('sm')
    expect(updateDashboardLayoutsWithItems({ initial }, 'md', lg)).toEqual({
      initial,
      md: lg,
    })
  })

  it('normalizes explicit responsive dashboard JSON layouts by breakpoint columns', () => {
    const source: DashboardResponsiveLayoutItems = {
      initial: [
        { id: 'phone-main', x: 2, y: -1, w: 4, h: 0 },
        { id: 'phone-next', x: 0, y: 0, w: 1, h: 1 },
      ],
      md: [{ id: 'tablet-wide', x: 9, y: 0, w: 4, h: 2 }],
      lg: [{ id: 'desktop-wide', x: 8, y: 0, w: 6, h: 1 }],
    }

    const layouts = normalizeDashboardResponsiveLayouts(source, {
      columns: { initial: 1, md: 8, lg: 12 },
    })

    expect(layouts.initial).toEqual([
      expect.objectContaining({ id: 'phone-main', x: 0, y: 0, w: 1, h: 1 }),
      expect.objectContaining({ id: 'phone-next', x: 0, y: 1, w: 1, h: 1 }),
    ])
    expect(layouts.md).toEqual([expect.objectContaining({ id: 'tablet-wide', x: 4, y: 0, w: 4, h: 2 })])
    expect(layouts.lg).toEqual([expect.objectContaining({ id: 'desktop-wide', x: 6, y: 0, w: 6, h: 1 })])
    expect(layouts.sm).toBeUndefined()
    expect(getDashboardLayoutBreakpoint(layouts, 'sm')).toBe('md')
  })

  it('normalizes layout items onto snapped grid units', () => {
    const [item] = normalizeDashboardLayoutItems(
      [
        {
          id: 'bad-random-pixels',
          x: 9.6,
          y: -3,
          w: 7.4,
          h: 0.2,
          minW: 2,
          maxW: 4,
          minH: 2,
          maxH: 0,
        },
      ],
      6,
    )

    expect(item).toMatchObject({
      id: 'bad-random-pixels',
      x: 2,
      y: 0,
      w: 4,
      h: 2,
      minW: 2,
      maxW: 4,
      minH: 2,
      maxH: 2,
    })
  })

  it('packs layout items vertically, horizontally, densely, and leaves none unpacked', () => {
    const items: DashboardLayoutItem[] = [
      { id: 'first', x: 3, y: 3, w: 1, h: 1 },
      { id: 'blocker', x: 0, y: 0, w: 1, h: 1 },
      { id: 'wide', x: 1, y: 4, w: 2, h: 1 },
    ]

    expect(packDashboardLayoutItems(items, 4, 'vertical').map(item => `${item.id}:${item.x}:${item.y}`)).toEqual([
      'first:3:0',
      'blocker:0:0',
      'wide:1:0',
    ])
    expect(packDashboardLayoutItems(items, 4, 'horizontal').map(item => `${item.id}:${item.x}:${item.y}`)).toEqual([
      'first:0:3',
      'blocker:0:0',
      'wide:0:4',
    ])
    expect(packDashboardLayoutItems(items, 4, 'dense').map(item => `${item.id}:${item.x}:${item.y}`)).toEqual([
      'first:1:0',
      'blocker:0:0',
      'wide:2:0',
    ])
    expect(packDashboardLayoutItems(items, 4, 'none').map(item => `${item.id}:${item.x}:${item.y}`)).toEqual([
      'first:3:3',
      'blocker:0:0',
      'wide:1:4',
    ])
  })

  it('keeps static items fixed during packing', () => {
    const verticalItems: DashboardLayoutItem[] = [
      { id: 'static', x: 3, y: 3, w: 1, h: 1, static: true },
      { id: 'free', x: 3, y: 4, w: 1, h: 1 },
    ]
    const horizontalItems: DashboardLayoutItem[] = [
      { id: 'static', x: 2, y: 0, w: 1, h: 1, static: true },
      { id: 'free', x: 3, y: 0, w: 1, h: 1 },
    ]
    const denseItems: DashboardLayoutItem[] = [
      { id: 'static', x: 2, y: 2, w: 1, h: 1, static: true },
      { id: 'free', x: 3, y: 3, w: 1, h: 1 },
    ]

    expect(
      packDashboardLayoutItems(verticalItems, 4, 'vertical').map(item => `${item.id}:${item.x}:${item.y}`),
    ).toEqual(['static:3:3', 'free:3:4'])
    expect(
      packDashboardLayoutItems(horizontalItems, 4, 'horizontal').map(item => `${item.id}:${item.x}:${item.y}`),
    ).toEqual(['static:2:0', 'free:3:0'])
    expect(packDashboardLayoutItems(denseItems, 4, 'dense').map(item => `${item.id}:${item.x}:${item.y}`)).toEqual([
      'static:2:2',
      'free:0:0',
    ])
  })

  it('resolves breakpoint-induced overlaps during normalization', () => {
    const items = normalizeDashboardLayoutItems(
      [
        { id: 'first', x: 0, y: 0, w: 1, h: 1 },
        { id: 'second', x: 1, y: 0, w: 1, h: 1 },
        { id: 'third', x: 2, y: 0, w: 1, h: 1 },
      ],
      1,
    )

    expect(items.map(item => `${item.id}:${item.x}:${item.y}:${item.w}:${item.h}`)).toEqual([
      'first:0:0:1:1',
      'second:0:1:1:1',
      'third:0:2:1:1',
    ])
  })

  it('moves collisions below tall overlapping items without a row cap', () => {
    const items = normalizeDashboardLayoutItems(
      [
        { id: 'tall', x: 0, y: 0, w: 1, h: 240 },
        { id: 'next', x: 1, y: 0, w: 1, h: 1 },
      ],
      1,
    )

    expect(items[1]).toMatchObject({ id: 'next', x: 0, y: 240, w: 1, h: 1 })
  })

  it('moves editable items by keyboard grid cells', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Alpha/ }), { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 })],
      expect.objectContaining({ reason: 'move', itemId: 'alpha', columns: 3 }),
    )
  })

  it('keeps the moved item in place and pushes overlapping neighbors', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [
          { id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 1, y: 0, w: 1, h: 1 },
        ],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Alpha/ }), { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 }),
        expect.objectContaining({ id: 'beta', x: 1, y: 1, w: 1, h: 1 }),
      ],
      expect.objectContaining({
        reason: 'move',
        itemId: 'alpha',
        item: expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 }),
        columns: 3,
      }),
    )
  })

  it('keeps the resized item in place and pushes overlapping neighbors', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [
          { id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 1, y: 0, w: 1, h: 1 },
        ],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Resize Alpha from bottom right corner/ }), {
      key: 'ArrowRight',
    })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 'alpha', x: 0, y: 0, w: 2, h: 1 }),
        expect.objectContaining({ id: 'beta', x: 1, y: 1, w: 1, h: 1 }),
      ],
      expect.objectContaining({
        reason: 'resize',
        itemId: 'alpha',
        item: expect.objectContaining({ id: 'alpha', x: 0, y: 0, w: 2, h: 1 }),
        columns: 3,
      }),
    )
  })

  it('keeps the moved item pinned while auto packing other items', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        packing: 'vertical',
        items: [
          { id: 'alpha', title: 'Alpha', x: 1, y: 1, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 0, y: 0, w: 1, h: 1 },
        ],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Alpha/ }), { key: 'ArrowDown' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 'alpha', x: 1, y: 1, w: 1, h: 1 }),
        expect.objectContaining({ id: 'beta', x: 0, y: 0, w: 1, h: 1 }),
      ],
      expect.objectContaining({
        reason: 'move',
        itemId: 'alpha',
        item: expect.objectContaining({ id: 'alpha', x: 1, y: 1, w: 1, h: 1 }),
        columns: 3,
      }),
    )
  })

  it('moves vertical packing neighbors into the gap vacated by the edited item', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        packing: 'vertical',
        items: [
          { id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 0, y: 1, w: 1, h: 1 },
        ],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Alpha/ }), { key: 'ArrowDown' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 'alpha', x: 0, y: 1, w: 1, h: 1 }),
        expect.objectContaining({ id: 'beta', x: 0, y: 0, w: 1, h: 1 }),
      ],
      expect.objectContaining({
        reason: 'move',
        itemId: 'alpha',
        item: expect.objectContaining({ id: 'alpha', x: 0, y: 1, w: 1, h: 1 }),
        columns: 3,
      }),
    )
  })

  it('moves horizontal packing neighbors into the gap vacated by the edited item', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        packing: 'horizontal',
        items: [
          { id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 1, y: 0, w: 1, h: 1 },
        ],
        onLayoutChange,
      }),
    )

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Alpha/ }), { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 }),
        expect.objectContaining({ id: 'beta', x: 0, y: 0, w: 1, h: 1 }),
      ],
      expect.objectContaining({
        reason: 'move',
        itemId: 'alpha',
        item: expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 }),
        columns: 3,
      }),
    )
  })

  it('renders and edits the active responsive layout breakpoint', async () => {
    const onLayoutChange = vi.fn()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 900,
      height: 400,
      top: 0,
      right: 900,
      bottom: 400,
      left: 0,
      toJSON: () => ({}),
    })

    render(
      React.createElement(EditableDashboard, {
        columns: { initial: 1, md: 4 },
        breakpoints: { md: 800, lg: 1200 },
        layouts: {
          initial: [{ id: 'phone', title: 'Phone', x: 0, y: 0, w: 1, h: 1 }],
          md: [{ id: 'tablet', title: 'Tablet', x: 0, y: 0, w: 1, h: 1 }],
        },
        onLayoutChange,
        renderItem: (item, state) =>
          React.createElement('span', { 'data-testid': `${item.id}-breakpoint` }, state.breakpoint),
      }),
    )

    await waitFor(() => expect(screen.getByRole('group', { name: 'Tablet' })).toBeTruthy())
    expect(screen.getByTestId('tablet-breakpoint').textContent).toBe('md')

    fireEvent.keyDown(screen.getByRole('button', { name: /Move Tablet/ }), { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [expect.objectContaining({ id: 'tablet', x: 1, y: 0, w: 1, h: 1 })],
      expect.objectContaining({ reason: 'move', itemId: 'tablet', breakpoint: 'md', columns: 4 }),
    )
  })

  it('uses the live layout snapshot between keyboard updates', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        onLayoutChange,
      }),
    )

    const moveHandle = screen.getByRole('button', { name: /Move Alpha/ })
    fireEvent.keyDown(moveHandle, { key: 'ArrowRight' })
    fireEvent.keyDown(moveHandle, { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 1, h: 1 })],
      expect.objectContaining({ reason: 'move', itemId: 'alpha', columns: 3 }),
    )
    expect(onLayoutChange).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ id: 'alpha', x: 2, y: 0, w: 1, h: 1 })],
      expect.objectContaining({ reason: 'move', itemId: 'alpha', columns: 3 }),
    )
  })

  it('exposes distinct keyboard resize handles', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        onLayoutChange,
      }),
    )

    const handle = screen.getByRole('button', { name: /Resize Alpha from bottom right corner/ })
    fireEvent.keyDown(handle, { key: 'ArrowRight' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [expect.objectContaining({ id: 'alpha', x: 0, y: 0, w: 2, h: 1 })],
      expect.objectContaining({ reason: 'resize', itemId: 'alpha', columns: 3 }),
    )
  })

  it('uses the viable opposite corner resize handle for right-edge items', () => {
    const onLayoutChange = vi.fn()

    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [{ id: 'alpha', title: 'Alpha', x: 2, y: 0, w: 1, h: 1 }],
        onLayoutChange,
      }),
    )

    expect(screen.queryByRole('button', { name: /Resize Alpha from bottom right corner/ })).toBeNull()
    const oppositeHandle = screen.getByRole('button', { name: /Resize Alpha from bottom left corner/ })
    fireEvent.keyDown(oppositeHandle, { key: 'ArrowLeft' })

    expect(onLayoutChange).toHaveBeenCalledWith(
      [expect.objectContaining({ id: 'alpha', x: 1, y: 0, w: 2, h: 1 })],
      expect.objectContaining({ reason: 'resize', itemId: 'alpha', columns: 3 }),
    )
  })

  it('keeps the selected item highlighted until another item is selected', () => {
    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [
          { id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 },
          { id: 'beta', title: 'Beta', x: 1, y: 0, w: 1, h: 1 },
        ],
        renderItem: (item, state) =>
          React.createElement('span', { 'data-testid': `${item.id}-state` }, state.selected ? 'selected' : 'idle'),
      }),
    )

    fireEvent.pointerDown(screen.getByRole('group', { name: 'Alpha' }))
    expect(screen.getByTestId('alpha-state').textContent).toBe('selected')
    expect(screen.getByTestId('beta-state').textContent).toBe('idle')

    fireEvent.pointerDown(screen.getByRole('group', { name: 'Beta' }))
    expect(screen.getByTestId('alpha-state').textContent).toBe('idle')
    expect(screen.getByTestId('beta-state').textContent).toBe('selected')
  })

  it('uses the theme dashboard gap as the default grid gap', () => {
    const { container } = render(
      React.createElement(ThemeProvider, {
        dashboard: { gap: 20 },
        children: React.createElement(DashboardLayout, {
          columns: 2,
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        }),
      }),
    )

    expect(getDashboardGridRoot(container).style.gap).toBe('20px')
  })

  it('lets the dashboard gap prop override the theme default', () => {
    const { container } = render(
      React.createElement(ThemeProvider, {
        dashboard: { gap: 20 },
        children: React.createElement(DashboardLayout, {
          columns: 2,
          gap: 6,
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        }),
      }),
    )

    expect(getDashboardGridRoot(container).style.gap).toBe('6px')
  })

  it('uses ThemeProvider dashboard columns with global breakpoint defaults', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 900,
      height: 400,
      top: 0,
      right: 900,
      bottom: 400,
      left: 0,
      toJSON: () => ({}),
    })

    render(
      React.createElement(ThemeProvider, {
        dashboard: { columns: { initial: 1, sm: 2, md: 4 } },
        children: React.createElement(DashboardLayout, {
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
          renderItem: (_item, state) =>
            React.createElement('span', { 'data-testid': 'dashboard-state' }, `${state.breakpoint}:${state.columns}`),
        }),
      }),
    )

    await waitFor(() => expect(screen.getByTestId('dashboard-state').textContent).toBe('sm:2'))
  })

  it('lets local columns and breakpoints override ThemeProvider defaults', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 900,
      height: 400,
      top: 0,
      right: 900,
      bottom: 400,
      left: 0,
      toJSON: () => ({}),
    })

    render(
      React.createElement(ThemeProvider, {
        breakpoints: { md: 1000 },
        dashboard: { columns: { initial: 1, md: 3 } },
        children: React.createElement(DashboardLayout, {
          breakpoints: { md: 800 },
          columns: { initial: 1, md: 4 },
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
          renderItem: (_item, state) =>
            React.createElement('span', { 'data-testid': 'dashboard-state' }, `${state.breakpoint}:${state.columns}`),
        }),
      }),
    )

    await waitFor(() => expect(screen.getByTestId('dashboard-state').textContent).toBe('md:4'))
  })

  it('uses ThemeProvider defaults in editable dashboards', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 900,
      height: 400,
      top: 0,
      right: 900,
      bottom: 400,
      left: 0,
      toJSON: () => ({}),
    })

    render(
      React.createElement(ThemeProvider, {
        breakpoints: { md: 800 },
        dashboard: { columns: { initial: 1, md: 3 } },
        children: React.createElement(EditableDashboard, {
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
          renderItem: (_item, state) =>
            React.createElement('span', { 'data-testid': 'dashboard-state' }, `${state.breakpoint}:${state.columns}`),
        }),
      }),
    )

    await waitFor(() => expect(screen.getByTestId('dashboard-state').textContent).toBe('md:3'))
  })

  it('keeps the existing dashboard gap default without a theme provider', () => {
    const { container } = render(
      React.createElement(DashboardLayout, {
        columns: 2,
        items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
      }),
    )

    expect(getDashboardGridRoot(container).style.gap).toBe('12px')
  })

  it('normalizes invalid dashboard gaps before applying grid styles', () => {
    const items = [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }]
    const { container, rerender } = render(
      React.createElement(DashboardLayout, {
        columns: 2,
        gap: -8,
        items,
      }),
    )

    expect(getDashboardGridRoot(container).style.gap).toBe('0px')

    rerender(
      React.createElement(DashboardLayout, {
        columns: 2,
        gap: Number.POSITIVE_INFINITY,
        items,
      }),
    )

    expect(getDashboardGridRoot(container).style.gap).toBe('12px')
  })

  it('applies the resolved dashboard gap to masonry mode', () => {
    const { container } = render(
      React.createElement(ThemeProvider, {
        dashboard: { gap: 14 },
        children: React.createElement(DashboardLayout, {
          mode: 'masonry',
          columns: 2,
          items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        }),
      }),
    )

    expect(getDashboardMasonryRoot(container).dataset.gap).toBe('14')
  })

  it('applies caller item styles from selected render state', () => {
    render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items: [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }],
        itemStyle: (_item, state) => (state.selected ? { backgroundColor: 'rgb(1, 2, 3)' } : undefined),
      }),
    )

    const item = screen.getByRole('group', { name: 'Alpha' })
    expect(item.style.backgroundColor).toBe('')

    fireEvent.pointerDown(item)
    expect(item.style.backgroundColor).toBe('rgb(1, 2, 3)')
  })

  it('clears selected state outside editable grid mode', () => {
    const items = [{ id: 'alpha', title: 'Alpha', x: 0, y: 0, w: 1, h: 1 }]
    const renderItem = (item: DashboardLayoutItem, state: DashboardLayoutRenderState) =>
      React.createElement('span', { 'data-testid': `${item.id}-state` }, state.selected ? 'selected' : 'idle')

    const { rerender } = render(
      React.createElement(EditableDashboard, {
        columns: 3,
        items,
        renderItem,
      }),
    )

    fireEvent.pointerDown(screen.getByRole('group', { name: 'Alpha' }))
    expect(screen.getByTestId('alpha-state').textContent).toBe('selected')

    rerender(
      React.createElement(EditableDashboard, {
        mode: 'masonry',
        columns: 3,
        items,
        renderItem,
      }),
    )
    expect(screen.getByTestId('alpha-state').textContent).toBe('idle')

    rerender(
      React.createElement(EditableDashboard, {
        columns: 3,
        items,
        renderItem,
      }),
    )
    expect(screen.getByTestId('alpha-state').textContent).toBe('idle')
  })

  it('preserves caller item order in masonry mode', () => {
    const { container } = render(
      React.createElement(DashboardLayout, {
        mode: 'masonry',
        columns: 3,
        items: [
          { id: 'later', title: 'Later', x: 2, y: 2, w: 1, h: 1 },
          { id: 'first', title: 'First', x: 0, y: 0, w: 1, h: 1 },
          { id: 'middle', title: 'Middle', x: 1, y: 1, w: 1, h: 1 },
        ],
      }),
    )

    expect(
      Array.from(container.querySelectorAll('[data-dashboard-item-id]')).map(item =>
        item.getAttribute('data-dashboard-item-id'),
      ),
    ).toEqual(['later', 'first', 'middle'])
  })
})
