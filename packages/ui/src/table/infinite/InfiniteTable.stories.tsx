import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Filter } from '@/elements/filter/Filter'
import type { FilterApplyMode, FilterField, FilterState } from '@/elements/filter/filter.props'
import { AppShell } from '@/layouts/app-shell/AppShell'
import { Flex } from '@/layouts/flex/Flex'
import { SummaryBarChart, type SummaryBarChartBin } from '@/table/shared/SummaryBarChart'
import { InfiniteTable } from './InfiniteTable'
import { generateRequestLogs, type RequestLog, requestLogColumns, requestLogFilterFields } from './sample-data'

const sampleData = generateRequestLogs(500)

const meta: Meta = {
  title: 'Table/InfiniteTable',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

// ─── Helpers ────────────────────────────────────────────────────────────────

function TableStory({
  children,
  filterFields,
  data,
  size = 'sm',
  defaultColumnFilters,
  isRowClickable,
}: {
  children: React.ReactNode
  filterFields?: FilterField<RequestLog>[]
  data: RequestLog[]
  size?: 'xs' | 'sm' | 'md' | 'lg'
  defaultColumnFilters?: { id: string; value: unknown }[]
  isRowClickable?: (row: RequestLog) => boolean
}) {
  return (
    <AppShell.Root className="w-full min-w-0">
      <AppShell.Body className="w-full min-w-0 flex-1">
        <AppShell.Main>
          <AppShell.Content padding="none" className="min-w-0 min-h-0">
            <Flex direction="column" className="min-h-0 min-w-0 w-full overflow-hidden">
              <InfiniteTable.Root<RequestLog>
                columns={requestLogColumns}
                data={data}
                filterFields={filterFields}
                size={size}
                defaultColumnFilters={defaultColumnFilters}
                isRowClickable={isRowClickable}
              >
                {children}
              </InfiniteTable.Root>
            </Flex>
          </AppShell.Content>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  )
}

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <TableStory data={sampleData} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.Footer>
        <span>Showing {sampleData.length} rows</span>
      </InfiniteTable.Footer>
    </TableStory>
  ),
}

export const WithoutFilters: StoryObj = {
  render: () => (
    <TableStory data={sampleData} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.Footer>
        <span>Showing {sampleData.length} rows</span>
      </InfiniteTable.Footer>
    </TableStory>
  ),
}

export const SizeMd: StoryObj = {
  name: 'Size: md',
  render: () => (
    <TableStory data={sampleData} size="md">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </TableStory>
  ),
}

export const SizeLg: StoryObj = {
  name: 'Size: lg',
  render: () => (
    <TableStory data={sampleData} size="lg">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </TableStory>
  ),
}

const smallData = generateRequestLogs(5)

export const Empty: StoryObj = {
  render: () => (
    <TableStory data={[]} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </TableStory>
  ),
}

export const FewRows: StoryObj = {
  render: () => (
    <TableStory data={smallData} filterFields={requestLogFilterFields} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </TableStory>
  ),
}

// ─── Filter Stories ──────────────────────────────────────────────────────────

function applyStoryFilters(data: RequestLog[], filters: FilterState): RequestLog[] {
  if (filters.length === 0) return data
  return data.filter(row =>
    filters.every(f => {
      if (Array.isArray(f.value) && f.value.length === 2 && typeof f.value[0] === 'number') {
        const v = row[f.id as keyof RequestLog] as number
        return v >= (f.value[0] as number) && v <= (f.value[1] as number)
      }
      if (Array.isArray(f.value) && f.value.length > 0) {
        return f.value.includes(String(row[f.id as keyof RequestLog]))
      }
      return true
    }),
  )
}

function FilterTableStory({
  children,
  filterFields = requestLogFilterFields,
  data = sampleData,
  size = 'sm',
  defaultFilters = [],
  filterApplyMode,
}: {
  children: React.ReactNode
  filterFields?: FilterField<RequestLog>[]
  data?: RequestLog[]
  size?: 'xs' | 'sm' | 'md' | 'lg'
  defaultFilters?: FilterState
  filterApplyMode?: FilterApplyMode
}) {
  'use no memo'
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters)
  const filteredData = React.useMemo(() => applyStoryFilters(data, filters), [data, filters])

  return (
    <AppShell.Root className="w-full min-w-0">
      <AppShell.Body className="w-full min-w-0 flex-1">
        <AppShell.Main>
          <AppShell.Content padding="none" className="min-w-0 min-h-0">
            <Flex className="min-h-0 min-w-0 w-full h-full overflow-hidden">
              <div className="h-full min-h-0 w-64 shrink-0 overflow-y-auto border-r border-[var(--color-neutral-border)] bg-background">
                <Filter
                  filterFields={filterFields}
                  value={filters}
                  onValueChange={setFilters}
                  size={size}
                  applyMode={filterApplyMode}
                />
              </div>
              <Flex direction="column" className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <InfiniteTable.Root<RequestLog>
                  columns={requestLogColumns}
                  data={filteredData}
                  size={size}
                  totalRows={data.length}
                  filterRows={filteredData.length}
                  activeFilterCount={filters.length}
                >
                  {children}
                </InfiniteTable.Root>
              </Flex>
            </Flex>
          </AppShell.Content>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  )
}

