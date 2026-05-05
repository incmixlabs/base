import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/elements', async () => {
  const ReactModule = await import('react')

  const Button = ReactModule.forwardRef<HTMLButtonElement, Record<string, unknown>>(
    (
      {
        asChild,
        children,
        color: _color,
        fill: _fill,
        highContrast: _highContrast,
        iconEnd: _iconEnd,
        iconStart: _iconStart,
        inverse: _inverse,
        loading: _loading,
        radius: _radius,
        size: _size,
        variant: _variant,
        ...props
      },
      ref,
    ) => {
      if (asChild && ReactModule.isValidElement(children)) {
        return ReactModule.cloneElement(children, { ...props, ref } as Record<string, unknown>)
      }

      return ReactModule.createElement('button', { ...props, ref, type: 'button' }, children as React.ReactNode)
    },
  )

  const CardRoot = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ asChild, children, color: _color, size: _size, variant: _variant, ...props }, ref) => {
      if (asChild && ReactModule.isValidElement(children)) {
        return ReactModule.cloneElement(children, { ...props, ref } as Record<string, unknown>)
      }

      return ReactModule.createElement('div', { ...props, ref }, children as React.ReactNode)
    },
  )

  const Icon = ({ color: _color, icon, iconProps: _iconProps, size: _size, ...props }: Record<string, unknown>) =>
    ReactModule.createElement('span', { ...props, 'data-icon': String(icon) })

  const ToggleGroupContext = ReactModule.createContext<{
    disabled?: boolean
    onValueChange?: (values: string[]) => void
    value?: string[]
  }>({})

  const ToggleGroupRoot = ({
    children,
    color: _color,
    disabled,
    flush: _flush,
    highContrast: _highContrast,
    multiple: _multiple,
    onValueChange,
    radius: _radius,
    size: _size,
    value,
    variant: _variant,
    ...props
  }: Record<string, unknown>) =>
    ReactModule.createElement(
      'div',
      props,
      ReactModule.createElement(
        ToggleGroupContext.Provider,
        {
          value: {
            disabled: Boolean(disabled),
            onValueChange: onValueChange as ((values: string[]) => void) | undefined,
            value: Array.isArray(value) ? value.map(String) : [],
          },
        },
        children as React.ReactNode,
      ),
    )

  const ToggleGroupItem = ReactModule.forwardRef<HTMLButtonElement, Record<string, unknown>>(
    (
      {
        children,
        color: _color,
        highContrast: _highContrast,
        radius: _radius,
        value,
        variant: _variant,
        onClick,
        ...props
      },
      ref,
    ) => {
      const context = ReactModule.useContext(ToggleGroupContext)
      const itemValue = String(value)
      return ReactModule.createElement(
        'button',
        {
          ...props,
          ref,
          'aria-pressed': context.value?.includes(itemValue),
          disabled: Boolean(props.disabled) || context.disabled,
          type: 'button',
          onClick: event => {
            ;(onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(event)
            context.onValueChange?.([itemValue])
          },
        },
        children as React.ReactNode,
      )
    },
  )

  return {
    Button,
    Card: { Root: CardRoot },
    Icon,
    ToggleGroup: {
      Root: ToggleGroupRoot,
      Item: ToggleGroupItem,
    },
  }
})

vi.mock('@/form/NumberInput', async () => {
  const ReactModule = await import('react')

  return {
    NumberInput: ReactModule.forwardRef<HTMLInputElement, Record<string, unknown>>(
      (
        {
          allowDecimal: _allowDecimal,
          color: _color,
          iconButton: _iconButton,
          inputVariant: _inputVariant,
          onValueChange,
          radius: _radius,
          size: _size,
          value,
          variant: _variant,
          ...props
        },
        ref,
      ) =>
        ReactModule.createElement('input', {
          ...props,
          ref,
          type: 'number',
          value: value === undefined ? '' : value,
          onChange: event => {
            const nextValue = event.currentTarget.value
            ;(onValueChange as ((value: number | '') => void) | undefined)?.(nextValue === '' ? '' : Number(nextValue))
          },
        }),
    ),
  }
})

