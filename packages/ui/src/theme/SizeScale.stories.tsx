import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Badge, Button, Icon, IconButton } from '@/elements'
import { getControlSizeValues } from '@/elements/control-size'
import { Column, Row } from '@/layouts/flex/Flex'
import { Text } from '@/typography'

const scaleSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const badgeSizes = new Set<string>(['xs', 'sm', 'md'])

type ScaleSize = (typeof scaleSizes)[number]

const meta = {
  title: 'Theme/Size Scale',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

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
          Text, icons, buttons, and badges rendered together against the shared size scale.
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
