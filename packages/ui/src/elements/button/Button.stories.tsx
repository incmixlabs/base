import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heart, Plus } from 'lucide-react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { Button } from './Button'
import { buttonPropDefs } from './button.props'

const showcaseColors = [
  SemanticColor.slate,
  SemanticColor.primary,
  SemanticColor.secondary,
  SemanticColor.accent,
  SemanticColor.neutral,
  SemanticColor.info,
  SemanticColor.success,
  SemanticColor.warning,
  SemanticColor.error,
] as const

const meta: Meta<typeof Button> = {
  title: 'Elements/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    size: {
      ...selectArgType(buttonPropDefs.size),
      description: 'The size of the button',
    },
    variant: {
      ...selectArgType(buttonPropDefs.variant),
      description: 'The visual variant of the button',
    },
    color: {
      ...selectArgType(buttonPropDefs.color),
      description: 'The accent color of the button',
    },
    radius: {
      ...selectArgType(buttonPropDefs.radius),
      description: 'The border radius of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast mode for better accessibility',
    },
    inverse: {
      control: 'boolean',
      description: 'Inverse text treatment for soft/solid variants',
    },
    iconStart: {
      control: 'text',
      description: 'Lucide icon name to render at the start',
    },
    iconEnd: {
      control: 'text',
      description: 'Lucide icon name to render at the end',
    },
    asChild: {
      control: 'boolean',
      description: 'Render button styles on a child element',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// Interactive playground
export const Playground: Story = {
  args: {
    children: 'Button',
    size: 'md',
    variant: 'solid',
    color: SemanticColor.slate,
    radius: 'md',
    loading: false,
    disabled: false,
    highContrast: false,
    inverse: false,
    asChild: false,
  },
  render: ({ children, asChild, ...args }) =>
    asChild ? (
      <Button {...args} asChild>
        <a href="#">{children}</a>
      </Button>
    ) : (
      <Button {...args}>{children}</Button>
    ),
}

// Variants
export const Solid: Story = {
  args: {
    variant: 'solid',
    children: 'Solid Button',
  },
}

export const Soft: Story = {
  args: {
    variant: 'soft',
    children: 'Soft Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

// Sizes
export const SizeSm: Story = {
  name: 'Size sm (Small)',
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const SizeMd: Story = {
  name: 'Size md (Medium, default)',
  args: {
    size: 'md',
    children: 'Medium',
  },
}

export const SizeLg: Story = {
  name: 'Size lg (Large)',
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const SizeXl: Story = {
  name: 'Size xl (Extra Large)',
  args: {
    size: 'xl',
    children: 'Extra Large',
  },
}

// Colors
export const ColorPrimary: Story = {
  args: {
    color: SemanticColor.primary,
    children: 'Primary',
  },
}

export const ColorInfo: Story = {
  args: {
    color: SemanticColor.info,
    children: 'Info',
  },
}

export const ColorSuccess: Story = {
  args: {
    color: SemanticColor.success,
    children: 'Success',
  },
}

export const ColorWarning: Story = {
  args: {
    color: SemanticColor.warning,
    children: 'Warning',
  },
}

export const ColorError: Story = {
  args: {
    color: SemanticColor.error,
    children: 'Error',
  },
}

// Radius
export const RadiusNone: Story = {
  args: {
    radius: 'none',
    children: 'No Radius',
  },
}

export const RadiusFull: Story = {
  args: {
    radius: 'full',
    children: 'Pill Button',
  },
}

// With icons (dynamic string-based)
export const WithIconStart: Story = {
  args: {
    iconStart: 'mail',
    children: 'Send Email',
  },
}

export const WithIconEnd: Story = {
  args: {
    iconEnd: 'chevron-right',
    children: 'Continue',
  },
}

export const WithIconBoth: Story = {
  args: {
    iconStart: 'download',
    iconEnd: 'chevron-down',
    children: 'Download',
  },
}

export const IconOnly: Story = {
  args: {
    children: <Plus />,
    'aria-label': 'Add',
  },
}

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      <Button variant="solid">Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </Box>
  ),
}

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium (default)</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </Box>
  ),
}

// All colors with solid variant
export const AllColorsSolid: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      {showcaseColors.map(color => (
        <Button key={color} color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)}
        </Button>
      ))}
    </Box>
  ),
}

// All colors with soft variant
export const AllColorsSoft: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      {showcaseColors.map(color => (
        <Button key={color} variant="soft" color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)}
        </Button>
      ))}
    </Box>
  ),
}

// All colors with outline variant
export const AllColorsOutline: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      {showcaseColors.map(color => (
        <Button key={color} variant="outline" color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)}
        </Button>
      ))}
    </Box>
  ),
}

// All colors with ghost variant
export const AllColorsGhost: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      {showcaseColors.map(color => (
        <Button key={color} variant="ghost" color={color}>
          {color.charAt(0).toUpperCase()}
          {color.slice(1)}
        </Button>
      ))}
    </Box>
  ),
}

// Size and variant matrix
export const SizeVariantMatrix: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      {getPropDefValues(buttonPropDefs.size).map(size => (
        <Box key={size} display="flex" className="gap-4 items-center">
          <span className="w-12 text-sm text-muted-foreground">{size}</span>
          <Button size={size} variant="solid">
            Solid
          </Button>
          <Button size={size} variant="soft">
            Soft
          </Button>
          <Button size={size} variant="outline">
            Outline
          </Button>
          <Button size={size} variant="ghost">
            Ghost
          </Button>
        </Box>
      ))}
    </Box>
  ),
}

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      {/* Primary action with dynamic icon */}
      <Box display="flex" className="gap-3">
        <Button color="primary" iconStart="send">
          Submit
        </Button>
        <Button variant="outline">Cancel</Button>
      </Box>

      {/* Destructive action with dynamic icon */}
      <Box display="flex" className="gap-3">
        <Button color="error" iconStart="trash">
          Delete
        </Button>
        <Button variant="ghost">Cancel</Button>
      </Box>

      {/* Download action with dynamic icon */}
      <Box display="flex" className="gap-3">
        <Button variant="soft" color="info" iconStart="download">
          Download
        </Button>
      </Box>

      {/* Navigation with end icon */}
      <Box display="flex" className="gap-3">
        <Button iconEnd="arrow-right">Next Step</Button>
        <Button variant="soft" iconEnd="external-link">
          Open Link
        </Button>
      </Box>

      {/* Social actions (inline children still work) */}
      <Box display="flex" className="gap-3">
        <Button variant="ghost" color="error">
          <Heart />
        </Button>
        <Button variant="soft" radius="full" iconStart="plus">
          Follow
        </Button>
      </Box>
    </Box>
  ),
}

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      <Button loading>Loading</Button>
      <Button loading variant="soft">
        Loading
      </Button>
      <Button loading variant="outline">
        Loading
      </Button>
      <Button loading color="success">
        Saving
      </Button>
    </Box>
  ),
}

// Radius examples
export const AllRadii: Story = {
  render: () => (
    <Box display="flex" className="gap-4 items-center">
      <Button radius="none">None</Button>
      <Button radius="sm">Small</Button>
      <Button radius="md">Medium</Button>
      <Button radius="lg">Large</Button>
      <Button radius="full">Full</Button>
    </Box>
  ),
}
