import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import * as React from 'react'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import type { FilterField } from '@/elements/filter/filter.props'
import { Label, Switch } from '@/form'
import { Flex } from '@/layouts'
import { toTanStackTableColumnDefs, type TableColumnDef } from '@/table/shared'
import type { InfiniteTableColumnDef } from './infinite-table.props'
import { InfiniteTableWrapper } from './InfiniteTableWrapper'
import { generateRequestLogs, type RequestLog, requestLogColumns, requestLogFilterFields } from './sample-data'

const sampleData = generateRequestLogs(500)
const smallData = generateRequestLogs(8)

type RequestLogWithAssignee = RequestLog & {
  assigneeId: string
}

const assignees: AvatarListItem[] = [
  { id: 'annie', name: 'Annie Case', title: 'Design Lead', email: 'annie@example.com', presence: 'online' },
  { id: 'marco', name: 'Marco Reed', title: 'Frontend Engineer', email: 'marco@example.com', presence: 'busy' },
  { id: 'priya', name: 'Priya Shah', title: 'Product Manager', email: 'priya@example.com', presence: 'offline' },
]

const sampleDataWithAssignee: RequestLogWithAssignee[] = sampleData.map((row, index) => ({
  ...row,
  assigneeId: assignees[index % assignees.length]?.id ?? 'annie',
}))

type RendererRow = {
  id: string
  member: { id: string; name: string }
  pri: 'none' | 'low' | 'med' | 'high' | 'critical' | 'blocker'
  st: 'todo' | 'triage' | 'review' | 'in-progress' | 'on-hold' | 'rejected' | 'done'
  priority:
    | 'none'
    | 'low'
    | 'med'
    | 'high'
    | 'critical'
    | 'blocker'
    | { value: 'none' | 'low' | 'med' | 'high' | 'critical' | 'blocker'; label?: string }
  owners: Array<{ id: string; name: string }>
  stage: string
  due: { start: string; end: string; current: string; value: string }
  severity: 'none' | 'low' | 'med' | 'high' | 'critical' | 'blocker'
  trend: number[]
  done: boolean | { checked: boolean; indeterminate?: boolean }
}

const sharedRendererRows: RendererRow[] = [
  {
    id: 'jamie',
    member: { id: 'member-jamie', name: 'Jamie Cross' },
    pri: 'low',
    st: 'todo',
    priority: 'low',
    owners: [{ id: 'member-jamie', name: 'Jamie Cross' }],
    stage: 'ready',
    due: { start: '2026-03-12', end: '2026-03-18', current: '2026-03-14', value: 'on-track' },
    severity: 'low',
    trend: [8, 10, 11, 11, 12, 12, 13],
    done: false,
  },
  {
    id: 'casey',
    member: { id: 'member-casey', name: 'Casey North' },
    pri: 'none',
    st: 'triage',
    priority: 'none',
    owners: [{ id: 'member-casey', name: 'Casey North' }],
    stage: 'ready',
    due: { start: '2026-03-10', end: '2026-03-16', current: '2026-03-11', value: 'on-track' },
    severity: 'none',
    trend: [5, 6, 6, 7, 7, 8, 8],
    done: false,
  },
  {
    id: 'maya',
    member: { id: 'member-maya', name: 'Maya Patel' },
    pri: 'med',
    st: 'review',
    priority: 'med',
    owners: [
      { id: 'member-maya', name: 'Maya Patel' },
      { id: 'member-jordan', name: 'Jordan Chen' },
      { id: 'member-alex', name: 'Alex Morgan' },
    ],
    stage: 'ready',
    due: { start: '2026-03-15', end: '2026-03-21', current: '2026-03-19', value: 'on-track' },
    severity: 'low',
    trend: [12, 18, 16, 24, 28, 34, 40],
    done: true,
  },
  {
    id: 'sam',
    member: { id: 'member-sam', name: 'Sam Lee' },
    pri: 'critical',
    st: 'on-hold',
    priority: 'critical',
    owners: [
      { id: 'member-sam', name: 'Sam Lee' },
      { id: 'member-jordan', name: 'Jordan Chen' },
    ],
    stage: 'review',
    due: { start: '2026-03-19', end: '2026-03-24', current: '2026-03-21', value: 'at-risk' },
    severity: 'critical',
    trend: [30, 28, 24, 20, 18, 17, 16],
    done: false,
  },
  {
    id: 'riley',
    member: { id: 'member-riley', name: 'Riley Stone' },
    pri: 'high',
    st: 'rejected',
    priority: 'high',
    owners: [
      { id: 'member-riley', name: 'Riley Stone' },
      { id: 'member-maya', name: 'Maya Patel' },
    ],
    stage: 'review',
    due: { start: '2026-03-20', end: '2026-03-26', current: '2026-03-23', value: 'at-risk' },
    severity: 'high',
    trend: [18, 19, 21, 24, 23, 25, 27],
    done: false,
  },
  {
    id: 'alex',
    member: { id: 'member-alex', name: 'Alex Morgan' },
    pri: 'blocker',
    st: 'done',
    priority: { value: 'blocker', label: 'Blocked' },
    owners: [
      { id: 'member-alex', name: 'Alex Morgan' },
      { id: 'member-maya', name: 'Maya Patel' },
      { id: 'member-sam', name: 'Sam Lee' },
      { id: 'member-jordan', name: 'Jordan Chen' },
    ],
    stage: 'blocked',
    due: { start: '2026-03-24', end: '2026-03-28', current: '2026-03-25', value: 'blocked' },
    severity: 'blocker',
    trend: [6, 8, 8, 9, 9, 9, 10],
    done: { checked: false, indeterminate: true },
  },
]

