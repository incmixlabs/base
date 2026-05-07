import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesXsToLgAnd2x, variantsSolidSoftOutlineGhost } from '@/theme/props/scales'
import { Combobox, type ComboboxOption } from './Combobox'
import { FieldGroup } from './FieldGroup'
import { Label } from './Label'

const frameworkOptions: ComboboxOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'ember', label: 'Ember' },
  { value: 'backbone', label: 'Backbone', disabled: true },
]

const countryOptions: ComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'br', label: 'Brazil' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
]

const longOptions: ComboboxOption[] = [
  { value: 'enterprise-growth-operations', label: 'Enterprise growth operations and lifecycle automation' },
  { value: 'field-service-dispatch', label: 'Field service dispatch, routing, and shift planning' },
  { value: 'finance-close', label: 'Finance close management with approval checkpoints' },
  { value: 'customer-success', label: 'Customer success health scoring and renewal workflows' },
]

const meta: Meta<typeof Combobox> = {
  title: 'Form/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizesXsToLgAnd2x,
    },
    variant: {
      control: 'select',
      options: variantsSolidSoftOutlineGhost,
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    creatable: { control: 'boolean' },
    placeholder: { control: 'text' },
    noResultsText: { control: 'text' },
    options: { control: false },
    value: { control: false },
    onValueChange: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

function LabeledCombobox({
  label,
  value,
  onValueChange,
  options = frameworkOptions,
  containerClassName = 'w-80',
  ...props
}: ComponentProps<typeof Combobox> & {
  label: string
  containerClassName?: string
}) {
  const labelId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-label`

  return (
    <div className={`${containerClassName} space-y-2`}>
      <Label id={labelId}>{label}</Label>
      <Combobox
        ariaLabelledby={labelId}
        options={options}
        value={value}
        onValueChange={onValueChange}
        placeholder="Search or select..."
        {...props}
      />
    </div>
  )
}

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('')

    return <LabeledCombobox {...args} label="Framework" value={value} onValueChange={setValue} />
  },
  args: {
    options: frameworkOptions,
    placeholder: 'Search frameworks...',
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('react')

    return (
      <div className="w-80 space-y-4">
        <LabeledCombobox
          label="Primary framework"
          options={frameworkOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Search frameworks..."
        />
        <div className="rounded-md bg-muted p-3 text-sm">
          <strong>Selected:</strong> {value || 'None'}
        </div>
      </div>
    )
  },
}

export const Creatable: Story = {
  render: () => {
    const [options, setOptions] = useState<ComboboxOption[]>(frameworkOptions)
    const [value, setValue] = useState('')

    return (
      <LabeledCombobox
        label="Technology"
        options={options}
        value={value}
        onValueChange={next => {
          setValue(next)
          setOptions(current =>
            current.some(option => option.value === next) ? current : [...current, { value: next, label: next }],
          )
        }}
        creatable
        placeholder="Search or create..."
      />
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {sizesXsToLgAnd2x.map(size => (
        <LabeledCombobox
          key={size}
          label={`Size ${size}`}
          size={size}
          options={frameworkOptions}
          placeholder={`Search ${size}...`}
        />
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {variantsSolidSoftOutlineGhost.map(variant => (
        <LabeledCombobox
          key={variant}
          label={variant}
          variant={variant}
          options={frameworkOptions}
          placeholder={`${variant} combobox`}
        />
      ))}
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {getPropDefValues(radiusPropDef.radius).map(radius => (
        <LabeledCombobox
          key={radius}
          label={`${radius} radius`}
          radius={radius}
          options={frameworkOptions}
          placeholder={`${radius} radius`}
        />
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {getPropDefValues(colorPropDef.color).map(color => (
        <LabeledCombobox
          key={color}
          label={color}
          color={color}
          options={frameworkOptions}
          placeholder={`${color} color`}
        />
      ))}
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <LabeledCombobox label="Country" options={countryOptions} error placeholder="Select a country..." />
      <p className="text-sm text-destructive">Select a supported country.</p>
    </div>
  ),
}

export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <LabeledCombobox label="Disabled" options={frameworkOptions} value="react" disabled />
      <LabeledCombobox label="Read only" options={frameworkOptions} value="svelte" readOnly />
    </div>
  ),
}

export const LongOptions: Story = {
  render: () => (
    <LabeledCombobox
      label="Workflow"
      options={longOptions}
      placeholder="Search workflows..."
      containerClassName="w-[28rem]"
    />
  ),
}

export const FieldGroupInheritance: Story = {
  render: () => (
    <FieldGroup size="lg" variant="soft" radius="lg">
      <LabeledCombobox label="Inherited styling" options={frameworkOptions} placeholder="Search frameworks..." />
    </FieldGroup>
  ),
}
