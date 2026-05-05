import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card } from '@/elements'
import { Flex } from '@/layouts'
import { Text } from '@/typography'
import { LiveCodeBlock } from './LiveCodeBlock'

const meta: Meta<typeof LiveCodeBlock> = {
  title: 'Editor/LiveCodeBlock',
  component: LiveCodeBlock,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof LiveCodeBlock>

const initialCode = `
<div style={{ padding: 16, border: '1px solid var(--color-neutral-border)', borderRadius: 8 }}>
  <strong>Preview</strong>
  <p>Use the extra tabs to inspect scroll behavior.</p>
</div>
`

const logItems = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  label: `Runtime event ${String(index + 1).padStart(2, '0')}`,
}))

function SimpleScrollTab() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <Flex direction="column" gap="2">
        {logItems.map(item => (
          <div key={item.id} className="rounded-md border border-[var(--color-neutral-border)] px-3 py-2">
            <Text size="sm" weight="medium">
              {item.label}
            </Text>
            <Text as="div" size="xs" color="slate" mt="1">
              This tab scrolls as one simple content region.
            </Text>
          </div>
        ))}
      </Flex>
    </div>
  )
}

function FixedHeaderFooterTab() {
  return (
    <Card.Root
      size="sm"
      variant="surface"
      color="light"
      radius="none"
      className="flex h-full min-h-0 flex-col border-0"
    >
      <Card.Header className="shrink-0">
        <Card.Title as="h4">Structured tab</Card.Title>
        <Card.Description>Only the middle content area scrolls.</Card.Description>
      </Card.Header>
      <Card.Content className="min-h-0 flex-1 overflow-y-auto">
        <Flex direction="column" gap="3">
          {logItems.map(item => (
            <div key={item.id} className="rounded-md border border-[var(--color-neutral-border)] px-3 py-2">
              <Text size="sm" weight="medium">
                {item.label}
              </Text>
              <Text as="div" size="xs" color="slate" mt="1">
                Header and footer remain fixed while this section scrolls.
              </Text>
            </div>
          ))}
        </Flex>
      </Card.Content>
      <Card.Footer className="shrink-0 justify-end pb-1">
        <Button size="sm" variant="outline" color="slate">
          Cancel
        </Button>
        <Button size="sm">Apply</Button>
      </Card.Footer>
    </Card.Root>
  )
}

export const ExtraTabLayouts: Story = {
  render: () => (
    <div className="box-border flex h-screen min-h-0 flex-col overflow-hidden bg-background p-6">
      <LiveCodeBlock
        className="mt-0 min-h-0 flex-1"
        initialCode={initialCode}
        extraTabs={[
          {
            value: 'simple-scroll',
            label: 'Simple Scroll',
            content: <SimpleScrollTab />,
          },
          {
            value: 'fixed-actions',
            label: 'Fixed Actions',
            content: <FixedHeaderFooterTab />,
          },
        ]}
      />
    </div>
  ),
}
