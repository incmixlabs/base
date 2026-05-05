import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { togglePropDefs } from '@/elements/toggle/toggle.props'
import { SemanticColor, semanticColorKeys } from '@/theme/props/color.prop'
import { selectArgType } from '@/theme/props/storybook'
import { TablePagination } from './TablePagination'
import { tablePaginationPropDefs } from './table-pagination.props'

const meta = {
  title: 'Table/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'centered',
  },
  args: {
    page: 2,
    totalPages: 5,
    onPageChange: () => {},
    siblingCount: 1,
    size: 'md',
    variant: 'soft',
    color: SemanticColor.slate,
    radius: 'full',
    flush: false,
    highContrast: false,
    disabled: false,
    showBoundary: true,
    prevLabel: undefined,
    nextLabel: undefined,
  },
  argTypes: {
    size: selectArgType(tablePaginationPropDefs.size),
    variant: selectArgType(togglePropDefs.variant),
    color: {
      control: { type: 'select' },
      options: semanticColorKeys,
    },
    radius: selectArgType(tablePaginationPropDefs.radius),
    flush: { control: 'boolean' },
    highContrast: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showBoundary: { control: 'boolean' },
    prevLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    page: { control: { type: 'number' } },
    totalPages: { control: { type: 'number' } },
    siblingCount: { control: { type: 'number' } },
  },
} satisfies Meta<typeof TablePagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: args => {
    const [page, setPage] = React.useState(args.page)
    return <TablePagination {...args} page={page} onPageChange={setPage} />
  },
}

export const Default: Story = {
  render: args => {
    const [page, setPage] = React.useState(2)
    return <TablePagination {...args} page={page} totalPages={5} onPageChange={setPage} />
  },
}

export const ManyPages: Story = {
  render: args => {
    const [page, setPage] = React.useState(8)
    return <TablePagination {...args} page={page} totalPages={18} onPageChange={setPage} />
  },
}

export const WithLabels: Story = {
  args: {
    prevLabel: 'Previous',
    nextLabel: 'Next',
  },
  render: args => {
    const [page, setPage] = React.useState(2)
    return <TablePagination {...args} page={page} totalPages={5} onPageChange={setPage} />
  },
}

export const WithoutBoundary: Story = {
  args: {
    showBoundary: false,
  },
  render: args => {
    const [page, setPage] = React.useState(2)
    return <TablePagination {...args} page={page} totalPages={5} onPageChange={setPage} />
  },
}

export const Sizes: Story = {
  render: args => {
    return (
      <div className="flex flex-col items-center gap-4">
        {tablePaginationPropDefs.size.values.map(size => (
          <div key={size} className="space-y-2">
            <div className="text-sm text-muted-foreground capitalize">{size}</div>
            <TablePagination {...args} size={size} page={2} totalPages={5} onPageChange={() => {}} />
          </div>
        ))}
      </div>
    )
  },
}
