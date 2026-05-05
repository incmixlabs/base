import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bluetooth, Laptop, Monitor, Nfc, Smartphone, Tablet, Wifi } from 'lucide-react'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { CheckboxCards } from './CheckboxCards'

const meta: Meta<typeof CheckboxCards.Root> = {
  title: 'Form/CheckboxCards',
  component: CheckboxCards.Root,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'The size of all cards',
    },
    variant: {
      control: 'select',
      options: ['surface', 'outline'],
      description: 'The visual variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'The accent color',
    },
    highContrast: {
      control: 'boolean',
      description: 'Whether to apply high-contrast styles',
    },
    columns: {
      control: 'select',
      options: ['1', '2', '3', '4', 'auto'],
      description: 'Number of columns',
    },
    gap: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
      description: 'Gap between cards',
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
    size: 'sm',
    variant: 'surface',
    color: SemanticColor.neutral,
    columns: '3',
    gap: '4',
  },
  render: args => (
    <CheckboxCards.Root
      defaultValue={['1']}
      size={args.size}
      variant={args.variant}
      color={args.color}
      highContrast={args.highContrast}
      columns={args.columns}
      gap={args.gap}
    >
      <CheckboxCards.Item value="1">
        <div className="font-medium">Option 1</div>
        <div className="text-muted-foreground">Description for option 1</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="2">
        <div className="font-medium">Option 2</div>
        <div className="text-muted-foreground">Description for option 2</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="3">
        <div className="font-medium">Option 3</div>
        <div className="text-muted-foreground">Description for option 3</div>
      </CheckboxCards.Item>
    </CheckboxCards.Root>
  ),
}