const scrollingRendererRows: RendererRow[] = Array.from({ length: 36 }, (_, index) => {
  const template = sharedRendererRows[index % sharedRendererRows.length]
  const suffix = index + 1
  return {
    ...template,
    id: `${template.id}-${suffix}`,
    member: {
      ...template.member,
      id: `${template.member.id}-${suffix}`,
      name: `${template.member.name} ${suffix}`,
    },
  }
})

const sharedRendererColumnDefs: TableColumnDef<RendererRow>[] = [
  {
    id: 'member',
    header: 'Member',
    accessorKey: 'member',
    width: 220,
    rowHeader: true,
    format: { renderer: { type: 'avatar' } },
  },
  {
    id: 'pri',
    header: 'Pri',
    accessorKey: 'pri',
    width: 70,
    format: { renderer: { type: 'priority', display: 'icon-only' } },
  },
  {
    id: 'st',
    header: 'St',
    accessorKey: 'st',
    width: 70,
    format: { renderer: { type: 'status', display: 'icon-only' } },
  },
  {
    id: 'priority',
    header: 'Priority',
    accessorKey: 'priority',
    width: 160,
    format: { renderer: { type: 'priority' } },
  },
  {
    id: 'owners',
    header: 'Owners',
    accessorKey: 'owners',
    width: 180,
    format: { renderer: { type: 'avatar-group', max: 3 } },
  },
  {
    id: 'stage',
    header: 'Stage',
    accessorKey: 'stage',
    width: 150,
    format: {
      renderer: {
        type: 'label',
        values: [
          { value: 'ready', color: 'success', label: 'Ready' },
          { value: 'blocked', color: 'warning', label: 'Blocked' },
          { value: 'review', color: 'info', label: 'In Review' },
        ],
      },
      fullCell: true,
    },
  },
  {
    id: 'due',
    header: 'Due',
    accessorKey: 'due',
    width: 190,
    format: {
      renderer: {
        type: 'timeline',
        values: [
          { value: 'on-track', color: 'success' },
          { value: 'at-risk', color: 'warning' },
          { value: 'blocked', color: 'error' },
        ],
      },
    },
  },
  {
    id: 'severity',
    header: 'Severity',
    accessorKey: 'severity',
    width: 140,
    format: {
      renderer: { type: 'priority', display: 'label-only', variant: 'soft' },
      fullCell: true,
    },
  },
  {
    id: 'trend',
    header: 'Trend',
    accessorKey: 'trend',
    width: 120,
    format: { renderer: { type: 'sparkline' } },
  },
  {
    id: 'done',
    header: 'Done',
    accessorKey: 'done',
    width: 90,
    format: { renderer: { type: 'checkbox', color: 'info' } },
  },
]

