import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Text } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { textPropDefs } from './text.props'

function TextResponsivePreviewCard({ width }: { width: number }) {
  const sampleRef = React.useRef<HTMLParagraphElement | null>(null)
  const [metrics, setMetrics] = React.useState({ fontSize: '', lineHeight: '', letterSpacing: '' })
  const { shellRef, formFactor, activeBreakpoint } = useEmbeddedTypographyPreviewVars(width)

  React.useLayoutEffect(() => {
    let cancelled = false
    const measuredWidth = width

    const measure = () => {
      const node = sampleRef.current
      if (!node || cancelled || measuredWidth <= 0) return
      const computed = window.getComputedStyle(node)
      setMetrics({
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
      })
    }

    measure()
    document.fonts.ready.then(measure)

    return () => {
      cancelled = true
    }
  }, [width])

  return (
    <div className="space-y-3 pt-4">
      <div className="text-sm font-medium text-foreground">Preview width: {width}px</div>
      <EmbeddedResponsiveShell ref={shellRef} width={width}>
        <div className="space-y-4">
          <Text as="p" size="xs" variant="muted">
            {embeddedResponsiveScaleCopy}
          </Text>
          <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
          <Text as="p" size={{ initial: 'xs', sm: '2x', md: '5x' }} weight="bold" ref={sampleRef}>
            Scale Test
          </Text>
          <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
            font-size: {metrics.fontSize || '...'} | line-height: {metrics.lineHeight || '...'} | letter-spacing:{' '}
            {metrics.letterSpacing || '...'}
          </div>
          <Text as="p" size="xs" variant="muted">
            Reference text remains fixed at `xs`.
          </Text>
        </div>
      </EmbeddedResponsiveShell>
    </div>
  )
}

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(textPropDefs.size),
      description: 'The size of the text',
    },
    weight: {
      control: 'select',
      options: getPropDefValues(textPropDefs.weight),
      description: 'The font weight',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(textPropDefs.variant),
      description: 'The text emphasis variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(textPropDefs.color),
      description: 'The text color',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    wrap: {
      control: 'select',
      options: getPropDefValues(textPropDefs.wrap),
      description: 'Text wrapping behavior',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate text with ellipsis',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast mode for better accessibility',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    size: 'md',
    weight: 'regular',
    color: 'slate',
    variant: 'solid',
  },
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Text size="xs">Text size xs</Text>
      <Text size="sm">Text size sm</Text>
      <Text size="md">Text size md</Text>
      <Text size="lg">Text size lg</Text>
      <Text size="xl">Text size xl</Text>
      <Text size="2x">Text size 2x</Text>
      <Text size="3x">Text size 3x</Text>
      <Text size="4x">Text size 4x</Text>
      <Text size="5x">Text size 5x</Text>
    </Box>
  ),
}

// All Weights
export const AllWeights: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Text size="lg" weight="light">
        Light weight text
      </Text>
      <Text size="lg" weight="regular">
        Regular weight text
      </Text>
      <Text size="lg" weight="medium">
        Medium weight text
      </Text>
      <Text size="lg" weight="bold">
        Bold weight text
      </Text>
    </Box>
  ),
}

// All Colors
export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      {getPropDefValues(textPropDefs.color).map(color => (
        <Text key={color} size="md" color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)} color text
        </Text>
      ))}
    </Box>
  ),
}

export const Variants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Text color="slate" variant="solid">
        Default solid text
      </Text>
      <Text color="slate" variant="soft">
        Default soft text
      </Text>
      <Text color="slate" variant="muted">
        Default muted text
      </Text>
      <Text color="success" variant="solid">
        Success solid text
      </Text>
      <Text color="success" variant="soft">
        Success soft text
      </Text>
      <Text color="success" variant="muted">
        Success muted text
      </Text>
    </Box>
  ),
}

export const RawPaletteColor: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Text color="green-11">Raw palette text color via `green-11`</Text>
      <Text color="indigo-10">Raw palette text color via `indigo-10`</Text>
    </Box>
  ),
}

// Alignment
export const Alignment: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 w-full max-w-md">
      <Text align="left" className="bg-gray-100 p-2">
        Left aligned text
      </Text>
      <Text align="center" className="bg-gray-100 p-2">
        Center aligned text
      </Text>
      <Text align="right" className="bg-gray-100 p-2">
        Right aligned text
      </Text>
    </Box>
  ),
}

// Truncation
export const Truncation: Story = {
  render: () => (
    <Box className="w-48">
      <Text truncate>This is a very long text that will be truncated with an ellipsis at the end.</Text>
    </Box>
  ),
}

// As different elements
export const AsElement: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Text as="span">As span (default)</Text>
      <Text as="p">As paragraph</Text>
      <Text as="div">As div</Text>
      <Text as="label">As label</Text>
    </Box>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <TextResponsivePreviewCard width={width} />} />
  },
}
