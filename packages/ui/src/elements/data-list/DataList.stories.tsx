import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/elements/badge/Badge'
import { IconButton } from '@/elements/button/IconButton'
import { Flex } from '@/layouts/flex/Flex'
import { Code } from '@/typography/code/Code'
import { Link } from '@/typography/link/Link'
import { EmbeddedResponsiveShell, EmbeddedResponsiveTabs } from '@/typography/storybook/embedded-responsive-preview'
import { DataList } from './DataList'
import { dataListPropDefs } from './data-list.props'

const meta = {
  title: 'Elements/Data List',
  component: DataList.Root,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DataList.Root>

export default meta

type Story = StoryObj<typeof DataList.Root>

export const Playground: Story = {
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [...dataListPropDefs.Root.size.values],
    },
    orientation: {
      control: { type: 'radio' },
      options: [...dataListPropDefs.Root.orientation.values],
    },
    trim: {
      control: { type: 'select' },
      options: [...dataListPropDefs.Root.trim.values],
    },
  },
  args: {
    size: 'sm',
    orientation: 'horizontal',
    trim: 'normal',
  },
  render: args => (
    <DataList.Root {...args} className="w-[420px]">
      <DataList.Item>
        <DataList.Label>ID</DataList.Label>
        <DataList.Value>srv_2f91a</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>Healthy</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Owner</DataList.Label>
        <DataList.Value>Platform</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <DataList.Root size="md" className="w-[460px]">
      <DataList.Item>
        <DataList.Label width="128px">Environment</DataList.Label>
        <DataList.Value>Production</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label width="128px">Cluster</DataList.Label>
        <DataList.Value>west-control-3</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label width="128px">Release</DataList.Label>
        <DataList.Value>2026.04.13</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="w-[320px] rounded-xl border p-4">
      <DataList.Root orientation="vertical" size="sm" trim="both">
        {dataListPropDefs.Item.align.values.map(align => (
          <DataList.Item key={align} align={align}>
            <DataList.Label>{align}</DataList.Label>
            <DataList.Value>{align} alignment</DataList.Value>
          </DataList.Item>
        ))}
      </DataList.Root>
    </div>
  ),
}

export const ResponsiveSizes: Story = {
  render: () => (
    <EmbeddedResponsiveTabs
      renderContent={({ width }) => (
        <div className="space-y-3 pt-4">
          <div className="text-sm font-medium text-foreground">Preview width: {width}px</div>
          <EmbeddedResponsiveShell width={width}>
            <DataList.Root size={{ initial: 'sm', md: 'lg' }}>
              <DataList.Item>
                <DataList.Label minWidth="96px">Viewport</DataList.Label>
                <DataList.Value>Small at the base breakpoint, large from md upward.</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="96px">Typography</DataList.Label>
                <DataList.Value>Root spacing and text scale switch together.</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </EmbeddedResponsiveShell>
        </div>
      )}
    />
  ),
}

export const RecordSummary: Story = {
  render: () => (
    <DataList.Root size="sm" className="w-[460px]">
      <DataList.Item align="center">
        <DataList.Label minWidth="88px">Status</DataList.Label>
        <DataList.Value>
          <Badge color="success" variant="soft" radius="full">
            Authorized
          </Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">ID</DataList.Label>
        <DataList.Value>
          <Flex align="center" gap="2">
            <Code variant="ghost">u_2J89JSA4GJ</Code>
            <IconButton size="xs" aria-label="Copy value" color="neutral" variant="ghost" icon="copy" />
          </Flex>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Name</DataList.Label>
        <DataList.Value>Vlad Moroz</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Email</DataList.Label>
        <DataList.Value>
          <Link href="mailto:vlad@workos.com">vlad@workos.com</Link>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Company</DataList.Label>
        <DataList.Value>
          <Link href="https://workos.com" target="_blank" rel="noreferrer">
            WorkOS
          </Link>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  ),
}
