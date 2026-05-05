import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Label } from './Label'
import { LocationInput, type LocationValue } from './LocationInput'

const meta: Meta<typeof LocationInput> = {
  title: 'Form/LocationInput',
  component: LocationInput,
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
      options: ['outline', 'soft', 'ghost'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof LocationInput>

export const Default: Story = {
  render: args => (
    <div className="w-[500px]">
      <LocationInput {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label>Location</Label>
      <LocationInput />
    </div>
  ),
}

export const DefaultCountry: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label>Default to Canada</Label>
      <LocationInput defaultCountry="CA" />
    </div>
  ),
}

export const CountryOnly: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label>Country only (no state selector)</Label>
      <LocationInput showStateSelector={false} />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [location, setLocation] = useState<LocationValue>({
      country: 'United States',
      countryCode: 'US',
      state: 'California',
      stateCode: 'CA',
    })

    return (
      <div className="w-[500px] space-y-4">
        <div className="space-y-2">
          <Label>Controlled Location</Label>
          <LocationInput value={location} onChange={setLocation} />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          <p>
            <strong>Country:</strong> {location.country} ({location.countryCode})
          </p>
          <p>
            <strong>State:</strong> {location.state || 'Not selected'} ({location.stateCode || '-'})
          </p>
        </div>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Label>Size {size}</Label>
          <LocationInput size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      {(['outline', 'soft', 'ghost'] as const).map(variant => (
        <div key={variant} className="space-y-2">
          <Label className="capitalize">{variant}</Label>
          <LocationInput variant={variant} />
        </div>
      ))}
    </div>
  ),
}

export const WithCallbacks: Story = {
  render: () => {
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
      setLogs(prev => [...prev.slice(-4), message])
    }

    return (
      <div className="w-[500px] space-y-4">
        <div className="space-y-2">
          <Label>With callbacks</Label>
          <LocationInput
            onCountryChange={country => {
              if (country) addLog(`Country: ${country.name}`)
            }}
            onStateChange={state => {
              if (state) addLog(`State: ${state.name}`)
            }}
          />
        </div>
        <div className="p-3 bg-muted rounded-md text-xs font-mono space-y-1">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">Select a location to see logs</p>
          ) : (
            logs.map((log, i) => <p key={i}>{log}</p>)
          )}
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label>Disabled</Label>
      <LocationInput disabled />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label>With error</Label>
      <LocationInput error />
      <p className="text-xs text-destructive">Please select a valid location</p>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      location: {} as LocationValue,
    })

    return (
      <div className="w-[500px] p-6 border rounded-lg space-y-6">
        <h3 className="font-semibold text-lg">Shipping Address</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Country & State</Label>
            <LocationInput
              value={formData.location}
              onChange={location => setFormData(prev => ({ ...prev, location }))}
            />
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
          onClick={() => alert(JSON.stringify(formData, null, 2))}
        >
          Submit
        </button>
      </div>
    )
  },
}