export const WithIcons: Story = {
  args: {
    size: 'sm',
    variant: 'surface',
    color: SemanticColor.neutral,
    columns: '3',
    gap: '4',
  },
  render: args => (
    <CheckboxCards.Root
      defaultValue={['wifi']}
      size={args.size}
      variant={args.variant}
      color={args.color}
      highContrast={args.highContrast}
      columns={args.columns}
      gap={args.gap}
    >
      <CheckboxCards.Item value="wifi">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span className="font-medium">Wi-Fi</span>
        </div>
        <div className="text-muted-foreground">Wireless connection</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="bluetooth">
        <div className="flex items-center gap-2">
          <Bluetooth className="h-4 w-4" />
          <span className="font-medium">Bluetooth</span>
        </div>
        <div className="text-muted-foreground">Short-range wireless</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="nfc">
        <div className="flex items-center gap-2">
          <Nfc className="h-4 w-4" />
          <span className="font-medium">NFC</span>
        </div>
        <div className="text-muted-foreground">Near-field communication</div>
      </CheckboxCards.Item>
    </CheckboxCards.Root>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">xs (Extra Small)</h3>
        <CheckboxCards.Root size="xs" columns="3" defaultValue={['a']}>
          <CheckboxCards.Item value="a">
            <div className="font-medium">Option A</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="b">
            <div className="font-medium">Option B</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="c">
            <div className="font-medium">Option C</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">sm (Small, default)</h3>
        <CheckboxCards.Root size="sm" columns="3" defaultValue={['a']}>
          <CheckboxCards.Item value="a">
            <div className="font-medium">Option A</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="b">
            <div className="font-medium">Option B</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="c">
            <div className="font-medium">Option C</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">md (Medium)</h3>
        <CheckboxCards.Root size="md" columns="3" defaultValue={['a']}>
          <CheckboxCards.Item value="a">
            <div className="font-medium">Option A</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="b">
            <div className="font-medium">Option B</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="c">
            <div className="font-medium">Option C</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">lg (Large)</h3>
        <CheckboxCards.Root size="lg" columns="3" defaultValue={['a']}>
          <CheckboxCards.Item value="a">
            <div className="font-medium">Option A</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="b">
            <div className="font-medium">Option B</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="c">
            <div className="font-medium">Option C</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>
    </Box>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const VariantSurface: Story = {
  render: () => (
    <CheckboxCards.Root variant="surface" columns="3" defaultValue={['1']}>
      <CheckboxCards.Item value="1">
        <div className="font-medium">Surface Card</div>
        <div className="text-muted-foreground">With background</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="2">
        <div className="font-medium">Surface Card</div>
        <div className="text-muted-foreground">With background</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="3">
        <div className="font-medium">Surface Card</div>
        <div className="text-muted-foreground">With background</div>
      </CheckboxCards.Item>
    </CheckboxCards.Root>
  ),
}

export const VariantOutline: Story = {
  render: () => (
    <CheckboxCards.Root variant="outline" columns="3" defaultValue={['1']}>
      <CheckboxCards.Item value="1">
        <div className="font-medium">Outline Card</div>
        <div className="text-muted-foreground">Transparent background</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="2">
        <div className="font-medium">Outline Card</div>
        <div className="text-muted-foreground">Transparent background</div>
      </CheckboxCards.Item>
      <CheckboxCards.Item value="3">
        <div className="font-medium">Outline Card</div>
        <div className="text-muted-foreground">Transparent background</div>
      </CheckboxCards.Item>
    </CheckboxCards.Root>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      {getPropDefValues(colorPropDef.color).map(color => (
        <div key={color}>
          <h3 className="text-sm font-medium mb-3 capitalize">{color}</h3>
          <CheckboxCards.Root color={color} columns="3" defaultValue={['1']}>
            <CheckboxCards.Item value="1">
              <div className="font-medium">Selected</div>
            </CheckboxCards.Item>
            <CheckboxCards.Item value="2">
              <div className="font-medium">Unselected</div>
            </CheckboxCards.Item>
            <CheckboxCards.Item value="3">
              <div className="font-medium">Unselected</div>
            </CheckboxCards.Item>
          </CheckboxCards.Root>
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
        <CheckboxCards.Root columns="1" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Full Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2">
            <div className="font-medium">Full Width</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">2 Columns</h3>
        <CheckboxCards.Root columns="2" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Half Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2">
            <div className="font-medium">Half Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="3">
            <div className="font-medium">Half Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="4">
            <div className="font-medium">Half Width</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">4 Columns</h3>
        <CheckboxCards.Root columns="4" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Quarter</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2">
            <div className="font-medium">Quarter</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="3">
            <div className="font-medium">Quarter</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="4">
            <div className="font-medium">Quarter</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Auto (minmax 200px)</h3>
        <CheckboxCards.Root columns="auto" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Auto Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2">
            <div className="font-medium">Auto Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="3">
            <div className="font-medium">Auto Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="4">
            <div className="font-medium">Auto Width</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="5">
            <div className="font-medium">Auto Width</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
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
        <CheckboxCards.Root disabled columns="3" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Disabled</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2">
            <div className="font-medium">Disabled</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="3">
            <div className="font-medium">Disabled</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Single Item Disabled</h3>
        <CheckboxCards.Root columns="3" defaultValue={['1']}>
          <CheckboxCards.Item value="1">
            <div className="font-medium">Enabled</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="2" disabled>
            <div className="font-medium">Disabled</div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="3">
            <div className="font-medium">Enabled</div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>
      </div>
    </Box>
  ),
}

// ============================================================================
// Controlled Example
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(['monitor'])

    return (
      <Box display="flex" className="flex-col gap-4">
        <CheckboxCards.Root value={values} onValueChange={setValues} columns="4" color="primary">
          <CheckboxCards.Item value="monitor">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <span className="font-medium">Desktop</span>
            </div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="laptop">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5" />
              <span className="font-medium">Laptop</span>
            </div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="tablet">
            <div className="flex items-center gap-2">
              <Tablet className="h-5 w-5" />
              <span className="font-medium">Tablet</span>
            </div>
          </CheckboxCards.Item>
          <CheckboxCards.Item value="phone">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Phone</span>
            </div>
          </CheckboxCards.Item>
        </CheckboxCards.Root>

        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium">Selected devices:</p>
          <code className="text-sm">{values.length > 0 ? values.join(', ') : 'none'}</code>
        </div>
      </Box>
    )
  },
}

// ============================================================================
// Real-world Example: Subscription Features
// ============================================================================

export const SubscriptionFeatures: Story = {
  render: () => {
    const [features, setFeatures] = React.useState<string[]>(['analytics'])

    const featureList = [
      {
        value: 'analytics',
        title: 'Advanced Analytics',
        description: 'Get detailed insights and reports',
        price: '$10/mo',
      },
      {
        value: 'support',
        title: 'Priority Support',
        description: '24/7 dedicated support team',
        price: '$15/mo',
      },
      {
        value: 'api',
        title: 'API Access',
        description: 'Full REST API integration',
        price: '$20/mo',
      },
      {
        value: 'storage',
        title: 'Extra Storage',
        description: '100GB additional cloud storage',
        price: '$5/mo',
      },
      {
        value: 'backup',
        title: 'Daily Backups',
        description: 'Automated daily data backups',
        price: '$8/mo',
      },
      {
        value: 'sso',
        title: 'SSO Integration',
        description: 'Single sign-on for your team',
        price: '$12/mo',
      },
    ]

    const total = features.reduce((sum, f) => {
      const feature = featureList.find(fl => fl.value === f)
      return sum + (feature ? parseInt(feature.price, 10) : 0)
    }, 0)

    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Add-on Features</h3>
          <p className="text-muted-foreground">Select the features you want to add to your plan.</p>
        </div>

        <CheckboxCards.Root value={features} onValueChange={setFeatures} columns="2" gap="4" color="success">
          {featureList.map(feature => (
            <CheckboxCards.Item key={feature.value} value={feature.value}>
              <div className="flex justify-between items-start w-full">
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-muted-foreground text-sm">{feature.description}</div>
                </div>
                <div className="font-semibold text-primary">{feature.price}</div>
              </div>
            </CheckboxCards.Item>
          ))}
        </CheckboxCards.Root>

        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <span className="font-medium">Monthly Total:</span>
          <span className="text-xl font-bold">${total}/mo</span>
        </div>
      </div>
    )
  },
}
