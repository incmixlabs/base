import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Checkbox, CheckboxWithLabel } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'
import { checkboxPropDefs } from './checkbox.props'

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(checkboxPropDefs.size),
      description: 'The size of the checkbox',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(checkboxPropDefs.variant),
      description: 'The visual variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(checkboxPropDefs.color),
      description: 'The accent color',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    highContrast: {
      control: 'boolean',
      description: 'Whether to apply high-contrast styling',
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
    defaultChecked: true,
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-4">
      <Checkbox size="xs" defaultChecked />
      <Checkbox size="sm" defaultChecked />
      <Checkbox size="md" defaultChecked />
      <Checkbox size="lg" defaultChecked />
    </Box>
  ),
}

export const SizesWithLabels: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <CheckboxWithLabel size="xs" label="xs (Extra Small)" defaultChecked />
      <CheckboxWithLabel size="sm" label="sm (Small, default)" defaultChecked />
      <CheckboxWithLabel size="md" label="md (Medium)" defaultChecked />
      <CheckboxWithLabel size="lg" label="lg (Large)" defaultChecked />
    </Box>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const VariantSolid: Story = {
  args: {
    variant: 'solid',
    defaultChecked: true,
  },
}

export const VariantSoft: Story = {
  args: {
    variant: 'soft',
    defaultChecked: true,
  },
}

export const VariantOutline: Story = {
  args: {
    variant: 'outline',
    defaultChecked: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Unchecked</h3>
        <Box display="flex" className="items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="solid" />
            <span className="text-xs text-muted-foreground">Solid</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="soft" />
            <span className="text-xs text-muted-foreground">Soft</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="outline" />
            <span className="text-xs text-muted-foreground">Outline</span>
          </div>
        </Box>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Checked</h3>
        <Box display="flex" className="items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Solid</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Soft</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Outline</span>
          </div>
        </Box>
      </div>
    </Box>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-10">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Solid Variant</h3>
        <Box display="flex" className="items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="slate" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Slate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="primary" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="info" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Info</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="success" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="warning" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="error" variant="solid" defaultChecked />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
        </Box>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Soft Variant</h3>
        <Box display="flex" className="items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="slate" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Slate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="primary" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="info" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Info</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="success" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="warning" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="error" variant="soft" defaultChecked />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
        </Box>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Outline Variant</h3>
        <Box display="flex" className="items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="slate" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Slate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="primary" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="info" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Info</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="success" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="warning" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Checkbox color="error" variant="outline" defaultChecked />
            <span className="text-xs text-muted-foreground">Error</span>
          </div>
        </Box>
      </div>
    </Box>
  ),
}

// ============================================================================
// With Labels
// ============================================================================

export const WithLabel: Story = {
  render: () => <CheckboxWithLabel label="Accept terms and conditions" defaultChecked />,
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <CheckboxWithLabel label="Marketing emails" description="Receive emails about new products, features, and more." />
  ),
}

export const MultipleWithLabels: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      <CheckboxWithLabel
        label="Email notifications"
        description="Get notified by email when someone mentions you."
        defaultChecked
      />
      <CheckboxWithLabel label="Push notifications" description="Get push notifications on your device." />
      <CheckboxWithLabel label="SMS notifications" description="Get text messages for important updates." disabled />
    </Box>
  ),
}

// ============================================================================
// Controlled Example
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)

    return (
      <Box display="flex" className="flex-col gap-4">
        <CheckboxWithLabel
          label={`Checkbox is ${checked ? 'checked' : 'unchecked'}`}
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-sm text-muted-foreground">
          Current state: <code>{String(checked)}</code>
        </p>
      </Box>
    )
  },
}

// ============================================================================
// Indeterminate State
// ============================================================================