const sharedRendererColumns: InfiniteTableColumnDef<RendererRow>[] = toTanStackTableColumnDefs(sharedRendererColumnDefs)

const requestLogColumnsWithAssignee: ColumnDef<RequestLogWithAssignee>[] = [
  {
    accessorKey: 'assigneeId',
    header: 'Assignee',
    cell: ({ row }) => {
      const assignee = assignees.find(item => item.id === row.original.assigneeId)
      return assignee?.name ?? row.original.assigneeId
    },
  },
  ...(requestLogColumns as ColumnDef<RequestLogWithAssignee>[]),
]

const requestLogAvatarFilterFields: FilterField<RequestLogWithAssignee>[] = [
  {
    id: 'assigneeId',
    label: 'Assignee',
    type: 'avatar-list',
    items: assignees,
  },
  ...(requestLogFilterFields as FilterField<RequestLogWithAssignee>[]),
]

const meta: Meta = {
  title: 'Table/InfiniteTableWrapper',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Default: StoryObj = {
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      filterFields={requestLogFilterFields}
      size="sm"
      footer={<span>Showing {sampleData.length} rows</span>}
    />
  ),
}

export const SizeSm: StoryObj = {
  name: 'Size: sm',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={smallData}
      filterFields={requestLogFilterFields}
      size="sm"
    />
  ),
}

export const SizeMd: StoryObj = {
  name: 'Size: md',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={smallData}
      filterFields={requestLogFilterFields}
      size="md"
    />
  ),
}

export const SizeLg: StoryObj = {
  name: 'Size: lg',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={smallData}
      filterFields={requestLogFilterFields}
      size="lg"
    />
  ),
}

export const NoFilters: StoryObj = {
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      size="sm"
      footer={<span>{sampleData.length} rows</span>}
    />
  ),
}

export const NoToolbar: StoryObj = {
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      filterFields={requestLogFilterFields}
      toolbar={false}
      size="sm"
    />
  ),
}

export const Empty: StoryObj = {
  render: () => <InfiniteTableWrapper columns={requestLogColumns} data={[]} size="sm" />,
}

// ─── Filter Stories ──────────────────────────────────────────────────────────

export const PreAppliedFilters: StoryObj = {
  name: 'Filter: Pre-applied',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      filterFields={requestLogFilterFields}
      defaultColumnFilters={[
        { id: 'method', value: ['GET', 'POST'] },
        { id: 'level', value: ['error'] },
      ]}
      size="sm"
    />
  ),
}

const checkboxOnlyFields: FilterField<RequestLog>[] = requestLogFilterFields.filter(f => f.type === 'checkbox')

export const CheckboxFilterOnly: StoryObj = {
  name: 'Filter: Checkbox only',
  render: () => (
    <InfiniteTableWrapper columns={requestLogColumns} data={sampleData} filterFields={checkboxOnlyFields} size="sm" />
  ),
}

const sliderOnlyFields: FilterField<RequestLog>[] = requestLogFilterFields.filter(f => f.type === 'slider')

export const SliderFilterOnly: StoryObj = {
  name: 'Filter: Slider only',
  render: () => (
    <InfiniteTableWrapper columns={requestLogColumns} data={sampleData} filterFields={sliderOnlyFields} size="sm" />
  ),
}

