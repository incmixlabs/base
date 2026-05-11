import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building, Calendar, CreditCard, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { Button } from '@/elements/button/Button'
import { Separator } from '@/elements/separator/Separator'
import { Tabs } from '@/elements/tabs/Tabs'
import { Box } from '@/layouts/box/Box'
import { DateTimePicker } from './date'
import { FieldGroup } from './FieldGroup'
import { Fieldset } from './Fieldset'
import { LocationInput } from './LocationInput'
import { Select, SelectItem } from './Select'
import { Textarea } from './Textarea'
import { TextField } from './TextField'

const meta: Meta<typeof FieldGroup> = {
  title: 'Form/FieldGroup',
  component: FieldGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    gap: '4',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size applied to all child form fields',
    },
    variant: {
      control: 'select',
      options: [
        'classic',
        'solid',
        'soft',
        'surface',
        'outline',
        'ghost',
        'floating-filled',
        'floating-standard',
        'floating-outlined',
      ],
      description: 'Variant applied to all child form fields',
    },
    gap: {
      control: 'select',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      description: 'Gap between child elements',
      table: { defaultValue: { summary: '4' } },
    },
    layout: {
      control: 'select',
      options: ['stacked', 'inline', 'grid', 'side-labels', 'sectioned'],
      description: 'Layout mode for the field group',
      table: { defaultValue: { summary: 'stacked' } },
    },
    columns: {
      control: 'select',
      options: ['1', '2', '3', '4', '6', '12'],
      description: 'Number of grid columns (only for grid layout)',
      table: { defaultValue: { summary: '2' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
      description: 'Alignment for inline layout',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all child form fields',
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
    size: 'md',
    variant: 'outline',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="First name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" />
    </FieldGroup>
  ),
}

export const WithFloatingLabels: Story = {
  args: {
    size: 'md',
    variant: 'floating-outlined',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField label="First name" />
      <TextField label="Last name" />
      <TextField label="Email" type="email" />
    </FieldGroup>
  ),
}

// ============================================================================
// Size Variations
// ============================================================================

export const SmallSize: Story = {
  args: {
    size: 'sm',
    variant: 'outline',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Username" />
      <TextField placeholder="Password" type="password" />
    </FieldGroup>
  ),
}

export const LargeSize: Story = {
  args: {
    size: 'xl',
    variant: 'outline',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Username" />
      <TextField placeholder="Password" type="password" />
    </FieldGroup>
  ),
}

// ============================================================================
// Variant Variations
// ============================================================================

export const SolidVariant: Story = {
  args: {
    size: 'md',
    variant: 'solid',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="First name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" />
    </FieldGroup>
  ),
}

export const SoftVariant: Story = {
  args: {
    size: 'md',
    variant: 'soft',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="First name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" />
    </FieldGroup>
  ),
}

export const FloatingFilledVariant: Story = {
  args: {
    size: 'md',
    variant: 'floating-filled',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField label="First name" />
      <TextField label="Last name" />
      <TextField label="Email" type="email" />
    </FieldGroup>
  ),
}

export const FloatingStandardVariant: Story = {
  args: {
    size: 'md',
    variant: 'floating-standard',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField label="First name" />
      <TextField label="Last name" />
      <TextField label="Email" type="email" />
    </FieldGroup>
  ),
}

// ============================================================================
// Gap Variations
// ============================================================================

export const TightGap: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    gap: '2',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Field 1" />
      <TextField placeholder="Field 2" />
      <TextField placeholder="Field 3" />
    </FieldGroup>
  ),
}

export const LooseGap: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    gap: '6',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Field 1" />
      <TextField placeholder="Field 2" />
      <TextField placeholder="Field 3" />
    </FieldGroup>
  ),
}

// ============================================================================
// With Icons
// ============================================================================

