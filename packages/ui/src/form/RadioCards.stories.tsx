import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, Landmark, Smartphone, Truck, Wallet, Zap } from 'lucide-react'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { RadioCards } from './RadioCards'
import { radioCardsRootPropDefs } from './radio-cards.props'

const meta: Meta<typeof RadioCards.Root> = {
  title: 'Form/RadioCards',
  component: RadioCards.Root,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: selectArgType(radioCardsRootPropDefs.size),
    variant: selectArgType(radioCardsRootPropDefs.variant),
    color: selectArgType(radioCardsRootPropDefs.color),
    highContrast: {
      control: 'boolean',
      description: 'Whether to apply high-contrast styles',
    },
    columns: {
      control: 'text',
      description: 'Number of columns or CSS grid template',
    },
    gap: selectArgType(radioCardsRootPropDefs.gap),
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    size: 'sm',
    variant: 'surface',
    color: SemanticColor.neutral,
    columns: 3,
    gap: '4',
  },
  render: args => (
    <RadioCards.Root defaultValue="1" {...args}>
      <RadioCards.Item value="1">
        <div className="font-medium">Option 1</div>
        <div className="text-neutral opacity-70">Description for option 1</div>
      </RadioCards.Item>
      <RadioCards.Item value="2">
        <div className="font-medium">Option 2</div>
        <div className="text-neutral opacity-70">Description for option 2</div>
      </RadioCards.Item>
      <RadioCards.Item value="3">
        <div className="font-medium">Option 3</div>
        <div className="text-neutral opacity-70">Description for option 3</div>
      </RadioCards.Item>
    </RadioCards.Root>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <RadioCards.Root defaultValue="card" columns={3}>
      <RadioCards.Item value="card">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="font-medium">Credit Card</span>
        </div>
        <div className="text-neutral opacity-70">Pay with Visa, Mastercard</div>
      </RadioCards.Item>
      <RadioCards.Item value="bank">
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4" />
          <span className="font-medium">Bank Transfer</span>
        </div>
        <div className="text-neutral opacity-70">Direct bank payment</div>
      </RadioCards.Item>
      <RadioCards.Item value="wallet">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-medium">Digital Wallet</span>
        </div>
        <div className="text-neutral opacity-70">Apple Pay, Google Pay</div>
      </RadioCards.Item>
    </RadioCards.Root>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      {getPropDefValues(radioCardsRootPropDefs.size).map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3">Size {size}</h3>
          <RadioCards.Root size={size} columns={3} defaultValue="a">
            <RadioCards.Item value="a">
              <div className="font-medium">Option A</div>
            </RadioCards.Item>
            <RadioCards.Item value="b">
              <div className="font-medium">Option B</div>
            </RadioCards.Item>
            <RadioCards.Item value="c">
              <div className="font-medium">Option C</div>
            </RadioCards.Item>
          </RadioCards.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const VariantSurface: Story = {
  render: () => (
    <RadioCards.Root variant="surface" columns={3} defaultValue="1">
      <RadioCards.Item value="1">
        <div className="font-medium">Surface Card</div>
        <div className="text-neutral opacity-70">With subtle shadow</div>
      </RadioCards.Item>
      <RadioCards.Item value="2">
        <div className="font-medium">Surface Card</div>
        <div className="text-neutral opacity-70">With subtle shadow</div>
      </RadioCards.Item>
      <RadioCards.Item value="3">
        <div className="font-medium">Surface Card</div>
        <div className="text-neutral opacity-70">With subtle shadow</div>
      </RadioCards.Item>
    </RadioCards.Root>
  ),
}

export const VariantClassic: Story = {
  render: () => (
    <RadioCards.Root variant="classic" columns={3} defaultValue="1">
      <RadioCards.Item value="1">
        <div className="font-medium">Classic Card</div>
        <div className="text-neutral opacity-70">More prominent shadow</div>
      </RadioCards.Item>
      <RadioCards.Item value="2">
        <div className="font-medium">Classic Card</div>
        <div className="text-neutral opacity-70">More prominent shadow</div>
      </RadioCards.Item>
      <RadioCards.Item value="3">
        <div className="font-medium">Classic Card</div>
        <div className="text-neutral opacity-70">More prominent shadow</div>
      </RadioCards.Item>
    </RadioCards.Root>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      {getPropDefValues(radioCardsRootPropDefs.color).map(color => (
        <div key={color}>
          <h3 className="text-sm font-medium mb-3 capitalize">{color}</h3>
          <RadioCards.Root color={color} columns={3} defaultValue="1">
            <RadioCards.Item value="1">
              <div className="font-medium">Selected</div>
            </RadioCards.Item>
            <RadioCards.Item value="2">
              <div className="font-medium">Unselected</div>
            </RadioCards.Item>
            <RadioCards.Item value="3">
              <div className="font-medium">Unselected</div>
            </RadioCards.Item>
          </RadioCards.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Columns
// ============================================================================

export const ColumnLayouts: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">1 Column</h3>
        <RadioCards.Root columns={1} defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Full Width</div>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <div className="font-medium">Full Width</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">2 Columns</h3>
        <RadioCards.Root columns={2} defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Half Width</div>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <div className="font-medium">Half Width</div>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <div className="font-medium">Half Width</div>
          </RadioCards.Item>
          <RadioCards.Item value="4">
            <div className="font-medium">Half Width</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">4 Columns</h3>
        <RadioCards.Root columns={4} defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Quarter</div>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <div className="font-medium">Quarter</div>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <div className="font-medium">Quarter</div>
          </RadioCards.Item>
          <RadioCards.Item value="4">
            <div className="font-medium">Quarter</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Auto (minmax 160px default)</h3>
        <RadioCards.Root defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Auto</div>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <div className="font-medium">Auto</div>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <div className="font-medium">Auto</div>
          </RadioCards.Item>
          <RadioCards.Item value="4">
            <div className="font-medium">Auto</div>
          </RadioCards.Item>
          <RadioCards.Item value="5">
            <div className="font-medium">Auto</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>
    </Box>
  ),
}

// ============================================================================
// Disabled States
// ============================================================================

export const Disabled: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium mb-3">All Disabled</h3>
        <RadioCards.Root disabled columns={3} defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Disabled</div>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <div className="font-medium">Disabled</div>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <div className="font-medium">Disabled</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Single Item Disabled</h3>
        <RadioCards.Root columns={3} defaultValue="1">
          <RadioCards.Item value="1">
            <div className="font-medium">Enabled</div>
          </RadioCards.Item>
          <RadioCards.Item value="2" disabled>
            <div className="font-medium">Disabled</div>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <div className="font-medium">Enabled</div>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>
    </Box>
  ),
}

// ============================================================================
// Controlled Example
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('standard')

    return (
      <Box display="flex" className="flex-col gap-4">
        <RadioCards.Root value={value} onValueChange={setValue} columns={3} color="primary">
          <RadioCards.Item value="standard">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span className="font-medium">Standard</span>
            </div>
            <div className="text-neutral opacity-70">5-7 days</div>
          </RadioCards.Item>
          <RadioCards.Item value="express">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Express</span>
            </div>
            <div className="text-neutral opacity-70">2-3 days</div>
          </RadioCards.Item>
          <RadioCards.Item value="overnight">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Overnight</span>
            </div>
            <div className="text-neutral opacity-70">Next day</div>
          </RadioCards.Item>
        </RadioCards.Root>

        <div className="p-4 bg-neutral-soft rounded-md">
          <p className="text-sm font-medium">Selected shipping:</p>
          <code className="text-sm">{value}</code>
        </div>
      </Box>
    )
  },
}

// ============================================================================
// Real-world Example: Plan Selection
// ============================================================================

export const PlanSelection: Story = {
  render: () => {
    const [plan, setPlan] = React.useState('pro')

    const plans = [
      {
        value: 'starter',
        name: 'Starter',
        price: '$9',
        description: 'Perfect for individuals',
        features: ['5 projects', '1GB storage', 'Email support'],
      },
      {
        value: 'pro',
        name: 'Pro',
        price: '$29',
        description: 'Best for small teams',
        features: ['Unlimited projects', '10GB storage', 'Priority support'],
        popular: true,
      },
      {
        value: 'enterprise',
        name: 'Enterprise',
        price: '$99',
        description: 'For large organizations',
        features: ['Unlimited everything', 'Custom integrations', 'Dedicated support'],
      },
    ]

    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Choose Your Plan</h3>
          <p className="text-neutral opacity-70">Select the plan that fits your needs.</p>
        </div>

        <RadioCards.Root value={plan} onValueChange={setPlan} columns={3} gap="4" color="primary" size="md">
          {plans.map(p => (
            <RadioCards.Item key={p.value} value={p.value}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-neutral opacity-70 text-sm">{p.description}</div>
                  </div>
                  {p.popular && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary-soft text-primary rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold">
                  {p.price}
                  <span className="text-sm font-normal text-neutral opacity-70">/mo</span>
                </div>
                <ul className="text-sm text-neutral opacity-70 space-y-1">
                  {p.features.map(feature => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </RadioCards.Item>
          ))}
        </RadioCards.Root>

        <div className="flex justify-between items-center p-4 bg-neutral-soft rounded-lg">
          <span className="font-medium">Selected plan:</span>
          <span className="font-bold capitalize">{plan}</span>
        </div>
      </div>
    )
  },
}