export const IndeterminateExample: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState([true, false, true])

    const allChecked = checkedItems.every(Boolean)
    const someChecked = checkedItems.some(Boolean)

    return (
      <Box display="flex" className="flex-col gap-2">
        <CheckboxWithLabel
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onCheckedChange={checked => {
            setCheckedItems([checked, checked, checked])
          }}
        />
        <Box display="flex" className="flex-col gap-2 ml-6">
          <CheckboxWithLabel
            label="Option 1"
            checked={checkedItems[0]}
            onCheckedChange={checked => {
              setCheckedItems([checked, checkedItems[1], checkedItems[2]])
            }}
          />
          <CheckboxWithLabel
            label="Option 2"
            checked={checkedItems[1]}
            onCheckedChange={checked => {
              setCheckedItems([checkedItems[0], checked, checkedItems[2]])
            }}
          />
          <CheckboxWithLabel
            label="Option 3"
            checked={checkedItems[2]}
            onCheckedChange={checked => {
              setCheckedItems([checkedItems[0], checkedItems[1], checked])
            }}
          />
        </Box>
      </Box>
    )
  },
}

// ============================================================================
// Form Example
// ============================================================================

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      newsletter: true,
      marketing: false,
      partners: false,
      terms: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Form submitted:', formData)
      alert(`Form submitted!\n${JSON.stringify(formData, null, 2)}`)
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <h3 className="text-lg font-medium">Email Preferences</h3>

        <Box display="flex" className="flex-col gap-4">
          <CheckboxWithLabel
            label="Newsletter"
            description="Weekly digest of the best content."
            checked={formData.newsletter}
            onCheckedChange={checked => setFormData({ ...formData, newsletter: checked })}
          />
          <CheckboxWithLabel
            label="Marketing emails"
            description="Updates about products and promotions."
            checked={formData.marketing}
            onCheckedChange={checked => setFormData({ ...formData, marketing: checked })}
          />
          <CheckboxWithLabel
            label="Partner offers"
            description="Exclusive offers from our partners."
            checked={formData.partners}
            onCheckedChange={checked => setFormData({ ...formData, partners: checked })}
          />
        </Box>

        <hr className="border-border" />

        <CheckboxWithLabel
          label="I agree to the terms and conditions"
          color={formData.terms ? SemanticColor.success : SemanticColor.slate}
          checked={formData.terms}
          onCheckedChange={checked => setFormData({ ...formData, terms: checked })}
          required
        />

        <button
          type="submit"
          disabled={!formData.terms}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Preferences
        </button>
      </form>
    )
  },
}

// ============================================================================
// All States Grid
// ============================================================================

export const AllStatesGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-sm font-medium">State</div>
      <div className="text-sm font-medium">Solid</div>
      <div className="text-sm font-medium">Soft</div>
      <div className="text-sm font-medium">Outline</div>

      <div className="text-sm">Unchecked</div>
      <Checkbox variant="solid" />
      <Checkbox variant="soft" />
      <Checkbox variant="outline" />

      <div className="text-sm">Checked</div>
      <Checkbox variant="solid" defaultChecked />
      <Checkbox variant="soft" defaultChecked />
      <Checkbox variant="outline" defaultChecked />

      <div className="text-sm">Indeterminate</div>
      <Checkbox variant="solid" indeterminate />
      <Checkbox variant="soft" indeterminate />
      <Checkbox variant="outline" indeterminate />

      <div className="text-sm">Disabled</div>
      <Checkbox variant="solid" disabled />
      <Checkbox variant="soft" disabled />
      <Checkbox variant="outline" disabled />

      <div className="text-sm">Disabled Checked</div>
      <Checkbox variant="solid" disabled defaultChecked />
      <Checkbox variant="soft" disabled defaultChecked />
      <Checkbox variant="outline" disabled defaultChecked />
    </div>
  ),
}

// ============================================================================
// CheckboxGroup Examples
// ============================================================================

export const GroupBasic: Story = {
  name: 'Group - Basic',
  render: () => (
    <CheckboxGroup.Root defaultValue={['option1']}>
      <CheckboxGroup.Item value="option1" label="Option 1" />
      <CheckboxGroup.Item value="option2" label="Option 2" />
      <CheckboxGroup.Item value="option3" label="Option 3" />
    </CheckboxGroup.Root>
  ),
}

