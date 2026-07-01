import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { ThemeProvider } from '@/theme/ThemeProvider'
import {
  createDashboardItemsFromPreset,
  DashboardLayout,
  type DashboardLayoutItem,
  type DashboardLayoutPacking,
  dashboardLayoutPresets,
  DashboardPresetPicker,
} from './DashboardLayout'

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

const dashboardGapOptions = [
  { id: 'compact', label: 'Compact', gap: 8 },
  { id: 'default', label: 'Default', gap: 12 },
  { id: 'comfortable', label: 'Comfortable', gap: 20 },
] as const

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
]

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
          <div className="mt-1 text-muted text-xs">{componentName}</div>
        </div>
        <div className="rounded bg-neutral-soft px-2 py-1 font-medium text-xs">{value}%</div>
      </div>
      <div className="mt-auto grid gap-2">
        <div className="h-2 rounded bg-neutral-soft">
          <div className="h-full rounded bg-primary" style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="h-8 rounded bg-neutral-soft" />
          <span className="h-8 rounded bg-neutral-soft" />
          <span className="h-8 rounded bg-neutral-soft" />
        </div>
      </div>
    </div>
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
                  option.id === gapId
                    ? 'border-primary bg-primary text-primary-contrast'
                    : 'border-neutral bg-neutral-surface'
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

export const PackingComparison: Story = {
  render: function PackingComparisonStory() {
    const preset = dashboardLayoutPresets[1]
    const [packing, setPacking] = React.useState<DashboardLayoutPacking>('none')
    const items = React.useMemo(
      () => makePresetItems(preset).map((item, index) => (index % 3 === 0 ? { ...item, y: item.y + 2 } : item)),
      [preset],
    )

    return (
      <div className="grid min-h-[720px] gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          {(['none', 'vertical', 'horizontal', 'dense'] as const).map(option => (
            <button
              key={option}
              type="button"
              aria-pressed={packing === option}
              className={`rounded border px-3 py-1.5 font-medium text-sm ${
                packing === option
                  ? 'border-primary bg-primary text-primary-contrast'
                  : 'border-neutral bg-neutral-surface'
              }`}
              onClick={() => setPacking(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <DashboardLayout
          items={items}
          columns={preset.columns}
          rowHeight={92}
          gap={12}
          packing={packing}
          className="max-w-5xl"
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
