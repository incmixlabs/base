import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, Lightbulb, Rocket, Shield, XCircle } from 'lucide-react'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Callout, type CalloutProps } from './Callout'
import { calloutRootPropDefs } from './callout.props'

const meta: Meta<typeof Callout.Root> = {
  title: 'Elements/Callout',
  component: Callout.Root,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(calloutRootPropDefs.size),
      description: 'The size of the callout',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(calloutRootPropDefs.variant),
      description: 'The visual variant of the callout',
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'The accent color of the callout',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast mode for better accessibility',
    },
    inverse: {
      control: 'boolean',
      description: 'Inverse text treatment for soft/solid variants',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover styles/cursor for interactive callouts',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const renderCallout = (args: CalloutProps.Root, text: string) => (
  <Callout.Root {...args}>
    <Callout.Icon>
      <Info />
    </Callout.Icon>
    <Callout.Text>{text}</Callout.Text>
  </Callout.Root>
)

// Playground
export const Playground: Story = {
  render: args => renderCallout(args, 'This is a callout with some important information for you.'),
  args: {
    size: 'xl',
    variant: 'soft',
    color: SemanticColor.neutral,
    hover: false,
    inverse: false,
  },
}

// Variants
export const Soft: Story = {
  render: args => renderCallout(args, 'This is a soft callout with a subtle background.'),
  args: {
    variant: 'soft',
    color: 'info',
    size: 'xl',
    inverse: false,
    hover: false,
    highContrast: false,
  },
}

export const Surface: Story = {
  render: args => renderCallout(args, 'This is a surface callout with a border and light background.'),
  args: {
    variant: 'surface',
    color: 'info',
    size: 'xl',
    inverse: false,
    hover: false,
    highContrast: false,
  },
}

export const Solid: Story = {
  render: args => renderCallout(args, 'This is a solid callout with high-emphasis fill.'),
  args: {
    variant: 'solid',
    color: 'info',
    size: 'xl',
    inverse: false,
    hover: false,
    highContrast: false,
  },
}

export const Outline: Story = {
  render: args => renderCallout(args, 'This is an outline callout with just a border.'),
  args: {
    variant: 'outline',
    color: 'info',
    size: 'xl',
    inverse: false,
    hover: false,
    highContrast: false,
  },
}

export const Split: Story = {
  render: args => renderCallout(args, 'This is a split callout with a solid icon rail and outlined content area.'),
  args: {
    variant: 'split',
    color: 'info',
    size: 'xl',
    inverse: false,
    hover: false,
    highContrast: false,
  },
}

// Sizes
export const SizeSm: Story = {
  name: 'Size sm (Small)',
  render: () => (
    <Callout.Root size="sm" color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Size sm callout</Callout.Text>
    </Callout.Root>
  ),
}

export const SizeMd: Story = {
  name: 'Size md (Medium)',
  render: () => (
    <Callout.Root size="md" color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Size md callout</Callout.Text>
    </Callout.Root>
  ),
}

export const SizeLg: Story = {
  name: 'Size lg (Large)',
  render: () => (
    <Callout.Root size="lg" color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Size lg callout</Callout.Text>
    </Callout.Root>
  ),
}

export const SizeXl: Story = {
  name: 'Size xl (Extra Large, default)',
  render: () => (
    <Callout.Root size="xl" color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Size xl callout (default)</Callout.Text>
    </Callout.Root>
  ),
}

export const Size2x: Story = {
  name: 'Size 2x (Extra Extra Large)',
  render: () => (
    <Callout.Root size="2x" color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Size 2x callout</Callout.Text>
    </Callout.Root>
  ),
}