vi.mock('@/layouts', async () => {
  const ReactModule = await import('react')

  const LayoutBox = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>(
    ({ align: _align, children, gap: _gap, justify: _justify, minWidth: _minWidth, wrap: _wrap, ...props }, ref) =>
      ReactModule.createElement('div', { ...props, ref }, children as React.ReactNode),
  )

  return {
    Grid: LayoutBox,
    Row: LayoutBox,
  }
})

vi.mock('@/typography', async () => {
  const ReactModule = await import('react')

  return {
    Text: ({
      as,
      children,
      color: _color,
      size: _size,
      truncate: _truncate,
      variant: _variant,
      weight: _weight,
      ...props
    }: Record<string, unknown>) =>
      ReactModule.createElement(
        (as as keyof HTMLElementTagNameMap | undefined) ?? 'span',
        props,
        children as React.ReactNode,
      ),
  }
})

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
  const Item = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>(({ children, ...props }, ref) =>
    ReactModule.createElement('div', { ...props, ref, 'data-slot': 'masonry-item' }, children as React.ReactNode),
  )

  return {
    Masonry: {
      Root,
      Item,
    },
  }
})

vi.mock('./DashboardLayout', async importOriginal => {
  const actual = await importOriginal<typeof import('./DashboardLayout')>()
  const ReactModule = await import('react')

  const DashboardLayout = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>((props, ref) => {
    const layouts = props.layouts as DashboardResponsiveLayoutItems | undefined
    const items =
      layouts?.xl ??
      layouts?.lg ??
      layouts?.md ??
      layouts?.sm ??
      layouts?.xs ??
      layouts?.initial ??
      (props.items as DashboardResponsiveLayoutItems['initial'] | undefined) ??
      []
    const renderItem = props.renderItem as
      | ((
          item: NonNullable<DashboardResponsiveLayoutItems['initial']>[number],
          state: Record<string, unknown>,
        ) => React.ReactNode)
      | undefined

    return ReactModule.createElement(
      'div',
      { ref, 'data-slot': 'dashboard-layout', 'data-mode': String(props.mode ?? 'grid') },
      items.map(item =>
        ReactModule.createElement(
          'div',
          { key: item.id, 'data-slot': 'dashboard-layout-item' },
          renderItem
            ? renderItem(item, {
                breakpoint: 'xl',
                columns: 12,
                dragging: false,
                editable: Boolean(props.editable),
                mode: props.mode ?? 'grid',
                selected: false,
              })
            : (item.title ?? item.id),
        ),
      ),
    )
  })

  const DashboardPresetPicker = ({
    className,
    onValueChange,
    presets = [],
    value,
  }: {
    className?: string
    onValueChange?: (preset: (typeof actual.dashboardLayoutPresets)[number]) => void
    presets?: typeof actual.dashboardLayoutPresets
    value?: string
  }) =>
    ReactModule.createElement(
      'div',
      { className },
      presets.map(preset =>
        ReactModule.createElement(
          'button',
          {
            key: preset.id,
            type: 'button',
            role: 'radio',
            'aria-checked': value === preset.id,
            onClick: () => onValueChange?.(preset),
          },
          preset.name,
        ),
      ),
    )

  return {
    ...actual,
    DashboardLayout,
    DashboardPresetPicker,
  }
})

