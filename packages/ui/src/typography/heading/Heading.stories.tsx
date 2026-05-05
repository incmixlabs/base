import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Heading } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { headingPropDefs } from './heading.props'

function HeadingResponsivePreviewCard({ width }: { width: number }) {
  const sampleRef = React.useRef<HTMLHeadingElement | null>(null)
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
          <Box>
            <span className="text-xs text-muted-foreground">{embeddedResponsiveScaleCopy}</span>
          </Box>
          <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
          <Heading size={{ initial: 'xs', sm: '2x', md: '5x' }} as="h2" ref={sampleRef}>
            Scale Test
          </Heading>
          <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
            font-size: {metrics.fontSize || '...'} | line-height: {metrics.lineHeight || '...'} | letter-spacing:{' '}
            {metrics.letterSpacing || '...'}
          </div>
          <Box>
            <span className="text-xs text-muted-foreground">Reference text remains fixed at `xs`.</span>
          </Box>
        </div>
      </EmbeddedResponsiveShell>
    </div>
  )
}

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.as),
      description: 'The HTML heading element to render',
    },
    size: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.size),
      description: 'The size of the heading',
    },
    weight: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.weight),
      description: 'The font weight',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.variant),
      description: 'The heading emphasis variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.color),
      description: 'The heading color',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    wrap: {
      control: 'select',
      options: getPropDefValues(headingPropDefs.wrap),
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
    children: 'The quick brown fox',
    size: '2x',
    weight: 'bold',
    variant: 'solid',
    as: 'h1',
  },
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Heading size="5x">Size 5x Heading</Heading>
      <Heading size="4x">Size 4x Heading</Heading>
      <Heading size="3x">Size 3x Heading</Heading>
      <Heading size="2x">Size 2x Heading</Heading>
      <Heading size="xl">Size xl Heading</Heading>
      <Heading size="lg">Size lg Heading</Heading>
      <Heading size="md">Size md Heading</Heading>
      <Heading size="sm">Size sm Heading</Heading>
      <Heading size="xs">Size xs Heading</Heading>
    </Box>
  ),
}

// All Weights
export const AllWeights: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Heading size="xl" weight="light">
        Light weight heading
      </Heading>
      <Heading size="xl" weight="regular">
        Regular weight heading
      </Heading>
      <Heading size="xl" weight="medium">
        Medium weight heading
      </Heading>
      <Heading size="xl" weight="bold">
        Bold weight heading
      </Heading>
    </Box>
  ),
}

// All Colors
export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      {getPropDefValues(headingPropDefs.color).map(color => (
        <Heading key={color} size="lg" color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)} color heading
        </Heading>
      ))}
    </Box>
  ),
}

export const Variants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-3">
      <Heading color="slate" variant="solid" size="xl">
        Default solid heading
      </Heading>
      <Heading color="slate" variant="soft" size="xl">
        Default soft heading
      </Heading>
      <Heading color="slate" variant="muted" size="xl">
        Default muted heading
      </Heading>
      <Heading color="primary" variant="solid" size="xl">
        Primary solid heading
      </Heading>
      <Heading color="primary" variant="soft" size="xl">
        Primary soft heading
      </Heading>
      <Heading color="primary" variant="muted" size="xl">
        Primary muted heading
      </Heading>
    </Box>
  ),
}

// Semantic HTML Elements
export const SemanticElements: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      <Heading as="h1" size="3x">
        H1 Element
      </Heading>
      <Heading as="h2" size="2x">
        H2 Element
      </Heading>
      <Heading as="h3" size="xl">
        H3 Element
      </Heading>
      <Heading as="h4" size="lg">
        H4 Element
      </Heading>
      <Heading as="h5" size="md">
        H5 Element
      </Heading>
      <Heading as="h6" size="sm">
        H6 Element
      </Heading>
    </Box>
  ),
}

// With Margin
export const WithMargin: Story = {
  render: () => (
    <Box className="bg-gray-100 p-4">
      <Heading size="xl" mb="4">
        Heading with margin bottom
      </Heading>
      <Heading size="xl" mt="6">
        Heading with margin top
      </Heading>
    </Box>
  ),
}

// Alignment
export const Alignment: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 w-full">
      <Heading size="lg" align="left">
        Left aligned heading
      </Heading>
      <Heading size="lg" align="center">
        Center aligned heading
      </Heading>
      <Heading size="lg" align="right">
        Right aligned heading
      </Heading>
    </Box>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <HeadingResponsivePreviewCard width={width} />} />
  },
}
