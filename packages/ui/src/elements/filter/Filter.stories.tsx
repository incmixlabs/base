import type { Meta, StoryObj } from '@storybook/react-vite'
import { isSameDay } from 'date-fns'
import * as React from 'react'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import { Filter } from './Filter'
import type { FilterApplyMode, FilterField, FilterState } from './filter.props'

type RequestRecord = {
  id: string
  date: Date
  method: string
  host: string
  latency: number
  assigneeId: string
}

const assignees: AvatarListItem[] = [
  { id: 'annie', name: 'Annie Case', title: 'Design Lead', email: 'annie@example.com', presence: 'online' },
  { id: 'marco', name: 'Marco Reed', title: 'Frontend Engineer', email: 'marco@example.com', presence: 'busy' },
  { id: 'priya', name: 'Priya Shah', title: 'Product Manager', email: 'priya@example.com', presence: 'offline' },
]

const sampleRows: RequestRecord[] = [
  { id: '1', date: new Date(2026, 3, 1), method: 'GET', host: 'cdn.example.com', latency: 240, assigneeId: 'annie' },
  { id: '2', date: new Date(2026, 3, 2), method: 'POST', host: 'api.example.com', latency: 1240, assigneeId: 'marco' },
  { id: '3', date: new Date(2026, 3, 3), method: 'PATCH', host: 'app.example.com', latency: 2480, assigneeId: 'priya' },
  {
    id: '4',
    date: new Date(2026, 3, 4),
    method: 'DELETE',
    host: 'media.example.com',
    latency: 3120,
    assigneeId: 'marco',
  },
  { id: '5', date: new Date(2026, 3, 5), method: 'GET', host: 'assets.example.com', latency: 640, assigneeId: 'annie' },
  { id: '6', date: new Date(2026, 3, 6), method: 'POST', host: 'ws.example.com', latency: 1840, assigneeId: 'priya' },
  { id: '7', date: new Date(2026, 3, 7), method: 'PUT', host: 'api.example.com', latency: 920, assigneeId: 'annie' },
  { id: '8', date: new Date(2026, 3, 8), method: 'HEAD', host: 'cdn.example.com', latency: 110, assigneeId: 'marco' },
]

const filterFields: FilterField<RequestRecord>[] = [
  {
    id: 'date',
    label: 'Date',
    type: 'calendar',
  },
  {
    id: 'assigneeId',
    label: 'Assignee',
    type: 'avatar-list',
    items: assignees,
  },
  {
    id: 'method',
    label: 'Method',
    type: 'checkbox',
    options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map(value => ({ label: value, value })),
  },
  {
    id: 'host',
    label: 'Host',
    type: 'input',
  },
  {
    id: 'latency',
    label: 'Latency',
    type: 'slider',
    min: 0,
    max: 4000,
    step: 50,
  },
]

const meta: Meta = {
  title: 'Elements/Filter',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div
        style={{ minHeight: '100vh', width: '100%', padding: '1.5rem', background: 'var(--color-neutral-background)' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj

function formatFilterValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(' to ')
  }

  if (value instanceof Date) {
    return value.toLocaleDateString()
  }

  return String(value)
}

function applyFilters(rows: RequestRecord[], filters: FilterState) {
  return rows.filter(row =>
    filters.every(filter => {
      switch (filter.id) {
        case 'date':
          return filter.value instanceof Date ? isSameDay(row.date, filter.value) : true
        case 'assigneeId':
          return Array.isArray(filter.value) && filter.value.length > 0 ? filter.value.includes(row.assigneeId) : true
        case 'method':
          return Array.isArray(filter.value) && filter.value.length > 0 ? filter.value.includes(row.method) : true
        case 'host':
          return typeof filter.value === 'string' && filter.value.length > 0
            ? row.host.toLowerCase().includes(filter.value.toLowerCase())
            : true
        case 'latency':
          return Array.isArray(filter.value) && filter.value.length >= 2
            ? row.latency >= Number(filter.value[0]) && row.latency <= Number(filter.value[1])
            : true
        default:
          return true
      }
    }),
  )
}

function FilterPageDemo({ applyMode = 'immediate' }: { applyMode?: FilterApplyMode }) {
  const [filters, setFilters] = React.useState<FilterState>([])
  const filteredRows = React.useMemo(() => applyFilters(sampleRows, filters), [filters])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '18rem minmax(0, 1fr)',
        gap: '1rem',
        minHeight: 'calc(100vh - 3rem)',
      }}
    >
      <aside
        style={{
          border: '1px solid var(--color-neutral-border)',
          background: 'var(--color-neutral-surface)',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      >
        <Filter
          filterFields={filterFields}
          value={filters}
          onValueChange={setFilters}
          applyMode={applyMode}
          className="h-full"
        />
      </aside>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: 0,
        }}
      >
        <section
          style={{
            border: '1px solid var(--color-neutral-border)',
            background: 'var(--color-neutral-surface)',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Applied Filters
          </div>
          {filters.length === 0 ? (
            <p style={{ marginTop: '0.75rem', color: 'var(--color-slate-text)' }}>No applied filters yet.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {filters.map(filter => (
                <span
                  key={filter.id}
                  style={{
                    border: '1px solid var(--color-primary-border)',
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary-text)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {filter.id}: {formatFilterValue(filter.value)}
                </span>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            border: '1px solid var(--color-neutral-border)',
            background: 'var(--color-neutral-surface)',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <div>
              <div
                style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Example Results
              </div>
              <div style={{ marginTop: '0.25rem', color: 'var(--color-slate-text)' }}>
                {filteredRows.length} of {sampleRows.length} rows visible
              </div>
            </div>
            <div style={{ color: 'var(--color-slate-text)', fontSize: '0.875rem' }}>
              {applyMode === 'manual' ? 'Draft changes require Apply.' : 'Changes apply immediately.'}
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            {filteredRows.map(row => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '8rem minmax(0, 1fr) 7rem',
                  gap: '1rem',
                  border: '1px solid var(--color-neutral-border-subtle)',
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--color-background)',
                  minWidth: 0,
                }}
              >
                <div style={{ fontWeight: 600 }}>{row.method}</div>
                <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.host}</div>
                <div style={{ textAlign: 'right', color: 'var(--color-slate-text)' }}>{row.latency}ms</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export const ImmediateApply: Story = {
  name: 'Example Layout',
  render: () => <FilterPageDemo applyMode="immediate" />,
}

export const ManualApply: Story = {
  name: 'Example Layout - Manual Apply',
  render: () => <FilterPageDemo applyMode="manual" />,
}

export const AvatarListFilter: Story = {
  name: 'Avatar List Field',
  render: () => <FilterPageDemo applyMode="manual" />,
}

export const CalendarFilter: Story = {
  name: 'Calendar Field',
  render: () => <FilterPageDemo applyMode="manual" />,
}