vi.mock('./EditableDashboard', async () => {
  const ReactModule = await import('react')

  const EditableDashboard = ReactModule.forwardRef<HTMLDivElement, Record<string, unknown>>((props, ref) => {
    const layouts = props.layouts as DashboardResponsiveLayoutItems | undefined
    const items =
      layouts?.xl ??
      layouts?.lg ??
      layouts?.md ??
      layouts?.sm ??
      layouts?.xs ??
      layouts?.initial ??
      (props.items as DashboardResponsiveLayoutItems['initial'] | undefined) ??
      []
    const renderItem = props.renderItem as
      | ((
          item: NonNullable<DashboardResponsiveLayoutItems['initial']>[number],
          state: Record<string, unknown>,
        ) => React.ReactNode)
      | undefined

    return ReactModule.createElement(
      'div',
      { ref, 'data-slot': 'editable-dashboard', 'data-mode': String(props.mode ?? 'grid') },
      items.map(item =>
        ReactModule.createElement(
          'div',
          { key: item.id, 'data-slot': 'dashboard-layout-item' },
          renderItem
            ? renderItem(item, {
                breakpoint: 'xl',
                columns: 12,
                dragging: false,
                editable: true,
                mode: props.mode ?? 'grid',
                selected: false,
              })
            : (item.title ?? item.id),
        ),
      ),
    )
  })

  const EditableDashboardLayoutPanel = ({
    canEditGrid = true,
    gapOptions = [],
    onCleanup,
    onGapChange,
    onPackingChange,
    onPresetChange,
    onSaveTemplate,
    packing,
    presetId,
    presets = [],
    templateColumns,
    templateDirty = true,
    templateItems = [],
  }: Record<string, unknown>) =>
    ReactModule.createElement(
      'div',
      null,
      (presets as Array<{ id: string; name: string }>).map(preset =>
        ReactModule.createElement(
          'button',
          {
            key: preset.id,
            type: 'button',
            role: 'radio',
            'aria-checked': presetId === preset.id,
            onClick: () => (onPresetChange as ((preset: { id: string; name: string }) => void) | undefined)?.(preset),
          },
          preset.name,
        ),
      ),
      (gapOptions as Array<{ id: string; label: string; value: number }>).map(option =>
        ReactModule.createElement(
          'button',
          {
            key: option.id,
            type: 'button',
            onClick: () => (onGapChange as ((gap: number) => void) | undefined)?.(option.value),
          },
          option.label,
        ),
      ),
      (['vertical', 'horizontal', 'dense'] as const).map(option =>
        ReactModule.createElement(
          'button',
          {
            key: option,
            type: 'button',
            disabled: !canEditGrid,
            'aria-pressed': packing === option,
            onClick: () =>
              (onPackingChange as ((packing: 'vertical' | 'horizontal' | 'dense') => void) | undefined)?.(option),
          },
          option,
        ),
      ),
      ReactModule.createElement(
        'button',
        {
          type: 'button',
          disabled: !canEditGrid,
          onClick: () => (onCleanup as (() => void) | undefined)?.(),
        },
        'Clean Up',
      ),
      Boolean(canEditGrid) &&
        Boolean(templateDirty) &&
        typeof onSaveTemplate === 'function' &&
        ReactModule.createElement(
          'button',
          {
            type: 'button',
            onClick: () =>
              onSaveTemplate({
                id: 'saved-template',
                name: 'Saved Template',
                columns: Number(templateColumns),
                items: templateItems as unknown[],
              }),
          },
          'Save Template',
        ),
    )

  return { EditableDashboard, EditableDashboardLayoutPanel }
})

import {
  DashboardBuilder,
  type DashboardBuilderLayoutChangeDetails,
  type DashboardBuilderProps,
} from './DashboardBuilder'
import type { DashboardLayoutPreset, DashboardResponsiveLayoutItems } from './DashboardLayout'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const baseLayouts: DashboardResponsiveLayoutItems = {
  lg: [
    { id: 'revenue', title: 'Revenue', x: 0, y: 0, w: 4, h: 3 },
    { id: 'pipeline', title: 'Pipeline', x: 4, y: 0, w: 4, h: 3 },
  ],
}

function renderBuilder(props: Partial<DashboardBuilderProps> = {}) {
  return render(
    <DashboardBuilder
      layouts={baseLayouts}
      columns={{ initial: 1, lg: 12, xl: 12 }}
      breakpoints={{ lg: 1024, xl: 1280 }}
      renderItem={item => <span>{item.title ?? item.id}</span>}
      showJsonPanel={false}
      {...props}
    />,
  )
}

