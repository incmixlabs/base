import { Blockquote, Code, Em, Heading, Quote, Strong, Text } from '@incmix/ui/typography'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Typography/Overview',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

export const Showcase: Story = {
  name: 'Showcase',
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Heading mb="2" size="2x">
          Typography Showcase
        </Heading>
        <Text size="md" color="neutral">
          A demonstration of the typography components based on Radix UI Themes.
        </Text>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Headings
        </Heading>
        <div className="space-y-2">
          <Heading size="5x">Size 5x Heading</Heading>
          <Heading size="4x">Size 4x Heading</Heading>
          <Heading size="3x">Size 3x Heading</Heading>
          <Heading size="2x">Size 2x Heading</Heading>
          <Heading size="xl">Size xl Heading</Heading>
          <Heading size="lg">Size lg Heading</Heading>
          <Heading size="md">Size md Heading</Heading>
          <Heading size="sm">Size sm Heading</Heading>
          <Heading size="xs">Size xs Heading</Heading>
        </div>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Text Sizes
        </Heading>
        <div className="space-y-2">
          <Text size="5x">Text size 5x</Text>
          <Text size="4x">Text size 4x</Text>
          <Text size="3x">Text size 3x</Text>
          <Text size="2x">Text size 2x</Text>
          <Text size="xl">Text size xl</Text>
          <Text size="lg">Text size lg</Text>
          <Text size="md">Text size md</Text>
          <Text size="sm">Text size sm</Text>
          <Text size="xs">Text size xs</Text>
        </div>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Weights
        </Heading>
        <div className="space-y-1">
          <Text size="md" weight="light">
            Light weight text
          </Text>
          <Text size="md" weight="regular">
            Regular weight text
          </Text>
          <Text size="md" weight="medium">
            Medium weight text
          </Text>
          <Text size="md" weight="bold">
            Bold weight text
          </Text>
        </div>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Colors
        </Heading>
        <div className="space-y-1">
          <Text size="md" color="slate">
            Slate color text
          </Text>
          <Text size="md" color="info">
            Info color text
          </Text>
          <Text size="md" color="success">
            Success color text
          </Text>
          <Text size="md" color="warning">
            Warning color text
          </Text>
          <Text size="md" color="error">
            Error color text
          </Text>
        </div>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Inline Elements
        </Heading>
        <Text size="md">
          The <Em>most</Em> important thing to remember is <Strong>stay positive</Strong>. Use <Code>inline code</Code>{' '}
          when needed.
        </Text>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Code Examples
        </Heading>
        <div className="space-y-2">
          <Code variant="soft">npm install @incmix/ui</Code>
          <Code variant="solid">const value = "example";</Code>
          <Code variant="outline">git commit -m "feat: add typography"</Code>
          <Code variant="ghost">console.log("Hello World")</Code>
        </div>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Inline Quotes
        </Heading>
        <Text size="md">
          As Massimo Vignelli said, <Quote>Styles come and go. Good design is a language, not a style</Quote>, which
          elegantly sums up his philosophy.
        </Text>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Blockquotes
        </Heading>
        <Blockquote size="md">
          Typography is the craft of endowing human language with a durable visual form, and thus with an independent
          existence.
        </Blockquote>
        <Blockquote size="sm" color="info" className="mt-4">
          Good typography is invisible. Bad typography is everywhere.
        </Blockquote>
      </div>

      <div>
        <Heading mb="2" size="lg">
          Typographic Principles
        </Heading>
        <Text size="md">
          The <Em>most</Em> important thing to remember is <Strong>stay positive</Strong>. Typography should enhance
          readability and create visual hierarchy. Use consistent spacing and alignment to create a cohesive design.
        </Text>
      </div>
    </div>
  ),
}
