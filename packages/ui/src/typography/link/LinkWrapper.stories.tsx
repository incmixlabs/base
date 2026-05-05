import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '@/elements/tabs/Tabs'
import { Box } from '@/layouts/box/Box'
import { LinkWrapper } from './LinkWrapper'

const data = [
  { id: 'tokens', label: 'Tokens', href: '/docs/tokens', color: 'primary' as const },
  { id: 'theme', label: 'Theme', href: '/docs/theming', color: 'accent' as const },
  { id: 'api', label: 'API Wrappers', href: '/docs/api/wrappers/menu', color: 'info' as const },
]

const meta = {
  title: 'Typography/LinkWrapper',
  component: LinkWrapper,
  parameters: {
    layout: 'padded',
  },
  args: {
    data,
    direction: 'column',
    gap: '2',
  },
} satisfies Meta<typeof LinkWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Row: Story = {
  args: {
    direction: 'row',
    gap: '4',
  },
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    const previewWidths = {
      wide: 1040,
      medium: 720,
      narrow: 360,
    } as const

    return (
      <Tabs.Root defaultValue="wide">
        <Tabs.List>
          <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
          <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
          <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
        </Tabs.List>

        {Object.entries(previewWidths).map(([viewport, width]) => (
          <Tabs.Content key={viewport} value={viewport}>
            <Box
              style={{
                width,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-4)',
                padding: '1rem',
              }}
            >
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Expected gap: 8px below container sm (560px), 16px at sm and above.
              </p>
              <LinkWrapper data={data} direction="row" gap={{ initial: '2', sm: '4' }} />
            </Box>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    )
  },
}