export const PreAppliedFilters: StoryObj = {
  name: 'Filter: Pre-applied',
  render: () => (
    <FilterTableStory
      defaultFilters={[
        { id: 'method', value: ['GET', 'POST'] },
        { id: 'level', value: ['error'] },
      ]}
    >
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </FilterTableStory>
  ),
}

const checkboxOnlyFields: FilterField<RequestLog>[] = requestLogFilterFields.filter(f => f.type === 'checkbox')

export const CheckboxFilterOnly: StoryObj = {
  name: 'Filter: Checkbox only',
  render: () => (
    <FilterTableStory filterFields={checkboxOnlyFields}>
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </FilterTableStory>
  ),
}

const sliderOnlyFields: FilterField<RequestLog>[] = requestLogFilterFields.filter(f => f.type === 'slider')

export const SliderFilterOnly: StoryObj = {
  name: 'Filter: Slider only',
  render: () => (
    <FilterTableStory filterFields={sliderOnlyFields}>
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </FilterTableStory>
  ),
}

export const ManualApplyFilters: StoryObj = {
  name: 'Filter: Manual apply',
  render: () => (
    <FilterTableStory filterApplyMode="manual">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </FilterTableStory>
  ),
}

const largeData = generateRequestLogs(10000)

export const LargeDataset: StoryObj = {
  render: () => (
    <TableStory data={largeData} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.Footer>
        <span>{largeData.length.toLocaleString()} rows (virtualized)</span>
      </InfiniteTable.Footer>
    </TableStory>
  ),
}

// ─── Detail Drawer ──────────────────────────────────────────────────────────

export const DetailDrawer: StoryObj = {
  name: 'Detail Drawer',
  render: () => (
    <TableStory data={sampleData} size="sm">
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.DetailDrawer title={row => `Request ${(row as RequestLog).uuid.slice(0, 12)}`} />
    </TableStory>
  ),
}

// ─── Summary Chart ──────────────────────────────────────────────────────────

function generateChartData(data: RequestLog[]): SummaryBarChartBin[] {
  const buckets = new Map<string, { total: number; errors: number; sortKey: string }>()
  for (const row of data) {
    const d = row.date
    const block = Math.floor(d.getHours() / 6) * 6
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(block).padStart(2, '0')}`
    const existing = buckets.get(sortKey) ?? { total: 0, errors: 0, sortKey }
    existing.total++
    if (row.status >= 400) existing.errors++
    buckets.set(sortKey, existing)
  }
  return Array.from(buckets.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ total, errors, sortKey }) => ({
      label: `${sortKey.slice(5, 10).replace('-', '/')} ${sortKey.slice(11)}:00`,
      value: total,
      secondary: errors,
    }))
}

const chartData = generateChartData(sampleData)

export const WithSummaryChart: StoryObj = {
  name: 'Summary Chart',
  render: () => (
    <TableStory data={sampleData} size="sm">
      <InfiniteTable.SummaryChart>
        <SummaryBarChart
          data={chartData}
          color="primary"
          secondaryColor="error"
          primaryLabel="Requests"
          secondaryLabel="Errors"
        />
      </InfiniteTable.SummaryChart>
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
    </TableStory>
  ),
}

// ─── Detail Drawer with Row Guard ───────────────────────────────────────────

export const DetailDrawerRowGuard: StoryObj = {
  name: 'Detail Drawer: isRowClickable',
  render: () => (
    <TableStory data={sampleData} size="sm" isRowClickable={(row: RequestLog) => row.status < 400}>
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.DetailDrawer title={row => `Request ${(row as RequestLog).uuid.slice(0, 12)}`} />
      <InfiniteTable.Footer>
        <span>Rows with status &ge; 400 are not clickable</span>
      </InfiniteTable.Footer>
    </TableStory>
  ),
}

// ─── All Features ───────────────────────────────────────────────────────────

export const AllFeatures: StoryObj = {
  name: 'All Features',
  render: () => (
    <FilterTableStory>
      <InfiniteTable.SummaryChart>
        <SummaryBarChart
          data={chartData}
          color="primary"
          secondaryColor="error"
          primaryLabel="Requests"
          secondaryLabel="Errors"
        />
      </InfiniteTable.SummaryChart>
      <InfiniteTable.Toolbar />
      <InfiniteTable.Content />
      <InfiniteTable.Footer>
        <span>Showing {sampleData.length} rows</span>
      </InfiniteTable.Footer>
      <InfiniteTable.DetailDrawer title={row => `Request ${(row as RequestLog).uuid.slice(0, 12)}`} />
    </FilterTableStory>
  ),
}
