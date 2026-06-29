import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Checkbox, CheckboxWithLabel } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'
import { checkboxPropDefs } from './checkbox.props'

const checkboxStorySizes = getPropDefValues(checkboxPropDefs.size)
const checkboxStoryVariants = getPropDefValues(checkboxPropDefs.variant)
const checkboxStoryColors = getPropDefValues(checkboxPropDefs.color)
const checkboxLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

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
      {checkboxStorySizes.map(size => (
        <Checkbox key={size} size={size} defaultChecked />
      ))}
    </Box>
  ),
}

export const SizesWithLabels: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4">
      {checkboxStorySizes.map(size => (
        <CheckboxWithLabel key={size} size={size} label={`${size} (${checkboxLabel(size)})`} defaultChecked />
      ))}
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
        <h3 className="text-sm font-semibold mb-4 text-muted uppercase tracking-wide">Unchecked</h3>
        <Box display="flex" className="items-center gap-6">
          {checkboxStoryVariants.map(variant => (
            <div key={variant} className="flex flex-col items-center gap-1">
              <Checkbox variant={variant} />
              <span className="text-xs text-muted">{checkboxLabel(variant)}</span>
            </div>
          ))}
        </Box>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted uppercase tracking-wide">Checked</h3>
        <Box display="flex" className="items-center gap-6">
          {checkboxStoryVariants.map(variant => (
            <div key={variant} className="flex flex-col items-center gap-1">
              <Checkbox variant={variant} defaultChecked />
              <span className="text-xs text-muted">{checkboxLabel(variant)}</span>
            </div>
          ))}
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
      {checkboxStoryVariants.map(variant => (
        <div key={variant}>
          <h3 className="text-sm font-semibold mb-4 text-muted uppercase tracking-wide">
            {checkboxLabel(variant)} Variant
          </h3>
          <Box display="flex" className="items-center gap-6">
            {checkboxStoryColors.map(color => (
              <div key={color} className="flex flex-col items-center gap-1">
                <Checkbox color={color} variant={variant} defaultChecked />
                <span className="text-xs text-muted">{checkboxLabel(color)}</span>
              </div>
            ))}
          </Box>
        </div>
      ))}
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
        <p className="text-sm text-muted">
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

        <hr className="border-neutral" />

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
          className="w-full px-4 py-2 bg-primary-solid text-primary-contrast rounded-md hover:brightness-[0.96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      {checkboxStorySizes.map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3">{size}</h3>
          <CheckboxGroup.Root size={size} defaultValue={['a']}>
            <CheckboxGroup.Item value="a" label="Option A" />
            <CheckboxGroup.Item value="b" label="Option B" />
          </CheckboxGroup.Root>
        </div>
      ))}
    </Box>
  ),
}

export const GroupVariants: Story = {
  name: 'Group - Variants',
  render: () => (
    <Box display="flex" className="gap-8">
      {checkboxStoryVariants.map(variant => (
        <div key={variant}>
          <h3 className="text-sm font-medium mb-3">{checkboxLabel(variant)}</h3>
          <CheckboxGroup.Root variant={variant} defaultValue={['a']}>
            <CheckboxGroup.Item value="a" label="Option A" />
            <CheckboxGroup.Item value="b" label="Option B" />
          </CheckboxGroup.Root>
        </div>
      ))}
    </Box>
  ),
}

export const GroupColors: Story = {
  name: 'Group - Colors',
  render: () => (
    <Box display="flex" className="flex-wrap gap-8">
      {checkboxStoryColors.map(color => (
        <div key={color}>
          <h3 className="text-sm font-medium mb-3">{checkboxLabel(color)}</h3>
          <CheckboxGroup.Root color={color} defaultValue={['a']}>
            <CheckboxGroup.Item value="a" label="Option A" />
            <CheckboxGroup.Item value="b" label="Option B" />
          </CheckboxGroup.Root>
        </div>
      ))}
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

        <div className="p-4 bg-neutral-soft rounded-md">
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
          <p className="text-sm text-muted mb-4">Choose the topics you'd like to receive updates about.</p>

          <CheckboxGroup.Root value={interests} onValueChange={setInterests} color="primary">
            <CheckboxGroup.Item value="technology" label="Technology" description="Latest tech news and innovations" />
            <CheckboxGroup.Item value="design" label="Design" description="UI/UX trends and best practices" />
            <CheckboxGroup.Item value="business" label="Business" description="Industry insights and strategies" />
            <CheckboxGroup.Item value="marketing" label="Marketing" description="Growth tips and case studies" />
          </CheckboxGroup.Root>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary-solid text-primary-contrast rounded-md hover:brightness-[0.96] transition-colors"
        >
          Save Preferences
        </button>
      </form>
    )
  },
}