// Colors
export const ColorDefault: Story = {
  render: () => (
    <Callout.Root color="slate">
      <Callout.Icon>
        <Bell />
      </Callout.Icon>
      <Callout.Text>Default gray/slate callout</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorNeutral: Story = {
  render: () => (
    <Callout.Root color="neutral">
      <Callout.Icon>
        <Bell />
      </Callout.Icon>
      <Callout.Text>Neutral theme-surface callout</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorPrimary: Story = {
  render: () => (
    <Callout.Root color="primary">
      <Callout.Icon>
        <Rocket />
      </Callout.Icon>
      <Callout.Text>Primary branded callout</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorInfo: Story = {
  render: () => (
    <Callout.Root color="info">
      <Callout.Icon>
        <Info />
      </Callout.Icon>
      <Callout.Text>Informational callout for helpful tips and details.</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorSuccess: Story = {
  render: () => (
    <Callout.Root color="success">
      <Callout.Icon>
        <CheckCircle />
      </Callout.Icon>
      <Callout.Text>Success! Your action was completed successfully.</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorWarning: Story = {
  render: () => (
    <Callout.Root color="warning">
      <Callout.Icon>
        <AlertTriangle />
      </Callout.Icon>
      <Callout.Text>Warning: Please review this before proceeding.</Callout.Text>
    </Callout.Root>
  ),
}

export const ColorError: Story = {
  render: () => (
    <Callout.Root color="error">
      <Callout.Icon>
        <XCircle />
      </Callout.Icon>
      <Callout.Text>Error: Something went wrong. Please try again.</Callout.Text>
    </Callout.Root>
  ),
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Callout.Root variant="soft" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Soft variant</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Surface variant</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="solid" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Solid variant</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Outline variant</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="split" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Split variant</Callout.Text>
      </Callout.Root>
    </Box>
  ),
}

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      {getPropDefValues(calloutRootPropDefs.size).map(size => (
        <div key={size} className="space-y-1">
          <span className="text-xs text-muted-foreground font-mono">{size}</span>
          <Callout.Root size={size} variant="soft" color="info">
            <Callout.Icon>
              <Info />
            </Callout.Icon>
            <Callout.Text>Size {size} — The quick brown fox jumps over the lazy dog.</Callout.Text>
          </Callout.Root>
        </div>
      ))}
    </Box>
  ),
}

// All colors with soft variant
export const AllColorsSoft: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Callout.Root color="slate">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Default</Callout.Text>
      </Callout.Root>
      <Callout.Root color="neutral">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Neutral</Callout.Text>
      </Callout.Root>
      <Callout.Root color="primary">
        <Callout.Icon>
          <Rocket />
        </Callout.Icon>
        <Callout.Text>Primary</Callout.Text>
      </Callout.Root>
      <Callout.Root color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Info</Callout.Text>
      </Callout.Root>
      <Callout.Root color="success">
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>Success</Callout.Text>
      </Callout.Root>
      <Callout.Root color="warning">
        <Callout.Icon>
          <AlertTriangle />
        </Callout.Icon>
        <Callout.Text>Warning</Callout.Text>
      </Callout.Root>
      <Callout.Root color="error">
        <Callout.Icon>
          <XCircle />
        </Callout.Icon>
        <Callout.Text>Error</Callout.Text>
      </Callout.Root>
    </Box>
  ),
}

// All colors with surface variant
export const AllColorsSurface: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Callout.Root variant="surface" color="slate">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Default</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="neutral">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Neutral</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="primary">
        <Callout.Icon>
          <Rocket />
        </Callout.Icon>
        <Callout.Text>Primary</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Info</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="success">
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>Success</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="warning">
        <Callout.Icon>
          <AlertTriangle />
        </Callout.Icon>
        <Callout.Text>Warning</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="error">
        <Callout.Icon>
          <XCircle />
        </Callout.Icon>
        <Callout.Text>Error</Callout.Text>
      </Callout.Root>
    </Box>
  ),
}

// All colors with outline variant
export const AllColorsOutline: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Callout.Root variant="outline" color="slate">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Default</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="neutral">
        <Callout.Icon>
          <Bell />
        </Callout.Icon>
        <Callout.Text>Neutral</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="primary">
        <Callout.Icon>
          <Rocket />
        </Callout.Icon>
        <Callout.Text>Primary</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="info">
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>Info</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="success">
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>Success</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="warning">
        <Callout.Icon>
          <AlertTriangle />
        </Callout.Icon>
        <Callout.Text>Warning</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="error">
        <Callout.Icon>
          <XCircle />
        </Callout.Icon>
        <Callout.Text>Error</Callout.Text>
      </Callout.Root>
    </Box>
  ),
}

// High contrast mode
export const HighContrast: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <Callout.Root color="info" highContrast>
        <Callout.Icon>
          <Info />
        </Callout.Icon>
        <Callout.Text>High contrast soft (default variant)</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="surface" color="success" highContrast>
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>High contrast surface variant</Callout.Text>
      </Callout.Root>
      <Callout.Root variant="outline" color="warning" highContrast>
        <Callout.Icon>
          <AlertTriangle />
        </Callout.Icon>
        <Callout.Text>High contrast outline variant</Callout.Text>
      </Callout.Root>
    </Box>
  ),
}

// Without icon
export const WithoutIcon: Story = {
  render: () => (
    <Callout.Root color="info">
      <Callout.Text className="col-span-2">This callout has no icon and the text spans the full width.</Callout.Text>
    </Callout.Root>
  ),
}

// Long content
export const LongContent: Story = {
  render: () => (
    <Callout.Root color="info" className="max-w-lg">
      <Callout.Icon>
        <Lightbulb />
      </Callout.Icon>
      <Callout.Text>
        This is a callout with longer content. It demonstrates how the component handles multi-line text. The icon stays
        aligned to the top while the text wraps naturally. This is useful for displaying detailed information, tips, or
        warnings that require more explanation.
      </Callout.Text>
    </Callout.Root>
  ),
}

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-lg">
      {/* Tip */}
      <Callout.Root color="info" variant="soft">
        <Callout.Icon>
          <Lightbulb />
        </Callout.Icon>
        <Callout.Text>
          <strong>Tip:</strong> You can use keyboard shortcuts to navigate faster. Press{' '}
          <code className="px-1 py-0.5 bg-blue-200/50 rounded text-xs">?</code> to see all available shortcuts.
        </Callout.Text>
      </Callout.Root>

      {/* Security notice */}
      <Callout.Root color="warning" variant="surface">
        <Callout.Icon>
          <Shield />
        </Callout.Icon>
        <Callout.Text>
          <strong>Security Notice:</strong> Your session will expire in 5 minutes. Please save your work to avoid losing
          any changes.
        </Callout.Text>
      </Callout.Root>

      {/* Success message */}
      <Callout.Root color="success" variant="soft">
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>
          Your changes have been saved successfully. The new settings will take effect immediately.
        </Callout.Text>
      </Callout.Root>

      {/* Error message */}
      <Callout.Root color="error" variant="surface">
        <Callout.Icon>
          <AlertCircle />
        </Callout.Icon>
        <Callout.Text>
          <strong>Connection Error:</strong> Unable to reach the server. Please check your internet connection and try
          again.
        </Callout.Text>
      </Callout.Root>
    </Box>
  ),
}
