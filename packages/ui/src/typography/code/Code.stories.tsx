import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Code, Text } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { codePropDefs } from './code.props'

const meta: Meta<typeof Code> = {
  title: 'Typography/Code',
  component: Code,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(codePropDefs.size),
      description: 'The size of the code text',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(codePropDefs.variant),
      description: 'The visual variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(codePropDefs.color),
      description: 'The accent color',
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
    children: 'npm install @incmix/ui',
    variant: 'soft',
  },
}

// All Variants
export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-3">
      <Code variant="soft">Soft variant (default)</Code>
      <Code variant="solid">Solid variant</Code>
      <Code variant="outline">Outline variant</Code>
      <Code variant="ghost">Ghost variant</Code>
    </Box>
  ),
}

// All Colors (Soft Variant)
export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-3">
      {getPropDefValues(codePropDefs.color).map(color => (
        <Code key={color} color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)} color
        </Code>
      ))}
    </Box>
  ),
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-3">
      <Code size="xs">Size xs code</Code>
      <Code size="sm">Size sm code</Code>
      <Code size="md">Size md code</Code>
      <Code size="lg">Size lg code</Code>
      <Code size="xl">Size xl code</Code>
    </Box>
  ),
}

// Inline Code
export const InlineCode: Story = {
  render: () => (
    <Text size="md">
      Use the <Code>useState</Code> hook to manage state in functional components. You can also use{' '}
      <Code>useEffect</Code> for side effects.
    </Text>
  ),
}

// Real World Examples
export const RealWorldExamples: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Box>
        <Text size="sm" color="neutral" className="mb-1">
          Installation
        </Text>
        <Code variant="soft">npm install @incmix/ui</Code>
      </Box>
      <Box>
        <Text size="sm" color="neutral" className="mb-1">
          Git command
        </Text>
        <Code variant="outline">git commit -m "feat: add new feature"</Code>
      </Box>
      <Box>
        <Text size="sm" color="neutral" className="mb-1">
          Variable declaration
        </Text>
        <Code variant="solid">const theme = "dark";</Code>
      </Box>
      <Box>
        <Text size="sm" color="neutral" className="mb-1">
          Success message
        </Text>
        <Code variant="soft" color="success">
          Build completed successfully!
        </Code>
      </Box>
      <Box>
        <Text size="sm" color="neutral" className="mb-1">
          Error message
        </Text>
        <Code variant="soft" color="error">
          Error: Module not found
        </Code>
      </Box>
    </Box>
  ),
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    const ResponsiveCodeCard = ({ width }: { width: number }) => {
      const { shellRef, formFactor, activeBreakpoint } = useEmbeddedTypographyPreviewVars(width)

      return (
        <EmbeddedResponsiveShell ref={shellRef} width={width}>
          <Text size="xs" variant="muted" className="mb-3 block">
            {embeddedResponsiveScaleCopy}
          </Text>
          <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
          <div className="mt-3">
            <Code size={{ initial: 'sm', md: '4x' }}>npm install @incmix/ui</Code>
          </div>
        </EmbeddedResponsiveShell>
      )
    }

    return <EmbeddedResponsiveTabs renderContent={({ width }) => <ResponsiveCodeCard width={width} />} />
  },
}