export const GroupWithDescriptions: Story = {
  name: 'Group - With Descriptions',
  render: () => (
    <CheckboxGroup.Root defaultValue={['email']}>
      <CheckboxGroup.Item value="email" label="Email notifications" description="Receive notifications via email." />
      <CheckboxGroup.Item
        value="push"
        label="Push notifications"
        description="Receive push notifications on your device."
      />
      <CheckboxGroup.Item value="sms" label="SMS notifications" description="Receive text message notifications." />
    </CheckboxGroup.Root>
  ),
}

export const GroupSizes: Story = {
  name: 'Group - Sizes',
  render: () => (
    <Box display="flex" className="gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">xs</h3>
        <CheckboxGroup.Root size="xs" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">sm</h3>
        <CheckboxGroup.Root size="sm" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">md</h3>
        <CheckboxGroup.Root size="md" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">lg</h3>
        <CheckboxGroup.Root size="lg" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
    </Box>
  ),
}

export const GroupVariants: Story = {
  name: 'Group - Variants',
  render: () => (
    <Box display="flex" className="gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">Solid</h3>
        <CheckboxGroup.Root variant="solid" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Soft</h3>
        <CheckboxGroup.Root variant="soft" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Outline</h3>
        <CheckboxGroup.Root variant="outline" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
    </Box>
  ),
}

export const GroupColors: Story = {
  name: 'Group - Colors',
  render: () => (
    <Box display="flex" className="flex-wrap gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">Primary</h3>
        <CheckboxGroup.Root color="primary" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Info</h3>
        <CheckboxGroup.Root color="info" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Success</h3>
        <CheckboxGroup.Root color="success" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Warning</h3>
        <CheckboxGroup.Root color="warning" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Error</h3>
        <CheckboxGroup.Root color="error" defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
        </CheckboxGroup.Root>
      </div>
    </Box>
  ),
}

export const GroupDisabled: Story = {
  name: 'Group - Disabled',
  render: () => (
    <Box display="flex" className="gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">All Disabled</h3>
        <CheckboxGroup.Root disabled defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" />
          <CheckboxGroup.Item value="c" label="Option C" />
        </CheckboxGroup.Root>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Single Item Disabled</h3>
        <CheckboxGroup.Root defaultValue={['a']}>
          <CheckboxGroup.Item value="a" label="Option A" />
          <CheckboxGroup.Item value="b" label="Option B" disabled />
          <CheckboxGroup.Item value="c" label="Option C" />
        </CheckboxGroup.Root>
      </div>
    </Box>
  ),
}

export const GroupControlled: Story = {
  name: 'Group - Controlled',
  render: () => {
    const [values, setValues] = React.useState<string[]>(['newsletter'])

    return (
      <Box display="flex" className="flex-col gap-4">
        <CheckboxGroup.Root value={values} onValueChange={setValues}>
          <CheckboxGroup.Item value="newsletter" label="Newsletter" />
          <CheckboxGroup.Item value="updates" label="Product Updates" />
          <CheckboxGroup.Item value="marketing" label="Marketing" />
        </CheckboxGroup.Root>

        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium">Selected values:</p>
          <code className="text-sm">{values.length > 0 ? values.join(', ') : 'none'}</code>
        </div>
      </Box>
    )
  },
}

export const GroupFormExample: Story = {
  name: 'Group - Form Example',
  render: () => {
    const [interests, setInterests] = React.useState<string[]>([])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(`Selected interests: ${interests.join(', ') || 'none'}`)
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Select your interests</h3>
          <p className="text-sm text-muted-foreground mb-4">Choose the topics you'd like to receive updates about.</p>

          <CheckboxGroup.Root value={interests} onValueChange={setInterests} color="primary">
            <CheckboxGroup.Item value="technology" label="Technology" description="Latest tech news and innovations" />
            <CheckboxGroup.Item value="design" label="Design" description="UI/UX trends and best practices" />
            <CheckboxGroup.Item value="business" label="Business" description="Industry insights and strategies" />
            <CheckboxGroup.Item value="marketing" label="Marketing" description="Growth tips and case studies" />
          </CheckboxGroup.Root>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Save Preferences
        </button>
      </form>
    )
  },
}