export const WithIcons: Story = {
  args: {
    size: 'md',
    variant: 'outline',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Full name" leftIcon={<User />} />
      <TextField placeholder="Email" leftIcon={<Mail />} type="email" />
      <TextField placeholder="Phone" leftIcon={<Phone />} type="tel" />
    </FieldGroup>
  ),
}

export const FloatingWithIcons: Story = {
  args: {
    size: 'md',
    variant: 'floating-outlined',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField label="Full name" leftIcon={<User />} />
      <TextField label="Email" leftIcon={<Mail />} type="email" />
      <TextField label="Phone" leftIcon={<Phone />} type="tel" />
    </FieldGroup>
  ),
}

// ============================================================================
// Individual Field Overrides
// ============================================================================

export const IndividualOverrides: Story = {
  args: {
    size: 'md',
    variant: 'outline',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="Uses group size and variant" />
      <TextField placeholder="Override size to lg" size="lg" />
      <TextField placeholder="Override variant to soft" variant="soft" />
      <TextField placeholder="Override color to success" color="success" />
    </FieldGroup>
  ),
}

// ============================================================================
// Real-world Examples
// ============================================================================

export const LoginForm: Story = {
  args: {
    size: 'lg',
    variant: 'floating-outlined',
    gap: '5',
  },
  render: args => (
    <Box className="max-w-sm p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      <FieldGroup {...args}>
        <TextField label="Email" leftIcon={<Mail />} type="email" />
        <TextField label="Password" leftIcon={<Lock />} type="password" />
      </FieldGroup>
    </Box>
  ),
}

export const ContactForm: Story = {
  args: {
    size: 'md',
    variant: 'floating-filled',
    gap: '4',
  },
  render: args => (
    <Box className="max-w-sm p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
      <FieldGroup {...args}>
        <TextField label="Full Name" leftIcon={<User />} />
        <TextField label="Email" leftIcon={<Mail />} type="email" />
        <TextField label="Phone" leftIcon={<Phone />} type="tel" />
      </FieldGroup>
    </Box>
  ),
}

export const MinimalForm: Story = {
  args: {
    size: 'md',
    variant: 'floating-standard',
    gap: '6',
  },
  render: args => (
    <Box className="max-w-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Minimal Style</h2>
      <FieldGroup {...args}>
        <TextField label="First Name" />
        <TextField label="Last Name" />
        <TextField label="Email" type="email" />
      </FieldGroup>
    </Box>
  ),
}

// ============================================================================
// All Sizes Comparison
// ============================================================================

export const AllSizesComparison: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      <Box>
        <h3 className="text-sm font-medium mb-2">sm</h3>
        <FieldGroup size="sm" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">md</h3>
        <FieldGroup size="md" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">lg</h3>
        <FieldGroup size="lg" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">xl</h3>
        <FieldGroup size="xl" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
    </Box>
  ),
}

// ============================================================================
// All Variants Comparison
// ============================================================================

export const AllVariantsComparison: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      <Box>
        <h3 className="text-sm font-medium mb-2">Outline</h3>
        <FieldGroup size="md" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">Solid</h3>
        <FieldGroup size="md" variant="solid" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">Soft</h3>
        <FieldGroup size="md" variant="soft" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">Floating Outlined</h3>
        <FieldGroup size="md" variant="floating-outlined" className="max-w-md">
          <TextField label="First name" />
          <TextField label="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">Floating Filled</h3>
        <FieldGroup size="md" variant="floating-filled" className="max-w-md">
          <TextField label="First name" />
          <TextField label="Last name" />
        </FieldGroup>
      </Box>
      <Box>
        <h3 className="text-sm font-medium mb-2">Floating Standard</h3>
        <FieldGroup size="md" variant="floating-standard" className="max-w-md">
          <TextField label="First name" />
          <TextField label="Last name" />
        </FieldGroup>
      </Box>
    </Box>
  ),
}

// ============================================================================
// Layout Modes
// ============================================================================

export const StackedLayout: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    layout: 'stacked',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-md">
      <TextField placeholder="First name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" />
    </FieldGroup>
  ),
}

