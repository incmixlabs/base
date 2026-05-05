import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar, Clock, CreditCard, Globe, Hash, Phone } from 'lucide-react'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { InputMask, maskPresets } from './InputMask'
import { Label } from './Label'

const meta: Meta<typeof InputMask> = {
  title: 'Form/InputMask',
  component: InputMask,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputMask>

// Basic phone mask
export const Default: Story = {
  render: args => (
    <div className="w-80">
      <InputMask {...args} mask="phone" placeholder="(555) 555-5555" />
    </div>
  ),
}

// Phone number with icon
export const PhoneNumber: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <InputMask id="phone" mask="phone" placeholder="(555) 555-5555" leftIcon={<Phone />} />
    </div>
  ),
}

// International phone
export const InternationalPhone: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="intl-phone">International Phone</Label>
      <InputMask id="intl-phone" mask="phoneInternational" placeholder="+1 (555) 555-5555" leftIcon={<Globe />} />
    </div>
  ),
}

// Date input
export const DateInput: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="date">Date of Birth</Label>
      <InputMask id="date" mask="date" placeholder="MM/DD/YYYY" leftIcon={<Calendar />} />
    </div>
  ),
}

// ISO Date
export const ISODate: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="iso-date">ISO Date</Label>
      <InputMask id="iso-date" mask="dateISO" placeholder="YYYY-MM-DD" leftIcon={<Calendar />} />
    </div>
  ),
}

// Time input
export const TimeInput: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="time">Time (24h)</Label>
      <InputMask id="time" mask="time" placeholder="HH:MM" leftIcon={<Clock />} />
    </div>
  ),
}

// Credit card
export const CreditCardInput: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="card">Card Number</Label>
      <InputMask id="card" mask="creditCard" placeholder="1234 5678 9012 3456" leftIcon={<CreditCard />} />
    </div>
  ),
}

// Card expiry
export const CardExpiry: Story = {
  render: () => (
    <div className="w-40 space-y-2">
      <Label htmlFor="expiry">Expiry Date</Label>
      <InputMask id="expiry" mask="expiry" placeholder="MM/YY" />
    </div>
  ),
}

// CVV
export const CVV: Story = {
  render: () => (
    <div className="w-24 space-y-2">
      <Label htmlFor="cvv">CVV</Label>
      <InputMask id="cvv" mask="cvv" placeholder="123" />
    </div>
  ),
}

// SSN
export const SSN: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="ssn">Social Security Number</Label>
      <InputMask id="ssn" mask="ssn" placeholder="123-45-6789" leftIcon={<Hash />} />
    </div>
  ),
}

// ZIP Code
export const ZipCode: Story = {
  render: () => (
    <div className="w-40 space-y-2">
      <Label htmlFor="zip">ZIP Code</Label>
      <InputMask id="zip" mask="zip" placeholder="12345" />
    </div>
  ),
}

// ZIP+4
export const ZipPlus4: Story = {
  render: () => (
    <div className="w-48 space-y-2">
      <Label htmlFor="zip4">ZIP+4</Label>
      <InputMask id="zip4" mask="zipPlus4" placeholder="12345-6789" />
    </div>
  ),
}

// IP Address
export const IPAddress: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="ip">IP Address</Label>
      <InputMask id="ip" mask="ipAddress" placeholder="192.168.1.1" leftIcon={<Globe />} />
    </div>
  ),
}

// Custom mask
export const CustomMask: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="custom">Product Code (AA-999-AA)</Label>
      <InputMask id="custom" mask="aa-999-aa" placeholder="AB-123-CD" />
      <p className="text-xs text-muted-foreground">Use 'a' for letters, '9' for digits, '*' for alphanumeric</p>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">Size {size}</p>
          <InputMask size={size} mask="phone" placeholder="(555) 555-5555" />
        </div>
      ))}
    </div>
  ),
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {(['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const).map(variant => (
        <div key={variant}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{variant}</p>
          <InputMask variant={variant} mask="phone" placeholder="(555) 555-5555" />
        </div>
      ))}
    </div>
  ),
}

// With error
export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="phone-error">Phone Number</Label>
      <InputMask id="phone-error" mask="phone" placeholder="(555) 555-5555" error leftIcon={<Phone />} />
      <p className="text-sm text-destructive">Please enter a valid phone number</p>
    </div>
  ),
}

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="phone-disabled">Phone Number</Label>
      <InputMask id="phone-disabled" mask="phone" placeholder="(555) 555-5555" disabled leftIcon={<Phone />} />
    </div>
  ),
}

// Payment form example
export const PaymentForm: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-6 border rounded-lg">
      <h3 className="font-semibold text-lg">Payment Details</h3>

      <div className="space-y-2">
        <Label htmlFor="pay-card">Card Number</Label>
        <InputMask id="pay-card" mask="creditCard" placeholder="1234 5678 9012 3456" leftIcon={<CreditCard />} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pay-expiry">Expiry</Label>
          <InputMask id="pay-expiry" mask="expiry" placeholder="MM/YY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pay-cvv">CVV</Label>
          <InputMask id="pay-cvv" mask="cvv" placeholder="123" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay-zip">Billing ZIP</Label>
        <InputMask id="pay-zip" mask="zip" placeholder="12345" />
      </div>
    </div>
  ),
}

// Human-readable placeholder examples for complex mask patterns
const presetPlaceholders: Record<string, string> = {
  phone: '(555) 555-5555',
  phoneInternational: '+1 (555) 555-5555',
  date: '12/31/2024',
  dateISO: '2024-12-31',
  time: '14:30',
  time12h: '02:30 PM',
  ssn: '123-45-6789',
  zip: '12345',
  zipPlus4: '12345-6789',
  creditCard: '4111 1111 1111 1111',
  cvv: '123',
  expiry: '12/25',
  currency: '$ 1,234',
  percentage: '50%',
  ipAddress: '192.168.1.1',
}

// All presets showcase
export const AllPresets: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <h3 className="font-semibold">Available Mask Presets</h3>
      {Object.entries(maskPresets).map(([name, pattern]) => (
        <div key={name} className="space-y-1">
          <Label htmlFor={name} className="text-xs">
            {name} <span className="text-muted-foreground">({pattern})</span>
          </Label>
          <InputMask
            id={name}
            mask={name as keyof typeof maskPresets}
            placeholder={presetPlaceholders[name] ?? pattern.replace(/9/g, '0').replace(/a/g, 'X')}
            size="sm"
          />
        </div>
      ))}
    </div>
  ),
}
