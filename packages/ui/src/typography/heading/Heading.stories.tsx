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
      <div className="text-sm font-medium text-neutral">Preview width: {width}px</div>
      <EmbeddedResponsiveShell ref={shellRef} width={width}>
        <div className="space-y-4">
          <Box>
            <span className="text-xs text-slate">{embeddedResponsiveScaleCopy}</span>
          </Box>
          <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
          <Heading size={{ initial: 'xs', sm: '2x', md: '5x' }} as="h2" ref={sampleRef}>
            Scale Test
          </Heading>
          <div className="rounded-md border border-dashed border-slate px-3 py-2 text-xs text-slate">
            font-size: {metrics.fontSize || '...'} | line-height: {metrics.lineHeight || '...'} | letter-spacing:{' '}
            {metrics.letterSpacing || '...'}
          </div>
          <Box>
            <span className="text-xs text-slate">Reference text remains fixed at `xs`.</span>
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
      options: getPropDefValues(headingPropDefs.align),
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
      {[...getPropDefValues(headingPropDefs.size)].reverse().map(size => (
        <Heading key={size} size={size}>
          Size {size} Heading
        </Heading>
      ))}
    </Box>
  ),
}

// All Weights
export const AllWeights: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      {getPropDefValues(headingPropDefs.weight).map(weight => (
        <Heading key={weight} size="xl" weight={weight}>
          {weight.charAt(0).toUpperCase()}
          {weight.slice(1)} weight heading
        </Heading>
      ))}
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
      {getPropDefValues(headingPropDefs.variant).map(variant => (
        <Heading key={variant} color="slate" variant={variant} size="xl">
          {variant.charAt(0).toUpperCase()}
          {variant.slice(1)} heading
        </Heading>
      ))}
    </Box>
  ),
}

// Semantic HTML Elements
export const SemanticElements: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-2">
      {getPropDefValues(headingPropDefs.as).map(as => (
        <Heading key={as} as={as}>
          {as.toUpperCase()} Element
        </Heading>
      ))}
    </Box>
  ),
}

// With Margin
export const WithMargin: Story = {
  render: () => (
    <Box className="bg-slate-soft p-4">
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
      {getPropDefValues(headingPropDefs.align).map(align => (
        <Heading key={align} size="lg" align={align}>
          {align.charAt(0).toUpperCase()}
          {align.slice(1)} aligned heading
        </Heading>
      ))}
    </Box>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <HeadingResponsivePreviewCard width={width} />} />
  },
}