export const InlineLayout: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    layout: 'inline',
    gap: '4',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-2xl">
      <TextField placeholder="First name" className="flex-1 min-w-[150px]" />
      <TextField placeholder="Last name" className="flex-1 min-w-[150px]" />
      <Button type="button">Submit</Button>
    </FieldGroup>
  ),
}

export const GridLayout: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    layout: 'grid',
    columns: '2',
    gap: '4',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-2xl">
      <TextField placeholder="First name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" className="col-span-full" />
      <TextField placeholder="Phone" type="tel" />
      <TextField placeholder="Company" />
    </FieldGroup>
  ),
}

/**
 * Responsive grid using design tokens.
 * Columns can be a single value or a responsive object with breakpoints.
 * Resize the browser window to see the columns change.
 */
export const GridLayoutResponsive: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    layout: 'grid',
    gap: '4',
  },
  argTypes: {
    columns: { table: { disable: true } },
  },
  render: args => (
    <FieldGroup {...args} columns={{ initial: '1', sm: '2', lg: '3' }} className="w-full">
      <TextField placeholder="First name" />
      <TextField placeholder="Middle name" />
      <TextField placeholder="Last name" />
      <TextField placeholder="Email" type="email" />
      <TextField placeholder="Phone" type="tel" />
      <TextField placeholder="Company" />
    </FieldGroup>
  ),
}

export const InheritedMixedControls: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    gap: '4',
  },
  render: args => (
    <Box className="max-w-3xl space-y-6">
      <FieldGroup {...args} layout="grid" columns="2">
        <TextField label="Trip name" placeholder="Summer planning" />
        <Select label="Travel class" placeholder="Select class">
          <SelectItem value="economy">economy</SelectItem>
          <SelectItem value="premium">premium</SelectItem>
          <SelectItem value="business">business</SelectItem>
        </Select>
        <LocationInput
          label="Destination country"
          countryPlaceholder="Select country"
          statePlaceholder="Select state"
          showStateSelector={false}
        />
        <DateTimePicker ariaLabel="Departure" label="Departure" />
        <div className="col-span-full">
          <Textarea placeholder="Notes" />
        </div>
      </FieldGroup>
    </Box>
  ),
}

export const NestedInheritanceWithoutFieldset: Story = {
  args: {
    size: 'lg',
    variant: 'soft',
    gap: '4',
  },
  render: args => (
    <Box className="max-w-3xl space-y-6">
      <FieldGroup {...args}>
        <TextField label="Primary contact" placeholder="Jane Doe" />
        <FieldGroup layout="grid" columns="2">
          <TextField label="Email" placeholder="name@example.com" />
          <DateTimePicker ariaLabel="Departure time" />
          <div className="col-span-full">
            <Textarea placeholder="Internal note" />
          </div>
        </FieldGroup>
      </FieldGroup>
    </Box>
  ),
}

export const OptionalFieldsetLayering: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    gap: '4',
  },
  render: args => (
    <Box className="max-w-4xl space-y-8">
      <Box>
        <h3 className="mb-3 text-sm font-medium text-foreground">FieldGroup only</h3>
        <FieldGroup {...args} layout="grid" columns="2">
          <TextField label="Full name" placeholder="Traveler full name" />
          <TextField label="Email address" placeholder="name@example.com" />
          <div className="col-span-full">
            <Textarea placeholder="Optional notes" />
          </div>
        </FieldGroup>
      </Box>

      <Box>
        <h3 className="mb-3 text-sm font-medium text-foreground">FieldGroup inside optional Fieldset</h3>
        <Fieldset
          legend="Traveler information"
          description="Fieldset adds semantic/visual grouping on top of FieldGroup."
        >
          <FieldGroup {...args} layout="grid" columns="2">
            <TextField label="Full name" placeholder="Traveler full name" />
            <TextField label="Email address" placeholder="name@example.com" />
            <div className="col-span-full">
              <Textarea placeholder="Optional notes" />
            </div>
          </FieldGroup>
        </Fieldset>
      </Box>
    </Box>
  ),
}