export const AvatarListFilter: StoryObj = {
  name: 'Filter: Avatar list',
  render: () => (
    <InfiniteTableWrapper<RequestLogWithAssignee>
      columns={requestLogColumnsWithAssignee}
      data={sampleDataWithAssignee}
      filterFields={requestLogAvatarFilterFields}
      size="sm"
    />
  ),
}

export const FilterPanelClosed: StoryObj = {
  name: 'Filter: Panel collapsed',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      filterFields={requestLogFilterFields}
      defaultFilterPanelOpen={false}
      size="sm"
    />
  ),
}

const largeData = generateRequestLogs(10000)

export const LargeDataset: StoryObj = {
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={largeData}
      filterFields={requestLogFilterFields}
      size="sm"
      footer={<span>{largeData.length.toLocaleString()} rows (virtualized)</span>}
    />
  ),
}

export const InfiniteScrolling: StoryObj = {
  name: 'Infinite Scroll',
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={sampleData}
      filterFields={requestLogFilterFields}
      hasNextPage={true}
      fetchNextPage={() => console.log('Fetching next page...')}
      isFetching={false}
      isLoading={false}
      totalRows={2000}
      filterRows={sampleData.length}
      size="sm"
      footer={<span>{sampleData.length} of 2,000 rows loaded</span>}
    />
  ),
}

export const Loading: StoryObj = {
  render: () => (
    <InfiniteTableWrapper
      columns={requestLogColumns}
      data={[]}
      filterFields={requestLogFilterFields}
      isLoading={true}
      size="sm"
    />
  ),
}

export const SharedCellRenderers: StoryObj = {
  render: () => (
    <div style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
      <InfiniteTableWrapper
        columns={sharedRendererColumns}
        data={scrollingRendererRows}
        size="sm"
        footer={<span>Shared renderer contract across basic and infinite table wrappers.</span>}
      />
    </div>
  ),
}

export const PriorityCells: StoryObj = {
  render: () => (
    <div style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
      <InfiniteTableWrapper
        columns={sharedRendererColumns}
        data={scrollingRendererRows}
        size="sm"
        footer={<span>`Priority`, `Pri`, and `Severity` share the same priority renderer contract.</span>}
      />
    </div>
  ),
}

// ─── Editable cells ────────────────────────────────────────────────────────

const teamMembers = [
  { id: 'member-jamie', name: 'Jamie Cross' },
  { id: 'member-casey', name: 'Casey North' },
  { id: 'member-maya', name: 'Maya Patel' },
  { id: 'member-sam', name: 'Sam Lee' },
  { id: 'member-riley', name: 'Riley Stone' },
  { id: 'member-alex', name: 'Alex Morgan' },
  { id: 'member-jordan', name: 'Jordan Chen' },
]

const statusRenderer = {
  type: 'status' as const,
  values: [
    { value: 'todo' as const, label: 'Todo', icon: 'circle', color: 'neutral' as const },
    { value: 'triage' as const, label: 'Triage', icon: 'circle-minus', color: 'warning' as const },
    { value: 'review' as const, label: 'Review', icon: 'eye', color: 'info' as const },
    { value: 'in-progress' as const, label: 'In Progress', icon: 'ellipsis', color: 'info' as const },
    { value: 'on-hold' as const, label: 'On Hold', icon: 'pause', color: 'warning' as const },
    { value: 'rejected' as const, label: 'Rejected', icon: 'circle-x', color: 'error' as const },
    { value: 'done' as const, label: 'Executed', icon: 'circle-check-big', color: 'success' as const },
  ],
}

const priorityRenderer = {
  type: 'priority' as const,
  values: [
    { value: 'none' as const, label: 'None', icon: 'circle-minus', color: 'neutral' as const },
    { value: 'low' as const, label: 'Low', icon: 'chart-column-big', color: 'neutral' as const },
    { value: 'med' as const, label: 'Medium', icon: 'chart-column-big', color: 'warning' as const },
    { value: 'high' as const, label: 'High', icon: 'chart-column-big', color: 'warning' as const },
    { value: 'critical' as const, label: 'Critical', icon: 'triangle-alert', color: 'error' as const },
    { value: 'blocker' as const, label: 'Blocker', icon: 'square', color: 'error' as const },
  ],
}