describe('DashboardBuilder', () => {
  it('emits controlled preference changes from the builder toolbar', () => {
    const onModeChange = vi.fn()
    const onPackingChange = vi.fn()
    const onGapChange = vi.fn()

    renderBuilder({
      mode: 'grid',
      editable: true,
      gap: 12,
      onModeChange,
      onPackingChange,
      onGapChange,
    })

    fireEvent.click(screen.getByRole('button', { name: /dense/i }))
    fireEvent.click(screen.getByRole('radio', { name: /masonry/i }))
    fireEvent.click(screen.getByRole('button', { name: /comfortable/i }))

    expect(onModeChange).toHaveBeenCalledWith('masonry')
    expect(onPackingChange).toHaveBeenCalledWith('dense')
    expect(onGapChange).toHaveBeenCalledWith(20)
  })

  it('normalizes applied responsive JSON and reports a JSON layout change', () => {
    const onLayoutsChange = vi.fn()
    const nextJson = JSON.stringify({
      lg: [{ id: 'wide', x: 10, y: -1, w: 6, h: 0 }],
    })

    renderBuilder({ onLayoutsChange, showJsonPanel: true })

    fireEvent.change(screen.getByLabelText('Dashboard responsive layouts JSON'), {
      target: { value: nextJson },
    })
    fireEvent.click(screen.getByRole('button', { name: /apply json/i }))

    const [layouts, details] = onLayoutsChange.mock.calls.at(-1) as [
      DashboardResponsiveLayoutItems,
      DashboardBuilderLayoutChangeDetails,
    ]
    expect(layouts.lg).toEqual([expect.objectContaining({ id: 'wide', x: 6, y: 0, w: 6, h: 1 })])
    expect(details).toMatchObject({ reason: 'json', breakpoint: 'xl' })
  })

  it('applies a selected preset to the active breakpoint layout', () => {
    const onLayoutsChange = vi.fn()

    renderBuilder({ onLayoutsChange })

    fireEvent.click(screen.getByText('4x4'))

    const [layouts, details] = onLayoutsChange.mock.calls.at(-1) as [
      DashboardResponsiveLayoutItems,
      DashboardBuilderLayoutChangeDetails,
    ]
    expect(layouts.xl).toHaveLength(16)
    expect(layouts.xl?.[0]).toEqual(expect.objectContaining({ id: 'revenue', x: 0, y: 0, w: 3, h: 1 }))
    expect(layouts.xl?.[1]).toEqual(expect.objectContaining({ id: 'pipeline', x: 3, y: 0, w: 3, h: 1 }))
    expect(layouts.xl?.[2]).toEqual(expect.objectContaining({ id: 'four-by-four-3', x: 6, y: 0, w: 3, h: 1 }))
    expect(details).toMatchObject({ reason: 'preset', breakpoint: 'xl', presetId: 'four-by-four' })
  })

  it('uses layout presets as the source of truth for grid and masonry mode', () => {
    const onLayoutsChange = vi.fn()
    const onModeChange = vi.fn()
    const onPresetIdChange = vi.fn()

    const { rerender } = renderBuilder({
      mode: 'grid',
      presetId: 'feature-with-rails',
      onLayoutsChange,
      onModeChange,
      onPresetIdChange,
    })

    fireEvent.click(screen.getByRole('radio', { name: /masonry/i }))

    expect(onModeChange).toHaveBeenLastCalledWith('masonry')
    expect(onPresetIdChange).toHaveBeenLastCalledWith('masonry')
    expect(onLayoutsChange).not.toHaveBeenCalled()

    rerender(
      <DashboardBuilder
        layouts={baseLayouts}
        mode="masonry"
        presetId="masonry"
        columns={{ initial: 1, lg: 12, xl: 12 }}
        breakpoints={{ lg: 1024, xl: 1280 }}
        renderItem={item => <span>{item.title ?? item.id}</span>}
        onLayoutsChange={onLayoutsChange}
        onModeChange={onModeChange}
        onPresetIdChange={onPresetIdChange}
      />,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Feature' }))

    const [layouts, details] = onLayoutsChange.mock.calls.at(-1) as [
      DashboardResponsiveLayoutItems,
      DashboardBuilderLayoutChangeDetails,
    ]
    expect(onModeChange).toHaveBeenLastCalledWith('grid')
    expect(onPresetIdChange).toHaveBeenLastCalledWith('feature-with-rails')
    expect(layouts.xl?.[0]).toEqual(expect.objectContaining({ id: 'revenue', x: 0, y: 0, w: 3, h: 1 }))
    expect(layouts.xl?.[1]).toEqual(expect.objectContaining({ id: 'pipeline', x: 3, y: 0, w: 6, h: 2 }))
    expect(details).toMatchObject({ reason: 'preset', breakpoint: 'xl', presetId: 'feature-with-rails' })
  })

  it('reserves the masonry preset id for the built-in masonry option', () => {
    const onLayoutsChange = vi.fn()
    const onModeChange = vi.fn()

    renderBuilder({
      presets: [
        {
          id: 'masonry',
          name: 'Masonry Grid',
          columns: 12,
          rows: 1,
          items: [{ id: 'external', x: 0, y: 0, w: 12, h: 1 }],
        },
        {
          id: 'valid-grid',
          name: 'Valid Grid',
          columns: 12,
          rows: 1,
          items: [{ id: 'valid', x: 0, y: 0, w: 12, h: 1 }],
        },
      ],
      onLayoutsChange,
      onModeChange,
    })

    expect(screen.queryByRole('radio', { name: 'Masonry Grid' })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Valid Grid' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('button', { name: /vertical/i })).not.toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: 'Masonry' }))

    expect(onModeChange).toHaveBeenLastCalledWith('masonry')
    expect(onLayoutsChange).not.toHaveBeenCalled()
  })

  it('cleans up the active grid layout only when requested', () => {
    const onLayoutsChange = vi.fn()

    renderBuilder({
      layouts: {
        lg: [
          { id: 'pipeline', title: 'Pipeline', x: 0, y: 0, w: 4, h: 1 },
          { id: 'revenue', title: 'Revenue', x: 0, y: 3, w: 4, h: 1 },
        ],
      },
      packing: 'vertical',
      onLayoutsChange,
    })

    fireEvent.click(screen.getByRole('button', { name: /clean up/i }))

    const [layouts, details] = onLayoutsChange.mock.calls.at(-1) as [
      DashboardResponsiveLayoutItems,
      DashboardBuilderLayoutChangeDetails,
    ]
    expect(layouts.xl).toEqual([
      expect.objectContaining({ id: 'pipeline', x: 0, y: 0, w: 4, h: 1 }),
      expect.objectContaining({ id: 'revenue', x: 0, y: 1, w: 4, h: 1 }),
    ])
    expect(details).toMatchObject({ reason: 'cleanup', breakpoint: 'xl' })
  })

  it('does not expose mutating layout controls when grid mode is read-only', () => {
    const onLayoutsChange = vi.fn()
    const onTemplatesChange = vi.fn()

    renderBuilder({
      mode: 'grid',
      editable: false,
      packing: 'vertical',
      onLayoutsChange,
      onTemplatesChange,
    })

    expect(screen.getByRole('button', { name: /vertical/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /clean up/i })).toBeDisabled()
    expect(screen.queryByRole('button', { name: /save template/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /clean up/i }))

    expect(onLayoutsChange).not.toHaveBeenCalled()
    expect(onTemplatesChange).not.toHaveBeenCalled()
  })

  it('saves templates using columns from the resolved layout breakpoint', () => {
    const onTemplatesChange = vi.fn()

    renderBuilder({
      layouts: {
        lg: [{ id: 'revenue', title: 'Revenue', x: 0, y: 0, w: 4, h: 3 }],
      },
      columns: { initial: 1, lg: 8, xl: 12 },
      breakpoints: { lg: 1024, xl: 1280 },
      onTemplatesChange,
    })

    fireEvent.click(screen.getByRole('button', { name: /save template/i }))

    const [templates] = onTemplatesChange.mock.calls.at(-1) as [DashboardLayoutPreset[]]
    expect(templates.at(-1)).toEqual(expect.objectContaining({ columns: 8 }))
  })

  it('does not expose template saving when controlled templates are read-only', () => {
    renderBuilder({
      templates: [],
      layouts: {
        lg: [{ id: 'revenue', title: 'Revenue', x: 0, y: 0, w: 4, h: 3 }],
      },
    })

    expect(screen.queryByRole('button', { name: /save template/i })).not.toBeInTheDocument()
  })

  it('seeds the default preset with caller widgets and preset slots when layouts are uncontrolled', () => {
    renderBuilder({
      layouts: undefined,
      items: baseLayouts.lg,
      defaultPresetId: 'feature-with-rails',
    })

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Pipeline')).toBeInTheDocument()
    expect(screen.getByText('feature-right-top')).toBeInTheDocument()
  })

  it('disables grid-only controls in masonry mode', () => {
    renderBuilder({ mode: 'masonry', editable: true, packing: 'vertical' })

    expect(screen.getByRole('button', { name: /vertical/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /clean up/i })).toBeDisabled()
  })
})
