import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { selectArgType } from '@/theme/props/storybook'
import { textFieldTokens } from '@/theme/tokens'
import { Select, SelectItem } from './Select'
import { selectPropDefs } from './select.props'

const selectItems = (
  <>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </>
)

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      ...selectArgType(selectPropDefs.Root.size),
    },
    variant: {
      ...selectArgType(selectPropDefs.Trigger.variant),
    },
    color: {
      ...selectArgType(colorPropDef.color),
    },
    radius: {
      ...selectArgType(radiusPropDef.radius),
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')
    return (
      <div className="w-64">
        <Select {...args} value={value} onValueChange={setValue}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
        </Select>
      </div>
    )
  },
  args: {
    label: 'Favorite fruit',
    placeholder: 'Select a fruit...',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      {getPropDefValues(selectPropDefs.Root.size).map(size => (
        <Select key={size} size={size} placeholder={`Size ${size}`}>
          {selectItems}
        </Select>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      {textFieldTokens.baseVariant.map(variant => (
        <Select key={variant} variant={variant} placeholder={`${variant} variant`}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
      ))}
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      {getPropDefValues(radiusPropDef.radius).map(radius => (
        <Select key={radius} radius={radius} placeholder={`${radius} radius`}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      {getPropDefValues(colorPropDef.color).map(color => (
        <Select key={color} color={color} placeholder={`${color} color`}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
      ))}
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <Select error placeholder="Select an option...">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </Select>
      <p className="text-sm text-destructive">Please select an option</p>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select disabled placeholder="Disabled select">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </Select>
    </div>
  ),
}

export const Countries: Story = {
  render: () => {
    const [value, setValue] = useState<string>('')
    return (
      <div className="w-64">
        <Select
          id="country-select"
          label="Country"
          value={value}
          onValueChange={setValue}
          placeholder="Select a country..."
        >
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
        </Select>
      </div>
    )
  },
}

export const FloatingFilled: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')
    return (
      <div className="w-64">
        <Select {...args} value={value} onValueChange={setValue}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </Select>
      </div>
    )
  },
  args: {
    label: 'Fruit',
    variant: 'floating-filled',
  },
}

export const FloatingOutlined: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')
    return (
      <div className="w-64">
        <Select {...args} value={value} onValueChange={setValue}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </Select>
      </div>
    )
  },
  args: {
    label: 'Fruit',
    variant: 'floating-outlined',
  },
}

export const FloatingStandard: Story = {
  render: args => {
    const [value, setValue] = useState<string>('')
    return (
      <div className="w-64">
        <Select {...args} value={value} onValueChange={setValue}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </Select>
      </div>
    )
  },
  args: {
    label: 'Fruit',
    variant: 'floating-standard',
  },
}

export const AllFloatingVariants: Story = {
  render: () => {
    const [v1, setV1] = useState<string>('')
    const [v2, setV2] = useState<string>('')
    const [v3, setV3] = useState<string>('')
    return (
      <div className="flex flex-col gap-6 w-64">
        <Select variant="floating-filled" label="Filled" value={v1} onValueChange={setV1}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
        <Select variant="floating-outlined" label="Outlined" value={v2} onValueChange={setV2}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
        <Select variant="floating-standard" label="Standard" value={v3} onValueChange={setV3}>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </Select>
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-64">
      <Select id="status-select" label="Status" placeholder="Select status...">
        <SelectItem value="todo">Todo</SelectItem>
        <SelectItem value="in-progress">In progress</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </Select>
    </div>
  ),
}
