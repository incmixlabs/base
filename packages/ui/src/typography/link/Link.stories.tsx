import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Link, Text } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { linkPropDefs } from './link.props'

function LinkResponsivePreviewCard({ width }: { width: number }) {
  const sampleRef = React.useRef<HTMLAnchorElement | null>(null)
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
        <div className="space-y-3">
          <span className="text-xs text-muted-foreground">{embeddedResponsiveScaleCopy}</span>
          <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
          <Link href="#" size={{ initial: 'xs', sm: 'lg', md: '4x' }} color="primary" ref={sampleRef}>
            Scale Test
          </Link>
          <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
            font-size: {metrics.fontSize || '...'} | line-height: {metrics.lineHeight || '...'} | letter-spacing:{' '}
            {metrics.letterSpacing || '...'}
          </div>
        </div>
      </EmbeddedResponsiveShell>
    </div>
  )
}

const meta: Meta<typeof Link> = {
  title: 'Typography/Link',
  component: Link,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.size),
    },
    weight: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.weight),
    },
    underline: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.underline),
    },
    wrap: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.wrap),
    },
    trim: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.trim),
    },
    truncate: {
      control: 'boolean',
    },
    color: {
      control: 'select',
      options: getPropDefValues(linkPropDefs.color),
    },
    highContrast: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Open Autoform docs',
    href: '#',
    underline: 'auto',
    color: 'primary',
  },
}

export const UnderlineModes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {getPropDefValues(linkPropDefs.underline).map(underline => (
        <Link key={underline} href="#" underline={underline}>
          underline = {underline}
        </Link>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {getPropDefValues(linkPropDefs.color).map(color => (
        <Link key={color} href="#" color={color}>
          {color}
        </Link>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {getPropDefValues(linkPropDefs.size).map(size => (
        <Link key={size} href="#" size={size}>
          size = {size}
        </Link>
      ))}
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <Text size="md">
      Read the <Link href="#">migration guide</Link> before upgrading.
    </Text>
  ),
}

export const WrappingAndTrim: Story = {
  render: () => (
    <div className="space-y-2 max-w-[26rem]">
      <Link href="#" wrap="pretty">
        This long link uses wrap=&quot;pretty&quot; to improve line breaks in narrow widths.
      </Link>
      <Link href="#" wrap="nowrap" truncate className="max-w-[16rem] block">
        This is a very long unbroken link title that truncates in a constrained layout.
      </Link>
      <Link href="#" trim="both">
        Leading trim example
      </Link>
    </div>
  ),
}

export const ResponsiveSizeAndSpacing: Story = {
  render: () => (
    <div style={{ containerType: 'inline-size' }}>
      <Link href="#" size={{ initial: 'sm', md: 'xl' }} mt={{ initial: '2', md: '4' }}>
        Responsive size + margin from prop object
      </Link>
    </div>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <LinkResponsivePreviewCard width={width} />} />
  },
}