const editableRendererColumns: InfiniteTableColumnDef<RendererRow>[] = [
  {
    accessorKey: 'member',
    header: 'Member',
    size: 220,
    meta: { rowHeader: true, editable: true, renderer: { type: 'avatar', values: teamMembers } },
  },
  {
    accessorKey: 'pri',
    header: 'Pri',
    size: 70,
    meta: { editable: true, renderer: { ...priorityRenderer, display: 'icon-only' as const } },
  },
  {
    accessorKey: 'st',
    header: 'St',
    size: 70,
    meta: { editable: true, renderer: { ...statusRenderer, display: 'icon-only' as const } },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    size: 160,
    meta: { editable: true, renderer: priorityRenderer },
  },
  {
    accessorKey: 'owners',
    header: 'Owners',
    size: 180,
    meta: { editable: true, renderer: { type: 'avatar-group', max: 3, values: teamMembers } },
  },
  {
    accessorKey: 'stage',
    header: 'Stage',
    size: 150,
    meta: {
      editable: true,
      renderer: {
        type: 'label',
        values: [
          { value: 'ready', color: 'success', label: 'Ready' },
          { value: 'blocked', color: 'warning', label: 'Blocked' },
          { value: 'review', color: 'info', label: 'In Review' },
        ],
      },
    },
  },
  {
    accessorKey: 'due',
    header: 'Due',
    size: 190,
    meta: {
      renderer: {
        type: 'timeline',
        values: [
          { value: 'on-track', color: 'success' },
          { value: 'at-risk', color: 'warning' },
          { value: 'blocked', color: 'error' },
        ],
      },
    },
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    size: 140,
    meta: {
      renderer: { ...priorityRenderer, display: 'label-only' as const, variant: 'soft' as const },
    },
  },
  {
    accessorKey: 'trend',
    header: 'Trend',
    size: 120,
    meta: { renderer: { type: 'sparkline' } },
  },
  {
    accessorKey: 'done',
    header: 'Done',
    size: 90,
    meta: { renderer: { type: 'checkbox', color: 'info' }, editor: { type: 'checkbox' } },
  },
]

export const EditableCells: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(scrollingRendererRows)
    const [editable, setEditable] = React.useState(true)
    const nextDuplicateId = React.useRef(1)

    return (
      <div style={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
        <Flex align="center" gap="4" className="px-4 py-2 border-b">
          <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Switch size="xs" checked={editable} onCheckedChange={setEditable} aria-label="Toggle editing" />
            Editable
          </Label>
        </Flex>
        <InfiniteTableWrapper
          columns={editableRendererColumns}
          data={data}
          getRowId={row => row.id}
          size="sm"
          onCellEdit={
            editable
              ? ({ rowId, columnId, value }) => {
                  setData(current => current.map(row => (row.id === rowId ? { ...row, [columnId]: value } : row)))
                }
              : undefined
          }
          rowActions={{
            labels: { duplicate: 'Duplicate row', remove: 'Delete row' },
            onDuplicate: row => {
              const duplicateId = `${row.id}-duplicate-${nextDuplicateId.current++}`
              setData(current => {
                const index = current.findIndex(item => item.id === row.id)
                const duplicate = {
                  ...row,
                  id: duplicateId,
                  member: { ...row.member, id: duplicateId, name: `${row.member.name} copy` },
                }
                if (index < 0) return [...current, duplicate]
                return [...current.slice(0, index + 1), duplicate, ...current.slice(index + 1)]
              })
            },
            onRemove: row => {
              setData(current => current.filter(item => item.id !== row.id))
            },
          }}
          footer={<span>Click a cell to edit. Toggle editing on/off above.</span>}
        />
      </div>
    )
  },
}
