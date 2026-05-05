import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts'
import { Quote, Text } from '@/typography'

const meta: Meta<typeof Quote> = {
  title: 'Typography/Quote',
  component: Quote,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate text with ellipsis',
    },
    wrap: {
      control: 'select',
      options: ['wrap', 'nowrap', 'pretty', 'balance'],
      description: 'Text wrapping behavior',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  args: {
    children: 'Styles come and go. Good design is a language, not a style.',
  },
}

// Inline Usage
export const InlineUsage: Story = {
  render: () => (
    <Text size="md">
      His famous quote, <Quote>Styles come and go. Good design is a language, not a style</Quote>, elegantly sums up
      Massimo's philosophy of design.
    </Text>
  ),
}

// Multiple Quotes
export const MultipleQuotes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Text size="md">
        As Steve Jobs said, <Quote>Design is not just what it looks like. Design is how it works.</Quote>
      </Text>
      <Text size="md">
        Leonardo da Vinci believed that <Quote>Simplicity is the ultimate sophistication.</Quote>
      </Text>
      <Text size="md">
        Alan Kay once noted, <Quote>The best way to predict the future is to invent it.</Quote>
      </Text>
    </Box>
  ),
}

// Truncation
export const Truncation: Story = {
  render: () => (
    <Box className="max-w-xs">
      <Text size="md">
        The designer said{' '}
        <Quote truncate>
          The goal of typography is to relate font size, line height, and line width in a proportional way that
          maximizes beauty and makes reading easier
        </Quote>{' '}
        during the interview.
      </Text>
    </Box>
  ),
}
