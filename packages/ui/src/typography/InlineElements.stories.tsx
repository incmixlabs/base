import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts'
import { Em, Strong, Text } from '@/typography'

const meta: Meta = {
  title: 'Typography/Inline Elements',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Em (Emphasis/Italic)
export const Emphasis: Story = {
  name: 'Em (Emphasis)',
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Text size="md">
        The <Em>most important</Em> thing to remember is consistency.
      </Text>
      <Text size="lg">
        <Em>Emphasis</Em> is used to stress a word or phrase.
      </Text>
      <Text size="md">
        Use emphasis for <Em>technical terms</Em>, <Em>foreign words</Em>, or <Em>titles of works</Em>.
      </Text>
    </Box>
  ),
}

// Strong (Bold)
export const Bold: Story = {
  name: 'Strong (Bold)',
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Text size="md">
        <Strong>Warning:</Strong> This action cannot be undone.
      </Text>
      <Text size="lg">
        The <Strong>key takeaway</Strong> from this article is simplicity.
      </Text>
      <Text size="md">
        Use strong for <Strong>important information</Strong> that needs to stand out.
      </Text>
    </Box>
  ),
}

// Combined Usage
export const CombinedUsage: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-lg">
      <Text size="md">
        The <Em>most</Em> <Strong>important</Strong> thing to remember is that
        <Strong> good typography</Strong> makes content <Em>readable</Em> and <Em>accessible</Em>.
      </Text>

      <Text size="md">
        <Strong>Note:</Strong> You can combine <Em>emphasis</Em> and <Strong>strong</Strong> elements, and even nest
        them:{' '}
        <Strong>
          <Em>important and emphasized</Em>
        </Strong>
        .
      </Text>

      <Text size="md">
        When writing documentation, use <Strong>bold</Strong> for <Strong>warnings</Strong> and{' '}
        <Strong>key terms</Strong>, and use <Em>italics</Em> for <Em>emphasis</Em> and <Em>technical terms</Em>.
      </Text>
    </Box>
  ),
}

// In Different Text Sizes
export const InDifferentSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-3">
      <Text size="xs">
        Small text with <Strong>bold</Strong> and <Em>italic</Em>
      </Text>
      <Text size="sm">
        Text size sm with <Strong>bold</Strong> and <Em>italic</Em>
      </Text>
      <Text size="md">
        Text size md with <Strong>bold</Strong> and <Em>italic</Em>
      </Text>
      <Text size="lg">
        Text size lg with <Strong>bold</Strong> and <Em>italic</Em>
      </Text>
      <Text size="xl">
        Text size xl with <Strong>bold</Strong> and <Em>italic</Em>
      </Text>
    </Box>
  ),
}
