import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, Lightbulb, Rocket, Shield, XCircle } from 'lucide-react'
import { Box } from '@/layouts/box/Box'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { Callout, type CalloutProps } from './Callout'
import { calloutRootPropDefs } from './callout.props'

const calloutSizes = getPropDefValues(calloutRootPropDefs.size)
const calloutVariants = getPropDefValues(calloutRootPropDefs.variant)
const calloutColors = getPropDefValues(calloutRootPropDefs.color)
const calloutRadii = getPropDefValues(calloutRootPropDefs.radius)

const meta: Meta<typeof Callout.Root> = {
  title: 'Elements/Callout',
  component: Callout.Root,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: selectArgType(calloutRootPropDefs.size, {
      description: 'The size of the callout',
    }),
    variant: selectArgType(calloutRootPropDefs.variant, {
      description: 'The visual variant of the callout',
    }),
    color: selectArgType(calloutRootPropDefs.color, {
      description: 'The accent color of the callout',
    }),
    radius: selectArgType(calloutRootPropDefs.radius, {
      description: 'Border radius',
    }),
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
    icon: {
      control: 'text',
      description: 'Lucide icon name for the icon slot',
    },
    text: {
      control: 'text',
      description: 'Text rendered in the callout text slot',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

function IconForColor({ color }: { color: string }) {
  switch (color) {
    case 'primary':
      return <Rocket />
    case 'info':
      return <Info />
    case 'success':
      return <CheckCircle />
    case 'warning':
      return <AlertTriangle />
    case 'error':
      return <XCircle />
    default:
      return <Bell />
  }
}

const renderCallout = (args: CalloutProps.Root, text: string) => (
  <Callout.Root {...args}>
    <Callout.Icon>
      <IconForColor color={String(args.color ?? 'slate')} />
    </Callout.Icon>
    <Callout.Text>{text}</Callout.Text>
  </Callout.Root>
)

const splitStoryArgs = {
  size: calloutRootPropDefs.size.default,
  variant: 'split',
  radius: 'lg',
  hover: calloutRootPropDefs.hover.default,
  inverse: calloutRootPropDefs.inverse.default,
  highContrast: calloutRootPropDefs.highContrast.default,
} satisfies Partial<CalloutProps.Root>

const splitStatusExamples = [
  {
    color: 'error',
    icon: <XCircle />,
    title: 'Payment failed.',
    message: 'The card on file was declined. Update billing details before the next retry.',
  },
  {
    color: 'warning',
    icon: <AlertTriangle />,
    title: 'Schema drift detected.',
    message: 'Three downstream mappings need review before the sync can be promoted.',
  },
  {
    color: 'success',
    icon: <CheckCircle />,
    title: 'Import complete.',
    message: 'All records passed validation and are ready for assignment.',
  },
  {
    color: 'info',
    icon: <Info />,
    title: 'Maintenance scheduled.',
    message: 'Background jobs pause for ten minutes during the maintenance window.',
  },
] as const

export const Playground: Story = {
  render: args => renderCallout(args, 'This is a callout with important information.'),
  args: {
    size: calloutRootPropDefs.size.default,
    variant: calloutRootPropDefs.variant.default,
    color: 'slate',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const Variants: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutVariants.map(variant => (
        <Callout.Root key={variant} {...args} variant={variant} color={args.color ?? 'info'}>
          <Callout.Icon>
            <Info />
          </Callout.Icon>
          <Callout.Text>{variant} variant</Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    color: 'info',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const Sizes: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-8">
      {calloutSizes.map(size => (
        <div key={size} className="space-y-1">
          <span className="text-xs text-muted-foreground font-mono">{size}</span>
          <Callout.Root {...args} size={size} color={args.color ?? 'info'}>
            <Callout.Icon>
              <Info />
            </Callout.Icon>
            <Callout.Text>Size {size}. The quick brown fox jumps over the lazy dog.</Callout.Text>
          </Callout.Root>
        </div>
      ))}
    </Box>
  ),
  args: {
    variant: calloutRootPropDefs.variant.default,
    color: 'info',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const Colors: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutColors.map(color => (
        <Callout.Root key={color} {...args} color={color}>
          <Callout.Icon>
            <IconForColor color={color} />
          </Callout.Icon>
          <Callout.Text>{color} callout</Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    variant: calloutRootPropDefs.variant.default,
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const Radius: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutRadii.map(radius => (
        <Callout.Root key={radius} {...args} radius={radius}>
          <Callout.Icon>
            <Info />
          </Callout.Icon>
          <Callout.Text>Radius {radius}</Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    variant: calloutRootPropDefs.variant.default,
    color: 'info',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const Split: Story = {
  render: args => renderCallout(args, 'Split callout with a colored rail and neutral content surface.'),
  args: {
    ...splitStoryArgs,
    color: 'error',
  },
}

export const SplitColors: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutColors.map(color => (
        <Callout.Root key={color} {...args} variant="split" color={color}>
          <Callout.Icon>
            <IconForColor color={color} />
          </Callout.Icon>
          <Callout.Text>
            <span className="capitalize">{color}</span> split rail with neutral content surface.
          </Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    ...splitStoryArgs,
    color: 'error',
  },
}

export const SplitSizes: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-8">
      {calloutSizes.map(size => (
        <div key={size} className="space-y-1">
          <span className="text-xs text-muted-foreground font-mono">{size}</span>
          <Callout.Root {...args} size={size} variant="split" color={args.color ?? 'error'}>
            <Callout.Icon>
              <IconForColor color={String(args.color ?? 'error')} />
            </Callout.Icon>
            <Callout.Text>Split size {size}. The rail and content padding scale together.</Callout.Text>
          </Callout.Root>
        </div>
      ))}
    </Box>
  ),
  args: {
    ...splitStoryArgs,
    color: 'error',
  },
}

export const SplitHover: Story = {
  render: args => renderCallout(args, 'Hoverable split callout. The neutral content surface responds on hover.'),
  args: {
    ...splitStoryArgs,
    color: 'warning',
    hover: true,
  },
}

export const SplitHighContrast: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutColors.map(color => (
        <Callout.Root key={color} {...args} variant="split" color={color} highContrast>
          <Callout.Icon>
            <IconForColor color={color} />
          </Callout.Icon>
          <Callout.Text>
            <span className="capitalize">{color}</span> high-contrast split callout.
          </Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    ...splitStoryArgs,
    color: 'error',
    highContrast: true,
  },
}

export const SplitRootProps: Story = {
  render: args => (
    <Callout.Root
      {...args}
      icon={args.icon ?? 'alert-triangle'}
      text={args.text ?? 'Split callout rendered from root icon and text props.'}
    />
  ),
  args: {
    ...splitStoryArgs,
    color: 'warning',
    icon: 'alert-triangle',
    text: 'Split callout rendered from root icon and text props.',
  },
}

export const SplitRadius: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutRadii.map(radius => (
        <Callout.Root key={radius} {...args} variant="split" radius={radius}>
          <Callout.Icon>
            <IconForColor color={String(args.color ?? 'error')} />
          </Callout.Icon>
          <Callout.Text>Split radius {radius}</Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    ...splitStoryArgs,
    color: 'error',
  },
}

export const SplitLongContent: Story = {
  render: args => (
    <Callout.Root {...args} className="max-w-xl">
      <Callout.Icon>
        <Shield />
      </Callout.Icon>
      <Callout.Text>
        <strong>Policy exception pending.</strong> The request can continue, but approval must be completed before the
        automation runs in production. The neutral content surface should remain readable across multi-line messages.
      </Callout.Text>
    </Callout.Root>
  ),
  args: {
    ...splitStoryArgs,
    color: 'warning',
  },
}

export const SplitStatusExamples: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4 max-w-2xl">
      {splitStatusExamples.map(example => (
        <Callout.Root key={example.title} {...args} variant="split" color={example.color}>
          <Callout.Icon>{example.icon}</Callout.Icon>
          <Callout.Text>
            <strong>{example.title}</strong> {example.message}
          </Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    ...splitStoryArgs,
  },
}

export const HighContrast: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-4">
      {calloutVariants.map(variant => (
        <Callout.Root key={variant} {...args} variant={variant} highContrast>
          <Callout.Icon>
            <Info />
          </Callout.Icon>
          <Callout.Text>High contrast {variant}</Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    color: 'info',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
  },
}

export const WithoutIcon: Story = {
  render: args => (
    <Callout.Root {...args}>
      <Callout.Text className="col-span-2">This callout has no icon and the text spans the full width.</Callout.Text>
    </Callout.Root>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    variant: calloutRootPropDefs.variant.default,
    color: 'info',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const LongContent: Story = {
  render: args => (
    <Callout.Root {...args} className="max-w-lg">
      <Callout.Icon>
        <Lightbulb />
      </Callout.Icon>
      <Callout.Text>
        This is a callout with longer content. It demonstrates how the component handles multi-line text. The icon stays
        aligned to the top while the text wraps naturally.
      </Callout.Text>
    </Callout.Root>
  ),
  args: {
    size: calloutRootPropDefs.size.default,
    variant: calloutRootPropDefs.variant.default,
    color: 'info',
    radius: 'lg',
    hover: calloutRootPropDefs.hover.default,
    inverse: calloutRootPropDefs.inverse.default,
    highContrast: calloutRootPropDefs.highContrast.default,
  },
}

export const RealWorldExamples: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-lg">
      <Callout.Root color="info" variant="soft">
        <Callout.Icon>
          <Lightbulb />
        </Callout.Icon>
        <Callout.Text>
          <strong>Tip:</strong> Keyboard shortcuts are available from the command menu.
        </Callout.Text>
      </Callout.Root>

      <Callout.Root color="warning" variant="surface">
        <Callout.Icon>
          <Shield />
        </Callout.Icon>
        <Callout.Text>
          <strong>Security notice:</strong> Your session will expire soon. Save current work before continuing.
        </Callout.Text>
      </Callout.Root>

      <Callout.Root color="success" variant="soft">
        <Callout.Icon>
          <CheckCircle />
        </Callout.Icon>
        <Callout.Text>Your changes have been saved successfully.</Callout.Text>
      </Callout.Root>

      <Callout.Root color="error" variant="surface">
        <Callout.Icon>
          <AlertCircle />
        </Callout.Icon>
        <Callout.Text>
          <strong>Connection error:</strong> Unable to reach the server. Check the connection and try again.
        </Callout.Text>
      </Callout.Root>
    </Box>
  ),
}
