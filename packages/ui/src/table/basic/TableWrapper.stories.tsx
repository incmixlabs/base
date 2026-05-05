import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Icon, SegmentedControl } from '@/elements'
import { Label, Switch } from '@/form'
import { Flex } from '@/layouts'
import { TableShell, type TableColumnDef, type TableEngine, type TableShape } from '@/table/shared'
import { selectArgType } from '@/theme/props/storybook'
import { Text } from '@/typography/text/Text'
import { TableView } from '../TableView'
import { Table } from './Table'
import { TablePagination } from './TablePagination'
import { TableWrapper } from './TableWrapper'
import { tablePropDefs } from './table.props'
import type { TableWrapperColumn, TableWrapperRow } from './table-wrapper.props'

const tableShapeOptions = ['flat', 'tree'] as const satisfies readonly TableShape[]

function useArgState<T>(argValue: T) {
  const [value, setValue] = React.useState(argValue)

  React.useEffect(() => {
    setValue(argValue)
  }, [argValue])

  return [value, setValue] as const
}

function getCompactTableSize(compact: boolean) {
  return compact ? 'xs' : 'sm'
}

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

const classificationRenderer = {
  type: 'classification' as const,
  values: [
    { value: 'bug' as const, label: 'Bug', icon: 'bug', color: 'error' as const },
    { value: 'release' as const, label: 'Release', icon: 'rocket', color: 'success' as const },
    { value: 'feature' as const, label: 'Feature', icon: 'feather', color: 'info' as const },
    { value: 'checklist' as const, label: 'Checklist', icon: 'checklist', color: 'neutral' as const },
    { value: 'milestone' as const, label: 'Milestone', icon: 'flag', color: 'success' as const },
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

const wrapperData: TableWrapper.Data = {
  caption: 'Live accounts',
  columns: [
    { id: 'name', header: 'Customer', rowHeader: true, minWidth: '220px' },
    { id: 'email', header: 'Email', minWidth: '240px' },
    { id: 'plan', header: 'Plan' },
    { id: 'mrr', header: 'MRR', justify: 'end' },
    { id: 'status', header: 'Status', renderer: statusRenderer },
  ],
  rows: [
    {
      id: 'alex',
      values: {
        name: 'Alex Morgan',
        email: 'alex@autoform.dev',
        plan: 'Growth',
        mrr: '$1,200',
        status: 'in-progress',
      },
    },
    {
      id: 'sam',
      values: {
        name: 'Sam Lee',
        email: 'sam@autoform.dev',
        plan: 'Starter',
        mrr: '$980',
        status: 'on-hold',
      },
    },
    {
      id: 'jordan',
      values: {
        name: 'Jordan Chen',
        email: 'jordan@autoform.dev',
        plan: 'Enterprise',
        mrr: '$2,140',
        status: 'done',
      },
    },
  ],
}

type PresentationRow = {
  id: string
  name: string
  email: string
  plan: string
  mrr: string
  status: string
}

const presentationRows: PresentationRow[] = wrapperData.rows.map(row => ({
  id: row.id,
  name: String(row.values.name ?? ''),
  email: String(row.values.email ?? ''),
  plan: String(row.values.plan ?? ''),
  mrr: String(row.values.mrr ?? ''),
  status: String(row.values.status ?? ''),
}))

const presentationColumns: TableColumnDef<PresentationRow>[] = [
  { id: 'name', header: 'Customer', accessorKey: 'name', rowHeader: true, minWidth: '220px' },
  { id: 'email', header: 'Email', accessorKey: 'email', minWidth: '240px' },
  { id: 'plan', header: 'Plan', accessorKey: 'plan' },
  { id: 'mrr', header: 'MRR', accessorKey: 'mrr', format: { align: 'right' } },
  { id: 'status', header: 'Status', accessorKey: 'status', format: { renderer: statusRenderer } },
]

const hierarchicalData: TableWrapper.Data = {
  caption: 'Accounts by segment',
  columns: [
    { id: 'name', header: 'Customer', rowHeader: true, minWidth: '260px' },
    { id: 'email', header: 'Email', minWidth: '240px' },
    { id: 'plan', header: 'Plan' },
    { id: 'mrr', header: 'MRR', justify: 'end' },
    { id: 'status', header: 'Status', renderer: statusRenderer },
  ],
  rows: [
    {
      id: 'enterprise-team',
      values: {
        name: 'Enterprise',
        email: 'team@autoform.dev',
        plan: 'Portfolio',
        mrr: '$8,400',
        status: 'done',
      },
      subRows: [
        {
          id: 'jordan',
          values: {
            name: 'Jordan Chen',
            email: 'jordan@autoform.dev',
            plan: 'Enterprise',
            mrr: '$2,140',
            status: 'done',
          },
        },
        {
          id: 'alex',
          selected: true,
          values: {
            name: 'Alex Morgan',
            email: 'alex@autoform.dev',
            plan: 'Growth',
            mrr: '$1,200',
            status: 'in-progress',
          },
        },
      ],
    },
    {
      id: 'growth-team',
      values: {
        name: 'Growth',
        email: 'growth@autoform.dev',
        plan: 'Starter',
        mrr: '$1,980',
        status: 'triage',
      },
      subRows: [
        {
          id: 'sam',
          values: {
            name: 'Sam Lee',
            email: 'sam@autoform.dev',
            plan: 'Starter',
            mrr: '$980',
            status: 'rejected',
          },
        },
      ],
    },
  ],
}

const editableStatusValues = ['todo', 'in-progress', 'on-hold', 'done'] as const

const editableTeamMembers = [
  { id: 'em-jamie', name: 'Jamie Cross' },
  { id: 'em-casey', name: 'Casey North' },
  { id: 'em-maya', name: 'Maya Patel' },
  { id: 'em-sam', name: 'Sam Lee' },
  { id: 'em-riley', name: 'Riley Stone' },
  { id: 'em-alex', name: 'Alex Morgan' },
]

const editableWrapperData: TableWrapper.Data = {
  caption: 'Editable services',
  columns: [
    { id: 'service', header: 'Service', rowHeader: true, minWidth: '260px', editor: { type: 'text' } },
    {
      id: 'quantity',
      header: 'Qty',
      align: 'right',
      width: '7rem',
      editor: { type: 'number', min: 1, default: 1, decimal: 0 },
    },
    {
      id: 'status',
      header: 'Status',
      width: '12rem',
      renderer: statusRenderer,
      editor: {
        type: 'select',
        options: editableStatusValues.map(value => {
          const config = statusRenderer.values.find(item => item.value === value)
          return {
            value,
            label: config?.label ?? value,
            icon: config?.icon,
            iconColor: config?.color,
            color: config?.color,
          }
        }),
      },
    },
    {
      id: 'assignee',
      header: 'Assignee',
      minWidth: '180px',
      editable: true,
      renderer: { type: 'avatar', values: editableTeamMembers },
    },
    {
      id: 'reviewers',
      header: 'Reviewers',
      minWidth: '180px',
      editable: true,
      renderer: { type: 'avatar-group', max: 3, values: editableTeamMembers },
    },
    {
      id: 'billable',
      header: 'Billable',
      align: 'center',
      width: '7rem',
      renderer: { type: 'checkbox' },
      editor: { type: 'checkbox' },
    },
  ],
  rows: [
    {
      id: 'svc-1',
      values: {
        service: 'Premium support',
        quantity: 2,
        status: 'in-progress',
        assignee: { id: 'em-jamie', name: 'Jamie Cross' },
        reviewers: [
          { id: 'em-casey', name: 'Casey North' },
          { id: 'em-maya', name: 'Maya Patel' },
        ],
        billable: true,
      },
    },
    {
      id: 'svc-2',
      values: {
        service: 'Implementation service',
        quantity: 1,
        status: 'todo',
        assignee: { id: 'em-casey', name: 'Casey North' },
        reviewers: [{ id: 'em-jamie', name: 'Jamie Cross' }],
        billable: false,
      },
    },
    {
      id: 'svc-3',
      values: {
        service: 'Onboarding workshop',
        quantity: 3,
        status: 'on-hold',
        assignee: { id: 'em-maya', name: 'Maya Patel' },
        reviewers: [
          { id: 'em-sam', name: 'Sam Lee' },
          { id: 'em-riley', name: 'Riley Stone' },
          { id: 'em-alex', name: 'Alex Morgan' },
        ],
        billable: true,
      },
    },
    {
      id: 'svc-4',
      values: {
        service: 'Architecture review',
        quantity: 2,
        status: 'done',
        assignee: { id: 'em-sam', name: 'Sam Lee' },
        reviewers: [{ id: 'em-maya', name: 'Maya Patel' }],
        billable: true,
      },
    },
    {
      id: 'svc-5',
      values: {
        service: 'Data migration',
        quantity: 4,
        status: 'in-progress',
        assignee: { id: 'em-riley', name: 'Riley Stone' },
        reviewers: [
          { id: 'em-jamie', name: 'Jamie Cross' },
          { id: 'em-casey', name: 'Casey North' },
        ],
        billable: false,
      },
    },
    {
      id: 'svc-6',
      values: {
        service: 'Security assessment',
        quantity: 1,
        status: 'todo',
        assignee: { id: 'em-alex', name: 'Alex Morgan' },
        reviewers: [{ id: 'em-sam', name: 'Sam Lee' }],
        billable: true,
      },
    },
    {
      id: 'svc-7',
      values: {
        service: 'QA automation setup',
        quantity: 2,
        status: 'on-hold',
        assignee: { id: 'em-jamie', name: 'Jamie Cross' },
        reviewers: [
          { id: 'em-alex', name: 'Alex Morgan' },
          { id: 'em-maya', name: 'Maya Patel' },
        ],
        billable: false,
      },
    },
    {
      id: 'svc-8',
      values: {
        service: 'Release cutover',
        quantity: 1,
        status: 'done',
        assignee: { id: 'em-casey', name: 'Casey North' },
        reviewers: [{ id: 'em-riley', name: 'Riley Stone' }],
        billable: true,
      },
    },
  ],
}

const teamMembers = [
  { id: 'member-jamie', name: 'Jamie Cross' },
  { id: 'member-casey', name: 'Casey North' },
  { id: 'member-maya', name: 'Maya Patel' },
  { id: 'member-sam', name: 'Sam Lee' },
  { id: 'member-riley', name: 'Riley Stone' },
  { id: 'member-alex', name: 'Alex Morgan' },
  { id: 'member-jordan', name: 'Jordan Chen' },
]

const rendererData: TableWrapper.Data = {
  caption: 'Renderer-driven cells',
  columns: [
    {
      id: 'member',
      header: 'Member',
      rowHeader: true,
      editable: true,
      renderer: { type: 'avatar', values: teamMembers },
      minWidth: '220px',
    },
    {
      id: 'pri',
      header: 'Pri',
      editable: true,
      renderer: { ...priorityRenderer, display: 'icon-only' as const },
      width: '72px',
    },
    {
      id: 'st',
      header: 'St',
      editable: true,
      renderer: { ...statusRenderer, display: 'icon-only' as const },
      width: '72px',
    },
    {
      id: 'cls',
      header: <Icon icon="shapes" title="Classification" size="sm" color="slate" />,
      editable: true,
      renderer: { ...classificationRenderer, display: 'icon-only' as const },
      width: '72px',
    },
    {
      id: 'priority',
      header: 'Priority',
      editable: true,
      renderer: priorityRenderer,
      minWidth: '160px',
    },
    { id: 'owners', header: 'Owners', editable: true, renderer: { type: 'avatar-group', max: 3, values: teamMembers } },
    {
      id: 'stage',
      header: 'Stage',
      editable: true,
      renderer: {
        type: 'label',
        values: [
          { value: 'ready', color: 'success', label: 'Ready' },
          { value: 'blocked', color: 'warning', label: 'Blocked' },
          { value: 'review', color: 'info', label: 'In Review' },
        ],
      },
      minWidth: '150px',
    },
    {
      id: 'status',
      header: 'Status',
      editable: true,
      renderer: statusRenderer,
      minWidth: '160px',
    },
    {
      id: 'classification',
      header: 'Classification',
      editable: true,
      renderer: classificationRenderer,
      minWidth: '160px',
    },
    {
      id: 'due',
      header: 'Due',
      renderer: {
        type: 'timeline',
        values: [
          { value: 'on-track', color: 'success' },
          { value: 'at-risk', color: 'warning' },
          { value: 'blocked', color: 'error' },
        ],
      },
      minWidth: '180px',
    },
    {
      id: 'severity',
      header: 'Severity',
      renderer: { ...priorityRenderer, display: 'label-only' as const, variant: 'soft' as const },
      minWidth: '140px',
    },
    { id: 'trend', header: 'Trend', renderer: { type: 'sparkline' } },
    { id: 'done', header: 'Done', renderer: { type: 'checkbox', color: 'info' } },
  ],
  rows: [
    {
      id: 'jamie',
      values: {
        member: { id: 'member-jamie', name: 'Jamie Cross' },
        pri: 'low',
        st: 'todo',
        cls: 'checklist',
        priority: 'low',
        owners: [{ id: 'member-jamie', name: 'Jamie Cross' }],
        stage: 'ready',
        status: 'todo',
        classification: 'checklist',
        due: { start: '2026-03-12', end: '2026-03-18', current: '2026-03-14', value: 'on-track' },
        severity: 'low',
        trend: [8, 10, 11, 11, 12, 12, 13],
        done: false,
      },
    },
    {
      id: 'casey',
      values: {
        member: { id: 'member-casey', name: 'Casey North' },
        pri: 'none',
        st: 'triage',
        cls: 'bug',
        priority: 'none',
        owners: [{ id: 'member-casey', name: 'Casey North' }],
        stage: 'ready',
        status: 'triage',
        classification: 'bug',
        due: { start: '2026-03-10', end: '2026-03-16', current: '2026-03-11', value: 'on-track' },
        severity: 'none',
        trend: [5, 6, 6, 7, 7, 8, 8],
        done: false,
      },
    },
    {
      id: 'maya',
      values: {
        member: { id: 'member-maya', name: 'Maya Patel' },
        pri: 'med',
        st: 'review',
        cls: 'feature',
        priority: 'med',
        owners: [
          { id: 'member-maya', name: 'Maya Patel' },
          { id: 'member-jordan', name: 'Jordan Chen' },
          { id: 'member-alex', name: 'Alex Morgan' },
        ],
        stage: 'ready',
        status: 'review',
        classification: 'feature',
        due: { start: '2026-03-15', end: '2026-03-21', current: '2026-03-19', value: 'on-track' },
        severity: 'low',
        trend: [12, 18, 16, 24, 28, 34, 40],
        done: true,
      },
    },
    {
      id: 'sam',
      values: {
        member: { id: 'member-sam', name: 'Sam Lee' },
        pri: 'critical',
        st: 'on-hold',
        cls: 'release',
        priority: 'critical',
        owners: [
          { id: 'member-sam', name: 'Sam Lee' },
          { id: 'member-jordan', name: 'Jordan Chen' },
        ],
        stage: 'review',
        status: 'on-hold',
        classification: 'release',
        due: { start: '2026-03-19', end: '2026-03-24', current: '2026-03-21', value: 'at-risk' },
        severity: 'critical',
        trend: [30, 28, 24, 20, 18, 17, 16],
        done: false,
      },
    },
    {
      id: 'riley',
      values: {
        member: { id: 'member-riley', name: 'Riley Stone' },
        pri: 'high',
        st: 'rejected',
        cls: 'bug',
        priority: 'high',
        owners: [
          { id: 'member-riley', name: 'Riley Stone' },
          { id: 'member-maya', name: 'Maya Patel' },
        ],
        stage: 'review',
        status: 'rejected',
        classification: 'bug',
        due: { start: '2026-03-20', end: '2026-03-26', current: '2026-03-23', value: 'at-risk' },
        severity: 'high',
        trend: [18, 19, 21, 24, 23, 25, 27],
        done: false,
      },
    },
    {
      id: 'alex',
      values: {
        member: { id: 'member-alex', name: 'Alex Morgan' },
        pri: 'blocker',
        st: 'done',
        cls: 'milestone',
        priority: { value: 'blocker', label: 'Blocked' },
        owners: [
          { id: 'member-alex', name: 'Alex Morgan' },
          { id: 'member-maya', name: 'Maya Patel' },
          { id: 'member-sam', name: 'Sam Lee' },
          { id: 'member-jordan', name: 'Jordan Chen' },
        ],
        stage: 'blocked',
        status: 'done',
        classification: 'milestone',
        due: { start: '2026-03-24', end: '2026-03-28', current: '2026-03-25', value: 'blocked' },
        severity: 'blocker',
        trend: [6, 8, 8, 9, 9, 9, 10],
        done: { checked: false, indeterminate: true },
      },
    },
  ],
}

const paginatedRendererRows = Array.from({ length: 24 }, (_, index) => {
  const template = rendererData.rows[index % rendererData.rows.length]
  const suffix = index + 1
  const baseName =
    typeof template?.values.member === 'object' && template?.values.member && 'name' in template.values.member
      ? String(template.values.member.name)
      : 'Member'

  return {
    ...template,
    id: `${template?.id ?? 'row'}-${suffix}`,
    values: {
      ...template?.values,
      member:
        template?.values.member &&
        typeof template.values.member === 'object' &&
        !React.isValidElement(template.values.member) &&
        'id' in template.values.member &&
        'name' in template.values.member
          ? {
              ...template.values.member,
              id: `${template.values.member.id}-${suffix}`,
              name: `${baseName} ${suffix}`,
            }
          : template?.values.member,
    },
  }
})

const paginatedRendererData: TableWrapper.Data = {
  ...rendererData,
  rows: paginatedRendererRows,
}

const meta = {
  title: 'Table/TableWrapper',
  component: TableWrapper,
  parameters: {
    layout: 'centered',
  },
  args: {
    data: wrapperData,
    size: 'sm',
    variant: 'surface',
    layout: 'auto',
    striped: false,
    compact: false,
  },
  argTypes: {
    size: selectArgType(tablePropDefs.Root.size),
    variant: selectArgType(tablePropDefs.Root.variant),
    layout: selectArgType(tablePropDefs.Root.layout),
    striped: { control: 'boolean' },
    compact: { control: 'boolean' },
    gridLines: { control: 'boolean' },
    shape: { control: { type: 'select' }, options: tableShapeOptions },
    defaultShape: { control: { type: 'select' }, options: tableShapeOptions },
  },
} satisfies Meta<TableWrapper.Props>

export default meta
type Story = StoryObj<TableWrapper.Props>

function withCellContent(defaultCell: React.ReactNode, content: React.ReactNode) {
  if (React.isValidElement(defaultCell)) {
    return React.cloneElement(defaultCell, undefined, content)
  }
  return defaultCell
}

export const Basic: Story = {
  render: args => (
    <div className="w-[900px] space-y-3">
      <div>
        <div className="text-base font-semibold">Accounts Table (Wrapper)</div>
        <div className="text-sm text-muted-foreground">Data-driven rendering using columns + rows payload.</div>
      </div>
      <TableWrapper key={String(args.size ?? 'sm')} {...args} />
    </div>
  ),
}

export const RenderOverrides: Story = {
  render: args => (
    <div className="w-[900px] space-y-3">
      <div className="text-base font-semibold">Wrapper Overrides</div>
      <TableWrapper
        key={String(args.size ?? 'sm')}
        {...args}
        renderCell={(row, column, defaultCell) => {
          if (column.id !== 'name') return defaultCell
          return withCellContent(
            defaultCell,
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              {row.values.name as React.ReactNode}
            </div>,
          )
        }}
      />
    </div>
  ),
}

export const WrapperVsPrimitive: Story = {
  render: args => {
    const data = wrapperData

    return (
      <div className="grid w-[1120px] grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Wrapper composition</div>
          <TableWrapper {...args} data={data} />
        </div>
        <div className="w-full">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Primitive composition</div>
          <Table.Root size={args.size} variant={args.variant} layout={args.layout} striped={args.striped}>
            {data.caption ? <Table.Caption>{data.caption}</Table.Caption> : null}
            <Table.Header>
              <Table.Row>
                {data.columns.map((column: TableWrapperColumn) => (
                  <Table.ColumnHeaderCell key={column.id} justify={column.justify}>
                    {column.header}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.rows.map((row: TableWrapperRow) => (
                <Table.Row key={row.id} align={row.align} data-state={row.selected ? 'selected' : undefined}>
                  {data.columns.map((column: TableWrapperColumn) => {
                    // Primitive table composition only supports display-ready values.
                    // Complex renderer objects intentionally won't match wrapper rendering here.
                    const value = row.values[column.id] as React.ReactNode

                    if (column.rowHeader) {
                      return (
                        <Table.RowHeaderCell key={column.id} justify={column.justify}>
                          {value}
                        </Table.RowHeaderCell>
                      )
                    }

                    return (
                      <Table.Cell key={column.id} justify={column.justify}>
                        {value}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: args => (
    <div className="flex w-[960px] flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Text as="div" size="sm" weight="medium" color="neutral">
            size="{size}"
          </Text>
          <TableWrapper {...args} size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Hierarchical: Story = {
  args: {
    data: hierarchicalData,
    expandAll: true,
  },
  render: args => (
    <div className="w-[960px] space-y-3">
      <div>
        <div className="text-base font-semibold">Hierarchical rows + sorting</div>
        <div className="text-sm text-muted-foreground">
          TanStack-backed wrapper with expandable sub-rows and sortable headers.
        </div>
      </div>
      <TableWrapper key={String(args.size ?? 'sm')} {...args} />
    </div>
  ),
}

export const GroupedRows: Story = {
  args: {
    data: wrapperData,
    groupBy: ['plan'],
    expandAll: true,
  },
  render: args => (
    <div className="w-[960px] space-y-3">
      <div>
        <div className="text-base font-semibold">Grouped rows</div>
        <div className="text-sm text-muted-foreground">
          Flat data grouped by a shared column definition and rendered through the tree-capable path.
        </div>
      </div>
      <TableWrapper key={String(args.size ?? 'sm')} {...args} />
    </div>
  ),
}

export const PresentationControls: Story = {
  args: {
    data: wrapperData,
  },
  render: args => {
    const [engine, setEngine] = React.useState<TableEngine>('basic')
    const [shape, setShape] = React.useState<TableShape>('flat')
    const [grouping, setGrouping] = React.useState('none')
    const groupBy = grouping === 'none' ? [] : [grouping]
    const resolvedShape: TableShape = groupBy.length > 0 ? 'tree' : shape
    const tableSize = typeof args.size === 'string' ? args.size : 'sm'

    const handleEngineChange = (value: string) => {
      const nextEngine = value as TableEngine
      setEngine(nextEngine)
      if (nextEngine === 'virtual') {
        setGrouping('none')
        setShape('flat')
      }
    }

    const handleShapeChange = (value: string) => {
      const nextShape = value as TableShape
      setShape(nextShape)
      if (nextShape === 'tree') {
        setEngine('basic')
      }
    }

    const handleGroupingChange = (value: string) => {
      setGrouping(value)
      if (value !== 'none') {
        setEngine('basic')
        setShape('tree')
      }
    }

    return (
      <div className="w-[960px] space-y-3">
        <div>
          <div className="text-base font-semibold">Presentation controls</div>
          <div className="text-sm text-muted-foreground">
            Shared columns drive basic and virtual engines; grouping routes through the tree-capable presentation.
          </div>
        </div>
        <TableShell
          className="h-[460px]"
          footer={
            <Flex align="center" justify="between" gap="4" className="flex-wrap px-4 py-3">
              <Flex align="center" gap="2">
                <Text size="xs" color="neutral">
                  Engine
                </Text>
                <SegmentedControl.Root size="sm" value={engine} onValueChange={handleEngineChange}>
                  <SegmentedControl.Item value="basic">Basic</SegmentedControl.Item>
                  <SegmentedControl.Item value="virtual">Virtual</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Flex>
              <Flex align="center" gap="2">
                <Text size="xs" color="neutral">
                  Shape
                </Text>
                <SegmentedControl.Root size="sm" value={resolvedShape} onValueChange={handleShapeChange}>
                  <SegmentedControl.Item value="flat">Flat</SegmentedControl.Item>
                  <SegmentedControl.Item value="tree">Tree</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Flex>
              <Flex align="center" gap="2">
                <Text size="xs" color="neutral">
                  Group
                </Text>
                <SegmentedControl.Root size="sm" value={grouping} onValueChange={handleGroupingChange}>
                  <SegmentedControl.Item value="none">None</SegmentedControl.Item>
                  <SegmentedControl.Item value="plan">Plan</SegmentedControl.Item>
                  <SegmentedControl.Item value="status">Status</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Flex>
            </Flex>
          }
        >
          <TableView
            key={`${engine}-${resolvedShape}-${grouping}`}
            columns={presentationColumns}
            data={presentationRows}
            engine={engine}
            shape={resolvedShape}
            groupBy={groupBy}
            expandAll={groupBy.length > 0}
            getRowId={row => row.id}
            size={tableSize}
            variant={args.variant}
            totalRows={presentationRows.length}
            className="h-full min-h-0"
          />
        </TableShell>
      </div>
    )
  },
}

export const CellRenderers: Story = {
  args: {
    data: rendererData,
  },
  render: args => {
    const [data, setData] = React.useState<TableWrapper.Data>(rendererData)
    const [editable, setEditable] = React.useState(true)
    const [compact, setCompact] = useArgState(Boolean(args.compact))
    const tableSize = getCompactTableSize(compact)

    return (
      <div className="w-[1120px] space-y-3">
        <div>
          <div className="text-base font-semibold">Column renderers</div>
          <div className="text-sm text-muted-foreground">
            Renderer defaults live in the column definitions instead of ad hoc `renderCell` logic.
          </div>
        </div>
        <TableShell
          footer={
            <Flex align="center" justify="end" gap="4" className="px-4 py-3">
              <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Switch size="xs" checked={editable} onCheckedChange={setEditable} aria-label="Toggle editing" />
                Editable
              </Label>
              <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Switch size="xs" checked={compact} onCheckedChange={setCompact} aria-label="Toggle compact" />
                Compact
              </Label>
            </Flex>
          }
        >
          <TableWrapper
            key={`${tableSize}-${compact ? 'compact' : 'comfortable'}`}
            {...args}
            size={tableSize}
            compact={compact}
            data={data}
            onCellEdit={
              editable
                ? ({ rowId, columnId, value }) => {
                    setData(current => ({
                      ...current,
                      rows: current.rows.map(row =>
                        row.id === rowId ? { ...row, values: { ...row.values, [columnId]: value } } : row,
                      ),
                    }))
                  }
                : undefined
            }
          />
        </TableShell>
      </div>
    )
  },
}

export const CellRenderersAllSizes: Story = {
  args: {
    data: rendererData,
  },
  render: args => (
    <div className="flex w-[1120px] flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Text as="div" size="sm" weight="medium" color="neutral">
            size="{size}"
          </Text>
          <TableWrapper {...args} size={size} />
        </div>
      ))}
    </div>
  ),
}

export const PriorityCells: Story = {
  args: {
    data: rendererData,
  },
  render: args => (
    <div className="w-[1120px] space-y-3">
      <div>
        <div className="text-base font-semibold">Priority cells</div>
        <div className="text-sm text-muted-foreground">
          `Priority` renders icon plus label, `Pri` renders icon-only, and `Severity` renders a filled priority label.
        </div>
      </div>
      <TableWrapper key={String(args.size ?? 'sm')} {...args} />
    </div>
  ),
}

export const SharedCellRenderersPaginated: Story = {
  render: args => {
    const pageSize = 6
    const [page, setPage] = React.useState(1)
    const [compact, setCompact] = useArgState(Boolean(args.compact))
    const tableSize = getCompactTableSize(compact)
    const totalPages = Math.ceil(paginatedRendererData.rows.length / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data: TableWrapper.Data = {
      ...paginatedRendererData,
      rows: paginatedRendererData.rows.slice(start, end),
    }

    return (
      <div className="w-full max-w-[1120px] space-y-3">
        <div>
          <div className="text-base font-semibold">Shared cell renderers with pagination</div>
          <div className="text-sm text-muted-foreground">
            Basic table uses the shared renderer contract with discrete pages instead of a scrolling viewport.
          </div>
        </div>
        <TableShell
          footer={
            <Flex align="center" justify="between" gap="4" className="px-4 py-3">
              <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  size="xs"
                  checked={compact}
                  onCheckedChange={setCompact}
                  aria-label="Toggle compact table spacing"
                />
                Compact
              </Label>
              <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} size={tableSize} />
            </Flex>
          }
        >
          <TableWrapper
            key={`${tableSize}-${page}-${compact ? 'compact' : 'comfortable'}`}
            {...args}
            size={tableSize}
            compact={compact}
            data={data}
          />
        </TableShell>
      </div>
    )
  },
}

export const EditableCells: Story = {
  args: {
    data: editableWrapperData,
    gridLines: true,
  },
  render: args => {
    const [data, setData] = React.useState<TableWrapper.Data>(editableWrapperData)
    const [editable, setEditable] = React.useState(true)
    const nextDuplicateId = React.useRef(1)
    const [compact, setCompact] = useArgState(Boolean(args.compact))
    const tableSize = getCompactTableSize(compact)

    return (
      <div className="w-full max-w-[960px] space-y-3">
        <div>
          <div className="text-base font-semibold">Editable cell mode primitive</div>
          <div className="text-sm text-muted-foreground">
            Cells render read-first. Click, Enter, or F2 edits; Escape cancels; Enter or blur commits.
          </div>
        </div>
        <TableShell
          footer={
            <Flex align="center" justify="end" gap="4" className="px-4 py-3">
              <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Switch size="xs" checked={editable} onCheckedChange={setEditable} aria-label="Toggle editing" />
                Editable
              </Label>
              <Label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  size="xs"
                  checked={compact}
                  onCheckedChange={setCompact}
                  aria-label="Toggle compact table spacing"
                />
                Compact
              </Label>
            </Flex>
          }
        >
          <TableWrapper
            key={`${tableSize}-${compact ? 'compact' : 'comfortable'}`}
            {...args}
            size={tableSize}
            compact={compact}
            data={data}
            onCellEdit={
              editable
                ? ({ rowId, columnId, value }) => {
                    setData(current => ({
                      ...current,
                      rows: current.rows.map(row =>
                        row.id === rowId
                          ? {
                              ...row,
                              values: {
                                ...row.values,
                                [columnId]: value,
                              },
                            }
                          : row,
                      ),
                    }))
                  }
                : undefined
            }
            rowActions={{
              labels: { duplicate: 'Duplicate row', remove: 'Delete row' },
              onDuplicate: row => {
                const duplicateId = `${row.id}-duplicate-${nextDuplicateId.current++}`
                setData(current => {
                  const index = current.rows.findIndex(item => item.id === row.id)
                  const duplicate = {
                    ...row,
                    id: duplicateId,
                    values: {
                      ...row.values,
                      service: `${String(row.values.service ?? 'Service')} copy`,
                    },
                  }
                  if (index < 0) return { ...current, rows: [...current.rows, duplicate] }
                  return {
                    ...current,
                    rows: [...current.rows.slice(0, index + 1), duplicate, ...current.rows.slice(index + 1)],
                  }
                })
              },
              onRemove: row => {
                setData(current => ({ ...current, rows: current.rows.filter(item => item.id !== row.id) }))
              },
            }}
          />
        </TableShell>
      </div>
    )
  },
}
