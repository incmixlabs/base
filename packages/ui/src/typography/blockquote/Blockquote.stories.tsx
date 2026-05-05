import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Blockquote } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { blockquotePropDefs } from './blockquote.props'

const meta: Meta<typeof Blockquote> = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(blockquotePropDefs.size),
      description: 'The size of the blockquote text',
    },
    weight: {
      control: 'select',
      options: getPropDefValues(blockquotePropDefs.weight),
      description: 'The font weight',
    },
    color: {
      control: 'select',
      options: getPropDefValues(blockquotePropDefs.color),
      description: 'The accent color',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast mode for better accessibility',
    },
    wrap: {
      control: 'select',
      options: getPropDefValues(blockquotePropDefs.wrap),
      description: 'Text wrapping behavior',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate text with ellipsis',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  args: {
    children:
      'Typography is the craft of endowing human language with a durable visual form, and thus with an independent existence.',
    size: 'md',
  },
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-xl">
      <Blockquote size="xs">Size xs blockquote - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote size="sm">Size sm blockquote - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote size="md">Size md blockquote - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote size="lg">Size lg blockquote - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote size="xl">Size xl blockquote - The quick brown fox jumps over the lazy dog.</Blockquote>
    </Box>
  ),
}

// All Colors
export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-xl">
      {getPropDefValues(blockquotePropDefs.color).map(color => (
        <Blockquote key={color} color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)} color - Good design is as little design as possible.
        </Blockquote>
      ))}
    </Box>
  ),
}

// All Weights
export const AllWeights: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-xl">
      <Blockquote weight="light">Light weight - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote weight="regular">Regular weight - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote weight="medium">Medium weight - The quick brown fox jumps over the lazy dog.</Blockquote>
      <Blockquote weight="bold">Bold weight - The quick brown fox jumps over the lazy dog.</Blockquote>
    </Box>
  ),
}

// Real World Examples
export const RealWorldExamples: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-xl">
      <Blockquote size="lg">"Design is not just what it looks like and feels like. Design is how it works."</Blockquote>

      <Blockquote size="md" color="info">
        "Simplicity is the ultimate sophistication."
        <cite className="block mt-2 text-sm not-italic opacity-70">— Leonardo da Vinci</cite>
      </Blockquote>

      <Blockquote size="md" color="success">
        "The best way to predict the future is to invent it."
        <cite className="block mt-2 text-sm not-italic opacity-70">— Alan Kay</cite>
      </Blockquote>

      <Blockquote size="sm" color="warning">
        Note: This feature is experimental and may change in future releases.
      </Blockquote>
    </Box>
  ),
}

// Long Blockquote
export const LongBlockquote: Story = {
  render: () => (
    <Box className="max-w-xl">
      <Blockquote size="md">
        Typography is the art and technique of arranging type to make written language legible, readable and appealing
        when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing,
        and letter-spacing, and adjusting the space between pairs of letters. The term typography is also applied to the
        style, arrangement, and appearance of the letters, numbers, and symbols created by the process.
      </Blockquote>
    </Box>
  ),
}

function ResponsiveBlockquoteCard({ width }: { width: number }) {
  const { shellRef, formFactor, activeBreakpoint } = useEmbeddedTypographyPreviewVars(width)

  return (
    <EmbeddedResponsiveShell ref={shellRef} width={width}>
      <Box className="mb-3 text-xs text-muted-foreground">{embeddedResponsiveScaleCopy}</Box>
      <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
      <div className="mt-3">
        <Blockquote size={{ initial: 'sm', md: '4x' }}>
          “The interface should adapt to the space it actually gets, not the page around it.”
        </Blockquote>
      </div>
    </EmbeddedResponsiveShell>
  )
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <ResponsiveBlockquoteCard width={width} />} />
  },
}
