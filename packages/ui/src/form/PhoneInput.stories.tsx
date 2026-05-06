import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Label } from './Label'
import { PhoneInput, type PhoneValue } from './PhoneInput'
import { TextField } from './TextField'

const meta: Meta<typeof PhoneInput> = {
  title: 'Form/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'PhoneInput uses TextField for the editable phone-number surface while keeping the country selector as interactive left chrome.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PhoneInput>

export const Default: Story = {
  render: args => (
    <div className="w-80">
      <PhoneInput {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Phone Number</Label>
      <PhoneInput />
    </div>
  ),
}

export const DefaultCountry: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Default US</Label>
        <PhoneInput defaultCountry="US" />
      </div>
      <div className="space-y-2">
        <Label>Default UK</Label>
        <PhoneInput defaultCountry="GB" />
      </div>
      <div className="space-y-2">
        <Label>Default Canada</Label>
        <PhoneInput defaultCountry="CA" />
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [phone, setPhone] = useState<PhoneValue>({
      countryCode: 'US',
      phoneCode: '+1',
      number: '5551234567',
      fullNumber: '+15551234567',
    })

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <PhoneInput value={phone} onChange={setPhone} />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm space-y-1">
          <p>
            <strong>Country:</strong> {phone.countryCode}
          </p>
          <p>
            <strong>Code:</strong> {phone.phoneCode}
          </p>
          <p>
            <strong>Number:</strong> {phone.number || '-'}
          </p>
          <p>
            <strong>Full:</strong> {phone.fullNumber || '-'}
          </p>
        </div>
      </div>
    )
  },
}

export const LimitedCountries: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>North America Only</Label>
      <PhoneInput countries={['US', 'CA', 'MX']} defaultCountry="US" />
      <p className="text-xs text-muted-foreground">Only US, Canada, and Mexico available</p>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Label>Size {size}</Label>
          <PhoneInput size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const).map(variant => (
        <div key={variant} className="space-y-2">
          <Label className="capitalize">{variant}</Label>
          <PhoneInput variant={variant} />
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Disabled</Label>
      <PhoneInput
        disabled
        value={{
          countryCode: 'US',
          phoneCode: '+1',
          number: '5551234567',
          fullNumber: '+15551234567',
        }}
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>With Error</Label>
      <PhoneInput error />
      <p className="text-xs text-destructive">Please enter a valid phone number</p>
    </div>
  ),
}

export const TextFieldBackedStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'State coverage for the TextField-backed phone-number editor and country selector chrome.',
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Large soft</Label>
        <PhoneInput size="lg" variant="soft" defaultCountry="CA" />
      </div>
      <div className="space-y-2">
        <Label>Error</Label>
        <PhoneInput error aria-label="Phone number with error" />
      </div>
      <div className="space-y-2">
        <Label>Disabled</Label>
        <PhoneInput
          disabled
          value={{
            countryCode: 'US',
            phoneCode: '+1',
            number: '5551234567',
            fullNumber: '+15551234567',
          }}
        />
      </div>
    </div>
  ),
}

export const ContactForm: Story = {
  render: () => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState<PhoneValue | undefined>()
    const [email, setEmail] = useState('')

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <h3 className="font-semibold text-lg">Contact Information</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Full Name</Label>
            <TextField
              id="contact-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <TextField
              id="contact-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <PhoneInput value={phone} onChange={setPhone} placeholder="(555) 123-4567" />
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
          onClick={() => alert(JSON.stringify({ name, email, phone }, null, 2))}
        >
          Submit
        </button>
      </div>
    )
  },
}
