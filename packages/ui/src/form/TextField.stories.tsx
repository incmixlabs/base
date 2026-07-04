import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { textFieldTokens } from '@/theme/tokens'
import { TextField } from './TextField'
import { textFieldSizes, textFieldVariants } from './text-field.props'

const meta: Meta<typeof TextField> = {
  title: 'Form/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'outline',
    radius: 'md',
    color: SemanticColor.slate,
    error: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: [...textFieldSizes],
      description: 'The size of the text field',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: [...textFieldVariants, ...textFieldTokens.floatingVariant],
      description: 'The visual variant. Use floating-* variants with a label prop for floating labels.',
      table: { defaultValue: { summary: 'outline' } },
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'The accent color',
      table: { defaultValue: { summary: 'slate' } },
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
      description: 'The border radius',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Label text (required for floating-* variants)',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { defaultValue: { summary: 'false' } },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithFloatingLabel: Story = {
  name: 'With Floating Label',
  args: {
    label: 'Email address',
    variant: 'floating-outlined',
    defaultValue: 'john@example.com',
  },
}

// ============================================================================
// Variants
// ============================================================================

export const VariantOutline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline variant',
  },
}

export const VariantSoft: Story = {
  args: {
    variant: 'soft',
    placeholder: 'Soft variant',
  },
}

export const VariantGhost: Story = {
  args: {
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
}

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-md">
      <TextField variant="outline" placeholder="Outline" />
      <TextField variant="soft" placeholder="Soft" />
      <TextField variant="surface" placeholder="Surface" />
      <TextField variant="ghost" placeholder="Ghost" />
    </Box>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-md">
      {textFieldSizes.map(size => (
        <TextField key={size} size={size} placeholder={`Size ${size}`} />
      ))}
    </Box>
  ),
}

// ============================================================================
// Floating Label - Filled
// ============================================================================

export const FloatingFilled: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-filled',
  },
}

export const FloatingFilledWithValue: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-filled',
    defaultValue: 'john@example.com',
  },
}

// ============================================================================
// Floating Label - Outlined
// ============================================================================

export const FloatingOutlined: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-outlined',
  },
}

export const FloatingOutlinedWithValue: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-outlined',
    defaultValue: 'john@example.com',
  },
}

// ============================================================================
// Floating Label - Standard
// ============================================================================

export const FloatingStandard: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-standard',
  },
}

export const FloatingStandardWithValue: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-standard',
    defaultValue: 'john@example.com',
  },
}

// ============================================================================
// All Floating Label Variants
// ============================================================================

export const AllFloatingVariants: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-6 max-w-md">
      <TextField {...args} label="Filled Label" variant="floating-filled" />
      <TextField {...args} label="Outlined Label" variant="floating-outlined" />
      <TextField {...args} label="Standard Label" variant="floating-standard" />
    </Box>
  ),
}

export const FloatingRegressionStates: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-8 max-w-xl">
      <Box display="flex" className="flex-col gap-3">
        <p className="text-sm font-medium">Empty State</p>
        <TextField {...args} label="Filled" variant="floating-filled" />
        <TextField {...args} label="Outlined" variant="floating-outlined" />
        <TextField {...args} label="Standard" variant="floating-standard" />
      </Box>
      <Box display="flex" className="flex-col gap-3">
        <p className="text-sm font-medium">With Value</p>
        <TextField {...args} label="Filled" variant="floating-filled" defaultValue="john@example.com" />
        <TextField {...args} label="Outlined" variant="floating-outlined" defaultValue="john@example.com" />
        <TextField {...args} label="Standard" variant="floating-standard" defaultValue="john@example.com" />
      </Box>
      <Box display="flex" className="flex-col gap-3">
        <p className="text-sm font-medium">Focused State</p>
        <TextField {...args} label="Filled (focused)" variant="floating-filled" autoFocus />
        <TextField {...args} label="Outlined (focus manually)" variant="floating-outlined" />
        <TextField {...args} label="Standard (focus manually)" variant="floating-standard" />
      </Box>
    </Box>
  ),
}

// ============================================================================
// Floating Labels with Icons
// ============================================================================

export const FloatingWithIcons: Story = {
  render: args => (
    <Box display="flex" className="flex-col gap-6 max-w-md">
      <TextField {...args} label="Email" variant="floating-filled" leftIcon="mail" />
      <TextField {...args} label="Email" variant="floating-outlined" leftIcon="mail" />
      <TextField {...args} label="Search" variant="floating-standard" leftIcon="search" />
      <TextField {...args} defaultValue="john@example.com" label="Email" variant="floating-filled" leftIcon="mail" />
      <TextField {...args} defaultValue="john@example.com" label="Email" variant="floating-outlined" leftIcon="mail" />
      <TextField {...args} defaultValue="Search query" label="Search" variant="floating-standard" leftIcon="search" />
    </Box>
  ),
}

// ============================================================================
// Floating Labels with Colors
// ============================================================================

export const FloatingWithColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-md">
      <TextField label="Primary" variant="floating-outlined" color="primary" />
      <TextField label="Info" variant="floating-outlined" color="info" />
      <TextField label="Success" variant="floating-outlined" color="success" />
      <TextField label="Warning" variant="floating-outlined" color="warning" />
      <TextField label="Error" variant="floating-outlined" error />
    </Box>
  ),
}

// ============================================================================
// With Icons
// ============================================================================

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: 'search',
  },
}

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
    rightIcon: 'eye',
  },
}

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Enter password',
    leftIcon: 'lock',
    rightIcon: 'eye',
  },
}

// ============================================================================
// States
// ============================================================================

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid email',
    error: true,
    defaultValue: 'invalid-email',
  },
}

export const DisabledState: Story = {
  args: {
    placeholder: 'Disabled field',
    disabled: true,
  },
}

export const FloatingError: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-outlined',
    error: true,
    defaultValue: 'invalid@',
  },
}

export const FloatingDisabled: Story = {
  args: {
    label: 'Email address',
    variant: 'floating-outlined',
    disabled: true,
    defaultValue: 'disabled@example.com',
  },
}

// ============================================================================
// Real-world Examples
// ============================================================================

export const LoginForm: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-sm p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Sign In</h2>
      <TextField label="Email" variant="floating-outlined" leftIcon="mail" type="email" />
      <TextField label="Password" variant="floating-outlined" leftIcon="lock" rightIcon="eye" type="password" />
    </Box>
  ),
}

export const ContactForm: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 max-w-sm p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <TextField label="Full Name" variant="floating-filled" leftIcon="user" />
      <TextField label="Email" variant="floating-filled" leftIcon="mail" type="email" />
      <TextField label="Phone" variant="floating-filled" leftIcon="phone" type="tel" />
    </Box>
  ),
}

export const MinimalForm: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-sm p-6">
      <h2 className="text-xl font-semibold">Minimal Style</h2>
      <TextField label="First Name" variant="floating-standard" />
      <TextField label="Last Name" variant="floating-standard" />
      <TextField label="Email" variant="floating-standard" type="email" />
    </Box>
  ),
}

// ============================================================================
// Size and Floating Label Combinations
// ============================================================================

export const FloatingSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6 max-w-md">
      <TextField size="sm" label="Small" variant="floating-outlined" />
      <TextField size="md" label="Medium" variant="floating-outlined" />
      <TextField size="lg" label="Large" variant="floating-outlined" />
      <TextField size="xl" label="Extra Large" variant="floating-outlined" />
    </Box>
  ),
}
