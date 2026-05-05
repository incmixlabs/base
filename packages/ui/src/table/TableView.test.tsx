import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { TableColumnDef } from './shared/table-column-def'
import { TableView } from './TableView'

type ServiceRow = {
  id: string
  service: string
  status: string
  quantity: number
  subRows?: ServiceRow[]
}

const rows: ServiceRow[] = [
  {
    id: 'premium',
    service: 'Premium support',
    status: 'Active',
    quantity: 2,
    subRows: [{ id: 'training', service: 'Training', status: 'Active', quantity: 1 }],
  },
  { id: 'implementation', service: 'Implementation', status: 'Paused', quantity: 1 },
]

const columns: TableColumnDef<ServiceRow>[] = [
  { id: 'service', header: 'Service', accessorKey: 'service', rowHeader: true },
  { id: 'status', header: 'Status', accessorKey: 'status' },
  { id: 'quantity', header: 'Qty', accessorKey: 'quantity', format: { align: 'right' } },
]

describe('TableView', () => {
  afterEach(() => cleanup())

  it('renders the basic flat engine from shared column definitions', () => {
    render(<TableView columns={columns} data={rows} getRowId={row => row.id} shape="flat" />)

    expect(screen.getByText('Premium support')).toBeInTheDocument()
    expect(screen.getByText('Implementation')).toBeInTheDocument()
  })

  it('groups rows through the tree-capable presentation path', () => {
    render(<TableView columns={columns} data={rows} getRowId={row => row.id} groupBy={['status']} />)

    expect(screen.getAllByText('Active')).toHaveLength(3)
    expect(screen.getByText('Premium support')).toBeInTheDocument()
  })

  it('honors flat shape for grouped rows', () => {
    render(<TableView columns={columns} data={rows} getRowId={row => row.id} groupBy={['status']} shape="flat" />)

    expect(screen.queryByLabelText('Expand group:status:Active')).not.toBeInTheDocument()
    expect(screen.getByText('Premium support')).toBeInTheDocument()
    expect(screen.getByText('Implementation')).toBeInTheDocument()
  })

  it('routes virtual flat through the same shared columns', () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <TableView columns={columns} data={rows} getRowId={row => row.id} engine="virtual" shape="flat" />
      </div>,
    )

    expect(screen.getByRole('columnheader', { name: /Service/i })).toBeInTheDocument()
    expect(screen.getByText('2 rows')).toBeInTheDocument()
  })

  it('routes virtual tree independently from the engine selection', () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <TableView
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          engine="virtual"
          shape="tree"
        />
      </div>,
    )

    expect(screen.getByRole('columnheader', { name: /Service/i })).toBeInTheDocument()
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('scopes fallback row ids across nested levels', () => {
    type FallbackRow = {
      service: string
      status: string
      quantity: number
      subRows?: FallbackRow[]
    }

    const fallbackColumns: TableColumnDef<FallbackRow>[] = [
      { id: 'service', header: 'Service', accessorKey: 'service', rowHeader: true },
      { id: 'status', header: 'Status', accessorKey: 'status' },
      { id: 'quantity', header: 'Qty', accessorKey: 'quantity' },
    ]
    const fallbackRows: FallbackRow[] = [
      {
        service: 'Parent A',
        status: 'Active',
        quantity: 1,
        subRows: [
          {
            service: 'Child A',
            status: 'Active',
            quantity: 1,
            subRows: [{ service: 'Leaf A', status: 'Active', quantity: 1 }],
          },
        ],
      },
      {
        service: 'Parent B',
        status: 'Paused',
        quantity: 1,
        subRows: [
          {
            service: 'Child B',
            status: 'Paused',
            quantity: 1,
            subRows: [{ service: 'Leaf B', status: 'Paused', quantity: 1 }],
          },
        ],
      },
    ]

    render(<TableView columns={fallbackColumns} data={fallbackRows} getSubRows={row => row.subRows} shape="tree" />)

    fireEvent.click(screen.getByLabelText('Expand row-0'))
    fireEvent.click(screen.getByLabelText('Expand row-1'))

    expect(screen.getByLabelText('Expand row-0.row-0')).toBeInTheDocument()
    expect(screen.getByLabelText('Expand row-1.row-0')).toBeInTheDocument()
  })

  it('leaves caller-provided row ids unscoped', () => {
    const nestedRows: ServiceRow[] = [
      {
        id: 'parent',
        service: 'Parent',
        status: 'Active',
        quantity: 1,
        subRows: [
          {
            id: 'child',
            service: 'Child',
            status: 'Active',
            quantity: 1,
            subRows: [{ id: 'leaf', service: 'Leaf', status: 'Active', quantity: 1 }],
          },
        ],
      },
    ]

    render(
      <TableView
        columns={columns}
        data={nestedRows}
        getRowId={row => row.id}
        getSubRows={row => row.subRows}
        shape="tree"
      />,
    )

    fireEvent.click(screen.getByLabelText('Expand parent'))

    expect(screen.getByLabelText('Expand child')).toBeInTheDocument()
    expect(screen.queryByLabelText('Expand parent.child')).not.toBeInTheDocument()
  })
})