export const SideLabelsLayout: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    layout: 'side-labels',
    gap: '6',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-3xl">
      <FieldGroup.Row label="Personal Information" description="Your basic contact details">
        <TextField placeholder="Full name" leftIcon={<User />} />
        <TextField placeholder="Email address" leftIcon={<Mail />} type="email" />
        <TextField placeholder="Phone number" leftIcon={<Phone />} type="tel" />
      </FieldGroup.Row>
      <Separator />
      <FieldGroup.Row label="Address" description="Where should we ship to?">
        <TextField placeholder="Street address" leftIcon={<MapPin />} />
        <TextField placeholder="City" />
        <TextField placeholder="State / Province" />
        <TextField placeholder="ZIP / Postal code" />
      </FieldGroup.Row>
    </FieldGroup>
  ),
}

export const EmbeddedSideLabels: Story = {
  render: () => {
    const previewWidths = {
      wide: 1040,
      medium: 720,
      narrow: 360,
    } as const

    return (
      <Tabs.Root defaultValue="wide">
        <Tabs.List>
          <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
          <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
          <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
        </Tabs.List>

        {Object.entries(previewWidths).map(([viewport, width]) => (
          <Tabs.Content key={viewport} value={viewport}>
            <Box className="space-y-3 pt-4">
              <h3 className="text-sm font-medium text-foreground">Preview width: {width}px</h3>
              <Box className="border rounded-xl p-4 bg-background" style={{ width }}>
                <FieldGroup layout="side-labels" size="md" variant="outline" gap="4">
                  <FieldGroup.Row
                    label="Contact"
                    description="This row should only switch into the two-column side-label layout when the preview container is wide enough."
                  >
                    <TextField placeholder="Email" leftIcon={<Mail />} type="email" />
                    <TextField placeholder="Phone" leftIcon={<Phone />} type="tel" />
                  </FieldGroup.Row>
                </FieldGroup>
              </Box>
            </Box>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    )
  },
}

export const SectionedLayout: Story = {
  args: {
    size: 'md',
    variant: 'floating-outlined',
    layout: 'sectioned',
  },
  render: args => (
    <FieldGroup {...args} className="max-w-lg">
      <FieldGroup.Section title="Account Details" description="Basic account information" separator={false}>
        <TextField label="Username" leftIcon={<User />} />
        <TextField label="Email" leftIcon={<Mail />} type="email" />
      </FieldGroup.Section>
      <FieldGroup.Section title="Personal Information" description="Tell us about yourself">
        <TextField label="Full name" />
        <TextField label="Phone" leftIcon={<Phone />} type="tel" />
      </FieldGroup.Section>
      <FieldGroup.Section title="Billing" description="Payment details">
        <TextField label="Card number" leftIcon={<CreditCard />} />
        <TextField label="Expiry date" leftIcon={<Calendar />} />
      </FieldGroup.Section>
    </FieldGroup>
  ),
}

// ============================================================================
// Layout Comparison
// ============================================================================

export const AllLayoutsComparison: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-12">
      <Box>
        <h3 className="text-lg font-semibold mb-4">Stacked Layout (Default)</h3>
        <FieldGroup layout="stacked" size="md" variant="outline" className="max-w-md">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
          <TextField placeholder="Email" type="email" />
        </FieldGroup>
      </Box>

      <Box>
        <h3 className="text-lg font-semibold mb-4">Inline Layout</h3>
        <FieldGroup layout="inline" size="md" variant="outline" gap="4" className="max-w-2xl">
          <TextField placeholder="Search..." className="flex-1" />
          <Button type="button">Search</Button>
        </FieldGroup>
      </Box>

      <Box>
        <h3 className="text-lg font-semibold mb-4">Grid Layout (2 columns)</h3>
        <FieldGroup layout="grid" columns="2" size="md" variant="outline" gap="4" className="max-w-2xl">
          <TextField placeholder="First name" />
          <TextField placeholder="Last name" />
          <TextField placeholder="Email" type="email" className="col-span-full" />
        </FieldGroup>
      </Box>

      <Box>
        <h3 className="text-lg font-semibold mb-4">Side Labels Layout</h3>
        <FieldGroup layout="side-labels" size="md" variant="outline" gap="4" className="max-w-3xl">
          <FieldGroup.Row label="Contact" description="How can we reach you?">
            <TextField placeholder="Email" leftIcon={<Mail />} type="email" />
            <TextField placeholder="Phone" leftIcon={<Phone />} type="tel" />
          </FieldGroup.Row>
        </FieldGroup>
      </Box>

      <Box>
        <h3 className="text-lg font-semibold mb-4">Sectioned Layout</h3>
        <FieldGroup layout="sectioned" size="md" variant="outline" className="max-w-lg">
          <FieldGroup.Section title="Personal" separator={false}>
            <TextField placeholder="Name" leftIcon={<User />} />
          </FieldGroup.Section>
          <FieldGroup.Section title="Work">
            <TextField placeholder="Company" leftIcon={<Building />} />
          </FieldGroup.Section>
        </FieldGroup>
      </Box>
    </Box>
  ),
}

// ============================================================================
// Real-world Form Examples
// ============================================================================

export const CheckoutForm: Story = {
  render: () => (
    <Box className="max-w-2xl p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Checkout</h2>
      <FieldGroup layout="sectioned" size="md" variant="floating-outlined">
        <FieldGroup.Section title="Shipping Address" separator={false}>
          <FieldGroup layout="grid" columns="2" gap="4">
            <TextField label="First name" />
            <TextField label="Last name" />
            <TextField label="Address" className="col-span-full" leftIcon={<MapPin />} />
            <TextField label="City" />
            <TextField label="ZIP Code" />
          </FieldGroup>
        </FieldGroup.Section>
        <FieldGroup.Section title="Payment Information">
          <FieldGroup layout="grid" columns="2" gap="4">
            <TextField label="Card number" className="col-span-full" leftIcon={<CreditCard />} />
            <TextField label="Expiry date" leftIcon={<Calendar />} />
            <TextField label="CVV" type="password" leftIcon={<Lock />} />
          </FieldGroup>
        </FieldGroup.Section>
      </FieldGroup>
    </Box>
  ),
}

/**
 * SettingsForm example using side-labels layout.
 * Note: This story uses FieldGroup.Row which only works with side-labels layout.
 * For other layouts, see the dedicated layout stories (StackedLayout, InlineLayout, etc.)
 */
export const SettingsForm: Story = {
  args: {
    size: 'md',
    variant: 'outline',
    gap: '6',
  },
  argTypes: {
    // Hide layout control since this example only works with side-labels
    layout: { table: { disable: true } },
    columns: { table: { disable: true } },
    align: { table: { disable: true } },
  },
  render: args => (
    <Box className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
      <FieldGroup {...args} layout="side-labels">
        <FieldGroup.Row label="Profile" description="Your public profile information">
          <TextField placeholder="Display name" leftIcon={<User />} />
          <TextField placeholder="Bio" />
        </FieldGroup.Row>
        <Separator />
        <FieldGroup.Row label="Contact" description="How others can reach you">
          <TextField placeholder="Email" leftIcon={<Mail />} type="email" />
          <TextField placeholder="Phone" leftIcon={<Phone />} type="tel" />
        </FieldGroup.Row>
        <Separator />
        <FieldGroup.Row label="Company" description="Your organization details">
          <TextField placeholder="Company name" leftIcon={<Building />} />
          <TextField placeholder="Job title" />
        </FieldGroup.Row>
      </FieldGroup>
    </Box>
  ),
}
