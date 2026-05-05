import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Badge, Button, Icon, IconButton } from '@/elements'
import { getControlSizeValues } from '@/elements/control-size'
import { Column, Row } from '@/layouts/flex/Flex'
import { Table } from '@/table'
import { Text } from '@/typography'

const scaleSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const badgeSizes = new Set<string>(['xs', 'sm', 'md'])
const tableSizes = new Set<string>(['xs', 'sm', 'md', 'lg'])

type ScaleSize = (typeof scaleSizes)[number]

const meta = {
  title: 'Theme/Size Scale',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function SizeTable({ size }: { size: Exclude<ScaleSize, 'xl'> }) {
  return (
    <Table.Root size={size} variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell justify="end">Count</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.RowHeaderCell>{size}</Table.RowHeaderCell>
          <Table.Cell justify="end">128</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}

function MeasuredButton({ size }: { size: ScaleSize }) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [metrics, setMetrics] = React.useState<string>('')
  const token = getControlSizeValues(size)

  React.useLayoutEffect(() => {
    const element = buttonRef.current
    if (!element) return

    const styles = window.getComputedStyle(element)
    setMetrics(
      `token ${token.height} / ${token.paddingX} / ${token.fontSize}; computed ${styles.height} / ${styles.paddingInline} / ${styles.fontSize}`,
    )
  }, [size, token.fontSize, token.height, token.paddingX])

  return (
    <Column align="start" gap="1">
      <Button ref={buttonRef} size={size} variant="solid" color="primary" iconStart="sparkles">
        Button
      </Button>
      <Text size="xs" color="neutral">
        {metrics}
      </Text>
    </Column>
  )
}

function SizeRow({ size }: { size: ScaleSize }) {
  const hasBadge = badgeSizes.has(size)
  const hasTable = tableSizes.has(size)

  return (
    <Column gap="3">
      <Text size="sm" weight="medium" color="neutral">
        size="{size}"
      </Text>
      <Row align="center" gap="4" wrap="wrap">
        <Text size={size}>Text</Text>
        <Icon size={size} icon="sparkles" color="primary" title={`Icon ${size}`} />
        <MeasuredButton size={size} />
        <IconButton size={size} icon="sparkles" color="primary" aria-label={`Icon button ${size}`} />
        {hasBadge ? (
          <Badge size={size as 'xs' | 'sm' | 'md'} color="primary" icon="sparkles">
            Badge
          </Badge>
        ) : (
          <Text size="xs" color="neutral">
            Badge supports xs-md
          </Text>
        )}
      </Row>
      {hasTable ? (
        <div style={{ maxWidth: 360 }}>
          <SizeTable size={size as Exclude<ScaleSize, 'xl'>} />
        </div>
      ) : (
        <Text size="xs" color="neutral">
          Table supports xs-lg
        </Text>
      )}
    </Column>
  )
}

export const Components: Story = {
  render: () => (
    <Column gap="5" p="5" style={{ maxWidth: 1120 }}>
      <Column gap="1">
        <Text size="lg" weight="bold">
          Component Size Scale
        </Text>
        <Text size="sm" color="neutral">
          Text, icons, buttons, badges, and tables rendered together against the shared size scale.
        </Text>
      </Column>
      <Column gap="6">
        {scaleSizes.map(size => (
          <SizeRow key={size} size={size} />
        ))}
      </Column>
    </Column>
  ),
}
