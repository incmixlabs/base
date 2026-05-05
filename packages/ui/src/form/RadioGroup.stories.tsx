import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { RadioGroup } from './RadioGroup'
import { radioGroupRootPropDefs } from './radio-group.props'

const meta: Meta<typeof RadioGroup.Root> = {
  title: 'Form/RadioGroup',
  component: RadioGroup.Root,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: selectArgType(radioGroupRootPropDefs.size),
    variant: selectArgType(radioGroupRootPropDefs.variant),
    color: selectArgType(radioGroupRootPropDefs.color),
    orientation: selectArgType(radioGroupRootPropDefs.orientation),
    disabled: { control: 'boolean' },
    highContrast: { control: 'boolean' },
  },
}

export default meta

export const Default: StoryObj = {
  render: () => {
    const [value, setValue] = useState('option1')
    return (
      <RadioGroup.Root value={value} onValueChange={setValue}>
        <RadioGroup.Item value="option1" label="Option 1" />
        <RadioGroup.Item value="option2" label="Option 2" />
        <RadioGroup.Item value="option3" label="Option 3" />
      </RadioGroup.Root>
    )
  },
}

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex gap-8">
      {getPropDefValues(radioGroupRootPropDefs.size).map(size => (
        <div key={size}>
          <p className="text-sm font-medium mb-2">Size {size}</p>
          <RadioGroup.Root size={size} defaultValue="a">
            <RadioGroup.Item value="a" label="Option A" />
            <RadioGroup.Item value="b" label="Option B" />
            <RadioGroup.Item value="c" label="Option C" />
          </RadioGroup.Root>
        </div>
      ))}
    </div>
  ),
}

export const Colors: StoryObj = {
  render: () => (
    <div className="flex gap-8">
      {getPropDefValues(radioGroupRootPropDefs.color).map(color => (
        <div key={color}>
          <p className="text-sm font-medium mb-2 capitalize">{color}</p>
          <RadioGroup.Root color={color} defaultValue="a">
            <RadioGroup.Item value="a" label="Option A" />
            <RadioGroup.Item value="b" label="Option B" />
          </RadioGroup.Root>
        </div>
      ))}
    </div>
  ),
}

export const Horizontal: StoryObj = {
  render: () => (
    <RadioGroup.Root orientation="horizontal" defaultValue="small">
      <RadioGroup.Item value="small" label="Small" />
      <RadioGroup.Item value="medium" label="Medium" />
      <RadioGroup.Item value="large" label="Large" />
    </RadioGroup.Root>
  ),
}

export const Disabled: StoryObj = {
  render: () => (
    <RadioGroup.Root disabled defaultValue="option1">
      <RadioGroup.Item value="option1" label="Option 1" />
      <RadioGroup.Item value="option2" label="Option 2" />
      <RadioGroup.Item value="option3" label="Option 3" />
    </RadioGroup.Root>
  ),
}

export const IndividualDisabled: StoryObj = {
  render: () => (
    <RadioGroup.Root defaultValue="free">
      <RadioGroup.Item value="free" label="Free Plan" />
      <RadioGroup.Item value="pro" label="Pro Plan" />
      <RadioGroup.Item value="enterprise" label="Enterprise (Contact Sales)" disabled />
    </RadioGroup.Root>
  ),
}

export const PlanSelection: StoryObj = {
  render: () => {
    const [plan, setPlan] = useState('starter')

    return (
      <div className="w-80 p-4 border rounded-lg">
        <h3 className="font-semibold mb-4">Select a Plan</h3>
        <RadioGroup.Root value={plan} onValueChange={setPlan} size="md">
          <RadioGroup.Item value="starter">
            <div>
              <span className="font-medium">Starter</span>
              <span className="text-muted-foreground ml-2">$9/month</span>
            </div>
          </RadioGroup.Item>
          <RadioGroup.Item value="pro">
            <div>
              <span className="font-medium">Pro</span>
              <span className="text-muted-foreground ml-2">$29/month</span>
            </div>
          </RadioGroup.Item>
          <RadioGroup.Item value="enterprise">
            <div>
              <span className="font-medium">Enterprise</span>
              <span className="text-muted-foreground ml-2">$99/month</span>
            </div>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <p className="mt-4 text-sm text-muted-foreground">
          Selected: <span className="font-medium capitalize">{plan}</span>
        </p>
      </div>
    )
  },
}

export const ShippingMethod: StoryObj = {
  render: () => {
    const [method, setMethod] = useState('standard')

    return (
      <div className="w-96">
        <h3 className="font-semibold mb-4">Shipping Method</h3>
        <RadioGroup.Root value={method} onValueChange={setMethod} color="primary">
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroup.Item value="standard" />
              <div className="flex-1">
                <p className="font-medium">Standard Shipping</p>
                <p className="text-sm text-muted-foreground">5-7 business days</p>
              </div>
              <span className="font-medium">$4.99</span>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroup.Item value="express" />
              <div className="flex-1">
                <p className="font-medium">Express Shipping</p>
                <p className="text-sm text-muted-foreground">2-3 business days</p>
              </div>
              <span className="font-medium">$14.99</span>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroup.Item value="overnight" />
              <div className="flex-1">
                <p className="font-medium">Overnight Shipping</p>
                <p className="text-sm text-muted-foreground">Next business day</p>
              </div>
              <span className="font-medium">$29.99</span>
            </label>
          </div>
        </RadioGroup.Root>
      </div>
    )
  },
}
