import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/elements/badge/Badge'
import { selectArgType } from '@/theme/props/storybook'
import type { TableRootProps } from './Table'
import { Table } from './Table'
import { tablePropDefs } from './table.props'

const meta = {
  title: 'Table/Table',
  component: Table.Root,
  parameters: {
    layout: 'centered',
  },
  args: {
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
  },
} satisfies Meta<TableRootProps>

export default meta
type Story = StoryObj<TableRootProps>

function renderBasic(args: TableRootProps) {
  return (
    <div className="w-[760px] space-y-3">
      <div>
        <div className="text-base font-semibold">Customer Revenue</div>
        <div className="text-sm text-muted-foreground">Pipeline snapshot for active accounts.</div>
      </div>
      <Table.Root {...args}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">MRR</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Alex Morgan</Table.RowHeaderCell>
            <Table.Cell>alex@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$1,200</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="success">
                Active
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Sam Lee</Table.RowHeaderCell>
            <Table.Cell>sam@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$980</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="warning">
                Trial
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Jordan Chen</Table.RowHeaderCell>
            <Table.Cell>jordan@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$2,140</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="info">
                Enterprise
              </Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export const Basic: Story = {
  render: renderBasic,
}

export const GhostVariant: Story = {
  args: {
    variant: 'ghost',
  },
  render: args => (
    <div className="w-[760px] space-y-3">
      <div className="text-base font-semibold">Regional Pipeline</div>
      <Table.Root {...args}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Region</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Leads</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">Conversion</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">ARR</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>North America</Table.RowHeaderCell>
            <Table.Cell>482</Table.Cell>
            <Table.Cell justify="end">11.3%</Table.Cell>
            <Table.Cell justify="end">$2.8M</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>EMEA</Table.RowHeaderCell>
            <Table.Cell>336</Table.Cell>
            <Table.Cell justify="end">9.7%</Table.Cell>
            <Table.Cell justify="end">$1.9M</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>APAC</Table.RowHeaderCell>
            <Table.Cell>294</Table.Cell>
            <Table.Cell justify="end">10.1%</Table.Cell>
            <Table.Cell justify="end">$1.4M</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  ),
}

export const SelectedRow: Story = {
  render: args => (
    <div className="w-[760px] space-y-3">
      <div>
        <div className="text-base font-semibold">Selected Row State</div>
        <div className="text-sm text-muted-foreground">Uses `data-state=&quot;selected&quot;` on one row.</div>
      </div>
      <Table.Root {...args}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">MRR</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Alex Morgan</Table.RowHeaderCell>
            <Table.Cell>alex@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$1,200</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="success">
                Active
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row data-state="selected">
            <Table.RowHeaderCell>Sam Lee</Table.RowHeaderCell>
            <Table.Cell>sam@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$980</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="warning">
                Trial
              </Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Jordan Chen</Table.RowHeaderCell>
            <Table.Cell>jordan@autoform.dev</Table.Cell>
            <Table.Cell justify="end">$2,140</Table.Cell>
            <Table.Cell>
              <Badge size="xs" variant="soft" color="info">
                Enterprise
              </Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  ),
}

export const FixedLayout: Story = {
  args: {
    layout: 'fixed',
  },
  render: args => (
    <div className="w-[760px] space-y-3">
      <div className="text-base font-semibold">Support Queue</div>
      <Table.Root {...args}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell width="180px">Ticket</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="220px">Owner</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="120px" justify="end">
              Priority
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>AF-1023</Table.RowHeaderCell>
            <Table.Cell>Ari</Table.Cell>
            <Table.Cell>Improve docs sidebar density rules for mobile nav behavior.</Table.Cell>
            <Table.Cell justify="end">High</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>AF-1038</Table.RowHeaderCell>
            <Table.Cell>Sam</Table.Cell>
            <Table.Cell>Stabilize tooltip wrapper trigger semantics in nested menus.</Table.Cell>
            <Table.Cell justify="end">Medium</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  ),
}

export const AllSizes: Story = {
  render: args => (
    <div className="flex w-[900px] flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <Table.Root key={size} {...args} size={size}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>{size}</Table.RowHeaderCell>
              <Table.Cell>Spacing, min-height, and typography follow VE size tokens.</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      ))}
    </div>
  ),
}

export const StripedRows: Story = {
  args: {
    striped: true,
  },
  render: renderBasic,
}
