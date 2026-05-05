import type { Meta, StoryObj } from '@storybook/react-vite'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Kbd, Text } from '@/typography'
import {
  EmbeddedResponsiveShell,
  EmbeddedResponsiveTabs,
  EmbeddedTypographyState,
  embeddedResponsiveScaleCopy,
  useEmbeddedTypographyPreviewVars,
} from '@/typography/storybook/embedded-responsive-preview'
import { kbdPropDefs } from './kbd.props'

const meta: Meta<typeof Kbd> = {
  title: 'Typography/Kbd',
  component: Kbd,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(kbdPropDefs.size),
    },
    variant: {
      control: 'select',
      options: getPropDefValues(kbdPropDefs.variant),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '⌘ K',
    size: 'sm',
    variant: 'classic',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {getPropDefValues(kbdPropDefs.variant).map(variant => (
        <Kbd key={variant} variant={variant}>
          {variant}
        </Kbd>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {getPropDefValues(kbdPropDefs.size).map(size => (
        <Kbd key={size} size={size}>
          {size}
        </Kbd>
      ))}
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <Text size="md">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open command palette.
    </Text>
  ),
}

function ResponsiveKbdCard({ width }: { width: number }) {
  const { shellRef, formFactor, activeBreakpoint } = useEmbeddedTypographyPreviewVars(width)

  return (
    <EmbeddedResponsiveShell ref={shellRef} width={width}>
      <Text size="xs" variant="muted" className="mb-3 block">
        {embeddedResponsiveScaleCopy}
      </Text>
      <EmbeddedTypographyState formFactor={formFactor} activeBreakpoint={activeBreakpoint} />
      <div className="mt-3 flex items-center gap-3">
        <Kbd size={{ initial: 'sm', md: '4x' }}>⌘</Kbd>
        <Kbd size={{ initial: 'sm', md: '4x' }}>K</Kbd>
      </div>
    </EmbeddedResponsiveShell>
  )
}

export const EmbeddedResponsivePreview: Story = {
  render: () => {
    return <EmbeddedResponsiveTabs renderContent={({ width }) => <ResponsiveKbdCard width={width} />} />
  },
}
